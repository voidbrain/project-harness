import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
  statSync,
  mkdirSync,
  symlinkSync,
  realpathSync,
  chmodSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { main, validateUsage } from '../core/tools/work-usage.mjs';
import { validateAllowance } from '../core/tools/work-usage.mjs';
import { collectCodexRateLimits } from '../core/tools/work-usage.mjs';
import { readdirSync } from 'node:fs';
const event = {
  version: 1,
  kind: 'delta',
  source: 'fixture',
  eventId: 'request-1',
  activity: 'coding',
  provider: 'fixture',
  model: 'fixture-v1',
  inputTokens: 100,
  outputTokens: 20,
  cacheReadTokens: 70,
  cacheWriteTokens: 10,
  reasoningTokens: 5,
};
function fixture() {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'usage-fixture-'))),
    repo = join(root, 'repo'),
    store = join(root, 'private'),
    file = join(root, 'source.json');
  mkdirSync(repo);
  const run = (...args) => main([...args, '--store=' + store], repo);
  const start = (item = 'F-001') =>
    run('start', '--repository=neutral/repo', '--item=' + item, '--agent=fixture', '--activity=coding').job;
  return { root, repo, store, file, run, start, close: () => rmSync(root, { recursive: true, force: true }) };
}
test('job, actual event import, deduplication, activity/model report and unknown source coverage meet at the private ledger', () => {
  const f = fixture();
  try {
    const job = f.start();
    assert.equal(f.run('report').complete, false);
    writeFileSync(f.file, JSON.stringify(event));
    assert.equal(f.run('import', '--job=' + job, '--file=' + f.file).imported, true);
    assert.equal(f.run('import', '--job=' + job, '--file=' + f.file).imported, false);
    const r = f.run('report', '--item=F-001');
    assert.equal(r.totals.inputTokens.known, 100);
    assert.equal(r.byActivity.coding.outputTokens.known, 20);
    assert.equal(r.totals.cacheReadTokens.known, 70);
    assert.equal(r.complete, false);
    f.run('finish', '--job=' + job, '--coverage=complete', '--outcome=done');
    assert.equal(f.run('report').complete, true);
    assert.equal(statSync(f.store).mode & 0o777, 0o700);
  } finally {
    f.close();
  }
});
test('cross-job source replay cannot count the same provider event twice; separate retry IDs remain counted', () => {
  const f = fixture();
  try {
    const a = f.start(),
      b = f.start('F-002');
    writeFileSync(f.file, JSON.stringify(event));
    f.run('import', '--job=' + a, '--file=' + f.file);
    assert.throws(() => f.run('import', '--job=' + b, '--file=' + f.file), /already assigned/);
    writeFileSync(f.file, JSON.stringify({ ...event, eventId: 'request-2' }));
    f.run('import', '--job=' + b, '--file=' + f.file);
    assert.equal(f.run('report').totals.outputTokens.known, 40);
  } finally {
    f.close();
  }
});
test('unknowns and shared work remain explicit, and annotations never synthesize token counts', () => {
  const f = fixture();
  try {
    const a = f.start('unallocated');
    f.run('phase', '--job=' + a, '--activity=review');
    writeFileSync(
      f.file,
      JSON.stringify({
        ...event,
        inputTokens: null,
        cacheReadTokens: null,
        cacheWriteTokens: null,
        activity: 'unallocated',
      }),
    );
    f.run('import', '--job=' + a, '--file=' + f.file);
    const r = f.run('report');
    assert.equal(r.totals.inputTokens.missing, 1);
    assert.equal(r.byActivity.review.outputTokens.known, null);
    assert.equal(r.byActivity.unallocated.outputTokens.known, 20);
    assert.equal(r.complete, false);
  } finally {
    f.close();
  }
});
test('strict metadata rejects transcripts, cumulative usage, invalid subsets and non-private stores', () => {
  assert.throws(() => validateUsage({ ...event, prompt: 'private' }));
  assert.throws(() => validateUsage({ ...event, kind: 'cumulative' }));
  assert.throws(() => validateUsage({ ...event, reasoningTokens: 21 }));
  assert.throws(() => validateUsage({ ...event, cacheReadTokens: 99 }));
  const f = fixture();
  try {
    assert.throws(() => main(['report', '--store=' + f.repo], f.repo), /outside/);
    const target = join(f.root, 'target');
    mkdirSync(target, { mode: 0o700 });
    symlinkSync(target, f.store);
    assert.throws(() => f.run('report'), /Symlink/);
  } finally {
    f.close();
  }
});

test('nested invocation still rejects an enclosing checkout store and linked ancestors', () => {
  const f = fixture();
  try {
    execFileSync('git', ['init', '-q', f.repo]);
    const nested = join(f.repo, 'nested');
    mkdirSync(nested);
    assert.throws(() => main(['report', '--store=' + join(f.repo, 'private')], nested), /outside/);
    const actual = join(f.root, 'actual');
    mkdirSync(actual, { mode: 0o700 });
    mkdirSync(join(actual, 'ledger'), { mode: 0o700 });
    const link = join(f.root, 'linked');
    symlinkSync(actual, link);
    assert.throws(() => main(['report', '--store=' + join(link, 'ledger')], f.repo), /Symlink/);
  } finally {
    f.close();
  }
});
test('an empty complete job retains incomplete aggregate coverage beside a measured job', () => {
  const f = fixture();
  try {
    const a = f.start(),
      b = f.start();
    writeFileSync(f.file, JSON.stringify(event));
    f.run('import', '--job=' + a, '--file=' + f.file);
    for (const j of [a, b]) f.run('finish', '--job=' + j, '--coverage=complete', '--outcome=done');
    assert.equal(f.run('report').complete, false);
  } finally {
    f.close();
  }
});
test('missing Git cannot authorize an enclosing checkout store; worktree marker files are sufficient', () => {
  const f = fixture(),
    old = process.env.PATH;
  try {
    writeFileSync(join(f.repo, '.git'), 'gitdir: neutral-metadata');
    const nested = join(f.repo, 'nested');
    mkdirSync(nested);
    process.env.PATH = '/nonexistent';
    assert.throws(() => main(['report', '--store=' + join(f.repo, 'private')], nested), /outside/);
  } finally {
    process.env.PATH = old;
    f.close();
  }
});

