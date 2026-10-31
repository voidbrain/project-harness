# Project harness backlog

Current work ledger, reviewed 31 October 2026 against main `897d085` (merged #38, tagged v1.20.1; GitHub CI run 41152418062 and every job step read, check green; local ci:status unavailable because gh is not installed). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md) · [Reading the records](#how-to-use-this-file).

## Bugs and reliability

None open.

## Features and improvements

### F-021

**Compact active records and mandatory recaps (2.0.0)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Release after green CI.

| | |
|---|---|
| **Issue** | Agent-owned and untouched records can omit recaps; long visible actions make the ledger hard to scan. |
| **Reproduce** | Run the old validator on an agent-owned record without a recap; read a ledger with long next actions. |
| **Check** | Every record requires all three recap rows and estimates; actions and history stay collapsed with no evidence lost. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Merge the release PR after all CI checks pass, then publish v2.0.0. Changes tried against OpenBando’s 20 active records. Reconcile that project after the tag is published.

**Estimates:** Small remaining effort; ~90% complete. Schema, migration and regression fixtures implemented; CI and publishing remain. Estimated 2026-10-31.

| Field | Value |
|---|---|
| PR / evidence | Owner request from OpenBando, 2026-10-31; [#39](https://github.com/voidbrain/project-harness/pull/39) |
| Opened | 2026-10-31 |
| Verification | Documentation/tool fixtures · 2026-10-31 · check:template, check:backlog and all 29 tool fixtures passed; OpenBando’s 20 prior records pass the new validator |
| Reviewed | 2026-10-31 |

</details>

---


## Other changes

None yet.

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

Each item shows its ID and title, a signal table (priority, status, remaining effort and estimated completion), Human action required (🧑 Yes / 💻 No), and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Completion is a coarse estimate, not verification; pending acceptance stays below 100%. A `---` line ends every item.
