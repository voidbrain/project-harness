import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { graph, run } from '../core/tools/backlog-dependencies.mjs';
const unlocks = (all, id) =>
  [...all.values()]
    .filter((r) => r.dependencies.some((d) => !d.external && d.id === id))
    .map((r) => r.id)
    .sort();
const record = (id, deps) =>
  `### ${id}\n\n**Title**\n\n<details>\n\n| | |\n|---|---|\n${deps === undefined ? '' : `| Depends on | ${deps} |\n`}\n</details>\n\n---\n`;
const source = (text) => [{ file: 'docs/BACKLOG.md', text }];
test('forward outcomes and reverse links have one source; empty legacy records need no migration', () => {
  const sources = source(
    record('F-001') +
      record('F-002', '[F-001](#f-001) — contract published') +
      record('B-001', '[F-001](#f-001) — API stable'),
  );
  const all = graph(sources);
  assert.equal(all.get('F-002').dependencies[0].outcome, 'contract published');
  assert.deepEqual(unlocks(all, 'F-001'), ['B-001', 'F-002']);
  assert.equal(all.size, 3);
  assert.equal(graph([]).size, 0);
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
  const all = graph(sources);
  assert.equal(all.get('F-001').file, 'docs/BACKLOG.md', 'the active reopened record wins');
  assert.deepEqual(all.get('F-001').dependencies, []);
  assert.deepEqual(unlocks(all, 'F-001'), ['F-003']);
  assert.equal(sources[0].text, archive);
  assert.throws(
    () => graph(source(record('F-001') + record('F-003', '[F-001](archive/backlog-2026.md#f-001) — release'))),
    /broken dependency link/,
  );
});
test('qualified external prerequisites stay explicitly unknown; fenced examples are ignored', () => {
  const dep = '[org/upstream:F-123](https://github.com/org/upstream/blob/v1/docs/BACKLOG.md#f-123) — v1 release';
  const all = graph(source(record('F-001', dep) + '\n```md\n' + record('F-999', 'bad') + '```\n'));
  assert.equal(all.get('F-001').dependencies[0].external, true);
  assert.equal(all.has('F-999'), false);
  assert.throws(
    () => graph(source(record('F-001', dep.replace('/org/upstream/', '/org/other/')))),
    /qualified repository/,
  );
});
test('CLI validates, writes nothing, refuses a leftover generated page, flags and unsafe paths', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'dependency graph '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  mkdirSync(join(root, 'docs/archive'));
  const input = record('F-001') + record('F-002', '[F-001](#f-001) — release');
  writeFileSync(join(root, 'docs/BACKLOG.md'), input);
  assert.equal(run(root, []).size, 2);
  assert.equal(run(root, ['--check']).size, 2);
  assert.deepEqual(readdirSync(join(root, 'docs/agents')), [], 'no page is written');
  assert.equal(readFileSync(join(root, 'docs/BACKLOG.md'), 'utf8'), input);
  assert.throws(() => run(root, ['--check', '--check']), /Use/);
  assert.throws(() => run(root, ['--write']), /Use/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), input + record('F-003', '[F-009](#f-009) — gone'));
  assert.throws(() => run(root, ['--check']), /missing dependency F-009/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), input);
  writeFileSync(join(root, 'docs/agents/backlog-dependencies.md'), 'old generated page\n');
  assert.throws(() => run(root, ['--check']), /retired \(5\.5\.0\).*delete the page/);
  rmSync(join(root, 'docs/agents/backlog-dependencies.md'));
  // A ledger that still links the retired page fails too.
  writeFileSync(join(root, 'docs/BACKLOG.md'), input + '[Dependencies](agents/backlog-dependencies.md)\n');
  assert.throws(() => run(root, ['--check']), /still links .*backlog-dependencies\.md/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), input);
  rmSync(join(root, 'docs/BACKLOG.md'));
  symlinkSync(join(root, 'outside.md'), join(root, 'docs/BACKLOG.md'));
  assert.throws(() => run(root, []), /Symlink/);
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
  assert.equal(graph(sources).get('F-001').file, 'docs/BACKLOG.md');
  sources[1] = { file: 'docs/archive/backlog-2027.md', text: record('F-001') };
  assert.equal(graph(sources).get('F-001').file, 'docs/archive/backlog-2027.md');
  assert.deepEqual(unlocks(graph(sources), 'F-001'), ['F-002']);
});
