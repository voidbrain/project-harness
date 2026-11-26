// Self-contained MCP/solution contract fixtures; no real consumers, accounts, network or desktop applications.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, symlinkSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// F-101: dates in the dashboard print with non-breaking hyphens (U+2011).
const NB = '\u2011';
const source = fileURLToPath(new URL('../core/tools/', import.meta.url));
const env = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_AUTHOR_NAME: 'fixture',
  GIT_AUTHOR_EMAIL: 'fixture@example.com',
  GIT_COMMITTER_NAME: 'fixture',
  GIT_COMMITTER_EMAIL: 'fixture@example.com',
};
const write = (file, value) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
};
const temp = (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'harness profiles '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
};
const git = (dir, ...args) =>
  execFileSync('git', ['-C', dir, ...args], { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const commit = (dir) => {
  git(dir, 'add', '.');
  git(dir, 'commit', '-qm', 'fixture');
  return git(dir, 'rev-parse', 'HEAD');
};
const install = (dir) => {
  mkdirSync(join(dir, 'tools'), { recursive: true });
  for (const f of ['mcp.mjs', 'mcp-catalog.json', 'solution.mjs']) cpSync(join(source, f), join(dir, 'tools', f));
};
const run = (dir, tool, args = [], preload) => {
  const r = spawnSync(
    process.execPath,
    [...(preload ? ['--import', preload] : []), join(dir, 'tools', tool), ...args],
    { cwd: dir, env, encoding: 'utf8' },
  );
  return { code: r.status, out: r.stdout, err: r.stderr };
};
const selection = (id, extra = {}) => ({
  schemaVersion: 1,
  recommendations: [
    { id, reason: 'Needed for fixture workflow', lastChecked: '2026-10-31', required: false, ...extra },
  ],
});
const record = (id, { status = 'Open', links = '', title = 'Fixture workflow', human = 'No' } = {}) =>
  `### ${id}\n\n**${title}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| ${{ Open: '🔴', Closed: '🔵', Implemented: '🟡' }[status]} | 🔶 P2 | ${status} | 🟡 Medium |\n\n${human === 'No' ? '💻' : '🧑'} **→ Human action required: ${human}**<br />A fixture next step.\n\n| | |\n|---|---|\n| **Issue** | A fixture. |\n| **Reproduce** | Read fixture. |\n| **Check** | Observe fixture. |\n\n<details>\n<summary>History</summary>\n\n**Next action / closure evidence:** A scoped fixture action.\n\n**Estimates:** Fixture estimate, 2026-10-31.\n\n| Field | Value |\n|---|---|\n| PR / evidence | Fixture |\n| Opened | 2026-10-31 |\n| Verification | Pending |\n| Reviewed | 2026-10-31 |\n${links ? `| Components | ${links} |\n` : ''}\n</details>\n\n---\n`;
function solution(t, componentRecord = record('F-001')) {
  const parent = temp(t),
    home = join(parent, 'coordination'),
    component = join(parent, 'component');
  for (const [dir, name] of [
    [home, 'coordination'],
    [component, 'component'],
  ]) {
    mkdirSync(dir);
    git(dir, 'init', '-qb', 'main');
    git(dir, 'remote', 'add', 'origin', `https://github.com/fixture/${name}.git`);
  }
  install(home);
  const manifest = {
    schemaVersion: 1,
    name: 'Fixture solution',
    repository: 'fixture/coordination',
    ref: 'main',
    repositories: [
      {
        id: 'component',
        repository: 'fixture/component',
        path: '../component',
        ref: 'main',
        backlog: 'docs/BACKLOG.md',
      },
    ],
  };
  write(join(home, '.harness.json'), {
    stacks: ['core', 'solution'],
    solution: { role: 'coordinator', manifest: '.solution.json' },
  });
  write(join(home, '.solution.json'), manifest);
  write(
    join(home, 'docs/BACKLOG.md'),
    '# Backlog\n\n' + record('F-001', { links: 'component:F-001', complete: '~70%', human: 'Procedure' }),
  );
  write(join(component, 'docs/BACKLOG.md'), '# Backlog\n\n' + componentRecord);
  const sha = commit(component);
  commit(home);
  return { home, component, manifest, sha };
}
test('optional helpers leave an unconfigured single project unchanged', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, '.harness.json'), {});
  assert.equal(run(d, 'mcp.mjs', ['check']).code, 0);
  assert.equal(run(d, 'solution.mjs', ['check']).code, 0);
  assert.equal(run(d, 'mcp.mjs', ['recommend']).code, 0);
});
test('MCP recommendations detect stack signals, retain reasons and never imply a live connection', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, 'package.json'), {
    dependencies: { '@angular/core': '22.2.0' },
    devDependencies: { '@playwright/test': '1.64.1' },
  });
  const r = run(d, 'mcp.mjs', ['recommend', '--offline']);
  assert.equal(r.code, 0);
  assert.match(r.out, /angular: Angular workspace/);
  assert.match(r.out, /playwright:/);
  assert.match(r.out, /connection unverified/);
  assert.match(r.out, /cached guidance/);
});
test('OpenCRE recommendation stays revision-pinned, public-read by default and manually configured', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, '.harness.json'), { integrations: selection('opencre') });
  const check = run(d, 'mcp.mjs', ['check']);
  assert.equal(check.code, 0, check.err);
  const recommendation = run(d, 'mcp.mjs', ['recommend']);
  assert.equal(recommendation.code, 0, recommendation.err);
  assert.match(recommendation.out, /OWASP\/OpenCRE\/tree\/ace5f0bdc4031ed805fd550d13f6a5931a91606d/);
  assert.match(recommendation.out, /leave OPENCRE_MCP_AUTH_TOOLS unset/);
  assert.match(recommendation.out, /public REST GET endpoints directly/);
  const config = run(d, 'mcp.mjs', ['config', '--server=opencre', '--client=vscode']);
  assert.notEqual(config.code, 0);
  assert.match(config.err, /no portable launch command is assumed/);
});
test('MCP metadata rejects unknown IDs, missing reason/date, ranges and credential-bearing endpoints', (t) => {
  const d = temp(t);
  install(d);
  for (const config of [
    selection('unknown'),
    selection('angular', { reason: '' }),
    selection('angular', { lastChecked: 'yesterday' }),
    selection('angular', { version: 'latest' }),
    selection('github', { endpoint: 'https://user:password@example.com/mcp' }),
    selection('github', { endpoint: 'https://example.com/mcp?token=secret' }),
    selection('github', { endpoint: 'http://example.com/mcp' }),
    selection('angular', { command: 'untrusted' }),
  ]) {
    write(join(d, '.harness.json'), { integrations: config });
    assert.notEqual(run(d, 'mcp.mjs', ['check']).code, 0);
  }
  write(join(d, '.harness.json'), { integrations: selection('angular') });
  assert.equal(run(d, 'mcp.mjs', ['check']).code, 0);
});
test('MCP config emits client-specific snippets and exact versions without changing files', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, '.harness.json'), { integrations: selection('github') });
  const before = readFileSync(join(d, '.harness.json'), 'utf8');
  for (const client of ['claude-code', 'gemini', 'cline', 'vscode', 'codex']) {
    const r = run(d, 'mcp.mjs', ['config', '--server=github', `--client=${client}`]);
    assert.equal(r.code, 0, r.err);
    assert.match(r.err, /Not installed or connected/);
    if (client === 'codex') assert.match(r.out, /\[mcp_servers.github\]/);
    else {
      const entry = JSON.parse(r.out)[client === 'vscode' ? 'servers' : 'mcpServers'].github;
      assert(entry);
      if (client === 'gemini') assert.equal(entry.httpUrl, 'https://api.githubcopilot.com/mcp/');
      else assert.equal(entry.url, 'https://api.githubcopilot.com/mcp/');
    }
  }
  assert.equal(readFileSync(join(d, '.harness.json'), 'utf8'), before);
  assert.notEqual(run(d, 'mcp.mjs', ['config', '--server=github', '--client=codex', '--offline']).code, 0);
  write(join(d, '.harness.json'), { integrations: selection('playwright') });
  assert.notEqual(run(d, 'mcp.mjs', ['config', '--server=playwright', '--client=cline']).code, 0);
  write(join(d, '.harness.json'), { integrations: selection('playwright', { version: '1.2.3' }) });
  const r = run(d, 'mcp.mjs', ['config', '--server=playwright', '--client=cline']);
  assert.match(r.out, /@playwright\/mcp@1.2.3/);
  assert.notEqual(run(d, 'mcp.mjs', ['config', '--server=playwright', '--client=cline', '--offline']).code, 0);
});
test('Angular snippets require locked workspace installation and support local-only mode', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, '.harness.json'), { integrations: selection('angular') });
  assert.notEqual(run(d, 'mcp.mjs', ['config', '--server=angular', '--client=vscode']).code, 0);
  write(join(d, 'node_modules/@angular/cli/bin/ng.js'), '// not executed');
  write(join(d, 'node_modules/@angular/cli/package.json'), { version: '22.2.0' });
  const r = run(d, 'mcp.mjs', ['config', '--server=angular', '--client=vscode', '--offline']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /--read-only/);
  assert.match(r.out, /--local-only/);
});
test('explicit registry search uses current name-search metadata, never auto-selects it, and has offline fallback', (t) => {
  const d = temp(t);
  install(d);
  const mock = join(d, 'mock.mjs');
  write(
    mock,
    `globalThis.fetch=async url=>{if(!url.includes('version=latest&search=angular'))throw Error('wrong registry query');return new Response(JSON.stringify({servers:[{server:{name:'fixture/angular',version:'1.0.0',description:'fixture'}}],metadata:{nextCursor:'more'}}));};`,
  );
  const r = run(d, 'mcp.mjs', ['search', '--query=angular'], mock);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Live registry snapshot/);
  assert.match(r.out, /fixture\/angular/);
  assert.match(r.out, /not an exhaustive catalogue/);
  assert.notEqual(run(d, 'mcp.mjs', ['search', '--query=ab'], mock).code, 0);
  assert.notEqual(run(d, 'mcp.mjs', ['search', '--query=angular', '--offline'], mock).code, 0);
});
test('dashboard separates integration status from component status without averaging or modifying backlogs', (t) => {
  const { home, component, sha } = solution(t);
  const before = readFileSync(join(component, 'docs/BACKLOG.md'), 'utf8');
  const r = run(home, 'solution.mjs', ['dashboard', '--write']);
  assert.equal(r.code, 0, r.err);
  const out = readFileSync(join(home, 'docs/SOLUTION-DASHBOARD.md'), 'utf8');
  assert.match(out, /Snapshot:/);
  assert.match(out, new RegExp(sha.slice(0, 12)));
  assert.match(out, /solution:F-001/);
  assert.match(out, /component:F-001/);
  assert.doesNotMatch(out, /~\d+%|\| Complete \|/);
  assert.match(out, /🟡 Medium/);
  assert.match(out, /no combined completion percentage/);
  assert.equal(readFileSync(join(component, 'docs/BACKLOG.md'), 'utf8'), before);
});
test('F-059: the dashboard reads the human cue from a generated summary table', (t) => {
  const generated = record('F-001', { human: 'Decision' })
    .replace(
      '| Signal | Priority | Status | Effort |\n|---|---|---|---|',
      '| Signal | Priority | Status | Effort | Remaining | Procedures | Decisions |\n|---|---|---|---|---|:---:|:---:|',
    )
    .replace('| 🟡 Medium |\n', '| 🟡 Medium | 2 h | — | 🧑 |\n')
    .replace('🧑 **→ Human action required: Decision**<br />', '🧑 **→** ');
  const { home } = solution(t, generated);
  const r = run(home, 'solution.mjs', ['dashboard', '--write']);
  assert.equal(r.code, 0, r.err);
  const out = readFileSync(join(home, 'docs/SOLUTION-DASHBOARD.md'), 'utf8');
  assert.match(out, /component:F-001[^\n]*\| Decision \|/);
});
test('F-063: the dashboard reads a generated summary whose Status carries the colour', (t) => {
  const generated = record('F-001', { human: 'Both', status: 'Implemented' })
    .replace(
      '| Signal | Priority | Status | Effort |\n|---|---|---|---|',
      '| Status | Priority | Effort | Remaining | Procedures | Decisions |\n|---|---|---|---|:---:|:---:|',
    )
    .replace(
      /\| (🟡) \| ([^|]+) \| (Implemented) \| 🟡 Medium \|\n/,
      '| $1 $3 | $2 | 🟣 Very large | 9 h | 🧑 | 🧑 |\n',
    )
    .replace('🧑 **→ Human action required: Both**<br />', '🧑 **→** ');
  assert.match(generated, /🟡 Implemented/);
  const { home } = solution(t, generated);
  const r = run(home, 'solution.mjs', ['dashboard', '--write']);
  assert.equal(r.code, 0, r.err);
  const out = readFileSync(join(home, 'docs/SOLUTION-DASHBOARD.md'), 'utf8');
  assert.match(out, /component:F-001[^\n]*Implemented[^\n]*\| Both \| 🟣 Very large \|/);
});
test('8.0.0: the dashboard still reads a component on a 7.x generated ledger and an authored Yes', (t) => {
  const legacy = record('F-001', { human: 'Yes' })
    .replace(
      '| Signal | Priority | Status | Effort |\n|---|---|---|---|',
      '| Status | Priority | Effort | Remaining | Human action |\n|---|---|---|---|:---:|',
    )
    .replace(/\| (🔴) \| ([^|]+) \| (Open) \| 🟡 Medium \|\n/, '| $1 $3 | $2 | 🟡 Medium | 2 h | 🧑 Yes |\n')
    .replace('🧑 **→ Human action required: Yes**<br />', '🧑 **→** ');
  const { home } = solution(t, legacy);
  const r = run(home, 'solution.mjs', ['dashboard', '--write']);
  assert.equal(r.code, 0, r.err);
  assert.match(readFileSync(join(home, 'docs/SOLUTION-DASHBOARD.md'), 'utf8'), /component:F-001[^\n]*\| Yes \|/);
  const { home: authored } = solution(t, record('F-001', { human: 'Yes' }));
  const a = run(authored, 'solution.mjs', ['dashboard', '--write']);
  assert.equal(a.code, 0, a.err);
  assert.match(readFileSync(join(authored, 'docs/SOLUTION-DASHBOARD.md'), 'utf8'), /component:F-001[^\n]*\| Yes \|/);
});
test('missing, wrong-origin and mismatched-ref sources remain Unknown and fail visibly', (t) => {
  const { home, component, manifest } = solution(t);
  manifest.repositories[0].path = '../missing';
  write(join(home, '.solution.json'), manifest);
  let r = run(home, 'solution.mjs', ['dashboard', '--write']);
  assert.notEqual(r.code, 0);
  assert.match(readFileSync(join(home, 'docs/SOLUTION-DASHBOARD.md'), 'utf8'), /Unavailable — status unknown/);
  const componentTable = readFileSync(join(home, 'docs/SOLUTION-DASHBOARD.md'), 'utf8')
    .split('## Component work')[1]
    .split('## Source and link problems')[0];
  for (const line of componentTable.split('\n').filter((l) => l.startsWith('|')))
    assert.equal(
      line.split(/(?<!\\)\|/).slice(1, -1).length,
      6,
      'unavailable component rows keep the six-column schema',
    );
  manifest.repositories[0].path = '../component';
  write(join(home, '.solution.json'), manifest);
  git(component, 'remote', 'set-url', 'origin', 'https://github.com/fixture/wrong.git');
  assert.notEqual(run(home, 'solution.mjs', ['check']).code, 0);
  git(component, 'remote', 'set-url', 'origin', 'https://github.com/fixture/component.git');
  manifest.repositories[0].ref = 'missing-ref';
  write(join(home, '.solution.json'), manifest);
  r = run(home, 'solution.mjs', ['check']);
  assert.notEqual(r.code, 0);
  assert.match(r.err, /HEAD differs/);
});
test('qualified references reject unknown repositories, duplicate IDs and missing records', (t) => {
  const { home } = solution(t);
  for (const refs of ['unknown:F-001', 'component:F-999', 'component:F-001, component:F-001']) {
    write(join(home, 'docs/BACKLOG.md'), record('F-001', { links: refs }));
    assert.notEqual(run(home, 'solution.mjs', ['check']).code, 0);
  }
});
test('archives resolve closed links while a reopened active record takes precedence', (t) => {
  const { home, component, manifest } = solution(t);
  manifest.repositories[0].archives = ['docs/archive/closed.md'];
  write(join(home, '.solution.json'), manifest);
  write(join(component, 'docs/archive/closed.md'), record('F-001', { status: 'Closed', complete: '~100%' }));
  write(join(component, 'docs/BACKLOG.md'), '# Empty\n');
  commit(component);
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /component:F-001.*closed.md/);
  assert.match(r.out, /Closed/);
  write(join(component, 'docs/BACKLOG.md'), record('F-001', { title: 'Reopened workflow' }));
  commit(component);
  r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Reopened workflow/);
  assert.doesNotMatch(r.out, /\| Closed \|/);
});
test('dashboard preserves older ID/Item summaries and rejects unsupported table-only ledgers', (t) => {
  const legacy =
    '### F-001\n\n| Signal | ID | Priority | Status | Item |\n|---|---|---|---|---|\n| 🔴 | F-001 | 🔶 P2 | Open | Older workflow |\n\n---\n';
  const { home, component } = solution(t, legacy);
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Older workflow/);
  assert.match(r.out, /Unknown/);
  write(join(component, 'docs/BACKLOG.md'), '| Signal | ID | Item |\n|---|---|---|\n| 🔴 | F-001 | Unsupported |\n');
  commit(component);
  r = run(home, 'solution.mjs', ['check']);
  assert.notEqual(r.code, 0);
  assert.match(r.err, /unsupported record headings|no supported record headings/);
});
test('dashboard refuses traversal, symlink escape, source overwrite and replacing hand-written files', (t) => {
  const { home, manifest } = solution(t);
  for (const target of ['../escape.md', 'docs/BACKLOG.md', '.solution.json']) {
    manifest.dashboard = target;
    write(join(home, '.solution.json'), manifest);
    assert.notEqual(run(home, 'solution.mjs', ['dashboard', '--write']).code, 0);
  }
  manifest.dashboard = 'docs/manual.md';
  write(join(home, '.solution.json'), manifest);
  write(join(home, 'docs/manual.md'), 'Human notes');
  assert.notEqual(run(home, 'solution.mjs', ['dashboard', '--write']).code, 0);
  assert.equal(readFileSync(join(home, 'docs/manual.md'), 'utf8'), 'Human notes');
  const outside = temp(t);
  symlinkSync(outside, join(home, 'escape'));
  manifest.dashboard = 'escape/report.md';
  write(join(home, '.solution.json'), manifest);
  assert.notEqual(run(home, 'solution.mjs', ['dashboard', '--write']).code, 0);
});
test('remote component snapshots resolve the ref once then read exact SHA; authorization failures stay unknown', (t) => {
  const { home, sha } = solution(t);
  const mock = join(home, 'mock.mjs');
  const content = Buffer.from('# Backlog\n' + record('F-001')).toString('base64');
  write(
    mock,
    `globalThis.fetch=async url=>{if(url.includes('/contents/.harness.json'))return new Response('{}',{status:404});if(url.endsWith('/commits/main'))return new Response(JSON.stringify({sha:'${sha}'}));if(url.includes('/contents/docs/BACKLOG.md?ref=${sha}'))return new Response(JSON.stringify({encoding:'base64',content:'${content}'}));throw Error('unpinned or unexpected request');};`,
  );
  let r = run(home, 'solution.mjs', ['dashboard', '--remote'], mock);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /<br>GitHub/);
  write(mock, "globalThis.fetch=async()=>new Response('{}',{status:403});");
  r = run(home, 'solution.mjs', ['dashboard', '--remote'], mock);
  assert.notEqual(r.code, 0);
  assert.match(r.out, /Unknown/);
  assert.match(r.err, /HTTP 403/);
});

