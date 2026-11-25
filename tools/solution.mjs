// Optional coordinator dashboard. Reads component evidence; never changes component repositories or calculates aggregate progress.
import { existsSync, readFileSync, writeFileSync, mkdirSync, realpathSync, statSync } from 'node:fs';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = process.cwd(),
  args = process.argv.slice(2),
  mode = args.shift() ?? 'check';
const remote = args.includes('--remote'),
  write = args.includes('--write');
const option = (key) => args.find((x) => x.startsWith(`--${key}=`))?.slice(key.length + 3);
const fail = (message) => {
  throw new Error(message);
};
const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const text = (value) =>
  String(value ?? '')
    .replaceAll('|', '\\|')
    .replace(/[\r\n]+/g, ' ')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const cells = (line) =>
  line
    .split(/(?<!\\)\|/)
    .slice(1, -1)
    .map((x) => x.trim());
const inside = (base, path) => {
  const rel = relative(base, path);
  return !isAbsolute(rel) && rel !== '..' && !/^\.\.[/\\]/.test(rel);
};
const repositoryPath = (path) => {
  if (typeof path !== 'string' || !path || isAbsolute(path) || path.includes('\\') || path.split('/').includes('..'))
    fail('Use a repository-relative file path without traversal');
};
const safeFile = (base, path) => {
  repositoryPath(path);
  const target = resolve(base, path);
  let ancestor = target;
  while (!existsSync(ancestor)) ancestor = dirname(ancestor);
  if (!inside(realpathSync(base), realpathSync(ancestor))) fail('File path escapes its repository through a symlink');
  return target;
};
const git = (cwd, ...params) => {
  try {
    const value = execFileSync('git', ['-C', cwd, ...params], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return params[0] === 'show' ? value : value.trim();
  } catch {
    return null;
  }
};
// F-063: the generated ledger merges Signal into Status ("🔴 Open"); read such a row in the authored column order.
const unmerge = (c) => {
  const m = /^(🔴|🟠|🟡|🟢|🟣|🔵) (Open|Investigate|Implemented|Verified|Blocked|Closed)$/.exec(c[0] ?? '');
  return m ? [m[1], c[1], m[2], ...c.slice(2)] : c;
};
// F-095-T03: the summary columns the reader knows, by name; any other column is reported, never skipped.
const SUMMARY_COLUMNS = new Set([
  'Signal',
  'ID',
  'Item',
  'Priority',
  'Status',
  'Effort',
  'Complete',
  'Remaining',
  'Depends on',
  'Unlocks',
  'Agent',
  'Human action',
  'Procedures',
  'Decisions',
]);
// Record and step references in a cell, local (F-001-T02) or of another repository (api:F-009-T02), whole IDs only;
// link targets and bare URLs aside. An uppercase repository prefix is reported rather than read as a local ID.
const references = (cell, where) => {
  const text = String(cell ?? '')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/https?:\/\/\S+/g, '');
  const upper = /(?<![\w-])([A-Za-z][\w-]*[A-Z][\w-]*|[A-Z][\w-]*):([BF]-\d+(?:-T\d{2})?)(?![\w-])/.exec(text);
  if (upper) fail(`${where}: write the repository of "${upper[0]}" in lowercase, as in the manifest`);
  return [...text.matchAll(/(?<![\w-])(?:[a-z][a-z0-9-]*:)?[BF]-\d{3}(?:-T\d{2})?(?![\w-])/g)].map((m) => m[0]);
};
// The step statuses a generated ledger writes (work-items.mjs).
const STEP_STATUSES = new Set(['Planned', 'Ready', 'Implemented; verification pending', 'Verified', 'Completed']);
// The steps table of a generated record (open steps, and the collapsed done steps), read by column name.
function stepRows(lines, where) {
  const steps = [];
  for (let i = 0; i + 2 < lines.length; i++) {
    if (!lines[i].startsWith('|') || !/^\|[-:| ]+\|$/.test(lines[i + 1])) continue;
    const head = cells(lines[i]);
    if (!head.includes('Step') || !head.includes('Status')) continue;
    for (let j = i + 2; j < lines.length && lines[j].startsWith('|'); j++) {
      const row = cells(lines[j]);
      const col = (name) => (head.includes(name) ? row[head.indexOf(name)] : undefined);
      const m = /([BF]-\d{3}-T\d{2}) — (.+)$/.exec(col('Step') ?? '');
      if (!m) continue;
      if (!STEP_STATUSES.has(col('Status'))) fail(`${where}: ${m[1]} has unknown step status "${col('Status')}"`);
      steps.push({
        id: m[1],
        title: m[2].trim(),
        status: col('Status') ?? 'Unknown',
        remaining: col('Remaining') ?? '—',
        who: col('Who') ?? '—',
        dependsOn: references(col('Depends on'), where),
      });
    }
  }
  return steps;
}
function records(markdown, label, file, archived = false) {
  const out = new Map(),
    blocks = [
      ...markdown.matchAll(
        /^### (?:<a id="[fb]-\d+"><\/a>)?(?:\[(?:✨|🐞) )?([BF]-\d+)(?:\]\(#top\))?\n([\s\S]*?)(?=^### (?:<a id="[fb]-\d+"><\/a>)?(?:\[(?:✨|🐞) )?[BF]-\d+(?:\]\(#top\))?\n|^## |$(?![\s\S]))/gm,
      ),
    ];
  for (const b of blocks) {
    const id = b[1],
      block = b[2];
    if (!archived && out.has(id)) fail(`${label}: duplicate record ${id}`);
    const lines = block.split('\n');
    const summaries = lines
      .filter((l) => l.startsWith('|'))
      .map((l) => unmerge(cells(l)))
      .filter((c) => ['🔴', '🟠', '🟡', '🟢', '🟣', '🔵'].includes(c[0]));
    if (summaries.length !== 1) fail(`${label}:${id}: unsupported multiple/missing summary rows`);
    const row = summaries[0];
    // F-095-T03: the summary's header names its columns; a column the reader does not know is reported.
    const rowAt = lines.findIndex(
      (l) => l.startsWith('|') && ['🔴', '🟠', '🟡', '🟢', '🟣', '🔵'].includes(unmerge(cells(l))[0]),
    );
    const head = rowAt >= 2 && /^\|[-:| ]+\|$/.test(lines[rowAt - 1]) ? cells(lines[rowAt - 2]) : [];
    const unknownColumn = head.find((name) => !SUMMARY_COLUMNS.has(name));
    if (unknownColumn !== undefined) fail(`${label}:${id}: unknown summary column "${unknownColumn}"`);
    const named = (name) => (head.includes(name) ? cells(lines[rowAt])[head.indexOf(name)] : undefined);
    // Four (or legacy five) authored columns, or the generated ledger's seven or nine (F-059; Procedures and Decisions
    // cells last since 8.0.0), read in authored order.
    // A component still on a 7.x generated ledger (six or eight cells ending 🧑 Yes / 💻 No) is read too.
    const legacy7 = row && [6, 8].includes(row.length) && /^(?:🧑|💻) (?:Yes|No)$/.test(row.at(-1));
    // F-071 (8.8.0): 🧑‍🔧 and 🤔 read like 🧑.
    const kind =
      row &&
      { '🧑🧑': 'Both', '🧑—': 'Procedure', '—🧑': 'Decision', '——': 'No' }[
        row
          .slice(-2)
          .map((c, i) => (c === ['🧑‍🔧', '🤔'][i] ? '🧑' : c))
          .join('')
      ];
    // F-073 (8.10.0): eight or ten cells with the Agent cell.
    const generated = row && (([7, 8, 9, 10].includes(row.length) && kind !== undefined) || legacy7);
    if (!row || (![4, 5].includes(row.length) && !generated))
      fail(`${label}:${id}: unsupported summary (run the owning repository's backlog check)`);
    const legacy = row[1] === id;
    const status = row[legacy ? 3 : 2];
    if (!['Open', 'Investigate', 'Implemented', 'Verified', 'Blocked', 'Closed'].includes(status))
      fail(`${label}:${id}: unknown status`);
    const title = legacy ? row[4] : lines.find((l) => /^\*\*[^\n]+\*\*$/.test(l))?.slice(2, -2);
    if (!title) fail(`${label}:${id}: missing title`);
    const field = (name) =>
      lines
        .filter((l) => l.startsWith('|'))
        .map(cells)
        .find((c) => c[0] === name)?.[1] ?? '—';
    const components = field('Components');
    const refs = components === '—' ? [] : components.split(',').map((v) => v.trim());
    if (refs.some((v) => !/^[a-z][a-z0-9-]*:[BF]-\d+$/.test(v)) || new Set(refs).size !== refs.length)
      fail(`${label}:${id}: Components must contain unique repository-qualified IDs`);
    out.set(id, {
      id,
      file,
      archived,
      title,
      status,
      human: generated
        ? legacy7
          ? row.at(-1).split(' ')[1]
          : kind
        : (block.match(/Human action required: (Procedure|Decision|Both|No|Yes)\*\*/)?.[1] ?? 'Unknown'),
      effort: legacy ? 'Unknown' : row[3],
      priority: named('Priority') ?? (legacy ? row[2] : '—'),
      remaining: named('Remaining') ?? '—',
      dependsOn: references(named('Depends on'), `${label}:${id}`),
      agent: named('Agent') ?? '—',
      steps: stepRows(lines, `${label}:${id}`),
      reviewed: field('Reviewed'),
      verification: field('Verification'),
      refs,
    });
  }
  // F-095-T03: a heading that names a B-/F- ID but is not a supported record heading is reported, not read as no work;
  // only in the active backlog and outside fenced code.
  for (const [line] of archived ? [] : markdown.replace(/^```[\s\S]*?^```/gm, '').matchAll(/^### .*$/gm))
    if (
      /(?<![\w-])[BF]-\d+/.test(line) &&
      !/^### (?:<a id="[fb]-\d+"><\/a>)?(?:\[(?:✨|🐞) )?[BF]-\d+(?:\]\(#top\))?$/.test(line)
    )
      fail(`${label}: unsupported record heading "${line}"`);
  // An unreadable legacy table must not silently become an empty successful dashboard.
  for (const match of markdown.matchAll(/^\|.*\|\s*[BF]-\d+\s*\|.*$/gm)) {
    if (!blocks.some((b) => match.index >= b.index && match.index < b.index + b[0].length))
      fail(`${label}: unheaded IDs have no supported record headings`);
  }
  return out;
}
// F-096-T05: a component with workItems.views "built" commits no ledger. Its stamp at the resolved commit says so.
const builtViews = (json, where) => {
  if (json === null || json === undefined) return null;
  let stamp;
  try {
    stamp = JSON.parse(json);
  } catch {
    fail(`.harness.json at ${where} is not valid JSON`);
  }
  const items = stamp?.workItems;
  return items?.enabled && items.views === 'built' ? items : null;
};
// A publication is trusted only when its tree is the source tree plus the ledger, as work-items publish writes it; the
// message alone can be written by anyone who can push the branch (review of F-096-T05).
async function sameTreeRemote(api, sourceTree, viewTree, segments) {
  const [a, b] = await Promise.all([
    request(`${api}/git/trees/${sourceTree}`),
    request(`${api}/git/trees/${viewTree}`),
  ]);
  if (a.truncated || b.truncated || !Array.isArray(a.tree) || !Array.isArray(b.tree)) return false;
  const [head, ...rest] = segments;
  const entries = (t) => new Map(t.tree.filter((e) => e.path !== head).map((e) => [e.path, `${e.type}:${e.sha}`]));
  const left = entries(a),
    right = entries(b);
  if (left.size !== right.size || [...left].some(([k, v]) => right.get(k) !== v)) return false;
  if (!rest.length) return b.tree.some((e) => e.path === head && e.type === 'blob');
  const sub = (t) => t.tree.find((e) => e.path === head && e.type === 'tree')?.sha;
  return Boolean(sub(a) && sub(b)) && sameTreeRemote(api, sub(a), sub(b), rest);
}
const VIEWS_BRANCH = 'backlog-views';
const publishedFor = (message, revision) => message.split('\n')[0] === `Backlog views for ${revision}`;
async function optional(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  if (response.status === 404) return null;
  if (!response.ok) fail(`GitHub returned HTTP ${response.status}`);
  return response.json();
}
// F-095-T04: remaining hours, as each project estimates them (uncalibrated; never a percentage). "28 h", "2 h agent +
// 0.5 h owner" or "6 h owner" read as hours; days or anything else is not hours.
const hoursIn = (text) => {
  const m = /^(?:(\d+(?:\.\d+)?) h(?: agent)?)?(?:(?:^| \+ )(\d+(?:\.\d+)?) h owner)?$/.exec(String(text ?? '').trim());
  return m && (m[1] || m[2]) ? { agent: Number(m[1] ?? 0), owner: Number(m[2] ?? 0) } : null;
};
// Priorities by number (P1 first), sizes from Small to Very large; anything else after them.
const rank = (label) => {
  const p = /P(\d+)/.exec(label);
  if (p) return Number(p[1]);
  const i = ['Small', 'Medium', 'Large', 'Very large'].findIndex((x) => label.endsWith(` ${x}`));
  return i < 0 ? 99 : i;
};
function remainingEffort(ledger, loaded) {
  const open = [...loaded.values()].filter((r) => !r.archived && r.status !== 'Closed');
  const count = (key) =>
    Object.entries(open.reduce((acc, r) => ({ ...acc, [r[key]]: (acc[r[key]] ?? 0) + 1 }), {}))
      .filter(([k]) => k && k !== '—' && k !== 'Unknown')
      .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
      .map(([k, n]) => `${k}: ${n}`)
      .join(', ') || '—';
  const counts = { priorities: count('priority'), sizes: count('effort') };
  const line = /\*\*Remaining effort:\*\* ([^\n]*)/.exec(ledger)?.[1];
  if (line !== undefined) {
    if (/^no open steps\b/.test(line)) return { agent: 0, owner: 0, basis: 'totals line', ...counts };
    const amount = line.split(' across ')[0].trim();
    // "X h and Y days" when a backlog mixes units: the hours count, the days do not, so the total is partial.
    const [hoursPart, daysPart] = amount.split(' and ');
    const h = hoursIn(hoursPart);
    if (!h) return { agent: null, owner: null, basis: `totals line not in hours: "${amount}"`, ...counts };
    const unestimated = /without an estimate/.test(line);
    const partial = unestimated || Boolean(daysPart);
    const notes = [
      ...(daysPart ? [`${daysPart.trim()} not counted in hours`] : []),
      ...(unestimated ? ['some steps unestimated'] : []),
    ];
    return { ...h, partial, basis: ['totals line', ...notes].join(', '), ...counts };
  }
  const cells = open.map((r) => r.remaining).filter((c) => c && c !== '—');
  if (!cells.length) return { agent: null, owner: null, basis: 'no totals line or Remaining cells', ...counts };
  const read = cells.map(hoursIn);
  if (read.some((h) => !h)) return { agent: null, owner: null, basis: 'Remaining cells not in hours', ...counts };
  const partial = cells.length < open.length;
  return {
    agent: read.reduce((n, h) => n + h.agent, 0),
    owner: read.reduce((n, h) => n + h.owner, 0),
    partial,
    basis: `Remaining cells of ${cells.length} open record${cells.length === 1 ? '' : 's'}${partial ? `, ${open.length - cells.length} without` : ''}`,
    ...counts,
  };
}
// F-095-T05: the owner view. Every open record and step gets a state: Ready (an agent can start), Owner (waits on the
// owner's procedure or decision), Waiting on <ref> (behind work that can still move), Blocked (a chain that ends at an
// owner step, an unknown or unavailable prerequisite, a cycle, or a record marked Blocked) or Done. Read only.
const DONE_STEPS = new Set(['Verified', 'Completed']);
const ownerKind = (who) =>
  /🧑‍🔧/.test(who) ? 'Procedure' : /🤔/.test(who) ? 'Decision' : /🧑/.test(who) ? 'Owner' : null;
function ownerView(results) {
  const repos = new Map(results.map((r) => [r.id, r]));
  const lookup = (ref) => {
    const [repo, id] = ref.split(':');
    const r = repos.get(repo);
    if (!r?.available) return { missing: r ? 'unavailable' : 'unknown', repo };
    if (/-T\d{2}$/.test(id)) {
      const parent = r.records.get(id.replace(/-T\d{2}$/, ''));
      const step = parent?.steps.find((x) => x.id === id);
      return step ? { repo, kind: 'step', item: step, parent } : { missing: 'unknown', repo };
    }
    const record = r.records.get(id);
    return record ? { repo, kind: 'record', item: record, parent: record } : { missing: 'unknown', repo };
  };
  const memo = new Map();
  const where = (from, ref) => (ref.split(':')[0] === from ? 'in this project' : 'in another project');
  // Every prerequisite counts: one that is blocked or waits on the owner blocks this item, whatever the order of the
  // list; otherwise the first unfinished one is what it waits on; null when all are done (review of F-095-T05).
  const prerequisites = (repo, deps, trail) => {
    let blocked = null,
      waiting = null;
    for (const dep of deps.map((d) => (d.includes(':') ? d : `${repo}:${d}`))) {
      const found = lookup(dep);
      if (found.missing === 'unavailable')
        blocked ??= { state: 'Blocked', cause: { what: 'unavailable source of', ref: dep, where: '' } };
      else if (found.missing)
        blocked ??= { state: 'Blocked', cause: { what: 'unknown prerequisite', ref: dep, where: where(repo, dep) } };
      else {
        const st = itemState(found, trail);
        if (st.state === 'Done') continue;
        if (st.state === 'Owner')
          blocked ??= { state: 'Blocked', cause: { what: 'owner step', ref: dep, where: where(repo, dep) } };
        else if (st.state === 'Blocked') blocked ??= st;
        else waiting ??= { state: 'Waiting', on: dep };
      }
    }
    return blocked ?? waiting;
  };
  const stepState = (repo, step, trail, parent) => {
    const key = `${repo}:${step.id}`;
    if (memo.has(key)) return memo.get(key);
    if (trail.has(key)) return { state: 'Blocked', cause: { what: 'cycle through', ref: key, where: '' } };
    trail.add(key);
    let result;
    if (DONE_STEPS.has(step.status)) result = { state: 'Done' };
    else if (parent?.status === 'Blocked')
      result = { state: 'Blocked', cause: { what: 'record marked Blocked:', ref: `${repo}:${parent.id}`, where: '' } };
    else if (/⏳/.test(step.who))
      result =
        prerequisites(repo, step.dependsOn, trail) ??
        (step.dependsOn.length
          ? // every prerequisite is done here, but the step still waits: its repository has not recorded it yet
            { state: 'Waiting', on: `${step.dependsOn.join(', ')} (done; record it in externalMet)` }
          : { state: 'Blocked', cause: { what: 'waiting with no prerequisite listed:', ref: key, where: '' } });
    else if (ownerKind(step.who)) result = { state: 'Owner', kind: ownerKind(step.who) };
    else if (/🤖/.test(step.who))
      // an implemented step only waits on its own verification: ready, never the next pick
      result = { state: 'Ready', verify: step.status.startsWith('Implemented') };
    else result = { state: 'Blocked', cause: { what: 'no actor in', ref: key, where: '' } };
    trail.delete(key);
    memo.set(key, result);
    return result;
  };
  const recordState = (repo, record, trail) => {
    if (record.archived || record.status === 'Closed') return { state: 'Done' };
    if (record.status === 'Blocked')
      return { state: 'Blocked', cause: { what: 'record marked Blocked:', ref: `${repo}:${record.id}`, where: '' } };
    const open = record.steps.filter((x) => !DONE_STEPS.has(x.status));
    if (!open.length) {
      // a record without steps honours its own Depends on cell and its ⏳ Agent cell
      const waits = record.dependsOn.length || record.agent === '⏳';
      const before = waits ? prerequisites(repo, record.dependsOn, trail) : null;
      if (before) return before;
      return ['Procedure', 'Decision', 'Both'].includes(record.human)
        ? { state: 'Owner', kind: record.human }
        : { state: 'Ready' };
    }
    const states = open.map((x) => stepState(repo, x, trail, record));
    return (
      states.find((x) => x.state === 'Ready' && !x.verify) ??
      states.find((x) => x.state === 'Ready') ??
      states.find((x) => x.state === 'Owner') ??
      states.find((x) => x.state === 'Waiting') ??
      states[0]
    );
  };
  const itemState = (found, trail = new Set()) =>
    found.kind === 'step'
      ? stepState(found.repo, found.item, trail, found.parent)
      : recordState(found.repo, found.item, trail);
  // Every open unit of work: open steps, and records with no steps.
  const units = results
    .filter((r) => r.available)
    .flatMap((r) =>
      [...r.records.values()]
        .filter((b) => !b.archived && b.status !== 'Closed')
        .flatMap((b) => {
          const open = b.steps.filter((x) => !DONE_STEPS.has(x.status));
          return open.length
            ? open.map((x) => ({
                repo: r.id,
                ref: `${r.id}:${x.id}`,
                title: x.title,
                ...stepState(r.id, x, new Set(), b),
              }))
            : [{ repo: r.id, ref: `${r.id}:${b.id}`, title: b.title, ...recordState(r.id, b, new Set()) }];
        }),
    );
  return { lookup, itemState, units };
}
async function request(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) fail(`GitHub returned HTTP ${response.status}`);
  return response.json();
}
try {
  if (!['check', 'dashboard'].includes(mode) || (write && mode !== 'dashboard'))
    fail('Usage: solution.mjs check|dashboard [--write] [--remote] [--json] [--manifest=PATH]');
  if (args.includes('--json') && mode !== 'check') fail('--json goes with check');
  const flags = new Set();
  for (const arg of args) {
    const match = arg.match(/^--(remote|offline|write|manifest|json)(?:=(.+))?$/),
      key = match?.[1];
    if (!match || flags.has(key) || (key === 'manifest' ? match[2] === undefined : match[2] !== undefined))
      fail(`Unknown, duplicate or malformed option: ${arg}`);
    flags.add(key);
  }
  if (remote && args.includes('--offline')) fail('--remote cannot be used offline');
  const stamp = existsSync(resolve(root, '.harness.json')) ? read(resolve(root, '.harness.json')) : {};
  const setting = stamp.solution;
  if (
    setting !== undefined &&
    (!setting ||
      typeof setting !== 'object' ||
      !['coordinator', 'component'].includes(setting.role) ||
      typeof setting.manifest !== 'string')
  )
    fail('solution needs a coordinator/component role and manifest path');
  const manifest = option('manifest') ?? setting?.manifest;
  if (stamp.stacks?.includes('solution') && !manifest) fail('Solution profile requires a manifest');
  if (!manifest) {
    console.log('No solution profile configured; ordinary repository behaviour is unchanged.');
    process.exit(0);
  }
  const manifestPath = resolve(root, manifest);
  if (!existsSync(manifestPath))
    fail(
      'Solution manifest unavailable. Component work remains independent; run coordinator checks where the manifest is available.',
    );
  const home = dirname(manifestPath),
    s = read(manifestPath);
  if (s.schemaVersion !== 1 || typeof s.name !== 'string' || !s.name.trim())
    fail('Solution needs schemaVersion 1 and a name');
  if (!Array.isArray(s.repositories)) fail('Solution repositories must be an array');
  safeFile(home, s.dashboard ?? 'docs/SOLUTION-DASHBOARD.md');
  const all = [
    {
      id: 'solution',
      repository: s.repository,
      path: '.',
      backlog: s.backlog ?? 'docs/BACKLOG.md',
      ref: 'working checkout',
    },
    ...s.repositories,
  ];
  const seen = new Set();
  for (const repo of all) {
    if (!repo || !/^[a-z][a-z0-9-]*$/.test(repo.id) || seen.has(repo.id))
      fail(`Invalid/duplicate repository ID: ${repo?.id}`);
    seen.add(repo.id);
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo.repository ?? ''))
      fail(`${repo.id}: repository must be owner/name`);
    if (typeof repo.path !== 'string' || !repo.path.trim()) fail(`${repo.id}: explicit local checkout path required`);
    if (typeof repo.ref !== 'string' || !repo.ref.trim()) fail(`${repo.id}: explicit branch/tag/commit ref required`);
    if (repo.emoji !== undefined && (typeof repo.emoji !== 'string' || !repo.emoji.trim() || repo.emoji.length > 16))
      fail(`${repo.id}: emoji must be a short string`);
    if (
      repo.archives !== undefined &&
      (!Array.isArray(repo.archives) || repo.archives.some((p) => typeof p !== 'string'))
    )
      fail(`${repo.id}: archives must be a list of file paths`);
    for (const path of [repo.backlog ?? 'docs/BACKLOG.md', ...(repo.archives ?? [])]) repositoryPath(path); // validate shape, then resolve filesystem paths in the actual owning checkout
  }
  if (new Set(all.map((r) => r.repository.toLowerCase())).size !== all.length)
    fail('Each repository has one unique ID; do not alias the same repository twice');
  const results = [],
    problems = [];
  // F-095-T02: the owner's order across the solution, in the coordinator: a numbered `repo:ID` list (a record or a step,
  // with an optional note after " — ") between order markers. Checked here, offline: references only, never status.
  const order = [];
  if (s.order !== undefined) {
    if (typeof s.order !== 'string') fail('order must be a file path in the coordinator');
    const file = safeFile(home, s.order);
    // A missing or unreadable file is a problem like any other: the component checks still run and report.
    let content = '';
    if (!existsSync(file) || !statSync(file).isFile()) problems.push(`order: ${s.order} is missing or not a file`);
    else content = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const pairs = [...content.matchAll(/<!-- order:start -->([\s\S]*?)<!-- order:end -->/g)];
    const list = pairs[0]?.[1];
    if (content && list === undefined)
      problems.push(`order: ${s.order} has no <!-- order:start --> … <!-- order:end --> list`);
    if (pairs.length > 1) problems.push(`order: ${s.order} has ${pairs.length} order lists; keep one`);
    const listed = new Set();
    for (const line of (list ?? '').split('\n').map((l) => l.trim())) {
      if (!line) continue;
      const m = /^(\d+)\. ([a-z][a-z0-9-]*):(\S+?)(?: — (.+))?$/.exec(line);
      if (!m) {
        problems.push(`order: ${line}: write a numbered item, "1. <repo>:<ID> — optional note"`);
        continue;
      }
      const [, number, repo, id, note] = m,
        ref = `${repo}:${id}`;
      if (Number(number) !== order.length + 1) problems.push(`order: ${line}: number it ${order.length + 1}`);
      if (!/^[BF]-\d{3}(?:-T\d{2})?$/.test(id))
        problems.push(`order: ${line}: write <repo>:<B-/F-ID> or <repo>:<STEP-ID>`);
      else if (!seen.has(repo)) problems.push(`order: ${line}: unknown repository ${repo}`);
      else if (listed.has(ref)) problems.push(`order: ${line}: listed twice`);
      listed.add(ref);
      order.push({ ref, repo, id, note: note ?? '' });
    }
  }
  for (const repo of all) {
    const base = resolve(home, repo.path),
      backlog = repo.backlog ?? 'docs/BACKLOG.md';
    try {
      let revision,
        dirty = false,
        built = null,
        view = null,
        viewCommit = null,
        ledger = '';
      const loaded = new Map();
      const paths = [...(repo.archives ?? []), backlog];
      if (remote && repo.id !== 'solution') {
        // Resolve the requested ref once, then read every file at that immutable commit.
        const commit = await request(
          `https://api.github.com/repos/${repo.repository}/commits/${encodeURIComponent(repo.ref)}`,
        );
        if (!/^[a-f0-9]{40}$/.test(commit.sha ?? '')) fail('Unsupported commit response');
        revision = commit.sha;
        const api = `https://api.github.com/repos/${repo.repository}`;
        const stampFile = await optional(`${api}/contents/.harness.json?ref=${revision}`);
        built = builtViews(
          stampFile?.encoding === 'base64' ? Buffer.from(stampFile.content, 'base64').toString('utf8') : null,
          revision,
        );
        let at = revision;
        if (built) {
          // The publication of exactly this commit; remotely there is no checkout to rebuild from.
          // Up to the 1,000 newest publications; an older commit is read from a local checkout instead.
          let found;
          for (let page = 1; page <= 10 && !found; page++) {
            const history = (await optional(`${api}/commits?sha=${VIEWS_BRANCH}&per_page=100&page=${page}`)) ?? [];
            if (!Array.isArray(history) || !history.length) break;
            const candidate = history.find(
              (c) => publishedFor(c?.commit?.message ?? '', revision) && /^[a-f0-9]{40}$/.test(c.sha),
            );
            if (candidate) {
              const [source, published] = await Promise.all([
                request(`${api}/git/commits/${revision}`),
                request(`${api}/git/commits/${candidate.sha}`),
              ]);
              if (await sameTreeRemote(api, source.tree?.sha, published.tree?.sha, backlog.split('/')))
                found = candidate;
              else break;
            }
          }
          if (!found)
            fail(`built views: no publication of ${revision} on ${VIEWS_BRANCH} (rebuild it from a local checkout)`);
          at = viewCommit = found.sha;
          view = `view published on ${VIEWS_BRANCH} at ${found.sha.slice(0, 12)}`;
        }
        for (const path of paths) {
          const file = await request(
            `https://api.github.com/repos/${repo.repository}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${built && path === backlog ? at : revision}`,
          );
          // F-095-T03: the contents API leaves a file over 1 MB out (encoding "none"); read its blob at the same commit.
          const body =
            file.encoding === 'none' && /^[a-f0-9]{40}$/.test(file.sha ?? '')
              ? await request(`https://api.github.com/repos/${repo.repository}/git/blobs/${file.sha}`)
              : file;
          if (body.encoding !== 'base64' || typeof body.content !== 'string') fail('Unsupported backlog response');
          const text = Buffer.from(body.content, 'base64').toString('utf8');
          if (path === backlog) ledger = text;
          for (const [id, record] of records(text, repo.id, path, path !== backlog)) loaded.set(id, record);
        }
      } else {
        if (!existsSync(base)) fail('checkout unavailable');
        const origin = git(base, 'remote', 'get-url', 'origin');
        const canonical = origin
          ?.replace(/\.git$/, '')
          .match(/^(?:https?:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([^/]+\/[^/]+)$/)?.[1];
        if (!canonical || canonical.toLowerCase() !== repo.repository.toLowerCase())
          fail('checkout origin does not match the declared repository');
        if (resolve(git(base, 'rev-parse', '--show-toplevel') ?? '') !== base)
          fail('path must name the repository root');
        revision = git(base, 'rev-parse', 'HEAD');
        dirty = Boolean(git(base, 'status', '--porcelain'));
        const expected = repo.id === 'solution' ? revision : git(base, 'rev-parse', repo.ref);
        if (!expected || expected !== revision)
          fail('checkout HEAD differs from the declared ref; refresh/check out the requested ref explicitly');
        built = builtViews(
          dirty && existsSync(resolve(base, '.harness.json'))
            ? readFileSync(resolve(base, '.harness.json'), 'utf8')
            : git(base, 'show', `${revision}:.harness.json`),
          revision,
        );
        let builtView = null;
        if (built) {
          // The publication of exactly this commit, as last fetched; else a rebuild from the sources at this commit
          // with this coordinator's own copied tool, in memory: the component checkout is never written.
          const found = dirty
            ? null
            : git(
                base,
                'log',
                '--format=%H',
                '-1',
                '--fixed-strings',
                `--grep=Backlog views for ${revision}`,
                `refs/remotes/origin/${VIEWS_BRANCH}`,
              );
          if (
            found &&
            publishedFor(git(base, 'log', '-1', '--format=%B', found) ?? '', revision) &&
            git(base, 'diff', '--quiet', revision, found, '--', '.', `:!${backlog}`) !== null &&
            git(base, 'cat-file', '-e', `${found}:${backlog}`) !== null
          ) {
            builtView = git(base, 'show', `${found}:${backlog}`);
            viewCommit = found;
            view = `view published on ${VIEWS_BRANCH} at ${found.slice(0, 12)}`;
          } else {
            const tool = resolve(dirname(fileURLToPath(import.meta.url)), 'work-items.mjs');
            if (!existsSync(tool))
              fail(
                `built views: no publication of ${revision} on ${VIEWS_BRANCH} and no tools/work-items.mjs in the coordinator to rebuild it`,
              );
            builtView = (await import(pathToFileURL(tool).href)).builtLedger(base);
            view = `view rebuilt from sources at ${revision.slice(0, 12)}${dirty ? ' (local changes)' : ''}`;
          }
          if (typeof builtView !== 'string') fail('built views: the view could not be obtained');
        }
        for (const path of paths) {
          const file = safeFile(base, path);
          const content =
            built && path === backlog
              ? builtView
              : dirty
                ? readFileSync(file, 'utf8')
                : git(base, 'show', `${revision}:${path}`);
          if (content === null) fail(`Committed source unavailable: ${path}`);
          if (path === backlog) ledger = content;
          for (const [id, record] of records(content, repo.id, path, path !== backlog)) loaded.set(id, record);
        }
      }
      results.push({
        ...repo,
        records: loaded,
        revision,
        dirty,
        available: true,
        built,
        view,
        viewCommit,
        effort: remainingEffort(ledger, loaded),
      });
    } catch (e) {
      problems.push(`${repo.id}: ${e.message}`);
      results.push({ ...repo, records: new Map(), available: false });
    }
  }
  const coordinator = results[0];
  for (const record of coordinator.records.values())
    for (const ref of record.refs) {
      const [owner, id] = ref.split(':');
      const repo = results.find((r) => r.id === owner);
      if (!repo || owner === 'solution') problems.push(`solution:${record.id}: unknown component ${owner}`);
      else if (repo.available && !repo.records.has(id))
        problems.push(
          `solution:${record.id}: missing ${ref} (closed/archived? reconcile the link with the owning repository)`,
        );
    }
  const linked = new Set([...coordinator.records.values()].flatMap((r) => r.refs));
  const recordLink = (r, b) =>
    r.dirty
      ? relative(dirname(resolve(home, s.dashboard ?? 'docs/SOLUTION-DASHBOARD.md')), resolve(home, r.path, b.file))
          .split('/')
          .map(encodeURIComponent)
          .join('/') + `#${b.id.toLowerCase()}`
      : r.built && !b.archived
        ? r.viewCommit
          ? `https://github.com/${r.repository}/blob/${r.viewCommit}/${b.file}#${b.id.toLowerCase()}`
          : `https://github.com/${r.repository}/blob/${r.revision}/${r.built.records}/${b.id}.md`
        : `https://github.com/${r.repository}/blob/${r.revision}/${b.file}#${b.id.toLowerCase()}`;
  const snapshot = new Date().toISOString();
  const output = [
    '<!-- generated: project-harness solution dashboard; edit owning backlogs, not this file -->',
    `# ${text(s.name)} dashboard`,
    '',
    `Snapshot: ${snapshot}. Read-only aggregation; no combined completion percentage. Solution integration status is independent of component status.`,
    '',
    '| Source | Revision | Snapshot state |',
    '|---|---|---|',
  ];
  for (const r of results)
    output.push(
      `| ${text(r.id)} | ${r.available ? `[${r.revision.slice(0, 12)}](https://github.com/${r.repository}/commit/${r.revision})` : 'Unknown'} | ${r.available ? `${r.dirty ? 'Local changes — not a committed snapshot' : 'Committed snapshot'}; requested ${text(r.ref)}; ${remote && r.id !== 'solution' ? 'GitHub' : 'local checkout, not fetched'}${r.view ? `; ${r.view}` : ''}` : 'Unavailable — status unknown'} |`,
    );
  // F-095-T05: the owner view, ahead of the detail.
  const view = ownerView(results);
  const label = (r) => `${r.emoji ? `${text(r.emoji)} ` : ''}${text(r.id)}`;
  const stateText = (st, first) =>
    st.state === 'Ready'
      ? first
        ? '**Ready — next**'
        : st.verify
          ? 'Ready (verification)'
          : 'Ready'
      : st.state === 'Owner'
        ? `Owner: ${st.kind}`
        : st.state === 'Waiting'
          ? `Waiting on ${st.on}`
          : st.state === 'Blocked'
            ? `Blocked: ${st.cause.what} ${st.cause.ref}`
            : st.state;
  const unitsOf = (r, state) => view.units.filter((u) => u.repo === r.id && u.state === state).length;
  output.push(
    '',
    '## Owner view',
    '',
    "Open work per project, by what it waits on. Remaining hours are each project's own estimate (below).",
    '',
    '| Project | Ready | Waiting for the owner | Blocked | Waiting on other work | Remaining |',
    '|---|---|---|---|---|---|',
    ...results.map((r) =>
      r.available
        ? `| ${label(r)} | ${unitsOf(r, 'Ready')} | ${unitsOf(r, 'Owner')} | ${unitsOf(r, 'Blocked')} | ${unitsOf(r, 'Waiting')} | ${r.effort.agent === null ? 'Unknown' : `${Number((r.effort.agent + r.effort.owner).toFixed(2))} h`} |`
        : `| ${label(r)} | Unknown | Unknown | Unknown | Unknown | Unknown |`,
    ),
  );
  if (order.length) {
    let marked = false;
    output.push(
      '',
      '## Solution order',
      '',
      `The owner's order (${text(s.order)}): take the first ready item; it never skips a prerequisite or an owner decision.`,
      '',
      '| # | Item | Title | Status | Priority | Remaining | State | Note |',
      '|---|---|---|---|---|---|---|---|',
    );
    order.forEach((o, i) => {
      const found = view.lookup(o.ref);
      if (found.missing)
        return output.push(
          `| ${i + 1} | ${text(o.ref)} | — | — | — | — | ${found.missing === 'unavailable' ? 'Source unavailable' : 'Not in backlog'} | ${text(o.note)} |`,
        );
      const st = view.itemState(found);
      const first = st.state === 'Ready' && !st.verify && !marked;
      if (first) marked = true;
      output.push(
        `| ${i + 1} | ${text(o.ref)} | ${text(found.item.title)} | ${text(found.item.status)} | ${text(found.parent.priority)} | ${text(found.item.remaining)} | ${text(stateText(st, first))} | ${text(o.note)} |`,
      );
    });
  }
  const owner = view.units.filter((u) => u.state === 'Owner');
  const blocked = view.units.filter((u) => u.state === 'Blocked');
  const idle = results.filter((r) => !r.available || !view.units.some((u) => u.repo === r.id && u.state === 'Ready'));
  const why = (r) => {
    if (!r.available) return 'source unavailable';
    const mine = view.units.filter((u) => u.repo === r.id);
    if (!mine.length) return 'no open work';
    if (mine.every((u) => u.state === 'Owner')) return 'all open work waits on the owner';
    if (mine.every((u) => u.state === 'Blocked')) return 'all open work is blocked';
    return 'open work waits on the owner, on other work or on a block';
  };
  output.push(
    '',
    '## Waiting for the owner',
    '',
    ...(owner.length
      ? [
          '| Item | Kind | Title |',
          '|---|---|---|',
          ...owner.map((u) => `| ${text(u.ref)} | ${text(u.kind)} | ${text(u.title)} |`),
        ]
      : ['Nothing waits on the owner.']),
    '',
    '## Blocked',
    '',
    ...(blocked.length
      ? [
          '| Item | Root cause |',
          '|---|---|',
          ...blocked.map(
            (u) =>
              `| ${text(u.ref)} | ${text(`${u.cause.what} ${u.cause.ref}${u.cause.where ? `, ${u.cause.where}` : ''}`)} |`,
          ),
        ]
      : ['Nothing is blocked.']),
    '',
    '## Nothing to do',
    '',
    ...(idle.length
      ? ['| Project | Reason |', '|---|---|', ...idle.map((r) => `| ${label(r)} | ${why(r)} |`)]
      : ['Every project has ready work.']),
  );
  for (const r of results.filter((x) => x.available)) {
    const open = [...r.records.values()]
      .filter((b) => !b.archived && b.status !== 'Closed')
      .flatMap((b) => b.steps.filter((x) => !DONE_STEPS.has(x.status)));
    if (!open.length) continue;
    output.push(
      '',
      `<details><summary>${text(r.id)}: ${open.length} open step${open.length === 1 ? '' : 's'}</summary>`,
      '',
      '| Step | Title | Status | Remaining | Who | Depends on |',
      '|---|---|---|---|---|---|',
      ...open.map(
        (x) =>
          `| ${text(`${r.id}:${x.id}`)} | ${text(x.title)} | ${text(x.status)} | ${text(x.remaining)} | ${text(x.who.replace(/\]\([^)]*\)/g, ']').replace(/[[\]]/g, ''))} | ${text(x.dependsOn.join(', ') || '—')} |`,
      ),
      '',
      '</details>',
    );
  }
  // F-095-T04: remaining hours per backlog and a solution total that never hides an unknown backlog.
  const hours = (n) => (n === null ? 'Unknown' : `${Number(n.toFixed(2))} h`);
  const known = results.filter((r) => r.available && r.effort.agent !== null);
  const partialTotal = known.length < results.length || known.some((r) => r.effort.partial);
  const total = (key) => `${partialTotal ? 'at least ' : ''}${hours(known.reduce((n, r) => n + r.effort[key], 0))}`;
  output.push(
    '',
    '## Remaining effort',
    '',
    "Hours each backlog still holds, as each project's own, uncalibrated estimate. The solution line adds them; it is no completion measure.",
    '',
    '| Source | Agent | Owner | From | Open records by priority | Open records by size |',
    '|---|---|---|---|---|---|',
    ...results.map((r) =>
      r.available
        ? `| ${text(r.id)} | ${hours(r.effort.agent)} | ${hours(r.effort.owner)} | ${text(r.effort.basis)} | ${text(r.effort.priorities)} | ${text(r.effort.sizes)} |`
        : `| ${text(r.id)} | Unknown | Unknown | source unavailable | Unknown | Unknown |`,
    ),
    `| **Solution** | ${total('agent')} | ${total('owner')} | ${known.length} of ${results.length} backlogs | | |`,
  );
  output.push(
    '',
    '## Integration outcomes',
    '',
    '| Record | Outcome | Status | Human action | Effort | Component links |',
    '|---|---|---|---|---|---|',
  );
  for (const b of coordinator.records.values())
    output.push(
      `| [solution:${b.id}](${recordLink(coordinator, b)}) | ${text(b.title)} | ${text(b.status)} | ${text(b.human)} | ${text(b.effort)} | ${text(b.refs.join(', ') || '—')} |`,
    );
  output.push(
    '',
    '## Component work',
    '',
    '| Record | Item | Status | Human action | Effort | Reviewed |',
    '|---|---|---|---|---|---|',
  );
  for (const r of results.slice(1)) {
    if (!r.available) output.push(`| ${text(r.id)} | Source unavailable | Unknown | Unknown | Unknown | Unknown |`);
    for (const b of r.records.values())
      if (!b.archived || linked.has(`${r.id}:${b.id}`))
        output.push(
          `| [${r.id}:${b.id}](${recordLink(r, b)}) | ${text(b.title)} | ${text(b.status)} | ${text(b.human)} | ${text(b.effort)} | ${text(b.reviewed)} |`,
        );
  }
  output.push(
    '',
    '## Source and link problems',
    '',
    ...(problems.length
      ? problems.map((p) => `- ${text(p)}`)
      : ['None detected. This does not verify semantic ownership, integration behaviour or real-device acceptance.']),
    '',
  );
  if (mode === 'dashboard') {
    const content = output.join('\n');
    if (write) {
      if (setting?.role === 'component' || resolve(root) !== resolve(home))
        fail('Only the coordinator may write its generated dashboard');
      const dest = safeFile(home, s.dashboard ?? 'docs/SOLUTION-DASHBOARD.md');
      const protectedSource = all.some((r) =>
        [r.backlog ?? 'docs/BACKLOG.md', ...(r.archives ?? [])].some((p) => resolve(home, r.path, p) === dest),
      );
      const componentRoot = all.slice(1).some((r) => {
        const base = resolve(home, r.path);
        return (
          inside(base, dest) ||
          (existsSync(base) &&
            inside(
              realpathSync(base),
              realpathSync(
                (() => {
                  let p = dest;
                  while (!existsSync(p)) p = dirname(p);
                  return p;
                })(),
              ),
            ))
        );
      });
      if (inside(resolve(home, '.git'), dest) || dest === resolve(manifestPath) || protectedSource || componentRoot)
        fail('Dashboard must not overwrite configuration, an owning backlog/archive or any component checkout');
      if (
        existsSync(dest) &&
        !readFileSync(dest, 'utf8').startsWith('<!-- generated: project-harness solution dashboard;')
      )
        fail('Refusing to replace a non-generated file');
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, content);
      console.log(`Wrote ${relative(home, dest)} (${snapshot}); ${problems.length} source/link problem(s).`);
    } else console.log(content);
  } else if (args.includes('--json'))
    // F-095-T03: what the reader keeps, per repository, for the owner view and for tests.
    console.log(
      JSON.stringify(
        {
          name: s.name,
          order,
          repositories: results.map((r) => ({
            id: r.id,
            repository: r.repository,
            available: r.available,
            revision: r.revision ?? null,
            dirty: r.dirty ?? false,
            view: r.view ?? null,
            effort: r.effort ?? null,
            records: [...r.records.values()],
          })),
          problems,
        },
        null,
        2,
      ),
    );
  else console.log(`Solution ${s.name}: ${all.length} repository sources; ${problems.length} source/link problem(s).`);
  if (problems.length) {
    problems.forEach((p) => console.error(p));
    process.exitCode = 1;
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
