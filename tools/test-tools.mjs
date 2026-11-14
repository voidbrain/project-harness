// Behavioural tests for the copied tools (AGENTS, Checks before you finish): each test builds throwaway git
// repositories (a published template with release tags, a project with an origin) and runs the real tool from
// core/tools against them. Run with: npm run test:tools. Live ci-status is not covered here; Angular fixtures
// cover version-specific text rules with a neutral TS stub, not the real compiler/unused-export analysis.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  chmodSync,
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  existsSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const core = fileURLToPath(new URL('../core/tools/', import.meta.url));
// git without the user's config (signing, hooks, default branch) and a fixed identity
const env = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'test',
  GIT_AUTHOR_EMAIL: 'test@example.com',
  GIT_COMMITTER_NAME: 'test',
  GIT_COMMITTER_EMAIL: 'test@example.com',
};
delete env.CI;
delete env.HARNESS_HOME;
delete env.GITHUB_ACTIONS;
delete env.GITHUB_REF; // a PR's CI run sets it: check-backlog would treat every fixture as that PR
delete env.PR_NUMBER;

const git = (cwd, ...args) =>
  execFileSync('git', args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const tmp = (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'harness test ')); // a space in the path, on purpose
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
};
const write = (dir, files) => {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`);
  }
};
const run = (dir, tool, args = [], extra = {}) => {
  const r = spawnSync(process.execPath, [join(dir, 'tools', tool), ...args], {
    cwd: dir,
    env: { ...env, ...extra },
    encoding: 'utf8',
  });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};
const commitAll = (dir, message) => {
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', message);
  return git(dir, 'rev-parse', 'HEAD');
};
// a bare repository standing in for GitHub, with `dir` pushed to it and tracking it
const publish = (t, dir, branch = 'main') => {
  const remote = join(tmp(t), 'remote.git');
  git(dir, 'clone', '-q', '--bare', dir, remote);
  git(dir, 'remote', 'add', 'origin', remote);
  git(dir, 'fetch', '-q', '--tags', 'origin');
  git(dir, 'branch', '-q', `--set-upstream-to=origin/${branch}`);
  git(dir, 'remote', 'set-head', 'origin', '-a');
  return remote;
};
const lines = (changes = {}) => Array.from({ length: 10 }, (_, i) => changes[i] ?? `line ${i}`).join('\n') + '\n';

// ---------------------------------------------------------------------------------------------------- check-harness

// A template with two releases: v1.1.0 changes the first line of every file.
function template(t) {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  for (const [version, files] of [
    ['1.0.0', { 'core/tools/demo.mjs': lines(), 'core/tools/fork.mjs': lines(), 'core/AGENTS.md': 'rule A\n' }],
    [
      '1.1.0',
      {
        'core/tools/demo.mjs': lines({ 0: 'template 0' }),
        'core/tools/fork.mjs': lines({ 0: 'template 0' }),
        'core/AGENTS.md': 'rule B\n',
      },
    ],
  ]) {
    write(dir, { ...files, VERSION: `${version}\n` });
    commitAll(dir, version);
    git(dir, 'tag', '-a', `v${version}`, '-m', version);
  }
  publish(t, dir);
  return dir;
}

function project(t, home, { version = '1.1.0', files = {}, forked } = {}) {
  const dir = tmp(t);
  cpSync(join(core, 'check-harness.mjs'), join(dir, 'tools', 'check-harness.mjs'));
  write(dir, {
    '.harness.json': {
      template: { path: home },
      version,
      copied: { 'tools/demo.mjs': 'core/tools/demo.mjs' },
      ...(forked && { forked: { 'tools/fork.mjs': { from: 'core/tools/fork.mjs', ...forked } } }),
      adapted: { 'AGENTS.md': 'core/AGENTS.md' },
    },
    'tools/demo.mjs': lines({ 0: 'template 0' }),
    'AGENTS.md': 'project rules\n',
    ...files,
  });
  return dir;
}
const harness = (dir, home, args = [], extra = {}) =>
  run(dir, 'check-harness.mjs', args, { HARNESS_HOME: home, ...extra });

test('check-harness: a project on the latest release with untouched copies is quiet', (t) => {
  const home = template(t);
  const r = harness(project(t, home), home);
  assert.equal(r.code, 0);
  assert.match(r.out, /^Harness: on template v1\.1\.0; copied files match it\.\n$/);
});

// B-020: inside the template itself, an edited copy that matches its own source is unreleased work, not project drift.
test('check-harness: in the template repository, unreleased copies are named once, with no project advice', (t) => {
  const home = template(t);
  cpSync(join(core, 'check-harness.mjs'), join(home, 'tools', 'check-harness.mjs'));
  write(home, {
    '.harness.json': { version: '1.1.0', copied: { 'tools/demo.mjs': 'core/tools/demo.mjs' } },
    'core/tools/demo.mjs': lines({ 0: 'unreleased 0' }),
    'tools/demo.mjs': lines({ 0: 'unreleased 0' }),
  });
  const r = harness(home, home);
  assert.equal(r.code, 0, r.out);
  assert.doesNotMatch(r.out, /differs from template|goes back into the template|fork/);
  assert.match(r.out, /^Unreleased since v1\.1\.0 \(ships with the next release\): tools\/demo\.mjs\.$/m);
  write(home, { 'tools/demo.mjs': lines({ 0: 'stale copy 0' }) });
  assert.match(
    harness(home, home).out,
    /tools\/demo\.mjs differs from its source core\/tools\/demo\.mjs: copy it \(cp core\/tools\/demo\.mjs tools\/demo\.mjs\)\./,
  );
});

test('check-harness: a relative template path resolves from the main checkout, also in a worktree at another depth', (t) => {
  const home = template(t);
  const dir = project(t, home);
  const stamp = JSON.parse(readFileSync(join(dir, '.harness.json'), 'utf8'));
  stamp.template.path = relative(dir, home);
  write(dir, { '.harness.json': stamp });
  git(dir, 'init', '-q', '-b', 'main');
  commitAll(dir, 'project');
  const nested = join(dir, '.claude', 'worktrees', 'task');
  git(dir, 'worktree', 'add', '-q', nested);
  for (const cwd of [dir, nested]) {
    const r = run(cwd, 'check-harness.mjs');
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /on template v1\.1\.0/, cwd);
  }
});

test('check-harness: a newer release asks to copy an untouched file and reconcile an adapted one', (t) => {
  const home = template(t);
  const r = harness(
    project(t, home, {
      version: '1.0.0',
      files: {
        'tools/demo.mjs': lines(),
        'AGENTS.md': 'rules\n> Project override (harness rule: A): not A, because B.\n',
      },
    }),
    home,
  );
  assert.equal(r.code, 0);
  assert.match(r.out, /tools\/demo\.mjs: template v1\.1\.0 updated it; copy core\/tools\/demo\.mjs/);
  assert.match(r.out, /AGENTS\.md: .* reconcile by hand, keeping its 1 project override\(s\)/);
  assert.match(r.out, /Harness template v1\.1\.0 is out \(this project is on v1\.0\.0\)/);
});

test('check-harness: --strict fails only when a copied file differs or the template is missing', (t) => {
  const home = template(t);
  const dir = project(t, home);
  assert.equal(harness(dir, home, ['--strict']).code, 0, 'untouched copies on the latest release pass');
  const copied = Object.keys(JSON.parse(readFileSync(join(dir, '.harness.json'), 'utf8')).copied)[0];
  write(dir, { [copied]: `${readFileSync(join(dir, copied), 'utf8')}changed here\n` });
  const r = harness(dir, home, ['--strict']);
  assert.equal(r.code, 1);
  assert.match(r.out, /Strict: copied files do not all match/);
  assert.equal(harness(dir, home).code, 0, 'without --strict it still only warns');
  const missing = join(tmp(t), 'nowhere');
  assert.equal(
    harness(project(t, missing), missing, ['--strict'], { CI: 'true' }).code,
    1,
    'no template: nothing was checked',
  );
  assert.equal(
    harness(project(t, home, { version: '9.9.9' }), home, ['--strict']).code,
    1,
    'a version with no tag was not compared',
  );
  const broken = project(t, home);
  write(broken, { '.harness.json': '{ not json' });
  assert.equal(harness(broken, home, ['--strict']).code, 1, 'an unreadable stamp was not compared');
  const none = project(t, home);
  rmSync(join(none, '.harness.json'));
  assert.equal(harness(none, home, ['--strict']).code, 1, 'no stamp: nothing was compared');
});

test('check-harness: a copy changed only here differs; changed on both sides conflicts', (t) => {
  const home = template(t);
  assert.match(
    harness(project(t, home, { files: { 'tools/demo.mjs': lines({ 0: 'template 0', 5: 'local' }) } }), home).out,
    /tools\/demo\.mjs differs from template v1\.1\.0/,
  );
  assert.match(
    harness(project(t, home, { version: '1.0.0', files: { 'tools/demo.mjs': lines({ 5: 'local' }) } }), home).out,
    /tools\/demo\.mjs: CONFLICT/,
  );
});

test('check-harness: a fork that does not overlap the release merges cleanly, and --merge moves its base', (t) => {
  const home = template(t);
  const dir = project(t, home, {
    files: { 'tools/fork.mjs': lines({ 9: 'project 9' }) },
    forked: { base: '1.0.0', why: 'test' },
  });
  assert.match(
    harness(dir, home).out,
    /tools\/fork\.mjs: forked, and template v1\.1\.0 changed it; the merge is clean/,
  );
  const merged = harness(dir, home, ['--merge']);
  assert.match(merged.out, /merged template v1\.1\.0 cleanly; its fork base is now 1\.1\.0/);
  assert.equal(readFileSync(join(dir, 'tools/fork.mjs'), 'utf8'), lines({ 0: 'template 0', 9: 'project 9' }));
  assert.equal(JSON.parse(readFileSync(join(dir, '.harness.json'), 'utf8')).forked['tools/fork.mjs'].base, '1.1.0');
  assert.match(
    harness(dir, home).out,
    /^Harness: on template v1\.1\.0; copied files match it, 1 fork\(s\) merged up to date\.\n$/,
  );
});

test('check-harness: an overlapping fork conflicts; --merge writes markers and keeps the base', (t) => {
  const home = template(t);
  const dir = project(t, home, {
    files: { 'tools/fork.mjs': lines({ 0: 'project 0' }) },
    forked: { base: '1.0.0', why: 'test' },
  });
  assert.match(
    harness(dir, home).out,
    /tools\/fork\.mjs: forked, and template v1\.1\.0 changed it: CONFLICT in 1 place\(s\)/,
  );
  assert.match(harness(dir, home, ['--merge']).out, /merged template v1\.1\.0 with 1 conflict\(s\)/);
  assert.match(
    readFileSync(join(dir, 'tools/fork.mjs'), 'utf8'),
    /^<<<<<<< project\nproject 0\n=======\ntemplate 0\n>>>>>>> template\n/,
  );
  assert.equal(JSON.parse(readFileSync(join(dir, '.harness.json'), 'utf8')).forked['tools/fork.mjs'].base, '1.0.0');
});

test('check-harness: a fork without a reason or with an unknown base is reported', (t) => {
  const home = template(t);
  const r = harness(project(t, home, { files: { 'tools/fork.mjs': lines() }, forked: { base: '0.9.0' } }), home);
  assert.match(r.out, /forked without a reason/);
  assert.match(r.out, /at v0\.9\.0, but the template has no such tag/);
});

test('check-harness: a release tag the template lacks, a malformed stamp and a missing clone never fail', (t) => {
  const home = template(t);
  assert.match(
    harness(project(t, home, { version: '9.9.9' }), home).out,
    /names version 9\.9\.9, which the template .* has no tag for/,
  );
  const broken = project(t, home);
  write(broken, { '.harness.json': '{ not json' });
  const r = harness(broken, home);
  assert.equal(r.code, 0);
  assert.match(r.out, /\.harness\.json is not valid JSON/);
  const missing = join(tmp(t), 'nowhere');
  assert.match(harness(project(t, missing), missing).out, /^! Harness template not found at .*nowhere/m);
  assert.match(harness(project(t, missing), missing, [], { CI: 'true' }).out, /^Harness template not found/m); // CI: a note, not a warning
});

test('check-harness: an unreachable, stale or dirty template clone is reported (online first)', (t) => {
  const home = template(t);
  const dir = project(t, home);
  // behind: the published template gets a commit the clone has not pulled
  const other = tmp(t);
  git(other, 'clone', '-q', git(home, 'remote', 'get-url', 'origin'), '.');
  write(other, { 'README.md': 'new\n' });
  commitAll(other, 'later');
  git(other, 'push', '-q', 'origin', 'main');
  assert.match(harness(dir, home).out, /is 1 commit\(s\) behind its remote/);
  // dirty, then unreachable
  write(home, { 'scratch.txt': 'x\n' });
  assert.match(harness(dir, home).out, /has uncommitted changes/);
  git(home, 'remote', 'set-url', 'origin', join(tmp(t), 'gone.git'));
  assert.match(harness(dir, home).out, /Could not reach the template's remote/);
});

// -------------------------------------------------------------------------------------------------- check-freshness

// A project whose backlog was reconciled at its first commit, published to a bare origin.
function freshProject(t, { branch = 'main', stamp = {}, audit = '2026-10-29' } = {}) {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', branch);
  cpSync(join(core, 'check-freshness.mjs'), join(dir, 'tools', 'check-freshness.mjs'));
  cpSync(join(core, 'impact-map.mjs'), join(dir, 'tools', 'impact-map.mjs'));
  write(dir, {
    'src/app.txt': 'v1\n',
    [`docs/audits/${audit}.md`]: '# audit\n',
    '.harness.json': stamp,
    'docs/BACKLOG.md': 'x\n',
  });
  const sha = commitAll(dir, 'start');
  write(dir, {
    'docs/BACKLOG.md': `# Backlog\n\nCurrent work ledger, reviewed against ${branch} \`${sha.slice(0, 7)}\`.\n`,
  });
  commitAll(dir, 'Backlog: reconcile');
  publish(t, dir, branch);
  return dir;
}
const land = (dir, { branch = 'main', pr, files, squash = false }) => {
  if (squash) {
    write(dir, files);
    commitAll(dir, `Feature ${pr} (#${pr})`);
  } else {
    git(dir, 'switch', '-q', '-c', `feature-${pr}`);
    write(dir, files);
    commitAll(dir, `work for ${pr}`);
    git(dir, 'switch', '-q', branch);
    git(dir, 'merge', '-q', '--no-ff', '-m', `Merge pull request #${pr} from someone/feature-${pr}`, `feature-${pr}`);
  }
  git(dir, 'push', '-q', 'origin', branch);
};
const freshness = (dir, extra = {}) =>
  run(dir, 'check-freshness.mjs', [], {
    FRESHNESS_TODAY: '2026-10-30',
    HARNESS_HOME: join(dir, 'no-template'),
    ...extra,
  });

