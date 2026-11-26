// F-110: the live index builder reads two invented backlogs into node:sqlite rows; an unknown layout is a problem row.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';

const tool = resolve('core/tools/backlog-index.mjs');
const env = {
  ...process.env,
  GIT_AUTHOR_NAME: 'Fixture',
  GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture',
  GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
  GH_TOKEN: '',
  GITHUB_TOKEN: '',
};
const temp = (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'harness backlog index '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
};
const put = (root, path, content) => {
  mkdirSync(resolve(root, path, '..'), { recursive: true });
  writeFileSync(join(root, path), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
};
const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { env, encoding: 'utf8' }).trim();
// A throwaway repository on branch main with an invented origin; returns its commit.
function repository(root, files) {
  for (const [path, content] of Object.entries(files)) put(root, path, content);
  git(root, 'init', '-q', '-b', 'main');
  git(root, 'remote', 'add', 'origin', 'https://github.com/example/alpha.git');
  git(root, 'add', '.');
  git(root, 'commit', '-qm', 'fixture');
  return git(root, 'rev-parse', 'HEAD');
}
const run = (cwd, ...args) => spawnSync(process.execPath, [tool, ...args], { cwd, env, encoding: 'utf8' });
const build = (cwd, db, repo, source) => {
  const r = run(cwd, 'build', '--db', db, '--repo', repo, '--source', source);
  assert.equal(r.status, 0, r.stderr);
};
const dump = (cwd, db) => {
  const r = run(cwd, 'dump', '--db', db);
  assert.equal(r.status, 0, r.stderr);
  return r.stdout;
};

const task = (id, fields) => ({
  version: 1,
  id,
  parent: id.slice(0, 5),
  goal: 'An invented outcome',
  acceptance: ['Observable result'],
  dependsOn: [],
  resources: ['src/a.txt'],
  capabilities: ['bounded-edit'],
  privacy: 'Invented fixture',
  validation: ['node --test'],
  escalation: ['Stop on ambiguity'],
  ...fields,
});
const effort = (fields) => ({ size: 'small', estimate: '1 h', basis: 'Fixture', reviewed: '2026-11-26', ...fields });
const recordSource = (id, title, status, priority, pr) =>
  `### ${id}\n\n**${title}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | ${priority} | ${status} | 🟢 Small |\n\n` +
  `💻 **→ Human action required: No**<br />Next: from tasks.\n\n| | |\n|---|---|\n| **Issue** | An issue. |\n| **Reproduce** | Steps. |\n| **Check** | A check. |\n\n` +
  `<details>\n<summary>Evidence</summary>\n\n| Field | Value |\n|---|---|\n| PR / evidence | ${pr} |\n| Opened | 2026-11-26 |\n\n</details>\n\n---\n\n`;
// Source-owned records with step files: an open feature with a closed step that names a PR, an owner step and a
// dependency on another repository's step; a bug with one ready step.
const sourceOwned = {
  '.harness.json': {
    workItems: {
      enabled: true,
      layout: 'docs/work/layout.json',
      records: 'docs/work/records',
      tasks: 'docs/work/tasks',
      profiles: 'docs/agents/model-profiles.json',
      featurePlans: true,
    },
  },
  'docs/work/layout.json': {
    version: 1,
    segments: [{ text: '# Alpha backlog\n\n## Work items\n\n' }, { records: 'all' }],
  },
  'docs/agents/model-profiles.json': {
    version: 1,
    profiles: [{ id: 'fixture', model: 'invented', status: 'candidate', capabilities: ['bounded-edit'], evidence: [] }],
  },
  'docs/work/records/F-001.md': recordSource(
    'F-001',
    'Invented feature',
    'Open',
    '🔶 P2',
    '[#12](https://github.com/example/alpha/pull/12); [other](https://github.com/example/beta/pull/99)',
  ),
  'docs/work/records/B-002.md': recordSource('B-002', 'Invented bug', 'Open', '🔺 P1', '—'),
  'docs/work/tasks/F-001-T01.json': task('F-001-T01', {
    title: 'First step',
    status: 'closed',
    effort: effort({ agentHours: 0 }),
    prs: [{ pr: 12 }],
  }),
  'docs/work/tasks/F-001-T02.json': task('F-001-T02', {
    title: 'Owner decides',
    status: 'planned',
    dependsOn: ['F-001-T01'],
    effort: effort({ ownerHours: 0.5, ownerKind: 'decision' }),
  }),
  'docs/work/tasks/B-002-T01.json': task('B-002-T01', {
    title: 'Fix the bug',
    status: 'ready',
    dependsOn: ['beta:F-003-T01'],
    effort: effort({ agentHours: 1 }),
  }),
};
// The authored four-column backlog: a P1 bug and a feature waiting on human action.
const authored = {
  'docs/BACKLOG.md':
    '# Gamma backlog\n\n## Work items\n\n' +
    '### B-004\n\n**Invented crash**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔺 P1 | Open | 🟢 Small |\n\n' +
    '💻 **→ Human action required: No**<br />Next: reproduce it.\n\n| Field | Value |\n|---|---|\n| PR / evidence | #7 |\n\n---\n\n' +
    '### F-005\n\n**Invented choice**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🟣 | 🔹 P3 | Blocked | 🟡 Medium |\n\n' +
    '🧑 **→ Human action required: Yes**<br />The owner picks a colour.\n\n| Field | Value |\n|---|---|\n| PR / evidence | — |\n\n---\n',
};

