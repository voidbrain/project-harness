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
if (changelog !== version) problems.push(`VERSION ${version} but the newest CHANGELOG entry is ${changelog ?? 'missing'}`);
if (stamp.version !== version) problems.push(`VERSION ${version} but .harness.json names ${stamp.version}`);
const pkg = JSON.parse(read('package.json')).version;
if (pkg !== version) problems.push(`VERSION ${version} but package.json names ${pkg}`);

// 2. this repository's copied tools are the template's
for (const [path, source] of Object.entries(stamp.copied ?? {}))
  if (!existsSync(join(root, path)) || read(path) !== read(source)) problems.push(`${path} differs from ${source}: copy it`);

// 3. every file a stamp names exists in the template
for (const file of ['core/.harness.json', ...walk('.', (n) => n === '.harness.fragment.json')]) {
  const s = JSON.parse(read(file));
  for (const sources of [...Object.values(s.copied ?? {}), ...Object.values(s.adapted ?? {})])
    for (const source of [sources].flat()) if (!existsSync(join(root, source))) problems.push(`${file} names ${source}, which does not exist`);
}

// 4. syntax: every script and JSON file
for (const file of walk('.', (n) => n.endsWith('.mjs')))
  try { execFileSync(process.execPath, ['--check', join(root, file)], { stdio: 'pipe' }); } catch (e) { problems.push(`${file}: ${String(e.stderr).split('\n').find(Boolean)}`); }
for (const file of walk('.', (n) => n.endsWith('.json')).filter((f) => !f.includes('.vscode/'))) // VS Code files are JSON with comments
  try { JSON.parse(read(file)); } catch (e) { problems.push(`${file}: ${e.message}`); }

// 5. shipped workflows keep the reviewed least-permission and immutable-action contract
for (const file of [
  '.github/workflows/ci.yml',
  '.github/workflows/maintenance.yml',
  'core/.github/workflows/maintenance.yml',
  'angular/.github/workflows/ci.yml',
  'solution/.github/workflows/ci.yml',
]) {
  const workflow = read(file);
  const permissions = workflow.match(/^permissions:\n((?:  [^\n]+\n)+)/m)?.[1];
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
  if (!workflow.includes('npm sbom --sbom-format cyclonedx > sbom.cdx.json') ||
      !workflow.includes('uses: actions/upload-artifact@') ||
      !workflow.includes('path: sbom.cdx.json'))
    problems.push(`${file}: generate and upload a CycloneDX SBOM artifact`);
}

// 6. the root docs: no placeholders or agent notes, and every local link resolves (template files under core/ and
// angular/ are exempt: their placeholders are deliberate and their links are relative to an applied project)
const docs = walk('.', (n) => n.endsWith('.md')).filter((f) => !/^(core|angular|solution)\//.test(f));
for (const file of docs) {
  const prose = read(file).replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  if (/\{\{[A-Z_]+\}\}|<!-- harness:/.test(prose)) problems.push(`${file}: placeholder or harness note left in a root document`);
  for (const [, url] of prose.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g))
    if (!/^[a-z]+:/.test(url) && !existsSync(normalize(join(root, dirname(file), url)))) problems.push(`${file}: broken link ${url}`);
}

// 7. the template's AGENTS skeleton keeps its safety block, and its procedure guides add no rule of their own
const { checkRules } = await import(new URL('../core/tools/check-rules.mjs', import.meta.url).href);
for (const p of checkRules(join(root, 'core')).problems) problems.push(`core/${p}`);

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`${problems.length} template problem(s); see AGENTS.md.`);
  process.exit(1);
}
console.log(`Template ${version}: version, copied tools, stamps, ${docs.length} root docs and their links are consistent.`);
