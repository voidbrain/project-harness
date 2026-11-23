# Project harness backlog

Current work ledger, reviewed 22 November 2026 against main `364274a` (PRs #209–#224, green CI). Released v8.18.0, v9.0.0, v10.0.0, v10.1.0; closed F-080, F-083–F-085, B-043–B-047. Open: F-075. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** no open steps. 6.5 h of actual effort recorded on 11 steps. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-075"></a>[✨ F-075](#top)

**Self-contained skills packaged for distribution outside Git (Agensi)**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔵 Closed | ◻️ P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Closed 2026-11-23: all 7 standalone skills (1.0.0) uploaded to Agensi.

| | |
|---|---|
| **Issue** | Owner request 2026-11-14: Agensi distributes skills only as self-contained zips (SKILL.md at the root with valid frontmatter, plus scripts, references and templates). A listing cannot fetch its content from GitHub, and there is no Git sync, so an update is a manual re-upload to the same listing. The harness's only skill, `skills/apply-harness`, is a pointer to this repository and cannot be listed. Seven workflows can stand alone: change impact, fresh-context review, copy-paste owner checks, failing test before the fix, architecture reassessment, task handoff and documentation hygiene. |
| **Reproduce** | Zip `skills/apply-harness`: the result tells an agent to fetch the template and read `APPLY.md`, which the zip does not contain. Owner upload steps: [f075-agensi-upload.md](checks/f075-agensi-upload.md). |
| **Check** | Each of the seven skills lives once under `skills/<name>/` and is the source both the harness and the zip use; `npm run skills:package` writes one zip per skill with `SKILL.md` at the root, `LICENSE` and a version; a check in CI fails when a skill links a file it does not bundle (`AGENTS.md`, `BACKLOG-RULES`, `tools/`, `docs/`) or needs `.harness.json` to work; each skill states its version and the repository link for newer releases; the owner uploads the first zip and records the listing. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who |
|---|---|---|---|---|---|:---:|
| — | **Total** | 5 h | 5 h (9 of 10 steps recorded) | 0 h | 10 of 10 completed | |

<details><summary>Done steps (10)</summary>

| Effort | Step | Estimate | Actual | Status |
|---|---|---|---|---|
| — | <a id="f-075-t01"></a>F-075-T01 — Skills layout and packaging script | 1 h | 1 h (stated) | Completed |
| — | <a id="f-075-t02"></a>F-075-T02 — Self-contained check in CI | 0.5 h | 0.5 h (stated) | Completed |
| — | <a id="f-075-t03"></a>F-075-T03 — Skill: change impact | 0.5 h | 0.5 h (stated) | Completed |
| — | <a id="f-075-t04"></a>F-075-T04 — Skill: fresh-context review | 0.5 h | 0.5 h (stated) | Completed |
| — | <a id="f-075-t05"></a>F-075-T05 — Skill: copy-paste owner checks | 0.5 h | 0.5 h (stated) | Completed |
| — | <a id="f-075-t06"></a>F-075-T06 — Skill: failing test before the fix | 0.5 h | 0.5 h (stated) | Completed |
| — | <a id="f-075-t07"></a>F-075-T07 — Skill: architecture reassessment | 0.5 h | 0.5 h (stated) | Completed |
| — | <a id="f-075-t08"></a>F-075-T08 — Skill: task handoff and context | 0.5 h | 0.5 h (stated) | Completed |
| — | <a id="f-075-t09"></a>F-075-T09 — Skill: documentation hygiene | 0.5 h | 0.5 h (stated) | Completed |
| — | <a id="f-075-t10"></a>F-075-T10 — Upload the first skills to Agensi and record the listings | 0 h | 0 h | Completed |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-075.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #231](https://github.com/voidbrain/project-harness/pull/231) (F-075-T03..T09); [PR #229](https://github.com/voidbrain/project-harness/pull/229) (F-075-T01, F-075-T02); [PR #167](https://github.com/voidbrain/project-harness/pull/167) (record and steps opened) |
| Opened | 2026-11-14 |
| Verification | Pending. |
| Reviewed | 2026-11-14 |

</details>

---
### <a id="f-086"></a>[✨ F-086](#top)

**Trigger CI on pushes to `main`**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔵 Closed | ◻️ P3 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: all steps closed; verify and close the record.

| | |
|---|---|
| **Issue** | `.github/workflows/ci.yml` only triggers on `pull_request`, so merges to `main` do not run CI directly (requested from downstream NERV `F-076-T05`). |
| **Reproduce** | Inspect `.github/workflows/ci.yml`: `on:` has `pull_request` without `push: branches: [main]`. |
| **Check** | `.github/workflows/ci.yml` triggers on both `pull_request` and `push: branches: [main]`, `docs/apply/write-ci.md` documents it, and `v10.2.0` is released. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| — | **Total** | 0.25 h | 0 h (0 of 1 steps recorded) | 0 h | 1 of 1 completed |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status |
|---|---|---|---|---|
| — | <a id="f-086-t01"></a>F-086-T01 — Add push: branches: &#91;main&#93; trigger to ci.yml and document in write-ci.md (v10.2.0) | 0.25 h | 0 h | Completed |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-086.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #227](https://github.com/voidbrain/project-harness/pull/227); released in `v10.2.0`; downstream trigger `NERV/F-076-T05` |
| Opened | 2026-11-22 |
| Verification | 2026-11-22: `npm run check:template`, `npm run format:check`, `npm run lint`, `npm run test:tools` (274/274) pass. |
| Reviewed | 2026-11-22 |

</details>

---
### <a id="f-087"></a>[✨ F-087](#top)

**Periodic skill discovery review in each adopting project**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔵 Closed | ◻️ P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: all steps closed; tag `v10.3.0` on `main` after merge.

| | |
|---|---|
| **Issue** | Owner request 2026-11-23: projects using the harness build domain workflows (an FPV project's warehouse, crash diary, battery manager) that could become skills, but nothing reminds a project to look for them or to refresh skills it already has. Each project owns its own skills; the harness owns only its own and the review procedure. |
| **Reproduce** | Run `npm run check:freshness` in any adopting project: no review asks it to look for skill candidates, and `core/docs/agents/skills.md` has no discovery procedure. |
| **Check** | `core/docs/agents/skills.md` has a skill discovery review: sources (repeated agent or owner work, friction notes, recurring copy-paste owner checks, domain operations with clear inputs and outputs, long procedures re-read each session, existing skills behind their code) and four outcomes recorded in the project's own backlog (project skill under `skills/<name>/`, distributable skill, generic workflow proposed to the harness through "Changing the harness from a project", not a skill with its reason); projects opt in with `reviews.skills.days` and `check:freshness` warns when `docs/reviews/skills/<date>.md` is missing or stale; APPLY's reconcile offers the setting; the harness enables it for itself; a release ships it. Adoption in each project is that project's own record, not a closure condition here. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| — | **Total** | 1.5 h | 1.5 h | 0 h | 2 of 2 completed |

<details><summary>Done steps (2)</summary>

| Effort | Step | Estimate | Actual | Status |
|---|---|---|---|---|
| — | <a id="f-087-t01"></a>F-087-T01 — Skill discovery review procedure | 1 h | 1 h (stated) | Completed |
| — | <a id="f-087-t02"></a>F-087-T02 — Offer the review on reconcile and release | 0.5 h | 0.5 h (stated) | Completed |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-087.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #230](https://github.com/voidbrain/project-harness/pull/230) (F-087-T01, F-087-T02, v10.3.0); [PR #228](https://github.com/voidbrain/project-harness/pull/228) (record and steps opened) |
| Opened | 2026-11-23 |
| Verification | Pending. |
| Reviewed | 2026-11-23 |

</details>

---
## Other changes

Earlier release notes (v2.2.2 – v4.7.0) are archived in [Reconciliation log](archive/reconciliation-2026.md#archived-other-changes-moved-from-backlogmd-on-2026-11-13).

## How to use this file

| Status | Requirements | Next statuses and conditions | Priority cue |
|---|---|---|---|
| **🔴 Open** | Reproducible bug or agreed capability; scope and next action recorded. | - **Investigate** if cause/scope is uncertain<br>- **Implemented** when code is complete<br>- **Blocked** if a named dependency prevents progress<br>- **Closed** if cancelled/superseded, with reason. | Coloured |
| **🟠 Investigate** | Report and unanswered question recorded; next diagnostic identified. | - **Open** when scope/cause is established<br>- **Implemented** when fixed<br>- **Blocked** if evidence/dependency is unavailable<br>- **Closed** if duplicate/not reproducible after documented investigation, with reason. | Coloured |
| **🟡 Implemented** | Code exists; required verification remains pending. | - **Verified** when all acceptance checks pass (automated ones: the merged PR's green CI run)<br>- Open or Investigate if a check fails<br>- **Blocked** if a required check cannot proceed. | Coloured |
| **🟢 Verified** | All acceptance checks passed; date, method and evidence recorded, including human/device checks when required. | - **Closed** when no action remains and resolution is recorded<br>- **Open** or **Investigate** if new evidence invalidates verification. Do not leave completed items here indefinitely. | Coloured |
| **🟣 Blocked** | Specific blocker, affected work/check and resume condition recorded. | - Return to **Open**, **Investigate** or **Implemented** when unblocked<br>- **Verified** only after all checks pass<br>- **Closed** if cancelled/superseded, with reason. | Grey ◻️ |
| **🔵 Closed** | Resolution recorded and item archived. | - **Open** or **Investigate** if reopened by new evidence<br>Retain ID, original Opened date and historical closure record. | Grey ◻️ |

Follow [Backlog rules](BACKLOG-RULES.md) for updating records, reconciling PR/CI evidence, stale-state review, closure/archiving, human dependencies and table validation. Preserve stable IDs and existing user edits.

Each item shows its ID and title, a summary table (status with its colour, priority, effort size, remaining time, Depends on, Unlocks and Procedures and Decisions, 🧑 where the record or one of its ready steps waits on that kind of human action), the human or next action, and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort, from the remaining agent hours (owner time apart): 🟢 Small ≤1 h · 🟡 Medium ≤4 h · 🔴 Large ≤8 h · 🟣 Very large more; work still estimated in days: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Status and verification evidence describe progress; effort is an estimate of work still required. A `---` line ends every item.