test('an explicitly selected checkout root is also excluded from nested invocation', () => {
  const f = fixture();
  try {
    chmodSync(f.repo, 0o700);
    writeFileSync(join(f.repo, '.git'), 'gitdir: neutral-metadata');
    const nested = join(f.repo, 'nested');
    mkdirSync(nested);
    assert.throws(() => main(['report', '--store=' + f.repo], nested), /outside/);
  } finally {
    f.close();
  }
});

test('step filtering and feature rollup conserve distinct source events and expose unassigned/empty coverage', () => {
  const f = fixture();
  try {
    const start = (item, task) =>
      f.run(
        'start',
        '--repository=neutral/repo',
        '--item=' + item,
        '--agent=fixture',
        '--activity=coding',
        ...(task ? ['--task=' + task] : []),
      ).job;
    const a = start('F-001', 'F-001-T01'),
      b = start('F-001', 'F-001-T02'),
      _empty = start('F-001', 'F-001-T02'),
      unassigned = start('F-001');
    for (const [job, eventId, inputTokens] of [
      [a, 'step-a', 100],
      [b, 'step-b', 200],
      [unassigned, 'shared', 300],
    ]) {
      writeFileSync(f.file, JSON.stringify({ ...event, eventId, inputTokens }));
      f.run('import', '--job=' + job, '--file=' + f.file);
      f.run('finish', '--job=' + job, '--coverage=complete', '--outcome=done');
    }
    const r = f.run('report', '--item=F-001');
    assert.equal(r.totals.inputTokens.known, 600);
    assert.equal(r.byTask['neutral/repo:F-001-T01'].totals.inputTokens.known, 100);
    assert.equal(r.byTask['neutral/repo:F-001-T02'].complete, false);
    assert.equal(r.byTask['neutral/repo:F-001:unassigned'].totals.inputTokens.known, 300);
    assert.equal(
      Object.values(r.byTask).reduce((n, v) => n + v.totals.inputTokens.known, 0),
      600,
    );
    const selected = f.run('report', '--item=F-001', '--task=F-001-T01');
    assert.equal(selected.events, 1);
    assert.equal(selected.complete, true);
    assert.equal(selected.jobs.length, 1);
    assert.equal(selected.totals.inputTokens.known, 100);
    assert.throws(() => f.run('report', '--item=F-002', '--task=F-001-T01'), /task/);
    assert.throws(() => f.run('report', '--task=oops'), /task/);
    const unknown = f.run('report', '--task=F-001-T99');
    assert.equal(unknown.totals.inputTokens.known, null);
    assert.equal(unknown.complete, false);
  } finally {
    f.close();
  }
});

test('Codex metadata-only turn import preserves measured counters, missing fields, replay and retries', () => {
  const f = fixture();
  try {
    const job = f.start();
    const metadata = {
      version: 1,
      source: 'codex-fixture',
      eventId: 'stable-turn-1',
      activity: 'coding',
      provider: 'openai',
      model: null,
      event: {
        type: 'turn.completed',
        usage: { input_tokens: 100, cached_input_tokens: 70, output_tokens: 20, reasoning_output_tokens: 5 },
      },
    };
    writeFileSync(f.file, JSON.stringify(metadata));
    assert.equal(f.run('import', '--format=codex-turn', '--job=' + job, '--file=' + f.file).imported, true);
    assert.equal(f.run('import', '--format=codex-turn', '--job=' + job, '--file=' + f.file).imported, false);
    const r = f.run('report');
    assert.equal(r.totals.inputTokens.known, 100);
    assert.equal(r.totals.cacheReadTokens.known, 70);
    assert.equal(r.totals.cacheWriteTokens.known, null);
    assert.equal(r.totals.reasoningTokens.known, 5);
    for (const bad of [
      { ...metadata, prompt: 'private' },
      { ...metadata, event: { ...metadata.event, text: 'private' } },
      { ...metadata, event: { type: 'turn.completed', usage: { ...metadata.event.usage, total_tokens: 120 } } },
      { ...metadata, event: { type: 'thread.tokenUsage.updated', usage: metadata.event.usage } },
    ]) {
      writeFileSync(f.file, JSON.stringify(bad));
      assert.throws(() => f.run('import', '--format=codex-turn', '--job=' + job, '--file=' + f.file));
    }
  } finally {
    f.close();
  }
});

test('prelaunch job handoff binds open same-repository parent and does not silently reassign source events', () => {
  const f = fixture();
  try {
    const parent = f.start();
    const _child = f.run(
      'start',
      '--repository=neutral/repo',
      '--item=F-001',
      '--task=F-001-T01',
      '--parent=' + parent,
      '--agent=fixture',
      '--activity=tests',
    ).job;
    assert.equal(f.run('report', '--task=F-001-T01').jobs[0].parent, parent);
    assert.throws(
      () =>
        f.run(
          'start',
          '--repository=other/repo',
          '--item=F-001',
          '--parent=' + parent,
          '--agent=fixture',
          '--activity=tests',
        ),
      /parent/,
    );
    f.run('finish', '--job=' + parent, '--coverage=unavailable', '--outcome=done');
    assert.throws(
      () =>
        f.run(
          'start',
          '--repository=neutral/repo',
          '--item=F-001',
          '--parent=' + parent,
          '--agent=fixture',
          '--activity=tests',
        ),
      /parent/,
    );
  } finally {
    f.close();
  }
});

