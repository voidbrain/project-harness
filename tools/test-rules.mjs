// check-rules (core/tools/check-rules.mjs) against throwaway projects: the safety block in AGENTS, ask-first rules
// that only a procedure holds, AGENTS links that lead nowhere, and the length warning. Run with: npm run test:tools.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const core = fileURLToPath(new URL('../core/', import.meta.url));
const agents = (extra = '') => `## Checks before you finish

<!-- safety:start -->
**What the agent does on its own, and what it asks first.**
- On its own: branch, commit, open PRs.
- Asks first: repository settings; deleting what it did not create.
- Never: merge with a failing check.
${extra}<!-- safety:end -->

### Procedures: read before the task

| Before you | Read |
|---|---|
| update a record | [backlog rules](docs/BACKLOG-RULES.md) |
`;
function project(t, files) {
  const dir = mkdtempSync(join(tmpdir(), 'harness rules '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, 'tools'));
  cpSync(join(core, 'tools', 'check-rules.mjs'), join(dir, 'tools', 'check-rules.mjs'));
  for (const [p, c] of Object.entries({ 'AGENTS.md': agents(), 'docs/BACKLOG-RULES.md': '# Rules\n\nClose a record once its checks pass.\n', ...files })) {
    mkdirSync(dirname(join(dir, p)), { recursive: true });
    writeFileSync(join(dir, p), c);
  }
  const r = spawnSync(process.execPath, [join(dir, 'tools', 'check-rules.mjs')], { cwd: dir, encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

test('check-rules: the safety block with its ask-first and never rules, and procedures with none of their own, pass', (t) => {
  const r = project(t, { 'docs/agents/coverage-guide.md': '# Coverage\n\nNever rewrite the page as a side effect.\n\n```bash\n# Asks first: inside a code block is an example\n```\n' });
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /2 procedure document\(s\) add none of their own/);
});

test('check-rules: AGENTS without its safety block, or a block without Asks first / Never, fails', (t) => {
  let r = project(t, { 'AGENTS.md': agents().replace('<!-- safety:start -->\n', '') });
  assert.notEqual(r.code, 0);
  assert.match(r.out, /needs one <!-- safety:start --> … <!-- safety:end --> block/);
  r = project(t, { 'AGENTS.md': agents().replace('- Never: merge with a failing check.\n', '') });
  assert.notEqual(r.code, 0);
  assert.match(r.out, /the safety block has no "Never:" rules/);
});

test('check-rules: an ask-first rule only a procedure holds fails; in the safety block or citing AGENTS it passes', (t) => {
  const rule = '- Asks first: dropping a database table.\n';
  let r = project(t, { 'docs/agents/data.md': `# Data\n\n${rule}` });
  assert.notEqual(r.code, 0);
  assert.match(r.out, /docs\/agents\/data\.md:3: an ask-first or never rule only a procedure holds: "- Asks first: dropping a database table\."/);
  r = project(t, { 'docs/agents/data.md': '# Data\n\nThe agent asks the owner first before it drops a table.\n' });
  assert.notEqual(r.code, 0, 'a sentence form counts too');
  r = project(t, { 'docs/BACKLOG-RULES.md': '# Rules\n\nNever: close a bug without its test.\n' });
  assert.notEqual(r.code, 0, 'a never rule in the backlog rules');
  assert.equal(project(t, { 'AGENTS.md': agents('- Asks first: dropping a database table.\n'), 'docs/agents/data.md': `# Data\n\n${rule}` }).code, 0, 'also in the safety block');
  assert.equal(project(t, { 'docs/agents/data.md': '# Data\n\nDropping a table asks first (AGENTS, "What the agent does on its own").\n' }).code, 0, 'citing AGENTS');
  // a never rule in the middle of a paragraph, one that only mentions AGENTS, and a fragment of a block rule all fail
  assert.notEqual(project(t, { 'docs/agents/deploy.md': '# Deploy\n\nDeploys run from main. Never: force-push the release branch.\n' }).code, 0, 'mid-paragraph');
  assert.notEqual(project(t, { 'docs/agents/deploy.md': '# Deploy\n\nNever: edit AGENTS.md without the owner.\n' }).code, 0, 'a mention is not a citation');
  assert.notEqual(project(t, { 'docs/agents/deploy.md': '# Deploy\n\nNever: merge.\n' }).code, 0, 'a fragment of the block rule');
  assert.equal(project(t, { 'docs/agents/deploy.md': '# Deploy\n\nNever: merge with a failing check.\n' }).code, 0, 'the whole block rule');
  assert.equal(project(t, { 'docs/agents/deploy.md': '# Deploy\n\nWrap the "what it asks first" list in markers.\n' }).code, 0, 'a quoted title names a rule, it does not state one');
  // a root glob reaches root documents
  assert.notEqual(project(t, { '.harness.json': JSON.stringify({ rules: { procedures: ['*.md'] } }), 'DEPLOY.md': '- Asks first: deploying.\n' }).code, 0, 'root glob');
});

test('check-rules: an AGENTS link that leads nowhere fails; a long AGENTS warns; settings name the files', (t) => {
  let r = project(t, { 'AGENTS.md': agents().replace('docs/BACKLOG-RULES.md', 'docs/MISSING.md') });
  assert.notEqual(r.code, 0);
  assert.match(r.out, /AGENTS\.md: the link docs\/MISSING\.md leads nowhere/);
  r = project(t, { 'AGENTS.md': agents() + 'line\n'.repeat(200) });
  assert.equal(r.code, 0);
  assert.match(r.out, /! AGENTS\.md has 21\d lines \(rules\.maxLines 200\)/);
  r = project(t, { '.harness.json': JSON.stringify({ rules: { procedures: ['docs/agents/*.md'], maxLines: 500 } }), 'docs/BACKLOG-RULES.md': '- Asks first: anything.\n', 'AGENTS.md': agents() + 'line\n'.repeat(200) });
  assert.equal(r.code, 0, 'BACKLOG-RULES not configured as a procedure here; the limit raised');
  assert.doesNotMatch(r.out, /^! /m);
});
