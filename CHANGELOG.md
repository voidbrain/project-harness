# Changelog

Releases of the project harness. Each release is a git tag `vX.Y.Z`; projects record the release they were last reconciled with in `.harness.json` (`version`), and `tools/check-harness.mjs` compares the two at every session start.

Versioning: **major** when a project must change its own files to keep passing (a new required record field, a renamed script or file); **minor** for new optional files, checks or rules; **patch** for wording and fixes that need no action.

## 1.12.0, 2026-10-29

From openbando again, the owner's words: "changes this impact that, requires re-executing this and that"; and a promised full table that was never written down.

- **Chains in the impact map.** A row has an `id` and may list `after` ids: when a row it names must run again, so must this one (a catalogue rebuilt → the examples that use it). `check-freshness` lists the rows a branch sets off, chains included, in the order to run them ("Impact 1/3 (catalogue): …", "Impact 2/3 (examples): … after catalogue").
- **The map as a page.** New copied tool `tools/impact-map.mjs`: `plan()` (used by `check-freshness`) and, run directly, `docs/agents/impact-map.md`, the rows as a table with their chains; the Angular CI step "Impact map page matches the rows" keeps it equal to the rows (here too).
- **Complete, fine-grained rows** (core AGENTS, "What follows a change"; APPLY): every derived thing has a row (generated pages and data, recordings, translations, guides, feature docs), as fine as the code names it; a derived thing found without a row gets one in the same PR.
- **Plans become records** (core AGENTS, Work tracking; BACKLOG-RULES, When to update): a plan or promise given to the user becomes backlog records in the same change, and the reply names them. Nothing promised lives only in the conversation.
- Projects: copy `tools/check-freshness.mjs` and the new `tools/impact-map.mjs` (add it to `copied`); give each impact row an `id` and its `after` chains; run `node tools/impact-map.mjs` and add the CI step and the `impact-map` npm script (Angular: from `angular/`); reconcile AGENTS ("What follows a change", the Work tracking bullet) and BACKLOG-RULES; move `version` to 1.12.0.

## 1.11.0, 2026-10-29

- **Impact map.** `impact` in `.harness.json` lists what must follow a change: `{ "when": [file globs], "then": "what must follow", "run": "command", "checked": "what verifies it" }` (a generated page, a translation, a recording, a guide). `check-freshness` lists the rows a branch triggers, locally and as warnings on every PR; it never fails. AGENTS ("What follows a change") and BACKLOG-RULES (Documentation consistency) point to it instead of relying on "check everything" alone. Found in openbando: a fence label written in TypeScript data had no translation and nothing noticed; clips, guide pages and tips had no record of what they follow.
- `check-freshness`: `*` matches within a path segment, `**` across segments; "nothing checks it" is said when a row has no `checked`.
- Projects: copy `tools/check-freshness.mjs`; add `"impact": []` to `.harness.json` and fill the rows the project has (APPLY.md, "Write the files"); reconcile AGENTS (the new "What follows a change") and BACKLOG-RULES (the impact-map paragraph in Documentation consistency); move `version` to 1.11.0.

## 1.10.0, 2026-10-29

From a project session where a rule for every project was written into one project's AGENTS: the decision "this project or every project?" now happens at the edit, and asking is the rule when it is unclear.

- **Changing a harness file** (core AGENTS, a new sub-section beside the PR rules): before editing a file listed in `.harness.json`, decide whether the change is this project's or every project's; the edit is the trigger, whatever the request's words (an "allow X" that changes how work is done is a rule). Unsure: ask the user before editing. Before, the trigger was "a request that adds a rule", at the end of Work tracking, and "ask" was only in APPLY.md, which a project session rarely reads.
- **check-freshness lists the harness files a branch changes** (copied, forked, `.harness.json`, and adapted files that hold rules; not README, backlog records or area notes, which are project content by design), with the question, locally and as a warning on every PR. It never fails. Silent in the template repository itself.
- **Project lines are marked.** A line a project adds inside a section that comes from the template ends with `<!-- project -->` (APPLY.md, "Project overrides", 1b); a reconcile keeps marked lines and asks about unmarked differences.
- **PR rules for every project** (core AGENTS, "Checks before you finish"; this repository's AGENTS too): never base a PR on another PR's branch; push no new work to a green PR, open a new one; a green PR that conflicts with `main` may get a push that only resolves the conflict, and its checks run again. BACKLOG-RULES: parallel PRs' backlog conflicts are resolved in the conflicting PR, keeping every record from both sides and the newer header.
- Projects: copy `tools/check-freshness.mjs`; reconcile AGENTS ("Checks before you finish", the new "Changing a harness file", the shortened Work tracking bullet) and BACKLOG-RULES; mark the project lines in template sections of adapted files; move `version` to 1.10.0.

## 1.9.0, 2026-10-29

- **Template release check in project CI.** The Angular `CI` workflow clones the template (`template.repo` in `.harness.json`; it is public, so no token) into the runner's temp folder and runs `check:freshness` with `HARNESS_HOME` pointing at it. A PR on a project that is behind a release now shows `check-harness` warnings; it still never blocks. Before, CI had no clone and skipped the check, so a project falling behind was noticed only at a local session start (F-002). A failed clone is a warning and the check is skipped.
- `check-harness`: comments only (where the clone comes from in CI).
- Projects: in `.github/workflows/ci.yml`, add the "Harness template" step before the freshness step and its `HARNESS_HOME` env (from `angular/.github/workflows/ci.yml`); copy `tools/check-harness.mjs`; move `version` to 1.9.0.

## 1.8.0, 2026-10-29

- **One repository, one backlog.** BACKLOG-RULES has a new section: a backlog tracks only its own repository's work (single responsibility), and dependencies point one way. A record may wait on an upstream release (a library, the harness template) and is Blocked on it; it never waits for the repositories that use it to adopt a change, and closes when the change is released here. Evidence from another repository (a trial in a real consumer) is recorded in Verification, never left as an open condition. Test: if a record's next action or closure condition can only happen in another repository, it is in the wrong backlog. Found here: harness release records waited for both projects to reconcile (B-002).
- APPLY.md, "Reconciling": a project records its reconcile in its own backlog.
- Projects: reconcile `docs/BACKLOG-RULES.md` (the new section, before "When to update and review") from `core/docs/BACKLOG-RULES.md`; move a record that waits on another repository's work to that repository's backlog and link it; move `version` to 1.8.0. No copied file changed.

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
