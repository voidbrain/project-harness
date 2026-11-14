// F-076-T01: rule-load measurement, on invented files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, symlinkSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('../core/tools/rule-load.mjs', import.meta.url));
const { ruleLoad, reads, routingRows, section, slug, estimate, commandCounter, format, overBudget } = await import(
  tool
);

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
  assert.equal(r.method, 'tokenizer command: wc -w', 'the report names the command that counted');
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

test('review fixes: underscores, fences, closing hashes, escaped pipes, paths above the root', () => {
  assert.equal(slug('snake_case name'), 'snake_case-name');
  const fenced = '~~~\n```\n~~~\n## X ##\nbody\n';
  assert.equal(
    section(fenced, (t) => t === 'X'),
    '## X ##\nbody\n',
    'a ~~~ fence is not closed by ```',
  );
  const rows = routingRows('| Before you | Read |\n|---|---|\n| read a \\| b | [d](docs/a\\|b.md) |\n');
  assert.equal(rows[0].trigger, 'read a | b');
  assert.deepEqual(reads(rows[0].cell), [{ path: 'docs/a|b.md', anchor: null, named: null }]);
  assert.deepEqual(reads('[up](../../etc/x.md) [abs](/etc/x.md) [in](docs/../docs/x.md)'), [
    { path: 'docs/x.md', anchor: null, named: null },
  ]);
});

test('a named section that is not there counts nothing and is reported', () => {
  const { root } = project();
  writeFileSync(
    join(root, 'AGENTS.md'),
    '| Before you | Read |\n|---|---|\n| plan | [rules](docs/BACKLOG-RULES.md#no-such-section) |\n',
  );
  const [plan] = ruleLoad(root).triggers;
  assert.deepEqual(plan.reads, [
    { path: 'docs/BACKLOG-RULES.md', section: 'no-such-section', missing: true, tokens: 0 },
  ]);
  assert.equal(plan.tokens, 0);
});

test('rules.always and rules.procedures settings', () => {
  const { root } = project();
  writeFileSync(join(root, 'MEMORY.md'), 'm'.repeat(40));
  writeFileSync(
    join(root, '.harness.json'),
    JSON.stringify({ rules: { always: ['MEMORY.md'], procedures: ['docs/agents/task.md'] } }),
  );
  const r = ruleLoad(root);
  assert.deepEqual(
    r.always.files.map((f) => f.path),
    ['AGENTS.md', 'CLAUDE.md', 'MEMORY.md'],
  );
  assert.deepEqual(
    r.procedures.files.map((p) => p.path),
    ['docs/agents/task.md'],
  );
});

test('the command line runs through a symlink and with --tokenizer', () => {
  const { root } = project();
  const link = join(root, 'link.mjs');
  symlinkSync(tool, link);
  assert.match(execFileSync(process.execPath, [link], { cwd: root, encoding: 'utf8' }), /By trigger/);
  const json = JSON.parse(
    execFileSync(process.execPath, [tool, '--json', '--tokenizer=wc -c'], { cwd: root, encoding: 'utf8' }),
  );
  assert.equal(json.method, 'tokenizer command: wc -c');
});

test('budgets: warnings name what is over, and --check never fails', () => {
  const { root } = project();
  writeFileSync(
    join(root, '.harness.json'),
    JSON.stringify({ rules: { budgets: { always: 10, procedure: 600, trigger: 120 } } }),
  );
  const r = ruleLoad(root);
  assert.deepEqual(r.budgets, { always: 10, procedure: 600, trigger: 120 });
  const found = overBudget(r);
  assert.ok(found.some((w) => /^always-loaded rules are/.test(w)));
  assert.ok(found.some((w) => /docs\/agents\/mcp\.md is .* over the 600 budget/.test(w)));
  assert.ok(found.some((w) => /"switch tasks" reads/.test(w)));
  const out = execFileSync(process.execPath, [tool, '--check'], { cwd: root, encoding: 'utf8' });
  assert.match(out, /over budget \(a warning, not a failure\)/);
  writeFileSync(join(root, '.harness.json'), '{}');
  assert.match(execFileSync(process.execPath, [tool, '--check'], { cwd: root, encoding: 'utf8' }), /within budgets/);
});

test('docs/backlog files are procedures by default', () => {
  const { root } = project();
  mkdirSync(join(root, 'docs/backlog'));
  writeFileSync(join(root, 'docs/backlog/records.md'), '# Records\n');
  assert.ok(ruleLoad(root).procedures.files.some((p) => p.path === 'docs/backlog/records.md'));
});

// B-025 (CodeQL js/incomplete-sanitization in NERV #404): a procedures pattern with regular-expression characters
// in its file part matches its file literally, and only that file.
test('a procedures pattern matches regular-expression characters literally', () => {
  const root = mkdtempSync(join(tmpdir(), 'rule-load-glob-'));
  mkdirSync(join(root, 'docs/notes'), { recursive: true });
  writeFileSync(join(root, 'AGENTS.md'), '# Agents\n');
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ rules: { procedures: ['docs/notes/plan(v1)+*.md'] } }));
  writeFileSync(join(root, 'docs/notes/plan(v1)+a.md'), '# A\n');
  writeFileSync(join(root, 'docs/notes/planv1a.md'), '# B\n');
  writeFileSync(join(root, 'docs/notes/planv11a.md'), '# C\n');
  assert.deepEqual(
    ruleLoad(root).procedures.files.map((f) => f.path),
    ['docs/notes/plan(v1)+a.md'],
  );
});

test('slug drops nested tag fragments', () => {
  assert.equal(slug('Release <<b>b>notes</b>'), 'release-notes');
});

// B-026: a page a tool writes (its first line says so) is looked up, not read by a route: it has no procedure budget.
test('a generated page is not held to the procedure-file budget', () => {
  const root = mkdtempSync(join(tmpdir(), 'rule-load-generated-'));
  mkdirSync(join(root, 'docs/agents'), { recursive: true });
  writeFileSync(join(root, 'AGENTS.md'), '# Agents\n');
  writeFileSync(
    join(root, 'docs/agents/impact-map.md'),
    '<!-- Written by tools/impact-map.mjs from the "impact" rows of .harness.json: change the rows, then run it. -->\n# Map\n\n' +
      'row\n'.repeat(3000),
  );
  writeFileSync(join(root, 'docs/agents/guide.md'), '# Guide\n\n' + 'x'.repeat(9000) + '\n');
  const warnings = overBudget(ruleLoad(root));
  assert.ok(!warnings.some((w) => w.includes('impact-map.md')), warnings.join('\n'));
  assert.ok(
    warnings.some((w) => w.includes('guide.md')),
    'an ordinary file over budget is still reported',
  );
});
