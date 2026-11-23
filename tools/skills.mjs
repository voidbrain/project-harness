// Package and validate skills under skills/<name>/: standalone ones for Agensi distribution,
// repo-only ones against the scripts and files of this release (F-089).
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_URL = 'https://github.com/voidbrain/project-harness';
const FORBIDDEN_PATTERNS = [
  { label: 'AGENTS.md', pattern: /\bAGENTS\.md\b/ },
  { label: 'BACKLOG-RULES', pattern: /\bBACKLOG-RULES(?:\.md)?\b/ },
  { label: 'APPLY.md', pattern: /\bAPPLY\.md\b/ },
  { label: '.harness.json', pattern: /(?:^|[\s`"'(/])\.harness\.json\b/ },
  { label: 'tools/', pattern: /(?:^|[\s`"'(/])tools\// },
  { label: 'docs/', pattern: /(?:^|[\s`"'(/])docs\// },
];

// A repository file a skill can name: a root document, .harness.json, or a path under a top-level folder.
const REPO_PATH = /^(?:\.harness\.json|[A-Z][A-Z0-9_-]*\.md|(?:core|angular|solution|tools|docs|skills)\/[\w./-]*\w)$/;
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The npm scripts and repository files a skill's text names (F-089).
export const namedReferences = (text) => {
  const scripts = new Set([...text.matchAll(/\bnpm run ([a-z0-9][\w:-]*)/gi)].map((m) => m[1]));
  const paths = new Set();
  for (const [, token] of text.matchAll(/`([^`\s]+)`/g)) if (REPO_PATH.test(token)) paths.add(token);
  for (const [, target] of text.matchAll(/\]\(([^)\s#]+)/g)) if (REPO_PATH.test(target)) paths.add(target);
  for (const [name] of text.matchAll(/(?<![\w./-])[A-Z][A-Z0-9_-]*\.md\b/g)) paths.add(name);
  return { scripts: [...scripts].sort(), paths: [...paths].sort() };
};

const readScripts = (root) => {
  const pkgPath = join(root, 'package.json');
  if (!existsSync(pkgPath)) return null;
  return JSON.parse(readFileSync(pkgPath, 'utf8')).scripts ?? {};
};

// Text files a skill owns; templates/ hold the consumer's examples, not names of this repository.
const skillTextFiles = (skillDir, { includeTemplates = false } = {}) =>
  walkFiles(skillDir).filter(
    (rel) => /\.(md|txt|sh|mjs|js|json|ya?ml)$/i.test(rel) && (includeTemplates || !rel.startsWith('templates/')),
  );

const stripQuotes = (raw) => {
  const trimmed = raw.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

export const parseFrontmatter = (markdown, label = 'SKILL.md') => {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    throw new Error(`${label}: missing YAML frontmatter delimited by ---`);
  }
  const frontmatter = {};
  let currentMap = null;
  for (const rawLine of match[1].split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    const nested = rawLine.match(/^ {2}([A-Za-z0-9_-]+):\s*(.*)$/);
    if (nested && currentMap) {
      currentMap[nested[1]] = stripQuotes(nested[2]);
      continue;
    }
    const top = rawLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!top) {
      throw new Error(`${label}: invalid frontmatter line "${rawLine}"`);
    }
    const [, key, value] = top;
    if (value.trim() === '') {
      frontmatter[key] = {};
      currentMap = frontmatter[key];
    } else {
      frontmatter[key] = stripQuotes(value);
      currentMap = null;
    }
  }
  if (!frontmatter.name || typeof frontmatter.name !== 'string') {
    throw new Error(`${label}: frontmatter missing required "name"`);
  }
  if (!frontmatter.description || typeof frontmatter.description !== 'string') {
    throw new Error(`${label}: frontmatter missing required "description"`);
  }
  return { frontmatter, body: markdown.slice(match[0].length) };
};

export const isRepoOnly = (frontmatter) =>
  frontmatter?.metadata?.distribution === 'repo-only' ||
  frontmatter?.standalone === 'false' ||
  frontmatter?.standalone === false;

const listSkillDirs = (skillsDir) => {
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir)
    .filter((entry) => !entry.startsWith('.') && statSync(join(skillsDir, entry)).isDirectory())
    .sort();
};

const walkFiles = (dir, base = dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === '.DS_Store' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, base, out);
    else out.push(relative(base, full));
  }
  return out.sort();
};

export const packageSkills = ({
  root,
  skillsDir = join(root, 'skills'),
  outDir = join(root, 'dist', 'skills'),
  licensePath = join(root, 'LICENSE'),
  defaultVersion,
}) => {
  const pkgVersion =
    defaultVersion ??
    (existsSync(join(root, 'VERSION')) ? readFileSync(join(root, 'VERSION'), 'utf8').trim() : undefined);
  const results = [];
  for (const dirName of listSkillDirs(skillsDir)) {
    const skillDir = join(skillsDir, dirName);
    const skillMdPath = join(skillDir, 'SKILL.md');
    if (!existsSync(skillMdPath)) {
      throw new Error(`skills/${dirName}: missing SKILL.md`);
    }
    const { frontmatter } = parseFrontmatter(readFileSync(skillMdPath, 'utf8'), `skills/${dirName}/SKILL.md`);
    if (isRepoOnly(frontmatter)) {
      results.push({ name: frontmatter.name, skipped: true, reason: 'repo-only' });
      continue;
    }
    const version = frontmatter.metadata?.version || frontmatter.version || pkgVersion;
    if (!version) {
      throw new Error(`skills/${dirName}: missing skill version and no default VERSION`);
    }
    if (!existsSync(licensePath)) {
      throw new Error(`Missing LICENSE at ${licensePath}`);
    }
    mkdirSync(outDir, { recursive: true });
    const zipPath = join(outDir, `${frontmatter.name}-${version}.zip`);
    rmSync(zipPath, { force: true });
    const stageDir = mkdtempSync(join(tmpdir(), `skill-pkg-${frontmatter.name}-`));
    try {
      const files = walkFiles(skillDir);
      for (const rel of files) {
        const dest = join(stageDir, rel);
        mkdirSync(dirname(dest), { recursive: true });
        cpSync(join(skillDir, rel), dest);
      }
      cpSync(licensePath, join(stageDir, 'LICENSE'));
      execFileSync('zip', ['-r', '-q', zipPath, '.'], { cwd: stageDir });
      results.push({
        name: frontmatter.name,
        version,
        zipPath,
        files: [...files, 'LICENSE'].sort(),
        skipped: false,
      });
    } finally {
      rmSync(stageDir, { recursive: true, force: true });
    }
  }
  return results;
};

export const checkSkills = ({ root, skillsDir = join(root, 'skills') }) => {
  const problems = [];
  const checked = [];
  const scripts = readScripts(root);
  for (const dirName of listSkillDirs(skillsDir)) {
    const skillDir = join(skillsDir, dirName);
    const skillMdPath = join(skillDir, 'SKILL.md');
    if (!existsSync(skillMdPath)) {
      problems.push(`skills/${dirName}: missing SKILL.md`);
      continue;
    }
    let frontmatter;
    try {
      ({ frontmatter } = parseFrontmatter(readFileSync(skillMdPath, 'utf8'), `skills/${dirName}/SKILL.md`));
    } catch (err) {
      problems.push(err.message);
      continue;
    }
    if (isRepoOnly(frontmatter)) {
      checked.push({ name: frontmatter.name, skipped: true, reason: 'repo-only' });
      // A repo-only skill relies on this repository: every script and file it names must exist in it (F-089).
      for (const rel of skillTextFiles(skillDir)) {
        const { scripts: named, paths } = namedReferences(readFileSync(join(skillDir, rel), 'utf8'));
        for (const script of named) {
          if (scripts && !Object.hasOwn(scripts, script)) {
            problems.push(`skills/${dirName}/${rel}: names "npm run ${script}", which package.json does not define`);
          }
        }
        for (const path of paths) {
          if (!existsSync(join(root, path)) && !existsSync(join(skillDir, path))) {
            problems.push(`skills/${dirName}/${rel}: names "${path}", which does not exist in this release`);
          }
        }
      }
      continue;
    }
    checked.push({ name: frontmatter.name, skipped: false });
    const files = walkFiles(skillDir);
    for (const rel of files) {
      if (!/\.(md|txt|sh|mjs|js|json|ya?ml)$/i.test(rel)) continue;
      const filePath = join(skillDir, rel);
      const raw = readFileSync(filePath, 'utf8');
      const withoutRepoUrl = raw.split(REPO_URL).join('');
      for (const [, rawTarget] of withoutRepoUrl.matchAll(/\]\(([^)\s]+)\)/g)) {
        const target = rawTarget.split('#')[0];
        if (!target || /^[a-z]+:/i.test(target)) continue;
        if (target.startsWith('/')) {
          problems.push(`skills/${dirName}/${rel}: absolute link "${rawTarget}" escapes skill folder`);
          continue;
        }
        const resolved = resolve(dirname(filePath), normalize(target));
        const relToSkill = relative(skillDir, resolved);
        if (relToSkill.startsWith('..') || !existsSync(resolved)) {
          problems.push(`skills/${dirName}/${rel}: link "${rawTarget}" does not resolve inside skills/${dirName}`);
        }
      }
      for (const { label, pattern } of FORBIDDEN_PATTERNS) {
        if (pattern.test(withoutRepoUrl)) {
          problems.push(`skills/${dirName}/${rel}: references "${label}" outside the standalone skill bundle`);
        }
      }
    }
  }
  return { ok: problems.length === 0, problems, checked };
};

// Skills whose text names a changed file, directly or through an npm script that runs it (F-089).
export const affectedSkills = ({ root, changed, skillsDir = join(root, 'skills') }) => {
  const scripts = readScripts(root) ?? {};
  const affected = [];
  for (const dirName of listSkillDirs(skillsDir)) {
    const skillDir = join(skillsDir, dirName);
    if (!existsSync(join(skillDir, 'SKILL.md'))) continue;
    const text = skillTextFiles(skillDir, { includeTemplates: true })
      .map((rel) => readFileSync(join(skillDir, rel), 'utf8'))
      .join('\n');
    const { scripts: named } = namedReferences(text);
    const reasons = [];
    for (const file of changed) {
      if (new RegExp(`(?<![\\w./-])${escapeRegExp(file)}(?![\\w-])`).test(text)) reasons.push(file);
      for (const script of named) {
        if (scripts[script]?.includes(file)) reasons.push(`${file} (npm run ${script})`);
      }
    }
    if (reasons.length) affected.push({ skill: dirName, files: [...new Set(reasons)].sort() });
  }
  return affected;
};

const git = (root, args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

export const changedSince = (root, base) => git(root, ['diff', '--name-only', base]).split(/\r?\n/).filter(Boolean);

const main = () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const mode = process.argv[2] ?? 'check';
  if (mode === 'package') {
    const out = packageSkills({ root });
    const packaged = out.filter((r) => !r.skipped);
    const skipped = out.filter((r) => r.skipped);
    console.log(`Packaged ${packaged.length} standalone skill(s); skipped ${skipped.length} repo-only skill(s).`);
    for (const item of packaged) {
      console.log(`- ${item.name} ${item.version} -> ${relative(root, item.zipPath)}`);
    }
    return;
  }
  if (mode === 'check') {
    const result = checkSkills({ root });
    if (!result.ok) {
      console.error(result.problems.join('\n'));
      process.exit(1);
    }
    const standalone = result.checked.filter((c) => !c.skipped).length;
    const skipped = result.checked.filter((c) => c.skipped).length;
    console.log(`Skills check passed (${standalone} standalone, ${skipped} repo-only).`);
    return;
  }
  if (mode === 'affected') {
    const base = process.argv[3] ?? git(root, ['describe', '--tags', '--abbrev=0', 'HEAD']);
    const affected = affectedSkills({ root, changed: changedSince(root, base) });
    if (!affected.length) {
      console.log(`Skills to re-read since ${base}: none.`);
      return;
    }
    console.log(`Skills to re-read since ${base} (they name a changed file):`);
    for (const { skill, files } of affected) console.log(`- ${skill}: ${files.join(', ')}`);
    return;
  }
  console.error(`Unknown mode: ${mode}. Use "package", "check" or "affected".`);
  process.exit(2);
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
