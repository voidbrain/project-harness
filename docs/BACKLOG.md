# Project harness backlog

Current work ledger, reviewed 12 November 2026 against main `1fe7c49`. F-059: one priority-ordered list and a fuller summary table, for 5.7.0. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

<!-- totals:start -->
**Remaining effort:** 0.75 h across 2 open steps of 1 feature. 1.25 h of actual effort recorded on 1 step. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### F-059

**One priority-ordered list and a fuller record summary table**

| Signal | Priority | Status | Effort | Remaining | Depends on | Unlocks | Human action |
|:---:|---|---|---|---|---|---|:---:|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | 0.75 h | — | — | 💻 No |

💻 **→** Fresh-context review, then release 5.7.0.

| | |
|---|---|
| **Issue** | Owner, 2026-11-12: the ledger is still grouped in Bugs and reliability and Features and improvements although it is ordered by priority; merge the two. Add the total remaining time after the Effort cell, and move Depends on, Unlocks and Human action required (icon + Yes/No in the cell) into the same summary table. |
| **Reproduce** | Run `work-items build` in a project with source-owned records and `workItems.order: "queue"`: bugs and features are two lists, and Depends on / Unlocks and the human cue sit outside the summary table. |
| **Check** | A `{"records": "all"}` segment lists bugs and features as one list in queue order; the generated summary table reads Signal, Priority, Status, Effort, Remaining, Depends on, Unlocks, Human action; the human line keeps icon and sentence; sources and archives keep the authored form and every reader (check-backlog, queue, solution) accepts both; rules, APPLY and CHANGELOG; released as 5.7.0. |

**Feature steps** (baseline: accepted estimate; actual: effort spent, so far while open; h: agent hours, owner time apart; status is not parent acceptance)

| Step | Baseline | Actual | Remaining | Status |
|---|---|---|---|---|
| F-059-T01 — Single list segment and extended summary table | 1.5 h | 1.25 h so far (stated) | 🟢 Small — 0.25 h | Implemented; verification pending |
| F-059-T02 — Rules, adoption note and release 5.7.0 | 0.5 h | 0 h | 🟢 Small — 0.5 h | Ready |
| **Total** | 2 h | 1.25 h (1 of 2 steps recorded) | 0.75 h | 0 of 2 completed |

<details>
<summary>Next action, estimates and evidence</summary>

**Step estimates** (dated basis; generated from the task files)

- F-059-T01: 0.25 h remaining (review fixes) (2026-11-12). Implemented 2026-11-12 in about 1.25 agent hours (stated); baseline 1.5 agent hours judged from F-057, which changed the same renderer.
- F-059-T02: 0.5 h (2026-11-12). Docs written with T01; remaining is review and tag. Judged 2026-11-12 from the F-058 release (0.75 h baseline).

**Next action / closure evidence:** F-059-T01 and F-059-T02 implemented; open the PR, fresh-context review, release 5.7.0. Closes on the release tag after green CI.

**Estimates:** Small remaining effort: about 0.75 agent hours for review fixes and release. Estimated 2026-11-12 at 2 agent hours. Estimates, not measurements.

| Field | Value |
|---|---|
| PR / evidence | — . Test: tools/test-work-items.mjs "F-059: one list for bugs and features…", tools/test-tools.mjs check-backlog generated table cases, tools/test-profiles.mjs "F-059: the dashboard reads the human cue…"; the two F-057 placement tests changed their expectation because the owner moved Depends on / Unlocks into the table. |
| Opened | 2026-11-12 |
| Verification | Pending |
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

Each item shows its ID and title, a signal table (priority, status, remaining effort), Human action required (🧑 Yes / 💻 No), and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Status and verification evidence describe progress; effort is an estimate of work still required. A `---` line ends every item.
