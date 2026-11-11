// Fixtures for check-tooling.mjs: a formatter check and a linter must exist as npm scripts and run in CI.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const tool = fileURLToPath(new URL('../core/tools/check-tooling.mjs', import.meta.url));
const CI = 'jobs:\n  check:\n    steps:\n      - run: npm run format:check\n      - run: npm run lint\n';
function project(t, files) {
  const dir = mkdtempSync(join(tmpdir(), 'harness tooling '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, 'tools'));
  cpSync(tool, join(dir, 'tools/check-tooling.mjs'));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), typeof content === 'string' ? content : JSON.stringify(content));
  }
  const r = spawnSync(process.execPath, [join(dir, 'tools/check-tooling.mjs')], { cwd: dir, encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}
const scripts = { 'format:check': 'prettier --check .', lint: 'eslint .' };

test('check-tooling: scripts that exist and run in CI pass', (t) => {
  const r = project(t, { 'package.json': { scripts }, '.github/workflows/ci.yml': CI });
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /"format:check" and "lint" exist and run in CI/);
});

test('check-tooling: a missing linter or formatter fails and names it', (t) => {
  const r = project(t, {
    'package.json': { scripts: { 'format:check': scripts['format:check'] } },
    '.github/workflows/ci.yml': CI,
  });
  assert.equal(r.code, 1);
  assert.match(r.out, /No "lint" npm script: the project has no linter/);
  const none = project(t, { 'package.json': { scripts: {} }, '.github/workflows/ci.yml': CI });
  assert.match(none.out, /No "format:check" npm script: the project has no formatter check/);
  assert.match(project(t, {}).out, /No package\.json/);
});

test('check-tooling: a script no workflow runs, or only in a commented step, fails', (t) => {
  const unused = project(t, {
    'package.json': { scripts },
    '.github/workflows/ci.yml': 'steps:\n  - run: npm run format:check\n  # - run: npm run lint\n',
  });
  assert.equal(unused.code, 1);
  assert.match(unused.out, /No CI workflow runs "npm run lint"/);
  assert.doesNotMatch(unused.out, /format:check"/);
  const prefix = project(t, {
    'package.json': { scripts },
    '.github/workflows/ci.yml': 'steps:\n  - run: npm run format:check\n  - run: npm run lint:docs\n',
  });
  assert.match(prefix.out, /No CI workflow runs "npm run lint"/, 'another script that starts with the name is not it');
  assert.equal(project(t, { 'package.json': { scripts } }).code, 1, 'no workflow at all');
});

test('check-tooling: renamed scripts are read from the stamp', (t) => {
  const r = project(t, {
    '.harness.json': { tooling: { format: 'style', lint: 'ng-lint' } },
    'package.json': { scripts: { style: 'prettier --check .', 'ng-lint': 'ng lint' } },
    '.github/workflows/ci.yml': 'steps:\n  - run: npm run style && npm run ng-lint\n',
  });
  assert.equal(r.code, 0, r.out);
});

test('check-tooling: an exemption needs a recorded reason', (t) => {
  const reason = 'Documentation-only repository: no source code to format or lint.';
  const ok = project(t, { '.harness.json': { tooling: { exempt: reason } } });
  assert.equal(ok.code, 0, ok.out);
  assert.match(ok.out, /exempt from formatter and linter \(Documentation-only/);
  const bare = project(t, { '.harness.json': { tooling: { exempt: 'n/a' } } });
  assert.equal(bare.code, 1);
  assert.match(bare.out, /needs a recorded reason/);
});