test('solution MCP selections inherit with explicit project overrides and missing context stays usable', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, '.solution.json'), { integrations: selection('github') });
  write(join(d, '.harness.json'), {
    solution: { role: 'component', manifest: '.solution.json' },
    integrations: selection('github', { disabled: true }),
  });
  let r = run(d, 'mcp.mjs', ['recommend']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /selected by project \(disabled\)/);
  assert.notEqual(run(d, 'mcp.mjs', ['config', '--server=github', '--client=codex']).code, 0);
  write(join(d, '.harness.json'), { solution: { role: 'component', manifest: '.solution.json' } });
  r = run(d, 'mcp.mjs', ['recommend']);
  assert.match(r.out, /selected by solution/);
  write(join(d, '.harness.json'), {
    solution: { role: 'component', manifest: 'missing.json' },
    integrations: selection('angular'),
  });
  r = run(d, 'mcp.mjs', ['check']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.err, /Inherited recommendations are unknown/);
});
test('dirty snapshots use working-copy links and a component cannot write the solution dashboard', (t) => {
  const { home, component } = solution(t);
  write(join(component, 'docs/BACKLOG.md'), record('F-001', { title: 'Uncommitted change' }));
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Local changes/);
  assert.match(r.out, /component:F-001\]\(.*component\/docs\/BACKLOG.md/);
  write(join(home, '.harness.json'), { solution: { role: 'component', id: 'component', manifest: '.solution.json' } });
  r = run(home, 'solution.mjs', ['dashboard', '--write']);
  assert.notEqual(r.code, 0);
  assert.match(r.err, /Only the coordinator/);
});

test('coordinator feature branches work, spoofed GitHub origins do not', (t) => {
  const { home, component } = solution(t);
  git(home, 'switch', '-qc', 'feature/coordination');
  write(join(home, 'docs/CONTRACT.md'), 'New contract');
  commit(home);
  assert.equal(run(home, 'solution.mjs', ['check']).code, 0);
  git(component, 'remote', 'set-url', 'origin', 'https://evilgithub.com/fixture/component.git');
  const r = run(home, 'solution.mjs', ['check']);
  assert.notEqual(r.code, 0);
  assert.match(r.err, /origin does not match/);
});

test('component metadata checks and own snippets survive malformed optional solution context', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, '.solution.json'), '{broken');
  write(join(d, '.harness.json'), {
    solution: { role: 'component', manifest: '.solution.json' },
    integrations: selection('github'),
  });
  const check = run(d, 'mcp.mjs', ['check']);
  assert.equal(check.code, 0, check.err);
  const config = run(d, 'mcp.mjs', ['config', '--server=github', '--client=codex']);
  assert.equal(config.code, 0, config.err);
  assert.match(config.err, /context unavailable/i);
});
test('misspelled safety and source flags fail rather than being ignored', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, '.harness.json'), { integrations: selection('github') });
  assert.notEqual(run(d, 'mcp.mjs', ['config', '--server=github', '--client=codex', '--offine']).code, 0);
  const { home } = solution(t);
  assert.notEqual(run(home, 'solution.mjs', ['check', '--remtoe']).code, 0);
});
test('a nested component archive cannot be overwritten even if it carries a generated marker', (t) => {
  const { home, component, manifest } = solution(t);
  const nested = join(home, 'components/component');
  mkdirSync(dirname(nested), { recursive: true });
  renameSync(component, nested);
  manifest.repositories[0].path = 'components/component';
  manifest.repositories[0].archives = ['docs/archive/closed.md'];
  manifest.dashboard = 'components/component/docs/archive/closed.md';
  const archive =
    '<!-- generated: project-harness solution dashboard; fixture -->\n' +
    record('F-002', { status: 'Closed', complete: '~100%' });
  write(join(nested, 'docs/archive/closed.md'), archive);
  write(join(home, '.solution.json'), manifest);
  const r = run(home, 'solution.mjs', ['dashboard', '--write']);
  assert.notEqual(r.code, 0);
  assert.equal(readFileSync(join(nested, 'docs/archive/closed.md'), 'utf8'), archive);
});
test('mixed headed and unheaded legacy tables are rejected rather than dropping records', (t) => {
  const { home, component } = solution(t);
  write(
    join(component, 'docs/BACKLOG.md'),
    '| Signal | ID | Item |\n|---|---|---|\n| 🔴 | F-002 | Hidden work |\n\n' + record('F-001'),
  );
  commit(component);
  const r = run(home, 'solution.mjs', ['check']);
  assert.notEqual(r.code, 0);
  assert.match(r.err, /unsupported|unheaded/i);
});
test('clean local snapshots read committed content at the reported SHA', (t) => {
  const { home, component } = solution(t);
  const file = join(component, 'docs/BACKLOG.md'),
    mock = join(home, 'fs-mock.mjs');
  write(
    mock,
    `import fs from 'node:fs'; import {syncBuiltinESMExports} from 'node:module'; const read=fs.readFileSync; fs.readFileSync=function(file,...args){if(String(file)===${JSON.stringify(file)})fs.writeFileSync(file,${JSON.stringify(record('F-001', { title: 'Uncommitted mid-read mutation' }))});return read.call(this,file,...args);};syncBuiltinESMExports();`,
  );
  const r = run(home, 'solution.mjs', ['dashboard'], mock);
  assert.equal(r.code, 0, r.err);
  assert.doesNotMatch(r.out, /Uncommitted mid-read mutation/);
});

test('a dashboard symlink into a nested component cannot overwrite its archive', (t) => {
  const { home, component, manifest } = solution(t);
  const nested = join(home, 'components/component');
  mkdirSync(dirname(nested), { recursive: true });
  renameSync(component, nested);
  manifest.repositories[0].path = 'components/component';
  const archive =
    '<!-- generated: project-harness solution dashboard; fixture -->\n' +
    record('F-002', { status: 'Closed', complete: '~100%' });
  write(join(nested, 'docs/archive/closed.md'), archive);
  symlinkSync(join(nested, 'docs/archive/closed.md'), join(home, 'docs/dashboard.md'));
  manifest.dashboard = 'docs/dashboard.md';
  write(join(home, '.solution.json'), manifest);
  assert.notEqual(run(home, 'solution.mjs', ['dashboard', '--write']).code, 0);
  assert.equal(readFileSync(join(nested, 'docs/archive/closed.md'), 'utf8'), archive);
});
test('coordinator checks own invalid recommendations while research and independent component checks remain usable', (t) => {
  const d = temp(t);
  install(d);
  const mock = join(d, 'mock.mjs');
  write(mock, `globalThis.fetch=async()=>new Response(JSON.stringify({servers:[]}));`);
  write(join(d, '.harness.json'), '{broken');
  assert.equal(run(d, 'mcp.mjs', ['search', '--query=angular'], mock).code, 0);
  write(join(d, '.solution.json'), { integrations: selection('unknown') });
  write(join(d, '.harness.json'), { solution: { role: 'coordinator', manifest: '.solution.json' } });
  assert.notEqual(run(d, 'mcp.mjs', ['check']).code, 0);
  write(join(d, '.harness.json'), {
    solution: { role: 'component', manifest: '.solution.json' },
    integrations: selection('github'),
  });
  assert.equal(run(d, 'mcp.mjs', ['check']).code, 0);
  assert.equal(run(d, 'mcp.mjs', ['config', '--server=github', '--client=codex']).code, 0);
  for (const args of [
    ['check', '--offline', '--offline'],
    ['recommend', '--query=angular'],
    ['config', '--server=github', '--client=codex', '--offline=false'],
  ])
    assert.notEqual(run(d, 'mcp.mjs', args).code, 0);
});

test('offline snippets reject network endpoint overrides even for a local-runtime catalogue entry', (t) => {
  const d = temp(t);
  install(d);
  write(join(d, '.harness.json'), { integrations: selection('fusion', { endpoint: 'https://cad.example.com/mcp' }) });
  assert.notEqual(run(d, 'mcp.mjs', ['config', '--server=fusion', '--client=codex', '--offline']).code, 0);
  write(join(d, '.harness.json'), { integrations: selection('fusion', { endpoint: 'http://127.0.0.1:8123/mcp' }) });
  assert.equal(run(d, 'mcp.mjs', ['config', '--server=fusion', '--client=codex', '--offline']).code, 0);
});

