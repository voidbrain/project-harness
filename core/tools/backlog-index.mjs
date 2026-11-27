// F-110: one repository's backlog at one commit, read into a node:sqlite file: a rebuildable cache that never writes a
// record. The rows come from the readers the dashboard and the ledger already use (solution.mjs, work-items.mjs).
import { DatabaseSync } from 'node:sqlite';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { records, ownerKind } from './solution.mjs';
import { settings, renderLedger, taskCatalog } from './work-items.mjs';

export const SCHEMA_VERSION = 1;
const TABLES = {
  sources: ['repo', 'owner_name', 'ref', 'commit_sha', 'read_at', 'layout'],
  records: ['repo', 'id', 'kind', 'title', 'status', 'priority', 'effort', 'human_action', 'next', 'file', 'archived'],
  steps: ['repo', 'id', 'parent', 'title', 'status', 'owner_kind', 'agent_hours', 'owner_hours', 'file', 'runner'],
  depends_on: ['repo', 'item', 'target', 'file'],
  prs: ['repo', 'item', 'number', 'state', 'merged_at', 'ci', 'file'],
  problems: ['repo', 'file', 'message'],
};

const empty = () => ({ records: [], steps: [], depends_on: [], prs: [], problems: [] });

export function open(db) {
  const d = new DatabaseSync(db);
  const version = d.prepare('PRAGMA user_version').get().user_version;
  if (version !== 0 && version !== SCHEMA_VERSION)
    throw Error(`${db} has schema ${version}, this tool writes ${SCHEMA_VERSION}: delete the file and build again`);
  for (const [name, columns] of Object.entries(TABLES)) {
    d.exec(`CREATE TABLE IF NOT EXISTS ${name} (${columns.join(', ')})`);
    // F-113: a column added later (steps.runner) is added to a file written before it; the schema stays additive.
    const have = d
      .prepare(`PRAGMA table_info(${name})`)
      .all()
      .map((c) => c.name);
    for (const c of columns.filter((c) => !have.includes(c))) d.exec(`ALTER TABLE ${name} ADD COLUMN ${c}`);
  }
  d.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  return d;
}