test('optional launcher registers the step before the command, passes only job identity, and retains failed execution', () => {
  const f = fixture();
  try {
    const tool = new URL('../core/tools/usage-launch.mjs', import.meta.url);
    const args = [
      tool.pathname,
      '--repository=neutral/repo',
      '--item=F-001',
      '--task=F-001-T01',
      '--agent=fixture',
      '--store=' + f.store,
      '--',
      process.execPath,
      '-e',
      "const fs=require('node:fs');const j=JSON.parse(fs.readFileSync(process.env.HARNESS_USAGE_STORE+'/jobs/'+process.env.HARNESS_USAGE_JOB+'.json'));if(j.task!=='F-001-T01'||j.started>new Date().toISOString())process.exit(7);process.exit(3)",
    ];
    let error;
    try {
      execFileSync(process.execPath, args, { cwd: f.repo, stdio: 'pipe' });
    } catch (e) {
      error = e;
    }
    assert.equal(error?.status, 3);
    const r = f.run('report');
    assert.equal(r.jobs.length, 1);
    assert.equal(r.jobs[0].task, 'F-001-T01');
    assert.equal(r.jobs[0].outcome, 'failed');
    assert.equal(r.jobs[0].coverage, 'unavailable');
    assert.equal(r.totals.inputTokens.known, null);
  } finally {
    f.close();
  }
});

test('Claude complete assistant metadata normalizes disjoint cache counts and native message ID replay', () => {
  const f = fixture();
  try {
    const job = f.start();
    const row = {
      version: 1,
      source: 'claude-fixture',
      activity: 'coding',
      provider: 'anthropic',
      complete: true,
      event: {
        type: 'assistant',
        message: {
          id: 'msg-neutral-1',
          model: 'fixture',
          usage: { input_tokens: 20, cache_read_input_tokens: 70, cache_creation_input_tokens: 10, output_tokens: 12 },
        },
      },
    };
    writeFileSync(f.file, JSON.stringify(row));
    assert.equal(f.run('import', '--format=claude-message', '--job=' + job, '--file=' + f.file).imported, true);
    assert.equal(f.run('import', '--format=claude-message', '--job=' + job, '--file=' + f.file).imported, false);
    const r = f.run('report');
    assert.equal(r.totals.inputTokens.known, 100);
    assert.equal(r.totals.cacheReadTokens.known, 70);
    assert.equal(r.totals.cacheWriteTokens.known, 10);
    assert.equal(r.totals.reasoningTokens.known, null);
    const other = f.start();
    assert.throws(
      () => f.run('import', '--format=claude-message', '--job=' + other, '--file=' + f.file),
      /already assigned/,
    );
    for (const bad of [
      { ...row, complete: false },
      { ...row, event: { type: 'result', message: row.event.message } },
      { ...row, event: { type: 'assistant', message: { ...row.event.message, content: ['private'] } } },
      {
        ...row,
        event: {
          type: 'assistant',
          message: { ...row.event.message, usage: { ...row.event.message.usage, input_tokens: -1 } },
        },
      },
    ]) {
      writeFileSync(f.file, JSON.stringify(bad));
      assert.throws(() => f.run('import', '--format=claude-message', '--job=' + job, '--file=' + f.file));
    }
    const missing = structuredClone(row);
    missing.event.message.id = 'msg-neutral-2';
    delete missing.event.message.usage.cache_creation_input_tokens;
    writeFileSync(f.file, JSON.stringify(missing));
    f.run('import', '--format=claude-message', '--job=' + job, '--file=' + f.file);
    assert.equal(f.run('report').totals.inputTokens.missing, 1);
  } finally {
    f.close();
  }
});

