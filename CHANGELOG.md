# Changelog

Releases of the project harness. Each release is a git tag `vX.Y.Z`; projects record the release they were last reconciled with in `.harness.json` (`version`), and `tools/check-harness.mjs` compares the two at every session start.

Versioning: **major** when a project must change its own files to keep passing (a new required record field, a renamed script or file); **minor** for new optional files, checks or rules; **patch** for wording and fixes that need no action.

## 1.7.0, 2026-10-29

From a second outside review (2026-10-29): the guards now check what their messages claim.

- **Archives keep every line.** `check-backlog` compares each archive with the published default branch line by line: every published line must still be there, unchanged and in order. New records may go anywhere; a correction is a dated note. 1.6.0 compared only record IDs and the count of closed rows, so an emptied record or a replaced row passed while the message said "keep everything".
- **check-freshness** lists every first-parent commit since the backlog's commit that changes more than records, whatever its message: a PR number comes from the message, else from `gh` (`commits/<sha>/pulls`) when it is available, else the commit is listed by hash to review. Rebase merges and direct pushes were skipped silently. A failed fetch is reported instead of "Fresh"; the check still never fails.
- Projects: copy `tools/check-backlog.mjs` and `tools/check-freshness.mjs`; reconcile the session-start bullet in AGENTS and the BACKLOG-RULES lines on the freshness trigger and archives; move `version` to 1.7.0. If `check-backlog` now fails, an archive was edited: restore the published lines and add the change as a dated note.

## 1.6.0, 2026-10-29

- **Archives only grow.** `check-backlog` fails when a record (`### ID`) or closed row (`| 🔵 |`) that an archive has on the published default branch is missing locally, or the archive file is gone. An agent's rewrite had replaced whole archives with their newest records (B-001); this catches it in the PR.
- Projects: copy `tools/check-backlog.mjs`; move `version` to 1.6.0. If `check-backlog` now fails, restore the archive from git history before anything else.

## 1.5.0, 2026-10-29

From an outside review of the harness (2026-10-29): lighter where it cost nothing, and the tools proven.

- **Failing tests.** The AGENTS template no longer calls a test that fails after a code change "stale": a failing test is checked against the intended behaviour, and its expectation changes only when the requirement did.
- **check-freshness** compares with the published default branch (`origin/<branch>`), not the local checkout, so PRs merged on GitHub are found while the local branch is behind; the branch is `defaultBranch` in `.harness.json`, else the remote's HEAD, else `main`. Squash and rebase merges (`Title (#N)`) count as well as merge commits. Audit age is a setting, `freshness.auditDays` (default 7).
- **ci-status** names the repository's default branch instead of assuming `main`, and no longer claims CI does not run elsewhere.
- **check-harness** reports a malformed `.harness.json` instead of crashing. All tools resolve their paths with `fileURLToPath`, so paths with spaces work.
- **check-conventions** says it is a text-pattern heuristic and that a false result is a defect of the check.
- This repository: `tools/test-tools.mjs` (`npm run test:tools`, in CI) runs the copied tools against throwaway git repositories: releases, conflicts, forks and `--merge`, malformed stamps, missing, stale, dirty or unreachable template clones, merge and squash detection, a behind local branch, a non-`main` default branch, audit age, backlog tables. Against the 1.4.0 tools, 12 of its 14 tests fail.
- Projects: copy `tools/check-freshness.mjs`, `check-harness.mjs`, `ci-status.mjs` (Angular: `check-conventions.mjs`); reconcile `AGENTS.md` (the failing-test bullet, the audit bullet) from `core/AGENTS.md`; add `"freshness": { "auditDays": 7 }` to `.harness.json` if you want a different cadence; move `version` to 1.5.0.

## 1.4.0, 2026-10-29

- **Project overrides**: a project can change a harness rule or tool for itself and keep receiving releases (APPLY.md, "Project overrides"). A setting in `.harness.json` first; a rule in an adapted file is marked with a `> Project override (harness rule: …)` line, which `check-harness` counts when that file's template source changes; a copied tool can be **forked**: listed under `forked` in `.harness.json` with its source, base release and reason. `check-harness` three-way merges a fork with each template release (clean or CONFLICT), and `--merge` writes the merge and moves the base of clean ones forward.
- Projects: copy `tools/check-harness.mjs`; reconcile `AGENTS.md` (Work tracking: the copied-tool and harness-change bullets) from `core/AGENTS.md`; add `"forked": {}` to `.harness.json` if you like; move `version` to 1.4.0.

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
