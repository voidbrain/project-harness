# Project harness backlog

Current work ledger, reviewed 30 October 2026 against main `b2367f2` (merged #36, tagged v1.19.1; CI of #28–#35 read with `ci:status`, all `check` green). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026.md). IDs are stable: do not reuse them.

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

### F-019

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-019 | 🔶 P2 | Implemented | One backlog archive per year, in closing-date order (1.20.0) |

💻 **→ Human action required: No**<br />Open the PR, merge on a green `check`, tag `v1.20.0`.

**Next action / closure evidence:** Decided 2026-10-30 with the owner, after openbando's records closed on 29 and 30 October were appended to its 28 October archive: one archive per year, `docs/archive/backlog-<year>.md`, a `## Closed <date>` heading per day. `check-backlog` now counts every published archive line across all archive files (a record may move between them, nothing may vanish; the folder README is exempt) and fails on a record whose last "closed <date>" is not its file's year. This repository's own archive moved to `backlog-2026.md`. `test:tools` 29/29. Closes when the PR's CI is green, it is merged and `v1.20.0` is tagged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#37](https://github.com/voidbrain/project-harness/pull/37); found on openbando's `docs/archive/backlog-2026-10-28.md` |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 29/29 (a record moved to a year's archive under new headings passes; a line lost from every archive fails; a record closed in another year fails) |
| Reviewed | 2026-10-30 |

</details>

---

## Other changes

None yet.
