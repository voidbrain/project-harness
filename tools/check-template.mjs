// This repository's own consistency check (AGENTS, Checks before you finish): one version everywhere, copied tools
// identical to core/tools, every stamp entry pointing at a real file, valid syntax, and working links in the root docs.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const problems = [];
const walk = (dir, test, out = []) => {
  for (const name of readdirSync(join(root, dir))) {
    const path = join(dir, name);
    if (name === '.git' || name === 'node_modules') continue;
    if (statSync(join(root, path)).isDirectory()) walk(path, test, out);
    else if (test(name)) out.push(path);
  }
  return out;
};

// 1. one version: VERSION, the newest CHANGELOG heading, this repository's .harness.json and package.json
const version = read('VERSION').trim();
const changelog = read('CHANGELOG.md').match(/^## (\d+\.\d+\.\d+), \d{4}-\d{2}-\d{2}$/m)?.[1];
const stamp = JSON.parse(read('.harness.json'));
if (changelog !== version)
  problems.push(`VERSION ${version} but the newest CHANGELOG entry is ${changelog ?? 'missing'}`);
if (stamp.version !== version) problems.push(`VERSION ${version} but .harness.json names ${stamp.version}`);
const pkg = JSON.parse(read('package.json')).version;
if (pkg !== version) problems.push(`VERSION ${version} but package.json names ${pkg}`);

// 2. this repository's copied tools are the template's
for (const [path, source] of Object.entries(stamp.copied ?? {}))
  if (!existsSync(join(root, path)) || read(path) !== read(source))
    problems.push(`${path} differs from ${source}: copy it`);

// 3. every file a stamp names exists in the template
for (const file of ['core/.harness.json', ...walk('.', (n) => n === '.harness.fragment.json')]) {
  const s = JSON.parse(read(file));
  for (const sources of [...Object.values(s.copied ?? {}), ...Object.values(s.adapted ?? {})])
    for (const source of [sources].flat())
      if (!existsSync(join(root, source))) problems.push(`${file} names ${source}, which does not exist`);
}

// 3b. a page every project receives never links to one that only a stack's fragment copies: a dead link in every
// project without that stack (B-129); it names such a page as a path instead
{
  const coreStamp = JSON.parse(read('core/.harness.json'));
  const everywhere = new Set(Object.keys(coreStamp.copied ?? {}));
  const stackOnly = new Set(
    walk('.', (n) => n === '.harness.fragment.json')
      .flatMap((f) => Object.keys(JSON.parse(read(f)).copied ?? {}))
      .filter((p) => !everywhere.has(p)),
  );
  for (const [dest, source] of Object.entries(coreStamp.copied ?? {}))
    if (dest.endsWith('.md'))
      for (const [, url] of read(source)
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`\n]*`/g, '')
        .matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g))
        if (stackOnly.has(normalize(join(dirname(dest), url))))
          problems.push(`${source} links ${url}, which only a stack fragment copies: name it as a path`);
}

// 4. syntax: every script and JSON file
for (const file of walk('.', (n) => n.endsWith('.mjs')))
  try {
    execFileSync(process.execPath, ['--check', join(root, file)], { stdio: 'pipe' });
  } catch (e) {
    problems.push(`${file}: ${String(e.stderr).split('\n').find(Boolean)}`);
  }
for (const file of walk('.', (n) => n.endsWith('.json')).filter((f) => !f.includes('.vscode/')))
  // VS Code files are JSON with comments
  try {
    JSON.parse(read(file));
  } catch (e) {
    problems.push(`${file}: ${e.message}`);
  }

// F-096-T03: the one shipped workflow that may write, as reviewed (comments and blank lines aside). Change it only with
// a fresh security review: no other trigger, job, permission, step, expression or push. F-100: the hooks run in the
// read-only `build` job (no stored credentials); `publish` only pushes the ledger `build` prepared.
const PUBLISH_WORKFLOW = `name: Backlog views
on:
  push:
    branches: [main]
permissions:
  contents: read
concurrency:
  group: backlog-views
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1
        with:
          node-version: 22
      - name: Build the views and run the publish hooks
        run: node tools/work-items.mjs publish --prepare
      - uses: actions/upload-artifact@cf430e030ddbb5b0abf93d22962f4752f3646cd9
        with:
          name: backlog-views-prepared
          path: docs/BACKLOG.md
          if-no-files-found: error
          retention-days: 1
  publish:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
        with:
          fetch-depth: 0
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1
        with:
          node-version: 22
      - uses: actions/download-artifact@37930b1c2abaa49bbe596cd826c3c89aef350131
        with:
          name: backlog-views-prepared
          path: \${{ runner.temp }}/backlog-views
      - name: Publish the prepared views on backlog-views
        env:
          GIT_AUTHOR_NAME: github-actions[bot]
          GIT_AUTHOR_EMAIL: 41898282+github-actions[bot]@users.noreply.github.com
          GIT_COMMITTER_NAME: github-actions[bot]
          GIT_COMMITTER_EMAIL: 41898282+github-actions[bot]@users.noreply.github.com
        run: node tools/work-items.mjs publish --ledger="$RUNNER_TEMP/backlog-views/BACKLOG.md"`;