const expectedSourceOwned = (commit) => ({
  schema: 1,
  tables: {
    sources: [{ repo: 'alpha', owner_name: 'example/alpha', ref: 'main', commit_sha: commit, layout: 'source-owned' }],
    records: [
      {
        repo: 'alpha',
        id: 'B-002',
        kind: 'B',
        title: 'Invented bug',
        status: 'Open',
        priority: '🔺 P1',
        effort: '🟢 Small',
        human_action: 'No',
        next: '💻 → Next: B-002-T01 — Fix the bug (Ready).',
        file: 'docs/work/records/B-002.md',
        archived: 0,
      },
      {
        repo: 'alpha',
        id: 'F-001',
        kind: 'F',
        title: 'Invented feature',
        status: 'Open',
        priority: '🔶 P2',
        effort: '🟢 Small',
        human_action: 'Decision',
        next: '🧑 → Next: 🤔 F-001-T02 — Owner decides (Planned).',
        file: 'docs/work/records/F-001.md',
        archived: 0,
      },
    ],
    steps: [
      {
        repo: 'alpha',
        id: 'B-002-T01',
        parent: 'B-002',
        title: 'Fix the bug',
        status: 'ready',
        owner_kind: null,
        agent_hours: 1,
        owner_hours: null,
        file: 'docs/work/tasks/B-002-T01.json',
      },
      {
        repo: 'alpha',
        id: 'F-001-T01',
        parent: 'F-001',
        title: 'First step',
        status: 'closed',
        owner_kind: null,
        agent_hours: 0,
        owner_hours: null,
        file: 'docs/work/tasks/F-001-T01.json',
      },
      {
        repo: 'alpha',
        id: 'F-001-T02',
        parent: 'F-001',
        title: 'Owner decides',
        status: 'planned',
        owner_kind: 'decision',
        agent_hours: null,
        owner_hours: 0.5,
        file: 'docs/work/tasks/F-001-T02.json',
      },
    ],
    depends_on: [
      { repo: 'alpha', item: 'B-002-T01', target: 'beta:F-003-T01', file: 'docs/work/tasks/B-002-T01.json' },
      { repo: 'alpha', item: 'F-001-T02', target: 'F-001-T01', file: 'docs/work/tasks/F-001-T02.json' },
    ],
    prs: [
      {
        repo: 'alpha',
        item: 'F-001',
        number: 12,
        state: null,
        merged_at: null,
        ci: null,
        file: 'docs/work/records/F-001.md',
      },
      {
        repo: 'alpha',
        item: 'F-001-T01',
        number: 12,
        state: null,
        merged_at: null,
        ci: null,
        file: 'docs/work/tasks/F-001-T01.json',
      },
    ],
    problems: [],
  },
});
const expectedAuthored = (commit) => ({
  schema: 1,
  tables: {
    sources: [{ repo: 'gamma', owner_name: 'example/alpha', ref: 'main', commit_sha: commit, layout: 'authored' }],
    records: [
      {
        repo: 'gamma',
        id: 'B-004',
        kind: 'B',
        title: 'Invented crash',
        status: 'Open',
        priority: '🔺 P1',
        effort: '🟢 Small',
        human_action: 'No',
        next: '💻 → Human action required: No Next: reproduce it.',
        file: 'docs/BACKLOG.md',
        archived: 0,
      },
      {
        repo: 'gamma',
        id: 'F-005',
        kind: 'F',
        title: 'Invented choice',
        status: 'Blocked',
        priority: '🔹 P3',
        effort: '🟡 Medium',
        human_action: 'Yes',
        next: '🧑 → Human action required: Yes The owner picks a colour.',
        file: 'docs/BACKLOG.md',
        archived: 0,
      },
    ],
    steps: [],
    depends_on: [],
    prs: [{ repo: 'gamma', item: 'B-004', number: 7, state: null, merged_at: null, ci: null, file: 'docs/BACKLOG.md' }],
    problems: [],
  },
});

test('F-110: source-owned records and step files become rows', (t) => {
  const root = temp(t),
    repo = join(root, 'alpha'),
    commit = repository(repo, sourceOwned);
  build(root, 'index.db', 'alpha', repo);
  assert.deepEqual(JSON.parse(dump(root, 'index.db')), expectedSourceOwned(commit));
});

