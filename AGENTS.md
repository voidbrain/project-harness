## Project conventions (Project harness)

This repository is the **project harness**: a versioned template of agent instructions, backlog procedure, style guide and checks that other projects apply and then follow. The repository is `voidbrain/project-harness`; its releases are tags `vX.Y.Z` with the same number in `VERSION` and an entry in [CHANGELOG.md](CHANGELOG.md). It follows its own harness: everything it prescribes to a project applies here too.

### Architecture

- `core/` and `angular/` are **template files**: what projects receive. They hold `{{PLACEHOLDERS}}` and `<!-- harness: … -->` notes on purpose, and their links are relative to an applied project, not to this repository.
- Everything else at the root (this file, `README.md`, `APPLY.md`, `CHANGELOG.md`, `docs/`, `tools/`, `.harness.json`) is **this repository's own harness**. It holds no placeholders.
- `tools/check-backlog.mjs`, `check-freshness.mjs`, `check-harness.mjs` and `ci-status.mjs` are copies of `core/tools/`, as in any project; `check-template.mjs` is this repository's own check. Change a copied tool in `core/tools/` and copy it to `tools/`; `check:template` fails if they differ.
- A copied tool never carries a project setting: settings live in `.harness.json` and the tool reads them. A change that makes a project edit a copied file is a design defect here.
- Releases are versioned as the CHANGELOG says: major when projects must change their own files to keep passing, minor for new optional files, checks or rules, patch for wording and fixes.

### Style guide

- Read [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) before writing template text or docs.

### Adding things

- **A rule for every project**: in the `core/` file that owns it (AGENTS template, BACKLOG-RULES, STYLE-GUIDE), the same rule in this repository's own copy when it applies here, a CHANGELOG line, and a step in [APPLY.md](APPLY.md) if applying or reconciling changes.
- **A check**: the script in `core/tools/` (copied) reading its settings from `.harness.json`, the setting in `core/.harness.json` or the stack fragment, the file in `copied`, the npm script in `angular/package-scripts.json`, the CI step in `angular/.github/workflows/ci.yml`, a row in the README table.
- **A stack add-on**: a folder like `angular/` with its AGENTS section, tools, config and a `.harness.fragment.json`; a step in APPLY.md, "Choose the stack add-ons".

### Checks before you finish

Open every change as a PR against `main`.

```bash
npm run check:freshness   # first, at session start: online latest, backlog behind main, merged branches, audit age
npm run check:template    # VERSION, CHANGELOG, stamps, copied tools, syntax, links
npm run check:backlog     # active record layout and lifecycle cues
```

- A change to a copied tool is tried in a real project before release: copy it in, run that project's checks, compare the output with the old tool's.
- Do not leave dead template text behind: a removed rule goes from every file that mentions it.

### Releasing

1. **Online first**: `git pull --ff-only --tags` on `main`, clean tree, then branch.
2. Change, add the CHANGELOG entry, set `VERSION` and this repository's `.harness.json` `version` to the new release, copy `core/tools/` to `tools/`, record the change in the backlog.
3. `npm run check:template` and `npm run check:backlog`; PR; CI green.
4. After merge: `git switch main && git pull --ff-only`, `git tag -a vX.Y.Z -m "…"`, `git push origin vX.Y.Z`. A release exists only once its tag is on GitHub; projects pick it up at their next session start.

## Area notes

Before changing an area, read its section in [docs/agents/areas.md](docs/agents/areas.md).

| Area | Covers |
|---|---|
| Template content | `core/`, `angular/`: the files projects receive |
| Tools | the copied checks and their settings in `.harness.json` |
| Procedure | `APPLY.md`, the skill, versioning and reconciling |

## Work tracking

**At the start of every session, before other work, run `npm run check:freshness`** and do what it lists, in the session's first PR:
- the template clone is behind, ahead of or unreachable from GitHub: pull or push first; never change a stale clone;
- the backlog is behind `main`: read the CI of the PRs merged since (`npm run ci:status -- <numbers>`), update or close their records, archive closed ones, move the header to the current `main`;
- merged branches are still on GitHub: delete them;
- the newest audit in `docs/audits/` is more than 7 days old: audit what changed since (template text, tools, procedure, the projects that apply it) and write `docs/audits/<date>.md`.

- [docs/BACKLOG.md](docs/BACKLOG.md) is the source of truth for status; [docs/BACKLOG-RULES.md](docs/BACKLOG-RULES.md) is the procedure. Update the affected records in the same PR as the change, and run `npm run check:backlog`.
- Keep a confirmed bug, a candidate fix, an unimplemented feature and a completed check distinct. A merge is not a release: the tag is.
