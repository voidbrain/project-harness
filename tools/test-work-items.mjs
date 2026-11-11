import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { execFileSync, spawn } from 'node:child_process';
import {
  migrateLedger,
  renderLedger,
  taskCatalog,
  checkWorkItems,
  resource,
  overlaps,
  calibrate,
} from '../core/tools/work-items.mjs';
import { transition, claimOperation, parseClaimArgs } from '../core/tools/task-claims.mjs';
const sha = 'a'.repeat(40),
  config = {
    enabled: true,
    layout: 'docs/work/layout.json',
    records: 'docs/work/records',
    tasks: 'docs/work/tasks',
    profiles: 'docs/agents/model-profiles.json',
  };
function dir(t) {
  const p = mkdtempSync(join(tmpdir(), 'harness work items '));
  t.after(() => rmSync(p, { recursive: true, force: true }));
  return p;
}
function json(path, value) {
  mkdirSync(resolve(path, '..'), { recursive: true });
  writeFileSync(path, JSON.stringify(value));
}
function fixture(t) {
  const root = dir(t);
  mkdirSync(join(root, 'docs'));
  writeFileSync(
    join(root, 'docs/BACKLOG.md'),
    '# Work\n\n<!-- recap:start -->\nDerived\n<!-- recap:end -->\n\n## Bugs\n\n### B-001\n\nBug\n\n---\n\n## Features\n\n### F-001\n\nFeature\n\n---\n\n',
  );
  json(join(root, '.harness.json'), { workItems: config });
  return root;
}
function task(id = 'F-001-T01') {
  return {
    version: 1,
    id,
    parent: 'F-001',
    title: 'One bounded change',
    goal: 'Implement an explicit outcome',
    status: 'ready',
    acceptance: ['Observable result'],
    dependsOn: [],
    resources: ['src/a.ts'],
    capabilities: ['typescript'],
    privacy: 'local-only',
    validation: ['node --test named-fixture'],
    escalation: ['Stop on contract ambiguity'],
  };
}
function profiles(root) {
  json(join(root, config.profiles), {
    version: 1,
    profiles: [
      {
        id: 'local-candidate',
        model: 'unmeasured-local',
        status: 'candidate',
        capabilities: ['typescript'],
        evidence: [],
      },
    ],
  });
}
test('record migration is byte-preserving and separate edits regenerate one authoritative ledger', (t) => {
  const root = fixture(t),
    before = readFileSync(join(root, 'docs/BACKLOG.md'), 'utf8');
  assert.equal(migrateLedger(root, config), 2);
  assert.equal(renderLedger(root, config), before);
  profiles(root);
  assert.deepEqual(checkWorkItems(root), { enabled: true, records: 2, tasks: 0 });
  const file = join(root, config.records, 'F-001.md');
  writeFileSync(file, readFileSync(file, 'utf8').replace('Feature', 'Changed feature'));
  assert.throws(() => checkWorkItems(root), /differs/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), renderLedger(root, config));
  assert.equal(checkWorkItems(root).records, 2);
  assert.throws(() => migrateLedger(root, config), /already exists/);
});
test('recap ownership remains with its generator; unsafe and duplicate record sources fail', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  writeFileSync(
    join(root, 'docs/BACKLOG.md'),
    readFileSync(join(root, 'docs/BACKLOG.md'), 'utf8').replace('Derived', 'New recap'),
  );
  assert.equal(checkWorkItems(root).enabled, true);
  assert.match(renderLedger(root, config), /New recap/);
  assert.throws(() => renderLedger(root, { ...config, records: '../escape' }), /relative/);
  writeFileSync(join(root, config.records, 'F-002.md'), '### F-003\nwrong');
  assert.throws(() => renderLedger(root, config), /identity/);
});
test('tasks validate identity, dependencies, resources and unmeasured model evidence honestly', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  json(join(root, config.tasks, 'F-001-T01.json'), task());
  assert.equal(taskCatalog(root, config).tasks.length, 1);
  const second = { ...task('F-001-T02'), dependsOn: ['F-001-T01'] };
  json(join(root, config.tasks, 'F-001-T02.json'), second);
  json(join(root, config.tasks, 'F-001-T01.json'), { ...task(), dependsOn: ['F-001-T02'] });
  assert.throws(() => taskCatalog(root, config), /cycle/);
  json(join(root, config.tasks, 'F-001-T01.json'), task());
  json(join(root, config.profiles), {
    version: 1,
    profiles: [{ id: 'bad', model: 'unknown', status: 'qualified', capabilities: ['typescript'], evidence: [] }],
  });
  assert.throws(() => taskCatalog(root, config), /unevidenced/);
});
test('resource overlap includes directory scopes and named shared contracts, rejects traversal and arbitrary globs', () => {
  assert.equal(overlaps('src/**', 'src/a.ts'), true);
  assert.equal(overlaps('src/a.ts', 'src/b.ts'), false);
  assert.equal(overlaps('contract:rpc', 'contract:rpc'), true);
  for (const r of ['../a', 'src/../a', '/tmp/a', 'src/*', 'src\\a']) assert.throws(() => resource(r));
});
function request(task = 'F-001-T01', resources = ['src/a.ts']) {
  return { task, owner: 'agent-a', baseline: sha, branch: 'feat/one', minutes: 1, resources };
}
test('leases are fenced, expiry never grants takeover and stale release cannot remove new ownership', () => {
  const empty = { version: 1, fence: 0, claims: [] },
    a = transition(empty, 'acquire', request(), 1000);
  assert.throws(() => transition(a.state, 'acquire', request(), 62000), /confirmed-stopped/);
  assert.throws(() => transition(a.state, 'verify', { ...a.claim }, 62000), /expired/);
  const released = transition(a.state, 'release', { ...a.claim, confirmedStopped: true }, 2000),
    b = transition(released.state, 'acquire', request(), 3000);
  assert.ok(b.claim.fence > a.claim.fence);
  assert.throws(() => transition(b.state, 'release', { ...a.claim, confirmedStopped: true }, 4000), /Stale/);
  assert.throws(
    () =>
      transition(
        b.state,
        'recover',
        { task: b.claim.task, fence: b.claim.fence, confirmedStopped: true, reason: 'Observed stopped worker' },
        4000,
      ),
    /expired/,
  );
  const recovered = transition(
    b.state,
    'recover',
    { task: b.claim.task, fence: b.claim.fence, confirmedStopped: true, reason: 'Observed stopped worker' },
    64000,
  );
  assert.equal(recovered.claim.state, 'released');
});
test('unknown or duplicate flags fail before Git operations', () => {
  for (const args of [
    ['acquire', '--force'],
    ['status', '--remote', 'origin', '--remote', 'origin'],
    ['verify', '--task'],
    ['release', '--reason', 'x'],
  ])
    assert.throws(() => parseClaimArgs(args));
});
function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}
function gitFixture(t) {
  const root = dir(t),
    bare = join(root, 'remote.git'),
    a = join(root, 'a'),
    b = join(root, 'b');
  git(root, ['init', '--bare', '-b', 'main', bare]);
  git(root, ['clone', bare, a]);
  git(a, ['config', 'user.name', 'Fixture']);
  git(a, ['config', 'user.email', 'fixture@example.invalid']);
  writeFileSync(join(a, 'README'), 'neutral fixture');
  mkdirSync(join(a, 'docs/archive'), { recursive: true });
  writeFileSync(join(a, 'docs/archive/backlog-2026.md'), 'Published fixture evidence must remain\n');
  mkdirSync(join(a, 'tools'));
  writeFileSync(join(a, 'tools/guard.mjs'), readFileSync('core/tools/guard.mjs'));
  git(a, ['add', '.']);
  git(a, ['commit', '-m', 'Fixture']);
  git(a, ['push', 'origin', 'main']);
  git(root, ['clone', bare, b]);
  execFileSync(process.execPath, ['tools/guard.mjs', 'install'], { cwd: a, stdio: 'pipe' });
  execFileSync(process.execPath, ['tools/guard.mjs', 'install'], { cwd: b, stdio: 'pipe' });
  claimOperation(a, 'initialize', { confirmNewRegistry: true });
  return { root, a, b };
}
test('real remote claims preserve worktree/index, serialize conflicts and reject stale tokens across clones', (t) => {
  const { a, b } = gitFixture(t),
    before = git(a, ['status', '--porcelain']),
    first = claimOperation(a, 'acquire', request());
  assert.throws(() => claimOperation(b, 'acquire', request('F-001-T02')), /claimed/);
  const second = claimOperation(b, 'acquire', request('F-001-T02', ['src/b.ts']));
  assert.ok(second.claim.fence > first.claim.fence);
  assert.equal(git(a, ['status', '--porcelain']), before);
  assert.equal(git(a, ['branch', '--show-current']), 'main');
  claimOperation(a, 'release', { ...first.claim, confirmedStopped: true });
  const third = claimOperation(b, 'acquire', request());
  assert.throws(() => claimOperation(a, 'release', { ...first.claim, confirmedStopped: true }), /Stale/);
  assert.equal(claimOperation(a, 'verify', { ...third.claim }).claim.leaseId, third.claim.leaseId);
});
test('simultaneous competing Git pushes give exactly one owner, with no force push or FETCH_HEAD dependency', async (t) => {
  const { root, a, b } = gitFixture(t),
    tool = pathToFileURL(resolve('core/tools/task-claims.mjs')).href,
    go = join(root, 'go');
  const workers = [a, b].map((cwd, i) => {
    const ready = join(root, 'ready' + i);
    const code = `import {claimOperation} from ${JSON.stringify(tool)};import {writeFileSync,existsSync} from 'node:fs';try{const result=claimOperation(process.cwd(),'acquire',${JSON.stringify(request('F-001-T0' + (i + 1)))},{beforePush:({attempt})=>{if(!attempt){writeFileSync(${JSON.stringify(ready)},'ready');const deadline=Date.now()+10000;while(!existsSync(${JSON.stringify(go)})){if(Date.now()>deadline)throw Error('barrier timeout');Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,10);}}}});console.log(JSON.stringify(result));}catch(e){console.error(e.message);process.exitCode=1;}`;
    const child = spawn(process.execPath, ['--input-type=module', '-e', code], { cwd });
    let output = '';
    child.stdout.on('data', (v) => (output += v));
    child.stderr.on('data', (v) => (output += v));
    return { ready, child, done: new Promise((resolve) => child.on('close', (status) => resolve({ status, output }))) };
  });
  t.after(() => workers.forEach((w) => w.child.kill()));
  const deadline = Date.now() + 10000;
  while (!workers.every((w) => existsSync(w.ready))) {
    if (Date.now() > deadline) throw Error('workers did not reach barrier');
    await new Promise((r) => setTimeout(r, 10));
  }
  writeFileSync(go, 'go');
  const results = await Promise.all(workers.map((w) => w.done));
  assert.equal(results.filter((r) => r.status === 0).length, 1, JSON.stringify(results));
  assert.match(results.find((r) => r.status !== 0).output, /claimed/);
  assert.equal(claimOperation(a, 'status', {}).state.claims.filter((c) => c.state === 'active').length, 1);
});

