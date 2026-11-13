# Project harness backlog

Current work ledger, reviewed 13 November 2026 against main `eb83f78`. v8.3.0 published (PR #149, green CI): F-068 closed and archived; v8.2.0 (PR #147, #148) before it. The open PR #139 (F-066) needs a new release number.

<!-- totals:start -->
**Remaining effort:** 2.25 h across 4 open steps of 1 feature. 3 h of actual effort recorded on 3 steps. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-066"></a>[✨ F-066](#top)

**Parallel PRs stop conflicting on shared backlog files**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟡 Medium | 2.25 h | — | — | — | — |

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
| PR / evidence | [PR #151](https://github.com/voidbrain/project-harness/pull/151), which supersedes [PR #139](https://github.com/voidbrain/project-harness/pull/139) after it conflicted with 8.2.0 and 8.3.0: the same change merged with `main` and renumbered from 8.1.0 to 8.4.0 (owner approval, 2026-11-13). The review below is of #139. Review: fresh-context reviewer (Opus), no blocker; three should-fix fixed in the PR (a wrapped summary paragraph is read whole; step reviews render as `step review:` and record-level labels are refused in step evidence; `prs`, `review` and the marker need `featurePlans`, APPLY says so) and three notes taken (fenced examples and CRLF in the log, month names without ICU); tests extended. Tests: `npm run test:tools` 208 passed (header segment: newest day, same-day ancestry, old bullets ignored, 300-character and date refusals; step evidence: PRs column with and without repository, PR / evidence prefix, next-from-tasks with prerequisites, all-closed prompt, invalid prs/review/repository refused). |
| Opened | 2026-11-12 |
| Verification | Pending. |
| Reviewed | 2026-11-12 |

</details>

---
## Other changes

Published v4.7.0 after PR #99 / CI42887014187 passed169 fixtures/check and independent review fixes. [PR #100](https://github.com/voidbrain/project-harness/pull/100) records closure. F-048 is closed and archived with completed step table and all source limitations; no active feature remains. Release closure is independently owned here, with consumer reconciliation separately owned.

Published [v4.1.0](https://github.com/voidbrain/project-harness/tree/v4.1.0) at `a8a358e` after PR #80 passed owned CI and independent review. F-046 closes on the published tag; project adoption is independently owned.

Published [v4.0.0](https://github.com/voidbrain/project-harness/tree/v4.0.0) at `bdec31f`; release record F-045 archived after green CI and fresh-context review.

Published [v3.4.0](https://github.com/voidbrain/project-harness/tree/v3.4.0), tagged on `main` `a2c90f5` after [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325). F-041–F-043 are closed and archived with their full history in [#74](https://github.com/voidbrain/project-harness/pull/74).

Published [v3.3.0](https://github.com/voidbrain/project-harness/tree/v3.3.0), tagged on `main` `a0ae25e` after [#66](https://github.com/voidbrain/project-harness/pull/66)–[#70](https://github.com/voidbrain/project-harness/pull/70) merged on green CI. F-032–F-037 are closed and archived with their history. The push guard is not installed in this clone and no behaviour-check runner is configured here: both are the owner's choice.

Published [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1): annotated tag `bea6c60140f9ecf4fb9fa75849da5578fd5667e6` resolves remotely to approved main commit `7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031`. [Publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) passed every verification/publication step, including all 72 fixtures. B-013/B-014 and F-026–F-030 are verified, closed and archived with their original IDs/dates/history. [#58](https://github.com/voidbrain/project-harness/pull/58) removes the one-time operational workflow and records closure. No release action or human dependency remains.

Full audit F-031 verified and closed 2026-10-31 after [#55](https://github.com/voidbrain/project-harness/pull/55) merged with [CI 41228352936](https://github.com/voidbrain/project-harness/actions/runs/41228352936) green. All eight areas have a dated full report/manifest; both confirmed defects are fixed with failing-before/passing-after regressions. Those records were release-pending at that review; the verified v3.1.1 publication above now closes them. Historical audit prose remains unchanged.

Published [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) at verified commit `0764a36`. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step and all 56 fixtures. B-011, B-012 and F-021–F-025 are closed and archived with their complete history. [PR #51](https://github.com/voidbrain/project-harness/pull/51) removes the one-time publication workflow. No publication blocker remains for v2.2.2. The newer cumulative release was subsequently published through the one-time workflow above. No new permission request or consumer dependency is implied.

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
