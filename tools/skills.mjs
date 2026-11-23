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

// A repository file a skill can name: a root document, .harness.json, or a path under a top-level folder
// (a directory may end in /). Anchors are dropped before matching.
const TOP_FOLDERS = 'core|angular|solution|tools|docs|skills';
const REPO_PATH = new RegExp(`^(?:\\.harness\\.json|[A-Z][A-Z0-9_-]*\\.md|(?:${TOP_FOLDERS})\\/[\\w./-]*[\\w/])$`);
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const dropAnchor = (target) => target.split('#')[0];

// The npm scripts, repository paths and relative links a skill's text names, in prose, code spans and
// fenced blocks alike (F-089). `links` are Markdown link targets, resolved later against the skill's file.
export const namedReferences = (text) => {
  const scripts = new Set([...text.matchAll(/\bnpm run ([a-z0-9][\w:-]*)/gi)].map((m) => m[1]));
  const paths = new Set();
  const links = new Set();
  const pathToken = new RegExp(`(?<![\\w./-])(?:${TOP_FOLDERS})\\/[\\w./-]*[\\w/]`, 'g');
  for (const [token] of text.matchAll(pathToken)) paths.add(token);
  for (const [, token] of text.matchAll(/`([^`\s]+)`/g)) {
    if (REPO_PATH.test(dropAnchor(token))) paths.add(dropAnchor(token));
  }
  for (const [name] of text.matchAll(/(?<![\w./-])(?:\.harness\.json|[A-Z][A-Z0-9_-]*\.md)\b/g)) paths.add(name);
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const file = dropAnchor(target);
    if (file && !/^[a-z]+:/i.test(file) && !file.startsWith('/')) links.add(file);
  }
  return { scripts: [...scripts].sort(), paths: [...paths].sort(), links: [...links].sort() };
};

// Where a bare document name may live: the root, the skill folder or docs/ (BACKLOG-RULES.md lives there).
const pathExists = (root, skillDir, path) =>
  existsSync(join(root, path)) ||
  existsSync(join(skillDir, path)) ||
  (/^[A-Z][A-Z0-9_-]*\.md$/.test(path) && existsSync(join(root, 'docs', path)));

const missingScripts = (scripts, named, where) =>
  scripts
    ? named
        .filter((script) => !Object.hasOwn(scripts, script))
        .map((script) => `${where}: names "npm run ${script}", which package.json does not define`)
    : [];

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
      // A repo-only skill relies on this repository: every script, file and link it names must exist (F-089).
      for (const rel of skillTextFiles(skillDir)) {
        const filePath = join(skillDir, rel);
        const { scripts: named, paths, links } = namedReferences(readFileSync(filePath, 'utf8'));
        problems.push(...missingScripts(scripts, named, `skills/${dirName}/${rel}`));
        for (const path of paths) {
          if (!pathExists(root, skillDir, path)) {
            problems.push(`skills/${dirName}/${rel}: names "${path}", which does not exist in this release`);
          }
        }
        for (const link of links) {
          const resolved = resolve(dirname(filePath), normalize(link));
          if (!relative(root, resolved).startsWith('..') && !existsSync(resolved)) {
            problems.push(`skills/${dirName}/${rel}: link "${link}" does not exist in this release`);
          }
        }
      }
      continue;
    }
    checked.push({ name: frontmatter.name, skipped: false });
    // A published skill carries its own version, so an upload changes it only when the skill changed (F-089).
    if (!frontmatter.metadata?.version) {
      problems.push(`skills/${dirName}/SKILL.md: a published skill needs its own metadata.version`);
    }
    // A published skill may name only scripts this release defines; consumer examples go under templates/.
    for (const rel of skillTextFiles(skillDir)) {
      const { scripts: named } = namedReferences(readFileSync(join(skillDir, rel), 'utf8'));
      problems.push(...missingScripts(scripts, named, `skills/${dirName}/${rel}`));
    }
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

// Skills whose text names a changed file, directly or through an npm script that runs it, and published
// skills whose own files changed, which need a new upload (F-089).
export const affectedSkills = ({ root, changed, skillsDir = join(root, 'skills'), versionAtBase = () => null }) => {
  const scripts = readScripts(root) ?? {};
  const affected = [];
  for (const dirName of listSkillDirs(skillsDir)) {
    const skillDir = join(skillsDir, dirName);
    const skillMdPath = join(skillDir, 'SKILL.md');
    if (!existsSync(skillMdPath)) continue;
    const { frontmatter } = parseFrontmatter(readFileSync(skillMdPath, 'utf8'), `skills/${dirName}/SKILL.md`);
    const text = skillTextFiles(skillDir, { includeTemplates: true })
      .map((rel) => readFileSync(join(skillDir, rel), 'utf8'))
      .join('\n');
    const { scripts: named } = namedReferences(text);
    const reasons = [];
    let ownFilesChanged = false;
    for (const file of changed) {
      if (file.startsWith(`skills/${dirName}/`)) {
        ownFilesChanged = true;
        continue;
      }
      const name = file.split('/').pop();
      const mentioned = (needle) => new RegExp(`(?<![\\w./-])${escapeRegExp(needle)}(?![\\w-])`).test(text);
      if (mentioned(file) || (/^[A-Z][A-Z0-9_-]*\.md$/.test(name) && mentioned(name))) reasons.push(file);
      for (const script of named) {
        if (scripts[script]?.includes(file)) reasons.push(`${file} (npm run ${script})`);
      }
    }
    if (reasons.length || ownFilesChanged) {
      affected.push({
        skill: dirName,
        files: [...new Set(reasons)].sort(),
        changed: ownFilesChanged,
        published: !isRepoOnly(frontmatter),
        version: frontmatter.metadata?.version ?? null,
        versionAtBase: ownFilesChanged ? versionAtBase(dirName) : null,
      });
    }
  }
  return affected;
};

const git = (root, args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Files changed since a revision: committed, staged, unstaged and untracked; a rename lists both names.
export const changedSince = (root, base) => {
  const commit = git(root, ['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`]);
  const diff = git(root, ['diff', '--name-status', '--no-renames', commit]);
  const untracked = git(root, ['ls-files', '--others', '--exclude-standard']);
  const files = [
    ...diff.split(/\r?\n/).map((line) => line.split('\t').slice(1).join('\t')),
    ...untracked.split(/\r?\n/),
  ];
  return [...new Set(files.filter(Boolean))].sort();
};

