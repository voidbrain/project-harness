# Project harness backlog

Current work ledger, reviewed 31 October 2026 against main `6d7a879` (merged #37, tagged v1.20.0; CI read with `ci:status`, `check` green). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026.md). IDs are stable: do not reuse them.

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

Each item has a compact summary, followed by its human-action line (icon first: 🧑 **→ Human action required: Yes** = a human is needed, including a decision; 💻 **→ Human action required: No** = agent-owned next action, not completion), then, when a person is needed, a small table saying the issue, how to reproduce it and what to check, then the full-width **Next action / closure evidence**. Expand its details for PR history, dates and verification evidence. A `---` line ends every item.

## Bugs and reliability

None open.

## Features and improvements

### F-020

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-020 | 🔹 P3 | Implemented | A new finding about the same behaviour goes into its record, not a new ID (1.20.1) |

💻 **→ Human action required: No**<br />Merge on a green `check`, tag `v1.20.1`.

**Next action / closure evidence:** Found 2026-10-31 by the owner on openbando: a loose paragraph between two records ("New findings reuse an existing ID when they concern the same behavior"), left from the old table layout, was the only place this rule lived; next to "never reuse an ID" it read as a contradiction. BACKLOG-RULES now says it beside the ID rule: never reuse an ID for a different item; a new finding about the same behaviour (a failed check, a follow-up, a regression) goes into that record, reopened if it was closed. Wording only.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | Found on openbando's backlog 2026-10-31 |
| Opened | 2026-10-31 |
| Verification | Documentation · 2026-10-31 · `check:template` |
| Reviewed | 2026-10-31 |

</details>

---

## Other changes

None yet.
