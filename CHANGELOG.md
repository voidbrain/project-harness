# Changelog

Releases of the project harness. Each release is a git tag `vX.Y.Z`; projects record the release they were last reconciled with in `.harness.json` (`version`), and `tools/check-harness.mjs` compares the two at every session start.

Versioning: **major** when a project must change its own files to keep passing (a new required record field, a renamed script or file); **minor** for new optional files, checks or rules; **patch** for wording and fixes that need no action.

## 1.3.0, 2026-10-29

- **Changing the harness from a project.** APPLY.md has a new section saying where a change asked in a project belongs: a setting goes in `.harness.json`, project content stays in the adapted file, and a copied tool or a rule for every project is changed and released in the template first, then reconciled. The AGENTS template's Work tracking and the `apply-harness` skill point to it.
- Projects: reconcile `AGENTS.md` (Work tracking: the harness-change bullet) from `core/AGENTS.md`; move `version` to 1.3.0. No copied file changed.

## 1.2.0, 2026-10-29

- **Online first.** APPLY.md step 0, the AGENTS template and the skill: pull the published template (`git pull --ff-only --tags`) and confirm a clean tree before applying, reconciling or changing it. `check-harness` now warns when the remote cannot be reached, the clone is behind or ahead of it, has uncommitted changes, has no remote, or is missing (quiet in CI).
- `check-harness` reports a template file that is new since the project's release as "new, adopt it if it fits" instead of "changed".
- **The template follows its own harness**: root AGENTS, CLAUDE, area notes, backlog and rules, style guide, audits, archive, `.harness.json` (stamped with its own releases), `package.json` scripts, a `CI` workflow, and `tools/check-template.mjs` (one version everywhere, copied tools identical to `core/tools/`, stamp entries exist, syntax, root-doc links and placeholders).
- Projects: copy `tools/check-harness.mjs`; reconcile `AGENTS.md` (Work tracking, harness bullet) from `core/AGENTS.md`; move `version` to 1.2.0.

## 1.1.1, 2026-10-29

- The template is published at https://github.com/voidbrain/project-harness; `core/.harness.json` names it as `template.repo`, so `check-harness` can fetch new release tags. Projects: set `template.repo` and move `version` to 1.1.1; no file changes.

## 1.1.0, 2026-10-29

- Versioning: `VERSION`, this changelog, release tags, and a `.harness.json` stamp in each project (template path, version, stacks, copied and adapted files, project settings).
- `tools/check-harness.mjs`: says per file what to update, what conflicts and what to reconcile by hand; `check-freshness` runs it, so every session start checks the template.
- Project settings moved out of the copied scripts into `.harness.json`: `conventions.pureDirs` (check-conventions), `ciStatus` (workflow name, browser jobs, extra log notes). Copied scripts are now byte-identical in every project.
- Optional `docs/DESIGN.md` slot: what the product does (game design, domain model), with numbers left in the code.
- APPLY.md: merge an art-direction doc into the style guide, deploy notes into the README; a "Reconciling" procedure.

## 1.0.0, 2026-10-29

- First release, extracted from OpenBando: CLAUDE, AGENTS, area notes, backlog and rules, style guide, audits, archive, README sections; `check-backlog`, `check-freshness`, `ci-status`; Angular add-on (AGENTS section, ESLint, Prettier, CI, `check-conventions`). First applied to marginalia-wars (#8).
