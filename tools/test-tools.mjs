// Behavioural tests for the copied tools (AGENTS, Checks before you finish): each test builds throwaway git
// repositories (a published template with release tags, a project with an origin) and runs the real tool from
// core/tools against them. Run with: npm run test:tools. ci-status (needs GitHub) and check-conventions (needs a
// project's TypeScript) are not covered here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const core = fileURLToPath(new URL('../core/tools/', import.meta.url));
// git without the user's config (signing, hooks, default branch) and a fixed identity
const env = {
  ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'test', GIT_AUTHOR_EMAIL: 'test@example.com', GIT_COMMITTER_NAME: 'test', GIT_COMMITTER_EMAIL: 'test@example.com',
};
delete env.CI;
delete env.HARNESS_HOME;
delete env.GITHUB_ACTIONS;

const git = (cwd, ...args) => execFileSync('git', args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const tmp = (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'harness test '));  // a space in the path, on purpose
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
  const r = spawnSync(process.execPath, [join(dir, 'tools', tool), ...args], { cwd: dir, env: { ...env, ...extra }, encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};
const commitAll = (dir, message) => { git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', message); return git(dir, 'rev-parse', 'HEAD'); };
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
    ['1.1.0', { 'core/tools/demo.mjs': lines({ 0: 'template 0' }), 'core/tools/fork.mjs': lines({ 0: 'template 0' }), 'core/AGENTS.md': 'rule B\n' }],
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
      template: { path: home }, version,
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
const harness = (dir, home, args = [], extra = {}) => run(dir, 'check-harness.mjs', args, { HARNESS_HOME: home, ...extra });

test('check-harness: a project on the latest release with untouched copies is quiet', (t) => {
  const home = template(t);
  const r = harness(project(t, home), home);
  assert.equal(r.code, 0);
  assert.match(r.out, /^Harness: on template v1\.1\.0; copied files match it\.\n$/);
});

test('check-harness: a newer release asks to copy an untouched file and reconcile an adapted one', (t) => {
  const home = template(t);
  const r = harness(project(t, home, { version: '1.0.0', files: { 'tools/demo.mjs': lines(), 'AGENTS.md': 'rules\n> Project override (harness rule: A): not A, because B.\n' } }), home);
  assert.equal(r.code, 0);
  assert.match(r.out, /tools\/demo\.mjs: template v1\.1\.0 updated it; copy core\/tools\/demo\.mjs/);
  assert.match(r.out, /AGENTS\.md: .* reconcile by hand, keeping its 1 project override\(s\)/);
  assert.match(r.out, /Harness template v1\.1\.0 is out \(this project is on v1\.0\.0\)/);
});

test('check-harness: a copy changed only here differs; changed on both sides conflicts', (t) => {
  const home = template(t);
  assert.match(harness(project(t, home, { files: { 'tools/demo.mjs': lines({ 0: 'template 0', 5: 'local' }) } }), home).out, /tools\/demo\.mjs differs from template v1\.1\.0/);
  assert.match(harness(project(t, home, { version: '1.0.0', files: { 'tools/demo.mjs': lines({ 5: 'local' }) } }), home).out, /tools\/demo\.mjs: CONFLICT/);
});

test('check-harness: a fork that does not overlap the release merges cleanly, and --merge moves its base', (t) => {
  const home = template(t);
  const dir = project(t, home, { files: { 'tools/fork.mjs': lines({ 9: 'project 9' }) }, forked: { base: '1.0.0', why: 'test' } });
  assert.match(harness(dir, home).out, /tools\/fork\.mjs: forked, and template v1\.1\.0 changed it; the merge is clean/);
  const merged = harness(dir, home, ['--merge']);
  assert.match(merged.out, /merged template v1\.1\.0 cleanly; its fork base is now 1\.1\.0/);
  assert.equal(readFileSync(join(dir, 'tools/fork.mjs'), 'utf8'), lines({ 0: 'template 0', 9: 'project 9' }));
  assert.equal(JSON.parse(readFileSync(join(dir, '.harness.json'), 'utf8')).forked['tools/fork.mjs'].base, '1.1.0');
  assert.match(harness(dir, home).out, /^Harness: on template v1\.1\.0; copied files match it, 1 fork\(s\) merged up to date\.\n$/);
});

test('check-harness: an overlapping fork conflicts; --merge writes markers and keeps the base', (t) => {
  const home = template(t);
  const dir = project(t, home, { files: { 'tools/fork.mjs': lines({ 0: 'project 0' }) }, forked: { base: '1.0.0', why: 'test' } });
  assert.match(harness(dir, home).out, /tools\/fork\.mjs: forked, and template v1\.1\.0 changed it: CONFLICT in 1 place\(s\)/);
  assert.match(harness(dir, home, ['--merge']).out, /merged template v1\.1\.0 with 1 conflict\(s\)/);
  assert.match(readFileSync(join(dir, 'tools/fork.mjs'), 'utf8'), /^<<<<<<< project\nproject 0\n=======\ntemplate 0\n>>>>>>> template\n/);
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
  assert.match(harness(project(t, home, { version: '9.9.9' }), home).out, /names version 9\.9\.9, which the template .* has no tag for/);
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
  write(dir, { 'src/app.txt': 'v1\n', [`docs/audits/${audit}.md`]: '# audit\n', '.harness.json': stamp, 'docs/BACKLOG.md': 'x\n' });
  const sha = commitAll(dir, 'start');
  write(dir, { 'docs/BACKLOG.md': `# Backlog\n\nCurrent work ledger, reviewed against ${branch} \`${sha.slice(0, 7)}\`.\n` });
  commitAll(dir, 'Backlog: reconcile');
  publish(t, dir, branch);
  return dir;
}
const land = (dir, { branch = 'main', pr, files, squash = false }) => {
  if (squash) { write(dir, files); commitAll(dir, `Feature ${pr} (#${pr})`); }
  else {
    git(dir, 'switch', '-q', '-c', `feature-${pr}`);
    write(dir, files);
    commitAll(dir, `work for ${pr}`);
    git(dir, 'switch', '-q', branch);
    git(dir, 'merge', '-q', '--no-ff', '-m', `Merge pull request #${pr} from someone/feature-${pr}`, `feature-${pr}`);
  }
  git(dir, 'push', '-q', 'origin', branch);
};
const freshness = (dir, extra = {}) => run(dir, 'check-freshness.mjs', [], { FRESHNESS_TODAY: '2026-10-30', HARNESS_HOME: join(dir, 'no-template'), ...extra });

test('check-freshness: a reconciled project is fresh', (t) => {
  assert.match(freshness(freshProject(t)).out, /^Fresh: backlog reconciled against current main; last audit 2026-10-29 \(1 day\(s\) ago\)\.\n$/);
});

test('check-freshness: merge-commit and squash merges are both found; a records-only PR is not', (t) => {
  const dir = freshProject(t);
  land(dir, { pr: 2, files: { 'src/app.txt': 'v2\n' } });
  land(dir, { pr: 3, files: { 'src/app.txt': 'v3\n' }, squash: true });
  land(dir, { pr: 4, files: { 'docs/BACKLOG.md': `${readFileSync(join(dir, 'docs/BACKLOG.md'), 'utf8')}more\n` } });
  assert.match(freshness(dir).out, /The backlog is behind main by 2 merged PR\(s\) \(#3, #2\): read their CI \(npm run ci:status -- 3 2\)/);
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
  assert.match(r, new RegExp(`behind main by 1 merged PR\\(s\\) \\(#7\\) and 1 commit\\(s\\) with no PR found \\(${direct}\\)`));
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
  const stamp = { copied: { 'tools/check-freshness.mjs': 'core/tools/check-freshness.mjs' }, adapted: { 'AGENTS.md': 'core/AGENTS.md', 'README.md': 'core/README.md', 'docs/BACKLOG.md': 'core/docs/BACKLOG.md' } };
  const dir = freshProject(t, { stamp });
  git(dir, 'switch', '-q', '-c', 'feature');
  write(dir, { 'README.md': 'a feature\n', 'src/app.txt': 'v2\n', 'docs/BACKLOG.md': `${readFileSync(join(dir, 'docs/BACKLOG.md'), 'utf8')}\n### F-001\n` });
  commitAll(dir, 'feature');
  assert.match(freshness(dir).out, /^Fresh/); // README is project content by design
  write(dir, { 'AGENTS.md': 'a new rule\n' }); // committed or not, the edit counts
  const out = freshness(dir).out;
  assert.match(out, /This branch changes harness files: AGENTS\.md \(adapted\)\. .*If unsure, ask/);
  assert.doesNotMatch(out, /README|BACKLOG/);
  assert.equal(freshness(dir).code, 0);
});

test('check-freshness: the impact map lists what must follow, then what must run again after it, in order', (t) => {
  const stamp = { impact: [
    { id: 'examples', when: ['tools/examples/**'], then: 'rebuild the examples', run: 'npm run examples', checked: 'CI', after: ['catalogue'] },
    { id: 'catalogue', when: ['library/blocks/**'], then: 'republish the catalogue', run: 'node tools/build-catalog.mjs', checked: 'CI' },
    { id: 'guide', when: ['src/tour/**'], then: 'regenerate the guide pages' },
    { id: 'never', when: ['assets/**'], then: 'never shown' },
  ] };
  const dir = freshProject(t, { stamp });
  git(dir, 'switch', '-q', '-c', 'feature');
  write(dir, { 'library/blocks/gate.json': '{}\n', 'src/tour/one.ts': 'x\n' });
  const out = freshness(dir).out;
  const lines = out.split('\n').filter((l) => l.includes('Impact '));
  // the catalogue first, then the examples that use it (set off through `after`), then the guide; the asset row stays quiet
  assert.match(lines[0], /Impact 1\/3 \(catalogue\): republish the catalogue \(node tools\/build-catalog\.mjs\) — library\/blocks\/gate\.json changed; checked by CI/);
  assert.match(lines[1], /Impact 2\/3 \(examples\): rebuild the examples \(npm run examples\) — after catalogue; checked by CI/);
  assert.match(lines[2], /Impact 3\/3 \(guide\): regenerate the guide pages — src\/tour\/one\.ts changed; nothing checks it/);
  assert.doesNotMatch(out, /never shown/);
  assert.equal(freshness(dir).code, 0);
});

test('impact-map: writes the rows as a page, chains included', (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  cpSync(join(core, 'impact-map.mjs'), join(dir, 'tools', 'impact-map.mjs'));
  write(dir, { '.harness.json': { impact: [{ id: 'a', when: ['x/**'], then: 'do A', run: 'make a' }, { id: 'b', when: [], then: 'do B', after: ['a'], checked: 'CI' }] } });
  const r = run(dir, 'impact-map.mjs');
  assert.equal(r.code, 0);
  const page = readFileSync(join(dir, 'docs/agents/impact-map.md'), 'utf8');
  assert.match(page, /\| a \| `x\/\*\*` \|  \| do A \| `make a` \|  \| nothing \|/);
  assert.match(page, /\| b \|  \|  \| do B \|  \| a \| CI \|/);
});

test('check-freshness: inputs set a row off like code; a changed side of a coupling names the others', (t) => {
  const stamp = {
    impact: [{ id: 'film', when: ['src/ui/**'], inputs: ['library/examples/farm.json'], then: 're-record the film', run: 'npm run films' }],
    couplings: [{ value: 'film length', places: [{ file: 'src/mascot.ts', what: 'LOOP' }, { file: 'src/films.ts', what: 'FILM_S' }], kept: 'a test' }],
  };
  const dir = freshProject(t, { stamp });
  git(dir, 'switch', '-q', '-c', 'feature');
  write(dir, { 'library/examples/farm.json': '{}\n', 'src/mascot.ts': 'x\n' });
  const out = freshness(dir).out;
  assert.match(out, /Impact 1\/1 \(film\): re-record the film \(npm run films\) — library\/examples\/farm\.json changed/);
  assert.match(out, /Coupled value "film length": src\/mascot\.ts changed; it also lives in src\/mascot\.ts \(LOOP\), src\/films\.ts \(FILM_S\): keep them equal \(kept by a test\)/);
});

test('impact-map: the page lists content dependencies, value couplings and what lies outside', (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  cpSync(join(core, 'impact-map.mjs'), join(dir, 'tools', 'impact-map.mjs'));
  write(dir, { '.harness.json': {
    impact: [{ id: 'film', when: ['src/**'], inputs: ['library/farm.json'], then: 're-record the film', run: 'npm run films' }],
    couplings: [{ value: 'film length', places: [{ file: 'src/a.ts', what: 'A' }, { file: 'src/b.ts' }], kept: 'a test' }],
    outside: [{ what: 'renderer upgrades', affects: 'every recording', noticed: 'the audit' }],
  } });
  assert.equal(run(dir, 'impact-map.mjs').code, 0);
  const page = readFileSync(join(dir, 'docs/agents/impact-map.md'), 'utf8');
  assert.match(page, /## Content dependencies[\s\S]*\| re-record the film \| `library\/farm\.json` \| `npm run films` \|/);
  assert.match(page, /## Value couplings[\s\S]*\| film length \| `src\/a\.ts` \(A\)<br>`src\/b\.ts` \| a test \|/);
  assert.match(page, /## Outside the repository[\s\S]*\| renderer upgrades \| every recording \| the audit \|/);
});

test('impact-map: the project\'s own pages are linked at the top, relative to the map', (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  cpSync(join(core, 'impact-map.mjs'), join(dir, 'tools', 'impact-map.mjs'));
  write(dir, { '.harness.json': { impact: [], pages: [{ title: 'Element map', path: 'docs/agents/element-map.md', about: 'every control' }, { title: 'Guide', path: 'docs/guide/README.md' }] } });
  assert.equal(run(dir, 'impact-map.mjs').code, 0);
  const page = readFileSync(join(dir, 'docs/agents/impact-map.md'), 'utf8');
  assert.match(page, /\*\*More detail:\*\* \[Element map\]\(element-map\.md\) \(every control\) · \[Guide\]\(\.\.\/guide\/README\.md\)/);
});

test('coverage-table: a page per folder with untested files; a drop against the baseline warns, never fails', (t) => {
  const dir = tmp(t);
  mkdirSync(join(dir, 'tools'), { recursive: true });
  cpSync(join(core, 'coverage-table.mjs'), join(dir, 'tools', 'coverage-table.mjs'));
  const m = (covered, total) => ({ total, covered, skipped: 0, pct: total ? (100 * covered) / total : 100 });
  const file = (lines, branches) => ({ lines: m(lines, 10), statements: m(lines, 10), functions: m(lines ? 1 : 0, 1), branches: m(branches, 4) });
  const real = realpathSync(dir); // test runners write resolved paths
  const summary = (coreLines) => ({ total: file(0, 0), [join(real, 'src/core/a.ts')]: file(coreLines, 4), [join(real, 'src/core/b.ts')]: file(10, 2), [join(real, 'src/ui/c.ts')]: file(0, 0) });
  write(dir, { '.harness.json': { coverage: { summary: 'coverage/coverage-summary.json', folders: ['src/core/', 'src/ui/'], drop: 2 } }, 'coverage/coverage-summary.json': summary(8) });
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
  assert.match(freshness(freshProject(t, { audit: '2026-10-01', stamp: { freshness: { auditDays: 30 } } })).out, /^Fresh:/);
});

// ---------------------------------------------------------------------------------------------------- check-backlog

test('check-backlog: an archive may grow anywhere but never lose or change a line published on the default branch', (t) => {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'check-backlog.mjs'), join(dir, 'tools', 'check-backlog.mjs'));
  const record = (id) => `### ${id}\n\nrecord ${id}\n\n---\n`;
  const archive = (...parts) => `# Archive\n\n${parts.join('\n')}`;
  write(dir, { 'docs/BACKLOG.md': '# Backlog\n', 'docs/archive/old.md': archive(record('F-001'), record('B-002'), '| 🔵 | a change | #1 |\n') });
  commitAll(dir, 'archive');
  publish(t, dir);
  assert.match(run(dir, 'check-backlog.mjs').out, /1 archive file\(s\) keep every line they have on main/);
  write(dir, { 'docs/archive/old.md': archive(record('F-001'), record('F-003'), record('B-002'), '| 🔵 | a change | #1 |\n', '| 🔵 | another | #2 |\n') });
  assert.equal(run(dir, 'check-backlog.mjs').code, 0);
  write(dir, { 'docs/archive/old.md': archive(record('F-003'), '| 🔵 | a change | #1 |\n') }); // rewritten, history lost
  let r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /old\.md: line 3 on main \(in F-001\) is changed or missing here: "### F-001"/);
  // the ID and the row count stay, the evidence does not: a record's body emptied, a closed row replaced
  write(dir, { 'docs/archive/old.md': archive('### F-001\n\n---\n', record('B-002'), '| 🔵 | a change | #1 |\n') });
  r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /line 5 on main \(in F-001\) is changed or missing here: "record F-001"/);
  write(dir, { 'docs/archive/old.md': archive(record('F-001'), record('B-002'), '| 🔵 | something else | #9 |\n') });
  r = run(dir, 'check-backlog.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /is changed or missing here: "\| 🔵 \| a change \| #1 \|"/);
  rmSync(join(dir, 'docs/archive/old.md'));
  assert.match(run(dir, 'check-backlog.mjs').out, /old\.md is on main but missing here/);
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
});

// ------------------------------------------------------------------------------------------------- merge-when-green

test('merge-when-green: merges only when every check passed and it can merge; stops on a failure or a conflict', (t) => {
  const dir = tmp(t);
  cpSync(join(core, 'merge-when-green.mjs'), join(dir, 'tools', 'merge-when-green.mjs'));
  // a fake gh: `pr view` prints pr.json, `pr merge` is logged
  write(dir, { 'bin/gh': `#!/bin/sh\nif [ "$2" = merge ]; then echo "merge $3" >> "${join(dir, 'log')}"; exit 0; fi\ncat "${join(dir, 'pr.json')}"\n` });
  execFileSync('chmod', ['+x', join(dir, 'bin/gh')]);
  const PATH = `${join(dir, 'bin')}:${process.env.PATH}`;
  const pr = (mergeable, checks, extra = {}) => write(dir, { 'pr.json': { state: 'OPEN', mergeable, isDraft: false, statusCheckRollup: checks, ...extra } });
  const ok = { name: 'check', status: 'COMPLETED', conclusion: 'SUCCESS' };
  const merged = () => { try { return readFileSync(join(dir, 'log'), 'utf8'); } catch { return ''; } };

  pr('MERGEABLE', [ok, { name: 'CodeQL', status: 'COMPLETED', conclusion: 'FAILURE' }]); // an optional check failing stops it
  let r = run(dir, 'merge-when-green.mjs', ['7'], { PATH });
  assert.equal(r.code, 3);
  assert.match(r.out, /#7: failed: CodeQL/);
  pr('CONFLICTING', [ok]);
  r = run(dir, 'merge-when-green.mjs', ['7'], { PATH });
  assert.equal(r.code, 2);
  assert.equal(merged(), '');
  pr('MERGEABLE', [ok, { context: 'legacy', state: 'SUCCESS' }, { name: 'skipped', status: 'COMPLETED', conclusion: 'SKIPPED' }]);
  r = run(dir, 'merge-when-green.mjs', ['7'], { PATH });
  assert.equal(r.code, 0, r.out);
  assert.equal(merged(), 'merge 7\n');
  pr('MERGED', [ok], { state: 'MERGED' });
  assert.match(run(dir, 'merge-when-green.mjs', ['7'], { PATH }).out, /#7: merged\n/);
});

// ---------------------------------------------------------------------------------------------------- merge-backlog

test('merge-backlog: each record takes the side that changed it; both sides changed means by hand', (t) => {
  const dir = tmp(t);
  git(dir, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'merge-backlog.mjs'), join(dir, 'tools', 'merge-backlog.mjs'));
  const rec = (id, body) => `### ${id}\n\n${body}\n\n---\n`;
  const doc = (head, bugs, feats, other = '') => `# Backlog\n\n${head}\n\n## Bugs\n\n${bugs.join('\n')}\n## Features\n\n${feats.join('\n')}\n## Other changes\n\n${other}Older change.\n`;
  write(dir, { 'docs/BACKLOG.md': doc('Reviewed against a1.', [rec('B-001', 'open')], [rec('F-002', 'open')]) });
  commitAll(dir, 'base');
  git(dir, 'checkout', '-q', '-b', 'work');
  // the branch: implements B-001, adds F-003 and a paragraph, moves the header
  write(dir, { 'docs/BACKLOG.md': doc('Reviewed against b2.', [rec('B-001', 'implemented')], [rec('F-002', 'open'), rec('F-003', 'new')], 'Branch change.\n\n') });
  commitAll(dir, 'work');
  git(dir, 'checkout', '-q', 'main');
  // main: closes F-002 (still listed, edited), moves the header
  write(dir, { 'docs/BACKLOG.md': doc('Reviewed against c3.', [rec('B-001', 'open')], [rec('F-002', 'closed')]) });
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
  git(dir, 'merge', '--abort');
  // both sides change B-001: the default branch's stays, the record is named, exit 1
  write(dir, { 'docs/BACKLOG.md': doc('Reviewed against b2.', [rec('B-001', 'implemented')], [rec('F-002', 'open')]) });
  commitAll(dir, 'work again');
  git(dir, 'checkout', '-q', 'main');
  write(dir, { 'docs/BACKLOG.md': doc('Reviewed against d4.', [rec('B-001', 'investigating')], [rec('F-002', 'closed')]) });
  commitAll(dir, 'main again');
  git(dir, 'checkout', '-q', 'work');
  assert.throws(() => git(dir, 'merge', '-q', 'main'));
  r = run(dir, 'merge-backlog.mjs');
  assert.equal(r.code, 1);
  assert.match(r.out, /Both sides changed B-001/);
  out = readFileSync(join(dir, 'docs/BACKLOG.md'), 'utf8');
  assert.match(out, /### B-001\n\ninvestigating/);
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
