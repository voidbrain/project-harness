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

Each item has a compact summary, followed by its human-action line (icon first: 🧑 **→ Human action required: Yes** = a human is needed, including a decision; 💻 **→ Human action required: No** = agent-owned next action, not completion), then the full-width **Next action / closure evidence**. Expand its details for PR history, dates and verification evidence. A `---` line ends every item.

## Bugs and reliability

None open.


## Features and improvements

### F-016

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-016 | 🔶 P2 | Implemented | Coherence fixes from the openbando review (1.17.0) |

💻 **→ Human action required: No**<br />Merge on a green `check`, tag `v1.17.0`, then close this record; openbando reconciles.

**Next action / closure evidence:** Requested 2026-10-30 by the owner after a review of the template against openbando (five inconsistencies; a sixth, the 🧑 waiting list, the owner keeps). (1) The lifecycle table had Implemented → Verified → Closed while the procedure let a record close "when no action remains": records were closed straight from Implemented on "merged, CI green". Now a record closes only from Verified (or cancelled/superseded); automated acceptance is the merged PR's green CI run, cited; one reconcile may verify and close. (2) What the agent may do alone was nowhere: APPLY said "do not commit or push unless the user asks", AGENTS "the owner may merge", and agents merged anyway. Now AGENTS, "What the agent does on its own, and what it asks first"; APPLY's line is scoped to the first application. (3) Records kept "this PR" after merging and their closure was missed (openbando F-028–F-030, F-038 for a day): `check-backlog` fails on a "this PR" line already on the default branch. (4) The coverage page was rewritten in every PR, so every two parallel PRs conflicted: it changes only on purpose or in audits. (5) The tools the process depends on lived in a session scratchpad; the backlog conflict helper kept one side's records and dropped openbando edits (F-024, F-033, B-030, B-031): now `tools/merge-backlog.mjs` (three-way, record by record) and `tools/merge-when-green.mjs` (merges once every check passed; stops on a failure or conflict), both tested. `test:tools` 27/27.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | Branch `release/1.17.0` |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 27/27 (new: stale "this PR", merge-backlog three ways, merge-when-green with a fake gh), `check:template` |
| Reviewed | 2026-10-30 |

</details>

---








## Other changes

None yet.
