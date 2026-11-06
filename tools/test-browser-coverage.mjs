// Optional browser and combined coverage (core/tools/browser-coverage.mjs, coverage-table.mjs): a hand-built bundle
// with a real source map and V8 block coverage stands in for a Chromium run, so the mapping, the duplicates, the
// unmatched sources and the combined count are checked without a browser. The collector is checked against a fake
// Playwright page (the contract it uses), not a real Chromium. Run with: npm run test:tools.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, combine, convert, counts, decodeMappings, lcovLines, startBrowserCoverage, stopBrowserCoverage } from '../core/tools/browser-coverage.mjs';

const core = fileURLToPath(new URL('../core/tools/', import.meta.url));
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const vlq = (n) => { let v = n < 0 ? (-n << 1) | 1 : n << 1, out = ''; do { let d = v & 31; v >>>= 5; if (v) d |= 32; out += B64[d]; } while (v); return out; };
// one segment per generated line: [source index, original line (0-based)] at column 0
const mappings = (lines) => { let src = 0, orig = 0; return lines.map(([s, o]) => { const seg = vlq(0) + vlq(s - src) + vlq(o - orig) + vlq(0); src = s; orig = o; return seg; }).join(';'); };

const SOURCES = ['webpack:///src/app/a.ts', './src/app/b.ts', 'webpack:///node_modules/lib/index.js', 'src/app/missing.ts'];
const GEN = ['function a() {', '  return 1;', '  if (x) { y(); }', 'function b() {}', 'lib();', 'gone();'];
const MAP = { version: 3, sources: SOURCES, mappings: mappings([[0, 0], [0, 1], [0, 2], [1, 0], [2, 0], [3, 0]]) };
const code = GEN.join('\n');
const start = (line) => GEN.slice(0, line).join('\n').length + (line ? 1 : 0);
// the whole script ran once, except the block on generated line 2 (a.ts line 3)
const fns = (block) => [{ functionName: '', isBlockCoverage: true, ranges: [{ startOffset: 0, endOffset: code.length, count: 1 }, { startOffset: start(2), endOffset: start(3), count: block }] }];
const inline = `${code}\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(JSON.stringify(MAP)).toString('base64')}`;

function repo(t) {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'browser coverage ')));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const [p, c] of Object.entries({ 'src/app/a.ts': 'a1\na2\na3\na4\na5\n', 'src/app/b.ts': 'b1\n' })) { mkdirSync(dirname(join(dir, p)), { recursive: true }); writeFileSync(join(dir, p), c); }
  return dir;
}

test('browser-coverage: source map decoding and V8 block counts (inner ranges override outer)', () => {
  assert.deepEqual(decodeMappings(MAP.mappings).map((l) => l[0]), [[0, 0, 0], [0, 0, 1], [0, 0, 2], [0, 1, 0], [0, 2, 0], [0, 3, 0]]);
  assert.deepEqual(decodeMappings('AAAA,EAAE;;CAAC'), [[[0, 0, 0], [2, 0, 0]], [], [[1, 0, 0]]]);
  const c = counts({ source: code, functions: fns(0) });
  assert.equal(c[start(1)], 1);
  assert.equal(c[start(2) + 3], 0);
  assert.equal(c[start(3)], 1);
});

test('browser-coverage: lines of the original files; vendor code left out, an unknown source and an unmapped script reported', (t) => {
  const dir = repo(t);
  const r = convert([{ url: 'http://localhost/main.js', source: inline, functions: fns(0) }, { url: 'http://localhost/raw.js', source: 'x()', functions: [] }], { rootDir: dir, folders: ['src/'] });
  assert.deepEqual([...r.files.keys()].sort(), ['src/app/a.ts', 'src/app/b.ts']);
  assert.deepEqual([...r.files.get('src/app/a.ts')], [[1, 1], [2, 1], [3, 0]]);
  assert.deepEqual([...r.files.get('src/app/b.ts')], [[1, 1]]);
  assert.deepEqual(r.unmatched, ['src/app/missing.ts'], 'node_modules is vendor code, not a mismatch');
  assert.deepEqual(r.unmapped, ['http://localhost/raw.js']);
});