test('component file paths are checked in their owning checkout, not unrelated coordinator symlinks', (t) => {
  const { home, component, manifest } = solution(t);
  const outside = temp(t);
  symlinkSync(outside, join(home, 'docs/component-archive'));
  manifest.repositories[0].archives = ['docs/component-archive/closed.md'];
  write(join(home, '.solution.json'), manifest);
  write(join(component, 'docs/component-archive/closed.md'), record('F-002', { status: 'Closed', complete: '~100%' }));
  commit(component);
  const r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 0, r.err);
});

test('solution reader accepts historical signal completion columns without displaying them', (t) => {
  const historical = record('F-001')
    .replace('| Status | Effort |', '| Status | Effort | Complete |')
    .replace('| 🟡 Medium |', '| 🟡 Medium | ~70% |');
  const { home, component } = solution(t, historical);
  const before = readFileSync(join(component, 'docs/BACKLOG.md'), 'utf8');
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.doesNotMatch(r.out, /~70%|\| Complete \|/);
  assert.match(r.out, /🟡 Medium/);
  assert.equal(readFileSync(join(component, 'docs/BACKLOG.md'), 'utf8'), before);
});

// F-095-T02: one owner-set order across the solution, validated offline.
const orderFile = (items) => `# Solution order\n\n<!-- order:start -->\n${items.join('\n')}\n<!-- order:end -->\n`;
test('F-095-T02: check validates the solution order offline: syntax, manifest IDs, duplicates and numbering', (t) => {
  const { home, manifest } = solution(t);
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(
    join(home, 'docs/SOLUTION-ORDER.md'),
    orderFile(['1. component:F-001 — the first outcome', '2. solution:F-001', '3. component:F-002-T01']),
  );
  commit(home);
  let r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 0, r.err);
  // Offline: an unavailable component does not stop the order check, and the order is checked without it.
  rmSync(join(dirname(home), 'component'), { recursive: true, force: true });
  r = run(home, 'solution.mjs', ['check']);
  assert.doesNotMatch(r.err, /order/i, r.err);
  for (const [items, problem] of [
    [['1. other:F-001'], /order: 1\. other:F-001: unknown repository other/],
    [['1. component:F-1'], /order: 1\. component:F-1: write <repo>:<B-\/F-ID> or <repo>:<STEP-ID>/],
    [['1. component:F-001', '2. component:F-001'], /order: 2\. component:F-001: listed twice/],
    [['1. component:F-001', '3. solution:F-001'], /order: 3\. solution:F-001: number it 2/],
    [['- component:F-001'], /order: - component:F-001: write a numbered item/],
  ]) {
    write(join(home, 'docs/SOLUTION-ORDER.md'), orderFile(items));
    r = run(home, 'solution.mjs', ['check']);
    assert.equal(r.code, 1);
    assert.match(r.err, problem, r.err);
  }
  // CRLF line ends and items on the marker line read as the same list (review of F-095-T02).
  write(
    join(home, 'docs/SOLUTION-ORDER.md'),
    orderFile(['1. component:F-001', '2. solution:F-001']).replace(/\n/g, '\r\n'),
  );
  assert.equal(run(home, 'solution.mjs', ['check']).err.match(/order/), null);
  write(join(home, 'docs/SOLUTION-ORDER.md'), '<!-- order:start -->1. component:F-001<!-- order:end -->\n');
  assert.equal(run(home, 'solution.mjs', ['check']).err.match(/order/), null);
  write(join(home, 'docs/SOLUTION-ORDER.md'), orderFile(['1. component:F-001']) + orderFile(['1. bad']));
  assert.match(run(home, 'solution.mjs', ['check']).err, /order: docs\/SOLUTION-ORDER\.md has 2 order lists; keep one/);
  // A missing order file is reported with the other problems, not instead of them.
  rmSync(join(home, 'docs/SOLUTION-ORDER.md'));
  r = run(home, 'solution.mjs', ['check']);
  assert.match(r.err, /order: docs\/SOLUTION-ORDER\.md is missing or not a file/);
  assert.match(r.err, /component: checkout unavailable/);
  write(join(home, 'docs/SOLUTION-ORDER.md'), '# No markers\n');
  r = run(home, 'solution.mjs', ['check']);
  assert.match(r.err, /order: docs\/SOLUTION-ORDER\.md has no <!-- order:start --> … <!-- order:end --> list/);
  write(join(home, '.solution.json'), { ...manifest, order: '../outside.md' });
  r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 1);
  assert.match(r.err, /traversal/);
});

// F-095-T03: the reader keeps what the owner view needs and reports a layout it cannot read.
const generatedRecord = (id, { summary, steps = '' } = {}) =>
  `### <a id="${id.toLowerCase()}"></a>[✨ ${id}](#top)\n\n**Generated ${id}**\n\n${
    summary ??
    '| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |\n|---|---|---|---|---|---|:---:|:---:|:---:|\n| 🔴 Open | 🔶 P2 | 🟡 Medium | 3.5 h | [F-002-T01](#f-002-t01) | — | ⏳ | — | 🤔 |'
  }\n\n💻 **→** Next: from tasks.\n\n| | |\n|---|---|\n| **Issue** | A fixture. |\n| **Reproduce** | Read fixture. |\n| **Check** | Observe fixture. |\n\n**Feature steps**\n\n${steps}\n\n---\n`;
const stepsTable =
  '| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |\n|---|---|---|---|---|---|---|---|:---:|\n' +
  '| 🟢 Small | <a id="f-001-t01"></a>F-001-T01 — First step | 1 h | 0 h | 1 h | Planned | [api:F-009-T02](https://github.com/o/api/blob/HEAD/docs/BACKLOG.md#f-009-t02) | [F-001-T02](#f-001-t02) | ⏳ 🤖 |\n' +
  '| 🟡 Medium | <a id="f-001-t02"></a>F-001-T02 — Second step | 2.5 h | 0 h | 2.5 h | Planned | [F-001-T01](#f-001-t01), `web:F-003-T01` | — | ⏳ 🧑‍🔧 |\n' +
  '| 🟡 Medium | **Total** | 3.5 h | 0 h | 3.5 h | 0 of 2 completed | | | |';
test('F-095-T03: the reader keeps priority, remaining, prerequisites, owner cells and the steps table', (t) => {
  const { home } = solution(t, generatedRecord('F-001', { steps: stepsTable }));
  const r = run(home, 'solution.mjs', ['check', '--json']);
  assert.equal(r.code, 0, r.err);
  const component = JSON.parse(r.out).repositories.find((x) => x.id === 'component');
  const [rec] = component.records;
  assert.equal(rec.id, 'F-001');
  assert.equal(rec.status, 'Open');
  assert.equal(rec.priority, '🔶 P2');
  assert.equal(rec.remaining, '3.5 h');
  assert.deepEqual(rec.dependsOn, ['F-002-T01']);
  assert.equal(rec.agent, '⏳');
  assert.equal(rec.human, 'Decision');
  assert.deepEqual(
    rec.steps.map((s) => [s.id, s.status, s.remaining, s.who, s.dependsOn]),
    [
      ['F-001-T01', 'Planned', '1 h', '⏳ 🤖', ['api:F-009-T02']],
      ['F-001-T02', 'Planned', '2.5 h', '⏳ 🧑‍🔧', ['F-001-T01', 'web:F-003-T01']],
    ],
  );
  // The authored four-column layout reads too, with what it has.
  const authored = solution(t, record('F-002')).home;
  const a = JSON.parse(run(authored, 'solution.mjs', ['check', '--json']).out).repositories[1].records[0];
  assert.deepEqual([a.priority, a.remaining, a.steps], ['🔶 P2', '—', []]);
});
test('F-095-T03: an unknown heading, summary column or status is a reported problem, never an empty backlog', (t) => {
  for (const [backlog, problem] of [
    [
      '### F-001: Colon heading\n\n**Title**\n\n---\n',
      /component: unsupported record heading "### F-001: Colon heading"/,
    ],
    [
      generatedRecord('F-001', {
        summary:
          '| Status | Priority | Size | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |\n|---|---|---|---|---|---|:---:|:---:|:---:|\n| 🔴 Open | 🔶 P2 | 🟡 Medium | 3.5 h | — | — | 🤖 | — | — |',
      }),
      /component:F-001: unknown summary column "Size"/,
    ],
    [
      record('F-001', { status: 'Open' }).replace('| Open |', '| Parked |'),
      /component:F-001: (unknown status|unsupported summary)/,
    ],
  ]) {
    const { home } = solution(t, '# Backlog\n\n' + backlog);
    const r = run(home, 'solution.mjs', ['dashboard']);
    assert.equal(r.code, 1, r.out);
    assert.match(r.err, problem, r.err);
    assert.match(r.out, /\| component \| Source unavailable \| Unknown/);
  }
});
test('F-095-T03: a backlog over 1 MB is read through the blob API at the resolved commit', (t) => {
  const { home, sha } = solution(t);
  const mock = join(home, 'mock.mjs');
  const content = Buffer.from('# Backlog\n' + record('F-001', { title: 'Large backlog' })).toString('base64');
  write(
    mock,
    `globalThis.fetch=async url=>{if(url.includes('/contents/.harness.json'))return new Response('{}',{status:404});if(url.endsWith('/commits/main'))return new Response(JSON.stringify({sha:'${sha}'}));if(url.includes('/contents/docs/BACKLOG.md?ref=${sha}'))return new Response(JSON.stringify({encoding:'none',content:'',sha:'b'.repeat(40),size:2000000}));if(url.endsWith('/git/blobs/'+'b'.repeat(40)))return new Response(JSON.stringify({encoding:'base64',content:'${content}'}));throw Error('unexpected '+url);};`,
  );
  const r = run(home, 'solution.mjs', ['dashboard', '--remote'], mock);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Large backlog/);
});
test('F-095-T03 review: headings in code or archives, reference boundaries and step statuses', (t) => {
  // A heading in a fenced block, or one that names no B-/F- ID, is not a record heading problem.
  const fenced = '```\n### F-002 example\n```\n\n### UTF-8 and SHA-256 handling\n\n' + record('F-001');
  let { home } = solution(t, fenced);
  let r = run(home, 'solution.mjs', ['check', '--json']);
  assert.equal(r.code, 0, r.err);
  // References stop at ID boundaries; a URL is not a reference; an uppercase repository prefix is reported.
  const bounded = (cell) =>
    generatedRecord('F-001', {
      summary: `| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |\n|---|---|---|---|---|---|:---:|:---:|:---:|\n| 🔴 Open | 🔶 P2 | 🟡 Medium | 3.5 h | ${cell} | — | ⏳ | — | — |`,
    });
  ({ home } = solution(
    t,
    bounded('BF-0012, `api:F-009-T021`, https://x.example/issues/F-123, [F-002-T01](#f-002-t01)'),
  ));
  r = run(home, 'solution.mjs', ['check', '--json']);
  assert.equal(r.code, 0, r.err);
  assert.deepEqual(JSON.parse(r.out).repositories[1].records[0].dependsOn, ['F-002-T01']);
  ({ home } = solution(t, bounded('`API:F-009`')));
  r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 1);
  assert.match(r.err, /component:F-001: write the repository of "API:F-009" in lowercase/);
  // A step status the generated ledger never writes is reported.
  ({ home } = solution(
    t,
    generatedRecord('F-001', { steps: stepsTable.replace('| 1 h | Planned |', '| 1 h | Frobbed |') }),
  ));
  r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 1);
  assert.match(r.err, /component:F-001: F-001-T01 has unknown step status "Frobbed"/);
});

