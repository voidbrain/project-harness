# Changelog

Releases of the project harness. Each release is a git tag `vX.Y.Z`; projects record the release they were last reconciled with in `.harness.json` (`version`), and `tools/check-harness.mjs` compares the two at every session start.

Versioning: **major** when a project must change its own files to keep passing (a new required record field, a renamed script or file); **minor** for new optional files, checks or rules; **patch** for wording and fixes that need no action.

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
