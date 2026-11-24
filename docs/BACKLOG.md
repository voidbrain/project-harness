# Project harness backlog

Current work ledger, reviewed 24 November 2026 against main `e8777b9` (PR #245, green CI). F-091 closed (v10.7.0). Open: F-093, procedures split into base and child files (10.8.0). History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 0.5 h across 1 open step of 1 feature. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-093"></a>[✨ F-093](#top)

**Every procedure fits its budget: base and child files**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔹 P3 | 🟢 Small | 0.5 h | — | — | 🤖 | — | — |

💻 **→** Next: F-093-T01 — Split over-budget and near-budget procedures into base and child files (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Reconciling gauntlet-protocol to 10.7.0: `check:rule-load` warns that the copied `docs/agents/skills.md` is 2,073 tokens, over the 2,000 procedure budget; `work-usage.md`, `backlog/records.md` and `backlog/review.md` are within 5 % of it. The owner asked to treat every harness file as AGENTS was treated in F-090: a lean base and a child with the detail. |
| **Reproduce** | `npm run check:rule-load` in a project on 10.7.0. |
| **Check** | No procedure over budget and none within 5 % of it; every moved sentence traced in `docs/design/lean-procedures-traceability.md`; BACKLOG-RULES routes to each backlog child, the procedure index to skill discovery; `check:template`, `test:tools`, `check:rules`, `check:backlog` pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-093-t01"></a>F-093-T01 — Split over-budget and near-budget procedures into base and child files | 1.5 h | 0 h | 0.5 h | Implemented; verification pending |
| 🟢 Small | **Total** | 1.5 h | 0 h (0 of 1 steps recorded) | 0.5 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-093.md)

| Field | Value |
|---|---|
| PR / evidence | [#246](https://github.com/voidbrain/project-harness/pull/246) |
| Opened | 2026-11-24 |
| Verification | Pending: CI, fresh-context review |
| Reviewed | 2026-11-24 |

</details>

---
## Other changes

Earlier release notes (v2.2.2 – v4.7.0) are archived in [Reconciliation log](archive/reconciliation-2026.md#archived-other-changes-moved-from-backlogmd-on-2026-11-13).

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

Each item shows its ID and title, a summary table (status with its colour, priority, effort size, remaining time, Depends on, Unlocks and Procedures and Decisions, 🧑 where the record or one of its ready steps waits on that kind of human action), the human or next action, and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort, from the remaining agent hours (owner time apart): 🟢 Small ≤1 h · 🟡 Medium ≤4 h · 🔴 Large ≤8 h · 🟣 Very large more; work still estimated in days: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Status and verification evidence describe progress; effort is an estimate of work still required. A `---` line ends every item.
