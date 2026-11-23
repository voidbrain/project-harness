import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { affectedSkills, changedSince, checkSkills, namedReferences, packageSkills } from './skills.mjs';

const withTempProject = (fn) => {
  const root = mkdtempSync(join(tmpdir(), 'skills-test-'));
  writeFileSync(join(root, 'LICENSE'), 'MIT License\n');
  writeFileSync(join(root, 'VERSION'), '10.2.0\n');
  try {
    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
};

describe('skills packaging and self-contained check (F-075)', () => {
  it('packages a standalone skill with SKILL.md and LICENSE at the zip root', () => {
    withTempProject((root) => {
      const skillDir = join(root, 'skills', 'demo-skill');
      mkdirSync(join(skillDir, 'references'), { recursive: true });
      writeFileSync(
        join(skillDir, 'SKILL.md'),
        [
          '---',
          'name: demo-skill',
          'description: Standalone test skill.',
          'metadata:',
          '  version: "1.2.3"',
          '---',
          '',
          '# Demo skill',
          '',
          'See [guide](references/guide.md) or [upstream](https://github.com/voidbrain/project-harness).',
          '',
        ].join('\n'),
      );
      writeFileSync(join(skillDir, 'references', 'guide.md'), '# Guide\n');

      const results = packageSkills({ root });
      assert.equal(results.length, 1);
      assert.equal(results[0].skipped, false);
      assert.equal(results[0].version, '1.2.3');
      assert.ok(existsSync(join(root, 'dist', 'skills', 'demo-skill-1.2.3.zip')));

      const entries = execFileSync('unzip', ['-Z1', results[0].zipPath], { encoding: 'utf8' })
        .trim()
        .split(/\r?\n/)
        .sort();
      assert.deepEqual(entries, ['LICENSE', 'SKILL.md', 'references/', 'references/guide.md']);
    });
  });

  it('fails packaging when SKILL.md or frontmatter is missing', () => {
    withTempProject((root) => {
      mkdirSync(join(root, 'skills', 'no-skill-md'), { recursive: true });
      assert.throws(() => packageSkills({ root }), /missing SKILL\.md/);

      rmSync(join(root, 'skills', 'no-skill-md'), { recursive: true, force: true });
      mkdirSync(join(root, 'skills', 'bad-frontmatter'), { recursive: true });
      writeFileSync(join(root, 'skills', 'bad-frontmatter', 'SKILL.md'), '# No frontmatter\n');
      assert.throws(() => packageSkills({ root }), /missing YAML frontmatter/);

      writeFileSync(
        join(root, 'skills', 'bad-frontmatter', 'SKILL.md'),
        '---\nname: bad-frontmatter\n---\n\n# Missing description\n',
      );
      assert.throws(() => packageSkills({ root }), /missing required "description"/);
    });
  });

  it('skips repo-only skills in both packaging and self-contained checks', () => {
    withTempProject((root) => {
      writeFileSync(join(root, 'AGENTS.md'), '# Agents\n');
      writeFileSync(join(root, 'APPLY.md'), '# Apply\n');
      const repoOnlyDir = join(root, 'skills', 'apply-harness');
      mkdirSync(repoOnlyDir, { recursive: true });
      writeFileSync(
        join(repoOnlyDir, 'SKILL.md'),
        [
          '---',
          'name: apply-harness',
          'description: Repo-only pointer.',
          'metadata:',
          '  distribution: repo-only',
          '---',
          '',
          'Read AGENTS.md and APPLY.md.',
          '',
        ].join('\n'),
      );

      const pkg = packageSkills({ root });
      assert.deepEqual(pkg, [{ name: 'apply-harness', skipped: true, reason: 'repo-only' }]);
      const chk = checkSkills({ root });
      assert.equal(chk.ok, true);
      assert.deepEqual(chk.checked, [{ name: 'apply-harness', skipped: true, reason: 'repo-only' }]);
    });
  });

  it('passes checkSkills for self-contained skills and fails on external harness references', () => {
    withTempProject((root) => {
      const okDir = join(root, 'skills', 'clean-skill');
      mkdirSync(okDir, { recursive: true });
      writeFileSync(
        join(okDir, 'SKILL.md'),
        [
          '---',
          'name: clean-skill',
          'description: Self-contained skill.',
          '---',
          '',
          'Follow this procedure. Newer releases: https://github.com/voidbrain/project-harness',
          '',
        ].join('\n'),
      );
      assert.equal(checkSkills({ root }).ok, true);

      const badDir = join(root, 'skills', 'leaky-skill');
      mkdirSync(badDir, { recursive: true });
      writeFileSync(
        join(badDir, 'SKILL.md'),
        [
          '---',
          'name: leaky-skill',
          'description: References harness files.',
          '---',
          '',
          'Read [rules](../../AGENTS.md) and check `.harness.json` with `tools/check-freshness.mjs`.',
          '',
        ].join('\n'),
      );
      const result = checkSkills({ root });
      assert.equal(result.ok, false);
      assert.ok(result.problems.some((p) => p.includes('does not resolve inside skills/leaky-skill')));
      assert.ok(result.problems.some((p) => p.includes('AGENTS.md')));
      assert.ok(result.problems.some((p) => p.includes('.harness.json')));
      assert.ok(result.problems.some((p) => p.includes('tools/')));
    });
  });
});

const writeRepoOnlySkill = (root, body, extra = {}) => {
  const dir = join(root, 'skills', 'apply-harness');
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'SKILL.md'),
    [
      '---',
      'name: apply-harness',
      'description: Repo-only pointer.',
      'metadata:',
      '  distribution: repo-only',
      '---',
      '',
      body,
      '',
    ].join('\n'),
  );
  for (const [rel, content] of Object.entries(extra)) {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    writeFileSync(join(dir, rel), content);
  }
};

