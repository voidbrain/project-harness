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
          'metadata:',
          '  version: "1.0.0"',
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
      assert.ok(result.problems.some((p) => p.includes('link "../../docs/RULES.md" does not exist')));

      writeFileSync(join(root, 'APPLY.md'), '# Apply\n');
      mkdirSync(join(root, 'tools'));
      writeFileSync(join(root, 'tools', 'apply.mjs'), '');
      mkdirSync(join(root, 'docs'));
      writeFileSync(join(root, 'docs', 'RULES.md'), '# Rules\n');
      assert.equal(checkSkills({ root }).ok, true);
    });
  });

  it('checks paths in prose and fenced blocks, anchors and directories, and bare names under docs/', () => {
    withTempProject((root) => {
      const body = ['Run node tools/gone.mjs, then:', '', '```sh', 'node tools/fenced.mjs', '```', ''];
      body.push('See `docs/x.md#part`, `docs/agents/` and BACKLOG-RULES.md.');
      writeRepoOnlySkill(root, body.join('\n'));
      const problems = checkSkills({ root }).problems.join('\n');
      for (const name of ['tools/gone.mjs', 'tools/fenced.mjs', 'docs/x.md', 'docs/agents/', 'BACKLOG-RULES.md']) {
        assert.ok(problems.includes(`"${name}", which does not exist`), name);
      }
      mkdirSync(join(root, 'tools'));
      mkdirSync(join(root, 'docs', 'agents'), { recursive: true });
      for (const file of ['tools/gone.mjs', 'tools/fenced.mjs', 'docs/x.md', 'docs/BACKLOG-RULES.md']) {
        writeFileSync(join(root, file), '');
      }
      assert.equal(checkSkills({ root }).ok, true);
    });
  });

  it('fails a published skill that names a script this release does not define', () => {
    withTempProject((root) => {
      const dir = join(root, 'skills', 'published');
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, 'SKILL.md'),
        '---\nname: published\ndescription: Published.\nmetadata:\n  version: "1.0.0"\n---\n\nRun `npm run check:backlog`.\n',
      );
      writePackage(root, { 'check:backlog': 'node x.mjs' });
      assert.equal(checkSkills({ root }).ok, true);
      writePackage(root, {});
      assert.deepEqual(checkSkills({ root }).problems, [
        'skills/published/SKILL.md: names "npm run check:backlog", which package.json does not define',
      ]);
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
        [
          {
            skill: 'apply-harness',
            files: ['APPLY.md', 'tools/check-backlog.mjs (npm run check:backlog)'],
            changed: false,
            published: false,
            version: null,
            versionAtBase: null,
            staleVersion: false,
          },
        ],
      );
      assert.deepEqual(affectedSkills({ root, changed: ['README.md'] }), []);
      assert.deepEqual(affectedSkills({ root, changed: ['docs/APPLY.md'] })[0].files, ['docs/APPLY.md']);
    });
  });

  it('marks published skills whose own files changed for a new upload', () => {
    withTempProject((root) => {
      writeRepoOnlySkill(root, 'Nothing named.');
      const other = join(root, 'skills', 'other');
      mkdirSync(other, { recursive: true });
      writeFileSync(join(other, 'SKILL.md'), '---\nname: other\ndescription: Published.\n---\n\nText.\n');
      const versionAtBase = () => '1.0.0';
      assert.deepEqual(
        affectedSkills({ root, changed: ['skills/other/SKILL.md', 'skills/apply-harness/SKILL.md'], versionAtBase }),
        [
          {
            skill: 'apply-harness',
            files: [],
            changed: true,
            published: false,
            version: null,
            versionAtBase: '1.0.0',
            staleVersion: false,
          },
          {
            skill: 'other',
            files: [],
            changed: true,
            published: true,
            version: null,
            versionAtBase: '1.0.0',
            staleVersion: false,
          },
        ],
      );
    });
  });

  it('reads the changed files since a release tag from git', () => {
    withTempProject((root) => {
      const run = (...args) => execFileSync('git', args, { cwd: root, stdio: 'pipe' });
      run('init', '-q');
      run('add', '.');
      run('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-q', '-m', 'base');
      run('tag', 'v1.0.0');
      writeFileSync(join(root, 'APPLY.md'), '# Apply\n');
      run('add', 'APPLY.md');
      assert.deepEqual(changedSince(root, 'v1.0.0'), ['APPLY.md']);
      run('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-q', '-m', 'apply');
      run('tag', 'v1.1.0');
      run('mv', 'APPLY.md', 'INSTALL.md');
      writeFileSync(join(root, 'NEW.md'), '# New\n');
      assert.deepEqual(changedSince(root, 'v1.0.0'), ['INSTALL.md', 'NEW.md']);
      assert.deepEqual(changedSince(root, 'v1.1.0'), ['APPLY.md', 'INSTALL.md', 'NEW.md']);
      assert.throws(() => changedSince(root, '--output=x'));
    });
  });

  it('fails a published skill without its own metadata.version', () => {
    withTempProject((root) => {
      const dir = join(root, 'skills', 'unversioned');
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'SKILL.md'), '---\nname: unversioned\ndescription: Published.\n---\n\nText.\n');
      assert.deepEqual(checkSkills({ root }).problems, [
        'skills/unversioned/SKILL.md: a published skill needs its own metadata.version',
      ]);
    });
  });

  it('flags a changed published skill whose metadata.version is still the one at the base tag', () => {
    withTempProject((root) => {
      const dir = join(root, 'skills', 'pub');
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, 'SKILL.md'),
        '---\nname: pub\ndescription: P.\nmetadata:\n  version: "1.0.0"\n---\n\nText.\n',
      );
      const changed = ['skills/pub/SKILL.md'];
      assert.equal(affectedSkills({ root, changed, versionAtBase: () => '1.0.0' })[0].staleVersion, true);
      assert.equal(affectedSkills({ root, changed, versionAtBase: () => '0.9.0' })[0].staleVersion, false);
      assert.equal(affectedSkills({ root, changed, versionAtBase: () => null })[0].staleVersion, false);
    });
  });
});
