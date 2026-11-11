# Project harness backlog

Current work ledger, reviewed 11 November 2026 against main `6b6abf7`. v5.5.0 published (PRs #120, #121): F-057 closed, dependencies in each record, queue and dependency pages retired. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

<!-- totals:start -->
**Remaining effort:** 0.5 h across 2 open steps of 1 feature. Generated from the task files.
<!-- totals:end -->

## Bugs and reliability

## Features and improvements

### F-058

**Estimate in agent hours, with owner time apart, and always record actuals**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Fresh-context review, then release 5.6.0.

| | |
|---|---|
| **Issue** | Step estimates are in human focused days while agents do the work: on 2026-11-11 four delivered features took roughly 0.05–0.1 of their estimates (B-002 in gauntlet-protocol 1 day → about 45 min; F-053–F-055 7 days → about 2 h; F-056 0.5 day → about 20 min; F-057 2.5 days → about 45 min), and no actuals were recorded, so calibration could not correct it. Owner, 2026-11-11: "it seems to me you are over estimating efforts"; plan this, then re-estimate the derived project. |
| **Reproduce** | Compare a derived project's backlog total (189.25 days for 158 steps) with the time recent steps took. |
| **Check** | Effort fields in agent hours with owner hours apart; tables and totals in hours, never added to days; calibration in like units; BACKLOG-RULES says to estimate in the time the work takes and to always record an actual on close; APPLY and CHANGELOG; released as 5.6.0. |

**Feature steps** (baseline: accepted estimate; actual: effort spent, so far while open; h: agent hours, owner time apart; status is not parent acceptance)

| Step | Baseline | Actual | Remaining | Status |
|---|---|---|---|---|
| F-058-T01 — Agent-hour fields, rendering, totals and calibration | 1.5 h | 0 h | 🟢 Small — 0.25 h | Implemented; verification pending |
| F-058-T02 — Rules, adoption note and release 5.6.0 | 0.75 h | 0 h | 🟢 Small — 0.25 h | Implemented; verification pending |
| **Total** | 2.25 h | 0 h (0 of 2 steps recorded) | 0.5 h | 0 of 2 completed |

<details>
<summary>Next action, estimates and evidence</summary>

**Step estimates** (dated basis; generated from the task files)

- F-058-T01: 1.5 agent hours (2026-11-11). Estimated 2026-11-11 in agent hours after this session's samples (four delivered features took about 0.05–0.1 of their day estimates). Estimate, not a measurement.
- F-058-T02: 0.75 agent hours (2026-11-11). Estimated 2026-11-11 in agent hours after this session's samples (four delivered features took about 0.05–0.1 of their day estimates). Estimate, not a measurement.

**Next action / closure evidence:** F-058-T01 and F-058-T02 implemented (PR pending); review, release 5.6.0. Closes on the release tag after green CI.

**Estimates:** Small remaining effort: about 0.5 agent hours for review and release. Estimated 2026-11-11 at 2.25 agent hours. Estimates, not measurements.

| Field | Value |
|---|---|
| PR / evidence | Test: tools/test-work-items.mjs "F-058: agent hours with owner time apart…". |
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
