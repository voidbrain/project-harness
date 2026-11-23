import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { checkSkills, packageSkills } from './skills.mjs';

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
