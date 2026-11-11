import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plan, history, policy, matches } from '../core/tools/verification.mjs';
const now = Date.parse('2026-11-08T12:00:00Z');
const settings = {
  enabled: true,
  workflow: 'ci.yml',
  fullJob: 'full-suite',
  risk: ['auth/**'],
  sources: ['src/**'],
  documentation: ['docs/**', 'README.md'],
  groups: [
    { id: 'core', paths: ['src/reminders.ts', 'test/reminders.test.ts'] },
    { id: 'browser', paths: ['web/**'] },
  ],
};
const fresh = { now, baseline: { run: 1, commit: 'a'.repeat(40), completed: '2026-11-07T12:00:00Z' }, merges: 1 };
test('current evidence selects only affected checks; documentation does not request app checks', () => {
  assert.deepEqual(plan(settings, { ...fresh, files: ['docs/note.md'] }).groups, []);
  assert.equal(plan(settings, { ...fresh, files: ['docs/note.md'] }).full, false);
  assert.deepEqual(plan(settings, { ...fresh, files: ['src/reminders.ts'] }).groups, ['core']);
  assert.equal(plan(settings, { ...fresh, files: ['src/reminders.ts'] }).full, false);
  assert.equal(matches('web/a/b.ts', 'web/**'), true);
  assert.equal(matches('web/a/b.ts', 'web/*'), false);
});
test('explicit, stale, PR-count, risk, unmapped and missing evidence request full checks', () => {
  for (const data of [
    { requested: true },
    { baseline: null },
    { merges: null },
    { merges: 10 },
    { baseline: { ...fresh.baseline, completed: '2026-11-01T12:00:00Z' } },
    { baseline: { ...fresh.baseline, completed: '2027-01-01' } },
    { files: ['auth/key.ts'] },
    { files: ['src/unknown.ts'] },
    { files: ['unknown.bin'] },
    { files: ['.harness.json'] },
    { files: ['.github/workflows/ci.yml'] },
  ]) {
    const p = plan(settings, { ...fresh, ...data });
    assert.equal(p.full, true, JSON.stringify(data));
    assert.deepEqual(p.groups, ['core', 'browser']);
  }
  assert.equal(plan(undefined, fresh).full, true);
  assert.throws(() => policy({ ...settings, prs: 0 }));
  assert.throws(() => policy({ ...settings, groups: [...settings.groups, settings.groups[0]] }));
});
function metadata({
  event = 'pull_request',
  marker = 'success',
  merged = true,
  head = 'a'.repeat(40),
  tested = 'a'.repeat(40),
  base = 'main',
  ancestor = true,
} = {}) {
  const calls = [];
  return {
    calls,
    base: 'main',
    now,
    ancestor: () => ancestor,
    countMerges: () => 3,
    api: async (path) => {
      calls.push(path);
      if (path.startsWith('actions/workflows/'))
        return {
          workflow_runs: [
            {
              id: 12,
              status: 'completed',
              conclusion: 'success',
              event,
              head_sha: tested,
              head_branch: 'main',
              pull_requests: [{ number: 5 }],
            },
          ],
        };
      if (path.includes('/jobs?'))
        return {
          jobs: [{ name: 'full-suite', status: 'completed', conclusion: marker, completed_at: '2026-11-07T12:00:00Z' }],
        };
      return {
        merged_at: merged ? '2026-11-07' : null,
        base: { ref: base },
        head: { sha: head },
        merge_commit_sha: 'b'.repeat(40),
      };
    },
  };
}
test('only successful full markers from exact tested heads that reached main reset freshness', async () => {
  const ok = await history(policy(settings), metadata());
  assert.equal(ok.baseline.run, 12);
  assert.equal(ok.merges, 3);
  for (const data of [
    { marker: 'skipped' },
    { marker: 'failure' },
    { merged: false },
    { head: 'c'.repeat(40) },
    { base: 'release' },
    { ancestor: false },
    { event: 'pull_request_target' },
  ])
    assert.equal((await history(policy(settings), metadata(data))).baseline, null, JSON.stringify(data));
  const scheduled = await history(policy(settings), metadata({ event: 'schedule' }));
  assert.equal(scheduled.baseline.commit, 'a'.repeat(40));
});
test('history failure remains explicit; invalid or partial history cannot become a baseline', async () => {
  await assert.rejects(
    history(policy(settings), {
      ...metadata(),
      api: async () => {
        throw Error('offline');
      },
    }),
    /offline/,
  );
  await assert.rejects(history(policy(settings), { ...metadata(), api: async () => ({}) }), /Invalid workflow history/);
});

