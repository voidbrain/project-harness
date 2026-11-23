# Project harness backlog

Current work ledger, reviewed 23 November 2026 against main `e416eaa` (PRs #225–#233, green CI). Released v10.2.0, v10.3.0 (10.1.1 is in the CHANGELOG but untagged); closed F-075, F-086, F-087. Open: B-048. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 0.25 h across 1 open step of 0 features and 1 other record. 0.25 h of actual effort recorded on 1 step. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="b-048"></a>[🐞 B-048](#top)

**check-rules globs treat regex characters as regex (CodeQL: incomplete escaping)**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0.25 h | — | — | 🤖 | — | — |

💻 **→** Next: B-048-T01 — Escape every regex character of a check-rules glob (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Found 2026-11-23 by CodeQL on OpenBando's reconcile PR (js/incomplete-sanitization, high): `check-rules.mjs` turned a `rules.procedures` glob into a regex escaping only `.`, so `+`, `(`, `\` and other characters stayed regex syntax. `docs/x+*.md` read `docs/xxdeploy.md` and not only `docs/x+deploy.md`. A project copying the tool gets a CodeQL alert that blocks its merge. |
| **Reproduce** | `rules.procedures: ["docs/x+*.md"]` and a file `docs/xxdeploy.md` stating an ask-first rule; `check:rules` fails on a file the glob does not name. |
| **Check** | Committed test fails first (`tools/test-rules.mjs`, "regex characters in a glob are literal"); after the fix every regex character of a glob is escaped as `rule-load.mjs` already does; `test:tools` and CodeQL pass. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-048-t01"></a>B-048-T01 — Escape every regex character of a check-rules glob | 0.5 h | 0.25 h so far (stated) | 0.25 h | Implemented; verification pending |
| 🟢 Small | **Total** | 0.5 h | 0.25 h | 0.25 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-048.md)

| Field | Value |
|---|---|
| PR / evidence | [#234](https://github.com/voidbrain/project-harness/pull/234) |
| Opened | 2026-11-23 |
| Verification | Pending: `test:tools`, `check:template` and CodeQL in CI |
| Reviewed | 2026-11-23 |

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
