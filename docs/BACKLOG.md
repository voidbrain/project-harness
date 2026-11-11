# Project harness backlog

Current work ledger, reviewed 11 November 2026 against main `c4470af`. PR #102 / CI 42925039463 passed: F-048 closed, v4.8.0 published. F-051 (formatter and linter for every stack, reconciliation folded into working PRs) is implemented for 5.0.0 and awaits review, CI and tag. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

[Linked prerequisites and unlocks](agents/backlog-dependencies.md) · [Work queue](agents/backlog-queue.md).

## Bugs and reliability

## Features and improvements

### F-051

**Formatter and linter for every stack, and reconciliation folded into working PRs**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Independent review and green CI, then tag v5.0.0.

| | |
|---|---|
| **Issue** | Owner decision 2026-11-11 after a direction review of a derived project: (1) the template named lint and format only for the Angular stack, worded as merging into an existing config, and nothing checked it, so a project could run for weeks with neither and with source lines thousands of characters long; the template's own tools had neither as well. (2) Reconciliation after every merge produced a records-only PR for almost every working PR. |
| **Reproduce** | Apply the core stack to a Node project: no formatter or linter is required and no check fails. Merge one PR in a project: `check:freshness` warns at once and the session-start rule asks for reconciliation in the session's first PR. |
| **Check** | `check-tooling` fails without a formatter check and a linter as npm scripts run in CI, accepts renamed scripts from the stamp and a recorded exemption, and ignores commented steps. `check-freshness` prints the backlog as a note below 10 merged PRs and one day, and as a warning at either limit; both limits are settings. The template formats and lints its own tools with the configuration it gives projects. Rule text in AGENTS and BACKLOG-RULES keeps every evidence requirement. Fixtures, independent review, green CI and the published tag establish release acceptance. |

**Feature steps** (remaining estimates; status is not parent acceptance)

| Step | Remaining effort | Status |
|---|---|---|
| F-051-T01 — Tooling check, default configs, cadence setting and self-adoption | 🟢 Small — Review, CI and tag only<br />2026-11-11: Implemented 2026-11-11 in one change; owner approved scope and cadence the same day. | Implemented; verification pending |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Implemented 2026-11-11 for release 5.0.0 (major: a project without both tools stops passing). New copied tool `check-tooling.mjs`, `core/eslint.config.mjs`, `core/.prettierrc.json`, `core/prettierignore.txt`; APPLY "Lint and format config" now covers every stack and describes the one-PR mechanical reformat and its verification; `freshness.backlogPRs` / `backlogDays` in `check-freshness`; session-start and BACKLOG-RULES sentences fold reconciliation into the next working PR. The template adopts Prettier 3.9.10 and ESLint 10.14.0 itself: all 73 JavaScript files reformatted with no hand edits, 16 lint findings fixed by hand. No consumer adoption gates this release; each project records its own reconcile.

**Estimates:** Small remaining effort: review, CI and tag. Estimated 2026-11-11; not a measured duration.

| Field | Value |
|---|---|
| PR / evidence | PRNEW; Test: tools/test-tooling.mjs (5 fixtures) and the cadence fixture in tools/test-tools.mjs |
| Opened | 2026-11-11 |
| Verification | 2026-11-11 Script: all tool fixtures pass after the reformat; a position-free syntax tree (espree) of each of the 73 files is equal before and after formatting except `work-usage.mjs`, where Prettier dropped redundant parentheses inside one `\|\|` chain. Lint clean. Independent review, CI and tag pending. No behaviour runner is configured: live agent-behaviour checks were not run. |
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