test('F-110: an authored four-column backlog becomes rows', (t) => {
  const root = temp(t),
    repo = join(root, 'gamma'),
    commit = repository(repo, authored);
  build(root, 'index.db', 'gamma', repo);
  assert.deepEqual(JSON.parse(dump(root, 'index.db')), expectedAuthored(commit));
});

test('F-110: a second build of the same commit gives the same dump, and local changes are not read', (t) => {
  const root = temp(t),
    repo = join(root, 'alpha');
  repository(repo, sourceOwned);
  build(root, 'index.db', 'alpha', repo);
  const first = dump(root, 'index.db');
  put(repo, 'docs/work/records/B-002.md', recordSource('B-002', 'Edited, not committed', 'Open', '🔺 P1', '—'));
  build(root, 'index.db', 'alpha', repo);
  assert.equal(dump(root, 'index.db'), first);
  rmSync(join(root, 'index.db'));
  build(root, 'index.db', 'alpha', repo);
  assert.equal(dump(root, 'index.db'), first);
});

test('F-110: two repositories share one file; rebuilding one keeps the other', (t) => {
  const root = temp(t),
    alpha = join(root, 'alpha'),
    gamma = join(root, 'gamma');
  const a = repository(alpha, sourceOwned),
    g = repository(gamma, authored);
  build(root, 'index.db', 'alpha', alpha);
  build(root, 'index.db', 'gamma', gamma);
  build(root, 'index.db', 'alpha', alpha);
  const both = JSON.parse(dump(root, 'index.db')),
    one = expectedSourceOwned(a),
    two = expectedAuthored(g);
  for (const name of Object.keys(both.tables))
    assert.deepEqual(both.tables[name], [...one.tables[name], ...two.tables[name]], name);
});

test('F-110: an unknown layout is a problem row and no records', (t) => {
  const root = temp(t),
    repo = join(root, 'delta');
  repository(repo, { 'README.md': '# Delta\n\nNo backlog here.\n' });
  build(root, 'index.db', 'delta', repo);
  const { tables } = JSON.parse(dump(root, 'index.db'));
  assert.deepEqual(tables.records, []);
  assert.equal(tables.sources[0].layout, 'unknown');
  assert.equal(tables.problems.length, 1);
  assert.match(tables.problems[0].message, /unknown backlog layout/);
});

test('F-110: an unreadable ledger is a problem row naming its file', (t) => {
  const root = temp(t),
    repo = join(root, 'gamma');
  repository(repo, { 'docs/BACKLOG.md': '# Broken\n\n### F-009\n\nNo summary table.\n' });
  build(root, 'index.db', 'gamma', repo);
  const { tables } = JSON.parse(dump(root, 'index.db'));
  assert.deepEqual(tables.records, []);
  assert.equal(tables.problems.length, 1);
  assert.equal(tables.problems[0].file, 'docs/BACKLOG.md');
});

test('F-110: the command line refuses a malformed call', (t) => {
  const root = temp(t);
  for (const args of [
    [],
    ['build', '--db', 'x.db', '--repo', 'alpha'],
    ['build', '--db', 'x.db', '--repo', 'Alpha', '--source', '.'],
    ['build', '--db', 'x.db', '--repo', 'alpha', '--source', '.', '--remote', 'example/alpha@main'],
    ['dump'],
  ])
    assert.notEqual(run(root, ...args).status, 0, args.join(' '));
});

test('F-110: an unreadable repository is a problem row and replaces its earlier rows', (t) => {
  const root = temp(t),
    repo = join(root, 'alpha');
  repository(repo, sourceOwned);
  build(root, 'index.db', 'alpha', repo);
  rmSync(join(repo, '.git'), { recursive: true, force: true });
  build(root, 'index.db', 'alpha', repo);
  const { tables } = JSON.parse(dump(root, 'index.db'));
  assert.deepEqual(tables.records, []);
  assert.deepEqual(tables.steps, []);
  assert.equal(tables.sources.length, 1);
  assert.equal(tables.sources[0].layout, 'unreadable');
  assert.equal(tables.sources[0].commit_sha, null);
  assert.equal(tables.problems.length, 1);
  build(root, 'index.db', 'alpha', join(root, 'missing'));
  assert.equal(JSON.parse(dump(root, 'index.db')).tables.problems.length, 1);
});

test('F-110: importing the tool runs nothing, whatever the command line names', (t) => {
  const root = temp(t);
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(tool)})`, 'x'], {
    cwd: root,
    env,
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, '');
});

test('F-110: dump reads a file without changing it', (t) => {
  const root = temp(t),
    repo = join(root, 'gamma');
  repository(repo, authored);
  build(root, 'index.db', 'gamma', repo);
  const before = readFileSync(join(root, 'index.db'));
  dump(root, 'index.db');
  assert.deepEqual(readFileSync(join(root, 'index.db')), before);
  writeFileSync(join(root, 'other.db'), '');
  assert.notEqual(run(root, 'dump', '--db', 'other.db').status, 0);
  assert.equal(readFileSync(join(root, 'other.db'), 'utf8'), '');
});
