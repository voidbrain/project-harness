// F-076-T01: rule-load measurement, on invented files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('../core/tools/rule-load.mjs', import.meta.url));
const { ruleLoad, reads, routingRows, section, slug, estimate, commandCounter, format } = await import(tool);

function project() {
  const root = mkdtempSync(join(tmpdir(), 'rule-load-'));
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  const agents = [
    '# Agents',
    '',
    'Always text.',
    '',
    '| Before you | Read |',
    '|---|---|',
    '| switch tasks | [Task context](docs/agents/task.md) |',
    '| close a record | [rules](docs/BACKLOG-RULES.md#closure-and-archives) |',
    '| set up | [MCP](docs/agents/mcp.md), "In short" |',
    '| do nothing | plain text, no link |',
    '| read a ghost | [gone](docs/agents/gone.md) |',
    '',
    'After the table.',
  ].join('\n');
  writeFileSync(join(root, 'AGENTS.md'), agents);
  writeFileSync(join(root, 'CLAUDE.md'), '@AGENTS.md\n');
  writeFileSync(join(root, 'docs/agents/task.md'), '# Task\n\n' + 'x'.repeat(400) + '\n');
  writeFileSync(
    join(root, 'docs/agents/mcp.md'),
    '# MCP\n\n## In short\n\n' + 'a'.repeat(80) + '\n\n## Details\n\n' + 'b'.repeat(4000) + '\n',
  );
  writeFileSync(
    join(root, 'docs/BACKLOG-RULES.md'),
    '# Rules\n\n## Records\n\n' + 'r'.repeat(2000) + '\n\n## Closure and archives\n\n' + 'c'.repeat(200) + '\n',
  );
  return { root, agents };
}

test('routing rows and their links, with anchors and quoted section names', () => {
  const { agents } = project();
  const rows = routingRows(agents);
  assert.deepEqual(
    rows.map((r) => r.trigger),
    ['switch tasks', 'close a record', 'set up', 'do nothing', 'read a ghost'],
  );
  assert.deepEqual(reads(rows[1].cell), [
    { path: 'docs/BACKLOG-RULES.md', anchor: 'closure-and-archives', named: null },
  ]);
  assert.deepEqual(reads(rows[2].cell), [{ path: 'docs/agents/mcp.md', anchor: null, named: 'In short' }]);
  assert.deepEqual(reads('[site](https://example.com/a.md) [img](x.png)'), []);
  assert.equal(slug('Closure and archives'), 'closure-and-archives');
  assert.equal(slug('Optional `upfront` feature plans!'), 'optional-upfront-feature-plans');
});

test('a section runs to the next heading of the same or a higher level, ignoring code fences', () => {
  const text = '# A\n## B\none\n### C\ntwo\n```\n## not a heading\n```\n## D\nthree\n';
  assert.equal(
    section(text, (t) => t === 'B'),
    '## B\none\n### C\ntwo\n```\n## not a heading\n```',
  );
  assert.equal(
    section(text, (t) => t === 'Z'),
    null,
  );
});

test('always-loaded set, per-trigger totals and procedure files', () => {
  const { root, agents } = project();
  const r = ruleLoad(root, { withSections: true });
  assert.equal(r.method, 'characters ÷ 4');
  assert.deepEqual(
    r.always.files.map((f) => f.path),
    ['AGENTS.md', 'CLAUDE.md'],
  );
  assert.equal(r.always.tokens, estimate(agents) + estimate('@AGENTS.md\n'));
  const [task, close, setup, none, ghost] = r.triggers;
  assert.equal(task.tokens, estimate('# Task\n\n' + 'x'.repeat(400) + '\n'));
  assert.equal(task.total, r.always.tokens + task.tokens);
  assert.equal(close.reads[0].section, 'closure-and-archives');
  assert.ok(close.tokens < 100, 'only the closure section counts, not the whole rules file');
  assert.equal(setup.reads[0].section, 'In short');
  assert.ok(setup.tokens < 50, 'only "In short" counts');
  assert.equal(none.tokens, 0);
  assert.deepEqual(ghost.reads, [{ path: 'docs/agents/gone.md', missing: true, tokens: 0 }]);
  assert.deepEqual(
    r.procedures.files.map((p) => p.path),
    ['docs/BACKLOG-RULES.md', 'docs/agents/mcp.md', 'docs/agents/task.md'],
  );
  assert.equal(r.procedures.files[0].sections[0].title, 'Records', 'largest section first');
  const text = format(r);
  assert.match(text, /Always loaded:/);
  assert.match(text, /read a ghost: docs\/agents\/gone\.md \(not found\)/);
});

test('an exact count through a tokenizer command, and a failing command is reported', () => {
  const { root } = project();
  const words = commandCounter('wc -w');
  const r = ruleLoad(root, { count: words });
  assert.equal(r.method, 'tokenizer command');
  assert.equal(r.always.files[1].tokens, 1, 'CLAUDE.md is one word');
  assert.throws(() => commandCounter('exit 3')('text'), /Tokenizer command failed/);
});

test('the command line prints the report and JSON', () => {
  const { root } = project();
  const out = execFileSync(process.execPath, [tool], { cwd: root, encoding: 'utf8' });
  assert.match(out, /By trigger/);
  const json = JSON.parse(execFileSync(process.execPath, [tool, '--json'], { cwd: root, encoding: 'utf8' }));
  assert.equal(json.triggers.length, 5);
});