test('effectiveness joins immutable estimates, measured overlap, retries, interventions and explicit prices per step', () => {
  const f = fixture();
  try {
    const start = (task) =>
      f.run(
        'start',
        '--repository=neutral/repo',
        '--item=F-001',
        '--task=' + task,
        '--agent=fixture',
        '--activity=coding',
      ).job;
    const a = start('F-001-T01'),
      b = start('F-001-T02'),
      at = (seconds) => new Date(Date.UTC(2026, 0, 1, 0, 0, seconds)).toISOString();
    for (const [job, start, end, n] of [
      [a, 0, 10, 100],
      [b, 5, 15, 200],
    ]) {
      writeFileSync(f.file, JSON.stringify({ ...event, eventId: job, inputTokens: n }));
      f.run('import', '--job=' + job, '--file=' + f.file);
      f.run('finish', '--job=' + job, '--coverage=complete', '--outcome=done');
      const path = join(f.store, 'jobs', job + '.json'),
        row = JSON.parse(readFileSync(path));
      row.started = at(start);
      writeFileSync(path, JSON.stringify(row));
      writeFileSync(
        join(f.store, 'jobs', job + '.finished.json'),
        JSON.stringify({ finished: at(end), coverage: 'complete', outcome: 'done' }),
      );
    }
    let seq = 0;
    const observe = (job, body) => {
      writeFileSync(
        f.file,
        JSON.stringify({ version: 1, source: 'observed-fixture', eventId: 'observation-' + ++seq, ...body }),
      );
      return f.run('observe', '--job=' + job, '--file=' + f.file);
    };
    observe(a, {
      kind: 'estimate',
      at: at(-1),
      measure: 'elapsedMs',
      lower: 8000,
      upper: 12000,
      revision: 1,
      basis: 'Initial bounded scope',
    });
    observe(a, {
      kind: 'estimate',
      at: at(6),
      measure: 'elapsedMs',
      lower: 9000,
      upper: 11000,
      revision: 2,
      basis: 'Revised after discovery',
    });
    observe(a, { kind: 'interval', category: 'active', start: at(0), end: at(6) });
    observe(b, { kind: 'interval', category: 'active', start: at(5), end: at(10) });
    observe(a, { kind: 'attempt', result: 'failed', failureKind: 'infrastructure' });
    observe(a, { kind: 'attempt', result: 'succeeded', failureKind: null });
    observe(a, { kind: 'finding', classification: 'review' });
    observe(b, { kind: 'finding', classification: 'confirmed-regression' });
    observe(a, { kind: 'intervention', category: 'approval', durationMs: null });
    observe(a, { kind: 'intervention', category: 'recovery', durationMs: 3000 });
    observe(a, { kind: 'state', value: 'reopened' });
    observe(a, {
      kind: 'price',
      usageSource: 'fixture',
      usageEventId: a,
      currency: 'USD',
      at: at(15),
      rateSource: 'https://example.invalid/reviewed-rates',
      rates: { input: 1, cacheRead: 0.1, cacheWrite: 1.25, output: 2 },
    });
    const r = f.run('report', '--item=F-001'),
      e = r.effectiveness;
    assert.equal(e.time.elapsedUnionMs, 15000);
    assert.equal(e.time.activeUnionMs, 10000);
    assert.equal(e.time.measuredWorkerActiveMs, 11000);
    assert.equal(e.time.executionUnionMs, null);
    assert.equal(e.attempts.sampleSize, 2);
    assert.equal(e.attempts.failed, 1);
    assert.equal(e.attempts.succeeded, 1);
    assert.equal(e.attempts.infrastructureFailures, 1);
    assert.equal(e.findings.confirmedRegressions, 1);
    assert.equal(e.humanInterventions.knownDurationMs, 3000);
    assert.equal(e.humanInterventions.missingDurations, 1);
    assert.equal(e.estimates[0].comparison, 'within range');
    assert.equal(e.estimates[1].preWork, false);
    assert.equal(e.states.length, 1);
    assert.ok(Math.abs(e.cost[0].knownEstimatedAmount - 0.0000795) < 1e-12);
    assert.equal(e.cost[0].missingEvents, 1);
    assert.equal(e.cost[0].complete, false);
    const step = f.run('report', '--task=F-001-T01');
    assert.equal(step.effectiveness.time.elapsedUnionMs, 10000);
    assert.equal(step.byTask['neutral/repo:F-001-T01'].effectiveness.time.activeUnionMs, 6000);
    assert.equal(step.effectiveness.cost[0].complete, true);
    assert.equal(f.run('observe', '--job=' + a, '--file=' + f.file).imported, false);
    assert.throws(() => observe(a, { kind: 'interval', category: 'active', start: at(-1), end: at(2) }), /interval/);
    assert.throws(
      () => observe(a, { kind: 'intervention', category: 'approval', durationMs: 0, prompt: 'private' }),
      /metadata/,
    );
    assert.throws(
      () =>
        observe(a, {
          kind: 'price',
          usageSource: 'fixture',
          usageEventId: a,
          currency: 'USD',
          at: at(16),
          rateSource: 'https://example.invalid/rates',
          rates: { input: 2, cacheRead: 0.1, cacheWrite: 1.25, output: 2 },
        }),
      /price/,
    );
  } finally {
    f.close();
  }
});

test('empty/partial effectiveness remains unknown and observations share the global event identity boundary', () => {
  const f = fixture();
  try {
    const job = f.start();
    let r = f.run('report');
    assert.equal(r.effectiveness.attempts, null);
    assert.equal(r.effectiveness.time.elapsedUnionMs, null);
    assert.equal(r.effectiveness.humanInterventions, null);
    writeFileSync(
      f.file,
      JSON.stringify({
        version: 1,
        source: 'fixture',
        eventId: 'same',
        kind: 'finding',
        classification: 'unverified-suspicion',
      }),
    );
    f.run('observe', '--job=' + job, '--file=' + f.file);
    writeFileSync(f.file, JSON.stringify({ ...event, eventId: 'same' }));
    assert.throws(() => f.run('import', '--job=' + job, '--file=' + f.file), /already assigned/);
    r = f.run('report');
    assert.equal(r.events, 0);
    assert.equal(r.totals.inputTokens.known, null);
    assert.equal(r.complete, false);
    assert.equal(r.effectiveness.findings.unverifiedSuspicions, 1);
  } finally {
    f.close();
  }
});

test('price and estimate observations keep unknown metrics, currencies and post-start revisions explicit', () => {
  const f = fixture();
  try {
    const job = f.start();
    writeFileSync(f.file, JSON.stringify({ ...event, cacheWriteTokens: null }));
    f.run('import', '--job=' + job, '--file=' + f.file);
    for (const currency of ['USD', 'EUR']) {
      writeFileSync(
        f.file,
        JSON.stringify({
          version: 1,
          source: 'rates-fixture',
          eventId: currency,
          kind: 'price',
          usageSource: event.source,
          usageEventId: event.eventId,
          currency,
          at: new Date().toISOString(),
          rateSource: 'https://example.invalid/rates',
          rates: { input: 1, cacheRead: 1, cacheWrite: 1, output: 1 },
        }),
      );
      f.run('observe', '--job=' + job, '--file=' + f.file);
    }
    const r = f.run('report');
    assert.equal(r.effectiveness.cost.length, 2);
    for (const c of r.effectiveness.cost) {
      assert.equal(c.knownEstimatedAmount, null);
      assert.equal(c.complete, false);
      assert.equal(c.missingEvents, 1);
    }
    assert.equal(r.effectiveness.time.elapsedComplete, false);
    assert.equal(r.effectiveness.time.openJobs, 1);
    assert.equal(r.effectiveness.time.measuredWorkerActiveMs, null);
  } finally {
    f.close();
  }
});

