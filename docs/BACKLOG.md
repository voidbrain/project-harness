# Project harness backlog

Current work ledger, reviewed 11 November 2026 against main `e3b2c3d`. F-052 closed (PR #111). F-053–F-055 planned (PR #112): estimate totals, estimate calibration, queue-ordered ledger. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

<!-- totals:start -->
**Remaining effort:** 2.25 days across 8 open steps of 3 features. Generated from the task files.
<!-- totals:end -->

[Linked prerequisites and unlocks](agents/backlog-dependencies.md) · [Work queue](agents/backlog-queue.md).

## Bugs and reliability

## Features and improvements

### F-053

**Summable step estimates with feature and ledger totals**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Fresh-context review, then release 5.3.0 (F-053-T03).

| | |
|---|---|
| **Issue** | Step estimates are free text ("0.5 focused day", "0 remaining"), so a feature's total and the backlog's total cannot be computed, and a completed step drops its original estimate to "0 remaining", leaving no baseline to compare with what it actually took. Owner request 2026-11-11: show each feature's total estimated days and the total of all features at the top of the backlog. |
| **Reproduce** | Open any derived project's generated backlog: no feature shows a total; the header shows none; a closed step reads 0 remaining with its original estimate only in Git history. |
| **Check** | Tasks carry optional numeric `days` (remaining) and `baselineDays` (first accepted estimate, kept at close); each feature's steps table has a total row (remaining, baseline, steps with unknown estimates, never counted as 0); the ledger header shows total remaining days of open records; totals are generated and check:work fails when stale; APPLY says how to backfill. |

**Feature steps** (remaining estimates; status is not parent acceptance)

| Step | Remaining | Baseline | Status |
|---|---|---|---|
| F-053-T01 — Numeric remaining days and a frozen baseline on each task | 🟢 Small — 0.25 days | 1 day | Implemented; verification pending |
| F-053-T02 — Feature and ledger totals | 🟢 Small — 0.25 days | 1 day | Implemented; verification pending |
| F-053-T03 — Release and adoption note | 🟢 Small — 0.5 days | 0.5 days | Planned |
| **Total** | 1 day | 2.5 days | 0 of 3 completed |

<details>
<summary>Next action, estimates and evidence</summary>

**Step estimates** (dated basis; generated from the task files)

- F-053-T01: 0.25 day: review and release (2026-11-11). validateEffort is one function with an exact key count; the rule sentence and fixtures dominate. Implemented 2026-11-11 in one branch with F-053–F-055; review and release remain. Estimate, not a measurement.
- F-053-T02: 0.25 day: review and release (2026-11-11). renderLedger already owns the header segment and the steps table. Implemented 2026-11-11 in one branch with F-053–F-055; review and release remain. Estimate, not a measurement.
- F-053-T03: 0.5 focused day (2026-11-11). Same release path as v5.2.0. Estimate, not a measurement.

**Next action / closure evidence:** Implemented 2026-11-11 with F-053–F-055 in one branch for release 5.3.0 (owner: "go with harness points implementation"); fresh-context review, then release. Closes on the release tag after green CI.

**Estimates:** Small remaining effort: review and release. Initial plan in PR #112.

| Field | Value |
|---|---|
| PR / evidence | Implemented in [PR #113](https://github.com/voidbrain/project-harness/pull/113); review pending. Planned in [PR #112](https://github.com/voidbrain/project-harness/pull/112) (owner request, 2026-11-11, from a derived project session). |
| Opened | 2026-11-11 |
| Verification | Pending |
| Reviewed | 2026-11-11 |

</details>

---
### F-054

**Compare estimates with actual effort and re-estimate when they drift**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

🧑 **→ Human action required: Yes**<br />Confirm the default re-estimation thresholds (5 samples, 1.5x median, 3x outlier, 6 hours a day); implemented with these defaults as settings.

| | |
|---|---|
| **Issue** | Estimates are never checked against what steps actually took, so a systematic bias (for example every "0.5 day" step taking 2) persists into every new plan. work-usage already compares a job's pre-work estimate with its elapsed time, but nothing links that to backlog steps or prompts a re-estimate. Owner request 2026-11-11: compare each completed step's estimate with real data and add a periodic, conditional re-estimation rule triggered by the number and size of discrepancies. |
| **Reproduce** | Close several steps in a derived project whose actual effort differs from the estimate: nothing reports the gap and open steps keep their old estimates. |
| **Check** | A closed step records `actualDays` with its source (measured from work-usage, or stated, never shown as measured); `work-items calibrate` reports actual/baseline ratios by size and capability with sample counts, read-only; check:freshness asks to re-estimate the named open steps when at least `estimation.minSamples` closed steps since the last calibration have a median ratio beyond `estimation.ratio` or any step beyond `estimation.outlier`; re-estimates change `days` with a dated basis and keep `baselineDays`; a material increase still goes to the owner. |

**Feature steps** (remaining estimates; status is not parent acceptance)

| Step | Remaining | Baseline | Status |
|---|---|---|---|
| F-054-T01 — Record actual effort when a step closes | 🟢 Small — 0.25 days | 1 day | Implemented; verification pending |
| F-054-T02 — Calibration report | 🟢 Small — 0.25 days | 1 day | Implemented; verification pending |
| F-054-T03 — Conditional re-estimation trigger | 🟢 Small — 0.25 days | 1 day | Implemented; verification pending |
| **Total** | 0.75 days | 3 days | 0 of 3 completed |

<details>
<summary>Next action, estimates and evidence</summary>

**Step estimates** (dated basis; generated from the task files)

- F-054-T01: 0.25 day: review and release (2026-11-11). work-usage already reports per-task elapsed unions; this links them to the task record. Implemented 2026-11-11 in one branch with F-053–F-055; review and release remain. Estimate, not a measurement.
- F-054-T02: 0.25 day: review and release (2026-11-11). A pure function over task files; output format as backlog-queue. Implemented 2026-11-11 in one branch with F-053–F-055; review and release remain. Estimate, not a measurement.
- F-054-T03: 0.25 day: review and release (2026-11-11). Same shape as the existing audit-age and backlog-behind findings in check:freshness. Implemented 2026-11-11 in one branch with F-053–F-055; review and release remain. Estimate, not a measurement.

**Next action / closure evidence:** Implemented 2026-11-11 with F-053–F-055 in one branch for release 5.3.0 (owner: "go with harness points implementation"); fresh-context review, then release. Closes on the release tag after green CI.

**Estimates:** Small remaining effort: review and release. Initial plan in PR #112.

| Field | Value |
|---|---|
| PR / evidence | Implemented in [PR #113](https://github.com/voidbrain/project-harness/pull/113); review pending. Planned in [PR #112](https://github.com/voidbrain/project-harness/pull/112) (owner request, 2026-11-11, from a derived project session). |
| Opened | 2026-11-11 |
| Verification | Pending |
| Reviewed | 2026-11-11 |

</details>

---
### F-055

**Backlog ordered by the work queue, with a compact steps table**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

🧑 **→ Human action required: Yes**<br />Confirm the steps table stays just before the collapsed details (implemented there) or moves above the Issue/Reproduce/Check table.

| | |
|---|---|
| **Issue** | The generated backlog lists records by ID, so the next thing to work on is found only on the separate work-queue page; the feature steps table carries long dated basis text in every row, which makes it hard to scan. Owner request 2026-11-11: order the backlog by the work queue by default and put the feature steps table before the expandable sections. |
| **Reproduce** | Open a derived project's docs/BACKLOG.md: records are in ID order; the steps table (rendered just before the collapsed details) has multi-line effort cells. |
| **Check** | `workItems.order` = `queue` (default for new adoptions) or `id`; within each group records follow tools/backlog-queue.mjs order, deterministic on ties; the steps table shows step, remaining, baseline and status with the basis moved into details; placement confirmed by the owner. |

**Feature steps** (remaining estimates; status is not parent acceptance)

| Step | Remaining | Baseline | Status |
|---|---|---|---|
| F-055-T01 — Records ordered by the work queue | 🟢 Small — 0.25 days | 1 day | Implemented; verification pending |
| F-055-T02 — Compact steps table placed for reading | 🟢 Small — 0.25 days | 0.5 days | Implemented; verification pending |
| **Total** | 0.5 days | 1.5 days | 0 of 2 completed |

<details>
<summary>Next action, estimates and evidence</summary>

**Step estimates** (dated basis; generated from the task files)

- F-055-T01: 0.25 day: review and release (2026-11-11). backlog-queue already computes the ranking; renderLedger takes an order. Implemented 2026-11-11 in one branch with F-053–F-055; review and release remain. Estimate, not a measurement.
- F-055-T02: 0.25 day: review and release (2026-11-11). Rendering-only change in featurePlan(). Implemented 2026-11-11 in one branch with F-053–F-055; review and release remain. Estimate, not a measurement.

**Next action / closure evidence:** Implemented 2026-11-11 with F-053–F-055 in one branch for release 5.3.0 (owner: "go with harness points implementation"); fresh-context review, then release. Closes on the release tag after green CI.

**Estimates:** Small remaining effort: review and release. Initial plan in PR #112.

| Field | Value |
|---|---|
| PR / evidence | Implemented in [PR #113](https://github.com/voidbrain/project-harness/pull/113); review pending. Planned in [PR #112](https://github.com/voidbrain/project-harness/pull/112) (owner request, 2026-11-11, from a derived project session). |
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