// F-096-T05: a component with built views commits no ledger; the coordinator reads its published view at the resolved
// commit, or rebuilds it from the component's sources with its own copied tool, and says which.
function builtComponent(t) {
  const fixture = solution(t);
  const { component } = fixture;
  write(join(component, '.harness.json'), {
    workItems: {
      enabled: true,
      views: 'built',
      layout: 'docs/work/layout.json',
      records: 'docs/work/records',
      tasks: 'docs/work/tasks',
      profiles: 'docs/agents/model-profiles.json',
    },
  });
  write(join(component, 'docs/work/layout.json'), {
    version: 1,
    segments: [{ text: '# Backlog\n\n' }, { records: 'all' }],
  });
  write(join(component, 'docs/work/records/F-001.md'), record('F-001', { title: 'Rebuilt title' }));
  write(join(component, '.gitignore'), 'docs/BACKLOG.md\n');
  git(component, 'rm', '-q', '--cached', 'docs/BACKLOG.md');
  rmSync(join(component, 'docs/BACKLOG.md'));
  const sha = commit(component);
  return { ...fixture, sha };
}
test('F-096-T05: the coordinator reads a published view at the resolved commit and names it', (t) => {
  const { home, component, sha } = builtComponent(t);
  // A publication of this commit on backlog-views, as work-items publish writes it.
  git(component, 'checkout', '-q', '-b', 'views');
  write(join(component, 'docs/BACKLOG.md'), '# Backlog\n\n' + record('F-001', { title: 'Published title' }));
  git(component, 'add', '-f', 'docs/BACKLOG.md');
  git(
    component,
    'commit',
    '-qm',
    `Backlog views for ${sha}\n\nBuilt by work-items publish from ${sha}; do not edit this branch.`,
  );
  const published = git(component, 'rev-parse', 'HEAD');
  git(component, 'update-ref', 'refs/remotes/origin/backlog-views', published);
  git(component, 'checkout', '-q', 'main');
  git(component, 'branch', '-q', '-D', 'views');
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Published title/);
  assert.match(r.out, new RegExp(`view published on backlog-views at ${published.slice(0, 12)}`));
});
test('F-096-T05: without a publication the coordinator rebuilds the view with its own tool, or reports it', (t) => {
  const { home, sha } = builtComponent(t);
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 1);
  assert.match(
    r.err,
    /component: built views: no publication of [0-9a-f]{40} on backlog-views and no tools\/work-items\.mjs/,
  );
  assert.match(r.out, /\| component \| Source unavailable \| Unknown/);
  cpSync(join(source, 'work-items.mjs'), join(home, 'tools/work-items.mjs'));
  r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Rebuilt title/);
  assert.match(r.out, new RegExp(`view rebuilt from sources at ${sha.slice(0, 12)}`));
});
test('F-096-T05: remotely, the published view of the resolved commit is read through GitHub', (t) => {
  const { home, sha } = builtComponent(t);
  const mock = join(home, 'mock.mjs');
  const view = Buffer.from('# Backlog\n' + record('F-001', { title: 'Remote published' })).toString('base64');
  const stamp = Buffer.from(JSON.stringify({ workItems: { enabled: true, views: 'built' } })).toString('base64');
  const pub = 'c'.repeat(40);
  write(
    mock,
    `globalThis.fetch=async url=>{const j=(x)=>new Response(JSON.stringify(x));
if(url.endsWith('/commits/main'))return j({sha:'${sha}'});
if(url.includes('/contents/.harness.json?ref=${sha}'))return j({encoding:'base64',content:'${stamp}'});
if(url.includes('/commits?sha=backlog-views'))return j([{sha:'${'d'.repeat(40)}',commit:{message:'Backlog views for ${'e'.repeat(40)}'}},{sha:'${pub}',commit:{message:'Backlog views for ${sha}\\n\\nBuilt'}}]);
if(url.includes('/contents/docs/BACKLOG.md?ref=${pub}'))return j({encoding:'base64',content:'${view}'});
if(url.endsWith('/git/commits/${sha}'))return j({tree:{sha:'${'1'.repeat(40)}'}});
if(url.endsWith('/git/commits/${pub}'))return j({tree:{sha:'${'2'.repeat(40)}'}});
if(url.endsWith('/git/trees/${'1'.repeat(40)}'))return j({truncated:false,tree:[{path:'README',type:'blob',sha:'${'3'.repeat(40)}'},{path:'docs',type:'tree',sha:'${'4'.repeat(40)}'}]});
if(url.endsWith('/git/trees/${'2'.repeat(40)}'))return j({truncated:false,tree:[{path:'README',type:'blob',sha:'${'3'.repeat(40)}'},{path:'docs',type:'tree',sha:'${'5'.repeat(40)}'}]});
if(url.endsWith('/git/trees/${'4'.repeat(40)}'))return j({truncated:false,tree:[{path:'work',type:'tree',sha:'${'6'.repeat(40)}'}]});
if(url.endsWith('/git/trees/${'5'.repeat(40)}'))return j({truncated:false,tree:[{path:'work',type:'tree',sha:globalThis.FORGED?'${'7'.repeat(40)}':'${'6'.repeat(40)}'},{path:'BACKLOG.md',type:'blob',sha:'${'8'.repeat(40)}'}]});
throw Error('unexpected '+url);};`,
  );
  let r = run(home, 'solution.mjs', ['dashboard', '--remote'], mock);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /Remote published/);
  assert.match(r.out, new RegExp(`view published on backlog-views at ${pub.slice(0, 12)}`));
  // A publication whose tree is not the source tree plus the ledger is not that commit's view (review of F-096-T05).
  write(mock, 'globalThis.FORGED=true;' + readFileSync(mock, 'utf8'));
  r = run(home, 'solution.mjs', ['dashboard', '--remote'], mock);
  assert.equal(r.code, 1);
  assert.match(r.err, /component: built views: no publication of [0-9a-f]{40} on backlog-views/);
  assert.doesNotMatch(r.out, /Remote published/);
});
test('F-096-T05 review: a forged local publication is not trusted; an invalid stamp is named', (t) => {
  const { home, component, sha } = builtComponent(t);
  git(component, 'checkout', '-q', '--orphan', 'views');
  git(component, 'rm', '-rq', '--cached', '.');
  write(join(component, 'docs/BACKLOG.md'), '# Backlog\n\n' + record('F-001', { title: 'Forged title' }));
  git(component, 'add', '-f', 'docs/BACKLOG.md');
  git(component, 'commit', '-qm', `Backlog views for ${sha}`);
  git(component, 'update-ref', 'refs/remotes/origin/backlog-views', git(component, 'rev-parse', 'HEAD'));
  git(component, 'checkout', '-q', '-f', 'main');
  cpSync(join(source, 'work-items.mjs'), join(home, 'tools/work-items.mjs'));
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.doesNotMatch(r.out, /Forged title/);
  assert.match(r.out, /Rebuilt title/);
  write(join(component, '.harness.json'), '{ not json');
  commit(component);
  r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 1);
  assert.match(r.err, /component: \.harness\.json at [0-9a-f]{40} is not valid JSON/);
});

// F-095-T04: remaining hours per backlog, from its totals line or its records, and a partial solution total.
const totals = (line) =>
  `<!-- totals:start -->\n**Remaining effort:** ${line} Generated from the task files.\n<!-- totals:end -->\n\n`;
const section = (out) => out.slice(out.indexOf('## Remaining effort'), out.indexOf('## Integration outcomes'));
test('F-095-T04: hours per backlog from its totals line or its records, summed, never a percentage', (t) => {
  const backlog =
    '# Backlog\n\n' +
    totals('3.5 h agent + 1 h owner across 2 open steps of 1 feature.') +
    generatedRecord('F-001') +
    generatedRecord('F-002', {
      summary:
        '| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |\n|---|---|---|---|---|---|:---:|:---:|:---:|\n| 🔴 Open | 🔺 P1 | 🟢 Small | 0.5 h | — | — | 🤖 | — | — |',
    });
  const { home } = solution(t, backlog);
  // The coordinator's own backlog has no totals line: its records' Remaining cells are summed (none here: Unknown).
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  let s = section(r.out);
  assert.match(s, /each project's own, uncalibrated estimate/);
  assert.match(s, /\| component \| 3\.5 h \| 1 h \| totals line \| 🔺 P1: 1, 🔶 P2: 1 \| 🟢 Small: 1, 🟡 Medium: 1 \|/);
  assert.match(s, /\| solution \| Unknown \| Unknown \| no totals line or Remaining cells \|/);
  assert.match(s, /\| \*\*Total\*\* \| at least 3\.5 h \| at least 1 h \|/);
  assert.doesNotMatch(r.out, /\d+(\.\d+)?\s?%/);
  // Without a totals line the component's records' Remaining cells are summed.
  write(
    join(dirname(home), 'component/docs/BACKLOG.md'),
    backlog.replace(/<!-- totals:start -->[\s\S]*?<!-- totals:end -->\n\n/, ''),
  );
  commit(join(dirname(home), 'component'));
  git(join(dirname(home), 'component'), 'update-ref', 'refs/heads/main', 'HEAD');
  r = run(home, 'solution.mjs', ['dashboard']);
  s = section(r.out);
  assert.match(s, /\| component \| 4 h \| 0 h \| Remaining cells of 2 open records \|/);
});
test('F-095-T04: an unreadable total is Unknown and the solution total says "at least"', (t) => {
  const { home } = solution(
    t,
    '# Backlog\n\n' + totals('2.5 days across 1 open step of 1 feature.') + generatedRecord('F-001'),
  );
  write(
    join(home, 'docs/BACKLOG.md'),
    '# Backlog\n\n' +
      totals('2 h across 1 open step of 1 feature.') +
      record('F-001', { links: 'component:F-001', human: 'Procedure' }),
  );
  commit(home);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const s = section(r.out);
  assert.match(s, /\| component \| Unknown \| Unknown \| totals line not in hours: "2\.5 days" \|/);
  assert.match(s, /\| solution \| 2 h \| 0 h \| totals line \|/);
  assert.match(s, /\| \*\*Total\*\* \| at least 2 h \| at least 0 h \|/);
});
test('F-095-T04 review: a totals line mixing hours and days keeps its hours and reads as partial', (t) => {
  const { home } = solution(
    t,
    '# Backlog\n\n' +
      totals('3 h agent + 1 h owner and 2 days across 3 open steps of 1 feature.') +
      generatedRecord('F-001'),
  );
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const s = section(r.out);
  assert.match(s, /\| component \| 3 h \| 1 h \| totals line, 2 days not counted in hours \|/);
  assert.match(s, /\| \*\*Total\*\* \| at least 3 h \| at least 1 h \|/);
});

// F-095-T05: the owner view.
const stepRow = (id, title, status, who, deps = '—') =>
  `| 🟢 Small | <a id="${id.toLowerCase()}"></a>${id} — ${title} | 1 h | 0 h | 1 h | ${status} | ${deps} | — | ${who} |`;
const steps = (...rows) =>
  '| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks | Who |\n|---|---|---|---|---|---|---|---|:---:|\n' +
  rows.join('\n');
const summary = (status, agent, procedures = '—', decisions = '—') =>
  `| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |\n|---|---|---|---|---|---|:---:|:---:|:---:|\n| ${status} | 🔶 P2 | 🟢 Small | 1 h | — | — | ${agent} | ${procedures} | ${decisions} |`;
function ownerFixture(t) {
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🔴 Open', '⏳', '—', '🤔'),
      steps: steps(
        stepRow('F-001-T02', 'Owner chooses', 'Planned', '[🤔](docs/d.md)'),
        stepRow('F-001-T01', 'Build after the choice', 'Planned', '⏳ 🤖', '[F-001-T02](#f-001-t02)'),
      ),
    }) +
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '🤖'),
      steps: steps(stepRow('F-002-T01', 'Ready work', 'Planned', '🤖')),
    }) +
    generatedRecord('F-003', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(stepRow('F-003-T01', 'Waits on ready work', 'Planned', '⏳ 🤖', '[F-002-T01](#f-002-t01)')),
    }) +
    generatedRecord('F-004', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(stepRow('F-004-T01', 'Waits on another project', 'Planned', '⏳ 🤖', '`solution:F-001-T09`')),
    });
  const fixture = solution(t, component);
  const { home, manifest } = fixture;
  write(join(home, '.solution.json'), {
    ...manifest,
    order: 'docs/SOLUTION-ORDER.md',
    repositories: manifest.repositories.map((r) => ({ ...r, emoji: '🛰️' })),
  });
  write(
    join(home, 'docs/SOLUTION-ORDER.md'),
    orderFile([
      '1. component:F-001-T01 — waits on the owner',
      '2. component:F-003 — waits on ready work',
      '3. component:F-002 — ready',
      '4. component:F-009 — gone',
    ]),
  );
  commit(home);
  return fixture;
}
const part = (out, heading) => {
  const i = out.indexOf(heading);
  return i < 0 ? '' : out.slice(i, out.indexOf('\n## ', i + 1) < 0 ? undefined : out.indexOf('\n## ', i + 1));
};
test('F-095-T05: the solution order shows live state and marks the first ready item, behind waiting ones', (t) => {
  const { home } = ownerFixture(t);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const order = part(r.out, '## Solution order');
  assert.match(
    order,
    /\| 1 \| 🛰️ \| \[component:F-001-T01\]\([^)]*\) \| Build after the choice \| Planned: Blocked: owner step component:F-001-T02 \|/,
  );
  assert.match(
    order,
    /\| 2 \| 🛰️ \| \[component:F-003\]\([^)]*\) \| Generated F-003 \| Open: Waiting on component:F-002-T01 \|/,
  );
  assert.match(order, /\| 3 \| 🛰️ \| \[component:F-002\]\([^)]*\) \| Generated F-002 \| Open: ▶ Ready \|/);
  assert.match(order, /\| 4 \| 🛰️ \| component:F-009 \| — \| Not in backlog \|/);
});
test('F-095-T05: waiting on the owner, blocked with a root cause, nothing to do, and a summary per project', (t) => {
  const { home } = ownerFixture(t);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(
    part(r.out, '## Waiting for the owner'),
    /\| \[component:F-001\]\([^)]*\) \| Generated F-001 \| Decision \|[^\n]*\| F-001-T02: Owner chooses \|/,
  );
  assert.match(
    part(r.out, '## Waiting for the owner'),
    /\| \[solution:F-001\]\([^)]*\) \| Fixture workflow \| Procedure \|/,
  );
  const blocked = part(r.out, '## Blocked');
  assert.match(
    blocked,
    /\| 🛰️ component \| \[component:F-001-T01\]\([^)]*\) \| Build after the choice \| \[component:F-001-T02\]\([^)]*\) \| owner decision \|/,
  );
  assert.match(
    blocked,
    /\| 🛰️ component \| \[component:F-004-T01\]\([^)]*\) \|[^\n]*\| solution:F-001-T09 \| unknown prerequisite, in another project \|/,
  );
  assert.match(part(r.out, '## Nothing to do'), /\| solution \| all waiting on the owner \|/);
  const summaryPart = part(r.out, '## Summary');
  assert.match(summaryPart, /\| 🛰️ component \| 4 \| 2 \| 0 \| 2 \|/);
  assert.match(r.out, /<details><summary>🛰️ component: 5 open steps<\/summary>/);
  assert.doesNotMatch(r.out, /\d\s?%/);
});
test('F-095-T05 review: record prerequisites, a Blocked record, every prerequisite counts, and a closed record in the order', (t) => {
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🔴 Open', '—', '—', '🤔'),
      steps: steps(
        stepRow('F-001-T02', 'Owner chooses', 'Planned', '🤔'),
        stepRow('F-001-T03', 'Agent work', 'Planned', '🤖'),
      ),
    }) +
    // A record without steps that waits on an owner step: never the next pick (▶).
    generatedRecord('F-002', {
      summary:
        '| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |\n|---|---|---|---|---|---|:---:|:---:|:---:|\n| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h | [F-001-T02](#f-001-t02) | — | ⏳ | — | — |',
    }) +
    // A Blocked record: its steps are not Ready.
    generatedRecord('F-003', {
      summary: summary('🟣 Blocked', '🤖'),
      steps: steps(stepRow('F-003-T01', 'Blocked work', 'Planned', '🤖')),
    }) +
    // Waits on ready work and on an owner step: the owner step decides, whatever the order of the prerequisites.
    generatedRecord('F-004', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(
        stepRow(
          'F-004-T01',
          'Two prerequisites',
          'Planned',
          '⏳ 🤖',
          '[F-001-T03](#f-001-t03), [F-001-T02](#f-001-t02)',
        ),
      ),
    }) +
    record('F-005', { status: 'Closed', title: 'Closed work' });
  const { home, manifest } = solution(t, component);
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(
    join(home, 'docs/SOLUTION-ORDER.md'),
    orderFile([
      '1. component:F-002',
      '2. component:F-003-T01',
      '3. component:F-004-T01',
      '4. component:F-005',
      '5. component:F-001-T03',
    ]),
  );
  commit(home);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const order = part(r.out, '## Solution order');
  assert.match(order, /\| 1 \| \| \[component:F-002\][^\n]*: Blocked: owner step component:F-001-T02 \|/);
  assert.match(order, /\| 2 \| \| \[component:F-003-T01\][^\n]*: Blocked: record marked Blocked: component:F-003 \|/);
  assert.match(order, /\| 3 \| \| \[component:F-004-T01\][^\n]*: Blocked: owner step component:F-001-T02 \|/);
  // B-058: a Done item says where it closed (deliberate change from the bare "Done")
  assert.match(
    order,
    /\| 4 \| \| \[component:F-005\]\([^)]*\) \| Closed work \| Closed: ✅ Done: closed in \[docs\/BACKLOG\.md\]\([^)]*docs\/BACKLOG\.md#f-005\) \|/,
  );
  assert.match(order, /\| 5 \| \| \[component:F-001-T03\][^\n]*: ▶ Ready \|/);
  assert.doesNotMatch(order, /\| [1-4] \|[^\n]*Ready/);
});
test('F-095-T05 review: a cycle of records without steps is Blocked, not a crash; a step awaiting verification is never next', (t) => {
  const waiting = (dep) =>
    `| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |\n|---|---|---|---|---|---|:---:|:---:|:---:|\n| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h | [${dep}](#${dep.toLowerCase()}) | — | ⏳ | — | — |`;
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', { summary: waiting('F-002') }) +
    generatedRecord('F-002', { summary: waiting('F-001') }) +
    generatedRecord('F-003', {
      summary: summary('🟡 Implemented', '🤖'),
      steps: steps(stepRow('F-003-T01', 'Done but unverified', 'Implemented; verification pending', '🤖')),
    }) +
    generatedRecord('F-004', {
      summary: summary('🔴 Open', '🤖'),
      steps: steps(stepRow('F-004-T01', 'Real work', 'Planned', '🤖')),
    });
  const { home, manifest } = solution(t, component);
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(
    join(home, 'docs/SOLUTION-ORDER.md'),
    orderFile(['1. component:F-001', '2. component:F-003-T01', '3. component:F-004-T01']),
  );
  commit(home);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const order = part(r.out, '## Solution order');
  assert.match(order, /\| 1 \| \| \[component:F-001\][^\n]*: Blocked: cycle through component:F-00[12] \|/);
  assert.match(order, /\| 2 \| \| \[component:F-003-T01\][^\n]*: Ready \(verification\) \|/);
  assert.match(order, /\| 3 \| \| \[component:F-004-T01\][^\n]*: ▶ Ready \|/);
});