test('effectiveness retains human intervention category counts and duration coverage', () => {
  const f = fixture();
  try {
    const job = f.start();
    for (const [eventId, category, durationMs] of [
      ['scope-change', 'scope', null],
      ['owner-approval', 'approval', 50],
      ['approval-two', 'approval', null],
    ]) {
      writeFileSync(
        f.file,
        JSON.stringify({ version: 1, source: 'fixture', eventId, kind: 'intervention', category, durationMs }),
      );
      f.run('observe', '--job=' + job, '--file=' + f.file);
    }
    const r = f.run('report').effectiveness.humanInterventions;
    assert.deepEqual(r.byCategory.scope, { count: 1, knownDurationMs: null, missingDurations: 1 });
    assert.deepEqual(r.byCategory.approval, { count: 2, knownDurationMs: 50, missingDurations: 1 });
    assert.equal(r.byCategory.recovery, null);
  } finally {
    f.close();
  }
});

test('priced effectiveness exposes the actual supplied rates and joined usage identity', () => {
  const f = fixture();
  try {
    const job = f.start();
    writeFileSync(f.file, JSON.stringify(event));
    f.run('import', '--job=' + job, '--file=' + f.file);
    const price = {
      version: 1,
      source: 'fixture-price',
      eventId: 'price-1',
      kind: 'price',
      usageSource: event.source,
      usageEventId: event.eventId,
      currency: 'USD',
      at: new Date().toISOString(),
      rateSource: 'https://example.invalid/rates',
      rates: { input: 1, cacheRead: 0.1, cacheWrite: 1.25, output: 2 },
    };
    writeFileSync(f.file, JSON.stringify(price));
    f.run('observe', '--job=' + job, '--file=' + f.file);
    const p = f.run('report').effectiveness.cost[0].provenance[0];
    assert.deepEqual(p.rates, price.rates);
    assert.equal(p.usageSource, event.source);
    assert.equal(p.usageEventId, event.eventId);
  } finally {
    f.close();
  }
});

test('Codex and Claude allowance payloads retain only documented rolling-window counters', () => {
  const f = fixture();
  try {
    const job = f.start(),
      observedAt = '2026-01-01T00:00:00.000Z';
    const codex = {
      rateLimits: { primary: { usedPercent: 24, windowDurationMins: 300, resetsAt: 1767247200 }, secondary: null },
      rateLimitsByLimitId: {
        review: {
          limitId: 'review',
          limitName: 'Review',
          primary: { usedPercent: 5, windowDurationMins: 10080, resetsAt: 1767852000 },
          secondary: null,
        },
      },
    };
    writeFileSync(f.file, JSON.stringify({ version: 1, source: 'codex-app-server', observedAt, payload: codex }));
    assert.equal(f.run('allowance', '--format=codex-rate-limits', '--job=' + job, '--file=' + f.file).imported, true);
    const claude = {
      session_id: 'private-session',
      transcript_path: '/private/transcript',
      cost: { total_cost_usd: 99 },
      rate_limits: {
        five_hour: { used_percentage: 30, resets_at: 1767247200 },
        seven_day: { used_percentage: 40, resets_at: 1767852000 },
      },
    };
    const captured = main(
      ['claude-status', '--store=' + f.store, '--source=claude-statusline', '--job=' + job],
      f.repo,
      JSON.stringify(claude),
    );
    assert.equal(captured.imported, true);
    const report = f.run('report'),
      providers = report.allowance.providers;
    assert.equal(providers.codex.latest.find((x) => x.bucket === 'default:primary').usedPercent, 24);
    assert.equal(providers.claude.latest.find((x) => x.bucket === 'five_hour').usedPercent, 30);
    const persisted = readdirSync(join(f.store, 'allowances'))
      .map((name) => readFileSync(join(f.store, 'allowances', name), 'utf8'))
      .join('\n');
    assert.doesNotMatch(persisted, /private-session|transcript_path|total_cost_usd/);
    assert.throws(() => validateAllowance({ ...report.allowance.providers.codex.latest[0], prompt: 'private' }));
  } finally {
    f.close();
  }
});

test('allowance history reports only conservative same-window changes and qualified job calibration', () => {
  const f = fixture();
  try {
    const job = f.start(),
      saveAllowance = (eventId, usedPercent, resetsAt, observedAt) => {
        writeFileSync(
          f.file,
          JSON.stringify({
            version: 1,
            source: 'fixture-allowance',
            eventId,
            provider: 'codex',
            observedAt,
            buckets: [{ bucket: 'five-hour', usedPercent, windowMinutes: 300, resetsAt }],
          }),
        );
        f.run('allowance', '--format=normalized', '--job=' + job, '--file=' + f.file);
      };
    saveAllowance('a', 10, '2026-01-01T05:00:00.000Z', '2026-01-01T00:00:00.000Z');
    saveAllowance('b', 25, '2026-01-01T05:00:00.000Z', '2026-01-01T01:00:00.000Z');
    saveAllowance('c', 2, '2026-01-02T05:00:00.000Z', '2026-01-02T00:00:00.000Z');
    const r = f.run('report'),
      history = r.allowance.providers.codex.history['five-hour'];
    assert.equal(history[1].changeUsedPercent, 15);
    assert.equal(history[2].changeUsedPercent, null);
    assert.equal(history[2].boundary, 'reset-or-decrease');
    assert.equal(r.calibration.allowanceSamples[0].attribution, 'shared-account change; not exact task usage');
    assert.equal(r.calibration.allowanceSamples[0].changeUsedPercent, 15);
  } finally {
    f.close();
  }
});