const reportAffected = (root, baseArg) => {
  let base = baseArg;
  if (!base) {
    try {
      base = git(root, ['describe', '--tags', '--abbrev=0', 'HEAD']);
    } catch {
      console.error('No release tag to compare with: pass one, as in `npm run skills:affected -- v1.0.0`.');
      process.exit(2);
    }
  }
  let changed;
  try {
    changed = changedSince(root, base);
  } catch {
    console.error(`"${base}" is not a commit or tag in this repository.`);
    process.exit(2);
  }
  const versionAtBase = (dirName) => {
    try {
      const raw = git(root, ['show', `${base}:skills/${dirName}/SKILL.md`]);
      return parseFrontmatter(raw).frontmatter.metadata?.version ?? null;
    } catch {
      return null;
    }
  };
  const affected = affectedSkills({ root, changed, versionAtBase });
  const reread = affected.filter((a) => a.files.length);
  const upload = affected.filter((a) => a.changed && a.published);
  console.log(
    reread.length
      ? `Skills to re-read since ${base} (they name a changed file):`
      : `Skills to re-read since ${base}: none.`,
  );
  for (const { skill, files } of reread) console.log(`- ${skill}: ${files.join(', ')}`);
  console.log(
    upload.length
      ? 'Published skills whose files changed: package them (npm run skills:package) and upload each zip to its listing:'
      : 'Published skills whose files changed: none; no upload is due.',
  );
  for (const { skill, version, versionAtBase } of upload) {
    const stale = version && version === versionAtBase;
    console.log(`- ${skill} ${version}${stale ? ` (unchanged since ${base}: raise metadata.version first)` : ''}`);
  }
};

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
    reportAffected(root, process.argv[3]);
    return;
  }
  console.error(`Unknown mode: ${mode}. Use "package", "check" or "affected".`);
  process.exit(2);
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
