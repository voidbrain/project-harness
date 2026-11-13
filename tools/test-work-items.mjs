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
  sizeOfHours,
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
// F-059: with feature plans every record has a step; the fixture bug gets a closed one.
function bugStep(root) {
  json(join(root, config.tasks, 'B-001-T01.json'), {
    ...task('B-001-T01'),
    parent: 'B-001',
    status: 'closed',
    effort: { size: 'small', estimate: 'done', basis: 'Fixture', reviewed: '2026-11-12', agentHours: 0 },
  });
  const record = join(root, config.records, 'B-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace('Bug', 'Bug\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>'),
  );
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
  assert.equal(renderLedger(root, config, false), before);
  writeFileSync(join(root, 'docs/BACKLOG.md'), renderLedger(root, config));
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
  writeFileSync(join(root, 'docs/BACKLOG.md'), renderLedger(root, config).replace('Derived', 'New recap'));
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
  assert.equal(renderLedger(root, config, false), original);
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
  assert.equal(renderLedger(root, config, false), original);
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
  bugStep(root);
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
  // F-063: Effort first, then Estimate, Actual, Remaining (owner's order).
  assert.match(rendered, /\| Effort \| Step \| Estimate \| Actual \| Remaining \| Status \|/);
  assert.match(
    rendered,
    /\| 🟢 Small \| (?:<a id="[^"]+"><\/a>)?F-001-T01 — [^|]*\| — \| 0 days \| 2–4 hours \| Ready \|/,
  );
  // Compact <details>: step basis and long prose stay in per-record/task files; ledger keeps link + metadata table.
  assert.ok(!rendered.includes('Known join; no external acceptance'));
  assert.match(rendered, /\[Full notes & evidence\]\(work\/records\/F-001\.md\)/);
  assert.match(rendered, /&lt;unsafe&gt; &#124; scope/);
  assert.ok(rendered.indexOf('F-001-T01') < rendered.indexOf('<details>', rendered.indexOf('F-001](#top)')));
  assert.doesNotMatch(rendered, /effort: size of the remaining agent time/);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), rendered);
  assert.equal(checkWorkItems(root).tasks, 2, 'the bug step and the feature step');
  assert.equal(renderLedger(root, planned), rendered);
  // F-059: a bug without a step fails the build like a feature.
  rmSync(join(root, config.tasks, 'B-001-T01.json'));
  assert.throws(() => renderLedger(root, planned), /Record needs an upfront task plan: B-001/);
  bugStep(root);
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
  assert.ok(
    mentioned.indexOf('**Feature steps**') <
      mentioned.indexOf('<details>\n<summary>', mentioned.indexOf('F-001](#top)')),
  );
});
test('F-053: numeric days and baselines total per feature and at the top of the ledger', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  bugStep(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
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
    /\| \*\*Total\*\* \| 2 days \(2 of 4 steps\) \| 0 days \(0 of 4 steps recorded\) \| 1\.75 days \(1 open step without an estimate\) \| 1 of 4 completed \|/,
  );
  assert.match(
    rendered,
    /<!-- totals:start -->\n\*\*Remaining effort:\*\* 1\.75 days across 3 open steps of 1 feature \(1 open step without an estimate\)\. Generated from the task files\.\n<!-- totals:end -->/,
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
  assert.match(plain, /\| 0\.25 days \(2 open steps without an estimate\) \| 1 of 4 completed \|/);
});
test('F-055: queue order lists records by priority first (including Blocked P1 above P2), then lane; id order stays available', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const rec = (id, priority, human = 'No', status = 'Open') =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| ${status === 'Blocked' ? '🟣' : '🔴'} | ${{ 1: '🔺', 2: '🔶', 3: '🔹' }[priority]} P${priority} | ${status} | 🟢 Small |\n\n${human === 'No' ? '💻' : '🧑'} **→ Human action required: ${human}**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`;
  writeFileSync(join(root, config.records, 'F-001.md'), rec('F-001', 3));
  writeFileSync(join(root, config.records, 'F-002.md'), rec('F-002', 1, 'Procedure'));
  writeFileSync(join(root, config.records, 'F-003.md'), rec('F-003', 1));
  writeFileSync(join(root, config.records, 'F-004.md'), rec('F-004', 1, 'No', 'Blocked'));
  writeFileSync(join(root, config.records, 'B-001.md'), rec('B-001', 2));
  const ids = (text) =>
    [...text.matchAll(/^### (?:<a id="[fb]-\d+"><\/a>)?(?:\[(?:✨|🐞) )?([BF]-\d{3})(?:\]\(#top\))?$/gm)].map(
      (m) => m[1],
    );
  assert.deepEqual(ids(renderLedger(root, config)), ['B-001', 'F-001', 'F-002', 'F-003', 'F-004']);
  assert.deepEqual(ids(renderLedger(root, { ...config, order: 'id' })), ['B-001', 'F-001', 'F-002', 'F-003', 'F-004']);
  // Priority first (P1 -> P2 -> P3), then lane (agent -> human -> blocked) within each priority.
  const queued = renderLedger(root, { ...config, order: 'queue' });
  assert.deepEqual(ids(queued), ['B-001', 'F-003', 'F-002', 'F-004', 'F-001']);
  assert.equal(renderLedger(root, { ...config, order: 'queue' }), queued, 'deterministic');
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: { ...config, order: 'queue' } }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), queued);
  assert.equal(checkWorkItems(root).records, 5);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: { ...config, order: 'priority' } }));
  assert.throws(() => checkWorkItems(root), /workItems.order/);
});
test('F-067: queue order lists an open prerequisite directly above the first record that waits on it', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const rec = (id, priority, deps = [], status = 'Open') =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | ${{ 1: '🔺', 2: '🔶', 3: '🔹' }[priority]} P${priority} | ${status} | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n${deps.length ? `| Depends on | ${deps.map((d) => `[${d}](../../BACKLOG.md#${d.toLowerCase()}) — outcome`).join('<br />')} |\n` : ''}\n</details>\n\n---\n\n`;
  const write = (id, ...rest) => writeFileSync(join(root, config.records, id + '.md'), rec(id, ...rest));
  const ids = (text) =>
    [...text.matchAll(/^### (?:<a id="[fb]-\d+"><\/a>)?(?:\[(?:✨|🐞) )?([BF]-\d{3})(?:\]\(#top\))?$/gm)].map(
      (m) => m[1],
    );
  const queued = () => ids(renderLedger(root, { ...config, order: 'queue' }));
  // F-001 (P1) waits on F-002 (P3), which waits on F-004 (P3); F-005 (P2) waits on F-002 too.
  write('F-001', 1, ['F-002']);
  write('F-002', 3, ['F-004']);
  write('F-003', 1);
  write('F-004', 3);
  write('F-005', 2, ['F-002']);
  write('F-006', 3);
  write('B-001', 2);
  // Priority order holds except that a prerequisite chain moves up, in dependency order, to just above its first
  // dependent; it is listed once, and records that wait on nothing keep their place. The fixture layout lists bugs
  // first: the order is per group.
  assert.deepEqual(queued(), ['B-001', 'F-003', 'F-004', 'F-002', 'F-001', 'F-005', 'F-006']);
  // A prerequisite that already precedes its dependents stays where its priority puts it.
  write('F-002', 1, ['F-004']);
  assert.deepEqual(queued(), ['B-001', 'F-003', 'F-004', 'F-002', 'F-001', 'F-005', 'F-006']);
  write('F-004', 1);
  assert.deepEqual(queued(), ['B-001', 'F-004', 'F-003', 'F-002', 'F-001', 'F-005', 'F-006']);
  // A lane inside one priority yields too: a P1 waiting on a human action precedes the P1 record it blocks.
  write('F-004', 3);
  write('F-002', 3);
  write('F-001', 1);
  write('F-005', 2);
  writeFileSync(
    join(root, config.records, 'F-006.md'),
    rec('F-006', 1).replace('💻 **→ Human action required: No**', '🧑 **→ Human action required: Decision**'),
  );
  write('F-003', 1, ['F-006']);
  assert.deepEqual(queued(), ['B-001', 'F-001', 'F-006', 'F-003', 'F-005', 'F-002', 'F-004']);
  const out = renderLedger(root, { ...config, order: 'queue' });
  assert.equal(renderLedger(root, { ...config, order: 'queue' }), out, 'deterministic');
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: { ...config, order: 'queue' } }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  assert.equal(checkWorkItems(root).records, 7);
  // Review: a prerequisite in another group (bugs and features are separate segments here) is not moved, so each
  // group keeps its priority order; neither an external nor a closed, archived prerequisite moves anything.
  write('B-001', 1);
  write('B-002', 2);
  write('B-003', 3);
  write('F-003', 1);
  write('F-006', 3);
  mkdirSync(join(root, 'docs/archive'), { recursive: true });
  writeFileSync(join(root, 'docs/archive/backlog-2026.md'), '# Archive\n\n' + rec('F-009', 3, [], 'Closed'));
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    rec('F-001', 1).replace(
      '| Field | Value |\n|---|---|\n',
      '| Field | Value |\n|---|---|\n| Depends on | [B-003](../../BACKLOG.md#b-003) — outcome<br />[F-009](../../archive/backlog-2026.md#f-009) — released<br />[org/repo:F-002](https://github.com/org/repo/blob/v1/docs/BACKLOG.md#f-002) — upstream |\n',
    ),
  );
  assert.deepEqual(queued(), ['B-001', 'B-002', 'B-003', 'F-003', 'F-001', 'F-005', 'F-002', 'F-004', 'F-006']);
  // With one group for bugs and features, the same bug moves up to its dependent, and an explicit Queue order on
  // the dependent does not put it above its prerequisite.
  const layout = JSON.parse(readFileSync(join(root, config.layout), 'utf8'));
  const at = layout.segments.findIndex((s) => s.records === 'B');
  layout.segments = layout.segments.filter((s) => s.records !== 'F' && s.records !== 'B');
  layout.segments.splice(at, 0, { records: 'all' });
  json(join(root, config.layout), layout);
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    readFileSync(join(root, config.records, 'F-001.md'), 'utf8').replace(
      '| Depends on |',
      '| Queue order | 1 — Owner-selected next |\n| Depends on |',
    ),
  );
  assert.deepEqual(queued().slice(0, 4), ['B-001', 'F-003', 'B-003', 'F-001']);
});
test('F-063: steps show a size from remaining agent hours, the latest estimate and no baseline suffix', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  bugStep(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
    ),
  );
  const effort = (extra) => ({ size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-12', ...extra });
  const write = (n, status, extra) =>
    json(join(root, config.tasks, `F-001-T0${n}.json`), { ...task(`F-001-T0${n}`), status, effort: effort(extra) });
  // Re-estimated down (the estimate shows the latest, the baseline stays for calibration only), re-estimated up with
  // owner time (owner hours never count toward the size), unchanged, and a closed step.
  write(1, 'planned', { agentHours: 0.75, baselineAgentHours: 1.5, estimateAgentHours: 0.75 });
  write(2, 'ready', { agentHours: 4.5, ownerHours: 6, baselineAgentHours: 1.5, estimateAgentHours: 5 });
  write(3, 'planned', { agentHours: 1, baselineAgentHours: 1 });
  write(4, 'closed', { agentHours: 0, baselineAgentHours: 1, actualAgentHours: 1, actualSource: 'stated' });
  // Re-estimated from days into hours with no hours baseline: baselineDays is history, never compared with hours.
  write(5, 'planned', { agentHours: 1, baselineDays: 2 });
  // Days without a baseline.
  write(6, 'planned', { days: 0.5 });
  const out = renderLedger(root, { ...config, featurePlans: true });
  assert.match(out, /\| Effort \| Step \| Estimate \| Actual \| Remaining \| Status \|/);
  assert.match(
    out,
    /\| 🟢 Small \| (?:<a id="[^"]+"><\/a>)?F-001-T01 — One bounded change \| 0\.75 h \| 0 h \| 0\.75 h \| Planned \|/,
  );
  assert.match(
    out,
    /\| 🔴 Large \| (?:<a id="[^"]+"><\/a>)?F-001-T02 — One bounded change \| 5 h \| 0 h \| 4\.5 h agent \+ 6 h owner \| Ready \|/,
  );
  assert.match(
    out,
    /\| 🟢 Small \| (?:<a id="[^"]+"><\/a>)?F-001-T03 — One bounded change \| 1 h \| 0 h \| 1 h \| Planned \|/,
  );
  assert.match(
    out,
    /\| — \| (?:<a id="[^"]+"><\/a>)?F-001-T04 — One bounded change \| 1 h \| 1 h \(stated\) \| 0 h \| Completed \|/,
  );
  assert.match(
    out,
    /\| 🟢 Small \| (?:<a id="[^"]+"><\/a>)?F-001-T05 — One bounded change \| — \| 0 h \| 1 h \| Planned \|/,
  );
  assert.match(
    out,
    /\| 🟢 Small \| (?:<a id="[^"]+"><\/a>)?F-001-T06 — One bounded change \| — \| 0 days \| 0\.5 days \| Planned \|/,
  );
  assert.doesNotMatch(out, /planned \d/);
  // Total: estimates summed (latest, else baseline); a record with an open step in days keeps its authored size.
  assert.match(
    out,
    /\| {2}\| \*\*Total\*\* \| 7\.75 h \(4 of 6 steps\) \| 1 h \(1 of 6 steps recorded\) \| 7\.25 h agent \+ 6 h owner and 0\.5 days \| 1 of 6 completed \|/,
  );
  // Sizes: up to 1 h Small, 4 h Medium, 8 h Large, more Very large.
  write(6, 'planned', { agentHours: 9, baselineAgentHours: 9 });
  write(5, 'closed', { agentHours: 0, baselineAgentHours: 1 });
  const hours = renderLedger(root, { ...config, featurePlans: true });
  assert.match(hours, /\| 🟣 Very large \| (?:<a id="[^"]+"><\/a>)?F-001-T06 /);
  assert.match(
    hours,
    /\| 🟣 Very large \| \*\*Total\*\* \| 17\.75 h \| 1 h \(1 of 6 steps recorded\) \| 15\.25 h agent \+ 6 h owner \| 2 of 6 completed \|/,
  );
  for (const [h, size] of [
    [0, '🟢 Small'],
    [1, '🟢 Small'],
    [1.25, '🟡 Medium'],
    [4, '🟡 Medium'],
    [4.25, '🔴 Large'],
    [8, '🔴 Large'],
    [8.25, '🟣 Very large'],
  ])
    assert.equal(sizeOfHours(h), size);
});

test('F-063 review: no zero unit in totals, a stale estimate is reported, the Total row of an all-closed record shows —', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  bugStep(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
    ),
  );
  const effort = (extra) => ({ size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-12', ...extra });
  const write = (n, status, extra) =>
    json(join(root, config.tasks, `F-001-T0${n}.json`), { ...task(`F-001-T0${n}`), status, effort: effort(extra) });
  // The reported defect: an hours step beside an open days step with nothing left printed "… and 0 days".
  write(1, 'ready', { agentHours: 1, ownerHours: 2, baselineAgentHours: 1 });
  write(2, 'implemented', { days: 0 });
  const planned = { ...config, featurePlans: true };
  const out = renderLedger(root, planned);
  assert.match(out, /\| \*\*Total\*\* \|[^\n]*\| 1 h agent \+ 2 h owner \| 0 of 2 completed \|/);
  assert.doesNotMatch(out, /and 0 days|0 h agent/);
  // Owner time alone reads as owner time, without a 0 h agent part.
  write(1, 'ready', { agentHours: 0, ownerHours: 2, baselineAgentHours: 1 });
  assert.match(renderLedger(root, planned), /\| \*\*Total\*\* \|[^\n]*\| 2 h owner \| 0 of 2 completed \|/);
  // Re-estimated up without estimateAgentHours: the column shows the baseline, and check reports the step.
  write(1, 'ready', { agentHours: 6, baselineAgentHours: 1 });
  json(join(root, '.harness.json'), { workItems: planned });
  writeFileSync(join(root, 'docs/BACKLOG.md'), renderLedger(root, planned));
  assert.deepEqual(checkWorkItems(root).staleEstimates, ['F-001-T01']);
  write(1, 'ready', { agentHours: 6, baselineAgentHours: 1, estimateAgentHours: 6 });
  writeFileSync(join(root, 'docs/BACKLOG.md'), renderLedger(root, planned));
  assert.equal(checkWorkItems(root).staleEstimates, undefined);
  // An all-closed record's Total row shows —, like its closed steps; the record keeps its authored size (B-017).
  assert.match(renderLedger(root, planned), /B-001\]\(#top\)[\s\S]*?\| — \| \*\*Total\*\* \|/);
});
test('B-017: an active record whose steps are all closed keeps its authored size, and queue order still builds', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  bugStep(root);
  json(join(root, config.tasks, 'F-001-T01.json'), {
    ...task(),
    status: 'ready',
    effort: { size: 'small', estimate: '1 h', basis: 'Fixture', reviewed: '2026-11-12', agentHours: 1 },
  });
  // B-001 stays active while its only step is closed (implemented, awaiting verification): the queue reads its size.
  const rec = (id, cue, status, effort) =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| ${cue} | 🔶 P2 | ${status} | ${effort} |\n\n💻 **→ Human action required: No**<br />Verify ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`;
  writeFileSync(join(root, config.records, 'B-001.md'), rec('B-001', '🟡', 'Implemented', '🟡 Medium'));
  writeFileSync(join(root, config.records, 'F-001.md'), rec('F-001', '🔴', 'Open', '🟢 Small'));
  const out = renderLedger(root, { ...config, featurePlans: true, order: 'queue' });
  assert.match(out, /\| 🟡 Implemented \| 🔶 P2 \| 🟡 Medium \|/);
  assert.match(out, /B-001\]\(#top\)[\s\S]*?\| — \| \*\*Total\*\* \|/);
});
test('F-059: one list for bugs and features in queue order, with Remaining and the human cue in the summary table', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const layoutPath = join(root, config.layout);
  json(layoutPath, { version: 1, segments: [{ text: '# Work\n\n## Work items\n\n' }, { records: 'all' }] });
  const rec = (id, priority, human = 'No') =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | ${{ 1: '🔺', 2: '🔶', 3: '🔹' }[priority]} P${priority} | Open | 🟢 Small |\n\n${human === 'No' ? '💻' : '🧑'} **→ Human action required: ${human}**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`;
  writeFileSync(join(root, config.records, 'F-001.md'), rec('F-001', 3));
  writeFileSync(join(root, config.records, 'F-002.md'), rec('F-002', 1, 'Procedure'));
  writeFileSync(join(root, config.records, 'B-001.md'), rec('B-001', 2));
  writeFileSync(join(root, config.records, 'B-002.md'), rec('B-002', 1));
  const effort = (extra) => ({ size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-12', ...extra });
  json(join(root, config.tasks, 'B-002-T01.json'), {
    ...task('B-002-T01'),
    parent: 'B-002',
    effort: effort({ agentHours: 1.5, ownerHours: 0.5, baselineAgentHours: 1.5 }),
  });
  json(join(root, config.tasks, 'B-002-T02.json'), {
    ...task('B-002-T02'),
    parent: 'B-002',
    status: 'closed',
    effort: effort({ agentHours: 0, baselineAgentHours: 1 }),
  });
  // Review: a record whose open steps all lack an estimate says so instead of 0.
  json(join(root, config.tasks, 'F-001-T01.json'), { ...task('F-001-T01'), effort: effort({}) });
  assert.match(renderLedger(root, config), /F-001\]\(#top\)[\s\S]*?\| 🟢 Small \| 1 unestimated \|/);
  const ids = (text) =>
    [...text.matchAll(/^### (?:<a id="[fb]-\d+"><\/a>)?(?:\[(?:✨|🐞) )?([BF]-\d{3})(?:\]\(#top\))?$/gm)].map(
      (m) => m[1],
    );
  // One list: priority first (P1 -> P2 -> P3), then lane within each priority.
  const queued = renderLedger(root, { ...config, order: 'queue' });
  assert.deepEqual(ids(queued), ['B-002', 'F-002', 'B-001', 'F-001']);
  assert.match(
    queued,
    /### <a id="b-002"><\/a>\[🐞 B-002\]\(#top\)[\s\S]*?\| Status \| Priority \| Effort \| Remaining \| Depends on \| Unlocks \| Procedures \| Decisions \|\n\|---\|---\|---\|---\|---\|---\|:---:\|:---:\|\n\| 🔴 Open \| 🔺 P1 \| 🟡 Medium \| 1\.5 h agent \+ 0\.5 h owner \| — \| — \| — \| — \|\n\n💻 \*\*→\*\* Next for B-002\./,
  );
  assert.match(
    queued,
    /### <a id="f-002"><\/a>\[✨ F-002\]\(#top\)[\s\S]*?\| 🟢 Small \| — \| — \| — \| 🧑‍🔧 \| — \|\n\n🧑 \*\*→\*\* Next for F-002\./,
  );
  assert.doesNotMatch(queued, /Human action required/);
  // Sources keep the authored form; the generated ledger checks, and the queue reads its cue from the table.
  assert.match(readFileSync(join(root, config.records, 'F-002.md'), 'utf8'), /Human action required: Procedure/);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: { ...config, order: 'queue' } }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), queued);
  assert.equal(checkWorkItems(root).records, 4);
  // A group cannot be listed twice.
  json(layoutPath, { version: 1, segments: [{ records: 'all' }, { records: 'B' }] });
  assert.throws(() => renderLedger(root, config), /Duplicate record group/);
});
test('F-068: a ready owner step marks its record in Procedures and Decisions, beside agent work', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  json(join(root, config.layout), { version: 1, segments: [{ text: '# Work\n\n' }, { records: 'all' }] });
  const rec = (id, priority, human = 'No') =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | ${{ 1: '🔺', 2: '🔶', 3: '🔹' }[priority]} P${priority} | Open | 🟢 Small |\n\n${human === 'No' ? '💻' : '🧑'} **→ Human action required: ${human}**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`;
  for (const [id, human] of [['F-001'], ['F-002'], ['F-003'], ['F-004', 'Decision'], ['F-005']])
    writeFileSync(join(root, config.records, id + '.md'), rec(id, 1, human));
  writeFileSync(join(root, config.records, 'B-001.md'), rec('B-001', 2));
  const step = (id, extra = {}, more = {}) =>
    json(join(root, config.tasks, id + '.json'), {
      ...task(id),
      parent: id.slice(0, 5),
      ...more,
      effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', agentHours: 0.25, ...extra },
    });
  // F-001: agent work is next, a decision is ready, a procedure still waits on that decision.
  step('F-001-T01');
  step('F-001-T02', { ownerHours: 0.25, ownerKind: 'decision' });
  step('F-001-T03', { ownerHours: 1, ownerKind: 'procedure' }, { dependsOn: ['F-001-T02'] });
  // F-002: one ready step asks for both. F-003: a closed owner step asks nothing; the step it unblocked does.
  step('F-002-T01', { ownerKind: 'both' });
  step('F-003-T01', { agentHours: 0, ownerKind: 'decision' }, { status: 'closed' });
  step('F-003-T02', { ownerKind: 'procedure' }, { dependsOn: ['F-003-T01'] });
  // F-005: its only owner step waits on an open step, so nothing waits on the owner yet.
  step('F-005-T01');
  step('F-005-T02', { ownerKind: 'both' }, { dependsOn: ['F-005-T01'] });
  // Review: an implemented owner step no longer waits on the owner; a verified prerequisite, here a step of another
  // record, satisfies the step behind it.
  step('B-001-T01', { ownerKind: 'decision' }, { status: 'implemented' });
  step('B-001-T02', {}, { status: 'verified' });
  step('F-005-T03', { ownerKind: 'procedure' }, { dependsOn: ['B-001-T02'] });
  const out = renderLedger(root, { ...config, order: 'queue' });
  const row = (id) =>
    new RegExp(`\\[(?:✨|🐞) ${id}\\]\\(#top\\)[\\s\\S]*?\\| (🧑‍🔧|—) \\| (🤔|—) \\|\\n\\n(🧑|💻) \\*\\*→\\*\\* `)
      .exec(out)
      .slice(1)
      .join(' ');
  assert.equal(row('F-001'), '— 🤔 💻');
  assert.equal(row('F-002'), '🧑‍🔧 🤔 💻');
  assert.equal(row('F-003'), '🧑‍🔧 — 💻');
  assert.equal(row('F-004'), '— 🤔 🧑');
  assert.equal(row('F-005'), '🧑‍🔧 — 💻');
  assert.equal(row('B-001'), '— — 💻');
  assert.match(out, /\| Unlocks \| Procedures \| Decisions \|\n/);
  // The authored line still decides the lane: a record an agent can advance stays among the agent candidates, above
  // the record whose own cue waits on a decision.
  const ids = [...out.matchAll(/^### <a id="[fb]-\d+"><\/a>\[(?:✨|🐞) ([BF]-\d{3})\]/gm)].map((m) => m[1]);
  assert.deepEqual(ids, ['F-001', 'F-002', 'F-003', 'F-005', 'F-004', 'B-001']);
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: { ...config, order: 'queue' } }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  assert.equal(checkWorkItems(root).records, 6);
  // Only the three kinds are accepted.
  step('F-002-T01', { ownerKind: 'approval' });
  assert.throws(() => renderLedger(root, { ...config, order: 'queue' }));
});
test('F-071: owner steps show 🧑‍🔧 / 🤔 in the steps table, linked to their page; the summary uses the same faces', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const planned = { ...config, featurePlans: true };
  rmSync(join(root, config.records, 'B-001.md'));
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  json(join(root, config.layout), { version: 1, segments: [{ text: '# Work\n\n' }, { records: 'all' }] });
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    `### F-001\n\n**Title F-001**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next for F-001.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`,
  );
  mkdirSync(join(root, 'docs/acceptance'), { recursive: true });
  writeFileSync(join(root, 'docs/acceptance/run.md'), '# Run\n');
  const step = (id, kind, more = {}) =>
    json(join(root, config.tasks, id + '.json'), {
      ...task(id),
      ...more,
      effort: {
        size: 'small',
        estimate: 'est',
        basis: 'Fixture',
        reviewed: '2026-11-13',
        agentHours: 0.25,
        ...(kind && { ownerKind: kind, ownerHours: 0.25 }),
      },
    });
  step('F-001-T01', 'procedure', { ownerLink: 'docs/acceptance/run.md#steps' });
  step('F-001-T02', 'decision');
  step('F-001-T03');
  const out = renderLedger(root, planned);
  assert.match(
    out,
    /\| Effort \| Step \| Estimate \| Actual \| Remaining \| Status \| Agent \| Procedure \| Decision \|\n\|---\|---\|---\|---\|---\|---\|:---:\|:---:\|:---:\|/,
  );
  assert.match(
    out,
    /F-001-T01 — One bounded change \|[^\n]*\| Ready \| 🤖 \| \[🧑‍🔧\]\(acceptance\/run\.md#steps\) \| — \|/,
  );
  assert.match(out, /F-001-T02 — One bounded change \|[^\n]*\| Ready \| 🤖 \| — \| 🤔 \|/);
  assert.match(out, /F-001-T03 — One bounded change \|[^\n]*\| Ready \| 🤖 \| — \| — \|/);
  assert.match(out, /\| Procedures \| Decisions \|\n[^\n]*\n\| 🔴 Open \|[^\n]*\| 🧑‍🔧 \| 🤔 \|/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  const report = checkWorkItems(root);
  assert.deepEqual(report.ownerStepsWithoutLink, ['F-001-T02']);
  // A link needs an owner step and an existing page; a step without owner work has no columns to fill.
  step('F-001-T03', undefined, { ownerLink: 'docs/acceptance/run.md' });
  assert.throws(() => renderLedger(root, planned), /ownerLink/);
  step('F-001-T03');
  step('F-001-T01', 'procedure', { ownerLink: 'docs/acceptance/missing.md' });
  assert.throws(() => renderLedger(root, planned), /ownerLink/);
  step('F-001-T01', 'procedure', { ownerLink: 'https://example.com/?a=b|c' });
  assert.throws(() => renderLedger(root, planned), /ownerLink/);
});
test('F-072: an owner step that still waits on earlier steps shows ⏳, not a face; 🤖 marks agent work', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const planned = { ...config, featurePlans: true };
  rmSync(join(root, config.records, 'B-001.md'));
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  json(join(root, config.layout), { version: 1, segments: [{ text: '# Work\n\n' }, { records: 'all' }] });
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    `### F-001\n\n**Title F-001**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next for F-001.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`,
  );
  const step = (id, effort, more = {}) =>
    json(join(root, config.tasks, id + '.json'), {
      ...task(id),
      ...more,
      effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', ...effort },
    });
  step('F-001-T01', { agentHours: 0.5 });
  step('F-001-T02', { agentHours: 0, ownerHours: 0.5, ownerKind: 'procedure' }, { dependsOn: ['F-001-T01'] });
  step('F-001-T03', { agentHours: 0, ownerHours: 0.25, ownerKind: 'decision' });
  const out = renderLedger(root, planned);
  // Agent work, then an owner procedure that waits on it: ⏳ and the step it waits on, not 🧑‍🔧.
  assert.match(out, /F-001-T01 — One bounded change \|[^\n]*\| Ready \| 🤖 \| — \| — \|/);
  assert.match(
    out,
    /F-001-T02 — One bounded change \|[^\n]*\| Ready · waits on \[F-001-T01\]\(#f-001-t01\) \| — \| ⏳ \| — \|/,
  );
  assert.match(out, /F-001-T03 — One bounded change \|[^\n]*\| Ready \| — \| — \| 🤔 \|/);
  // Only the decision is the owner's turn: the summary shows 🤔 alone, and only that step must have a page now.
  assert.match(out, /\| Procedures \| Decisions \|\n[^\n]*\n\| 🔴 Open \|[^\n]*\| — \| 🤔 \|/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  assert.deepEqual(checkWorkItems(root).ownerStepsWithoutLink, ['F-001-T03']);
  // Once the agent step is done, the procedure is the owner's turn.
  step('F-001-T01', { agentHours: 0 }, { status: 'closed' });
  assert.match(renderLedger(root, planned), /F-001-T02 — One bounded change \|[^\n]*\| Ready \| — \| 🧑‍🔧 \| — \|/);
});
test('B-019: queue order counts step-level dependencies: the prerequisite moves up and gets credit for what it unblocks', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const planned = { ...config, featurePlans: true, order: 'queue' };
  rmSync(join(root, config.records, 'B-001.md'));
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  json(join(root, config.layout), { version: 1, segments: [{ text: '# Work\n\n' }, { records: 'all' }] });
  const rec = (id) =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|:---:|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`;
  for (const id of ['F-001', 'F-002', 'F-003']) writeFileSync(join(root, config.records, id + '.md'), rec(id));
  const step = (id, more = {}) =>
    json(join(root, config.tasks, id + '.json'), {
      ...task(id),
      parent: id.slice(0, 5),
      ...more,
      effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', agentHours: 0.25 },
    });
  step('F-001-T01');
  step('F-002-T01', { dependsOn: ['F-003-T01'] });
  step('F-003-T01');
  const ids = (out) => [...out.matchAll(/^### <a id="f-\d+"><\/a>\[✨ (F-\d{3})\]/gm)].map((m) => m[1]);
  // F-003 unblocks a step of F-002, so it ranks first and is never below F-002; F-002 keeps its lane.
  assert.deepEqual(ids(renderLedger(root, planned)), ['F-003', 'F-001', 'F-002']);
  // Once the prerequisite step is closed, nothing waits and ID order returns.
  step('F-003-T01', { status: 'closed' });
  json(join(root, config.tasks, 'F-003-T02.json'), {
    ...task('F-003-T02'),
    parent: 'F-003',
    effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', agentHours: 0.25 },
  });
  json(join(root, config.tasks, 'F-003-T01.json'), {
    ...task('F-003-T01'),
    parent: 'F-003',
    status: 'closed',
    effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', agentHours: 0 },
  });
  assert.deepEqual(ids(renderLedger(root, planned)), ['F-001', 'F-002', 'F-003']);
});

test('F-073: the summary has an Agent cell, and check:work lists steps with more than one actor', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const planned = { ...config, featurePlans: true };
  rmSync(join(root, config.records, 'B-001.md'));
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  json(join(root, config.layout), { version: 1, segments: [{ text: '# Work\n\n' }, { records: 'all' }] });
  const rec = (id) =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`;
  for (const id of ['F-001', 'F-002', 'F-003']) writeFileSync(join(root, config.records, id + '.md'), rec(id));
  const step = (id, effort, more = {}) =>
    json(join(root, config.tasks, id + '.json'), {
      ...task(id),
      parent: id.slice(0, 5),
      ...more,
      effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', ...effort },
    });
  // F-001: agent work ready now. F-002: the owner decides first; the agent step waits on it. F-003: owner only, plus a
  // closed agent step; and one mixed step (agent hours on an owner step).
  step('F-001-T01', { agentHours: 0.5 });
  step('F-002-T01', { agentHours: 0, ownerHours: 0.25, ownerKind: 'decision' });
  step('F-002-T02', { agentHours: 0.5 }, { dependsOn: ['F-002-T01'] });
  step('F-003-T01', { agentHours: 0 }, { status: 'closed' });
  step('F-003-T02', { agentHours: 0.25, ownerHours: 0.5, ownerKind: 'procedure' });
  const out = renderLedger(root, planned);
  const cells = (id) =>
    new RegExp(
      `id="${id.toLowerCase()}"[\\s\\S]*?\\| Agent \\| Procedures \\| Decisions \\|\\n[^\\n]*\\n\\|[^\\n]*\\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\|\\n`,
    )
      .exec(out)
      .slice(1)
      .join(' ');
  assert.equal(cells('F-001'), '🤖 — —');
  assert.equal(cells('F-002'), '⏳ — 🤔');
  assert.equal(cells('F-003'), '🤖 🧑‍🔧 —'); // the unsplit step still has agent work
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  const report = checkWorkItems(root);
  assert.deepEqual(report.mixedSteps, ['F-003-T02']);
});

test('F-074: steps are ordered by what can move, each has an anchor, and waits on links to it', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const planned = { ...config, featurePlans: true };
  rmSync(join(root, config.records, 'B-001.md'));
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  json(join(root, config.layout), { version: 1, segments: [{ text: '# Work\n\n' }, { records: 'all' }] });
  const rec = (id) =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|:---:|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n\n</details>\n\n---\n\n`;
  writeFileSync(join(root, config.records, 'F-001.md'), rec('F-001'));
  writeFileSync(join(root, config.records, 'F-002.md'), rec('F-002'));
  const step = (id, more = {}, hours = 0.25) =>
    json(join(root, config.tasks, id + '.json'), {
      ...task(id),
      parent: id.slice(0, 5),
      ...more,
      effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', agentHours: hours },
    });
  // F-001: T01 done; T02 waits on T04; T03 waits on T02; T04 can start; T05 waits on a step of F-002.
  step('F-001-T01', { status: 'closed' }, 0);
  step('F-001-T02', { dependsOn: ['F-001-T04'] });
  step('F-001-T03', { dependsOn: ['F-001-T02'] });
  step('F-001-T04', { dependsOn: ['F-001-T01'] }); // a finished prerequisite does not hold it below finished steps
  step('F-001-T05', { dependsOn: ['F-002-T01'] });
  step('F-002-T01');
  const out = renderLedger(root, planned);
  const order = [...out.matchAll(/^\| [^|]+ \| <a id="(f-001-t\d+)"><\/a>F-001-T\d+ — /gm)].map((m) => m[1]);
  // What can move now, then waiting steps with each prerequisite above what waits on it, then finished steps.
  assert.deepEqual(order, ['f-001-t04', 'f-001-t02', 'f-001-t03', 'f-001-t05', 'f-001-t01']);
  assert.match(out, /F-001-T02 — [^\n]*\| Ready · waits on \[F-001-T04\]\(#f-001-t04\) \|/);
  assert.match(out, /F-001-T05 — [^\n]*\| Ready · waits on \[F-002-T01\]\(#f-002-t01\) \|/);
  // Depends on / Unlocks name the step and link to its row.
  assert.match(out, /id="f-001"[\s\S]*?\| 🔴 Open \|[^\n]*\[F-002-T01\]\(#f-002-t01\)/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  assert.equal(checkWorkItems(root).records, 2);
});

test('F-071: a step may wait on a step of another record; Depends on and Unlocks name the step, not the whole record', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const planned = { ...config, featurePlans: true };
  rmSync(join(root, config.records, 'B-001.md'));
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  json(join(root, config.layout), { version: 1, segments: [{ text: '# Work\n\n' }, { records: 'all' }] });
  const rec = (id, deps) =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|:---:|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n💻 **→ Human action required: No**<br />Next for ${id}.\n\n<details>\n\n| Field | Value |\n|---|---|\n${deps ? `| Depends on | ${deps} |\n` : ''}\n</details>\n\n---\n\n`;
  writeFileSync(join(root, config.records, 'F-001.md'), rec('F-001'));
  writeFileSync(join(root, config.records, 'F-002.md'), rec('F-002'));
  writeFileSync(join(root, config.records, 'F-003.md'), rec('F-003', '[F-001](../../BACKLOG.md#f-001) — all of it'));
  const step = (id, more = {}) =>
    json(join(root, config.tasks, id + '.json'), {
      ...task(id),
      parent: id.slice(0, 5),
      ...more,
      effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', agentHours: 0.25 },
    });
  step('F-001-T01');
  step('F-001-T02');
  step('F-002-T01', { dependsOn: ['F-001-T02'] });
  step('F-002-T02');
  step('F-003-T01');
  let out = renderLedger(root, planned);
  const summary = (id) => new RegExp(`id="${id.toLowerCase()}"[\\s\\S]*?\\n\\| 🔴 Open \\|([^\\n]*)`).exec(out)[1];
  assert.match(summary('F-002'), /\[F-001-T02\]\(#f-001-t02\)/);
  assert.match(summary('F-001'), /\[F-002-T01\]\(#f-002-t01\)/);
  assert.match(summary('F-001'), /\[F-003\]\(#f-003\)/);
  assert.match(out, /F-002-T01 — One bounded change \|[^\n]*\| Ready · waits on \[F-001-T02\]\(#f-001-t02\) \|/);
  assert.match(out, /F-002-T02 — One bounded change \|[^\n]*\| Ready \|/);
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  assert.deepEqual(checkWorkItems(root).recordLevelDependencies, ['F-003 → F-001']);
  // Once the prerequisite step is done, nothing waits.
  step('F-001-T02', { status: 'closed', effort: undefined });
  json(join(root, config.tasks, 'F-001-T02.json'), {
    ...task('F-001-T02'),
    status: 'closed',
    effort: { size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-13', agentHours: 0 },
  });
  out = renderLedger(root, planned);
  assert.doesNotMatch(out, /waits on F-001-T02/);
  assert.doesNotMatch(out, /\[F-001-T02\]\(#f-001-t02\)/);
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
test('F-060: calibration reports bugs and features apart and judges each kind on its own', () => {
  const step = (id, actual) => ({
    ...task(id),
    parent: id.slice(0, 5),
    status: 'closed',
    effort: {
      size: 'small',
      estimate: '0 remaining',
      basis: 'Fixture',
      reviewed: '2026-11-12',
      agentHours: 0,
      baselineAgentHours: 1,
      actualAgentHours: actual,
      actualSource: 'stated',
    },
  });
  const bugs = [1, 2, 3, 4, 5].map((n) => step(`B-001-T0${n}`, 2));
  const features = [1, 2, 3, 4, 5, 6].map((n) => step(`F-001-T0${n}`, 1));
  // Pooled median 1 hides the bugs' 2x drift; the bug group alone is due.
  const r = calibrate([...bugs, ...features]);
  assert.equal(r.all.median, 1);
  assert.deepEqual(Object.keys(r.byKind), ['bug', 'feature']);
  assert.deepEqual(r.byKind.bug, { n: 5, median: 2, min: 2, max: 2 });
  assert.equal(r.due, true);
  assert.deepEqual(r.reasons, ['bug steps: median actual/baseline 2 over 5 is outside 0.67–1.5']);
  // One kind only: the pooled reason alone, never the same reason twice.
  assert.equal(calibrate(bugs).reasons.length, 1);
  // Both kinds drifting: the pooled reason, then one per kind.
  const slowFeatures = features.map((t) => ({ ...t, effort: { ...t.effort, actualAgentHours: 2 } }));
  assert.equal(calibrate([...bugs, ...slowFeatures]).reasons.length, 3);
  // Estimation off: still reported by kind, never due.
  const off = calibrate([...bugs, ...features], false);
  assert.equal(off.due, false);
  assert.equal(off.byKind.bug.n, 5);
  // Too few samples in a kind never triggers on its own.
  assert.equal(calibrate([...bugs.slice(0, 4), ...features]).due, false);
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
test('compact details: rendered ledger keeps link and metadata table, omits prose and step-estimate basis', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  bugStep(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n<details>\n<summary>Evidence</summary>\n\n**Next action / closure evidence:** long prose\n\n| Step | Scope |\n|---|---|\n| T01 | Snapshot |\n\n| Field | Value |\n|---|---|\n| Impact | Low |\n\n</details>',
    ),
  );
  json(join(root, config.tasks, 'F-001-T01.json'), {
    ...task(),
    effort: { size: 'small', estimate: 'a day', basis: 'Basis text', reviewed: '2026-11-11' },
  });
  const out = renderLedger(root, { ...config, featurePlans: true });
  assert.match(
    out,
    /<details>\n<summary>Evidence<\/summary>\n\n\[Full notes & evidence\]\(work\/records\/F-001\.md\)\n\n\| Field \| Value \|\n\|---\|---\|\n\| Impact \| Low \|\n\n<\/details>/,
  );
  assert.doesNotMatch(out, /long prose|\*\*Step estimates\*\*|Basis text/);
});
test('F-056: the steps table shows baseline, actual (final or so far) and remaining; totals add actual effort', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  bugStep(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
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
    /\| — \| (?:<a id="[^"]+"><\/a>)?F-001-T01 — One bounded change \| 1 day \| 1\.5 days \(measured\) \| 0 days \| Completed \|/,
  );
  assert.match(
    out,
    /\| 🟢 Small \| (?:<a id="[^"]+"><\/a>)?F-001-T02 — One bounded change \| 1 day \| 0\.25 days so far \(stated\) \| 0\.5 days \| Ready \|/,
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
  // Closed archived dependencies (F-003) are omitted from the summary Depends on cell while active/external remain.
  assert.match(
    out,
    /\| Status \| Priority \| Effort \| Remaining \| Depends on \| Unlocks \| Procedures \| Decisions \|\n\|---\|---\|---\|---\|---\|---\|:---:\|:---:\|\n\| 🔴 Open \| 🔶 P2 \| 🟢 Small \| — \| \[F-002\]\(#f-002\), \[org\/repo:F-009\]\(https:\/\/github\.com\/org\/repo\/blob\/v1\/docs\/BACKLOG\.md#f-009\) \| — \| — \| — \|\n\n💻 \*\*→\*\* Next for F-001\./,
  );
  assert.match(out, /### <a id="f-002"><\/a>\[✨ F-002\]\(#top\)[\s\S]*?\| — \| \[F-001\]\(#f-001\) \| — \| — \|/);
  // A record with neither shows — in both cells.
  assert.match(out.slice(out.indexOf('B-001](#top)'), out.indexOf('F-001](#top)')), /\| — \| — \| — \| — \| — \|/);
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
  assert.match(
    out,
    /\| Status \| Priority \| Effort \| Remaining \|[^\n]*\n\|---\|---\|---\|---\|[^\n]*\n\| 🔴 Open[^\n]*\[F-002\]\(#f-002\)/,
  );
  // A record with links but no summary table fails the build instead of losing its line.
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    rec('F-001', '| Signal | Priority | Status | Effort |\n', '[F-002](../../BACKLOG.md#f-002) — contract').replace(
      /\| Signal[^\n]*\n\|:---:[^\n]*\n\| 🔴[^\n]*\n/,
      '',
    ),
  );
  assert.throws(() => renderLedger(root, config), /F-00[12]: no summary table to place its Depends on/);
});
test('F-058: agent hours with owner time apart; days and hours never added together; calibration in hours', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  bugStep(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
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
  assert.match(
    out,
    /\| — \| (?:<a id="[^"]+"><\/a>)?F-001-T01 — One bounded change \| 2 h \| 0\.75 h \(stated\) \| 0 h \| Completed \|/,
  );
  assert.match(
    out,
    /\| 🟡 Medium \| (?:<a id="[^"]+"><\/a>)?F-001-T02 — One bounded change \| 1\.5 h \| 0 h \| 1\.5 h agent \+ 0\.5 h owner \| Ready \|/,
  );
  assert.match(
    out,
    /\| 🟢 Small \| (?:<a id="[^"]+"><\/a>)?F-001-T03 — One bounded change \| 1 day \| 0 days \| 1 day \| Planned \|/,
  );
  assert.match(
    out,
    /\| {2}\| \*\*Total\*\* \| 3\.5 h and 1 day \| 0\.75 h \(1 of 3 steps recorded\) \| 1\.5 h agent \+ 0\.5 h owner and 1 day \| 1 of 3 completed \|/,
  );
  assert.match(
    out,
    /\*\*Remaining effort:\*\* 1\.5 h agent \+ 0\.5 h owner and 1 day across 2 open steps of 1 feature\. 0\.75 h of actual effort/,
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
  bugStep(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
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
  // A step in hours with only a baseline has no remaining estimate.
  json(join(root, config.tasks, 'F-001-T04.json'), step(4, 'planned', { baselineAgentHours: 1 }));
  const out = renderLedger(root, planned);
  assert.match(
    out,
    /\| — \| (?:<a id="[^"]+"><\/a>)?F-001-T01 — One bounded change \| 1 h \| 0 h \| 0 h \| Completed \|/,
  );
  assert.match(
    out,
    /\| 🟢 Small \| (?:<a id="[^"]+"><\/a>)?F-001-T02 — One bounded change \| 0\.5 h \| 0 h \| 1 h owner \| Ready \|/,
  );
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  writeFileSync(join(root, 'docs/BACKLOG.md'), out);
  // Steps in hours are not "without days"; owner time is an estimate; only a step with no remaining estimate in its
  // unit is listed. (The first version of this test expected the owner-only step; owner hours are an estimate.)
  assert.deepEqual(checkWorkItems(root).withoutDays, ['F-001-T04']);
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

test('F-066: the header segment renders the newest reconciliation entry; bad entries and old history are handled', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  // A git history so same-day entries can be ordered by ancestry.
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  git('init', '-q');
  git('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-q', '--allow-empty', '-m', 'one');
  const older = git('rev-parse', '--short', 'HEAD');
  git('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-q', '--allow-empty', '-m', 'two');
  const newer = git('rev-parse', '--short', 'HEAD');
  mkdirSync(join(root, 'docs/archive'), { recursive: true });
  const log = join(root, 'docs/archive/reconciliation-2026.md');
  writeFileSync(
    log,
    `# Log\n\n- Current work ledger, reviewed 1 November 2026 against main \`0000000\`. Old history, ignored.\n\n## 2026-11-10 — main \`${older}\`\n\nPR #1 passed CI.\n\n## 2026-11-12 — main \`${newer}\`\n\nPRs #2 and #3 passed CI; F-001 closed.\n\nA second paragraph that is not part of the header.\n\n## 2026-11-12 — main \`${older}\`\n\nPR #2 passed CI (an append that merged after the newer one).\n`,
  );
  const layoutPath = join(root, config.layout);
  const layout = JSON.parse(readFileSync(layoutPath, 'utf8'));
  layout.segments = [{ text: '# Work\n\n' }, { header: 'docs/archive' }, ...layout.segments.slice(1)];
  writeFileSync(layoutPath, JSON.stringify(layout));
  const out = renderLedger(root, config);
  assert.match(
    out,
    new RegExp(
      `^# Work\\n\\nCurrent work ledger, reviewed 12 November 2026 against main \`${newer}\`\\. PRs #2 and #3 passed CI; F-001 closed\\.\\n`,
    ),
    'the newest day wins; among same-day entries the descendant wins whatever the file order',
  );
  assert.doesNotMatch(out, /second paragraph|Old history/);
  // check-freshness reads the sha from this line.
  assert.match(
    out.split('\n').find((l) => l.startsWith('Current work ledger')),
    /against main `[0-9a-f]{7,40}`/,
  );
  // A wrapped paragraph reads as one line, CRLF files read as LF, and an entry inside a fenced example is not one.
  writeFileSync(
    log,
    `## 2026-11-12 — main \`${newer}\`\r\n\r\nPRs #4\r\nand #5 passed CI.\r\n\r\n\`\`\`\r\n## 2026-11-13 — main \`${newer}\`\r\n\r\nAn example entry.\r\n\`\`\`\r\n`,
  );
  assert.match(
    renderLedger(root, config),
    /reviewed 12 November 2026 against main `[0-9a-f]+`\. PRs #4 and #5 passed CI\.\n/,
  );
  // A first paragraph over 300 characters, an invalid date, and a log without any entry are refused.
  writeFileSync(log, `## 2026-11-12 — main \`${newer}\`\n\n${'x'.repeat(301)}\n`);
  assert.throws(() => renderLedger(root, config), /300 characters/);
  writeFileSync(log, `## 2026-02-30 — main \`${newer}\`\n\nShort.\n`);
  assert.throws(() => renderLedger(root, config), /invalid date/);
  writeFileSync(
    log,
    '# Log\n\n- Current work ledger, reviewed 1 November 2026 against main `0000000`. Only old history.\n',
  );
  assert.throws(() => renderLedger(root, config), /No reconciliation entry/);
});

test('F-066: step PRs and reviews come from the task files; "Next: from tasks." names the next open step', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  const record = (id, line) =>
    `### ${id}\n\n**Title ${id}**\n\n| Signal | Priority | Status | Effort |\n|:---:|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n${line}\n\n<details>\n\n| Field | Value |\n|---|---|\n| PR / evidence | Authored evidence. |\n\n</details>\n\n---\n\n`;
  writeFileSync(
    join(root, config.records, 'F-001.md'),
    record('F-001', '💻 **→ Human action required: No**<br />Next: from tasks.'),
  );
  writeFileSync(
    join(root, config.records, 'B-001.md'),
    record('B-001', '🧑 **→ Human action required: Decision**<br />Owner picks A or B.'),
  );
  const planned = { ...config, featurePlans: true, repository: 'org/repo' };
  const effort = (extra) => ({ size: 'small', estimate: 'est', basis: 'Fixture', reviewed: '2026-11-12', ...extra });
  const step = (id, status, extra = {}) => ({
    ...task(id),
    parent: id.slice(0, 5),
    status,
    effort: effort({ agentHours: status === 'closed' ? 0 : 1, baselineAgentHours: 1 }),
    ...extra,
  });
  json(
    join(root, config.tasks, 'F-001-T01.json'),
    step('F-001-T01', 'closed', {
      prs: [{ pr: 12, note: 'implementation' }, { pr: 15 }],
      review: 'design-reviewer, no blocker',
    }),
  );
  json(join(root, config.tasks, 'F-001-T02.json'), step('F-001-T02', 'planned', { dependsOn: ['F-001-T03'] }));
  json(join(root, config.tasks, 'F-001-T03.json'), step('F-001-T03', 'ready', { prs: [{ pr: 20 }] }));
  json(join(root, config.tasks, 'B-001-T01.json'), step('B-001-T01', 'ready'));
  const out = renderLedger(root, planned);
  // Next action: T02 is first by id but waits on T03, so T03 is next; the cue kind stays authored.
  assert.match(out, /F-001\]\(#top\)[\s\S]*?💻 \*\*→\*\* Next: F-001-T03 — One bounded change \(Ready\)\./);
  assert.match(out, /B-001\]\(#top\)[\s\S]*?🧑 \*\*→\*\* Owner picks A or B\./, 'a 🧑 sentence is never generated');
  // Steps table: a PRs column with links; a step without PRs shows —.
  assert.match(
    out,
    /\| Effort \| Step \| Estimate \| Actual \| Remaining \| Status \| PRs \|\n\|---\|---\|---\|---\|---\|---\|---\|\n(?:\|[^\n]*\n)*?\|[^\n]*F-001-T02[^\n]*\| Planned · waits on \[F-001-T03\]\(#f-001-t03\) \| — \|\n\|[^\n]*F-001-T01[^\n]*\| Completed \| \[PR #12\]\(https:\/\/github\.com\/org\/repo\/pull\/12\) implementation; \[PR #15\]\(https:\/\/github\.com\/org\/repo\/pull\/15\) \|\n/,
  );
  assert.match(out, /\| \*\*Total\*\* \|[^\n]*\| 1 of 3 completed \| \|\n/, 'the Total row keeps the table width');
  // PR / evidence cell: the step evidence leads the authored text; B-001 has none and keeps its cell.
  assert.match(
    out,
    /F-001\]\(#top\)[\s\S]*?\| PR \/ evidence \| Steps: F-001-T01: \[PR #12\][^\n]*; step review: design-reviewer, no blocker · F-001-T03: \[PR #20\]\(https:\/\/github\.com\/org\/repo\/pull\/20\)\. Authored evidence\. \|/,
  );
  assert.match(out, /B-001\]\(#top\)[\s\S]*?\| PR \/ evidence \| Authored evidence\. \|/);
  assert.doesNotMatch(
    out.slice(out.indexOf('B-001](#top)'), out.indexOf('F-001](#top)')),
    /\| PRs \|/,
    'no PRs column without step PRs',
  );
  // Without a repository the PRs are plain text.
  assert.match(
    renderLedger(root, { ...planned, repository: undefined }),
    /\| Completed \| PR #12 implementation; PR #15 \|/,
  );
  // All steps closed: the sentence says so.
  for (const id of ['F-001-T02', 'F-001-T03']) json(join(root, config.tasks, `${id}.json`), step(id, 'closed'));
  assert.match(renderLedger(root, planned), /💻 \*\*→\*\* Next: all steps closed; verify and close the record\./);
  // Invalid evidence is refused.
  for (const bad of [
    { prs: [{ pr: 0 }] },
    { prs: [{ pr: 1, note: '' }] },
    { prs: [{ pr: 1 }, { pr: 1 }] },
    { prs: [{ pr: 1, url: 'x' }] },
    { prs: 'PR #1' },
    { review: '' },
  ]) {
    json(join(root, config.tasks, 'B-001-T01.json'), step('B-001-T01', 'ready', bad));
    assert.throws(() => renderLedger(root, planned), /Invalid (prs|review)/);
  }
  json(join(root, config.tasks, 'B-001-T01.json'), step('B-001-T01', 'ready'));
  // Record-level labels are refused in step evidence, and step evidence needs feature plans.
  for (const bad of [
    { prs: [{ pr: 1, note: 'Test: covered' }] },
    { review: 'Review: fine' },
    { review: 'done (No review: small)' },
  ]) {
    json(join(root, config.tasks, 'B-001-T01.json'), step('B-001-T01', 'ready', bad));
    assert.throws(() => renderLedger(root, planned), /record-level labels/);
  }
  json(join(root, config.tasks, 'B-001-T01.json'), step('B-001-T01', 'ready', { prs: [{ pr: 1 }] }));
  assert.throws(() => renderLedger(root, config), /need workItems.featurePlans/);
  json(join(root, config.tasks, 'B-001-T01.json'), step('B-001-T01', 'ready'));
  for (const id of ['F-001-T01', 'F-001-T02', 'F-001-T03'])
    json(join(root, config.tasks, `${id}.json`), step(id, 'closed'));
  assert.throws(() => renderLedger(root, config), /"Next: from tasks\." needs workItems\.featurePlans/);
  assert.throws(() => renderLedger(root, { ...planned, repository: 'not a repo' }), /repository/);
});

test('F-069: checkWorkItems warns when a non-closed record has all steps closed', (t) => {
  const root = fixture(t);
  migrateLedger(root, config);
  profiles(root);
  bugStep(root);
  const record = join(root, config.records, 'F-001.md');
  writeFileSync(
    record,
    readFileSync(record, 'utf8').replace(
      'Feature',
      'Feature\n\n| Signal | Priority | Status | Effort |\n|---|---|---|---|\n| 🔴 | 🔶 P2 | Open | 🟢 Small |\n\n<details>\n<summary>Evidence</summary>\n\nx\n\n</details>',
    ),
  );
  const planned = { ...config, featurePlans: true };
  writeFileSync(join(root, '.harness.json'), JSON.stringify({ workItems: planned }));
  json(join(root, config.tasks, 'F-001-T01.json'), {
    ...task('F-001-T01'),
    status: 'closed',
    effort: {
      size: 'small',
      estimate: '0.25 h',
      agentHours: 0,
      baselineAgentHours: 0.25,
      basis: 'test',
      reviewed: '2026-11-13',
    },
  });
  writeFileSync(join(root, 'docs/BACKLOG.md'), renderLedger(root, planned));
  assert.deepEqual(checkWorkItems(root).allStepsClosed, ['F-001']);
});
