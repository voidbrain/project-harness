import { test } from 'node:test';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { queue, render, run } from '../core/tools/backlog-queue.mjs';
const record = (id, { priority = 2, effort = '🟢 Small', status = 'Open', human = 'No', deps, order, impact } = {}) =>
  `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| ${{ Open: '🔴', Implemented: '🟡', Verified: '🟢', Closed: '🔵', Blocked: '🟣' }[status]} | ${status === 'Closed' || status === 'Blocked' ? '◻️' : { 1: '🔺', 2: '🔶', 3: '🔹' }[priority]} P${priority} | ${status} | ${effort} |\n\n${human === 'Yes' ? '🧑' : '💻'} **→ Human action required: ${human}**<br />Read the requirement for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n${deps ? `| Depends on | ${deps} |\n` : ''}${order !== undefined ? `| Queue order | ${order} |\n` : ''}${impact ? `| Impact | ${impact} |\n` : ''}\n</details>\n\n---\n`;
const active = (text) => [{ file: 'docs/BACKLOG.md', text }];
const dep = (id) => `[${id}](#${id.toLowerCase()}) — required contract`;
test('queue respects explicit record prioritization, impact priority, dependencies, remaining effort and stable IDs', () => {
  const source = active(
    record('F-001', { priority: 1, effort: '🔴 Large' }) +
      record('F-002', { priority: 2 }) +
      record('F-003', { priority: 3, order: '1 — Owner-selected first' }) +
      record('F-004', { priority: 1 }) +
      record('F-005', { priority: 1, deps: dep('F-001') }),
  );
  assert.deepEqual(
    queue(source)
      .filter((r) => r.lane === 'Agent candidates')
      .map((r) => r.id),
    ['F-003', 'F-001', 'F-004', 'F-002'],
    'direct dependent count precedes effort within priority',
  );
  assert.equal(queue(source).find((r) => r.id === 'F-005').lane, 'Prerequisite review');
  assert.match(render(source), /Queue order 1: Owner-selected first/);
  assert.match(render(source), /1 direct active dependent\(s\): F-005/);
  assert.doesNotMatch(render(source), /~\d+%/);
  const tied = queue(active(record('F-002') + record('F-001')));
  assert.deepEqual(
    tied.map((r) => r.id),
    ['F-001', 'F-002'],
  );
});
test('prioritization cannot clear human cues, named blockers or unverified external outcomes', () => {
  const external =
    '[org/master:F-001](https://github.com/org/master/blob/v1/docs/BACKLOG.md#f-001) — published release';
  const out = queue(
    active(
      record('F-001', { human: 'Yes', order: '1 — Important decision' }) +
        record('F-002', { status: 'Blocked', order: '2 — Important blocker' }) +
        record('F-003', { deps: external }),
    ),
  );
  assert.deepEqual(
    out.map((r) => r.lane),
    ['Human action', 'Blocked', 'Prerequisite review'],
  );
  assert.match(render(active(record('F-003', { deps: external }))), /external; unverified/);
});
test('historical five-column archives and opaque historical evidence remain unchanged; active reopen wins', () => {
  const archive = record('F-001', { status: 'Closed' })
    .replace('| Effort |', '| Effort | Complete |')
    .replace('| 🟢 Small |', '| 🟢 Small | ~100% |');
  const sources = [
    { file: 'docs/archive/backlog-2026.md', text: archive },
    ...active(record('F-002', { deps: '[F-001](archive/backlog-2026.md#f-001) — release' })),
  ];
  assert.equal(queue(sources)[0].lane, 'Agent candidates');
  assert.equal(sources[0].text, archive);
  assert.doesNotMatch(render(sources), /~100%/);
  sources[1].text += record('F-001');
  assert.equal(queue(sources).find((r) => r.id === 'F-002').lane, 'Prerequisite review');
  const opaque = [
    { file: 'docs/archive/backlog-2026.md', text: '### F-001\n\nHistorical evidence only.\n' },
    ...active(record('F-002', { deps: '[F-001](archive/backlog-2026.md#f-001) — release' })),
  ];
  assert.equal(queue(opaque)[0].lane, 'Prerequisite review');
});
test('roadmap placement is explicit context; generated status/fenced examples/foreign records do not set order', () => {
  const sources = active(record('F-001') + record('F-002'));
  const roadmap =
    '| Milestone | Scope | Records | Acceptance |\n|---|---|---|---|\n| First | text | F-002, foreign:F-001 | check |\n| Second | text | F-001 | check |\n\n| Milestone | Status | Records |\n|---|---|---|\n| Generated | Open | F-001 |\n';
  assert.deepEqual(
    queue(sources, roadmap).map((r) => r.id),
    ['F-002', 'F-001'],
  );
  assert.match(render(sources, roadmap), /First/);
  assert.throws(
    () => queue(sources, roadmap + '\n| Milestone | Scope | Records |\n|---|---|---|\n| Third | text | F-001 |'),
    /multiple roadmap placements/,
  );
  const example = '````md\n```md\n' + roadmap + '\n```\n````\n';
  assert.deepEqual(
    queue(sources, example).map((r) => r.id),
    ['F-001', 'F-002'],
  );
});
test('malformed or duplicate authored ordering and legacy active completion fail explicitly', () => {
  for (const order of ['0 — invalid', '1', '-1 — invalid', '1.5 — invalid', '1000000 — invalid'])
    assert.throws(() => queue(active(record('F-001', { order }))), /Queue order/);
  assert.throws(
    () => queue(active(record('F-001', { order: '1 — first' }) + record('F-002', { order: '1 — also first' }))),
    /duplicate Queue order/,
  );
  const legacy = record('F-001').replace('| 🟢 Small |', '| 🟢 Small | ~20% |');
  assert.throws(() => queue(active(legacy)), /four columns/);
  assert.throws(() => queue(active(record('F-001', { deps: dep('F-999') }))), /missing dependency/);
  assert.throws(
    () => queue(active(record('F-001', { deps: dep('F-002') }) + record('F-002', { deps: dep('F-001') }))),
    /cycle/,
  );
});
test('CLI detects stale output, preserves source bytes and refuses unrelated files, flags and symlinks', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'queue fixture '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  mkdirSync(join(root, 'docs/archive'));
  const file = join(root, 'docs/BACKLOG.md'),
    output = join(root, 'docs/agents/backlog-queue.md'),
    input = record('F-001', { impact: 'Core correctness <script>' });
  writeFileSync(file, input);
  assert.throws(() => run(root, ['--check']), /stale/);
  run(root, []);
  run(root, ['--check']);
  assert.equal(readFileSync(file, 'utf8'), input);
  assert.match(readFileSync(output, 'utf8'), /Impact: Core correctness &lt;script&gt;/);
  assert.throws(() => run(root, ['--check', '--check']), /Use/);
  assert.throws(() => run(root, ['--unknown']), /Use/);
  writeFileSync(file, input + record('F-002'));
  assert.throws(() => run(root, ['--check']), /stale/);
  writeFileSync(output, 'Manual page');
  assert.throws(() => run(root, []), /non-generated/);
  rmSync(output);
  symlinkSync(join(root, 'not-created'), output);
  assert.throws(() => run(root, []), /Symlink/);
  assert.throws(() => readFileSync(join(root, 'not-created')), /ENOENT/);
  rmSync(output);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workQueue: { roadmap: '../outside.md' } }));
  assert.throws(() => run(root, []), /relative|inside/);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workQueue: { roadmap: 'missing.md' } }));
  assert.throws(() => run(root, []), /Missing/);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workQueue: { unknown: true } }));
  assert.throws(() => run(root, []), /Unknown/);
});
test('empty ledgers render all lanes without inventing ready work; active and roadmap symlinks are refused', (t) => {
  assert.deepEqual(queue([]), []);
  assert.match(render([]), /Agent candidates/);
  const root = mkdtempSync(join(tmpdir(), 'queue symlink '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  symlinkSync(join(root, 'missing'), join(root, 'docs/BACKLOG.md'));
  assert.throws(() => run(root, []), /Symlink/);
  rmSync(join(root, 'docs/BACKLOG.md'));
  writeFileSync(join(root, 'docs/BACKLOG.md'), record('F-001'));
  symlinkSync(join(root, 'missing'), join(root, 'docs/ROADMAP.md'));
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workQueue: { roadmap: 'docs/ROADMAP.md' } }));
  assert.throws(() => run(root, []), /Symlink/);
});

test('applied 4.0 template joins the validator, dependency reader and copied queue CLI', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'queue applied '));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'tools'), { recursive: true });
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  for (const name of ['check-backlog.mjs', 'backlog-queue.mjs', 'backlog-dependencies.mjs'])
    cpSync(new URL('../core/tools/' + name, import.meta.url), join(root, 'tools', name));
  const template = readFileSync(new URL('../core/docs/BACKLOG.md', import.meta.url), 'utf8')
    .replaceAll('{{YYYY-MM-DD}}', '2026-11-07')
    .replaceAll(/\{\{[^}]+\}\}/g, 'Neutral fixture');
  writeFileSync(join(root, 'docs/BACKLOG.md'), template);
  for (const name of ['check-backlog.mjs', 'backlog-dependencies.mjs', 'backlog-queue.mjs'])
    execFileSync(process.execPath, [join(root, 'tools', name)], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, [join(root, 'tools/backlog-queue.mjs'), '--check'], { cwd: root, stdio: 'pipe' });
  assert.equal(readFileSync(join(root, 'docs/BACKLOG.md'), 'utf8'), template);
});
