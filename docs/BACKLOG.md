# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `09681c6` (merged #10, tagged v1.9.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

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

### F-009

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-009 | 🔶 P2 | Implemented | Project or template: decided at the edit, asked when unsure; PR rules for every project (1.10.0) |

💻 **→ Human action required: No**<br />Merge this PR on a green CI and tag `v1.10.0`.

**Next action / closure evidence:** Found 2026-10-29 in openbando: the owner allowed a conflict-only push to a green PR and the agent wrote it into that project's AGENTS as a project rule, although it holds for every project (beside "Open every PR against `main`"), and the owner had said to ask when unsure. Causes: the rule's trigger was "a request that adds a rule" (an "allow X" did not look like one), it sat at the end of Work tracking, "ask" was only in APPLY.md, no check noticed a PR changing harness files, and adapted files did not show which lines are the project's. Release 1.10.0 (decided with the owner): core AGENTS "Changing a harness file" (the edit is the trigger; unsure: ask before editing), `check-freshness` lists the harness files a branch changes (warning, never blocks; project-content files and the template repository excluded), `<!-- project -->` marks for project lines in template sections (APPLY), the PR rules (no stacked PRs, no new work on a green PR, conflict-only pushes allowed) in core AGENTS and here, BACKLOG-RULES on parallel PRs' backlog conflicts. The owner's local apply-harness skill carries the same rule. Closes when `v1.10.0` is tagged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | This PR |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 18/18 (a new case: a branch changing AGENTS is listed with the question, README and backlog records are not, never fails), 2026-10-29. Documentation: `check:template`, `check:backlog` |
| Reviewed | 2026-10-29 |

</details>

---


## Other changes

None yet.
