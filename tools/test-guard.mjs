// The push guard (core/tools/guard.mjs) against throwaway repositories: a project with a bare remote standing in for
// GitHub, the guard installed as its pre-push hook, and real pushes. Run with: npm run test:tools.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const core = fileURLToPath(new URL('../core/tools/', import.meta.url));
const env = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'test',
  GIT_AUTHOR_EMAIL: 'test@example.com',
  GIT_COMMITTER_NAME: 'test',
  GIT_COMMITTER_EMAIL: 'test@example.com',
};
for (const k of ['CI', 'HARNESS_HOME', 'GITHUB_ACTIONS', 'HARNESS_GUARD_ALLOW']) delete env[k];

const git = (cwd, ...args) =>
  execFileSync('git', args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const tryGit = (cwd, args, extra = {}) => {
  const r = spawnSync('git', args, { cwd, env: { ...env, ...extra }, encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};
const write = (dir, files) => {
  for (const [p, c] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, p)), { recursive: true });
    writeFileSync(join(dir, p), c);
  }
};
const commit = (dir, message) => {
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', message);
};
const guard = (dir, args, input = '', extra = {}) => {
  const r = spawnSync(process.execPath, [join(dir, 'tools', 'guard.mjs'), ...args], {
    cwd: dir,
    env: { ...env, ...extra },
    input,
    encoding: 'utf8',
  });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};
const archive = (...records) =>
  `# Closed backlog — 2026\n\n## Closed 2026-11-01\n\n${records.map((r) => `### ${r}\n\n**${r} title**\n\nClosed 2026-11-01.\n\n---\n`).join('\n')}`;

// a project on main with one archived record, published to a bare remote, the guard installed
function project(t) {
  const dir = mkdtempSync(join(tmpdir(), 'harness guard '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const work = join(dir, 'work'),
    remote = join(dir, 'remote.git');
  mkdirSync(join(work, 'tools'), { recursive: true });
  git(work, 'init', '-q', '-b', 'main');
  cpSync(join(core, 'guard.mjs'), join(work, 'tools', 'guard.mjs'));
  write(work, { 'docs/archive/backlog-2026.md': archive('F-001'), 'docs/BACKLOG.md': '# Backlog\n' });
  commit(work, 'start');
  git(dir, 'clone', '-q', '--bare', work, remote);
  git(work, 'remote', 'add', 'origin', remote);
  git(work, 'fetch', '-q', 'origin');
  git(work, 'remote', 'set-head', 'origin', '-a');
  return work;
}

test('guard: install is opt-in, idempotent and never replaces another hook', (t) => {
  const dir = project(t);
  assert.match(guard(dir, ['status']).out, /not installed/);
  assert.match(guard(dir, ['install']).out, /pre-push installed/);
  assert.match(guard(dir, ['install']).out, /already runs the guard/);
  assert.match(guard(dir, ['status']).out, /Guard installed/);
  const other = project(t);
  write(other, { '.git/hooks/pre-push': '#!/bin/sh\necho mine\n' });
  const r = guard(other, ['install']);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /exists and is not the guard/);
  assert.equal(readFileSync(join(other, '.git/hooks/pre-push'), 'utf8'), '#!/bin/sh\necho mine\n');
  // the line it asks for, added by hand, counts as installed everywhere
  write(other, { '.git/hooks/pre-push': '#!/bin/sh\necho mine\nnode tools/guard.mjs pre-push "$@"\n' });
  assert.match(guard(other, ['status']).out, /Guard installed/);
  assert.match(guard(other, ['install']).out, /already runs the guard/);
});

test('guard: the pre-push hook refuses a push to the default branch and a force-push, allows a branch', (t) => {
  const dir = project(t);
  guard(dir, ['install']);
  write(dir, { 'a.txt': 'a\n' });
  commit(dir, 'a change');
  let r = tryGit(dir, ['push', 'origin', 'HEAD:main']);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Refused: pushing to main\. Rule: never push to the default branch.*AGENTS/);
  assert.match(r.out, /HARNESS_GUARD_ALLOW=default-branch/);
  assert.equal(
    git(dir, 'ls-remote', 'origin', 'main').split('\t')[0],
    git(dir, 'rev-parse', 'HEAD~1'),
    'main on the remote did not move',
  );
  git(dir, 'switch', '-q', '-c', 'feature');
  assert.equal(tryGit(dir, ['push', '-q', 'origin', 'feature']).code, 0, 'a branch push goes through');
  // rewrite the pushed branch and force it
  git(dir, 'commit', '-q', '--amend', '-m', 'rewritten');
  r = tryGit(dir, ['push', '--force', 'origin', 'feature']);
  assert.notEqual(r.code, 0);
  assert.match(
    r.out,
    /Refused: rewriting feature on the remote\. Rule: rewriting published history, force-pushing or moving a published tag is asked first/,
  );
  // the owner said yes to this one operation
  assert.equal(
    tryGit(dir, ['push', '-q', '--force', 'origin', 'feature'], { HARNESS_GUARD_ALLOW: 'force-push' }).code,
    0,
  );
  // a fast-forward is fine, and deleting a branch other than the default one is not a rewrite
  write(dir, { 'b.txt': 'b\n' });
  commit(dir, 'b');
  assert.equal(tryGit(dir, ['push', '-q', 'origin', 'feature']).code, 0);
  assert.equal(tryGit(dir, ['push', '-q', 'origin', '--delete', 'feature']).code, 0);
  r = tryGit(dir, ['push', 'origin', '--delete', 'main']);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Refused: deleting main/);
  // a published tag stays where it is: moving or deleting it is asked first
  git(dir, 'tag', 'v1.0.0', 'main');
  assert.equal(tryGit(dir, ['push', '-q', 'origin', 'v1.0.0']).code, 0, 'publishing a tag');
  git(dir, 'tag', '-f', 'v1.0.0', 'HEAD');
  r = tryGit(dir, ['push', '-f', 'origin', 'v1.0.0']);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Refused: moving the published tag v1\.0\.0\. Rule: .*moving a published tag is asked first/);
  assert.match(
    tryGit(dir, ['push', 'origin', ':refs/tags/v1.0.0']).out,
    /Refused: deleting the published tag v1\.0\.0/,
  );
});

