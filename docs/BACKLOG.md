# Project harness backlog

Current work ledger, reviewed 11 November 2026 against main `45fe1a6`. F-053–F-055 closed in v5.3.0 (F-054 thresholds confirmed, PR #116); F-056 actual effort column implemented for 5.4.0. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

<!-- totals:start -->
**Remaining effort:** 0.25 days across 1 open step of 1 feature. Generated from the task files.
<!-- totals:end -->

[Linked prerequisites and unlocks](agents/backlog-dependencies.md) · [Work queue](agents/backlog-queue.md).

## Bugs and reliability

## Features and improvements

### F-056

**Actual effort next to baseline and remaining in the steps table**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Fresh-context review, then release 5.4.0.

| | |
|---|---|
| **Issue** | The steps table shows remaining and baseline effort but not the time already spent, so completed and partly done steps cannot be compared with their estimate at a glance. Owner request 2026-11-11: add a column with completed or partial work time, ordered Baseline, Actual, Remaining; a step without a recorded actual shows 0. |
| **Reproduce** | Render a feature with feature plans in 5.3.0: the table has Remaining, Baseline and Status only, and `actualDays` is refused on a step that is not closed. |
| **Check** | The steps table reads Step, Baseline, Actual, Remaining, Status; Actual shows `actualDays` with its source, marked "so far" for open steps, or 0 days when none is recorded; started steps may record `actualDays`, planned ones may not; the total row and backlog total add recorded actual effort; calibration uses recorded actuals of closed steps only; release with CHANGELOG and APPLY. |

**Feature steps** (baseline: accepted estimate; actual: effort spent, so far while open; status is not parent acceptance)

| Step | Baseline | Actual | Remaining | Status |
|---|---|---|---|---|
| F-056-T01 — Actual effort column and partial actual effort | 0.5 days | 0 days | 🟢 Small — 0.25 days | Implemented; verification pending |
| **Total** | 0.5 days | 0 days (0 of 1 steps recorded) | 0.25 days | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

**Step estimates** (dated basis; generated from the task files)

- F-056-T01: 0.25 day: review and release (2026-11-11). Estimated 2026-11-11 at 0.5 focused day (one rendering change and a validation rule); implemented the same day, review and release remain. Estimate, not a measurement.

**Next action / closure evidence:** F-056-T01 implemented ([PR #117](https://github.com/voidbrain/project-harness/pull/117)); review, release 5.4.0. Closes on the release tag after green CI.

**Estimates:** Small remaining effort: review and release. Estimated 2026-11-11 at 0.5 focused day. Estimates, not measurements.

| Field | Value |
|---|---|
| PR / evidence | [PR #117](https://github.com/voidbrain/project-harness/pull/117) (CI 43070967196). Review: fresh-context design review (Opus), no blocker; should-fix (the total row showed a bare 0 days when no step recorded an actual, reading as measured; docs did not say a row's 0 means not recorded) fixed in the follow-up PR with its regression committed first. Test: tools/test-work-items.mjs "F-056: the steps table shows baseline, actual (final or so far) and remaining; totals add actual effort"; three 5.3.0 assertions changed because this record's Check reorders the columns and allows actual effort on started steps. |
| Opened | 2026-11-11 |
| Verification | Pending |
| Reviewed | 2026-11-11 |

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
