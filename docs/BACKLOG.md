# Project harness backlog

Current work ledger, reviewed 25 November 2026 against main `6704d33` (PRs #279–#284, green CI). B-057 and B-058 closed on v10.20.1; F-097 on v10.20.0. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 3 h across 10 open steps of 2 features. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-096"></a>[✨ F-096](#top)

**Stop committing generated backlog views**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0.25 h | — | — | 🤖 | — | — |

💻 **→** Next: F-096-T06 — Transition and release (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Projects with source-owned work items commit generated views (`docs/BACKLOG.md`, recaps, totals) next to the sources they are built from. Every PR that touches a step regenerates them, so parallel PRs conflict on the generated file when their sources do not, and `merge-backlog.mjs` exists largely for that. Solution coordinators read the committed view on GitHub. Proposed by a solution coordinator, 2026-11-24. |
| **Reproduce** | Open two PRs that each change a different step file and rebuild the ledger: the second conflicts on `docs/BACKLOG.md` once the first merges. |
| **Check** | After the owner's decision: two PRs changing different steps merge without a conflict on a generated file; CI checks the sources and a fresh build; the published view keeps record links resolving; a coordinator reads it at a resolved commit or rebuilds it; one transition release ships both before committed views stop. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who |
|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-096-t06"></a>F-096-T06 — Transition and release | 1.5 h | 0 h | 0.25 h | Implemented; verification pending | 🤖 |
| 🟢 Small | **Total** | 10 h | 0 h (0 of 6 steps recorded) | 0.25 h | 5 of 6 completed | |

<details><summary>Done steps (5)</summary>

| Effort | Step | Estimate | Actual | Status |
|---|---|---|---|---|
| — | <a id="f-096-t01"></a>F-096-T01 — Owner decides where generated backlog views live | 0 h | 0 h | Completed |
| 🟢 Small | <a id="f-096-t02"></a>F-096-T02 — Build views on demand and check them in CI | 2.5 h | 0 h | Verified |
| 🟢 Small | <a id="f-096-t03"></a>F-096-T03 — Publish the built views | 2 h | 0 h | Verified |
| 🟢 Small | <a id="f-096-t04"></a>F-096-T04 — Procedures, links and local reading | 2 h | 0 h | Verified |
| 🟢 Small | <a id="f-096-t05"></a>F-096-T05 — Solution coordinators read published or rebuilt views | 2 h | 0 h | Verified |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-096.md)

| Field | Value |
|---|---|
| PR / evidence | [#253](https://github.com/voidbrain/project-harness/pull/253); [#260](https://github.com/voidbrain/project-harness/pull/260); [#261](https://github.com/voidbrain/project-harness/pull/261); [#262](https://github.com/voidbrain/project-harness/pull/262); [#264](https://github.com/voidbrain/project-harness/pull/264); [#270](https://github.com/voidbrain/project-harness/pull/270); [#271](https://github.com/voidbrain/project-harness/pull/271); [#272](https://github.com/voidbrain/project-harness/pull/272) |
| Opened | 2026-11-24 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

</details>

---

### <a id="f-099"></a>[✨ F-099](#top)

**Solution dashboard: the owner's overview layout (emoji and links per row, hours split, open prerequisites, harness and next audit)**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 2.75 h | — | — | 🤖 | — | — |

💻 **→** Next: F-099-T01 — Fixture tests for the overview layout, failing first (Planned).

| | |
|---|---|
| **Issue** | A solution coordinator keeps its own overview tool only for the layout the owner reads (its Proposal 4, found reconciling to 10.20.1): the dashboard's order has no project emoji or link per row, one Remaining cell instead of agent and owner hours, and no open prerequisites; Blocked and Waiting for the owner have no links, titles, priority, owner time or next step; the summary has no harness, next audit or solution total, and the coordinator's own row has no emoji. Approved by the owner 2026-11-25. |
| **Reproduce** | In a coordinator, compare `node tools/solution.mjs dashboard --remote` with its project overview on the same component commits. |
| **Check** | Fixture tests in `tools/test-profiles.mjs` show each part, configured from the manifest only (a top-level `emoji` for the coordinator, `emoji` per repository), no project name in the tool; on the coordinator's live solution the dashboard's Summary, Solution order, Blocked, Nothing to do and Waiting for the owner tables carry the overview's columns and agree with it row for row, differences named; a minor release. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-099-t01"></a>F-099-T01 — Fixture tests for the overview layout, failing first | 0.5 h | 0 h | 0.5 h | Planned | — | [F-099-T02](#f-099-t02), [F-099-T03](#f-099-t03), [F-099-T04](#f-099-t04) |
| 🟢 Small | <a id="f-099-t02"></a>F-099-T02 — Summary per project with harness, next audit and a solution total | 0.5 h | 0 h | 0.5 h | Planned | [F-099-T01](#f-099-t01) | [F-099-T05](#f-099-t05) |
| 🟢 Small | <a id="f-099-t03"></a>F-099-T03 — Solution order: emoji, links, agent and owner hours, open prerequisites | 0.75 h | 0 h | 0.75 h | Planned | [F-099-T01](#f-099-t01) | [F-099-T05](#f-099-t05) |
| 🟢 Small | <a id="f-099-t04"></a>F-099-T04 — Blocked, Waiting for the owner and Nothing to do in the overview's layout | 0.5 h | 0 h | 0.5 h | Planned | [F-099-T01](#f-099-t01) | [F-099-T05](#f-099-t05) |
| 🟢 Small | <a id="f-099-t05"></a>F-099-T05 — Live parity with the coordinator's overview, documentation and the minor release | 0.5 h | 0 h | 0.5 h | Planned | [F-099-T02](#f-099-t02), [F-099-T03](#f-099-t03), [F-099-T04](#f-099-t04) | — |
| 🟡 Medium | **Total** | 2.75 h | 0 h (0 of 5 steps recorded) | 2.75 h | 0 of 5 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-099.md)

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-25 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

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
