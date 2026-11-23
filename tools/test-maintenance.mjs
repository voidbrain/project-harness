import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { preview } from './reconcile-preview.mjs';
import { friction } from './friction.mjs';
const temp = () => mkdtempSync(join(tmpdir(), 'harness maintenance '));
const put = (root, path, value) => {
  mkdirSync(join(root, path, '..'), { recursive: true });
  writeFileSync(join(root, path), value);
};
test('preview classifies changes, retains marked and unmarked adapted rules, and never writes', () => {
  const root = temp(),
    project = join(root, 'project'),
    template = join(root, 'template');
  mkdirSync(project);
  mkdirSync(template);
  const git = (...args) => execFileSync('git', ['-C', template, ...args], { encoding: 'utf8', stdio: 'pipe' }).trim();
  try {
    git('init');
    put(template, 'copy.txt', 'old');
    put(template, 'adapt.md', 'old rule');
    git('add', '.');
    git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'base');
    git('tag', 'v1.0.0');
    put(template, 'copy.txt', 'new');
    put(template, 'adapt.md', 'new rule');
    git('add', '.');
    git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'next');
    git('tag', 'v1.1.0');
    put(
      project,
      '.harness.json',
      JSON.stringify({
        version: '1.0.0',
        copied: { 'copy.txt': 'copy.txt', 'conflict.txt': 'copy.txt', 'missing.txt': 'copy.txt' },
        adapted: { 'AGENTS.md': 'adapt.md' },
      }),
    );
    put(project, 'copy.txt', 'old');
    put(project, 'conflict.txt', 'local');
    put(project, 'AGENTS.md', 'Unmarked project rule\nPrivate rule <!-- project -->\n');
    const before = readFileSync(join(project, 'AGENTS.md'), 'utf8'),
      status = git('status', '--porcelain');
    const result = preview(project, template, 'v1.1.0');
    assert.equal(result.rows[0].comparisons[0].action, 'copy-update');
    assert.equal(result.rows[1].comparisons[0].action, 'conflict-review');
    assert.equal(result.rows[2].comparisons[0].action, 'missing-review');
    assert.equal(result.rows[3].comparisons[0].action, 'manual-reconcile');
    assert.equal(result.rows[3].protectedRules.length, 1);
    assert.match(result.rows[3].preservation, /all project content/);
    assert.equal(readFileSync(join(project, 'AGENTS.md'), 'utf8'), before);
    assert.equal(git('status', '--porcelain'), status);
    assert.equal(readFileSync(join(project, 'copy.txt'), 'utf8'), 'old');
    assert.equal(existsSync(join(project, 'missing.txt')), false);
    assert.throws(() => preview(project, template, 'main'), /release tag/);
    put(project, '.harness.json', JSON.stringify({ version: 'missing', copied: { 'copy.txt': 'copy.txt' } }));
    assert.equal(preview(project, template).rows[0].comparisons[0].action, 'base-unknown-review');
    put(project, '.harness.json', JSON.stringify({ version: '1.0.0', copied: { '../outside': 'copy.txt' } }));
    assert.throws(() => preview(project, template), /Invalid project path/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test('friction records observations only, distinguishes unknown/zero and rejects unsafe or malformed inputs', () => {
  const root = temp();
  try {
    assert.equal(friction(root, ['report']).samples, 0);
    friction(root, ['record', '--operation=reconciliation', '--duration-ms=100', '--conflicts=0']);
    friction(root, ['record', '--operation=reconciliation', '--duration-ms=300', '--repeated-context-loads=2']);
    const summary = friction(root, ['report']).operations.reconciliation;
    assert.deepEqual(summary.durationMs, { observed: 2, missing: 0, median: 200 });
    assert.deepEqual(summary.conflicts, { observed: 1, missing: 1, median: 0 });
    const file = join(root, '.harness/friction.jsonl'),
      before = readFileSync(file, 'utf8');
    for (const args of [
      ['record', '--operation=other', '--duration-ms=1'],
      ['record', '--operation=adoption', '--duration-ms=-1'],
      ['record', '--operation=adoption', '--duration-ms=1', '--duration-ms=2'],
      ['report', '--write=yes'],
      ['record', '--operation=adoption', '--duration-ms=1', '--note=secret'],
    ])
      assert.throws(() => friction(root, args));
    assert.equal(readFileSync(file, 'utf8'), before);
    writeFileSync(file, '{"schemaVersion":1}\n');
    assert.throws(() => friction(root, ['report']), /Invalid stored/);
    rmSync(file);
    symlinkSync(join(root, 'outside.jsonl'), file);
    assert.throws(() => friction(root, ['record', '--operation=adoption', '--duration-ms=1']), /symlink/);
    assert.equal(existsSync(join(root, 'outside.jsonl')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test('preview CLI refuses unknown, duplicate and write flags', () => {
  for (const arg of ['--write', '--json=true', '--unknown=1'])
    assert.throws(() => execFileSync(process.execPath, ['tools/reconcile-preview.mjs', arg], { stdio: 'pipe' }));
  assert.throws(() =>
    execFileSync(process.execPath, ['tools/reconcile-preview.mjs', '--json', '--json'], { stdio: 'pipe' }),
  );
});

test('start/finish measures elapsed workflow time automatically without overwriting a running session', () => {
  const root = temp();
  try {
    let time = Date.UTC(2026, 9, 31);
    const clock = () => time;
    friction(root, ['start', '--operation=reconciliation'], clock);
    assert.throws(() => friction(root, ['start', '--operation=reconciliation']));
    assert.throws(() => friction(root, ['finish', '--duration-ms=1']));
    time += 125;
    const row = friction(root, ['finish', '--conflicts=0'], clock);
    assert.equal(row.durationMs, 125);
    assert.equal(row.unnecessaryPrompts, null);
    assert.equal(existsSync(join(root, '.harness/friction-session.json')), false);
    assert.ok(friction(root, ['report']).latestAt);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('B-049: samples recorded in a linked worktree land in the primary checkout and survive its removal', () => {
  const base = temp(),
    primary = join(base, 'primary'),
    worktree = join(base, 'task worktree');
  try {
    mkdirSync(primary);
    const git = (...args) => execFileSync('git', ['-C', primary, ...args], { encoding: 'utf8', stdio: 'pipe' });
    git('init', '-q');
    put(primary, '.gitignore', '.harness/\n');
    git('add', '.');
    git('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-q', '-m', 'base');
    git('worktree', 'add', '-q', worktree, '-b', 'task');
    let time = Date.UTC(2026, 10, 24);
    const clock = () => time;
    friction(worktree, ['start', '--operation=reconciliation'], clock);
    time += 60000;
    friction(worktree, ['finish', '--conflicts=0'], clock);
    assert.equal(friction(primary, ['report']).samples, 1, 'the primary checkout sees the worktree sample');
    assert.equal(friction(worktree, ['report']).samples, 1, 'a review from the worktree sees it too');
    git('worktree', 'remove', '--force', worktree);
    assert.equal(friction(primary, ['report']).samples, 1, 'removing the worktree keeps the sample');
    assert.equal(existsSync(join(primary, '.harness/friction-session.json')), false);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});

test('B-049: outside git the samples stay under the given root', () => {
  const root = temp();
  try {
    friction(root, ['record', '--operation=adoption', '--duration-ms=5']);
    assert.ok(existsSync(join(root, '.harness/friction.jsonl')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('B-049: a project below its repository top level keeps its samples, and finish needs a start in its checkout', () => {
  const base = temp();
  try {
    execFileSync('git', ['-C', base, 'init', '-q'], { stdio: 'pipe' });
    const project = join(base, 'pkg');
    mkdirSync(project);
    friction(project, ['record', '--operation=adoption', '--duration-ms=5']);
    assert.ok(existsSync(join(project, '.harness/friction.jsonl')));
    assert.equal(existsSync(join(base, '.harness')), false);
    assert.throws(() => friction(project, ['finish']), /No running session in this checkout/);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
});