// F-097-T01: agent runway across repositories.
function runwayFixture(t) {
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🔴 Open', '🤖'),
      steps: steps(stepRow('F-001-T01', 'A: agent work here', 'Planned', '🤖')),
    }) +
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(
        stepRow('F-002-T01', 'Cycle one', 'Planned', '⏳ 🤖', '[F-002-T02](#f-002-t02)'),
        stepRow('F-002-T02', 'Cycle two', 'Planned', '⏳ 🤖', '[F-002-T01](#f-002-t01)'),
      ),
    }) +
    generatedRecord('F-003', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(stepRow('F-003-T01', 'Waits on a missing step', 'Planned', '⏳ 🤖', '`solution:F-009-T01`')),
    });
  const fixture = solution(t, component);
  write(
    join(fixture.home, 'docs/BACKLOG.md'),
    '# Backlog\n\n' +
      generatedRecord('F-002', {
        summary: summary('🔴 Open', '⏳', '🧑‍🔧'),
        steps: steps(
          stepRow('F-002-T01', 'B: agent work after A', 'Planned', '⏳ 🤖', '`component:F-001-T01`'),
          stepRow('F-002-T02', 'C: the owner after B', 'Planned', '⏳ 🧑‍🔧', '[F-002-T01](#f-002-t01)').replace(
            '| 1 h | Planned',
            '| 2 h owner | Planned',
          ),
        ),
      }) +
      generatedRecord('F-003', {
        summary: summary('🔴 Open', '⏳'),
        steps: steps(stepRow('F-003-T01', 'D: agent work after C', 'Planned', '⏳ 🤖', '[F-002-T02](#f-002-t02)')),
      }),
  );
  commit(fixture.home);
  return fixture;
}
test('F-097-T01: runway counts A (agent) and B (agent, other repository) and reports the owner step C they reach', (t) => {
  const { home } = runwayFixture(t);
  const r = run(home, 'solution.mjs', ['dashboard']);
  const runway = part(r.out, '## Agent runway').split('<details>')[0];
  assert.match(runway, /\| solution \| 1 h \| owner step solution:F-002-T02 \| 2 h \|/);
  assert.match(runway, /\| \*\*Total\*\* \| 2 h \| 3 \| 2 h \|/);
  // D, behind the owner step, is not counted.
});
test('F-097-T01: a cycle is reported once and a missing prerequisite is a block, never assumed done', (t) => {
  const { home } = runwayFixture(t);
  const r = run(home, 'solution.mjs', ['dashboard']);
  const runway = part(r.out, '## Agent runway').split('<details>')[0];
  const row = /\| component \| ([^|]*) \| ([^|]*) \|/.exec(runway);
  assert.ok(row, runway);
  assert.equal(row[1].trim(), '1 h');
  assert.equal(
    row[2].trim(),
    'cycle component:F-002-T01 → component:F-002-T02 → component:F-002-T01<br>unknown prerequisite solution:F-009-T01',
  );
});
test('F-097-T01 review: a Blocked record, an unreadable estimate, a whole-record prerequisite, an unrecorded external wait and a block shared across projects', (t) => {
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🟣 Blocked', '🤖'),
      steps: steps(stepRow('F-001-T01', 'In a Blocked record', 'Planned', '🤖')),
    }) +
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '🤖'),
      steps: steps(
        stepRow('F-002-T01', 'Days, not hours', 'Planned', '🤖').replace('| 1 h | Planned', '| 2 days | Planned'),
      ),
    }) +
    generatedRecord('F-003', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(stepRow('F-003-T01', 'After the whole of F-004', 'Planned', '⏳ 🤖', '[F-004](#f-004)')),
    }) +
    generatedRecord('F-004', {
      summary: summary('🔴 Open', '🤖', '—', '🤔'),
      steps: steps(
        stepRow('F-004-T01', 'Agent part', 'Planned', '🤖'),
        stepRow('F-004-T02', 'Owner part', 'Planned', '🤔').replace('| 1 h | Planned', '| 1 h owner | Planned'),
      ),
    }) +
    generatedRecord('F-005', {
      summary: summary('🔴 Open', '⏳', '🧑‍🔧'),
      steps: steps(
        stepRow(
          'F-005-T01',
          'Owner after a done step not recorded',
          'Planned',
          '⏳ 🧑‍🔧',
          '`solution:F-007-T01`',
        ).replace('| 1 h | Planned', '| 3 h owner | Planned'),
      ),
    }) +
    generatedRecord('F-006', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(stepRow('F-006-T01', 'After the external wait', 'Planned', '⏳ 🤖', '[F-005-T01](#f-005-t01)')),
    });
  const { home } = solution(t, component);
  write(
    join(home, 'docs/BACKLOG.md'),
    '# Backlog\n\n' +
      generatedRecord('F-007', {
        summary: summary('🔴 Open', '🤖'),
        steps: steps(
          stepRow('F-007-T01', 'Done here', 'Completed', '🤖'),
          stepRow('F-007-T02', 'Ready here', 'Planned', '🤖'),
        ),
      }) +
      generatedRecord('F-008', {
        summary: summary('🔴 Open', '⏳'),
        steps: steps(stepRow('F-008-T01', 'After the component owner', 'Planned', '⏳ 🤖', '`component:F-004-T02`')),
      }),
  );
  commit(home);
  const r = run(home, 'solution.mjs', ['dashboard']);
  const runway = part(r.out, '## Agent runway').split('<details>')[0];
  const cols = (id) =>
    /\| ([^|]*) \| ([^|]*) \| ([^|]*) \|$/m.exec(runway.split('\n').find((l) => l.startsWith(`| ${id} `)) ?? '');
  const c = cols('component');
  assert.ok(c, runway);
  assert.equal(c[1], '1 h; not estimated: component:F-002-T01');
  assert.equal(
    c[2],
    'record marked Blocked: component:F-001<br>owner step component:F-004-T02<br>external wait not recorded: component:F-005-T01',
  );
  // F-005-T01 is not the owner's turn yet: its 3 h are not the next layer.
  assert.equal(c[3], '1 h');
  const s = cols('solution');
  assert.equal(s[1], '1 h');
  assert.equal(s[2], 'owner step component:F-004-T02');
  assert.match(runway, /\| \*\*Total\*\* \| at least 2 h \| 3 \| 1 h \|/);
});