test('browser-coverage: sourceRoot joins with a slash; bundler and virtual sources are neither matched nor reported; a bare name never matches by suffix', (t) => {
  const dir = repo(t);
  const map = { version: 3, sourceRoot: 'src', sources: ['app/a.ts', 'webpack/bootstrap', 'webpack:///webpack/runtime/x', 'angular:styles', '<define:x>', 'a.ts', 'lib/node_modules/y/a.ts'], mappings: mappings([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]) };
  const r = convert([{ url: 'u', source: code, sourceMap: map, functions: fns(1) }], { rootDir: dir, folders: ['src/'] });
  assert.deepEqual([...r.files.keys()], ['src/app/a.ts'], 'src + app/a.ts; "a.ts" alone is not attributed');
  assert.deepEqual(r.unmatched, ['a.ts'], 'only the bare name is a real mismatch');
});

test('browser-coverage: the same script in several runs is one file, a line ran if any run ran it; combined with unit LCOV counts each line once', (t) => {
  const dir = repo(t);
  const twice = convert([{ url: 'u', source: inline, functions: fns(0) }, { url: 'u', source: code, sourceMap: MAP, functions: fns(2) }], { rootDir: dir, folders: ['src/'] });
  assert.equal(twice.files.size, 2);
  assert.deepEqual([...twice.files.get('src/app/a.ts')], [[1, 2], [2, 2], [3, 2]]);
  const browser = convert([{ url: 'u', source: inline, functions: fns(0) }], { rootDir: dir, folders: ['src/'] }).files;
  const unit = lcovLines(`SF:${join(dir, 'src/app/a.ts')}\nDA:1,0\nDA:3,0\nDA:4,5\nDA:5,0\nend_of_record\n`, dir);
  const both = combine(unit, browser);
  // a.ts: the unit run's executable lines (1, 3, 4, 5), once each; 1 (browser) and 4 (unit) ran. Line 2, which only
  // the source map marks (an import, a decorator, a type), is not a line here; b.ts, which only the browser ran, keeps
  // the source map's lines
  assert.deepEqual([...both.get('src/app/a.ts')].sort(([x], [y]) => x - y).map(([l, h]) => [l, h > 0]), [[1, true], [3, false], [4, true], [5, false]]);
  assert.deepEqual([...both.get('src/app/b.ts')], [[1, 1]]);
  // LCOV written through a symlinked checkout still names the files here
  const link = join(dirname(dir), `${dir.split('/').pop()}-link`);
  symlinkSync(dir, link); t.after(() => rmSync(link, { force: true }));
  assert.deepEqual([...lcovLines(`SF:${join(link, 'src/app/a.ts')}\nDA:1,1\nend_of_record\n`, dir).keys()], ['src/app/a.ts']);
});

