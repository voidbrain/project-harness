# Project harness backlog

Current work ledger, reviewed 25 November 2026 against main `5d12609` (PRs #288–#289, green CI). B-060 closed on v10.21.2, F-100 on v10.21.3. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 0.25 h across 7 open steps of 2 features. Generated from the task files.
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

### <a id="f-101"></a>[✨ F-101](#top)

**Solution dashboard: display names, a Total row, unbroken dates, top-aligned cells and short lists**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0 h | — | — | 🤖 | — | — |

💻 **→** Next: F-101-T01 — Dashboard layout: Total, dates, lists, HTML tables (Implemented; verification pending).

| | |
|---|---|
| **Issue** | The owner reviewed a coordinator's generated dashboard (2026-11-26): the total rows read "Solution" and the Summary total repeats the latest harness release; dates such as "Next audit" wrap at their hyphens; GitHub centres multi-line cells vertically; multi-value cells ("token: next …; architecture: next …") run together, and a 33-item cell is unreadable either way. Display names per project already exist (`label`, B-060). |
| **Reproduce** | `node tools/solution.mjs dashboard` in a coordinator and render it on GitHub: "2026‑12‑" / "01" in Next audit; the reviews cell is one run of text; the runway's "First blocks reached" lists every "owner step nerv:…" in full. |
| **Check** | `tools/test-profiles.mjs` "F-101: …", committed failing first: total rows read **Total**, the Summary total leaves Harness and Next audit empty; every date outside a link target prints with non-breaking hyphens (U+2011); a multi-value cell of up to five items has one item per line (`<br>`); a larger one is a collapsed count (HTML details element) that opens to its items with the shared prefix once; the optional `.solution.json` `htmlTables: true` writes every table as HTML with `<tr valign="top">` (GitHub's sanitizer keeps `valign` and `align`, drops `style`; checked through the Markdown API 2026-11-26); Markdown tables stay the default. A patch release. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-101-t01"></a>F-101-T01 — Dashboard layout: Total, dates, lists, HTML tables | 2 h | 0 h | 0 h | Implemented; verification pending | — | [F-101-T02](#f-101-t02) |
| 🟢 Small | <a id="f-101-t02"></a>F-101-T02 — Adoption notes and the patch release | 0.5 h | 0 h | 0 h | Implemented; verification pending | [F-101-T01](#f-101-t01) | — |
| 🟢 Small | **Total** | 2.5 h | 0 h (0 of 2 steps recorded) | 0 h | 0 of 2 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-101.md)

| Field | Value |
|---|---|
| PR / evidence | Pending |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

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
