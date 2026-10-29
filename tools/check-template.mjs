// This repository's own consistency check (AGENTS, Checks before you finish): one version everywhere, copied tools
// identical to core/tools, every stamp entry pointing at a real file, valid syntax, and working links in the root docs.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
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

// 1. one version: VERSION, the newest CHANGELOG heading and this repository's .harness.json
const version = read('VERSION').trim();
const changelog = read('CHANGELOG.md').match(/^## (\d+\.\d+\.\d+), \d{4}-\d{2}-\d{2}$/m)?.[1];
const stamp = JSON.parse(read('.harness.json'));
if (changelog !== version) problems.push(`VERSION ${version} but the newest CHANGELOG entry is ${changelog ?? 'missing'}`);
if (stamp.version !== version) problems.push(`VERSION ${version} but .harness.json names ${stamp.version}`);

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

// 5. the root docs: no placeholders or agent notes, and every local link resolves (template files under core/ and
// angular/ are exempt: their placeholders are deliberate and their links are relative to an applied project)
const docs = walk('.', (n) => n.endsWith('.md')).filter((f) => !/^(core|angular)\//.test(f));
for (const file of docs) {
  const prose = read(file).replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  if (/\{\{[A-Z_]+\}\}|<!-- harness:/.test(prose)) problems.push(`${file}: placeholder or harness note left in a root document`);
  for (const [, url] of prose.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g))
    if (!/^[a-z]+:/.test(url) && !existsSync(normalize(join(root, dirname(file), url)))) problems.push(`${file}: broken link ${url}`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`${problems.length} template problem(s); see AGENTS.md.`);
  process.exit(1);
}
console.log(`Template ${version}: version, copied tools, stamps, ${docs.length} root docs and their links are consistent.`);
