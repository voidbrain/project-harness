# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `246d286` (merged #12, tagged v1.10.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

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

None open.

## Features and improvements

### F-010

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-010 | 🔶 P2 | Implemented | Impact map: what must follow a change, reminded on every PR (1.11.0) |

💻 **→ Human action required: No**<br />Merge this PR on a green CI and tag `v1.11.0`.

**Next action / closure evidence:** Requested 2026-10-29 from openbando (decided with the owner: a template feature, each project fills its rows). BACKLOG-RULES' consistency rule ("for every modification, check README, AGENTS…") names no derived things, so updates depended on memory: a fence label in TypeScript data had no translation, and clips, guide pages and tips had no record of what they follow. Release 1.11.0: `impact` rows in `.harness.json` (`when` globs, `then`, `run`, `checked`); `check-freshness` lists the rows a branch triggers (warning, never fails; "nothing checks it" when a row has no check); core AGENTS "What follows a change"; BACKLOG-RULES points to the map; APPLY asks for the rows when applying; this repository's own stamp has two rows (core tools copied to tools/, a CHANGELOG step for core and stack changes). Closes when `v1.11.0` is tagged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | This PR |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 19/19 (a new case: rows fire on matching changed files with their command and check, a non-matching row stays quiet, never fails), 2026-10-29. Documentation: `check:template`, `check:backlog` |
| Reviewed | 2026-10-29 |

</details>

---



## Other changes

None yet.