test('report --out writes the same private JSON once outside the checkout', () => {
  const f = fixture();
  try {
    const out = join(f.root, 'reports', 'report.json');
    mkdirSync(join(f.root, 'reports'), { mode: 0o700 });
    const report = f.run('report', '--out=' + out);
    assert.deepEqual(JSON.parse(readFileSync(out, 'utf8')), report);
    assert.equal(statSync(out).mode & 0o777, 0o600);
    assert.throws(() => f.run('report', '--out=' + out), /exists|overwrite/i);
    assert.throws(() => f.run('report', '--out=' + join(f.repo, 'report.json')), /outside/);
    const linked = join(f.root, 'linked-report');
    symlinkSync(out, linked);
    assert.throws(() => f.run('report', '--out=' + linked), /symlink/i);
  } finally {
    f.close();
  }
});

test('calibration groups comparable completed work with sample size and source coverage without recommending estimates', () => {
  const f = fixture();
  try {
    const job = f.run(
      'start',
      '--repository=neutral/repo',
      '--item=F-001',
      '--task=F-001-T01',
      '--agent=fixture',
      '--activity=coding',
    ).job;
    writeFileSync(f.file, JSON.stringify(event));
    f.run('import', '--job=' + job, '--file=' + f.file);
    f.run('finish', '--job=' + job, '--coverage=complete', '--outcome=done');
    const c = f.run('report').calibration,
      group = c.completedWork['neutral/repo:F-001-T01'];
    assert.equal(group.sampleSize, 1);
    assert.equal(group.jobsWithCompleteTokens, 1);
    assert.equal(group.input.min, 100);
    assert.doesNotMatch(JSON.stringify(c), /recommendedEstimate|automatic/i);
  } finally {
    f.close();
  }
});

test('Codex collection terminates the app-server child after protocol error and timeout', async () => {
  const f = fixture(),
    bin = join(f.root, 'bin'),
    script = join(bin, 'codex'),
    pidFile = join(f.root, 'pid'),
    oldPath = process.env.PATH,
    oldPid = process.env.FAKE_CODEX_PID;
  mkdirSync(bin);
  const failing =
      "#!/usr/bin/env node\nconst fs=require('node:fs'),readline=require('node:readline');fs.writeFileSync(process.env.FAKE_CODEX_PID,String(process.pid));const rl=readline.createInterface({input:process.stdin});rl.on('line',line=>{const m=JSON.parse(line);if(m.id===1)console.log(JSON.stringify({id:1,result:{ok:true}}));if(m.id===2)console.log(JSON.stringify({id:2,error:{message:'fixture'}}));});setInterval(()=>{},1000);\n",
    hanging =
      "#!/usr/bin/env node\nconst fs=require('node:fs');fs.writeFileSync(process.env.FAKE_CODEX_PID,String(process.pid));process.stdin.resume();setInterval(()=>{},1000);\n";
  writeFileSync(script, failing);
  chmodSync(script, 0o700);
  process.env.PATH = bin + ':' + oldPath;
  process.env.FAKE_CODEX_PID = pidFile;
  try {
    // B-023: the fake app-server answers with an error as soon as it starts; under the parallel suite Node can take
    // over a second to start, so the budget is 10 s (the call still ends at the error, not at the timeout)
    await assert.rejects(() => collectCodexRateLimits(['--store=' + f.store], f.repo, { timeoutMs: 10000 }), /failed/);
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.throws(
      () => process.kill(Number(readFileSync(pidFile, 'utf8')), 0),
      (error) => error?.code === 'ESRCH',
    );
    writeFileSync(script, hanging);
    await assert.rejects(() => collectCodexRateLimits(['--store=' + f.store], f.repo, { timeoutMs: 50 }), /timed out/);
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.throws(
      () => process.kill(Number(readFileSync(pidFile, 'utf8')), 0),
      (error) => error?.code === 'ESRCH',
    );
  } finally {
    process.env.PATH = oldPath;
    if (oldPid === undefined) delete process.env.FAKE_CODEX_PID;
    else process.env.FAKE_CODEX_PID = oldPid;
    f.close();
  }
});

test('allowance calibration separates sources/windows and exposes overlapping jobs', () => {
  const f = fixture();
  try {
    const a = f.start(),
      b = f.start('F-002'),
      at = (s) => new Date(Date.UTC(2026, 0, 1, 0, 0, s)).toISOString(),
      saveAllowance = (source, eventId, used, windowMinutes, observed) => {
        writeFileSync(
          f.file,
          JSON.stringify({
            version: 1,
            source,
            eventId,
            provider: 'codex',
            observedAt: at(observed),
            buckets: [{ bucket: 'five-hour', usedPercent: used, windowMinutes, resetsAt: at(3600) }],
          }),
        );
        f.run('allowance', '--format=normalized', '--job=' + a, '--file=' + f.file);
      },
      setStarted = (job, start) => {
        const path = join(f.store, 'jobs', job + '.json'),
          row = JSON.parse(readFileSync(path));
        row.started = at(start);
        writeFileSync(path, JSON.stringify(row));
      };
    setStarted(a, 0);
    setStarted(b, 5);
    saveAllowance('account-A', 'a1', 10, 300, 10);
    saveAllowance('account-B', 'b1', 30, 300, 20);
    saveAllowance('account-A', 'a2', 25, 300, 30);
    saveAllowance('account-A', 'a3', 40, 10080, 40);
    const r = f.run('report'),
      samples = r.calibration.allowanceSamples;
    assert.equal(samples.length, 1);
    assert.equal(samples[0].changeUsedPercent, 15);
    assert.deepEqual(samples[0].overlappingJobs, [b]);
    assert.match(samples[0].qualification, /overlap/);
    const filtered = f.run('report', '--item=F-001').calibration.allowanceSamples;
    assert.deepEqual(filtered[0].overlappingJobs, [b]);
    const history = r.allowance.providers.codex.history['five-hour'];
    assert.equal(history.find((x) => x.eventId === 'b1').changeUsedPercent, null);
    assert.equal(history.find((x) => x.eventId === 'a3').changeUsedPercent, null);
  } finally {
    f.close();
  }
});