// F-097-T02: audits, reviews and harness release per project.
const AREAS = ['code', 'logic', 'tests', 'documentation', 'harness', 'security', 'delivery', 'backlog'];
const auditManifest = (when, kind = 'full', areas = AREAS, result = 'checked') => ({
  schemaVersion: 1,
  kind,
  reviewed: when,
  baseline: 'a'.repeat(40),
  areas: Object.fromEntries(areas.map((a) => [a, { result, evidence: 'fixture', limits: 'fixture' }])),
});
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const runWith = (dir, extra, args) => {
  const r = spawnSync(process.execPath, [join(dir, 'tools', 'solution.mjs'), ...args], {
    cwd: dir,
    env: { ...env, ...extra },
    encoding: 'utf8',
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
};
function healthFixture(t) {
  const fixture = solution(t);
  const { home, component } = fixture;
  const template = temp(t);
  git(template, 'init', '-qb', 'main');
  write(join(template, 'VERSION'), '1.2.0\n');
  commit(template);
  for (const tag of ['v1.0.0', 'v1.2.0', 'v1.1.9']) git(template, 'tag', tag);
  const manifest = (when, kind = 'full') => auditManifest(when, kind);
  write(join(home, '.harness.json'), {
    version: '1.2.0',
    stacks: ['core', 'solution'],
    solution: { role: 'coordinator', manifest: '.solution.json' },
    audit: { days: 7 },
  });
  write(join(home, `docs/audits/${daysAgo(1).slice(0, 10)}-full.audit.json`), manifest(daysAgo(1)));
  commit(home);
  write(join(component, '.harness.json'), {
    version: '1.0.0',
    audit: { days: 7 },
    reviews: { token: { days: 30 }, architecture: { days: 30 } },
  });
  write(join(component, `docs/audits/${daysAgo(30).slice(0, 10)}-full.audit.json`), manifest(daysAgo(30)));
  write(join(component, `docs/reviews/token/${daysAgo(10).slice(0, 10)}.md`), '# Token review\n');
  commit(component);
  return { ...fixture, template };
}
test('F-097-T02: a current project, an overdue one and one behind the harness', (t) => {
  const { home, template } = healthFixture(t);
  const r = runWith(home, { HARNESS_HOME: template }, ['dashboard']);
  const s = part(r.out, '## Audits, reviews and harness').split('<details>')[0];
  const row = (id) => s.split('\n').find((l) => l.startsWith(`| ${id} `)) ?? '';
  assert.match(
    row('solution'),
    /\| v1\.2\.0 \(latest\) \| \d{4}‑\d{2}‑\d{2} \(full\)<br>next \d{4}‑\d{2}‑\d{2} \| — \|/,
  );
  assert.match(row('component'), /\| \*\*v1\.0\.0, behind v1\.2\.0\*\* \|/);
  assert.match(
    row('component'),
    /\(full\)<br>\*\*due: code, logic, tests, documentation, harness, security, delivery, backlog\*\*/,
  );
  assert.match(row('component'), /token: next \d{4}‑\d{2}‑\d{2}<br>\*\*architecture: none found\*\*/);
});
test('F-097-T02: missing evidence reads as unknown, never as current', (t) => {
  const { home, component } = solution(t);
  write(join(component, 'docs/audits/2026-01-01-full.audit.json'), '{ not json');
  commit(component);
  const r = runWith(home, { HARNESS_HOME: temp(t) }, ['dashboard']);
  const s = part(r.out, '## Audits, reviews and harness').split('<details>')[0];
  assert.match(s, /latest template release \(no template clone with release tags\)/);
  const row = (id) => s.split('\n').find((l) => l.startsWith(`| ${id} `)) ?? '';
  assert.match(row('solution'), /\| no version stamp \(unknown\) \| none found \(unknown\) \| — \| — \|/);
  // an unreadable manifest is reported, and its file name is no evidence
  assert.match(
    row('component'),
    /\| no version stamp \(unknown\) \| none found \(unknown\) \|[^\n]*is not a readable audit manifest \|/,
  );
});
test('F-097-T02: remotely, the evidence is read at the resolved commit and the latest release from GitHub', (t) => {
  const { home, sha } = solution(t);
  const stampOf = (x) => Buffer.from(JSON.stringify(x)).toString('base64');
  write(join(home, '.harness.json'), {
    version: '1.2.0',
    template: { repo: 'https://github.com/fixture/template' },
    stacks: ['core', 'solution'],
    solution: { role: 'coordinator', manifest: '.solution.json' },
  });
  commit(home);
  const mock = join(home, 'mock.mjs');
  const content = Buffer.from('# Backlog\n' + record('F-001')).toString('base64');
  const when = daysAgo(2);
  write(
    mock,
    `const j=(x)=>new Response(JSON.stringify(x));globalThis.fetch=async url=>{` +
      `if(url.endsWith('/repos/fixture/template/releases/latest'))return j({tag_name:'v1.3.0'});` +
      `if(url.endsWith('/commits/main'))return j({sha:'${sha}'});` +
      `if(url.endsWith('/git/trees/${sha}?recursive=1'))return j({tree:[{type:'blob',path:'docs/audits/x.audit.json'},{type:'blob',path:'docs/BACKLOG.md'}]});` +
      `if(!url.includes('ref=${sha}'))throw Error('unpinned '+url);` +
      `if(url.includes('/contents/.harness.json'))return j({encoding:'base64',content:'${stampOf({ version: '1.3.0', audit: { days: 7 } })}'});` +
      `if(url.includes('/contents/docs/BACKLOG.md'))return j({encoding:'base64',content:'${content}'});` +
      `if(url.includes('/contents/docs/audits/x.audit.json'))return j({encoding:'base64',content:'${stampOf(auditManifest(when))}'});` +
      `throw Error('unexpected '+url);};`,
  );
  const r = run(home, 'solution.mjs', ['dashboard', '--remote'], mock);
  assert.equal(r.code, 0, r.err);
  const s = part(r.out, '## Audits, reviews and harness').split('<details>')[0];
  assert.match(s, /latest template release \(latest release of fixture\/template\)/);
  assert.match(s, /\| solution \| \*\*v1\.2\.0, behind v1\.3\.0\*\* \|/);
  assert.match(
    s,
    new RegExp(
      `\\| component \\| v1\\.3\\.0 \\(latest\\) \\| ${when.slice(0, 10).replaceAll('-', NB)} \\(full\\)<br>next `,
    ),
  );
});
test('F-097-T02 review: a recent scoped audit does not refresh the rest; versions it cannot compare and future dates are unknown', (t) => {
  const { home, component, template } = healthFixture(t);
  write(
    join(component, `docs/audits/${daysAgo(1).slice(0, 10)}-scoped.audit.json`),
    auditManifest(daysAgo(1), 'scoped', ['code']),
  );
  write(join(component, 'docs/reviews/token/2099-01-01.md'), '# Future\n');
  write(join(component, '.harness.json'), {
    version: '1.3.0-rc.1',
    audit: { days: 7 },
    reviews: { token: { days: 30 } },
  });
  commit(component);
  const r = runWith(home, { HARNESS_HOME: template }, ['dashboard']);
  const s = part(r.out, '## Audits, reviews and harness').split('<details>')[0];
  const row = s.split('\n').find((l) => l.startsWith('| component ')) ?? '';
  assert.match(row, /\| v1\.3\.0-rc\.1 \(not vX\.Y\.Z: unknown\) \|/);
  assert.match(row, /\(full\)<br>\*\*due: logic, tests, documentation, harness, security, delivery, backlog\*\*/);
  // the future review is ignored: the one 10 days old decides
  assert.match(row, /token: next \d{4}‑\d{2}‑\d{2} \|/);
});
test('F-097-T02 review: a release endpoint that fails leaves the dashboard and reads as unknown', (t) => {
  const { home, sha } = solution(t);
  write(join(home, '.harness.json'), {
    version: '1.2.0',
    template: { repo: 'https://github.com/fixture/template' },
    stacks: ['core', 'solution'],
    solution: { role: 'coordinator', manifest: '.solution.json' },
  });
  commit(home);
  const mock = join(home, 'mock.mjs');
  const content = Buffer.from('# Backlog\n' + record('F-001')).toString('base64');
  write(
    mock,
    `const j=(x,status=200)=>new Response(JSON.stringify(x),{status});globalThis.fetch=async url=>{` +
      `if(url.includes('/releases/latest'))return j({},403);` +
      `if(url.endsWith('/commits/main'))return j({sha:'${sha}'});` +
      `if(url.includes('/contents/docs/BACKLOG.md'))return j({encoding:'base64',content:'${content}'});` +
      `return j({},404);};`,
  );
  const r = run(home, 'solution.mjs', ['dashboard', '--remote'], mock);
  assert.equal(r.code, 0, r.err);
  const s = part(r.out, '## Audits, reviews and harness');
  assert.match(s, /latest release of fixture\/template unreadable: GitHub returned HTTP 403/);
  assert.match(s, /\| solution \| v1\.2\.0 \(latest unknown\) \|/);
});

// F-097-T03: the gap review.
function gapFixture(t, apiBacklog) {
  const issue = (text, r) => r.replace('| **Issue** | A fixture. |', `| **Issue** | ${text} |`);
  const component =
    '# Backlog\n\n' +
    issue(
      'Needs `api` to add a token endpoint before login can ship.',
      generatedRecord('F-001', {
        summary: summary('🔴 Open', '🤖'),
        steps: steps(stepRow('F-001-T01', 'Login', 'Planned', '🤖')),
      }),
    ) +
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '—', '—', '🤔'),
      steps: steps(
        stepRow('F-002-T01', 'Owner chooses, no page', 'Planned', '🤔'),
        stepRow('F-002-T02', 'Owner chooses, with a page', 'Planned', '[🤔](docs/d.md)'),
      ),
    }) +
    generatedRecord('F-003', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(stepRow('F-003-T01', 'After a missing step', 'Planned', '⏳ 🤖', '`api:F-009-T01`')),
    }) +
    generatedRecord('F-004', {
      summary: summary('🔴 Open', '🤖'),
      steps: steps(stepRow('F-004-T01', 'All done', 'Completed', '🤖')),
    });
  const fixture = solution(t, component);
  const api = join(dirname(fixture.component), 'api');
  mkdirSync(api);
  git(api, 'init', '-qb', 'main');
  git(api, 'remote', 'add', 'origin', 'https://github.com/fixture/api.git');
  write(join(api, 'docs/BACKLOG.md'), apiBacklog);
  commit(api);
  write(join(fixture.home, '.solution.json'), {
    ...fixture.manifest,
    order: 'docs/SOLUTION-ORDER.md',
    repositories: [
      ...fixture.manifest.repositories,
      { id: 'api', repository: 'fixture/api', path: '../api', ref: 'main', backlog: 'docs/BACKLOG.md' },
    ],
  });
  write(join(fixture.home, 'docs/SOLUTION-ORDER.md'), orderFile(['1. component:F-001', '2. component:F-009']));
  commit(fixture.home);
  return { ...fixture, api };
}
const gapRows = (out) => part(out, '## Gap review').split('<details>')[0];
test('F-097-T03: proposals for a cross-repository need without a counterpart, an owner step without a page, a missing prerequisite, no next step and an order item not in its backlog', (t) => {
  const { home } = gapFixture(t, '# Backlog\n\n' + record('F-001', { title: 'Unrelated work' }));
  const r = run(home, 'solution.mjs', ['dashboard']);
  const g = gapRows(r.out);
  assert.match(
    g,
    /\| Cross-repository need with no counterpart \(text heuristic\) \| component:F-001 \| "Needs `api` to add a token endpoint before login can ship\."; api has no open record that names component \| api: a record for what component:F-001 needs from it, or component: drop the dependency \|/,
  );
  assert.match(
    g,
    /\| Owner's turn without a page \| component:F-002-T01 \|[^\n]*\| component: write the page for F-002-T01/,
  );
  assert.doesNotMatch(g, /F-002-T02/);
  assert.match(
    g,
    /\| Prerequisite missing or unknown \| component:F-003-T01 \| F-003-T01 depends on api:F-009-T01, which is not in api's backlog[^\n]*\| component: correct/,
  );
  assert.match(
    g,
    /\| No next step \| component:F-004 \|[^\n]*\| component: add the next step to F-004, or verify and close it \|/,
  );
  assert.match(
    g,
    /\| Order item not in its backlog \| solution order \| component:F-009 is not in component's backlog[^\n]*\| solution: remove component:F-009/,
  );
});
test('F-097-T03: a cross-repository need with a counterpart record gives no proposal', (t) => {
  const counterpart = record('F-001', { title: 'Token endpoint' }).replace(
    '| **Issue** | A fixture. |',
    '| **Issue** | The component login needs a token endpoint. |',
  );
  const { home } = gapFixture(t, '# Backlog\n\n' + counterpart);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.doesNotMatch(gapRows(r.out), /Cross-repository need/);
});
test('F-097-T03: a project behind the harness and a step that waits on done work get proposals in their own repository', (t) => {
  const { home, component, template } = healthFixture(t);
  write(
    join(component, 'docs/BACKLOG.md'),
    '# Backlog\n\n' +
      generatedRecord('F-001', {
        summary: summary('🔴 Open', '⏳'),
        steps: steps(
          stepRow('F-001-T01', 'Done', 'Completed', '🤖'),
          stepRow('F-001-T02', 'Still waits', 'Planned', '⏳ 🤖', '[F-001-T01](#f-001-t01)'),
        ),
      }),
  );
  commit(component);
  const r = runWith(home, { HARNESS_HOME: template }, ['dashboard']);
  const g = gapRows(r.out);
  assert.match(
    g,
    /\| Behind the harness \| component \.harness\.json \| component is on v1\.0\.0; the latest template release is v1\.2\.0 \| component: a record "Reconcile to harness v1\.2\.0"/,
  );
  assert.match(
    g,
    /\| Waits on work that is done \| component:F-001-T02 \|[^\n]*\| component: F-001-T02 waits on nothing: regenerate the views/,
  );
});
test('F-097-T03 review: ordinary words, the human-action label and a resolved reference are no cross-repository gap', (t) => {
  const api =
    '# Backlog\n\n' +
    record('F-001', { title: 'Smoke test' }).replace('A fixture next step.', 'Run the component smoke test.') +
    record('F-002', { title: 'Keys' }).replace(
      '| **Issue** | A fixture. |',
      '| **Issue** | The client needs a new API key setting. Requires `component:F-001`. |',
    );
  const { home } = gapFixture(t, api);
  const r = run(home, 'solution.mjs', ['dashboard']);
  const g = gapRows(r.out);
  assert.doesNotMatch(g, /\| api:F-00[12] \|/);
  // api:F-002 names component:F-001, so it is also the counterpart of the component's need
  assert.doesNotMatch(g, /Cross-repository need/);
});

// B-057: work-items writes the Who column only when a record has an owner step; a table without it is agent work.
test('B-057: a generated steps table without a Who column is agent work, ready or waiting by its prerequisites', (t) => {
  const noWho = (...rows) =>
    '| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |\n|---|---|---|---|---|---|---|---|\n' +
    rows.map((row) => row.replace(/ [^|]+ \|$/, '')).join('\n');
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🔴 Open', '🤖'),
      steps: noWho(
        stepRow('F-001-T01', 'First agent step', 'Planned', 'x', '—'),
        stepRow('F-001-T02', 'Second agent step', 'Planned', 'x', '[F-001-T01](#f-001-t01)'),
      ),
    }) +
    // The plainest generated table: no Depends on, Unlocks or Who column.
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '🤖'),
      steps:
        '| Effort | Step | Estimate | Actual | Remaining | Status |\n|---|---|---|---|---|---|\n' +
        '| 🟢 Small | <a id="f-002-t01"></a>F-002-T01 — Lone agent step | 1 h | 0 h | 1 h | Planned |',
    });
  const { home, manifest } = solution(t, component);
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(
    join(home, 'docs/SOLUTION-ORDER.md'),
    orderFile(['1. component:F-001-T02', '2. component:F-002-T01', '3. component:F-001-T01']),
  );
  commit(home);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const order = part(r.out, '## Solution order');
  assert.match(order, /\| 1 \| \| \[component:F-001-T02\][^\n]*: Waiting on component:F-001-T01 \|/);
  assert.match(order, /\| 2 \| \| \[component:F-002-T01\][^\n]*: ▶ Ready \|/);
  assert.match(order, /\| 3 \| \| \[component:F-001-T01\][^\n]*: Ready \|/);
  assert.doesNotMatch(r.out, /no actor in/);
  assert.match(part(r.out, '## Summary'), /\| component \| 2 \| 3 \| 0 \| 0 \|/);
});