// Every table sorted on all its columns, read_at left out: the same commit gives the same text.
export function dump(db) {
  const d = new DatabaseSync(db, { readOnly: true });
  if (d.prepare('PRAGMA user_version').get().user_version !== SCHEMA_VERSION) {
    d.close();
    throw Error(`${db} is not a backlog index of schema ${SCHEMA_VERSION}`);
  }
  const out = { schema: SCHEMA_VERSION, tables: {} };
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

// The rows of one snapshot directory (every file at one commit). Each reader failure is a problem row, never no work.
export function readSnapshot(dir, repo, ownerName) {
  const rows = empty();
  const problem = (file, message) => rows.problems.push({ repo, file, message });
  let layout = 'unknown',
    config = null;
  try {
    config = existsSync(join(dir, '.harness.json')) ? settings(dir) : null;
  } catch (e) {
    problem('.harness.json', e.message);
    return { layout, rows };
  }
  let ledger = null,
    ledgerFile = 'docs/BACKLOG.md',
    tasks = [];
  try {
    if (config) {
      layout = 'source-owned';
      ledger = renderLedger(dir, config);
      tasks = config.featurePlans ? taskCatalog(dir, config).tasks : [];
    } else if (existsSync(join(dir, ledgerFile))) {
      layout = 'authored';
      ledger = readFileSync(join(dir, ledgerFile), 'utf8');
    }
  } catch (e) {
    problem(config ? config.records : ledgerFile, e.message);
    return { layout, rows };
  }
  const prsIn = (prose) => {
    const field = prose.split('\n').find((l) => /^\| PR \/ evidence \|/.test(l)) ?? '';
    const numbers = [];
    const rest = field.replace(/\[[^\]]*\]\(([^)]*)\)/g, (_, url) => {
      const m = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/.exec(url);
      if (m && ownerName && m[1].toLowerCase() === ownerName.toLowerCase()) numbers.push(Number(m[2]));
      return ' ';
    });
    for (const m of rest.matchAll(/(?<![\w/#])#(\d+)\b/g)) numbers.push(Number(m[1]));
    return [...new Set(numbers)];
  };
  const add = (loaded, archived) => {
    for (const r of loaded.values()) {
      if (rows.records.some((x) => x.id === r.id)) continue;
      const file = config && !archived ? `${config.records}/${r.id}.md` : r.file;
      rows.records.push({
        repo,
        id: r.id,
        kind: r.id[0],
        title: r.title,
        status: r.status,
        priority: r.priority,
        effort: r.effort,
        human_action: r.human,
        next:
          r.action
            .replace(/\*\*/g, '')
            .replace(/<br \/>/g, ' ')
            .trim() || null,
        file,
        archived: archived ? 1 : 0,
      });
      // With feature plans the record's Depends on cell is drawn from its steps: the step rows carry it.
      if (archived || !config?.featurePlans)
        for (const target of r.dependsOn) rows.depends_on.push({ repo, item: r.id, target, file });
      for (const number of prsIn(r.prose))
        rows.prs.push({ repo, item: r.id, number, state: null, merged_at: null, ci: null, file });
      if (archived || config?.featurePlans) continue;
      for (const s of r.steps) {
        rows.steps.push({
          repo,
          id: s.id,
          parent: r.id,
          title: s.title,
          status: s.status,
          owner_kind: ownerKind(s.who)?.toLowerCase() ?? null,
          agent_hours: null,
          owner_hours: null,
          file,
        });
        for (const target of s.dependsOn) rows.depends_on.push({ repo, item: s.id, target, file });
      }
    }
  };
  if (ledger !== null)
    try {
      add(records(ledger, repo, ledgerFile), false);
    } catch (e) {
      problem(config ? config.records : ledgerFile, e.message);
    }
  for (const t of tasks) {
    const file = `${config.tasks}/${t.id}.json`;
    rows.steps.push({
      repo,
      id: t.id,
      parent: t.parent,
      title: t.title,
      status: t.status,
      owner_kind: t.effort?.ownerKind ?? null,
      agent_hours: t.effort?.agentHours ?? null,
      owner_hours: t.effort?.ownerHours ?? null,
      file,
      runner: t.runner ?? null,
    });
    for (const target of t.dependsOn) rows.depends_on.push({ repo, item: t.id, target, file });
    for (const p of t.prs ?? [])
      rows.prs.push({ repo, item: t.id, number: p.pr, state: null, merged_at: null, ci: null, file });
  }
  const archive = join(dir, 'docs/archive');
  for (const f of existsSync(archive)
    ? readdirSync(archive)
        .filter((f) => /^backlog-.*\.md$/.test(f))
        .sort()
    : [])
    try {
      add(records(readFileSync(join(archive, f), 'utf8'), repo, `docs/archive/${f}`, true), true);
    } catch (e) {
      problem(`docs/archive/${f}`, e.message);
    }
  return { layout, rows };
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

const git = (cwd, ...args) =>
  execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

// One commit's files, extracted by `extract` into a temporary directory, read into this repository's rows. A symlink
// is removed unread (a problem row), so no file outside the snapshot is ever read.
async function fromSnapshot(db, repo, source, extract, enrich = async () => {}) {
  const dir = mkdtempSync(join(tmpdir(), 'backlog-index-'));
  try {
    const links = [];
    try {
      await extract(dir);
      // One level at a time, never through a link: a linked directory is removed before anything below it is listed.
      const walk = (rel) => {
        for (const entry of readdirSync(join(dir, rel), { withFileTypes: true }).sort((a, b) =>
          a.name.localeCompare(b.name, 'en'),
        )) {
          const path = rel ? `${rel}/${entry.name}` : entry.name;
          if (entry.isSymbolicLink()) {
            rmSync(join(dir, path));
            links.push({ repo, file: path, message: 'symlink not read' });
          } else if (entry.isDirectory()) walk(path);
        }
      };
      walk('');
    } catch (e) {
      const rows = empty();
      rows.problems.push({ repo, file: null, message: `unreadable repository: ${e.message}` });
      return write(db, repo, { ...source, layout: 'unreadable' }, rows);
    }
    const { layout, rows } = readSnapshot(dir, repo, source.owner_name);
    rows.problems.push(...links);
    if (layout === 'unknown' && !rows.problems.length)
      rows.problems.push({ repo, file: null, message: 'unknown backlog layout: no workItems and no docs/BACKLOG.md' });
    await enrich(rows);
    write(db, repo, { ...source, layout }, rows);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// A local checkout: the committed tree at HEAD (local changes are not read). A checkout git cannot read replaces this
// repository's rows with a problem row: never its earlier rows, never no work.
export function buildLocal(db, repo, checkout) {
  const source = { repo, owner_name: null, ref: null, commit_sha: null, read_at: new Date().toISOString() };
  try {
    source.commit_sha = git(checkout, 'rev-parse', '--verify', 'HEAD^{commit}');
    source.ref = git(checkout, 'rev-parse', '--abbrev-ref', 'HEAD');
  } catch {
    const rows = empty();
    rows.problems.push({ repo, file: null, message: `unreadable repository: ${checkout} has no readable commit` });
    return write(db, repo, { ...source, layout: 'unreadable' }, rows);
  }
  try {
    source.owner_name =
      /github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/.exec(git(checkout, 'remote', 'get-url', 'origin'))?.[1] ?? null;
  } catch {
    // no origin: PR links cannot be matched to this repository
  }
  return fromSnapshot(db, repo, source, (dir) => {
    const tar = execFileSync('git', ['-C', checkout, 'archive', '--format=tar', source.commit_sha], {
      maxBuffer: 1024 * 1024 * 1024,
    });
    execFileSync('tar', ['-x', '-C', dir], { input: tar });
  });
}

// F-110-T03: the GitHub API, with GH_TOKEN or GITHUB_TOKEN when set; without one, only public data is readable.
async function github(path) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const response = await fetch(`https://api.github.com/repos/${path}`, {
    headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw Error(`GitHub returned HTTP ${response.status}`);
  return response;
}
const FAILED = new Set(['failure', 'cancelled', 'timed_out', 'action_required', 'startup_failure']);
// The CI result of a commit from its check runs: none (null), pending, failure or success.
const ciOf = (runs) =>
  !runs.length
    ? null
    : runs.some((r) => r.status !== 'completed')
      ? 'pending'
      : runs.some((r) => FAILED.has(r.conclusion))
        ? 'failure'
        : 'success';

// A GitHub repository at a ref: the commit it resolves to, its tarball, then each named PR's state, merge time and CI.
export async function buildRemote(db, repo, ownerName, ref) {
  const source = { repo, owner_name: ownerName, ref, commit_sha: null, read_at: new Date().toISOString() };
  return fromSnapshot(
    db,
    repo,
    source,
    async (dir) => {
      const sha = (await (await github(`${ownerName}/commits/${encodeURIComponent(ref)}`)).json()).sha;
      if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw Error('GitHub returned no commit');
      source.commit_sha = sha;
      const tarball = Buffer.from(await (await github(`${ownerName}/tarball/${sha}`)).arrayBuffer());
      execFileSync('tar', ['-xz', '--strip-components=1', '-C', dir], { input: tarball });
    },
    async (rows) => {
      for (const number of [...new Set(rows.prs.map((p) => p.number))].sort((a, b) => a - b))
        try {
          const pr = await (await github(`${ownerName}/pulls/${number}`)).json();
          const head = pr.head?.sha;
          const runs = [];
          // Every page of check runs: a failure on a later page is still a failure.
          for (let page = 1; /^[a-f0-9]{40}$/.test(head ?? ''); page++) {
            const query = `check-runs?per_page=100${page > 1 ? `&page=${page}` : ''}`;
            const body = await (await github(`${ownerName}/commits/${head}/${query}`)).json();
            runs.push(...(body.check_runs ?? []));
            if (!body.check_runs?.length || runs.length >= (body.total_count ?? 0)) break;
          }
          const found = {
            state: pr.merged_at ? 'merged' : (pr.state ?? null),
            merged_at: pr.merged_at ?? null,
            ci: ciOf(runs),
          };
          for (const row of rows.prs) if (row.number === number) Object.assign(row, found);
        } catch (e) {
          rows.problems.push({ repo, file: null, message: `#${number}: ${e.message}` });
        }
    },
  );
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
  const m = /^([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)@(\S+)$/.exec(o.remote);
  if (!m || m[1].split('/').some((part) => /^\.+$/.test(part))) throw Error(USAGE);
  return buildRemote(o.db, o.repo, m[1], m[2]);
}

const direct = (() => {
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1] ?? '');
  } catch {
    return false;
  }
})();
if (direct)
  main(process.argv.slice(2)).catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
