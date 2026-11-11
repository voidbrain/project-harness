// Does this project format and lint its source, locally and in CI? Fails when it does not (AGENTS: checks before you
// finish). A formatter and a linter are part of the harness for every stack: without them nothing keeps code readable
// between reviews. Settings live under `tooling` in .harness.json:
//   format   the npm script that checks formatting without writing (default "format:check")
//   lint     the npm script that lints (default "lint")
//   exempt   a recorded reason why the repository has no source code to format or lint (replaces both)
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
let stamp = {};
try {
  stamp = read('.harness.json');
} catch {
  /* no stamp: the defaults apply */
}
const settings = stamp.tooling ?? {};
const problems = [];

if (settings.exempt !== undefined) {
  if (typeof settings.exempt !== 'string' || settings.exempt.trim().length < 20)
    problems.push('tooling.exempt needs a recorded reason (20 characters or more) in .harness.json.');
  else console.log(`Tooling: exempt from formatter and linter (${settings.exempt.trim()}).`);
} else {
  const names = { format: settings.format ?? 'format:check', lint: settings.lint ?? 'lint' };
  let scripts = {};
  if (!existsSync(join(root, 'package.json')))
    problems.push('No package.json: add format and lint scripts, or record tooling.exempt with its reason.');
  else scripts = read('package.json').scripts ?? {};
  const workflows = existsSync(join(root, '.github/workflows'))
    ? readdirSync(join(root, '.github/workflows'))
        .filter((file) => /\.ya?ml$/.test(file))
        .map((file) => readFileSync(join(root, '.github/workflows', file), 'utf8'))
    : [];
  // a commented-out step does not count
  const steps = workflows.flatMap((text) => text.split('\n').filter((line) => !/^\s*#/.test(line)));
  for (const [kind, name] of Object.entries(names)) {
    if (typeof scripts[name] !== 'string' || !scripts[name].trim()) {
      problems.push(`No "${name}" npm script: the project has no ${kind === 'format' ? 'formatter check' : 'linter'}.`);
      continue;
    }
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!steps.some((line) => new RegExp(`npm run (-s |--silent )?${escaped}(\\s|$|["'])`).test(line)))
      problems.push(`No CI workflow runs "npm run ${name}": a check nobody runs is not enforced.`);
  }
  if (!problems.length) console.log(`Tooling: "${names.format}" and "${names.lint}" exist and run in CI.`);
}

if (problems.length) {
  for (const problem of problems) console.error(`✗ ${problem}`);
  console.error('See APPLY.md, "Lint and format config". The harness requires both for every stack.');
  process.exitCode = 1;
}
