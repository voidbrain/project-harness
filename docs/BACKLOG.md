# Project harness backlog

Current work ledger, reviewed 12 November 2026 against main `f8e1469`. v8.0.0 published (PR #137, green CI; #136 green): F-065 closed and archived; no active record.

<!-- totals:start -->
**Remaining effort:** 0.25 h across 1 open step of 1 feature. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-067"></a>[✨ F-067](#top)

**A blocker is listed above what it blocks**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Procedures | Decision |
|---|---|---|---|---|---|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0.25 h | — | — | — | — |

💻 **→** Next: fresh-context review of the PR, merge on green CI, tag v8.2.0.

| | |
|---|---|
| **Issue** | Owner, 2026-11-13, from a project: the generated ledger lists a P1 record right after the first one although it depends on a lower-priority record far below, so the list does not read in working order. The order should follow the priorities and move blockers above the blocked. |
| **Reproduce** | At `b759107`, with `workItems.order: "queue"`, give a P1 record a Depends on link to an open P3 record and run `node tools/work-items.mjs build`: the P1 record is listed above its prerequisite. |
| **Check** | An open prerequisite in the same group, with its own prerequisites first, is listed just above the first record that waits on it, whatever its priority or lane; records that wait on nothing keep the priority order; the build is deterministic and `work-items check` accepts it; a test fails without the change; both BACKLOG-RULES copies, CHANGELOG 8.2.0 and an APPLY reconcile step. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | F-067-T01 — Prerequisites above their dependents in queue order | 1 h | 0 h | 0.25 h | Ready |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 0.25 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-067.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #147](https://github.com/voidbrain/project-harness/pull/147). Tests: `npm run test:tools` (F-067 test committed failing first, then passing). |
| Opened | 2026-11-13 |
| Verification | Pending. |
| Reviewed | 2026-11-13 |

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

Each item shows its ID and title, a summary table (status with its colour, priority, effort size, remaining time, Depends on, Unlocks and Procedures and Decision, 🧑 where the record waits on that kind of human action), the human or next action, and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort, from the remaining agent hours (owner time apart): 🟢 Small ≤1 h · 🟡 Medium ≤4 h · 🔴 Large ≤8 h · 🟣 Very large more; work still estimated in days: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Status and verification evidence describe progress; effort is an estimate of work still required. A `---` line ends every item.
