// F-110: one repository's backlog at one commit, read into a node:sqlite file: a rebuildable cache that never writes a
// record. The rows come from the readers the dashboard and the ledger already use (solution.mjs, work-items.mjs).
import { DatabaseSync } from 'node:sqlite';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { realpathSync } from 'node:fs';

export const SCHEMA_VERSION = 1;
const TABLES = {
  sources: ['repo', 'owner_name', 'ref', 'commit_sha', 'read_at', 'layout'],
  records: ['repo', 'id', 'kind', 'title', 'status', 'priority', 'effort', 'human_action', 'next', 'file', 'archived'],
  steps: ['repo', 'id', 'parent', 'title', 'status', 'owner_kind', 'agent_hours', 'owner_hours', 'file'],
  depends_on: ['repo', 'item', 'target', 'file'],
  prs: ['repo', 'item', 'number', 'state', 'merged_at', 'ci', 'file'],
  problems: ['repo', 'file', 'message'],
};

export function open(db) {
  const d = new DatabaseSync(db);
  const version = d.prepare('PRAGMA user_version').get().user_version;
  if (version !== 0 && version !== SCHEMA_VERSION)
    throw Error(`${db} has schema ${version}, this tool writes ${SCHEMA_VERSION}: delete the file and build again`);
  for (const [name, columns] of Object.entries(TABLES))
    d.exec(`CREATE TABLE IF NOT EXISTS ${name} (${columns.join(', ')})`);
  d.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  return d;
}

// Every table sorted on all its columns, read_at left out: the same commit gives the same text.
export function dump(db) {
  const d = open(db),
    out = { schema: SCHEMA_VERSION, tables: {} };
  for (const [name, columns] of Object.entries(TABLES)) {
    const kept = columns.filter((c) => c !== 'read_at');
    out.tables[name] = d
      .prepare(`SELECT ${kept.join(', ')} FROM ${name} ORDER BY ${kept.map((_, i) => i + 1).join(', ')}`)
      .all()
      .map((row) => ({ ...row }));
  }
  d.close();
  return JSON.stringify(out, null, 2) + '\n';
}

// The rows of one snapshot directory (every file at one commit). The readers come in F-110-T02.
// eslint-disable-next-line no-unused-vars
export function readSnapshot(dir, repo, ownerName) {
  return { layout: 'unknown', rows: { records: [], steps: [], depends_on: [], prs: [], problems: [] } };
}

// Replaces this repository's rows in one transaction; other repositories in the same file stay.
export function write(db, repo, source, rows) {
  const d = open(db);
  d.exec('BEGIN');
  try {
    for (const name of Object.keys(TABLES)) d.prepare(`DELETE FROM ${name} WHERE repo = ?`).run(repo);
    for (const [name, list] of Object.entries({ sources: [source], ...rows })) {
      const columns = TABLES[name],
        insert = d.prepare(`INSERT INTO ${name} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`);
      for (const row of list) insert.run(...columns.map((c) => row[c] ?? null));
    }
    d.exec('COMMIT');
  } catch (e) {
    d.exec('ROLLBACK');
    throw e;
  } finally {
    d.close();
  }
}

const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).trim();

// A local checkout: the committed tree at HEAD, extracted into a temporary directory (local changes are not read).
export function buildLocal(db, repo, checkout) {
  const commit = git(checkout, 'rev-parse', 'HEAD'),
    ref = git(checkout, 'rev-parse', '--abbrev-ref', 'HEAD');
  let ownerName = null;
  try {
    ownerName =
      /github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/.exec(git(checkout, 'remote', 'get-url', 'origin'))?.[1] ?? null;
  } catch {
    // no origin: PR links cannot be matched to this repository
  }
  const dir = mkdtempSync(join(tmpdir(), 'backlog-index-'));
  try {
    const tar = execFileSync('git', ['-C', checkout, 'archive', '--format=tar', commit], {
      maxBuffer: 1024 * 1024 * 1024,
    });
    execFileSync('tar', ['-x', '-C', dir], { input: tar });
    const { layout, rows } = readSnapshot(dir, repo, ownerName);
    if (layout === 'unknown' && !rows.problems.length)
      rows.problems.push({ repo, file: null, message: 'unknown backlog layout: no workItems and no docs/BACKLOG.md' });
    write(
      db,
      repo,
      { repo, owner_name: ownerName, ref, commit_sha: commit, read_at: new Date().toISOString(), layout },
      rows,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const USAGE =
  'Usage: backlog-index.mjs build --db <file> --repo <id> (--source <checkout> | --remote <owner/name>@<ref>)\n' +
  '       backlog-index.mjs dump --db <file>';
function options(list, allowed) {
  const out = {};
  for (let i = 0; i < list.length; i += 2) {
    const key = /^--([a-z]+)$/.exec(list[i])?.[1];
    if (!allowed.includes(key) || key in out || list[i + 1] === undefined) throw Error(USAGE);
    out[key] = list[i + 1];
  }
  return out;
}
export async function main(argv) {
  const [mode, ...rest] = argv;
  if (mode === 'dump') {
    const o = options(rest, ['db']);
    if (!o.db || !existsSync(o.db)) throw Error(USAGE);
    process.stdout.write(dump(o.db));
    return;
  }
  if (mode !== 'build') throw Error(USAGE);
  const o = options(rest, ['db', 'repo', 'source', 'remote']);
  if (!o.db || !/^[a-z][a-z0-9-]*$/.test(o.repo ?? '') || 'source' in o === 'remote' in o) throw Error(USAGE);
  if (o.source) return buildLocal(o.db, o.repo, resolve(o.source));
  throw Error('--remote is not built yet (F-110-T03)');
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href)
  main(process.argv.slice(2)).catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
