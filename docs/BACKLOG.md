# Project harness backlog

Current work ledger, reviewed 13 November 2026 against main `eb83f78`. v8.3.0 published (PR #149, green CI): F-068 closed and archived; v8.2.0 (PR #147, #148) before it. The open PR #139 (F-066) needs a new release number.

<!-- totals:start -->
**Remaining effort:** 2.25 h across 4 open steps of 1 feature. 3.25 h of actual effort recorded on 4 steps. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-069"></a>[✨ F-069](#top)

**Bounded test timeouts, scope-step reconciliation, and initial agent-speed sizing (v8.5.0)**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟢 Verified | 🔶 P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: merge PR and tag `v8.5.0` on `main`.

| | |
|---|---|
| **Issue** | Unclosed handles hang `node --test` indefinitely; non-closed records with all steps closed linger without reconciliation; multi-hour baselines drift far from agent speed. |
| **Reproduce** | Leave an open handle in `node --test`, close all steps of an `Open` record, or calibrate `0.25 h` actuals against `1.5 h` baselines. |
| **Check** | `core/docs/agents/verification.md` states bounded test timeouts; `core/docs/BACKLOG-RULES.md` requires scope↔step reconciliation and `0.25 h–0.5 h` initial agent-step baselines; `work-items check` reports `allStepsClosed` on non-closed records with all steps closed. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| — | F-069-T01 — Release 8.5.0: bounded timeouts, scope-step reconciliation, and agent-speed sizing | 0.5 h | 0.25 h (stated) | 0 h | Completed |
| — | **Total** | 0.5 h | 0.25 h | 0 h | 1 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-069.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #152](https://github.com/voidbrain/project-harness/pull/152) (v8.5.0) |
| Opened | 2026-11-13 |
| Verification | 2026-11-13: `npm run test:tools`, `npm run check:template`, `npm run format:check`, `npm run lint`, `npm run check:backlog` |
| Reviewed | 2026-11-13 |

</details>

---
### <a id="f-066"></a>[✨ F-066](#top)

**Parallel PRs stop conflicting on shared backlog files**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟡 Medium | 2.25 h | — | — | ⏳ | — | — |

💻 **→** Next: fresh-context review of the PR, merge, tag v8.4.0 (F-066-T04).

| | |
|---|---|
| **Issue** | Owner, 2026-11-12, from a project running several agents: nearly every PR conflicts with `main`, and the conflicts are in three files every PR edits: the generated ledger, the authored header line in the layout ("reviewed against main `sha`, PRs … passed CI"), and the feature record that every step PR of a parallel feature edits (steps, PR row, next action). Even sequential PRs from one agent conflict, because each branch is cut before the previous PR merges. The owner chose three of four proposed changes (not the published-ledger option): union merge for append-only files, a generated header, per-step evidence in the task files. |
| **Reproduce** | Open two PRs from `main` that each close a record or add a step; merge one; the other conflicts in docs/BACKLOG.md, docs/work/layout.json and docs/archive/*.md although its sources do not overlap. |
| **Check** | `docs/archive/*.md` carry `merge=union` through a copied `gitattributes.txt`; a layout segment `{"header": "docs/archive"}` renders the header from the newest `## <date> — main `<sha>`` entry of the reconciliation log and `check-freshness` still reads it; a task file may carry `prs` and `review`, shown in the generated steps table and PR / evidence cell, and a `💻` line reading `Next: from tasks.` gets its sentence from the next open step; both BACKLOG-RULES copies, APPLY step, CHANGELOG; tests for each; all optional (minor release). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | F-066-T01 — Union merge for append-only files | 0.5 h | 0.25 h so far (stated) | 0.25 h | Implemented; verification pending |
| 🟢 Small | F-066-T02 — Header generated from the reconciliation log | 2 h | 1.25 h so far (stated) | 0.25 h | Implemented; verification pending |
| 🟢 Small | F-066-T03 — Per-step evidence in the task file and a generated next action | 2.5 h | 1.5 h so far (stated) | 0.25 h | Implemented; verification pending |
| 🟡 Medium | F-066-T04 — Release 8.4.0 | 1.5 h | 0 h | 1.5 h | Planned |
| 🟡 Medium | **Total** | 6.5 h | 3 h (3 of 4 steps recorded) | 2.25 h | 0 of 4 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-066.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #151](https://github.com/voidbrain/project-harness/pull/151), which supersedes [PR #139](https://github.com/voidbrain/project-harness/pull/139) after it conflicted with 8.2.0 and 8.3.0: the same change merged with `main` and renumbered from 8.1.0 to 8.4.0 (owner approval, 2026-11-13). Review: fresh-context reviewer on PR #151 (2026-11-13) recommended acceptance with no blockers and 1 should-fix (`CHANGELOG.md` 8.1.0 → 8.4.0, fixed); earlier fresh-context reviewer on #139 (Opus) found no blocker, 3 should-fix fixed (wrapped summary paragraph read whole; step reviews render as `step review:` and record-level labels refused; `prs`, `review` and marker require `featurePlans`), 3 notes taken. Tests: `npm run test:tools` 211 passed (header segment, step evidence, next-from-tasks, validation refusals). |
| Opened | 2026-11-12 |
| Verification | `npm run test:tools` (211 passed), `npm run check:template`, `npm run check:backlog`, `npm run format:check`, `npm run lint` passed after final edit. |
| Reviewed | 2026-11-13 |

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
