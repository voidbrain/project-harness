# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `d887c5b` (merged #22, tagged v1.15.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

## How to use this file

| Status | Requirements | Next statuses and conditions | Priority cue |
|---|---|---|---|
| **🔴 Open** | Reproducible bug or agreed capability; scope and next action recorded. | - **Investigate** if cause/scope is uncertain<br>- **Implemented** when code is complete<br>- **Blocked** if a named dependency prevents progress<br>- **Closed** if cancelled/superseded, with reason. | Coloured |
| **🟠 Investigate** | Report and unanswered question recorded; next diagnostic identified. | - **Open** when scope/cause is established<br>- **Implemented** when fixed<br>- **Blocked** if evidence/dependency is unavailable<br>- **Closed** if duplicate/not reproducible after documented investigation, with reason. | Coloured |
| **🟡 Implemented** | Code exists; required verification remains pending. | - **Verified** when all acceptance checks pass<br>- Open or Investigate if a check fails<br>- **Blocked** if a required check cannot proceed. | Coloured |
| **🟢 Verified** | All acceptance checks passed; date, method and evidence recorded, including human/device checks when required. | - **Closed** when no action remains and resolution is recorded<br>- **Open** or **Investigate** if new evidence invalidates verification. Do not leave completed items here indefinitely. | Coloured |
| **🟣 Blocked** | Specific blocker, affected work/check and resume condition recorded. | - Return to **Open**, **Investigate** or **Implemented** when unblocked<br>- **Verified** only after all checks pass<br>- **Closed** if cancelled/superseded, with reason. | Grey ◻️ |
| **🔵 Closed** | Resolution recorded and item archived. | - **Open** or **Investigate** if reopened by new evidence<br>Retain ID, original Opened date and historical closure record. | Grey ◻️ |

Follow [Backlog rules](BACKLOG-RULES.md) for updating records, reconciling PR/CI evidence, stale-state review, closure/archiving, human dependencies and table validation. Preserve stable IDs and existing user edits.

Each item has a compact summary, followed by its human-action line (icon first: 🧑 **→ Human action required: Yes** = a human is needed, including a decision; 💻 **→ Human action required: No** = agent-owned next action, not completion), then the full-width **Next action / closure evidence**. Expand its details for PR history, dates and verification evidence. A `---` line ends every item.

## Bugs and reliability

### B-009

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | B-009 | 🔹 P3 | Implemented | `impact-map.mjs` did not escape backslashes in table cells (1.15.1) |

💻 **→ Human action required: No**<br />Merge this PR on a green CI and tag `v1.15.1`.

**Next action / closure evidence:** Found 2026-10-30 by CodeQL (`js/incomplete-sanitization`) on an openbando PR that copied the 1.15.0 tool: a cell escaped pipes but not backslashes, so a cell ending in `\` could join the next column. Patch 1.15.1 escapes backslashes first. Closes when `v1.15.1` is tagged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | This PR |
| Opened | 2026-10-30 |
| Verification | Script: `test:tools`, `check:template`, 2026-10-30 |
| Reviewed | 2026-10-30 |

</details>

---


## Features and improvements

None open.







## Other changes

None yet.