test('failed and interrupted jobs stay out of completed-work calibration samples', () => {
  const f = fixture();
  try {
    for (const outcome of ['failed', 'interrupted']) {
      const job = f.start();
      f.run('finish', '--job=' + job, '--coverage=unavailable', '--outcome=' + outcome);
    }
    assert.deepEqual(f.run('report').calibration.completedWork, {});
  } finally {
    f.close();
  }
});

// B-021: a child that a SIGTERM stops has exited (signalCode set, exitCode null); stopChild must not then send SIGKILL
// and wait out a second grace period.
test('Codex collection returns promptly once SIGTERM has stopped the app-server child', async () => {
  const f = fixture(),
    bin = join(f.root, 'bin'),
    script = join(bin, 'codex'),
    oldPath = process.env.PATH;
  mkdirSync(bin);
  writeFileSync(script, '#!/usr/bin/env node\nprocess.stdin.resume();setInterval(()=>{},1000);\n');
  chmodSync(script, 0o700);
  process.env.PATH = bin + ':' + oldPath;
  try {
    const started = Date.now();
    await assert.rejects(
      () => collectCodexRateLimits(['--store=' + f.store], f.repo, { timeoutMs: 300, graceMs: 3000 }),
      /timed out/,
    );
    const elapsed = Date.now() - started;
    assert.ok(elapsed < 2500, `returned after ${elapsed} ms: a stopped child must not wait out another grace period`);
  } finally {
    process.env.PATH = oldPath;
    f.close();
  }
});

test('recorded pauses (usage limit, owner away) leave the effective elapsed time; unrecorded time stays counted', () => {
  const f = fixture();
  try {
    const job = f.run(
        'start',
        '--repository=neutral/repo',
        '--item=F-001',
        '--task=F-001-T01',
        '--agent=fixture',
        '--activity=coding',
      ).job,
      at = (seconds) => new Date(Date.UTC(2026, 0, 1, 0, 0, seconds)).toISOString();
    f.run('finish', '--job=' + job, '--coverage=unavailable', '--outcome=done');
    const path = join(f.store, 'jobs', job + '.json'),
      row = JSON.parse(readFileSync(path));
    row.started = at(0);
    writeFileSync(path, JSON.stringify(row));
    writeFileSync(
      join(f.store, 'jobs', job + '.finished.json'),
      JSON.stringify({ finished: at(10), coverage: 'unavailable', outcome: 'done' }),
    );
    writeFileSync(
      f.file,
      JSON.stringify({
        version: 1,
        source: 'fixture',
        eventId: 'estimate-1',
        kind: 'estimate',
        at: at(-1),
        measure: 'elapsedMs',
        lower: 4000,
        upper: 6000,
        revision: 1,
        basis: 'Bounded scope',
      }),
    );
    f.run('observe', '--job=' + job, '--file=' + f.file);
    const before = f.run('report').effectiveness.time;
    assert.equal(before.elapsedUnionMs, 10000);
    assert.equal(before.pausedUnionMs, null);
    assert.equal(before.effectiveElapsedMs, 10000);
    // A finished job still takes a pause; an offset time is normalized to UTC; replay is idempotent.
    assert.equal(f.run('pause', '--job=' + job, '--from=' + at(2), '--to=' + at(5)).imported, true);
    assert.equal(f.run('pause', '--job=' + job, '--from=' + at(2), '--to=' + at(5)).imported, false);
    f.run('pause', '--job=' + job, '--from=2026-01-01T01:00:04+01:00', '--to=' + at(7));
    const r = f.run('report'),
      t = r.effectiveness.time;
    assert.equal(t.pausedUnionMs, 5000);
    assert.equal(t.effectiveElapsedMs, 5000);
    assert.equal(r.calibration.completedWork['neutral/repo:F-001-T01'].elapsed.median, 10000);
    assert.equal(r.calibration.completedWork['neutral/repo:F-001-T01'].effectiveElapsed.median, 5000);
    const estimate = r.effectiveness.estimates[0];
    assert.equal(estimate.observed, 5000);
    assert.equal(estimate.comparison, 'within range');
    assert.throws(() => f.run('pause', '--job=' + job, '--from=' + at(8), '--to=' + at(12)), /outside job/);
    assert.throws(() => f.run('pause', '--job=' + job, '--from=2026-01-01T00:00:02', '--to=' + at(3)), /offset/);
    assert.throws(() => f.run('pause', '--job=' + job, '--from=' + at(6), '--to=' + at(3)), /interval/);
  } finally {
    f.close();
  }
});