// B-058: an order item whose record closed in its repository is Done there, linked; the refresh may drop it.
function closedOrderFixture(t) {
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🔴 Open', '🤖'),
      steps: steps(stepRow('F-001-T01', 'Open work', 'Planned', '🤖')),
    });
  const fixture = solution(t, component);
  const { home, component: dir, manifest } = fixture;
  // Closed by work:close: the record moved to the year's archive, which the manifest does not list.
  write(
    join(dir, 'docs/archive/backlog-2026.md'),
    '# Backlog archive 2026\n\n## Closed 2026-11-20\n\n' +
      record('F-007', { status: 'Closed', title: 'Archived work' }).replace(
        'A scoped fixture action.',
        'Closed 2026-11-20: merged. F-007-T01 and F-007-T02 closed.',
      ),
  );
  // A source-owned record marked Closed, and a closed step of a record no longer in the ledger.
  write(join(dir, '.harness.json'), {
    workItems: { enabled: true, records: 'docs/work/records', tasks: 'docs/work/tasks' },
  });
  write(join(dir, 'docs/work/records/F-008.md'), record('F-008', { status: 'Closed', title: 'Closed source' }));
  write(join(dir, 'docs/work/tasks/F-010-T02.json'), { version: 1, id: 'F-010-T02', status: 'closed' });
  const sha = commit(dir);
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(
    join(home, 'docs/SOLUTION-ORDER.md'),
    orderFile([
      '1. component:F-007 — archived',
      '2. component:F-008 — closed source',
      '3. component:F-010-T02 — closed step',
      '4. component:F-007-T05 — a step the archive never names',
      '5. component:F-009 — wrong ID',
      '6. component:F-001 — open',
    ]),
  );
  commit(home);
  return { ...fixture, sha };
}
test('B-058: an order item closed in its repository shows Done, linked to where it closed; an unknown ID still fails', (t) => {
  const { home, sha } = closedOrderFixture(t);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const order = part(r.out, '## Solution order');
  const blob = `https://github.com/fixture/component/blob/${sha}`;
  const done = (n, ref, where, date = '') =>
    new RegExp(
      `\\| ${n} \\| \\| ${ref} \\|[^\\n]*\\| Closed: ✅ Done: closed${date} in \\[${where.replaceAll('.', '\\.')}\\]\\(${blob}/${where.replaceAll('.', '\\.')}[^)]*\\) \\|`,
    );
  assert.match(order, done(1, 'component:F-007', 'docs/archive/backlog-2026.md', ` 2026${NB}11${NB}20`));
  assert.match(order, /\(https:[^)]*backlog-2026\.md#f-007\)/);
  assert.match(order, done(2, 'component:F-008', 'docs/work/records/F-008.md'));
  assert.match(order, done(3, 'component:F-010-T02', 'docs/work/tasks/F-010-T02.json'));
  assert.match(order, /\| 4 \| \| component:F-007-T05 \| — \| Not in backlog \|/);
  assert.match(order, /\| 5 \| \| component:F-009 \| — \| Not in backlog \|/);
  assert.match(order, /\| 6 \| \| \[component:F-001\][^\n]*: ▶ Ready \|/);
  const g = gapRows(r.out);
  assert.match(g, /component:F-009 is not in component's backlog/);
  assert.match(g, /component:F-007-T05 is not in component's backlog/);
  assert.doesNotMatch(g, /component:F-00[78] is not|F-010-T02 is not/);
});
test('B-058: dashboard --write --prune-order drops the Done items from the order and renumbers the rest', (t) => {
  const { home } = closedOrderFixture(t);
  const before = readFileSync(join(home, 'docs/SOLUTION-ORDER.md'), 'utf8');
  assert.notEqual(run(home, 'solution.mjs', ['dashboard', '--prune-order']).code, 0, 'prune needs --write');
  const r = run(home, 'solution.mjs', ['dashboard', '--write', '--prune-order']);
  assert.equal(r.code, 0, r.err);
  assert.match(
    r.out,
    /Dropped 3 done item\(s\) from docs\/SOLUTION-ORDER\.md: component:F-007, component:F-008, component:F-010-T02/,
  );
  const after = readFileSync(join(home, 'docs/SOLUTION-ORDER.md'), 'utf8');
  assert.equal(
    after,
    before.replace(
      /<!-- order:start -->[\s\S]*<!-- order:end -->/,
      '<!-- order:start -->\n1. component:F-007-T05 — a step the archive never names\n2. component:F-009 — wrong ID\n3. component:F-001 — open\n<!-- order:end -->',
    ),
  );
  assert.equal(run(home, 'solution.mjs', ['check']).code, 0);
});

test('B-059: a Done link escapes a backslash and brackets in its label and percent-encodes its URL', (t) => {
  // CodeQL js/incomplete-sanitization (NERV PR #753): a label ending in `\` escaped its own closing bracket.
  const { home, sha } = solution(t);
  const archive = 'docs/archive/backlog-x\\]y [z] (1).md';
  const b64 = (s) => Buffer.from(s).toString('base64');
  const backlog = b64('# Backlog\n' + record('F-001'));
  const closed = b64(
    '# Archive\n\n## Closed 2026-11-20\n\n' + record('F-007', { status: 'Closed', title: 'Archived' }),
  );
  const mock = join(home, 'mock.mjs');
  write(
    mock,
    `const j=(x)=>new Response(JSON.stringify(x));globalThis.fetch=async url=>{` +
      `if(url.includes('/contents/.harness.json'))return new Response('{}',{status:404});` +
      `if(url.endsWith('/commits/main'))return j({sha:'${sha}'});` +
      `if(url.endsWith('/git/trees/${sha}?recursive=1'))return j({tree:[{type:'blob',path:${JSON.stringify(archive)}},{type:'blob',path:'docs/BACKLOG.md'}]});` +
      `if(!url.includes('ref=${sha}'))return new Response('{}',{status:404});` +
      `if(url.includes('/contents/docs/BACKLOG.md'))return j({encoding:'base64',content:'${backlog}'});` +
      `if(url.includes(${JSON.stringify(archive.split('/').map(encodeURIComponent).join('/'))}))return j({encoding:'base64',content:'${closed}'});` +
      `return new Response('{}',{status:404});};`,
  );
  const manifest = JSON.parse(readFileSync(join(home, '.solution.json'), 'utf8'));
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(join(home, 'docs/SOLUTION-ORDER.md'), orderFile(['1. component:F-007 — archived']));
  commit(home);
  const r = run(home, 'solution.mjs', ['dashboard', '--remote'], mock);
  assert.equal(r.code, 0, r.err);
  const line = part(r.out, '## Solution order')
    .split('\n')
    .find((l) => l.startsWith('| 1 |'));
  const label = 'docs/archive/backlog-x\\\\\\]y \\[z\\] (1).md';
  const url = `https://github.com/fixture/component/blob/${sha}/docs/archive/backlog-x%5C%5Dy%20%5Bz%5D%20%281%29.md#f-007`;
  assert.ok(line.includes(`✅ Done: closed 2026${NB}11${NB}20 in [${label}](${url}) |`), line);
});

test('B-059 review: a record link percent-encodes an archive path; a Done label keeps a pipe inside its cell', (t) => {
  const { home, component, manifest, sha: first } = solution(t);
  const archive = 'docs/archive/closed #1 (a)|b%41&c.md';
  manifest.repositories[0].archives = [archive];
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(join(home, 'docs/SOLUTION-ORDER.md'), orderFile(['1. component:F-007 — archived']));
  write(join(component, archive), record('F-001', { status: 'Closed' }));
  write(
    join(component, 'docs/archive/backlog-a|b.md'),
    '## Closed 2026-11-20\n\n' + record('F-007', { status: 'Closed' }),
  );
  write(join(component, 'docs/BACKLOG.md'), '# Empty\n');
  const sha = commit(component);
  assert.notEqual(sha, first);
  commit(home);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const blob = `https://github.com/fixture/component/blob/${sha}`;
  assert.ok(
    r.out.includes(`| [component:F-001](${blob}/docs/archive/closed%20%231%20%28a%29%7Cb%2541%26c.md#f-001) |`),
    r.out,
  );
  assert.ok(r.out.includes(`in [docs/archive/backlog-a\\|b.md](${blob}/docs/archive/backlog-a%7Cb.md#f-007) |`), r.out);
});

// F-099: the owner's overview layout, configured from the manifest only.
function layoutFixture(t) {
  const fixture = ownerFixture(t);
  const { home, component } = fixture;
  const template = temp(t);
  git(template, 'init', '-qb', 'main');
  write(join(template, 'VERSION'), '1.2.0\n');
  commit(template);
  for (const tag of ['v1.0.0', 'v1.2.0']) git(template, 'tag', tag);
  const manifest = JSON.parse(readFileSync(join(home, '.solution.json'), 'utf8'));
  write(join(home, '.solution.json'), { ...manifest, emoji: '🧭' });
  write(join(home, '.harness.json'), {
    version: '1.2.0',
    stacks: ['core', 'solution'],
    solution: { role: 'coordinator', manifest: '.solution.json' },
    audit: { days: 7 },
  });
  write(join(home, `docs/audits/${daysAgo(1).slice(0, 10)}-full.audit.json`), auditManifest(daysAgo(1)));
  commit(home);
  write(join(component, '.harness.json'), { version: '1.0.0' });
  const sha = commit(component);
  const r = runWith(home, { HARNESS_HOME: template }, ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const at = (id) => `https://github\\.com/fixture/component/blob/${sha}/docs/BACKLOG\\.md#${id.toLowerCase()}`;
  const ln = (ref) => `\\[${ref}\\]\\(${at(ref.split(':')[1])}\\)`;
  return { ...fixture, r, ln, template };
}
const rx = (...parts) => new RegExp(parts.join(''));
test('F-099: the summary per project carries harness, next audit, a solution total and the coordinator emoji', (t) => {
  const { r } = layoutFixture(t);
  const s = part(r.out, '## Summary');
  assert.match(s, /\| Project \| Open records \| Doable agent h \| Owner h \| Blocked \| Harness \| Next audit \|/);
  assert.match(s, /\| 🧭 solution \| 1 \| 0 \| Unknown \| 0 \| v1\.2\.0 \(latest\) \| \d{4}‑\d{2}‑\d{2} \|/);
  assert.match(s, /\| 🛰️ component \| 4 \| 2 \| 0 \| 2 \| v1\.0\.0, behind v1\.2\.0 \| no audit found \|/);
  assert.match(s, /\| \*\*Total\*\* \| 5 \| \*\*2\*\* \| \*\*at least 0\*\* \| 2 \| \| \|/);
  assert.match(s, /Remaining in all backlogs: at least 4 h agent \+ at least 0 h owner\./);
  assert.doesNotMatch(r.out, /## Owner view/);
});
test('F-099: the solution order shows emoji, links, agent and owner hours and open prerequisites', (t) => {
  const { r, ln } = layoutFixture(t);
  const order = part(r.out, '## Solution order');
  assert.match(
    order,
    /\| # \| \| Item \| Title \| Status \/ state \| Agent h \| Owner h \| Open prerequisites \| Note \|/,
  );
  assert.match(
    order,
    rx(
      '\\| 1 \\| 🛰️ \\| ',
      ln('component:F-001-T01'),
      ' \\| Build after the choice \\| Planned: Blocked: owner step component:F-001-T02 \\| 1 \\| 0 \\| ',
      ln('component:F-001-T01'),
      ' waits on ',
      ln('component:F-001-T02'),
      ' \\| waits on the owner \\|',
    ),
  );
  assert.match(
    order,
    rx(
      '\\| 2 \\| 🛰️ \\| ',
      ln('component:F-003'),
      ' \\| Generated F-003 \\| Open: Waiting on component:F-002-T01 \\| 1 \\| 0 \\| ',
      ln('component:F-003-T01'),
      ' waits on ',
      ln('component:F-002-T01'),
      ' \\|',
    ),
  );
  assert.match(
    order,
    rx(
      '\\| 3 \\| 🛰️ \\| ',
      ln('component:F-002'),
      ' \\| Generated F-002 \\| Open: ▶ Ready \\| 1 \\| 0 \\| — \\| ready \\|',
    ),
  );
  assert.match(order, /\| 4 \| 🛰️ \| component:F-009 \| — \| Not in backlog \| — \| — \| — \| gone \|/);
});
test('F-099: Blocked, Waiting for the owner and Nothing to do carry links, titles, priority, owner time and next step', (t) => {
  const { r, ln } = layoutFixture(t);
  const blocked = part(r.out, '## Blocked');
  assert.match(blocked, /\| Project \| Blocked item \| Title \| Waits on \| Kind \|/);
  assert.match(
    blocked,
    rx(
      '\\| 🛰️ component \\| ',
      ln('component:F-001-T01'),
      ' \\| Build after the choice \\| ',
      ln('component:F-001-T02'),
      ' \\| owner decision \\|',
    ),
  );
  assert.match(
    blocked,
    rx(
      '\\| 🛰️ component \\| ',
      ln('component:F-004-T01'),
      ' \\| Waits on another project \\| solution:F-001-T09 \\| unknown prerequisite, in another project \\|',
    ),
  );
  const owner = part(r.out, '## Waiting for the owner');
  assert.match(owner, /\| Item \| Title \| Kind \| Priority \| Owner time \| Next \|/);
  assert.match(
    owner,
    rx(
      '\\| ',
      ln('component:F-001'),
      ' \\| Generated F-001 \\| Decision \\| 🔶 P2 \\| — \\| F-001-T02: Owner chooses \\|',
    ),
  );
  assert.match(
    owner,
    /\| \[solution:F-001\]\(https:\/\/github\.com\/fixture\/coordination\/blob\/[0-9a-f]{40}\/docs\/BACKLOG\.md#f-001\) \| Fixture workflow \| Procedure \| 🔶 P2 \| — \| A fixture next step\. \|/,
  );
  const idle = part(r.out, '## Nothing to do');
  assert.match(idle, /\| Project \| Why \|/);
  assert.match(idle, /\| 🧭 solution \| all waiting on the owner \|/);
  assert.doesNotMatch(idle, /component/);
});
test('F-099: a record whose steps are all done is never the next pick; a bad coordinator emoji is refused', (t) => {
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🟢 Verified', '🤖').replace('| 1 h |', '| 0 h |'),
      steps: steps(stepRow('F-001-T01', 'Done work', 'Verified', '🤖')),
    }) +
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '🤖'),
      steps: steps(stepRow('F-002-T01', 'Real work', 'Planned', '🤖')),
    });
  const { home, manifest } = solution(t, component);
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(join(home, 'docs/SOLUTION-ORDER.md'), orderFile(['1. component:F-001', '2. component:F-002']));
  commit(home);
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const order = part(r.out, '## Solution order');
  assert.match(order, /\| 1 \| \| \[component:F-001\][^\n]*\| Verified: Ready \(to close\) \|/);
  assert.match(order, /\| 2 \| \| \[component:F-002\][^\n]*\| Open: ▶ Ready \|/);
  write(join(home, '.solution.json'), { ...manifest, emoji: '' });
  r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 1);
  assert.match(r.err, /solution: emoji must be a short string/);
});
test('F-099 review: owner time an agent-only cell cannot give is unknown; an idle project with only verification left says so', (t) => {
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🟡 Implemented', '🤖'),
      steps: steps(stepRow('F-001-T01', 'Awaits its check', 'Implemented; verification pending', '🤖')).replace(
        '| 1 h | Implemented',
        '| 0 h | Implemented',
      ),
    }) +
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '—', '—', '🤔'),
      steps: steps(stepRow('F-002-T01', 'Owner decides', 'Planned', '🤔')),
    });
  const { home, manifest } = solution(t, component);
  write(join(home, '.solution.json'), { ...manifest, order: 'docs/SOLUTION-ORDER.md' });
  write(join(home, 'docs/SOLUTION-ORDER.md'), orderFile(['1. component:F-002-T01']));
  commit(home);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(part(r.out, '## Waiting for the owner'), /\| \[component:F-002\][^\n]*\| Decision \| 🔶 P2 \| — \|/);
  assert.match(part(r.out, '## Solution order'), /\| 1 \| \| \[component:F-002-T01\][^\n]*\| — \| unknown \|/);
  assert.match(part(r.out, '## Nothing to do'), /\| component \| only verification, closure or owner work left \|/);
});