test('deleted PR branches resolve through exact tested-commit associations', async () => {
  const source = metadata(),
    original = source.api;
  source.api = async (path) => {
    if (path.startsWith('commits/'))
      return [{ number: 5, merged_at: '2026-11-07', base: { ref: 'main' }, head: { sha: 'a'.repeat(40) } }];
    const value = await original(path);
    if (value.workflow_runs) value.workflow_runs[0].pull_requests = [];
    return value;
  };
  assert.equal((await history(policy(settings), source)).baseline.run, 12);
});

test('CLI joins real git staged, unstaged, deleted and untracked paths with integration counting', async (t) => {
  if (process.platform === 'win32') {
    t.skip('POSIX executable fixture; pure contracts remain portable');
    return;
  }
  const { mkdtempSync, mkdirSync, writeFileSync, chmodSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const { run } = await import('../core/tools/verification.mjs');
  const root = mkdtempSync(join(tmpdir(), 'verification fixture '));
  try {
    const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
    git('init', '-q', '-b', 'main');
    git('config', 'user.name', 'Fixture');
    git('config', 'user.email', 'fixture@example.invalid');
    for (const folder of ['src', 'docs', 'web', 'bin']) mkdirSync(join(root, folder));
    writeFileSync(join(root, '.harness.json'), JSON.stringify({ verification: settings }));
    writeFileSync(join(root, 'src/reminders.ts'), 'original');
    writeFileSync(join(root, 'docs/old.md'), 'old');
    git('add', '.');
    git('commit', '-qm', 'baseline');
    const baseline = git('rev-parse', 'HEAD');
    writeFileSync(join(root, 'docs/new.md'), 'integration');
    git('add', '.');
    git('commit', '-qm', 'one squash or direct integration');
    git('update-ref', 'refs/remotes/origin/main', 'HEAD');
    writeFileSync(join(root, '.git/info/exclude'), 'bin/\n');
    writeFileSync(join(root, 'src/reminders.ts'), 'staged');
    git('add', 'src/reminders.ts');
    writeFileSync(join(root, 'src/reminders.ts'), 'unstaged');
    rmSync(join(root, 'docs/old.md'));
    writeFileSync(join(root, 'web/new.ts'), 'untracked');
    const gh = join(root, 'bin/gh');
    writeFileSync(
      gh,
      `#!${process.execPath}\nconst path=process.argv[3];const value=path.includes('/jobs?')?{jobs:[{name:'full-suite',status:'completed',conclusion:'success',completed_at:new Date(Date.now()-1000).toISOString()}]}:{workflow_runs:[{id:1,event:'workflow_dispatch',status:'completed',conclusion:'success',head_sha:${JSON.stringify(baseline)},head_branch:'main'}]};process.stdout.write(JSON.stringify(value));`,
    );
    chmodSync(gh, 0o755);
    const result = await run([], root, {
      ...process.env,
      GITHUB_REPOSITORY: 'fixture/project',
      PATH: join(root, 'bin') + ':' + process.env.PATH,
    });
    assert.equal(result.full, false);
    assert.equal(result.baseline.mergedPRs, 1);
    assert.deepEqual(result.groups, ['core', 'browser']);
    assert.ok(result.files.includes('src/reminders.ts'));
    assert.ok(result.files.includes('docs/old.md'));
    assert.ok(result.files.includes('web/new.ts'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