test('lost push acknowledgement reconciles committed ownership even after an unrelated update', (t) => {
  const { a, b } = gitFixture(t);
  let once = false;
  const result = claimOperation(a, 'acquire', request(), {
    afterPush: (p) => {
      if (!once) {
        once = true;
        assert.equal(p.status, 0);
        claimOperation(b, 'acquire', request('F-001-T02', ['src/b.ts']));
        p.status = 1;
      }
    },
  });
  assert.equal(claimOperation(b, 'verify', { ...result.claim }).claim.leaseId, result.claim.leaseId);
});
test('absent registry does not silently reset fencing history', (t) => {
  const { a } = gitFixture(t);
  git(a, ['push', 'origin', ':refs/heads/harness/claims-v1']);
  assert.throws(() => claimOperation(a, 'acquire', request()), /absent/);
});
test('unqualified suggested local model cannot be explicitly assigned by the CLI', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  json(join(root, config.tasks, 'F-001-T01.json'), task());
  let error;
  try {
    execFileSync(
      process.execPath,
      [
        resolve('core/tools/task-claims.mjs'),
        'acquire',
        '--task',
        'F-001-T01',
        '--owner',
        'agent',
        '--profile',
        'local-candidate',
      ],
      { cwd: root, stdio: 'pipe' },
    );
  } catch (e) {
    error = e;
  }
  assert.ok(error);
  assert.match(String(error.stderr), /unqualified/);
});
test('canonical record links remain navigable and round-trip to unchanged ledger links', (t) => {
  const root = fixture(t),
    file = join(root, 'docs/BACKLOG.md');
  const original = readFileSync(file, 'utf8').replace(
    '\nFeature\n',
    '\nFeature [parent](#f-001) and [root](../README.md)\n',
  );
  writeFileSync(file, original);
  writeFileSync(join(root, 'README.md'), 'Root');
  migrateLedger(root, config);
  const source = readFileSync(join(root, config.records, 'F-001.md'), 'utf8');
  assert.match(source, /\[parent\]\(\.\.\/\.\.\/BACKLOG\.md#f-001\)/);
  assert.match(source, /\[root\]\(\.\.\/\.\.\/\.\.\/README\.md\)/);
  assert.equal(renderLedger(root, config), original);
});
test('unsupported titled/reference Markdown links fail before creating migration destinations', (t) => {
  for (const link of ['[root](../README.md "Root")', '[root]: ../README.md']) {
    const root = fixture(t),
      file = join(root, 'docs/BACKLOG.md');
    writeFileSync(file, readFileSync(file, 'utf8').replace('\nFeature\n', '\nFeature\n' + link + '\n'));
    assert.throws(() => migrateLedger(root, config), /Unsupported Markdown link/);
    assert.equal(existsSync(join(root, config.layout)), false);
    assert.equal(existsSync(join(root, config.records)), false);
  }
});
test('tilde fences and multi-backtick code spans retain literal links in record sources', (t) => {
  const root = fixture(t),
    file = join(root, 'docs/BACKLOG.md'),
    literal = '~~~md\n[root](../README.md)\n~~~\n``[parent](#f-001)``';
  const original = readFileSync(file, 'utf8').replace('\nFeature\n', '\nFeature\n' + literal + '\n');
  writeFileSync(file, original);
  migrateLedger(root, config);
  assert.ok(readFileSync(join(root, config.records, 'F-001.md'), 'utf8').includes(literal));
  assert.equal(renderLedger(root, config), original);
});
test('multiline destinations and references defined outside the record fail before source writes', (t) => {
  for (const link of ['[root](\n../README.md\n)', '[root][r]', '[r]']) {
    const root = fixture(t),
      file = join(root, 'docs/BACKLOG.md');
    writeFileSync(
      file,
      readFileSync(file, 'utf8')
        .replace('# Work\n', '# Work\n\n[r]: ../README.md\n')
        .replace('\nFeature\n', '\nFeature ' + link + '\n'),
    );
    assert.throws(() => migrateLedger(root, config), /Unsupported Markdown link/);
    assert.equal(existsSync(join(root, config.records)), false);
  }
});
test('reference definitions nested in quotes or lists cannot silently break a source shortcut', (t) => {
  for (const definition of ['> [r]: ../README.md', '    - [r]: ../README.md']) {
    const root = fixture(t),
      file = join(root, 'docs/BACKLOG.md');
    writeFileSync(
      file,
      readFileSync(file, 'utf8')
        .replace('# Work\n', '# Work\n' + definition + '\n')
        .replace('\nFeature\n', '\nFeature [r]\n'),
    );
    assert.throws(() => migrateLedger(root, config), /Unsupported Markdown link/);
    assert.equal(existsSync(join(root, config.records)), false);
  }
});
test('a checkout with all records archived renders an empty active ledger without a tracked records directory', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  rmSync(join(root, config.records), { recursive: true });
  const rendered = renderLedger(root, config);
  assert.doesNotMatch(rendered, /^### [BF]-\d{3}$/m);
  writeFileSync(join(root, 'docs/BACKLOG.md'), rendered);
  assert.deepEqual(checkWorkItems(root), { enabled: true, records: 0, tasks: 0 });
});

test('optional upfront plans join task effort/status with visible source-owned feature tables', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n<details>\n<summary>Evidence</summary>\n\nPending\n\n</details>',
    ),
  );
  const planned = { ...config, featurePlans: true };
  assert.throws(() => renderLedger(root, planned), /Feature needs an upfront task plan/);
  const step = {
    ...task(),
    title: 'Review <unsafe> | scope',
    effort: {
      size: 'small',
      estimate: '2–4 hours',
      basis: 'Known join; no external acceptance',
      reviewed: '2026-11-10',
    },
  };
  json(join(root, config.tasks, 'F-001-T01.json'), step);
  const rendered = renderLedger(root, planned);
  // F-055-T02 changed the table to a compact one; the dated basis moved into the details.
  // F-056: Baseline, Actual, Remaining (owner's order).
  assert.match(rendered, /\| Step \| Baseline \| Actual \| Remaining \| Status \|/);
  assert.match(rendered, /\| — \| 0 days \| 🟢 Small — 2–4 hours \| Ready \|/);
  assert.ok(rendered.indexOf('Known join; no external acceptance') > rendered.indexOf('<details>'));
  assert.match(rendered, /&lt;unsafe&gt; &#124; scope/);
  assert.ok(rendered.indexOf('F-001-T01') < rendered.indexOf('<details>'));
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), rendered);
  assert.equal(checkWorkItems(root).tasks, 1);
  assert.equal(renderLedger(root, planned), rendered);
  json(join(root, config.tasks, 'F-001-T01.json'), { ...step, status: 'closed' });
  assert.match(renderLedger(root, planned), /Completed/);
  for (const effort of [
    null,
    { ...step.effort, size: 'huge' },
    { ...step.effort, reviewed: '2026-02-30' },
    { ...step.effort, estimate: '' },
    { ...step.effort, extra: 'unreviewed' },
  ]) {
    json(join(root, config.tasks, 'F-001-T01.json'), { ...step, effort });
    assert.throws(() => renderLedger(root, planned), /effort/);
  }
  json(join(root, config.tasks, 'F-001-T01.json'), task());
  assert.throws(() => renderLedger(root, planned), /effort/);
  assert.doesNotMatch(renderLedger(root, config), /Feature steps/);
  // A record that mentions the tag inside a cell still gets the table at its own details block.
  json(join(root, config.tasks, 'F-001-T01.json'), step);
  writeFileSync(record, readFileSync(record, 'utf8').replace('Feature\n', 'Feature with a `<details>` mention\n'));
  const mentioned = renderLedger(root, planned);
  assert.ok(mentioned.indexOf('**Feature steps**') > mentioned.indexOf('mention'));
  assert.ok(mentioned.indexOf('**Feature steps**') < mentioned.indexOf('<details>\n<summary>'));
});
test('F-053: numeric days and baselines total per feature and at the top of the ledger', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
    ),
  );
  const layoutPath = join(root, config.layout);
  const layout = JSON.parse(readFileSync(layoutPath, 'utf8'));
  layout.segments[0].text = layout.segments[0].text.replace(
    '# Work\n',
    '# Work\n\n<!-- totals:start -->\n<!-- totals:end -->\n',
  );
  writeFileSync(layoutPath, JSON.stringify(layout));
  const planned = { ...config, featurePlans: true };
  const effort = (extra) => ({
    size: 'small',
    estimate: 'about a day',
    basis: 'Fixture',
    reviewed: '2026-11-11',
    ...extra,
  });
  const step = (n, status, extra) => ({ ...task(`F-001-T0${n}`), status, effort: effort(extra) });
  json(join(root, config.tasks, 'F-001-T01.json'), step(1, 'closed', { days: 0, baselineDays: 1 }));
  json(join(root, config.tasks, 'F-001-T02.json'), step(2, 'ready', { days: 1.5, baselineDays: 1 }));
  json(join(root, config.tasks, 'F-001-T03.json'), step(3, 'planned', { days: 0.25 }));
  json(join(root, config.tasks, 'F-001-T04.json'), step(4, 'planned', {}));
  const rendered = renderLedger(root, planned);
  assert.match(
    rendered,
    /\| \*\*Total\*\* \| 2 days \(2 of 4 steps\) \| 0 days \(0 of 4 steps recorded\) \| 1\.75 days \(1 open step without days\) \| 1 of 4 completed \|/,
  );
  assert.match(
    rendered,
    /<!-- totals:start -->\n\*\*Remaining effort:\*\* 1\.75 days across 3 open steps of 1 feature \(1 open step without days\)\. Generated from the task files\.\n<!-- totals:end -->/,
  );
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), rendered);
  assert.deepEqual(checkWorkItems(root).withoutDays, ['F-001-T04']);
  // A changed number makes the generated totals stale: check fails until rebuilt.
  json(join(root, config.tasks, 'F-001-T02.json'), step(2, 'ready', { days: 2, baselineDays: 1 }));
  assert.throws(() => checkWorkItems(root), /differs/);
  // Invalid numbers and a closed step with remaining days are refused.
  for (const extra of [{ days: -1 }, { days: 0.3 }, { days: 21 }, { baselineDays: '1' }, { days: Infinity }]) {
    json(join(root, config.tasks, 'F-001-T02.json'), step(2, 'ready', extra));
    assert.throws(() => renderLedger(root, planned), /effort/);
  }
  json(join(root, config.tasks, 'F-001-T02.json'), step(2, 'closed', { days: 1 }));
  assert.throws(() => renderLedger(root, planned), /effort/);
  // Without markers, no ledger total; without numbers, the feature total counts unknown steps, never 0 days known.
  layout.segments[0].text = layout.segments[0].text.replace('<!-- totals:start -->\n<!-- totals:end -->\n', '');
  writeFileSync(layoutPath, JSON.stringify(layout));
  json(join(root, config.tasks, 'F-001-T02.json'), step(2, 'ready', {}));
  const plain = renderLedger(root, planned);
  assert.doesNotMatch(plain, /Remaining effort:\*\*/);
  assert.match(plain, /\| 0\.25 days \(2 open steps without days\) \| 1 of 4 completed \|/);
});
test('F-055: queue order lists records in work-queue order inside each group; id order stays available', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const rec = (id, priority, human = 'No') =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P${priority} | Open | 🟢 Small |\n\n${human === 'Yes' ? '🧑' : '💻'} **→ Human action required: ${human}**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`;
  writeFileSync(join(root, config.records, 'F-001.md'), rec('F-001', 3));
  writeFileSync(join(root, config.records, 'F-002.md'), rec('F-002', 1, 'Yes'));
  writeFileSync(join(root, config.records, 'F-003.md'), rec('F-003', 1));
  writeFileSync(join(root, config.records, 'B-001.md'), rec('B-001', 2));
  const ids = (text) => [...text.matchAll(/^### ([BF]-\d{3})$/gm)].map((m) => m[1]);
  assert.deepEqual(ids(renderLedger(root, config)), ['B-001', 'F-001', 'F-002', 'F-003']);
  assert.deepEqual(ids(renderLedger(root, { ...config, order: 'id' })), ['B-001', 'F-001', 'F-002', 'F-003']);
  // Agent candidates by priority, then the human-action record; groups keep their place in the layout.
  const queued = renderLedger(root, { ...config, order: 'queue' });
  assert.deepEqual(ids(queued), ['B-001', 'F-003', 'F-001', 'F-002']);
  assert.equal(renderLedger(root, { ...config, order: 'queue' }), queued, 'deterministic');
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: { ...config, order: 'queue' } }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), queued);
  assert.equal(checkWorkItems(root).records, 4);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: { ...config, order: 'priority' } }));
  assert.throws(() => checkWorkItems(root), /workItems.order/);
});
test('F-054: actual effort on closed steps, read-only calibration and the re-estimation trigger', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const effort = (extra) => ({ size: 'small', estimate: 'a day', basis: 'Fixture', reviewed: '2026-11-11', ...extra });
  const closed = (n, baselineDays, actual, source = 'measured', reviewed = '2026-11-11') => ({
    ...task(`F-001-T${String(n).padStart(2, '0')}`),
    status: 'closed',
    effort: effort({ days: 0, baselineDays, actualDays: actual, actualSource: source, reviewed }),
  });
  const open = { ...task('F-001-T20'), status: 'planned', effort: effort({ days: 1, baselineDays: 1 }) };
  // Validation: both actual fields together, only on closed steps, bounded.
  json(join(root, config.tasks, 'F-001-T20.json'), open);
  for (const bad of [
    { ...closed(1, 1, 1), effort: effort({ days: 0, actualDays: 1 }) },
    { ...closed(1, 1, 1), effort: effort({ days: 0, actualDays: 1, actualSource: 'guessed' }) },
    { ...closed(1, 1, -1) },
    // F-056: an open step may record effort so far, but a planned (unstarted) one may not.
    { ...closed(1, 1, 1), status: 'planned', effort: effort({ actualDays: 1, actualSource: 'stated' }) },
  ]) {
    json(join(root, config.tasks, 'F-001-T01.json'), bad);
    assert.throws(() => taskCatalog(root, config), /effort/);
  }
  // Within range: nothing due.
  const steady = [1, 2, 3, 4, 5].map((n) => closed(n, 1, 1.25));
  assert.equal(calibrate([...steady, open]).due, false);
  assert.deepEqual(calibrate([...steady, open]).all, { n: 5, median: 1.25, min: 1.25, max: 1.25 });
  // A sustained gap over enough samples is due and names the open steps; fewer samples are not.
  const slow = [1, 2, 3, 4, 5].map((n) => closed(n, 1, 2));
  const due = calibrate([...slow, open]);
  assert.equal(due.due, true);
  assert.match(due.reasons[0], /median actual\/baseline 2 over 5 closed steps/);
  assert.deepEqual(due.reestimate, ['F-001-T20']);
  assert.equal(calibrate([...slow.slice(0, 4), open]).due, false);
  // One step far off is due on its own; measured and stated are reported apart.
  const outlier = calibrate([closed(1, 0.5, 2, 'stated'), closed(2, 1, 1), open]);
  assert.match(outlier.reasons.join(), /F-001-T01 took 4x its baseline/);
  assert.deepEqual(Object.keys(outlier.bySource), ['measured', 'stated']);
  assert.equal(outlier.bySource.stated.note, 'too few samples');
  // `since` drops the samples already acted on; false turns the trigger off; bad settings are refused.
  assert.equal(calibrate([...slow, open], { since: '2026-11-12' }).due, false);
  assert.equal(calibrate([...slow, open], false).due, false);
  for (const bad of [{ ratio: 1 }, { outlier: 1.2 }, { minSamples: 0 }, { since: '2026-02-30' }, { extra: 1 }])
    assert.throws(() => calibrate([], bad), /estimation/);
});
test('5.3.0 review: since excludes steps closed that day, zero actuals are no samples, errors name the field', () => {
  const effort = (extra) => ({ size: 'small', estimate: 'a day', basis: 'Fixture', reviewed: '2026-11-11', ...extra });
  const closed = (n, actual, reviewed = '2026-11-11') => ({
    ...task(`F-001-T0${n}`),
    status: 'closed',
    effort: effort({ days: 0, baselineDays: 1, actualDays: actual, actualSource: 'stated', reviewed }),
  });
  // Re-estimated on 2026-11-11 with since = that day: the outlier closed that day no longer triggers.
  assert.equal(calibrate([closed(1, 4)], { since: '2026-11-11' }).due, false);
  assert.equal(calibrate([closed(1, 4, '2026-11-12')], { since: '2026-11-11' }).due, true);
  // A cancelled step recorded with 0 actual is not a sample.
  assert.deepEqual(calibrate([closed(1, 0)]).all, { n: 0 });
  assert.throws(() => calibrate([], { ratio: 4 }), /outlier 3 must be at least ratio 4/);
  assert.throws(() => calibrate([], { extra: 1 }), /unknown field extra/);
});
test('5.3.0 review: a summary without a blank line after it still gets the basis inside the details', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n<details>\n<summary>Evidence</summary>\nx\n\n</details>',
    ),
  );
  json(join(root, config.tasks, 'F-001-T01.json'), {
    ...task(),
    effort: { size: 'small', estimate: 'a day', basis: 'Basis text', reviewed: '2026-11-11' },
  });
  const out = renderLedger(root, { ...config, featurePlans: true });
  assert.match(out, /<details>\n<summary>Evidence<\/summary>\n\n\*\*Step estimates\*\*[\s\S]*Basis text[\s\S]*\nx\n/);
});
test('F-056: the steps table shows baseline, actual (final or so far) and remaining; totals add actual effort', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
    ),
  );
  const layoutPath = join(root, config.layout);
  const layout = JSON.parse(readFileSync(layoutPath, 'utf8'));
  layout.segments[0].text = layout.segments[0].text.replace(
    '# Work\n',
    '# Work\n\n<!-- totals:start -->\n<!-- totals:end -->\n',
  );
  writeFileSync(layoutPath, JSON.stringify(layout));
  const effort = (extra) => ({ size: 'small', estimate: 'a day', basis: 'Fixture', reviewed: '2026-11-11', ...extra });
  json(join(root, config.tasks, 'F-001-T01.json'), {
    ...task('F-001-T01'),
    status: 'closed',
    effort: effort({ days: 0, baselineDays: 1, actualDays: 1.5, actualSource: 'measured' }),
  });
  json(join(root, config.tasks, 'F-001-T02.json'), {
    ...task('F-001-T02'),
    status: 'ready',
    effort: effort({ days: 0.5, baselineDays: 1, actualDays: 0.25, actualSource: 'stated' }),
  });
  const out = renderLedger(root, { ...config, featurePlans: true });
  assert.match(
    out,
    /\| F-001-T01 — One bounded change \| 1 day \| 1\.5 days \(measured\) \| 🟢 Small — 0 days \| Completed \|/,
  );
  assert.match(
    out,
    /\| F-001-T02 — One bounded change \| 1 day \| 0\.25 days so far \(stated\) \| 🟢 Small — 0\.5 days \| Ready \|/,
  );
  assert.match(out, /\| \*\*Total\*\* \| 2 days \| 1\.75 days \| 0\.5 days \| 1 of 2 completed \|/);
  assert.match(out, /0\.5 days across 1 open step of 1 feature\. 1\.75 days of actual effort recorded on 2 steps\./);
  // An open step's partial actual is no calibration sample.
  assert.equal(calibrate(taskCatalog(root, config).tasks).all.n, 1);
  // Nothing open: the total says so.
  json(join(root, config.tasks, 'F-001-T02.json'), {
    ...task('F-001-T02'),
    status: 'closed',
    effort: effort({ days: 0, baselineDays: 1 }),
  });
  assert.match(
    renderLedger(root, { ...config, featurePlans: true }),
    /\*\*Remaining effort:\*\* no open steps\. 1\.5 days of actual effort/,
  );
});
test('F-057: each record shows Depends on and Unlocks next to its summary, with links that resolve from the ledger', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const rec = (id, deps) =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|:---:|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n${deps ? `| Depends on | ${deps} |\n` : ''}\n</details>\n\n---\n\n`;
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    rec(
      'F-001',
      '[F-002](../../BACKLOG.md#f-002) — contract<br />[F-003](../../archive/backlog-2026.md#f-003) — release<br />[org/repo:F-009](https://github.com/org/repo/blob/v1/docs/BACKLOG.md#f-009) — upstream',
    ),
  );
  writeFileSync(join(root, config.records, 'F-002.md'), rec('F-002'));
  writeFileSync(join(root, config.records, 'B-001.md'), rec('B-001'));
  mkdirSync(join(root, 'docs/archive'), { recursive: true });
  writeFileSync(join(root, 'docs/archive/backlog-2026.md'), '# Archive\n\n' + rec('F-003').replace('Open', 'Closed'));
  const out = renderLedger(root, config);
  assert.match(
    out,
    /\| 🔴 \| 🔶 P2 \| Open \| 🟢 Small \|\n\n\*\*Depends on:\*\* \[F-002\]\(#f-002\), \[F-003\]\(archive\/backlog-2026\.md#f-003\), \[org\/repo:F-009\]\(https:\/\/github\.com\/org\/repo\/blob\/v1\/docs\/BACKLOG\.md#f-009\) · \*\*Unlocks:\*\* —\n\n💻/,
  );
  assert.match(out, /### F-002[\s\S]*?\*\*Depends on:\*\* — · \*\*Unlocks:\*\* \[F-001\]\(#f-001\)/);
  // A record with neither gets no line.
  assert.doesNotMatch(out.slice(out.indexOf('### B-001'), out.indexOf('### F-001')), /Depends on:\*\*/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  assert.equal(checkWorkItems(root).records, 3);
  // The graph still validates: a missing prerequisite fails the build.
  writeFileSync(join(root, config.records, 'F-002.md'), rec('F-002', '[F-008](../../BACKLOG.md#f-008) — gone'));
  assert.throws(() => renderLedger(root, config), /missing dependency F-008/);
});
test('F-057 review: the dependency line is placed under a differently spaced header, and never silently dropped', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const rec = (id, header, deps) =>
    `### ${id}\n\n**Title ${id}**\n\n${header}|:---:|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next.\n\n<details>\n\n| Field | Value |\n|---|---|\n${deps ? `| Depends on | ${deps} |\n` : ''}\n</details>\n\n---\n\n`;
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    rec('F-001', '|  Signal | Priority |Status | Effort  |\n', '[F-002](../../BACKLOG.md#f-002) — contract'),
  );
  writeFileSync(join(root, config.records, 'F-002.md'), rec('F-002', '| Signal | Priority | Status | Effort |\n'));
  writeFileSync(join(root, config.records, 'B-001.md'), rec('B-001', '| Signal | Priority | Status | Effort |\n'));
  const out = renderLedger(root, config);
  assert.match(out, /Effort {2}\|\n\|:---:\|---\|---\|---\|\n\| 🔴[^\n]*\n\n\*\*Depends on:\*\* \[F-002\]\(#f-002\)/);
  // A record with links but no summary table fails the build instead of losing its line.
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    rec('F-001', '| Signal | Priority | Status | Effort |\n', '[F-002](../../BACKLOG.md#f-002) — contract').replace(
      /\| Signal[^\n]*\n\|:---:[^\n]*\n\| 🔴[^\n]*\n/,
      '',
    ),
  );
  assert.throws(() => renderLedger(root, config), /F-00[12]: no summary table/);
});
test('F-058: agent hours with owner time apart; days and hours never added together; calibration in hours', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
    ),
  );
  const layoutPath = join(root, config.layout);
  const layout = JSON.parse(readFileSync(layoutPath, 'utf8'));
  layout.segments[0].text = layout.segments[0].text.replace(
    '# Work\n',
    '# Work\n\n<!-- totals:start -->\n<!-- totals:end -->\n',
  );
  writeFileSync(layoutPath, JSON.stringify(layout));
  const effort = (extra) => ({ size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-11', ...extra });
  const step = (n, status, extra) => ({ ...task(`F-001-T0${n}`), status, effort: effort(extra) });
  json(
    join(root, config.tasks, 'F-001-T01.json'),
    step(1, 'closed', { agentHours: 0, baselineAgentHours: 2, actualAgentHours: 0.75, actualSource: 'stated' }),
  );
  json(
    join(root, config.tasks, 'F-001-T02.json'),
    step(2, 'ready', { agentHours: 1.5, ownerHours: 0.5, baselineAgentHours: 1.5 }),
  );
  json(join(root, config.tasks, 'F-001-T03.json'), step(3, 'planned', { days: 1, baselineDays: 1 }));
  const planned = { ...config, featurePlans: true };
  const out = renderLedger(root, planned);
  assert.match(out, /\| F-001-T01 — One bounded change \| 2 h \| 0\.75 h \(stated\) \| 🟢 Small — 0 h \| Completed \|/);
  assert.match(
    out,
    /\| F-001-T02 — One bounded change \| 1\.5 h \| 0 h \| 🟢 Small — 1\.5 h \+ 0\.5 h owner \| Ready \|/,
  );
  assert.match(out, /\| F-001-T03 — One bounded change \| 1 day \| 0 days \| 🟢 Small — 1 day \| Planned \|/);
  assert.match(
    out,
    /\| \*\*Total\*\* \| 3\.5 h and 1 day \| 0\.75 h \(1 of 3 steps recorded\) \| 1\.5 h \+ 0\.5 h owner and 1 day \| 1 of 3 completed \|/,
  );
  assert.match(
    out,
    /\*\*Remaining effort:\*\* 1\.5 h \+ 0\.5 h owner and 1 day across 2 open steps of 1 feature\. 0\.75 h of actual effort/,
  );
  // Calibration compares like with like: 0.75 h against 2 h.
  assert.deepEqual(calibrate(taskCatalog(root, config).tasks).all, {
    n: 1,
    median: 0.38,
    min: 0.38,
    max: 0.38,
    note: 'too few samples',
  });
  // Validation: quarter hours; a closed step has no remaining hours; one actual unit per step.
  for (const [status, extra] of [
    ['ready', { agentHours: 0.1 }],
    ['ready', { agentHours: -1 }],
    ['closed', { agentHours: 1 }],
    ['closed', { ownerHours: 0.5 }],
    ['closed', { actualAgentHours: 1, actualDays: 1, actualSource: 'stated' }],
    ['closed', { actualAgentHours: 1 }],
    ['planned', { actualAgentHours: 1, actualSource: 'stated' }],
  ]) {
    json(join(root, config.tasks, 'F-001-T03.json'), step(3, status, extra));
    assert.throws(() => renderLedger(root, planned), /effort/, JSON.stringify(extra));
  }
});
test('F-058 review: hour steps are estimated, closed, warned about and calibrated in their own unit', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
    ),
  );
  const planned = { ...config, featurePlans: true };
  const effort = (extra) => ({
    size: 'small',
    estimate: '1 focused day',
    basis: 'Fixture',
    reviewed: '2026-11-11',
    ...extra,
  });
  const step = (n, status, extra) => ({ ...task(`F-001-T0${n}`), status, effort: effort(extra) });
  // A closed step in hours shows 0 h remaining, never its old estimate text.
  json(join(root, config.tasks, 'F-001-T01.json'), step(1, 'closed', { days: 0, baselineAgentHours: 1 }));
  // An owner-only step shows its owner time.
  json(join(root, config.tasks, 'F-001-T02.json'), step(2, 'ready', { ownerHours: 1, baselineAgentHours: 0.5 }));
  json(join(root, config.tasks, 'F-001-T03.json'), step(3, 'ready', { agentHours: 1, baselineAgentHours: 1 }));
  const out = renderLedger(root, planned);
  assert.match(out, /\| F-001-T01 — One bounded change \| 1 h \| 0 h \| 🟢 Small — 0 h \| Completed \|/);
  assert.match(out, /\| F-001-T02 — One bounded change \| 0\.5 h \| 0 h \| 🟢 Small — 1 h owner \| Ready \|/);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  // Steps in hours are not "without days"; only a step with no remaining estimate in its unit is.
  assert.deepEqual(checkWorkItems(root).withoutDays, ['F-001-T02']);
  // An actual in days on a step now in hours would vanish: refused.
  json(
    join(root, config.tasks, 'F-001-T03.json'),
    step(3, 'ready', { agentHours: 1, actualDays: 0.5, actualSource: 'stated' }),
  );
  assert.throws(() => renderLedger(root, planned), /effort/);
  // Calibration reports units apart, so day-era samples can be told from hour samples.
  const tasks = [
    step(4, 'closed', { days: 0, baselineDays: 1, actualDays: 0.1, actualSource: 'stated' }),
    step(5, 'closed', { agentHours: 0, baselineAgentHours: 1, actualAgentHours: 1, actualSource: 'stated' }),
  ];
  assert.deepEqual(Object.keys(calibrate(tasks).byUnit), ['days', 'hours']);
  assert.equal(calibrate(tasks).byUnit.hours.median, 1);
});