test('check-freshness: a reconciled project is fresh', (t) => {
  assert.match(
    freshness(freshProject(t)).out,
    /^Fresh: backlog reconciled against current main; last audit 2026-10-29 \(1 day\(s\) ago\)\.\n$/,
  );
});

test('check-freshness: merge-commit and squash merges are both found; a records-only PR is not', (t) => {
  const dir = freshProject(t);
  land(dir, { pr: 2, files: { 'src/app.txt': 'v2\n' } });
  land(dir, { pr: 3, files: { 'src/app.txt': 'v3\n' }, squash: true });
  land(dir, { pr: 4, files: { 'docs/BACKLOG.md': `${readFileSync(join(dir, 'docs/BACKLOG.md'), 'utf8')}more\n` } });
  assert.match(
    freshness(dir).out,
    /The backlog is behind main by 2 merged PR\(s\) \(#3, #2\): read their CI \(npm run ci:status -- 3 2\)/,
  );
});

test('check-freshness: reconciliation is folded into working PRs until a count or age limit makes it due', (t) => {
  const dir = freshProject(t);
  land(dir, { pr: 2, files: { 'src/app.txt': 'v2\n' } });
  const early = freshness(dir).out;
  assert.match(
    early,
    /^The backlog is behind main by 1 merged PR\(s\) \(#2\).* Not due yet: do it in your next working PR/m,
  );
  assert.match(early, /due at 10 merged PR\(s\) or 1 day\(s\) behind/);
  assert.doesNotMatch(early, /^! The backlog is behind/m, 'below both limits it is a note, not a warning');
  assert.doesNotMatch(early, /^Fresh:/m, 'and the backlog is not reported as reconciled');
  // age: the same single PR, seen a day later
  const tomorrow = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
  assert.match(freshness(dir, { FRESHNESS_TODAY: tomorrow }).out, /^! The backlog is behind main by 1 merged PR/m);
  // count: the project's own limit
  const strict = freshProject(t, { stamp: { freshness: { auditDays: 7, backlogPRs: 2 } } });
  land(strict, { pr: 3, files: { 'src/app.txt': 'v3\n' } });
  assert.doesNotMatch(freshness(strict).out, /^! The backlog is behind/m);
  land(strict, { pr: 4, files: { 'src/app.txt': 'v4\n' } });
  assert.match(freshness(strict).out, /^! The backlog is behind main by 2 merged PR\(s\) \(#4, #3\)/m);
  // a commit pushed without a PR is due at once, and a setting that is not a number falls back to the default
  const direct = freshProject(t, { stamp: { freshness: { auditDays: 7, backlogPRs: 'many', backlogDays: null } } });
  land(direct, { pr: 5, files: { 'src/app.txt': 'v5\n' } });
  assert.match(freshness(direct).out, /Not due yet.*due at 10 merged PR\(s\) or 1 day\(s\) behind/);
  write(direct, { 'src/app.txt': 'pushed\n' });
  commitAll(direct, 'direct push');
  git(direct, 'push', '-q', 'origin', 'main');
  assert.match(
    freshness(direct).out,
    /^! The backlog is behind main by 1 merged PR\(s\) \(#5\) and 1 commit\(s\) with no PR found/m,
  );
});

test('check-freshness: PRs merged on GitHub are found even when the local branch is behind', (t) => {
  const dir = freshProject(t);
  const before = git(dir, 'rev-parse', 'HEAD');
  land(dir, { pr: 5, files: { 'src/app.txt': 'v5\n' } });
  git(dir, 'reset', '-q', '--hard', before); // local main back where it was; origin/main has #5
  assert.match(freshness(dir).out, /behind main by 1 merged PR\(s\) \(#5\)/);
});

test('check-freshness: the default branch comes from the remote, and a merged branch left on it is reported', (t) => {
  const dir = freshProject(t, { branch: 'trunk' });
  git(dir, 'push', '-q', 'origin', 'trunk:leftover');
  land(dir, { branch: 'trunk', pr: 6, files: { 'src/app.txt': 'v6\n' } });
  const r = freshness(dir).out;
  assert.match(r, /behind trunk by 1 merged PR\(s\) \(#6\)/);
  assert.match(r, /Merged branches are still on the remote \(origin\/leftover\)/);
});

test('check-freshness: a commit with no PR number (rebase merge, direct push) is listed by its hash', (t) => {
  const dir = freshProject(t);
  land(dir, { pr: 7, files: { 'src/app.txt': 'v7\n' } });
  write(dir, { 'src/app.txt': 'v8\n' });
  const direct = commitAll(dir, 'Pushed straight to main').slice(0, 7);
  git(dir, 'push', '-q', 'origin', 'main');
  const r = freshness(dir).out;
  assert.match(
    r,
    new RegExp(`behind main by 1 merged PR\\(s\\) \\(#7\\) and 1 commit\\(s\\) with no PR found \\(${direct}\\)`),
  );
  assert.match(r, /review the commits without a PR \(git show <hash>\)/);
});

test('check-freshness: an unreachable origin is reported instead of "Fresh", and never fails', (t) => {
  const dir = freshProject(t);
  git(dir, 'remote', 'set-url', 'origin', join(tmp(t), 'gone.git'));
  const r = freshness(dir);
  assert.equal(r.code, 0);
  assert.match(r.out, /Could not fetch origin \(offline or no access\)/);
  assert.doesNotMatch(r.out, /^Fresh:/m);
});

test('check-freshness: a branch that changes a harness file asks project or template; project content does not', (t) => {
  const stamp = {
    copied: { 'tools/check-freshness.mjs': 'core/tools/check-freshness.mjs' },
    adapted: {
      'AGENTS.md': 'core/AGENTS.md',
      'README.md': 'core/README.md',
      'docs/BACKLOG.md': 'core/docs/BACKLOG.md',
    },
  };
  const dir = freshProject(t, { stamp });
  git(dir, 'switch', '-q', '-c', 'feature');
  write(dir, {
    'README.md': 'a feature\n',
    'src/app.txt': 'v2\n',
    'docs/BACKLOG.md': `${readFileSync(join(dir, 'docs/BACKLOG.md'), 'utf8')}\n### F-001\n`,
  });
  commitAll(dir, 'feature');
  assert.match(freshness(dir).out, /^Fresh/); // README is project content by design
  write(dir, { 'AGENTS.md': 'a new rule\n' }); // committed or not, the edit counts
  const out = freshness(dir).out;
  assert.match(out, /This branch changes harness files: AGENTS\.md \(adapted\)\. .*If unsure, ask/);
  assert.doesNotMatch(out, /README|BACKLOG/);
  assert.equal(freshness(dir).code, 0);
});

test('check-freshness: the impact map lists what must follow, then what must run again after it, in order', (t) => {
  const stamp = {
    impact: [
      {
        id: 'examples',
        when: ['tools/examples/**'],
        then: 'rebuild the examples',
        run: 'npm run examples',
        checked: 'CI',
        after: ['catalogue'],
      },
      {
        id: 'catalogue',
        when: ['library/blocks/**'],
        then: 'republish the catalogue',
        run: 'node tools/build-catalog.mjs',
        checked: 'CI',
      },
      { id: 'guide', when: ['src/tour/**'], then: 'regenerate the guide pages' },
      { id: 'never', when: ['assets/**'], then: 'never shown' },
    ],
  };
  const dir = freshProject(t, { stamp });
  git(dir, 'switch', '-q', '-c', 'feature');
  write(dir, { 'library/blocks/gate.json': '{}\n', 'src/tour/one.ts': 'x\n' });
  const out = freshness(dir).out;
  const lines = out.split('\n').filter((l) => l.includes('Impact '));
  // the catalogue first, then the examples that use it (set off through `after`), then the guide; the asset row stays quiet
  assert.match(
    lines[0],
    /Impact 1\/3 \(catalogue\): republish the catalogue \(node tools\/build-catalog\.mjs\) — library\/blocks\/gate\.json changed; checked by CI/,
  );
  assert.match(
    lines[1],
    /Impact 2\/3 \(examples\): rebuild the examples \(npm run examples\) — after catalogue; checked by CI/,
  );
  assert.match(
    lines[2],
    /Impact 3\/3 \(guide\): regenerate the guide pages — src\/tour\/one\.ts changed; nothing checks it/,
  );
  assert.doesNotMatch(out, /never shown/);
  assert.equal(freshness(dir).code, 0);
});

test('impact-map: writes the rows as a page, chains included', (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  cpSync(join(core, 'impact-map.mjs'), join(dir, 'tools', 'impact-map.mjs'));
  write(dir, {
    '.harness.json': {
      impact: [
        { id: 'a', when: ['x/**'], then: 'do A', run: 'make a' },
        { id: 'b', when: [], then: 'do B', after: ['a'], checked: 'CI' },
      ],
    },
  });
  const r = run(dir, 'impact-map.mjs');
  assert.equal(r.code, 0);
  const page = readFileSync(join(dir, 'docs/agents/impact-map.md'), 'utf8');
  assert.match(page, /\| a \| `x\/\*\*` \| {2}\| do A \| `make a` \| {2}\| nothing \|/);
  assert.match(page, /\| b \| {2}\| {2}\| do B \| {2}\| a \| CI \|/);
});

test('check-freshness: inputs set a row off like code; a changed side of a coupling names the others', (t) => {
  const stamp = {
    impact: [
      {
        id: 'film',
        when: ['src/ui/**'],
        inputs: ['library/examples/farm.json'],
        then: 're-record the film',
        run: 'npm run films',
      },
    ],
    couplings: [
      {
        value: 'film length',
        places: [
          { file: 'src/mascot.ts', what: 'LOOP' },
          { file: 'src/films.ts', what: 'FILM_S' },
        ],
        kept: 'a test',
      },
    ],
  };
  const dir = freshProject(t, { stamp });
  git(dir, 'switch', '-q', '-c', 'feature');
  write(dir, { 'library/examples/farm.json': '{}\n', 'src/mascot.ts': 'x\n' });
  const out = freshness(dir).out;
  assert.match(
    out,
    /Impact 1\/1 \(film\): re-record the film \(npm run films\) — library\/examples\/farm\.json changed/,
  );
  assert.match(
    out,
    /Coupled value "film length": src\/mascot\.ts changed; it also lives in src\/mascot\.ts \(LOOP\), src\/films\.ts \(FILM_S\): keep them equal \(kept by a test\)/,
  );
});

test('impact-map: the page lists content dependencies, value couplings and what lies outside', (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  cpSync(join(core, 'impact-map.mjs'), join(dir, 'tools', 'impact-map.mjs'));
  write(dir, {
    '.harness.json': {
      impact: [
        {
          id: 'film',
          when: ['src/**'],
          inputs: ['library/farm.json'],
          then: 're-record the film',
          run: 'npm run films',
        },
      ],
      couplings: [
        { value: 'film length', places: [{ file: 'src/a.ts', what: 'A' }, { file: 'src/b.ts' }], kept: 'a test' },
      ],
      outside: [{ what: 'renderer upgrades', affects: 'every recording', noticed: 'the audit' }],
    },
  });
  assert.equal(run(dir, 'impact-map.mjs').code, 0);
  const page = readFileSync(join(dir, 'docs/agents/impact-map.md'), 'utf8');
  assert.match(
    page,
    /## Content dependencies[\s\S]*\| re-record the film \| `library\/farm\.json` \| `npm run films` \|/,
  );
  assert.match(page, /## Value couplings[\s\S]*\| film length \| `src\/a\.ts` \(A\)<br>`src\/b\.ts` \| a test \|/);
  assert.match(page, /## Outside the repository[\s\S]*\| renderer upgrades \| every recording \| the audit \|/);
});

test("impact-map: the project's own pages are linked at the top, relative to the map", (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  cpSync(join(core, 'impact-map.mjs'), join(dir, 'tools', 'impact-map.mjs'));
  write(dir, {
    '.harness.json': {
      impact: [],
      pages: [
        { title: 'Element map', path: 'docs/agents/element-map.md', about: 'every control' },
        { title: 'Guide', path: 'docs/guide/README.md' },
      ],
    },
  });
  assert.equal(run(dir, 'impact-map.mjs').code, 0);
  const page = readFileSync(join(dir, 'docs/agents/impact-map.md'), 'utf8');
  assert.match(
    page,
    /\*\*More detail:\*\* \[Element map\]\(element-map\.md\) \(every control\) · \[Guide\]\(\.\.\/guide\/README\.md\)/,
  );
});

test('lcov-summary: Node test runner LCOV becomes the coverage summary; files outside the folders are left out, untested sources added at zero', (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  mkdirSync(join(dir, 'src', 'core'), { recursive: true });
  cpSync(join(core, 'lcov-summary.mjs'), join(dir, 'tools', 'lcov-summary.mjs'));
  writeFileSync(join(dir, 'src', 'core', 'a.ts'), 'x\n');
  writeFileSync(join(dir, 'src', 'core', 'b.ts'), '// note\nconst b = 1;\nexport { b };\n');
  writeFileSync(join(dir, 'src', 'core', 'b.test.ts'), 'test\n');
  const real = realpathSync(dir);
  write(dir, { '.harness.json': { coverage: { summary: 'coverage/coverage-summary.json', folders: ['src/core/'] } } });
  mkdirSync(join(dir, 'coverage'), { recursive: true });
  writeFileSync(
    join(dir, 'coverage', 'lcov.info'),
    `SF:${join(real, 'src/core/a.ts')}\nFNF:2\nFNH:1\nBRF:4\nBRH:3\nLF:10\nLH:8\nend_of_record\nSF:${join(real, 'test/t.ts')}\nLF:5\nLH:5\nend_of_record\n`,
  );
  assert.equal(run(dir, 'lcov-summary.mjs').code, 0);
  const s = JSON.parse(readFileSync(join(dir, 'coverage', 'coverage-summary.json'), 'utf8'));
  const a = s[join(real, 'src/core/a.ts')];
  assert.deepEqual(
    [a.lines.covered, a.lines.total, a.lines.pct, a.branches.pct, a.functions.pct, a.statements.pct],
    [8, 10, 80, 75, 50, 80],
  );
  assert.equal(s[join(real, 'test/t.ts')], undefined, 'only the coverage folders');
  const b = s[join(real, 'src/core/b.ts')];
  assert.deepEqual(
    [b.lines.covered, b.lines.total],
    [0, 2],
    'a source no test loaded counts as untested, comments not counted',
  );
  assert.ok(!Object.keys(s).some((k) => k.endsWith('b.test.ts')), 'test files are not sources');
});

test('coverage-table: a page per folder with untested files; a drop against the baseline warns, never fails', (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  cpSync(join(core, 'coverage-table.mjs'), join(dir, 'tools', 'coverage-table.mjs'));
  const m = (covered, total) => ({ total, covered, skipped: 0, pct: total ? (100 * covered) / total : 100 });
  const file = (lines, branches) => ({
    lines: m(lines, 10),
    statements: m(lines, 10),
    functions: m(lines ? 1 : 0, 1),
    branches: m(branches, 4),
  });
  const real = realpathSync(dir); // test runners write resolved paths
  const summary = (coreLines) => ({
    total: file(0, 0),
    [join(real, 'src/core/a.ts')]: file(coreLines, 4),
    [join(real, 'src/core/b.ts')]: file(10, 2),
    [join(real, 'src/ui/c.ts')]: file(0, 0),
  });
  write(dir, {
    '.harness.json': {
      coverage: { summary: 'coverage/coverage-summary.json', folders: ['src/core/', 'src/ui/'], drop: 2 },
    },
    'coverage/coverage-summary.json': summary(8),
  });
  assert.equal(run(dir, 'coverage-table.mjs', ['--write']).code, 0);
  const page = readFileSync(join(dir, 'docs/agents/coverage.md'), 'utf8');
  assert.match(page, /\| `src\/core\/` \| 2 \| 90\.0 % \| 90\.0 % \| 75\.0 % \| 100\.0 % \|/);
  assert.match(page, /\| `src\/ui\/` \| 1 \| 0\.0 % \|/);
  assert.match(page, /- `src\/ui\/`: `c\.ts`/); // a file no test runs
  write(dir, { 'coverage/coverage-summary.json': summary(4) }); // core drops from 90 % to 70 % of lines
  const r = run(dir, 'coverage-table.mjs', ['--check']);
  assert.equal(r.code, 0);
  assert.match(r.out, /! src\/core\/: lines 90\.0 % → 70\.0 % \(more than 2 points down\)/);
  assert.doesNotMatch(r.out, /src\/ui\/: lines/);
});

test('check-freshness: audit age follows freshness.auditDays', (t) => {
  assert.match(freshness(freshProject(t, { audit: '2026-10-01' })).out, /is 29 days old \(limit 7/);
  assert.match(
    freshness(freshProject(t, { audit: '2026-10-01', stamp: { freshness: { auditDays: 30 } } })).out,
    /^Fresh:/,
  );
});

test('check-freshness: estimate drift in closed steps asks for a re-estimation (F-054)', (t) => {
  const workItems = {
    enabled: true,
    layout: 'docs/work/layout.json',
    records: 'docs/work/records',
    tasks: 'docs/work/tasks',
    profiles: 'docs/agents/model-profiles.json',
    featurePlans: true,
  };
  const step = (n, status, effort) => ({
    version: 1,
    id: `F-001-T0${n}`,
    parent: 'F-001',
    title: 'Step',
    goal: 'Goal',
    status,
    acceptance: ['Done'],
    dependsOn: [],
    resources: ['src/app.txt'],
    capabilities: ['edit'],
    privacy: 'none',
    validation: ['test'],
    escalation: ['owner'],
    effort: { size: 'small', estimate: 'a day', basis: 'Fixture', reviewed: '2026-10-29', ...effort },
  });
  const project = (estimation, actual) => {
    const dir = freshProject(t, {
      stamp: { workItems: { ...workItems, ...(estimation === undefined ? {} : { estimation }) } },
    });
    cpSync(join(core, 'work-items.mjs'), join(dir, 'tools', 'work-items.mjs'));
    const files = {
      'docs/work/layout.json': { version: 1, segments: [{ text: '# Work\n\n' }, { records: 'B' }, { records: 'F' }] },
      'docs/work/records/F-001.md': '### F-001\n\nFeature\n',
      'docs/agents/model-profiles.json': { version: 1, profiles: [] },
      'docs/work/tasks/F-001-T09.json': step(9, 'planned', { days: 1 }),
    };
    for (let n = 1; n <= 5; n++)
      files[`docs/work/tasks/F-001-T0${n}.json`] = step(n, 'closed', {
        days: 0,
        baselineDays: 1,
        actualDays: actual,
        actualSource: 'measured',
      });
    write(dir, files);
    return dir;
  };
  assert.match(
    freshness(project(undefined, 2)).out,
    /^! Estimates drift from actual effort: median actual\/baseline 2 over 5 closed steps is outside 0\.67–1\.5\. Re-estimate the open steps .* Open steps: F-001-T09\.$/m,
  );
  assert.doesNotMatch(freshness(project(undefined, 1.25)).out, /Estimates drift/);
  assert.doesNotMatch(freshness(project(false, 2)).out, /Estimates drift/);
  assert.doesNotMatch(freshness(project({ since: '2026-10-30' }, 2)).out, /Estimates drift/);
  assert.match(
    freshness(project({ ratio: 'x' }, 2)).out,
    /Estimate calibration could not run: Invalid workItems\.estimation/,
  );
});

test('check-freshness: declared evaluation dependencies report pending cases and never fail the session', (t) => {
  const node = process.execPath;
  // A pending command: exits with the code in its first argument and prints the rest, one per line.
  const script = 'tools/pending.mjs';
  const pending = (code, ...cases) => [node, script, String(code), ...cases];
  const project = (evaluations) => {
    const dir = freshProject(t, { stamp: { evaluations } });
    write(dir, {
      [script]:
        'const [code, ...lines] = process.argv.slice(2); for (const l of lines) console.log(l); process.exit(Number(code));\n',
    });
    return dir;
  };
  // Nothing pending: still fresh.
  assert.match(freshness(project([{ name: 'packs', pending: pending(0) }])).out, /^Fresh:/);
  // Pending cases are listed, with the rule.
  const two = freshness(project([{ name: 'packs', pending: pending(1, 'smoke/a', 'expanded/b') }]));
  assert.equal(two.code, 0);
  assert.match(
    two.out,
    /^! Evaluation packs: 2 pending case\(s\) with no covering run: smoke\/a, expanded\/b\. Keep an open backlog record/m,
  );
  // Long lists are cut after ten.
  const many = Array.from({ length: 12 }, (_, i) => `c${i}`);
  assert.match(freshness(project([{ name: 'packs', pending: pending(1, ...many) }])).out, /c9, and 2 more\./);
  // A failing, missing or slow command is reported, not fatal.
  const broken = freshness(
    project([
      { name: 'crash', pending: pending(2) },
      { name: 'missing', pending: ['no-such-command-here'] },
      { name: 'slow', pending: [node, '-e', 'setTimeout(() => {}, 5000)'], timeoutMs: 200 },
      { name: 'bad', pending: 'npm run x' },
      { name: 'empty', pending: [] },
      { name: 'silent', pending: [node, '-e', 'console.error("ledger missing"); process.exit(1)'] },
      {
        name: 'stubborn',
        pending: [node, '-e', 'process.on("SIGTERM", () => {}); setTimeout(() => {}, 5000)'],
        timeoutMs: 200,
      },
      { name: 'negative', pending: pending(0), timeoutMs: -1 },
      { name: 'fraction', pending: pending(0), timeoutMs: 1.5 },
      { name: 'zero', pending: pending(0), timeoutMs: 0 },
    ]),
  );
  assert.match(broken.out, /^! Evaluation empty: "pending" must be a command/m);
  assert.match(
    broken.out,
    /^! Evaluation silent: its pending command .* exited 1 but listed no cases \(ledger missing\); pending cases unknown\./m,
  );
  assert.match(broken.out, /^! Evaluation stubborn: its pending command .* (could not run: ETIMEDOUT|exited SIGKILL)/m);
  for (const n of ['negative', 'fraction', 'zero'])
    assert.match(broken.out, new RegExp(`^! Evaluation ${n}: "timeoutMs" must be a whole number`, 'm'));
  // The later sections still run: the audit line is evaluated after the evaluations.
  assert.doesNotMatch(broken.out, /RangeError|ERR_OUT_OF_RANGE/);
  assert.match(freshness(project({ name: 'object' })).out, /^! "evaluations" in \.harness\.json must be an array/m);
  assert.equal(broken.code, 0);
  assert.match(broken.out, /^! Evaluation crash: its pending command .* exited 2; pending cases unknown\./m);
  assert.match(broken.out, /^! Evaluation missing: its pending command .* could not run: ENOENT/m);
  assert.match(broken.out, /^! Evaluation slow: its pending command .* (could not run: ETIMEDOUT|exited SIGTERM)/m);
  assert.match(broken.out, /^! Evaluation bad: "pending" must be a command as an array of strings/m);
});

// ---------------------------------------------------------------------------------------------------- check-backlog

test('check-backlog: the archives may grow anywhere but never lose or change a line published on the default branch', (t) => {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  const record = (id) => `### ${id}\n\nrecord ${id}\n\n---\n`;
  const archive = (...parts) => `# Archive\n\n${parts.join('\n')}`;
  write(dir, {
    'docs/BACKLOG.md': '# Backlog\n',
    'docs/archive/old.md': archive(record('F-001'), record('B-002'), '| 🔵 | a change | #1 |\n'),
  });
  commitAll(dir, 'archive');
  publish(t, dir);
  assert.match(run(dir, 'check-backlog.mjs').out, /the archives keep every line their 1 file\(s\) have on main/);
  write(dir, {
    'docs/archive/old.md': archive(
      record('F-001'),
      record('F-003'),
      record('B-002'),
      '| 🔵 | a change | #1 |\n',
      '| 🔵 | another | #2 |\n',
    ),
  });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
  write(dir, { 'docs/archive/old.md': archive(record('F-003'), '| 🔵 | a change | #1 |\n') }); // rewritten, history lost
  let r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(
    r.out,
    /old\.md: line 3 on main \(in F-001\) is changed or missing from every archive here: "### F-001"/,
  );
  // the ID and the row count stay, the evidence does not: a record's body emptied, a closed row replaced
  write(dir, { 'docs/archive/old.md': archive('### F-001\n\n---\n', record('B-002'), '| 🔵 | a change | #1 |\n') });
  r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /line 5 on main \(in F-001\) is changed or missing from every archive here: "record F-001"/);
  write(dir, { 'docs/archive/old.md': archive(record('F-001'), record('B-002'), '| 🔵 | something else | #9 |\n') });
  r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /is changed or missing from every archive here: "\| 🔵 \| a change \| #1 \|"/);
  rmSync(join(dir, 'docs/archive/old.md'));
  assert.match(
    run(dir, 'check-backlog.mjs').out,
    /old\.md: line 3 on main \(in F-001\) is changed or missing from every archive here/,
  );
  // moved to a year's archive under a new title and section headings: nothing lost, so it passes
  write(dir, {
    'docs/archive/backlog-2026.md': `# Closed backlog — 2026\n\n## Closed 2026-10-29\n\n${record('F-001')}\n${record('B-002')}\n| 🔵 | a change | #1 |\n`,
  });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
});

test("check-backlog: a record in a year's archive closed that year", (t) => {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  const record = (id, note) => `### ${id}\n\n${note}\n\n---\n`;
  write(dir, {
    'docs/BACKLOG.md': '# Backlog\n',
    'docs/archive/backlog-2026.md': `# 2026\n\n${record('F-001', 'Closed 2026-03-01: done.')}\n${record('B-002', 'Archived before dates were kept.')}`,
  });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
  write(dir, {
    'docs/archive/backlog-2026.md': `# 2026\n\n${record('F-001', 'Closed 2025-12-30, reopened. Verified and closed 2027-01-02.')}`,
  });
  const r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /backlog-2026\.md: F-001 closed in 2027; it belongs in backlog-2027\.md/);
});

test('check-backlog: a line already on the default branch may not still say "this PR"', (t) => {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  write(dir, { 'docs/BACKLOG.md': '# Backlog\n\nDone in #12.\n' });
  commitAll(dir, 'backlog');
  publish(t, dir);
  // a branch adds a line about its own PR: fine until it merges
  write(dir, { 'docs/BACKLOG.md': '# Backlog\n\nDone in #12.\n\nNew check (this PR).\n' });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
  // merged with the placeholder: the next branch that keeps the line fails until it names the PR
  commitAll(dir, 'merged');
  git(dir, 'push', '-q', 'origin', 'main');
  git(dir, 'fetch', '-q', 'origin');
  const r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /1 line\(s\) already on main still say "this PR"/);
  write(dir, { 'docs/BACKLOG.md': '# Backlog\n\nDone in #12.\n\nNew check (#13).\n' });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
  // a line that only mentions the phrase, quoted, is not a placeholder (openbando's 1.17.0 note failed every PR)
  write(dir, { 'docs/BACKLOG.md': '# Backlog\n\nThe check finds "this PR" and `this PR` left behind.\n' });
  commitAll(dir, 'a quoted mention');
  git(dir, 'push', '-q', 'origin', 'main');
  git(dir, 'fetch', '-q', 'origin');
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
  // on a PR's CI run (its number known) a placeholder the branch adds fails at once and says which number to write
  write(dir, {
    'docs/BACKLOG.md': '# Backlog\n\nThe check finds "this PR" and `this PR` left behind.\n\nFixed in this PR.\n',
  });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0); // locally, before the PR exists: fine
  const ci = run(dir, 'check-backlog.mjs', [], { GITHUB_REF: 'refs/pull/42/merge' });
  assert.notEqual(ci.code, 0);
  assert.match(ci.out, /1 line\(s\) this branch adds say "this PR": write #42 instead/);
  write(dir, {
    'docs/BACKLOG.md': '# Backlog\n\nThe check finds "this PR" and `this PR` left behind.\n\nFixed in #42.\n',
  });
  assert.equal(run(dir, 'check-backlog.mjs', [], { PR_NUMBER: '42' }).code, 0);
});

// ------------------------------------------------------------------------------------------------- merge-when-green

test('merge-when-green: merges only when every check passed and it can merge; stops on a failure or a conflict', (t) => {
  const dir = tmp(t);
  cpSync(join(core, 'merge-when-green.mjs'), join(dir, 'tools', 'merge-when-green.mjs'));
  // a fake gh: `pr view` prints pr.json, `pr merge` is logged
  write(dir, {
    'bin/gh': `#!/bin/sh\nif [ "$1" = api ]; then echo '{"data":{"repository":{"pullRequest":{"isMergeQueueEnabled":false,"isInMergeQueue":false}}}}'; exit 0; fi\nif [ "$2" = merge ]; then echo "merge $3" >> "${join(dir, 'log')}"; exit 0; fi\ncat "${join(dir, 'pr.json')}"\n`,
  });
  execFileSync('chmod', ['+x', join(dir, 'bin/gh')]);
  const PATH = `${join(dir, 'bin')}:${process.env.PATH}`;
  const pr = (mergeable, checks, extra = {}) =>
    write(dir, {
      'pr.json': { state: 'OPEN', mergeable, isDraft: false, headRefOid: 'abc', statusCheckRollup: checks, ...extra },
    });
  const ok = { name: 'check', status: 'COMPLETED', conclusion: 'SUCCESS' };
  const merged = () => {
    try {
      return readFileSync(join(dir, 'log'), 'utf8');
    } catch {
      return '';
    }
  };

  pr('MERGEABLE', [ok, { name: 'CodeQL', status: 'COMPLETED', conclusion: 'FAILURE' }]); // an optional check failing stops it
  let r = run(dir, 'merge-when-green.mjs', ['7', '--every', '0'], { PATH }); // seen twice on the same commit
  assert.equal(r.code, 3);
  assert.match(r.out, /#7: failed: CodeQL/);
  pr('CONFLICTING', [ok]);
  r = run(dir, 'merge-when-green.mjs', ['7'], { PATH });
  assert.equal(r.code, 2);
  assert.equal(merged(), '');
  pr('MERGEABLE', [
    ok,
    { context: 'legacy', state: 'SUCCESS' },
    { name: 'skipped', status: 'COMPLETED', conclusion: 'SKIPPED' },
  ]);
  r = run(dir, 'merge-when-green.mjs', ['7'], { PATH });
  assert.equal(r.code, 0, r.out);
  assert.equal(merged(), 'merge 7\n');
  pr('MERGED', [ok], { state: 'MERGED' });
  assert.match(run(dir, 'merge-when-green.mjs', ['7'], { PATH }).out, /#7: merged\n/);
  // GitHub times out twice, then answers: the watcher waits and merges; ten failures in a row give up with exit 1
  write(dir, {
    'bin/gh': `#!/bin/sh\nif [ "$1" = api ]; then echo '{"data":{"repository":{"pullRequest":{"isMergeQueueEnabled":false,"isInMergeQueue":false}}}}'; exit 0; fi\nif [ "$2" = merge ]; then echo "merge $3" >> "${join(dir, 'log')}"; exit 0; fi\nn=$(cat "${join(dir, 'n')}" 2>/dev/null || echo 0); echo $((n+1)) > "${join(dir, 'n')}"\nif [ "$n" -lt "$(cat "${join(dir, 'fail')}")" ]; then echo "TLS handshake timeout" >&2; exit 1; fi\ncat "${join(dir, 'pr.json')}"\n`,
    fail: '2',
    log: '',
  });
  pr('MERGEABLE', [ok]);
  r = run(dir, 'merge-when-green.mjs', ['8', '--every', '0'], { PATH });
  assert.equal(r.code, 0, r.out);
  assert.equal(merged(), 'merge 8\n');
  write(dir, { n: '0', fail: '99' });
  r = run(dir, 'merge-when-green.mjs', ['8', '--every', '0'], { PATH });
  assert.equal(r.code, 1);
  assert.match(r.out, /gh failed 10 times in a row: TLS handshake timeout/);
});

// ---------------------------------------------------------------------------------------------------- merge-backlog

test('merge-backlog: each record takes the side that changed it; both sides changed means by hand', (t) => {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'merge-backlog.mjs'), join(dir, 'tools', 'merge-backlog.mjs'));
  const rec = (id, body) => `### ${id}\n\n${body}\n\n---\n`;
  const doc = (head, bugs, feats, other = '') =>
    `# Backlog\n\n${head}\n\n## Bugs\n\n${bugs.join('\n')}\n## Features\n\n${feats.join('\n')}\n## Other changes\n\n${other}Older change.\n`;
  write(dir, {
    'docs/BACKLOG.md': doc(
      'Reviewed against a1.',
      [rec('B-001', 'open')],
      [rec('F-002', 'open'), rec('F-004', 'done')],
    ),
  });
  commitAll(dir, 'base');
  git(dir, 'checkout', '-q', '-b', 'work');
  // the branch: implements B-001, adds F-003 and a paragraph, moves the header, archives F-004
  write(dir, {
    'docs/BACKLOG.md': doc(
      'Reviewed against b2.',
      [rec('B-001', 'implemented')],
      [rec('F-002', 'open'), rec('F-003', 'new')],
      'Branch change.\n\n',
    ),
  });
  commitAll(dir, 'work');
  git(dir, 'checkout', '-q', 'main');
  // main: closes F-002 (still listed, edited), moves the header
  write(dir, {
    'docs/BACKLOG.md': doc(
      'Reviewed against c3.',
      [rec('B-001', 'open')],
      [rec('F-002', 'closed'), rec('F-004', 'done')],
    ),
  });
  commitAll(dir, 'main');
  git(dir, 'checkout', '-q', 'work');
  assert.throws(() => git(dir, 'merge', '-q', 'main')); // the header conflicts
  let r = run(dir, 'merge-backlog.mjs');
  assert.equal(r.code, 0, r.out);
  let out = readFileSync(join(dir, 'docs/BACKLOG.md'), 'utf8');
  assert.match(out, /Reviewed against c3\./); // the default branch's header
  assert.match(out, /### B-001\n\nimplemented/); // only the branch changed it: kept (the old helper lost this)
  assert.match(out, /### F-002\n\nclosed/); // only main changed it
  assert.match(out, /## Features\n\n### F-002[\s\S]*### F-003\n\nnew[\s\S]*## Other changes/); // in its section
  assert.match(out, /Branch change\.\n\nOlder change\./);
  assert.doesNotMatch(out, /### F-004/); // the branch archived it and main left it alone: it stays gone
  git(dir, 'merge', '--abort');
  // both sides change B-001: the default branch's stays, the record is named, exit 1
  write(dir, { 'docs/BACKLOG.md': doc('Reviewed against b2.', [rec('B-001', 'implemented')], [rec('F-002', 'open')]) });
  commitAll(dir, 'work again');
  git(dir, 'checkout', '-q', 'main');
  write(dir, {
    'docs/BACKLOG.md': doc('Reviewed against d4.', [rec('B-001', 'investigating')], [rec('F-002', 'closed')]),
  });
  commitAll(dir, 'main again');
  git(dir, 'checkout', '-q', 'work');
  assert.throws(() => git(dir, 'merge', '-q', 'main'));
  r = run(dir, 'merge-backlog.mjs');
  assert.equal(r.code, 1);
  assert.match(r.out, /Both sides changed B-001/);
  out = readFileSync(join(dir, 'docs/BACKLOG.md'), 'utf8');
  assert.match(out, /### B-001\n\ninvestigating/);
});

test('check-backlog: every record has visible recap and estimates, with long actions collapsed', (t) => {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  const valid = `### B-001\n\n**A thing**\n\n| Signal | Priority | Status | Effort |\n|:---:|---|---|---|\n| 🟡 | 🔶 P2 | Implemented | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Check the result.\n\n| | |\n|---|---|\n| **Issue** | The label is too wide. |\n| **Reproduce** | Editor, measure two points. |\n| **Check** | The label hugs its text. |\n\n<details>\n<summary>Next action and history</summary>\n\n**Next action / closure evidence:** Check it.\n\n**Estimates:** Small; implemented with browser acceptance pending.\n\n| Field | Value |\n|---|---|\n| PR / evidence | #1 |\n| Opened | 2026-10-30 |\n| Verification | Pending |\n| Reviewed | 2026-10-30 |\n\n</details>\n\n---\n`;
  const check = (content) => {
    write(dir, { 'docs/BACKLOG.md': '# Backlog\n\n' + content });
    return run(dir, 'check-backlog.mjs');
  };
  assert.equal(check(valid).code, 0);
  commitAll(dir, 'published valid record');
  publish(t, dir);
  for (const actor of [valid, valid.replace('💻', '🧑').replace('required: No', 'required: Decision')]) {
    assert.equal(check(actor).code, 0);
    for (const field of ['Issue', 'Reproduce', 'Check']) {
      const missing = actor
        .split('\n')
        .filter((l) => !l.startsWith(`| **${field}** |`))
        .join('\n');
      assert.notEqual(check(missing).code, 0, `missing ${field} must fail for either actor`);
    }
  }
  const noRecap = valid.replace(/\| \*\*Issue\*\* \|[^\n]+\n/, '');
  check(noRecap);
  commitAll(dir, 'legacy missing recap');
  git(dir, 'push', '-q', 'origin', 'main');
  assert.notEqual(check(noRecap).code, 0, 'untouched default-branch records also fail');
  for (const bad of [
    valid.replace('🟢 Small', 'Small'),
    valid.replace('| 🟢 Small |', '| 🟢 Small | ~80% |'),
    valid.replace('**Estimates:**', '**Notes:**'),
    valid.replace('**A thing**', 'A thing'),
    valid.replace('<details>', '<details open>'),
  ])
    assert.notEqual(check(bad).code, 0);
  const action = '**Next action / closure evidence:** Check it.';
  assert.notEqual(check(valid.replace(action, '').replace('<details>', action + '\n\n<details>')).code, 0);
  // F-059: the generated summary table carries Remaining, Depends on / Unlocks and the human cue; the line keeps
  // only icon and sentence. F-063: Signal merges into Status, and a record may be Very large. 8.0.0: the cue names its
  // kind (Procedure, Decision, Both or No), shown as the Procedures and Decisions cells.
  for (const kind of ['Procedure', 'Decision', 'Both'])
    assert.equal(
      check(valid.replace('💻 **→ Human action required: No**', `🧑 **→ Human action required: ${kind}**`)).code,
      0,
      kind,
    );
  const yes = check(valid.replace('💻 **→ Human action required: No**', '🧑 **→ Human action required: Yes**'));
  assert.notEqual(yes.code, 0);
  assert.match(yes.err + yes.out, /Procedure, Decision or Both \(8\.0\.0\)/);
  const generated = (cue, line, effort = '🟢 Small') =>
    valid
      .replace(
        '| Signal | Priority | Status | Effort |\n|:---:|---|---|---|',
        '| Status | Priority | Effort | Remaining | Depends on | Unlocks | Procedures | Decisions |\n|---|---|---|---|---|---|:---:|:---:|',
      )
      .replace(
        '| 🟡 | 🔶 P2 | Implemented | 🟢 Small |\n',
        `| 🟡 Implemented | 🔶 P2 | ${effort} | 2 h | — | — | ${cue} |\n`,
      )
      .replace('💻 **→ Human action required: No**<br />Check the result.', line);
  assert.equal(check(generated('— | —', '💻 **→** Check the result.')).code, 0);
  assert.equal(check(generated('— | 🧑', '🧑 **→** Decide.')).code, 0);
  assert.equal(check(generated('🧑 | —', '🧑 **→** Run the procedure.')).code, 0);
  assert.equal(check(generated('🧑 | 🧑', '🧑 **→** Run it, then decide.')).code, 0);
  assert.equal(check(generated('— | —', '💻 **→** Check.', '🟣 Very large')).code, 0);
  assert.equal(
    check(
      generated('— | —', '💻 **→** Check.')
        .replace(' Depends on | Unlocks |', '')
        .replace('---|---|---|:---:', '---|:---:')
        .replace(' — | — |', ''),
    ).code,
    0,
    'without the dependency helper the table has seven columns',
  );
  // F-068: a 💻 line may stand under 🧑 cells (a ready owner step beside agent work); the 8.0.0–8.2.0 header, Decision,
  // is still read.
  assert.equal(check(generated('🧑 | 🧑', '💻 **→** Check.')).code, 0);
  assert.equal(check(generated('— | 🧑', '💻 **→** Check.').replace('| Decisions |', '| Decision |')).code, 0);
  assert.notEqual(check(generated('— | —', '💻 **→** Check.').replace('| Decisions |', '| Decided |')).code, 0);
  assert.equal(
    check(
      generated('— | 🧑', '💻 **→** Check.')
        .replace(' Depends on | Unlocks |', '')
        .replace('---|---|---|:---:', '---|:---:')
        .replace(' — | — | — | 🧑 |', ' — | 🧑 |')
        .replace('| Decisions |', '| Decision |'),
    ).code,
    0,
    'the six-column 8.0.0 header',
  );
  for (const bad of [
    generated('— | —', '🧑 **→** Check.'),
    generated('Yes | —', '🧑 **→** Check.'),
    generated('— | —', 'Check.'),
    generated('— | —', '💻 **→** Check.').replace('| Unlocks |', '| Later |'),
    generated('— | —', '💻 **→** Check.').replace('🟡 Implemented', '🟢 Implemented'),
    generated('— | —', '💻 **→** Check.').replace('| Status |', '| Signal |'),
  ])
    assert.notEqual(check(bad).code, 0);
});

test('check-backlog: a bug or P1 record made done here names its failing-first test or review; both only warn', (t) => {
  const dir = tmp(t);
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  const record = (id, priority, evidence) =>
    `### ${id}\n\n**A thing**\n\n| Signal | Priority | Status | Effort |\n|:---:|---|---|---|\n| 🟢 | ${priority} | Verified | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Close it.\n\n| | |\n|---|---|\n| **Issue** | It broke. |\n| **Reproduce** | Run it. |\n| **Check** | It works. |\n\n<details>\n<summary>Next action and history</summary>\n\n**Next action / closure evidence:** Close it; Test: later, Review: later.\n\n**Estimates:** Small; verified.\n\n| Field | Value |\n|---|---|\n| PR / evidence | #1${evidence} |\n| Opened | 2026-11-01 |\n| Verification | Unit/integration · 2026-11-02 · passed |\n| Reviewed | 2026-11-02 |\n\n</details>\n\n---\n`;
  const check = (...records) => {
    write(dir, { 'docs/BACKLOG.md': '# Backlog\n\n' + records.join('\n') });
    return run(dir, 'check-backlog.mjs');
  };
  let r = check(record('B-001', '🔶 P2', ''), record('F-002', '🔺 P1', ''), record('F-003', '🔶 P2', ''));
  assert.equal(r.code, 0);
  assert.match(r.out, /! B-001: a done bug names its failing-first test/);
  assert.match(r.out, /! F-002: a done P1 record cites its independent review/);
  assert.doesNotMatch(r.out, /F-003/);
  r = check(
    record('B-001', '🔺 P1', '; Test: tools/test-x.mjs; Review: code-review skill, two findings fixed'),
    record('B-004', '🔶 P2', '; No test: device-only, checked by hand'),
    record('F-002', '🔺 P1', '; No review: one-line wording fix'),
  );
  assert.equal(r.code, 0);
  assert.doesNotMatch(r.out, /^! /m);
  // the bold label form counts; a placeholder does not, nor a mention outside the evidence cells (the Next action above)
  assert.doesNotMatch(check(record('B-001', '🔶 P2', '; **Test:** tools/test-x.mjs')).out, /^! /m);
  assert.match(
    check(record('B-001', '🔶 P2', '; Test: …'), record('F-002', '🔺 P1', '; Review: <how>')).out,
    /! B-001[\s\S]*! F-002/,
  );
  write(dir, { 'docs/BACKLOG.md': '# Backlog\n\n' + record('B-001', '🔶 P2', '') });
  assert.match(run(dir, 'check-backlog.mjs', [], { GITHUB_ACTIONS: 'true' }).out, /::warning title=Backlog::B-001/);
  // a record already done on the default branch was finished under older rules: not flagged
  git(dir, 'init', '-q', '-b', 'main');
  commitAll(dir, 'done before the rule');
  publish(t, dir);
  assert.doesNotMatch(run(dir, 'check-backlog.mjs').out, /^! /m);
});

test('check-backlog: an empty ledger passes; a table row of the wrong width fails', (t) => {
  const dir = tmp(t);
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  write(dir, { 'docs/BACKLOG.md': '# Backlog\n\n| A | B |\n|---|---|\n| 1 | 2 |\n' });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
  write(dir, { 'docs/BACKLOG.md': '# Backlog\n\n| A | B |\n|---|---|\n| 1 | 2 | 3 |\n' });
  const r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Table width/);
});

test('check-backlog: ## Other changes stays concise (at most 2 paragraphs and 1000 chars)', (t) => {
  const dir = tmp(t);
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  write(dir, {
    'docs/BACKLOG.md':
      '# Backlog\n\n## Other changes\n\nEarlier entries are in [Reconciliation log](archive/reconciliation-2026.md).\n\nLatest entry.\n\n## How to use this file\n',
  });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
  write(dir, {
    'docs/BACKLOG.md': '# Backlog\n\n## Other changes\n\nOne.\n\nTwo.\n\nThree.\n\n## How to use this file\n',
  });
  const tooMany = run(dir, 'check-backlog.mjs');
  assert.notEqual(tooMany.code, 0);
  assert.match(tooMany.out, /## Other changes has 3 paragraph/);
  write(dir, {
    'docs/BACKLOG.md': `# Backlog\n\n## Other changes\n\n${'x'.repeat(1001)}\n\n## How to use this file\n`,
  });
  const tooLong = run(dir, 'check-backlog.mjs');
  assert.notEqual(tooLong.code, 0);
  assert.match(tooLong.out, /1001 chars/);
});

test('merge-when-green: with a merge queue it queues without a strategy, waits for the merge, and stops if the PR leaves the queue', (t) => {
  const dir = tmp(t);
  cpSync(join(core, 'merge-when-green.mjs'), join(dir, 'tools/merge-when-green.mjs'));
  // a fake gh: `api graphql` prints queue.json, `pr merge` logs its arguments and flips the PR into the queue,
  // `pr view` prints pr.json; after.json (if present) replaces pr.json once the PR is queued
  write(dir, {
    'bin/gh': `#!/bin/sh
d="${dir}"
if [ "$1" = api ]; then cat "$d/queue.json"; exit 0; fi
if [ "$2" = merge ]; then printf '%s\\n' "$@" > "$d/merge-args"; cp "$d/queued.json" "$d/queue.json"; [ -f "$d/after.json" ] && cp "$d/after.json" "$d/pr.json"; exit 0; fi
cat "$d/pr.json"
`,
  });
  execFileSync('chmod', ['+x', join(dir, 'bin/gh')]);
  const PATH = `${join(dir, 'bin')}:${process.env.PATH}`;
  const open = {
    state: 'OPEN',
    mergeable: 'MERGEABLE',
    isDraft: false,
    headRefOid: 'h1',
    headRefName: 'b',
    statusCheckRollup: [{ status: 'COMPLETED', conclusion: 'SUCCESS' }],
  };
  const q = (inQueue) => ({
    data: { repository: { pullRequest: { isMergeQueueEnabled: true, isInMergeQueue: inQueue } } },
  });
  // queued, then merged by the queue
  write(dir, {
    'pr.json': open,
    'queue.json': q(false),
    'queued.json': q(true),
    'after.json': { ...open, state: 'MERGED' },
  });
  let r = run(dir, 'merge-when-green.mjs', ['7', '--every', '0'], { PATH });
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /#7: queued/);
  assert.match(r.out, /#7: merged/);
  const args = readFileSync(join(dir, 'merge-args'), 'utf8');
  assert.doesNotMatch(args, /--merge\n|--delete-branch/);
  assert.match(args, /--match-head-commit\nh1/);
  // queued, then removed from the queue (its merge-group checks failed): exit 4, never re-queued
  rmSync(join(dir, 'after.json'));
  write(dir, { 'pr.json': open, 'queue.json': q(false), 'queued.json': q(true) });
  writeFileSync(join(dir, 'queued.json'), JSON.stringify(q(false)));
  r = run(dir, 'merge-when-green.mjs', ['7', '--every', '0'], { PATH });
  assert.equal(r.code, 4, r.out);
  assert.match(r.out, /#7: left the merge queue/);
  // already in the queue when the run starts: watched, never queued again, and reported once GitHub merges it
  rmSync(join(dir, 'merge-args'));
  write(dir, {
    'pr.json': open,
    'queue.json': q(true),
    'bin/gh': `#!/bin/sh
d="${dir}"
if [ "$1" = api ]; then cat "$d/queue.json"; exit 0; fi
if [ "$2" = merge ]; then printf '%s\\n' "$@" > "$d/merge-args"; exit 0; fi
if [ -f "$d/seen" ]; then printf '%s' '{"state":"MERGED"}'; else touch "$d/seen"; cat "$d/pr.json"; fi
`,
  });
  r = run(dir, 'merge-when-green.mjs', ['7', '--every', '0'], { PATH });
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /#7: merged/);
  assert.equal(existsSync(join(dir, 'merge-args')), false);
});

test('merge-when-green binds the merge to the inspected head commit', (t) => {
  const dir = tmp(t);
  cpSync(join(core, 'merge-when-green.mjs'), join(dir, 'tools/merge-when-green.mjs'));
  write(dir, {
    'bin/gh': `#!/bin/sh
if [ "$1" = api ]; then echo '{"data":{"repository":{"pullRequest":{"isMergeQueueEnabled":false,"isInMergeQueue":false}}}}'; exit 0; fi
if [ "$2" = merge ]; then printf '%s\\n' "$@" > "${join(dir, 'merge-args')}"; exit 0; fi
printf '%s' '{"state":"OPEN","mergeable":"MERGEABLE","isDraft":false,"headRefOid":"inspected-head","statusCheckRollup":[{"status":"COMPLETED","conclusion":"SUCCESS"}]}'
`,
  });
  execFileSync('chmod', ['+x', join(dir, 'bin/gh')]);
  const r = run(dir, 'merge-when-green.mjs', ['7'], { PATH: `${join(dir, 'bin')}:${process.env.PATH}` });
  assert.equal(r.code, 0, r.out);
  assert.match(readFileSync(join(dir, 'merge-args'), 'utf8'), /--match-head-commit\ninspected-head/);
});

test('Angular default checks follow the installed workspace version, not a cross-major range', (t) => {
  const dir = tmp(t);
  cpSync(
    fileURLToPath(new URL('../angular/tools/check-conventions.mjs', import.meta.url)),
    join(dir, 'tools/check-conventions.mjs'),
  );
  // Isolate the text-rule boundary; a neutral TS stub exposes no AST nodes. This is not Angular compiler acceptance.
  write(dir, {
    'package.json': { dependencies: { '@angular/core': '>=18' } },
    'node_modules/typescript/index.js': `module.exports={ScriptTarget:{Latest:99},createSourceFile:()=>({statements:[]}),getModifiers:()=>[]};`,
    'src/app/sample.ts': 'const config = {standalone: true, changeDetection: ChangeDetectionStrategy.OnPush};',
  });
  let r = run(dir, 'check-conventions.mjs');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /default checks skipped/);
  for (const major of [18, 20, 21, 22]) {
    write(dir, { 'node_modules/@angular/core/package.json': { version: `${major}.0.0` } });
    r = run(dir, 'check-conventions.mjs');
    assert.equal(r.code, major >= 20 ? 1 : 0, r.out);
    assert.equal(/standalone: true is the default/.test(r.out), major >= 20, r.out);
    assert.equal(/OnPush is the default/.test(r.out), major >= 22, r.out);
  }
});

test('check-harness: merge refuses traversal, git metadata and symlink destinations before any write', (t) => {
  const home = template(t),
    dir = project(t, home),
    outside = tmp(t);
  const victim = join(outside, 'victim.mjs');
  write(outside, { 'victim.mjs': lines({ 9: 'project 9' }) });
  symlinkSync(victim, join(dir, 'linked.mjs'));
  write(dir, { '.git/config': lines({ 9: 'project 9' }) });
  symlinkSync(join(dir, '.git/config'), join(dir, 'git-alias.mjs'));
  for (const path of [
    '../' + outside.split('/').at(-1) + '/victim.mjs',
    '.git/config',
    'linked.mjs',
    'git-alias.mjs',
  ]) {
    const config = JSON.parse(readFileSync(join(dir, '.harness.json'), 'utf8'));
    config.forked = { [path]: { from: 'core/tools/fork.mjs', base: '1.0.0', why: 'fixture' } };
    write(dir, { '.harness.json': config });
    const before = readFileSync(join(dir, '.harness.json'), 'utf8');
    const result = harness(dir, home, ['--merge']);
    assert.match(result.out, /Unsafe project path/);
    assert.equal(readFileSync(victim, 'utf8'), lines({ 9: 'project 9' }));
    assert.equal(readFileSync(join(dir, '.git/config'), 'utf8'), lines({ 9: 'project 9' }));
    assert.equal(readFileSync(join(dir, '.harness.json'), 'utf8'), before);
  }
});

test('gitignore: node_modules is ignored when it is a symlink, as in a git worktree', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'harness-gitignore-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q');
  cpSync(fileURLToPath(new URL('../core/gitignore.txt', import.meta.url)), join(dir, '.gitignore'));
  mkdirSync(join(dir, 'shared-modules'));
  symlinkSync('shared-modules', join(dir, 'node_modules'));
  const r = spawnSync('git', ['check-ignore', '-q', 'node_modules'], { cwd: dir, env });
  assert.equal(r.status, 0, 'a node_modules symlink must be ignored, or `git add -A` commits it');
});

// -------------------------------------------------------------------------------------------------- quiet outputs (F-077-T01)

// A stand-in for gh: PR 1 is green, PR 2 has a failed job. No network.
function fakeGh(dir) {
  const bin = join(dir, 'bin', 'gh');
  write(dir, {
    'bin/gh': `#!${process.execPath}
const a = process.argv.slice(2);
const out = (v) => process.stdout.write(JSON.stringify(v));
if (a[0] === 'pr' && a[1] === 'view') {
  const n = Number(a[2]);
  out({ number: n, title: 'Change ' + n, state: 'MERGED', baseRefName: 'main', headRefOid: 'sha' + n, mergedAt: '2026-10-30T00:00:00Z', url: 'https://example.invalid/pr/' + n });
} else if (a[0] === 'run' && a[1] === 'list') {
  const n = a[a.indexOf('--commit') + 1].slice(3);
  out([{ databaseId: Number(n), status: 'completed', conclusion: n === '1' ? 'success' : 'failure', url: 'https://example.invalid/run/' + n }]);
} else if (a[0] === 'run' && a[1] === 'view') {
  out({ jobs: [{ name: 'check', status: 'completed', conclusion: a[2] === '1' ? 'success' : 'failure', databaseId: 9 }] });
} else process.exit(1);
`,
  });
  chmodSync(bin, 0o755);
  return { PATH: `${join(dir, 'bin')}:${env.PATH}` };
}

test('ci-status: a green PR is one line, a failing one is printed in full, then one summary line', (t) => {
  const dir = tmp(t);
  cpSync(join(core, 'ci-status.mjs'), join(dir, 'tools', 'ci-status.mjs'));
  write(dir, { '.harness.json': JSON.stringify({ defaultBranch: 'main' }) });
  const path = fakeGh(dir);
  const quiet = run(dir, 'ci-status.mjs', ['1', '2'], path);
  assert.equal(quiet.code, 0, quiet.out);
  assert.match(quiet.out, /^#1 merged, CI success: Change 1\n/);
  assert.doesNotMatch(quiet.out, /example\.invalid\/run\/1/, 'the green PR shows no job detail');
  assert.match(
    quiet.out,
    /#2 Change 2\n {2}merged into main.*\n {2}CI failure · https:\/\/example\.invalid\/run\/2\n {4}failure +check/,
  );
  assert.match(quiet.out, /2 PR\(s\): 1 green, 1 to look at \(--verbose for every job\)\.\n$/);
  const verbose = run(dir, 'ci-status.mjs', ['1', '2', '--verbose'], path);
  assert.match(verbose.out, /#1 Change 1\n.*\n {2}CI success · https:\/\/example\.invalid\/run\/1\n {4}success +check/);
  assert.match(verbose.out, /2 PR\(s\): 1 green, 1 to look at\.\n$/);
});

test('check-freshness: maintenance evidence is one line unless --verbose; a failure prints in full', (t) => {
  const dir = freshProject(t, { stamp: { maintenance: { enabled: true } } });
  const stub = (body) => write(dir, { 'tools/maintenance.mjs': body });
  stub(
    `console.log(JSON.stringify({ enabled: true, candidates: [], reviewed: '2026-10-29T10:00:00Z', outcomes: [{}, {}], note: 'n' }, null, 2));`,
  );
  const quiet = freshness(dir);
  assert.equal(quiet.code, 0, quiet.out);
  assert.match(
    quiet.out,
    /^Fresh: .*\nMaintenance evidence: current, reviewed 2026-10-29; 2 outcome\(s\), 0 candidate\(s\)\.\n$/,
  );
  const verbose = run(dir, 'check-freshness.mjs', ['--verbose'], {
    FRESHNESS_TODAY: '2026-10-30',
    HARNESS_HOME: join(dir, 'no-template'),
  });
  assert.match(verbose.out, /"outcomes": \[/);
  stub(`console.log('evidence detail'); console.error('stale review'); process.exit(3);`);
  const failed = freshness(dir);
  assert.equal(failed.code, 3);
  assert.match(failed.out, /evidence detail/);
  assert.match(failed.out, /stale review/);
  assert.match(failed.out, /Required maintenance review failed/);
});

test('check-backlog: a record over its size budget is a warning, measured on its source when there is one', (t) => {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  const ledger = readFileSync(fileURLToPath(new URL('../docs/BACKLOG.md', import.meta.url)), 'utf8');
  const ids = [...ledger.matchAll(/^### (?:<a id="[fb]-\d+"><\/a>)?(?:\[(?:✨|🐞) )?([BF]-\d+)/gm)].map((m) => m[1]);
  write(dir, {
    'docs/BACKLOG.md': ledger,
    '.harness.json': JSON.stringify({ rules: { budgets: { record: 100000 } } }),
  });
  commitAll(dir, 'ledger');
  publish(t, dir);
  const warned = () =>
    run(dir, 'check-backlog.mjs').out.match(/^! [BF]-\d+: about [\d,]+ tokens, over the [\d,]+-token/gm) ?? [];
  assert.equal(warned().length, 0, 'a large budget holds this ledger');
  write(dir, { '.harness.json': JSON.stringify({ rules: { budgets: { record: 10 } } }) });
  assert.equal(warned().length, ids.length, 'every ledger block passes a 10-token budget');
  write(dir, {
    '.harness.json': '{}',
    ...Object.fromEntries(ids.map((id) => [`docs/work/records/${id}.md`, `### ${id}\n\nShort source.\n`])),
    [`docs/work/records/${ids[0]}.md`]: `### ${ids[0]}\n\n${'Dated evidence line. '.repeat(400)}\n`,
  });
  const r = run(dir, 'check-backlog.mjs');
  assert.equal(r.code, 0, r.out);
  assert.match(
    r.out,
    new RegExp(
      `^! ${ids[0]}: about 2,1\\d\\d tokens, over the 1,500-token record budget \\(rules\\.budgets\\.record\\): move evidence older than the last reconciliation to docs/archive/evidence-<year>\\.md`,
      'm',
    ),
  );
  assert.equal(warned().length, 1, 'only the oversized source');
});

// -------------------------------------------------------------------------------------------------- reconcile-draft (F-077-T03)

test('reconcile-draft: flags only failed CI, unnamed PRs and commits without a PR, then drafts the entry', (t) => {
  const dir = freshProject(t);
  cpSync(join(core, 'reconcile-draft.mjs'), join(dir, 'tools', 'reconcile-draft.mjs'));
  land(dir, { pr: 2, files: { 'src/a.txt': 'a\n' } });
  land(dir, { pr: 3, files: { 'src/b.txt': 'b\n' }, squash: true });
  land(dir, { pr: 4, files: { 'src/c.txt': 'c\n' } });
  land(dir, { pr: 5, files: { 'docs/archive/reconciliation-2026.md': 'only records\n' } });
  write(dir, { 'src/d.txt': 'direct\n' });
  commitAll(dir, 'direct push');
  git(dir, 'push', '-q', 'origin', 'main');
  write(dir, {
    'docs/work/records/F-001.md': '### F-001\n\n[PR #2](https://github.com/fixture-owner/fixture-repo/pull/2)\n',
    'docs/work/records/F-002.md':
      '### F-002\n\nSee #20 and #200, not the PR above; https://github.com/someone/other/pull/4 and other/repo#4 are another repository.\n',
    'docs/archive/backlog-2026.md': '# Archive\n\n### B-001\n\nFixed in #3.\n',
  });
  write(dir, {
    'bin/gh': `#!${process.execPath}
const a = process.argv.slice(2);
if (a[0] === '--version') { console.log('gh version fixture'); process.exit(0); }
if (a[0] !== 'pr') process.exit(1);
const n = a[2];
const rollup = n === '3' ? [{ conclusion: 'SUCCESS' }, { conclusion: 'FAILURE' }] : [{ conclusion: 'SUCCESS' }, { state: 'SUCCESS' }];
process.stdout.write(JSON.stringify({ title: 'Change ' + n, statusCheckRollup: rollup }));
`,
  });
  chmodSync(join(dir, 'bin', 'gh'), 0o755);
  git(dir, 'remote', 'set-url', 'origin', 'https://github.com/fixture-owner/fixture-repo.git');
  const r = run(dir, 'reconcile-draft.mjs', [], { PATH: `${join(dir, 'bin')}:${env.PATH}` });
  assert.equal(r.code, 0, r.out);
  const lines = r.out.split('\n');
  assert.deepEqual(
    lines.filter((l) => l.startsWith('!')),
    [
      '! #3 CI failed: Change 3 (npm run ci:status -- 3).',
      '! #4 is named by no record: add it to the record it changed, or say why none.',
      `! ${git(dir, 'rev-parse', '--short=7', 'HEAD')} reached main with no PR: review it (git show ${git(dir, 'rev-parse', '--short=7', 'HEAD')}).`,
    ],
  );
  assert.doesNotMatch(r.out, /#5/, 'a records-only PR needs no reconciling');
  assert.match(r.out, /PRs #2, #3, #4 merged; 2 of 3 on green CI\. #2: F-001; #3: B-001; #4: no record\./);
  assert.match(r.out, /Then move the backlog header to main `[0-9a-f]{7}`\./);
});

test('reconcile-draft: a reconciled backlog has nothing to draft', (t) => {
  const dir = freshProject(t);
  cpSync(join(core, 'reconcile-draft.mjs'), join(dir, 'tools', 'reconcile-draft.mjs'));
  const r = run(dir, 'reconcile-draft.mjs');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /^Nothing merged since `[0-9a-f]{7}` needs reconciling\.\n$/);
});

test('check-freshness: each maintenance candidate is named in full (release review)', (t) => {
  const dir = freshProject(t, { stamp: { maintenance: { enabled: true } } });
  write(dir, {
    'tools/maintenance.mjs': `console.log(JSON.stringify({ enabled: true, reviewed: '2026-10-29T10:00:00Z', outcomes: [], candidates: [{ operation: 'reconciliation', kind: 'tool', reason: 'Observed manual conflicts: inspect reconciliation tooling.' }] }));`,
  });
  const r = freshness(dir);
  assert.equal(r.code, 0, r.out);
  assert.match(
    r.out,
    /^! Maintenance candidate \(reconciliation, tool\): Observed manual conflicts: inspect reconciliation tooling\.$/m,
  );
});