// 5. shipped workflows keep the reviewed least-permission and immutable-action contract
for (const file of [
  '.github/workflows/ci.yml',
  '.github/workflows/maintenance.yml',
  'core/.github/workflows/maintenance.yml',
  'angular/.github/workflows/ci.yml',
  'solution/.github/workflows/ci.yml',
  'core/.github/workflows/backlog-views.yml',
]) {
  let workflow = read(file);
  // F-096-T03 (owner decision 2026-11-25, option A): exactly one job may write, the backlog-views publisher, on push to
  // main only, serialised, with one step that runs work-items publish. Its text (comments aside) must be exactly the
  // reviewed one below; the writing lines are then removed so the read-only contract applies as to any other file.
  if (file === 'core/.github/workflows/backlog-views.yml') {
    const code = workflow
      .split('\n')
      .filter((line) => !/^\s*#/.test(line))
      .map((line) => line.replace(/\s+#.*$/, ''))
      .join('\n')
      .replace(/\n{2,}/g, '\n')
      .trim();
    if (code !== PUBLISH_WORKFLOW)
      problems.push(
        `${file}: must be exactly the reviewed backlog-views publisher (owner decision 2026-11-25, option A)`,
      );
    workflow = workflow.replace('    permissions:\n      contents: write\n', '');
  }
  const permissions = workflow.match(/^permissions:\n((?: {2}[^\n]+\n)+)/m)?.[1];
  if (permissions !== '  contents: read\n' || /^ {4}permissions:/m.test(workflow))
    problems.push(`${file}: workflow permissions must be limited to top-level contents: read`);
  if (/pull_request_target\b|\$\{\{\s*secrets\./.test(workflow))
    problems.push(`${file}: do not use pull_request_target or workflow secrets in shipped CI`);
  for (const line of workflow.split('\n').filter((row) => /^\s+-\s+uses:/.test(row))) {
    if (!/^\s+-\s+uses:\s+[\w.-]+\/[\w.-]+@[0-9a-f]{40}\s+#\s+v\d+\.\d+\.\d+\s*$/.test(line))
      problems.push(`${file}: pin every action to a full commit SHA with its release tag comment`);
  }
}
for (const file of ['.github/workflows/ci.yml', 'angular/.github/workflows/ci.yml']) {
  const workflow = read(file);
  if (
    !workflow.includes('npm sbom --sbom-format cyclonedx > sbom.cdx.json') ||
    !workflow.includes('uses: actions/upload-artifact@') ||
    !workflow.includes('path: sbom.cdx.json')
  )
    problems.push(`${file}: generate and upload a CycloneDX SBOM artifact`);
}

// 6. the root docs: no placeholders or agent notes, and every local link resolves (template files under core/ and
// angular/ are exempt: their placeholders are deliberate and their links are relative to an applied project)
const docs = walk('.', (n) => n.endsWith('.md')).filter((f) => !/^(core|angular|solution)\//.test(f));
for (const file of docs) {
  const prose = read(file)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');
  if (/\{\{[A-Z_]+\}\}|<!-- harness:/.test(prose))
    problems.push(`${file}: placeholder or harness note left in a root document`);
  for (const [, url] of prose.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g))
    if (!/^[a-z]+:/.test(url) && !existsSync(normalize(join(root, dirname(file), url))))
      problems.push(`${file}: broken link ${url}`);
}

// 7. the template's AGENTS skeleton keeps its safety block, and its procedure guides add no rule of their own
const { checkRules } = await import(new URL('../core/tools/check-rules.mjs', import.meta.url).href);
for (const p of checkRules(join(root, 'core')).problems) problems.push(`core/${p}`);

// 7b. this repository's own safety block is core/AGENTS.md's, word for word, plus marked project lines (B-128)
{
  const { safetyBlockDrift } = await import(new URL('./safety-block.mjs', import.meta.url).href);
  problems.push(...safetyBlockDrift(read('AGENTS.md'), read('core/AGENTS.md')));
}

// 8. every npm script a core procedure names exists where adoption gets it from
{
  const have = new Set([
    ...Object.keys(JSON.parse(read('package.json')).scripts),
    ...Object.keys(JSON.parse(read('core/package-scripts.json'))),
    ...Object.keys(JSON.parse(read('angular/package-scripts.json'))),
  ]);
  const core = new Set(Object.keys(JSON.parse(read('core/package-scripts.json'))));
  const stackOwned = new Set(['coverage', 'check:conventions', 'lint', 'format', 'format:check']);
  for (const file of walk('core', (n) => n.endsWith('.md'))) {
    for (const [, name] of read(file).matchAll(/npm run ([a-z][a-z0-9:-]*)/g)) {
      if (!have.has(name))
        problems.push(`${file} names npm run ${name}, which no package.json or package-scripts.json has`);
      else if (!core.has(name) && !stackOwned.has(name) && !/^skills:|^check:skills$/.test(name))
        problems.push(`${file} names npm run ${name}, missing from core/package-scripts.json`);
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`${problems.length} template problem(s); see AGENTS.md.`);
  process.exit(1);
}
console.log(
  `Template ${version}: version, copied tools, stamps, ${docs.length} root docs and their links are consistent.`,
);