const writePackage = (root, scripts) => writeFileSync(join(root, 'package.json'), JSON.stringify({ scripts }));

describe('skills stay valid across releases (F-089)', () => {
  it('names the scripts and repository files in a skill text', () => {
    const refs = namedReferences(
      'Run `npm run check:backlog`, read `APPLY.md`, [rules](docs/BACKLOG-RULES.md), `tools/x.mjs` and README.md; `src/app.ts` is not ours.',
    );
    assert.deepEqual(refs.scripts, ['check:backlog']);
    assert.deepEqual(refs.paths, ['APPLY.md', 'README.md', 'docs/BACKLOG-RULES.md', 'tools/x.mjs']);
  });

  it('fails a repo-only skill when a script it names is renamed', () => {
    withTempProject((root) => {
      writeFileSync(join(root, 'APPLY.md'), '# Apply\n');
      writeRepoOnlySkill(root, 'Read `APPLY.md`, then run `npm run check:backlog`.');
      writePackage(root, { 'check:backlog': 'node tools/check-backlog.mjs' });
      assert.equal(checkSkills({ root }).ok, true);

      writePackage(root, { 'backlog:check': 'node tools/check-backlog.mjs' });
      const result = checkSkills({ root });
      assert.equal(result.ok, false);
      assert.deepEqual(result.problems, [
        'skills/apply-harness/SKILL.md: names "npm run check:backlog", which package.json does not define',
      ]);
    });
  });

  it('fails a repo-only skill when a tool or document it names is missing from the release', () => {
    withTempProject((root) => {
      writeRepoOnlySkill(root, 'Read `APPLY.md` and [rules](../../docs/RULES.md); run `tools/apply.mjs`.');
      const result = checkSkills({ root });
      assert.equal(result.ok, false);
      assert.ok(result.problems.some((p) => p.includes('"APPLY.md", which does not exist')));
      assert.ok(result.problems.some((p) => p.includes('"tools/apply.mjs", which does not exist')));

      writeFileSync(join(root, 'APPLY.md'), '# Apply\n');
      mkdirSync(join(root, 'tools'));
      writeFileSync(join(root, 'tools', 'apply.mjs'), '');
      assert.equal(checkSkills({ root }).ok, true);
    });
  });

  it('leaves the consumer examples under templates/ unchecked', () => {
    withTempProject((root) => {
      writeRepoOnlySkill(root, 'Fill in the template.', { 'templates/map.json': '{"verify": "npm run docs:build"}' });
      writePackage(root, {});
      assert.equal(checkSkills({ root }).ok, true);
    });
  });

  it('lists skills that name a changed file, directly or through a script that runs it', () => {
    withTempProject((root) => {
      writeRepoOnlySkill(root, 'Read `APPLY.md` and run `npm run check:backlog`.');
      const other = join(root, 'skills', 'other');
      mkdirSync(other, { recursive: true });
      writeFileSync(join(other, 'SKILL.md'), '---\nname: other\ndescription: Unrelated.\n---\n\nNothing here.\n');
      writePackage(root, { 'check:backlog': 'node tools/check-backlog.mjs' });

      assert.deepEqual(
        affectedSkills({ root, changed: ['APPLY.md', 'tools/check-backlog.mjs', 'docs/APPLY.md.bak'] }),
        [{ skill: 'apply-harness', files: ['APPLY.md', 'tools/check-backlog.mjs (npm run check:backlog)'] }],
      );
      assert.deepEqual(affectedSkills({ root, changed: ['README.md'] }), []);
    });
  });

  it('reads the changed files since a release tag from git', () => {
    withTempProject((root) => {
      const run = (...args) => execFileSync('git', args, { cwd: root, stdio: 'pipe' });
      run('init', '-q');
      run('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-q', '--allow-empty', '-m', 'base');
      run('tag', 'v1.0.0');
      writeFileSync(join(root, 'APPLY.md'), '# Apply\n');
      run('add', 'APPLY.md');
      assert.deepEqual(changedSince(root, 'v1.0.0'), ['APPLY.md']);
    });
  });
});
