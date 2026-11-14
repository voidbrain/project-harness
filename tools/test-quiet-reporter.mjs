// F-077-T02: the quiet reporter prints failures in full with what their file logged, and one totals line; the spec
// report written beside it keeps everything. Invented test files in a temporary folder.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const reporter = fileURLToPath(new URL('../core/tools/quiet-reporter.mjs', import.meta.url));
const runner = (dir, files) =>
  spawnSync(
    process.execPath,
    [
      '--test',
      `--test-reporter=${reporter}`,
      '--test-reporter-destination=stdout',
      '--test-reporter=spec',
      '--test-reporter-destination=.test-report.txt',
      ...files,
    ],
    { cwd: dir, encoding: 'utf8', env: { ...process.env, NODE_TEST_CONTEXT: undefined } },
  );

const SOURCE = (fail) => `import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
test('adds numbers', () => { console.log('log of a passing test'); assert.equal(1 + 1, 2); });
describe('totals', () => {
  test('rounds a share', () => { console.log('share before rounding: 0.335'); assert.equal(${fail ? '0.33' : '0.34'}, 0.34); });
});
`;

test('quiet reporter: a failure and its file output are printed; the full report keeps passing logs', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'quiet reporter '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(join(dir, 'shares.test.mjs'), SOURCE(true));
  const r = runner(dir, ['shares.test.mjs']);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /^✖ rounds a share \(shares\.test\.mjs:5\)\n {2}AssertionError/);
  assert.match(r.stdout, /0\.33 !== 0\.34/);
  assert.match(
    r.stdout,
    /Output of shares\.test\.mjs:\n {2}log of a passing test\n {2}share before rounding: 0\.335\n/,
  );
  assert.doesNotMatch(r.stdout, /node:internal/, 'no stack frames from inside Node');
  assert.doesNotMatch(r.stdout, /✖ totals/, 'the suite is not reported again for its subtest');
  assert.match(r.stdout, /\n✖ tests 2, suites 1, pass 1, fail 1, \d+ ms\n$/);
  const full = readFileSync(join(dir, '.test-report.txt'), 'utf8');
  assert.match(full, /adds numbers/);
  assert.match(full, /log of a passing test/);
});

test('quiet reporter: a passing run is one line', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'quiet reporter '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(join(dir, 'shares.test.mjs'), SOURCE(false));
  const r = runner(dir, ['shares.test.mjs']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /^✔ tests 2, suites 1, pass 2, fail 0, \d+ ms\n$/);
  assert.match(readFileSync(join(dir, '.test-report.txt'), 'utf8'), /share before rounding/);
});

test('quiet reporter: a failing todo test is not reported as a failure (release review)', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'quiet reporter '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(
    join(dir, 'todo.test.mjs'),
    "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\ntest('later', { todo: true }, () => assert.equal(1, 2));\n",
  );
  const r = runner(dir, ['todo.test.mjs']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.doesNotMatch(r.stdout, /^✖ later/m);
  assert.match(r.stdout, /^✔ tests 1, fail 0, todo 1, \d+ ms\n$/);
});
