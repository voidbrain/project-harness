// The agent-behaviour checks (core/tools/behaviour.mjs): every scenario's grader passes a rule-following result and
// fails a typical mistake (tools/behaviour-examples.mjs), on fixtures built from the template's own rule files; `run`
// reports per scenario with a scripted runner standing in for an agent. Run with: npm run test:tools.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENARIOS, grade, prepare, run } from '../core/tools/behaviour.mjs';
import { EXAMPLES } from './behaviour-examples.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const core = fileURLToPath(new URL('../core/', import.meta.url));
const tmp = (t, name) => { const d = mkdtempSync(join(tmpdir(), `${name} `)); t.after(() => rmSync(d, { recursive: true, force: true })); return d; };
// a project whose rule files are the template's (as this repository configures behaviour.rules)
function project(t, behaviour = {}) {
  const root = tmp(t, 'behaviour project');
  for (const [to, from] of [['AGENTS.md', 'AGENTS.md'], ['CLAUDE.md', 'CLAUDE.md'], ['docs/BACKLOG-RULES.md', 'docs/BACKLOG-RULES.md'], ['tools/check-backlog.mjs', 'tools/check-backlog.mjs']]) {
    mkdirSync(join(root, to, '..'), { recursive: true });
    cpSync(join(core, from), join(root, to));
  }
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ behaviour }));
  return root;
}

test('behaviour: about ten scenarios, each with a rule, a task, files and a grader, and an example of each outcome', () => {
  assert.ok(SCENARIOS.length >= 10);
  assert.equal(new Set(SCENARIOS.map((s) => s.id)).size, SCENARIOS.length);
  for (const s of SCENARIOS) {
    assert.ok(s.rule && s.task && s.files && typeof s.grade === 'function', s.id);
    assert.ok(EXAMPLES[s.id]?.good && EXAMPLES[s.id]?.bad, `${s.id}: examples`);
  }
});

for (const s of SCENARIOS) {
  test(`behaviour: ${s.id} passes the rule-following result and fails the mistake`, async (t) => {
    const root = project(t);
    for (const [kind, expected] of [['good', true], ['bad', false]]) {
      const dir = tmp(t, `behaviour ${s.id} ${kind}`);
      const { repo } = prepare(root, s.id, dir);
      // the fixture carries the project's rules, neutralised placeholders, and passes check-backlog as prepared
      assert.doesNotMatch(readFileSync(join(repo, 'AGENTS.md'), 'utf8'), /\{\{|<!-- harness:/);
      assert.equal(spawnSync(process.execPath, ['tools/check-backlog.mjs'], { cwd: repo }).status, 0, `${s.id}: fixture backlog is valid`);
      writeFileSync(join(dir, 'transcript.txt'), EXAMPLES[s.id][kind](repo));
      const g = await grade(s.id, dir);
      assert.equal(g.pass, expected, `${s.id} ${kind}: ${g.why.join('; ')}`);
      if (!expected) assert.ok(g.why.length, `${s.id}: a failure says why`);
    }
  });
}

test('behaviour run: per scenario, N times each, through the configured runner; exits on a failing scenario', async (t) => {
  const agent = join(tmp(t, 'behaviour agent'), 'agent.mjs');
  // a scripted "agent": the good example, except the bad one for one scenario on its second run
  writeFileSync(agent, `import { EXAMPLES } from ${JSON.stringify(join(here, 'behaviour-examples.mjs'))};
import { existsSync, writeFileSync } from 'node:fs';
const id = process.env.HARNESS_SCENARIO;
const second = existsSync(process.env.FLAGS + '/' + id); writeFileSync(process.env.FLAGS + '/' + id, '');
process.stdout.write(EXAMPLES[id][id === 'bug-is-b-record' && second ? 'bad' : 'good'](process.cwd()));
`);
  const flags = tmp(t, 'behaviour flags');
  process.env.FLAGS = flags;
  t.after(() => delete process.env.FLAGS);
  const root = project(t, { runner: `node ${JSON.stringify(agent)}` });
  const results = await run(root, { scenarios: ['bug-is-b-record', 'no-push-to-main', 'report-failing-test'], times: 2 });
  assert.deepEqual(results.map((r) => [r.scenario, r.passed, r.runs]), [['bug-is-b-record', 1, 2], ['no-push-to-main', 2, 2], ['report-failing-test', 2, 2]]);
  assert.match(results[0].failures.join(), /recorded as a feature/);
  // a runner that fails or hangs ran no agent: a failed run, never graded (copied-tool-untouched would pass untouched)
  let r = await run(project(t, { runner: 'exit 127' }), { scenarios: ['copied-tool-untouched'], times: 1 });
  assert.deepEqual([r[0].passed, r[0].failures], [0, ['runner exited with 127']]);
  r = await run(project(t, { runner: 'sh -c "sleep 30" & sleep 30', timeoutMs: 300 }), { scenarios: ['copied-tool-untouched'], times: 1 });
  assert.deepEqual([r[0].passed, r[0].failures], [0, ['runner timed out after 300 ms']]);
  await assert.rejects(run(project(t), {}), /No agent runner/);
  await assert.rejects(run(root, { times: 0 }), /positive whole number/);
  await assert.rejects(run(root, { scenarios: ['nope'] }), /Unknown scenario nope/);
});

test('behaviour: failing-test-first accepts a .js test that imports a new helper, judged against the source without the fix', async (t) => {
  const root = project(t), dir = tmp(t, 'behaviour helper');
  const { repo } = prepare(root, 'failing-test-first', dir);
  writeFileSync(join(repo, 'src/empty.mjs'), 'export const EMPTY = [];\n');
  writeFileSync(join(repo, 'test/empty.test.js'), "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { sum } from '../src/math.mjs';\nimport { EMPTY } from '../src/empty.mjs';\n\ntest('sum of nothing is 0', () => assert.equal(sum(EMPTY), 0));\n");
  assert.equal((await grade('failing-test-first', dir)).pass, false, 'not fixed yet: the test fails with the result too');
  writeFileSync(join(repo, 'src/math.mjs'), readFileSync(join(repo, 'src/math.mjs'), 'utf8').replace('a + b)', 'a + b, 0)'));
  const g = await grade('failing-test-first', dir);
  assert.equal(g.pass, true, g.why.join('; '));
});

test('behaviour CLI: list, prepare and grade; prepare refuses a used folder', (t) => {
  const root = project(t);
  mkdirSync(join(root, 'tools'), { recursive: true });
  cpSync(join(core, 'tools', 'behaviour.mjs'), join(root, 'tools', 'behaviour.mjs'));
  const cli = (...args) => spawnSync(process.execPath, [join(root, 'tools', 'behaviour.mjs'), ...args], { cwd: root, encoding: 'utf8' });
  assert.match(cli('list').stdout, /ask-human-decision\s+Asks first/);
  const dir = tmp(t, 'behaviour cli');
  assert.match(cli('prepare', 'copied-tool-untouched', dir).stdout, /Prepared copied-tool-untouched/);
  assert.notEqual(cli('prepare', 'copied-tool-untouched', dir).status, 0);
  const g = cli('grade', 'copied-tool-untouched', dir);
  assert.equal(g.status, 0, g.stdout + g.stderr);
  assert.notEqual(cli('grade', 'name-the-pr', dir).status, 0, 'a fixture is graded only for its own scenario');
});
