# Project harness backlog

Current work ledger, reviewed 12 November 2026 against main `5e0ce97`. v6.3.0 published (PR #132, green CI): F-062 closed and archived. F-063 (effort from remaining agent hours, 7.0.0) in review. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

<!-- totals:start -->
**Remaining effort:** 1 h across 1 open step of 1 feature. 2 h of actual effort recorded on 1 step. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### F-063

**Effort from remaining agent hours, latest estimate, Status with its colour**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Human action |
|---|---|---|---|---|---|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 1 h | — | — | 💻 No |

💻 **→** Next: independent review, merge, tag v7.0.0.

| | |
|---|---|
| **Issue** | Owner, 2026-11-12, from a project: the steps table's Baseline column and the `(planned 1.5)` suffix (F-061) read as clutter; the size word sat inside the Remaining cell and never changed as work was done; the summary's Signal column repeated Status; and the total `22.75 h + 6 h owner and 0 days` printed a zero day unit (one step still in days) and left the agent part unlabelled. Owner chose: Effort first, sized from remaining agent hours only (🟢 ≤1 h, 🟡 ≤4 h, 🔴 ≤8 h, 🟣 more); Estimate shows the latest estimate; baseline kept for calibration but not shown; Signal merged into Status. |
| **Reproduce** | At v6.3.0, re-estimate an open step (`agentHours` 1, `baselineAgentHours` 1.5) and keep one open step in days with `days` 0, then run `node tools/work-items.mjs build`: the row reads `🟢 Small — 1 h (planned 1.5)` and the totals end `and 0 days`. |
| **Check** | Steps table `Effort, Step, Estimate, Actual, Remaining, Status`, size from remaining agent hours; `estimateAgentHours` optional and shown, else the baseline; no `(planned …)`; totals label `agent` beside owner time and drop a zero unit; generated summary `Status, Priority, Effort, Remaining, …` with `🔴 Open` and the record size from its steps; check-backlog, backlog-queue and solution read it (Very large ranks after Large); record sources and archives unchanged; rules (both copies), CHANGELOG, APPLY; released as 7.0.0. |

**Feature steps** (effort: size of the remaining agent time, 🟢 up to 1 h · 🟡 4 h · 🔴 8 h · 🟣 more; estimate: latest whole-step estimate; actual: effort spent, so far while open; h: agent hours, owner time apart; status is not parent acceptance)

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | F-063-T01 — Steps and summary tables: size from remaining agent hours, latest estimate, Status with its colour | 3 h | 2 h so far (stated) | 1 h | Implemented; verification pending |
| 🟢 Small | **Total** | 3 h | 2 h | 1 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

**Step estimates** (dated basis; generated from the task files)

- F-063-T01: 1 h (2026-11-12). Judged 2026-11-12: 3 agent hours from F-059, which changed the summary table across the same readers. Implemented the same day; 1 h left for review fixes and the release.

**Next action / closure evidence:** Independent review, merge, tag v7.0.0; close on the published tag. Projects reconcile in their own backlogs.

**Estimates:** Baseline 3 agent hours (Medium on the new scale), judged 2026-11-12 from F-059 (summary table across the same readers); 1 h remains for review fixes and the release, so the record now reads Small.

| Field | Value |
|---|---|
| PR / evidence | [PR #133](https://github.com/voidbrain/project-harness/pull/133). Review: fresh-context design review, no blocker; should-fix items (silent baseline fallback now warned by `work-items check`, a regression test for the zero-day total, PR named, estimate wording) and nits (— for an all-closed record, `6 h owner` without `0 h agent`, 6.x ledger hint) fixed. |
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

Each item shows its ID and title, a summary table (status with its colour, priority, effort size, remaining time, Depends on, Unlocks and Human action 🧑 Yes / 💻 No), the human or next action, and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort, from the remaining agent hours (owner time apart): 🟢 Small ≤1 h · 🟡 Medium ≤4 h · 🔴 Large ≤8 h · 🟣 Very large more; work still estimated in days: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Status and verification evidence describe progress; effort is an estimate of work still required. A `---` line ends every item.
