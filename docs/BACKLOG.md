# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `0c150b1` (merged #26, tagged v1.16.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

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

### F-018

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-018 | 🔶 P2 | Implemented | A PR's placeholder can no longer reach the default branch; the watcher survives GitHub timeouts (1.19.0) |

💻 **→ Human action required: No**<br />Merge on a green `check`, tag `v1.19.0`, close this record; openbando reconciles.

**Next action / closure evidence:** Decided 2026-10-30 with the owner, after openbando's `check:backlog` failed on every PR twice in one day: a merged "this PR" line (its 1.17.0 note, then #250's B-029 record) is on the default branch, where the 1.17.0 check fails every other PR until someone fixes it. Now `check-backlog` fails on a PR's own CI run when the branch adds the placeholder, naming the number; the rule says to write the number right after opening the PR. The same day GitHub timed out for minutes and `merge-when-green` crashed on the first failed `gh` call: it now retries (ten failures in a row give up). `test:tools` 28/28.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | Branch `release/1.19.0`; openbando [#251](https://github.com/voidbrain/openbando/pull/251) (the second unblock) |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 28/28 (new cases: a placeholder added on a PR run fails with the number, locally passes; gh failing twice then answering merges, ten failures give up) |
| Reviewed | 2026-10-30 |

</details>

---
## Other changes

None yet.
