import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { graph, render, run } from '../core/tools/backlog-dependencies.mjs';
const record = (id, deps) =>
  `### ${id}\n\n**Title**\n\n<details>\n\n| | |\n|---|---|\n${deps === undefined ? '' : `| Depends on | ${deps} |\n`}\n</details>\n\n---\n`;
const source = (text) => [{ file: 'docs/BACKLOG.md', text }];
test('forward outcomes and reverse links have one source; empty legacy records need no migration', () => {
  const sources = source(
    record('F-001') +
      record('F-002', '[F-001](#f-001) — contract published') +
      record('B-001', '[F-001](#f-001) — API stable'),
  );
  const out = render(sources);
  assert.match(out, /contract published/);
  assert.match(out, /\| \[F-001\].*\| — \| \[B-001\].*\[F-002\]/);
  assert.equal(graph(sources).size, 3);
  assert.match(render([]), /\| — \| — \| — \|/);
});
test('missing, broken, self, duplicate and cyclic links fail with named records', () => {
  for (const [deps, error] of [
    ['[F-999](#f-999) — release', /missing dependency F-999/],
    ['[F-001](#f-001) — release', /self/],
    ['[F-002](#f-999) — release', /invalid local/],
    ['F-002', /expected/],
    ['', /empty/],
    ['[F-002](#f-002) — ', /expected/],
    ['[F-002](#f-002) — x<br />[F-002](#f-002) — y', /duplicate dependency/],
  ])
    assert.throws(() => graph(source(record('F-001', deps) + record('F-002'))), error);
  assert.throws(
    () => graph(source(record('F-001', '[F-002](#f-002) — x') + record('F-002', '[F-001](#f-001) — y'))),
    /F-001 → F-002 → F-001/,
  );
  assert.throws(() => graph(source(record('F-001') + record('F-001'))), /Duplicate record/);
  assert.throws(
    () => graph(source(record('F-001', '—').replace('| Depends on | — |', '| Depends on | — |\n| Depends on | — |'))),
    /duplicate Depends on/,
  );
});
test('archive links survive closure and active reopen overrides old dependencies without rewriting history', () => {
  const archive = record('F-001', '[F-002](#f-002) — historical') + record('F-002');
  const sources = [
    { file: 'docs/archive/backlog-2026.md', text: archive },
    ...source(record('F-001') + record('F-003', '[F-001](archive/backlog-2026.md#f-001) — release')),
  ];
  const out = render(sources);
  assert.doesNotMatch(out, /historical/);
  assert.match(out, /\.\.\/BACKLOG.md#f-001/);
  assert.equal(sources[0].text, archive);
  assert.throws(
    () => graph(source(record('F-001') + record('F-003', '[F-001](archive/backlog-2026.md#f-001) — release'))),
    /broken dependency link/,
  );
});
test('qualified external prerequisites stay explicitly unknown; fenced examples are ignored', () => {
  const dep = '[org/upstream:F-123](https://github.com/org/upstream/blob/v1/docs/BACKLOG.md#f-123) — v1 release';
  const out = render(source(record('F-001', dep) + '\n```md\n' + record('F-999', 'bad') + '```\n'));
  assert.match(out, /external; not checked live/);
  assert.doesNotMatch(out, /F-999/);
  assert.throws(
    () => render(source(record('F-001', dep.replace('/org/upstream/', '/org/other/')))),
    /qualified repository/,
  );
});
test('CLI check detects staleness, rejects flags and unsafe paths, and never modifies records', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'dependency graph '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  mkdirSync(join(root, 'docs/archive'));
  const input = record('F-001');
  writeFileSync(join(root, 'docs/BACKLOG.md'), input);
  assert.throws(() => run(root, ['--check']), /stale/);
  run(root, []);
  run(root, ['--check']);
  assert.equal(readFileSync(join(root, 'docs/BACKLOG.md'), 'utf8'), input);
  assert.throws(() => run(root, ['--check', '--check']), /Use/);
  assert.throws(() => run(root, ['--wat']), /Use/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), input + record('F-002'));
  assert.throws(() => run(root, ['--check']), /stale/);
  const output = join(root, 'docs/agents/backlog-dependencies.md');
  writeFileSync(output, 'Manual page\n');
  assert.throws(() => run(root, []), /non-generated/);
  rmSync(output);
  symlinkSync(join(root, 'docs/BACKLOG.md'), output);
  assert.throws(() => run(root, []), /Symlink/);
  assert.equal(readFileSync(join(root, 'docs/BACKLOG.md'), 'utf8'), input + record('F-002'));
});

test('repeated historical snapshots use the last archived record, while active duplicates fail', () => {
  const sources = [
    {
      file: 'docs/archive/backlog-2026.md',
      text: record('F-001', '[F-002](#f-002) — old') + record('F-002') + record('F-001', '—'),
    },
  ];
  assert.equal(graph(sources).get('F-001').dependencies.length, 0);
});

test('immutable archived forward links resolve by ID after either record moves', () => {
  const sources = [
    { file: 'docs/archive/backlog-2026.md', text: record('F-002', '[F-001](#f-001) — release') },
    ...source(record('F-001')),
  ];
  assert.match(render(sources), /\.\.\/BACKLOG.md#f-001/);
  sources[1] = { file: 'docs/archive/backlog-2027.md', text: record('F-001') };
  assert.match(render(sources), /backlog-2027.md#f-001/);
});
test('dangling output symlinks are rejected before an external file can be created', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'dependency dangling '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  const outside = join(root, 'outside-not-created.md');
  symlinkSync(outside, join(root, 'docs/agents/backlog-dependencies.md'));
  assert.throws(() => run(root, []), /Symlink/);
  assert.throws(() => readFileSync(outside), /ENOENT/);
});