test('guard: the remote git names is the one compared, not always origin', (t) => {
  const dir = project(t);
  git(dir, 'remote', 'rename', 'origin', 'upstream');
  guard(dir, ['install']);
  git(dir, 'switch', '-q', '-c', 'archive-edit');
  write(dir, { 'docs/archive/backlog-2026.md': archive('F-001').replace('Closed 2026-11-01.', 'Closed 2026-11-02.') });
  commit(dir, 'tidy');
  assert.match(tryGit(dir, ['push', 'upstream', 'archive-edit']).out, /drops or changes 1 archive line/);
  assert.match(tryGit(dir, ['push', 'upstream', 'HEAD:main']).out, /Refused: pushing to main/);
});

test('guard: a pushed branch may add archive lines anywhere but not drop or change one already on the default branch', (t) => {
  const dir = project(t);
  guard(dir, ['install']);
  git(dir, 'switch', '-q', '-c', 'archive-grows');
  write(dir, { 'docs/archive/backlog-2026.md': archive('F-001', 'F-002') });
  commit(dir, 'archive F-002');
  assert.equal(tryGit(dir, ['push', '-q', 'origin', 'archive-grows']).code, 0);
  git(dir, 'switch', '-q', '-c', 'archive-edit', 'main');
  write(dir, { 'docs/archive/backlog-2026.md': archive('F-001').replace('**F-001 title**', '**F-001 better title**') });
  commit(dir, 'tidy the archive');
  const r = tryGit(dir, ['push', 'origin', 'archive-edit']);
  assert.notEqual(r.code, 0);
  assert.match(
    r.out,
    /archive-edit drops or changes 1 archive line\(s\) already on main, first "\*\*F-001 title\*\*".*Rule: archives only grow.*BACKLOG-RULES/s,
  );
  // moving a record to another archive file is not a loss
  git(dir, 'switch', '-q', '-c', 'archive-move', 'main');
  rmSync(join(dir, 'docs/archive/backlog-2026.md'));
  write(dir, { 'docs/archive/old.md': archive('F-001').replace('# Closed backlog — 2026', '# Older records') });
  commit(dir, 'move');
  assert.equal(tryGit(dir, ['push', '-q', 'origin', 'archive-move']).code, 0);
});

test('guard: a branch older than main is not blamed for archive lines main gained since', (t) => {
  const dir = project(t);
  git(dir, 'switch', '-q', '-c', 'old-branch');
  write(dir, { 'x.txt': 'x\n' });
  commit(dir, 'work');
  // main moves on: another PR archived F-002 (pushed before the guard was installed here)
  git(dir, 'switch', '-q', 'main');
  write(dir, { 'docs/archive/backlog-2026.md': archive('F-001', 'F-002') });
  commit(dir, 'archive F-002');
  git(dir, 'push', '-q', 'origin', 'main');
  git(dir, 'fetch', '-q', 'origin');
  guard(dir, ['install']);
  git(dir, 'switch', '-q', 'old-branch');
  assert.equal(tryGit(dir, ['push', '-q', 'origin', 'old-branch']).code, 0);
});