test('browser-coverage CLI: summaries from the raw runs; a missing run or LCOV is an error, not zero', (t) => {
  const dir = repo(t);
  mkdirSync(join(dir, 'tools'));
  cpSync(join(core, 'browser-coverage.mjs'), join(dir, 'tools', 'browser-coverage.mjs'));
  cpSync(join(core, 'coverage-table.mjs'), join(dir, 'tools', 'coverage-table.mjs'));
  const cfg = { summary: 'coverage/coverage-summary.json', folders: ['src/app/'], browser: {}, combined: {}, drop: 2 };
  writeFileSync(join(dir, '.harness.json'), JSON.stringify({ coverage: cfg }));
  const tool = (name, ...args) => { const r = spawnSync(process.execPath, [join(dir, 'tools', name), ...args], { cwd: dir, encoding: 'utf8' }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };
  let r = tool('browser-coverage.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /No browser coverage in coverage\/browser: run the browser tests with the collector/);
  mkdirSync(join(dir, 'coverage/browser'), { recursive: true });
  writeFileSync(join(dir, 'coverage/browser/test-1.json'), JSON.stringify([{ url: 'u', source: inline, functions: fns(0) }]));
  r = tool('browser-coverage.mjs');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Combined coverage needs the unit run's LCOV at coverage\/lcov\.info/);
  writeFileSync(join(dir, 'coverage/lcov.info'), `SF:${join(dir, 'src/app/a.ts')}\nDA:4,1\nDA:5,0\nLF:2\nLH:1\nend_of_record\n`);
  r = tool('browser-coverage.mjs');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /browser lines 75 %, combined lines 66\.67 %/); // browser 3 of 4 lines; combined 2 of 3: a.ts's executable lines 4 (ran) and 5, and b.ts line 1
  assert.match(r.out, /1 source\(s\) in the source maps match no file under the coverage folders \(left out\): src\/app\/missing\.ts/);
  const browser = JSON.parse(readFileSync(join(dir, 'coverage/browser-summary.json'), 'utf8'));
  assert.deepEqual([browser.total.lines.covered, browser.total.lines.total, browser.total.branches.total], [3, 4, 0]);
  // the unit table is unchanged; browser and combined get their own tables, page sections and baseline keys
  const m = (covered, total) => ({ total, covered, skipped: 0, pct: 0 });
  writeFileSync(join(dir, 'coverage/coverage-summary.json'), JSON.stringify({ total: {}, [join(dir, 'src/app/a.ts')]: { lines: m(1, 2), statements: m(1, 2), branches: m(0, 0), functions: m(0, 0) } }));
  assert.equal(tool('coverage-table.mjs', '--write').code, 0);
  const page = readFileSync(join(dir, 'docs/agents/coverage.md'), 'utf8');
  assert.match(page, /\| `src\/app\/` \| 1 \| 50\.0 % \|/);
  assert.match(page, /## Browser tests\n\nWhat the browser tests ran[\s\S]*?\| `src\/app\/` \| 2 \| 75\.0 % \| 75\.0 % \| – \| – \|/);
  assert.match(page, /## Combined\n\nWhat unit or browser tests ran, each line counted once[\s\S]*?\| \*\*all\*\* \| 2 \| 66\.7 % \|/);
  const base = JSON.parse(readFileSync(join(dir, 'docs/agents/coverage.json'), 'utf8'));
  assert.deepEqual(Object.keys(base).sort(), ['all', 'browser:all', 'browser:src/app/', 'combined:all', 'combined:src/app/', 'src/app/']);
  r = tool('coverage-table.mjs', '--check');
  assert.equal(r.code, 0);
  assert.match(r.out, /### Browser tests/);
  // a browser run that drops warns under its own name; a missing one is reported, and fails under enforce
  writeFileSync(join(dir, 'coverage/browser/test-1.json'), JSON.stringify([{ url: 'u', source: inline, functions: [{ ranges: [{ startOffset: 0, endOffset: code.length, count: 0 }] }] }]));
  tool('browser-coverage.mjs');
  assert.match(tool('coverage-table.mjs', '--check').out, /! browser src\/app\/: lines 75\.0 % → 0\.0 %/);
  rmSync(join(dir, 'coverage/browser-summary.json'));
  r = tool('coverage-table.mjs', '--check');
  assert.equal(r.code, 0);
  assert.match(r.out, /No browser coverage summary at coverage\/browser-summary\.json/);
  writeFileSync(join(dir, '.harness.json'), JSON.stringify({ coverage: { ...cfg, enforce: true } }));
  assert.notEqual(tool('coverage-table.mjs', '--check').code, 0);
});

test('browser-coverage collector: Chromium only; external source maps fetched and saved with the run', async (t) => {
  const dir = repo(t);
  await assert.rejects(startBrowserCoverage({}), /needs Chromium/);
  await assert.rejects(stopBrowserCoverage({ coverage: {} }, dir, 'x'), /needs Chromium/);
  let started;
  const page = { coverage: { startJSCoverage: async (o) => { started = o; }, stopJSCoverage: async () => [{ url: 'http://localhost/main.js', source: `${code}\n//# sourceMappingURL=main.js.map`, functions: fns(0) }] } };
  await startBrowserCoverage(page);
  assert.deepEqual(started, { resetOnNavigation: false });
  const fetched = [];
  const path = await stopBrowserCoverage(page, join(dir, 'coverage/browser'), 'suite › a test', async (url) => { fetched.push(url); return JSON.stringify(MAP); });
  assert.deepEqual(fetched, ['http://localhost/main.js.map']);
  assert.match(path, /suite_a_test-[0-9a-f]{8}\.json$/);
  const again = await stopBrowserCoverage(page, join(dir, 'coverage/browser'), 'suite › a test', async () => JSON.stringify({ ...MAP, sourcesContent: ['x'] }));
  assert.notEqual(again, path, 'a retry or a second page never overwrites a run');
  assert.equal(JSON.parse(readFileSync(again, 'utf8'))[0].sourceMap.sourcesContent, undefined, 'saved without the sources themselves');
  assert.equal(readdirSync(join(dir, 'coverage/browser')).length, 2);
  const saved = JSON.parse(readFileSync(path, 'utf8'));
  assert.deepEqual(saved[0].sourceMap, MAP);
  assert.equal(build(dir, { folders: ['src/'] }).browser.covered, 3);
  assert.throws(() => build(dir, {}), /Set coverage\.folders/);
});

test('coverage-table under enforce: adopting browser coverage starts its baseline; removing the setting cannot hide a baseline run', (t) => {
  const dir = repo(t);
  mkdirSync(join(dir, 'tools'));
  cpSync(join(core, 'coverage-table.mjs'), join(dir, 'tools', 'coverage-table.mjs'));
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.com', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.com' };
  const git = (...a) => spawnSync('git', a, { cwd: dir, env, encoding: 'utf8' });
  const m = (covered, total) => ({ total, covered, skipped: 0, pct: 0 });
  const summary = (covered) => JSON.stringify({ total: {}, [join(dir, 'src/app/a.ts')]: { lines: m(covered, 2), statements: m(covered, 2), branches: m(1, 1), functions: m(1, 1) } });
  const stamp = (extra) => writeFileSync(join(dir, '.harness.json'), JSON.stringify({ coverage: { summary: 'coverage/coverage-summary.json', folders: ['src/app/'], enforce: true, ...extra } }));
  const tool = (...args) => { const r = spawnSync(process.execPath, [join(dir, 'tools', 'coverage-table.mjs'), ...args], { cwd: dir, encoding: 'utf8' }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };
  mkdirSync(join(dir, 'coverage'));
  writeFileSync(join(dir, 'coverage/coverage-summary.json'), summary(1));
  stamp({});
  tool('--write');
  git('init', '-q', '-b', 'main'); git('add', '-A'); git('commit', '-q', '-m', 'unit baseline'); git('update-ref', 'refs/remotes/origin/main', 'HEAD');
  // the adoption PR: browser configured, main has no browser rows yet
  stamp({ browser: {} });
  writeFileSync(join(dir, 'coverage/browser-summary.json'), summary(2));
  let r = tool('--check');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /browser coverage has no baseline on the default branch yet: this run starts it/);
  tool('--write'); git('add', '-A'); git('commit', '-q', '-m', 'browser baseline'); git('update-ref', 'refs/remotes/origin/main', 'HEAD');
  assert.equal(tool('--check').code, 0);
  // a later PR drops the setting: the main baseline's browser rows would go unchecked
  stamp({});
  r = tool('--check');
  assert.notEqual(r.code, 0);
  assert.match(r.out, /The baseline has browser coverage but coverage\.browser is not configured/);
});
