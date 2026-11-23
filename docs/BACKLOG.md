# Project harness backlog

Current work ledger, reviewed 24 November 2026 against main `6e731fd` (PR #240, green CI). Released v10.6.0 (F-089, closed: skills stay valid across releases). Opened B-049, F-091, F-092 from the [skill discovery review](reviews/skills/2026-11-24.md). History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 4.25 h across 3 open steps of 2 features and 1 other record. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="b-049"></a>[🐞 B-049](#top)

**Friction samples recorded in a worktree are lost with it**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h | — | — | 🤖 | — | — |

💻 **→** Next: B-049-T01 — friction.mjs writes to the primary checkout's .harness/ from any worktree (Planned).

| | |
|---|---|
| **Issue** | Skill discovery review 2026-11-24: `friction.mjs` writes `.harness/friction.jsonl` under the checkout it runs in. Every task runs in its own worktree (AGENTS), so samples recorded there are deleted with the worktree, and `maintenance.mjs review` from a worktree fails with "Finish a timed workflow" although the primary checkout has recent samples. |
| **Reproduce** | In a linked worktree: `node tools/friction.mjs start --operation=reconciliation`, `finish`, then `git worktree remove`; the sample is gone. Or run `node tools/maintenance.mjs review` from a worktree. |
| **Check** | A fixture test that failed before the fix: samples from a worktree land in the primary checkout's `.harness/`; a review from a worktree sees them. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-049-t01"></a>B-049-T01 — friction.mjs writes to the primary checkout's .harness/ from any worktree | 1 h | 0 h | 1 h | Planned |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 1 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-049.md)

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-24 |
| Verification | — |
| Reviewed | 2026-11-24 |

</details>

---
### <a id="f-092"></a>[✨ F-092](#top)

**Apply the copied reviewer agents in this repository**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0.25 h | — | — | 🤖 | — | — |

💻 **→** Next: F-092-T01 — Apply the copied reviewer agents in this repository (Planned).

| | |
|---|---|
| **Issue** | Skill discovery review 2026-11-24: the Independent review rule names the pinned `mechanical-reviewer` and `design-reviewer` agents, which `core/` ships, but this repository's `.harness.json` does not list them, so its own reviews run on a generic agent. |
| **Reproduce** | `ls .claude/agents` in this repository: missing. |
| **Check** | Both definitions copied byte-identical and listed as copied; check:template and check-harness pass. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-092-t01"></a>F-092-T01 — Apply the copied reviewer agents in this repository | 0.25 h | 0 h | 0.25 h | Planned |
| 🟢 Small | **Total** | 0.25 h | 0 h (0 of 1 steps recorded) | 0.25 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-092.md)

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-24 |
| Verification | — |
| Reviewed | 2026-11-24 |

</details>

---
### <a id="f-091"></a>[✨ F-091](#top)

**Close a released record in one command**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟡 Medium | 3 h | — | — | 🤖 | — | — |

💻 **→** Next: F-091-T01 — work:close closes a released record: archive, reconcile log entry, header (Planned).

| | |
|---|---|
| **Issue** | Skill discovery review 2026-11-24: about 35 commits since 2026-10-25 close a record on its release by hand (status, archive under the closing week, week counts, reconcile log, header). Hand edits trip the validators (for example an actual without its source). |
| **Reproduce** | Close a released record by hand following BACKLOG-RULES closure. |
| **Check** | `npm run work:close -- <ID> --release vX.Y.Z` refuses an unpublished tag, archives the record with closed steps, and `check:backlog`/`check:work` pass on the result. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-091-t01"></a>F-091-T01 — work:close closes a released record: archive, reconcile log entry, header | 3 h | 0 h | 3 h | Planned |
| 🟡 Medium | **Total** | 3 h | 0 h (0 of 1 steps recorded) | 3 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-091.md)

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-24 |
| Verification | — |
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