test('guard: the Claude Code adapter exits 2 with the reason for a forced or default-branch push and an archive rewrite', (t) => {
  const dir = project(t);
  const call = (tool_name, tool_input, extra) =>
    guard(dir, ['claude'], JSON.stringify({ tool_name, tool_input, cwd: dir }), extra);
  for (const command of [
    'git push --force origin feature',
    'git push -fu origin feature',
    'git push origin +feature',
    'cd x && git push --force-with-lease',
    'git -C . push origin HEAD:main',
    'git push origin main',
    'git push origin refs/heads/main',
  ])
    assert.equal(call('Bash', { command }).code, 2, command);
  let r = call('Bash', { command: 'git push --force origin feature' });
  assert.match(
    r.out,
    /Refused: `git push --force origin feature`\. Rule: rewriting published history, force-pushing or moving a published tag is asked first/,
  );
  for (const command of [
    'git push -u origin feature',
    'git push origin --delete feature',
    'git status && npm test',
    'echo "git push --force"',
  ])
    assert.equal(call('Bash', { command }).code, 0, command);
  // a push hidden in a quoted command, and an implicit push while on main
  for (const command of [
    'bash -c "git push --force origin feature"',
    "eval 'git push origin main'",
    'git push',
    'git push origin HEAD',
    'git push -u origin HEAD',
    'git push --repo=origin main',
  ])
    assert.equal(call('Bash', { command }).code, 2, command);
  git(dir, 'switch', '-q', '-c', 'feature');
  for (const command of ['git push', 'git push -u origin HEAD', 'git push origin HEAD:feature'])
    assert.equal(call('Bash', { command }).code, 0, `on feature: ${command}`);
  git(dir, 'switch', '-q', 'main');
  assert.equal(
    call('Bash', { command: 'git push --force origin feature' }, { HARNESS_GUARD_ALLOW: 'force-push' }).code,
    0,
  );
  const path = 'docs/archive/backlog-2026.md',
    text = readFileSync(join(dir, path), 'utf8');
  r = call('Edit', { file_path: join(dir, path), old_string: '**F-001 title**', new_string: '**F-001 new title**' });
  assert.equal(r.code, 2);
  assert.match(r.out, /removes or changes 1 line\(s\), first "\*\*F-001 title\*\*".*archives only grow/s);
  assert.equal(
    call('Edit', {
      file_path: path,
      old_string: 'Closed 2026-11-01.\n',
      new_string: 'Closed 2026-11-01.\n\nCorrection 2026-11-06: the date above is the merge date.\n',
    }).code,
    0,
    'a dated correction added',
  );
  assert.equal(call('Write', { file_path: path, content: `${text}\n### F-002\n\nnew\n` }).code, 0, 'appending');
  assert.equal(call('Write', { file_path: path, content: '# Closed backlog — 2026\n' }).code, 2, 'truncating');
  assert.equal(
    call('MultiEdit', {
      file_path: path,
      edits: [{ old_string: 'Closed 2026-11-01.', new_string: 'Closed 2026-11-02.' }],
    }).code,
    2,
  );
  assert.equal(
    call('Edit', { file_path: 'docs/BACKLOG.md', old_string: '# Backlog', new_string: '# Work' }).code,
    0,
    'other files are not archives',
  );
  assert.equal(
    call('Edit', { file_path: 'docs/archive/README.md', old_string: 'a', new_string: 'b' }).code,
    0,
    'the archive README is not evidence',
  );
  assert.equal(guard(dir, ['claude'], 'not json').code, 0);
  // the generated recap block is archive-recap.mjs's to rewrite
  write(dir, {
    [path]: text.replace(
      '## Closed 2026-11-01',
      '<!-- archive-recap:start -->\n| Week | Features |\n| a | 1 |\n<!-- archive-recap:end -->\n\n## Closed 2026-11-01',
    ),
  });
  assert.equal(call('Edit', { file_path: path, old_string: '| a | 1 |', new_string: '| a | 2 |' }).code, 0);
  assert.ok(!existsSync(join(dir, '.git/hooks/pre-push')), 'the adapter installs nothing');
});

test('check-harness: reports an adopted guard that is not installed, and an installed one', (t) => {
  const dir = project(t);
  cpSync(join(core, 'check-harness.mjs'), join(dir, 'tools', 'check-harness.mjs'));
  write(dir, {
    '.harness.json': JSON.stringify({
      template: { path: join(dir, 'no-template') },
      version: '1.0.0',
      copied: { 'tools/guard.mjs': 'core/tools/guard.mjs' },
    }),
  });
  const check = () =>
    spawnSync(process.execPath, [join(dir, 'tools', 'check-harness.mjs')], { cwd: dir, env, encoding: 'utf8' }).stdout;
  assert.match(
    check(),
    /push guard \(tools\/guard\.mjs\) is adopted but not installed in this clone: node tools\/guard\.mjs install/,
  );
  guard(dir, ['install']);
  assert.doesNotMatch(check(), /push guard/);
  write(dir, {
    '.harness.json': JSON.stringify({ template: { path: join(dir, 'no-template') }, version: '1.0.0', copied: {} }),
  });
  rmSync(join(dir, '.git/hooks/pre-push'));
  assert.doesNotMatch(check(), /push guard/, 'not adopted: nothing to report');
});