test('a pause on one job never removes time a parallel job worked; one stop is recorded on each job it hit', () => {
  const f = fixture();
  try {
    const at = (seconds) => new Date(Date.UTC(2026, 0, 1, 0, 0, seconds)).toISOString(),
      jobs = [];
    for (const [task, start, end] of [
      ['F-001-T01', 0, 60],
      ['F-001-T02', 0, 60],
    ]) {
      const job = f.run(
        'start',
        '--repository=neutral/repo',
        '--item=F-001',
        '--task=' + task,
        '--agent=fixture',
        '--activity=coding',
      ).job;
      f.run('finish', '--job=' + job, '--coverage=unavailable', '--outcome=done');
      const path = join(f.store, 'jobs', job + '.json'),
        row = JSON.parse(readFileSync(path));
      row.started = at(start);
      writeFileSync(path, JSON.stringify(row));
      writeFileSync(
        join(f.store, 'jobs', job + '.finished.json'),
        JSON.stringify({ finished: at(end), coverage: 'unavailable', outcome: 'done' }),
      );
      jobs.push(job);
    }
    // Only the first job stops: the second kept working, so no wall time is removed.
    f.run('pause', '--job=' + jobs[0], '--from=' + at(0), '--to=' + at(60));
    let t = f.run('report').effectiveness.time;
    assert.equal(t.elapsedUnionMs, 60000);
    assert.equal(t.effectiveElapsedMs, 60000);
    assert.equal(t.pausedUnionMs, 0);
    // The same stop on the second job records separately; together they leave 20 s of work out of 60 s.
    assert.equal(f.run('pause', '--job=' + jobs[1], '--from=' + at(20), '--to=' + at(60)).imported, true);
    t = f.run('report').effectiveness.time;
    assert.equal(t.effectiveElapsedMs, 20000);
    assert.equal(t.pausedUnionMs, 40000);
  } finally {
    f.close();
  }
});

test('report lists suggestedPauses from 100% allowance buckets and activity gaps without subtracting them', () => {
  const f = fixture();
  try {
    const min = (m) => new Date(Date.UTC(2026, 0, 1, 0, m, 0)).toISOString(),
      job = f.run(
        'start',
        '--repository=neutral/repo',
        '--item=F-001',
        '--task=F-001-T01',
        '--agent=fixture',
        '--activity=coding',
      ).job;
    // Phase at minute 5, allowance at 100% at minute 10 resetting at minute 30, phase at minute 35, finish at minute 40.
    // Gap from minute 10 to 35 is 25 min (> default 15 min), while 0->5, 5->10, 35->40 are <= 5 min.
    f.run('finish', '--job=' + job, '--coverage=unavailable', '--outcome=done');
    const jobPath = join(f.store, 'jobs', job + '.json'),
      row = JSON.parse(readFileSync(jobPath));
    row.started = min(0);
    writeFileSync(jobPath, JSON.stringify(row));
    writeFileSync(
      join(f.store, 'jobs', job + '.finished.json'),
      JSON.stringify({ finished: min(40), coverage: 'unavailable', outcome: 'done' }),
    );
    writeFileSync(
      join(f.store, 'jobs', job + '.phase.' + '00000000-0000-4000-8000-000000000001' + '.json'),
      JSON.stringify({ activity: 'tests', at: min(5) }),
    );
    writeFileSync(
      join(f.store, 'jobs', job + '.phase.' + '00000000-0000-4000-8000-000000000002' + '.json'),
      JSON.stringify({ activity: 'review', at: min(35) }),
    );
    writeFileSync(
      f.file,
      JSON.stringify({
        version: 1,
        source: 'codex-status',
        eventId: 'limit-1',
        provider: 'codex',
        observedAt: min(10),
        buckets: [{ bucket: 'primary', usedPercent: 100, windowMinutes: 300, resetsAt: min(30) }],
      }),
    );
    f.run('allowance', '--job=' + job, '--format=normalized', '--file=' + f.file);

    const r1 = f.run('report'),
      suggestions = r1.jobs[0].suggestedPauses;
    assert.equal(r1.effectiveness.time.elapsedUnionMs, 40 * 60000);
    assert.equal(r1.effectiveness.time.effectiveElapsedMs, 40 * 60000);
    assert.equal(r1.effectiveness.time.pausedUnionMs, null);
    assert.deepEqual(
      suggestions.map((s) => [s.source, s.from, s.to, s.durationMs]),
      [
        ['activity-gap', min(10), min(35), 25 * 60000],
        ['allowance-limit', min(10), min(30), 20 * 60000],
      ],
    );
    assert.equal(suggestions[1].provider, 'codex');
    assert.equal(suggestions[1].bucket, 'primary');

    // Recording the pause removes both the effective time and the overlapping suggestions.
    f.run('pause', '--job=' + job, '--from=' + min(10), '--to=' + min(30));
    const r2 = f.run('report');
    assert.equal(r2.effectiveness.time.pausedUnionMs, 20 * 60000);
    assert.equal(r2.effectiveness.time.effectiveElapsedMs, 20 * 60000);
    assert.deepEqual(r2.jobs[0].suggestedPauses, []);
  } finally {
    f.close();
  }
});

test('workUsage.pauseGapMinutes in .harness.json sets the idle-gap threshold', () => {
  const f = fixture();
  try {
    const min = (m) => new Date(Date.UTC(2026, 0, 1, 0, m, 0)).toISOString(),
      job = f.run(
        'start',
        '--repository=neutral/repo',
        '--item=F-001',
        '--task=F-001-T01',
        '--agent=fixture',
        '--activity=coding',
      ).job;
    f.run('finish', '--job=' + job, '--coverage=unavailable', '--outcome=done');
    const jobPath = join(f.store, 'jobs', job + '.json'),
      row = JSON.parse(readFileSync(jobPath));
    row.started = min(0);
    writeFileSync(jobPath, JSON.stringify(row));
    writeFileSync(
      join(f.store, 'jobs', job + '.finished.json'),
      JSON.stringify({ finished: min(10), coverage: 'unavailable', outcome: 'done' }),
    );
    assert.deepEqual(f.run('report').jobs[0].suggestedPauses, []);
    writeFileSync(join(f.repo, '.harness.json'), JSON.stringify({ workUsage: { pauseGapMinutes: 5 } }));
    assert.deepEqual(
      f.run('report').jobs[0].suggestedPauses.map((s) => [s.source, s.durationMs]),
      [['activity-gap', 10 * 60000]],
    );
  } finally {
    f.close();
  }
});