// B-060: five parts of a coordinator's retired overview the dashboard missed or got wrong.
function parityFixture(t, extra = {}) {
  const remaining = (s, cell) => s.replace('| 🟢 Small | 1 h |', `| 🟢 Small | ${cell} |`);
  const component =
    '# Backlog\n\n' +
    // the next open step is the owner's: agent work exists (T02), but the record is not the next pick
    generatedRecord('F-001', {
      summary: remaining(summary('🔴 Open', '🤖', '🧑‍🔧'), '1 h agent + 1 h owner'),
      steps: steps(
        stepRow('F-001-T01', 'Owner runs the check', 'Planned', '[🧑‍🔧](docs/p.md)'),
        stepRow('F-001-T02', 'Unrelated agent work', 'Planned', '🤖'),
        stepRow('F-001-T03', 'Record the check', 'Planned', '⏳ 🤖', '[F-001-T01](#f-001-t01)'),
      ),
    }) +
    // the next open step waits behind an owner step in another record
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(stepRow('F-002-T01', 'After the check', 'Planned', '⏳ 🤖', '[F-001-T01](#f-001-t01)')),
    }) +
    // agent work first, an owner step after it: the next open step is the agent's
    generatedRecord('F-003', {
      summary: remaining(summary('🔴 Open', '🤖', '—', '🤔'), '1 h agent + 0.5 h owner'),
      steps: steps(
        stepRow('F-003-T01', 'Agent work first', 'Planned', '🤖'),
        stepRow('F-003-T02', 'Owner decides later', 'Planned', '⏳ [🤔](docs/d.md)', '[F-003-T01](#f-003-t01)'),
      ),
    });
  const fixture = solution(t, component);
  const { home, manifest } = fixture;
  write(join(home, '.solution.json'), {
    ...manifest,
    emoji: '🧭',
    order: 'docs/SOLUTION-ORDER.md',
    repositories: manifest.repositories.map((r) => ({ ...r, emoji: '🛰️' })),
    ...extra,
  });
  write(
    join(home, 'docs/SOLUTION-ORDER.md'),
    orderFile(['1. component:F-001', '2. component:F-002', '3. component:F-003']),
  );
  commit(home);
  return fixture;
}
test('B-060: ▶ never marks an item whose next open step is the owner or waits behind an owner step', (t) => {
  const { home } = parityFixture(t);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const order = part(r.out, '## Solution order');
  assert.match(order, /\| 1 \| 🛰️ \| \[component:F-001\][^\n]*\| Open: Owner: Procedure \|/);
  assert.match(order, /\| 2 \| 🛰️ \| \[component:F-002\][^\n]*\| Open: Blocked: owner step component:F-001-T01 \|/);
  assert.match(order, /\| 3 \| 🛰️ \| \[component:F-003\][^\n]*\| Open: ▶ Ready \|/);
  assert.equal(order.match(/▶ Ready/g).length, 1);
});
test('B-060: scoped audits count in the last audit, beside the last full one', (t) => {
  const { home, component, template } = healthFixture(t);
  write(
    join(component, `docs/audits/${daysAgo(2).slice(0, 10)}-scoped.audit.json`),
    auditManifest(daysAgo(2), 'scoped', ['code']),
  );
  commit(component);
  write(join(home, `docs/audits/${daysAgo(1).slice(0, 10)}-full.audit.json`), auditManifest(daysAgo(1), 'scoped'));
  commit(home);
  const r = runWith(home, { HARNESS_HOME: template }, ['dashboard']);
  const s = part(r.out, '## Audits, reviews and harness');
  const row = (id) => s.split('\n').find((l) => l.startsWith(`| ${id} `)) ?? '';
  assert.match(
    row('solution'),
    new RegExp(
      `\\| ${daysAgo(1).slice(0, 10).replaceAll('-', NB)} \\(scoped\\)<br>no complete full audit<br>next \\d{4}${NB}\\d{2}${NB}\\d{2} \\|`,
    ),
  );
  assert.match(
    row('component'),
    new RegExp(
      `\\| ${daysAgo(2).slice(0, 10).replaceAll('-', NB)} \\(scoped\\)<br>${daysAgo(30).slice(0, 10).replaceAll('-', NB)} \\(full\\)<br>\\*\\*due: logic,`,
    ),
  );
});
test('B-060: open work per record: open steps, agent and owner hours and state, then its steps with their state', (t) => {
  const { home } = parityFixture(t);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const open = part(r.out, '## Open work by repository');
  assert.match(open, /### 🛰️ component\n/);
  assert.match(open, /\| Item \| Title \| Status \| Priority \| Open steps \| Agent h \| Owner h \| State \|/);
  assert.match(
    open,
    /\| \[component:F-001\]\([^)]*\) \| Generated F-001 \| Open \| 🔶 P2 \| 3 \| 1 \| 1 \| Owner: Procedure \|/,
  );
  assert.match(
    open,
    /\| \[component:F-003\]\([^)]*\) \| Generated F-003 \| Open \| 🔶 P2 \| 2 \| 1 \| 0\.5 \| Ready \|/,
  );
  assert.match(open, /### 🧭 solution\n/);
  assert.match(open, /<details><summary>🛰️ component: 6 open steps<\/summary>/);
  assert.match(open, /\| Step \| Title \| Status \| Remaining \| Who \| Depends on \| State \|/);
  assert.match(
    open,
    /\| component:F-001-T03 \| Record the check \| Planned \| 1 h \| ⏳ 🤖 \| F-001-T01 \| Blocked: owner step component:F-001-T01 \|/,
  );
});
test('B-060: gap-review proposals are numbered', (t) => {
  const { home } = gapFixture(t, '# Backlog\n\n' + record('F-001', { title: 'Unrelated work' }));
  const g = gapRows(run(home, 'solution.mjs', ['dashboard']).out);
  assert.match(g, /\| # \| Kind \| Where \| Evidence \| Proposal \|\n\|---:\|/);
  assert.match(g, /\n\| 1 \| Cross-repository need/);
  assert.match(g, /\n\| 5 \| /);
});
test('B-060: the coordinator label is configurable; solution by default; a bad label is refused', (t) => {
  let { home } = parityFixture(t, { label: 'coordinator' });
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(part(r.out, '## Summary'), /\| 🧭 coordinator \| /);
  assert.match(r.out, /\n\| coordinator \| \[[0-9a-f]{12}\]/);
  assert.doesNotMatch(r.out, /🧭 solution/);
  ({ home } = parityFixture(t));
  r = run(home, 'solution.mjs', ['dashboard']);
  assert.match(part(r.out, '## Summary'), /\| 🧭 solution \| /);
  ({ home } = parityFixture(t, { label: '' }));
  r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 1);
  assert.match(r.err, /label must be a short string/);
});
test('B-130: the coordinator id is configurable; solution by default; a bad or duplicate id is refused', (t) => {
  const { home, manifest } = solution(t);
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.match(r.out, /\| \[solution:F-001\]\(/);
  write(join(home, '.solution.json'), { ...manifest, id: 'coordinator' });
  r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /\| \[coordinator:F-001\]\(/);
  assert.doesNotMatch(r.out, /solution:F-001/);
  write(
    join(home, 'docs/BACKLOG.md'),
    '# Backlog\n\n' + record('F-001', { links: 'missing:F-001', complete: '~70%', human: 'Procedure' }),
  );
  r = run(home, 'solution.mjs', ['check']);
  assert.match(r.err + r.out, /coordinator:F-001: unknown component missing/);
  write(join(home, '.solution.json'), { ...manifest, id: ['coordinator'] });
  assert.match(run(home, 'solution.mjs', ['check']).err, /id must be a string/);
  for (const id of ['Bad Id', 'component']) {
    write(join(home, '.solution.json'), { ...manifest, id });
    r = run(home, 'solution.mjs', ['check']);
    assert.equal(r.code, 1);
    assert.match(r.err, /Invalid\/duplicate repository ID/);
  }
});
test('B-060 review: work behind a whole record whose next step is the owner names that step once', (t) => {
  const component =
    '# Backlog\n\n' +
    generatedRecord('F-001', {
      summary: summary('🔴 Open', '🤖', '🧑‍🔧'),
      steps: steps(
        stepRow('F-001-T01', 'Owner runs the check', 'Planned', '[🧑‍🔧](docs/p.md)'),
        stepRow('F-001-T02', 'Agent work beside it', 'Planned', '🤖'),
      ),
    }) +
    generatedRecord('F-002', {
      summary: summary('🔴 Open', '⏳'),
      steps: steps(stepRow('F-002-T01', 'After the whole record', 'Planned', '⏳ 🤖', '[F-001](#f-001)')),
    });
  const { home } = solution(t, component);
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(
    part(r.out, '## Blocked'),
    /\| \[component:F-002-T01\]\([^)]*\) \| After the whole record \| \[component:F-001-T01\]\([^)]*\) \| owner procedure \|/,
  );
  const runway = part(r.out, '## Agent runway');
  assert.match(runway, /owner step component:F-001-T01/);
  assert.doesNotMatch(runway, /owner step component:F-001 /);
  assert.doesNotMatch(runway, /owner step component:F-001;|owner step component:F-001 \|/);
});
test('B-060 review: a label per repository is shown; Markdown in a label is refused', (t) => {
  let { home, manifest } = solution(t);
  write(join(home, '.solution.json'), {
    ...manifest,
    repositories: manifest.repositories.map((r) => ({ ...r, label: 'Component app' })),
  });
  commit(home);
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.match(part(r.out, '## Summary'), /\| Component app \| /);
  write(join(home, '.solution.json'), { ...manifest, label: 'Comp [x](http://e)' });
  r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 1);
  assert.match(r.err, /solution: label must be a short string/);
});
// F-101: the owner's layout review of a coordinator's dashboard (2026-11-26).
test('F-101: the total rows read Total; the Summary total leaves Harness and Next audit empty', (t) => {
  const { r } = layoutFixture(t);
  assert.doesNotMatch(r.out, /\*\*Solution\*\*/);
  assert.match(part(r.out, '## Summary'), /\| \*\*Total\*\* \| 5 \| \*\*2\*\* \| \*\*at least 0\*\* \| 2 \| \| \|\n/);
  assert.match(part(r.out, '## Agent runway'), /\| \*\*Total\*\* \| /);
  assert.match(part(r.out, '## Remaining effort'), /\| \*\*Total\*\* \| /);
});
test('F-101: every date the dashboard prints keeps its hyphens from wrapping; link targets stay plain', (t) => {
  const { r } = layoutFixture(t);
  assert.match(
    part(r.out, '## Summary'),
    new RegExp(`\\| 🧭 solution \\| [^\\n]*\\| \\d{4}${NB}\\d{2}${NB}\\d{2} \\|`),
  );
  assert.match(r.out, new RegExp(`Snapshot: \\d{4}${NB}\\d{2}${NB}\\d{2}T`));
  const shown = r.out.replace(/\]\([^)]*\)/g, ']');
  assert.doesNotMatch(shown, /\d{4}-\d{2}-\d{2}/);
  assert.doesNotMatch(r.out.match(/\]\([^)]*\)/g)?.join('') ?? '', new RegExp(NB));
});
test('F-101: a multi-value cell of up to five items has one item per line', (t) => {
  const { home, template } = healthFixture(t);
  const r = runWith(home, { HARNESS_HOME: template }, ['dashboard']);
  const s = part(r.out, '## Audits, reviews and harness');
  const row = (id) => s.split('\n').find((l) => l.startsWith(`| ${id} `)) ?? '';
  assert.match(
    row('component'),
    new RegExp(`\\| token: next \\d{4}${NB}\\d{2}${NB}\\d{2}<br>\\*\\*architecture: none found\\*\\* \\|`),
  );
  assert.match(
    row('solution'),
    new RegExp(`\\| \\d{4}${NB}\\d{2}${NB}\\d{2} \\(full\\)<br>next \\d{4}${NB}\\d{2}${NB}\\d{2} \\|`),
  );
});
test('F-101: a larger multi-value cell is a count that opens to its items, the shared prefix written once', (t) => {
  const owners = Array.from({ length: 7 }, (_, i) =>
    stepRow(`F-001-T0${i + 1}`, `Owner check ${i + 1}`, 'Planned', '[🧑‍🔧](docs/p.md)'),
  );
  const { home } = solution(
    t,
    '# Backlog\n\n' + generatedRecord('F-001', { summary: summary('🔴 Open', '—', '🧑‍🔧'), steps: steps(...owners) }),
  );
  const r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  const ids = Array.from({ length: 7 }, (_, i) => `F-001-T0${i + 1}`).join(', ');
  assert.match(
    part(r.out, '## Agent runway'),
    new RegExp(`\\| component \\| 0 h \\| <details><summary>7 owner steps</summary>component: ${ids}</details> \\|`),
  );
  assert.doesNotMatch(part(r.out, '## Agent runway'), /owner step component:F-001-T01/);
});
test('F-101: htmlTables renders every table as HTML with top-aligned rows; Markdown tables stay the default', (t) => {
  const { home, manifest, sha } = solution(t, record('F-001', { title: 'Pipe | and *stars* `a **b**`' }));
  let r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.doesNotMatch(r.out, /<table>/);
  write(join(home, '.solution.json'), { ...manifest, htmlTables: true });
  commit(home);
  r = run(home, 'solution.mjs', ['dashboard']);
  assert.equal(r.code, 0, r.err);
  assert.doesNotMatch(r.out, /^\|/m);
  assert.match(
    r.out,
    /<table>\n<tr><th>Source<\/th><th>Revision<\/th><th>Snapshot state<\/th><\/tr>\n<tr valign="top"><td>/,
  );
  assert.match(r.out, /<th align="right">Open records<\/th>/);
  assert.match(r.out, /<tr valign="top"><td><b>Total<\/b><\/td><td align="right">/);
  assert.match(
    r.out,
    new RegExp(
      `<td><a href="https://github\\.com/fixture/component/blob/${sha}/docs/BACKLOG\\.md#f-001">component:F-001</a></td><td>Pipe \\| and \\*stars\\* <code>a \\*\\*b\\*\\*</code></td>`,
    ),
  );
  write(join(home, '.solution.json'), { ...manifest, htmlTables: 'yes' });
  r = run(home, 'solution.mjs', ['check']);
  assert.equal(r.code, 1);
  assert.match(r.err, /htmlTables must be true or false/);
});
