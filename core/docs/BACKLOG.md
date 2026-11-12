# {{PROJECT_NAME}} backlog

Current work ledger, reviewed {{DATE_LONG}} against main `{{MAIN_SHA}}`. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md) · [Reading the records](#how-to-use-this-file).

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### B-001

**{{SHORT TITLE}}**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔴 | 🔺 P1 | Open | 🟢 Small |

💻 **→ Human action required: No**<br />{{One sentence: the agent's next action.}}

| | |
|---|---|
| **Issue** | {{SHORT TITLE}}. |
| **Reproduce** | {{Page, fixture or workflow and concrete steps.}} |
| **Check** | {{Observable acceptance criteria.}} |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** {{What was observed, how to reproduce it, what to do next and what closes it.}}

**Estimates:** Small remaining effort. Initial estimate; revise from the scoped work and evidence. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | {{YYYY-MM-DD}} |
| Verification | Pending |
| Reviewed | {{YYYY-MM-DD}} |

</details>

---

## Other changes

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

Each item shows its ID and title, a signal table (priority, status, effort size; with source-owned records also remaining time, Depends on, Unlocks and Human action 🧑 Yes / 💻 No), the human or next action, and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Status and verification evidence describe progress; effort is an estimate of work still required. A `---` line ends every item.
