# Project harness backlog

Current work ledger, reviewed 24 November 2026 against main `89a3657` (PRs #237–#238, green CI). Released v10.5.0 (F-090, closed: AGENTS within the always-loaded budget); v10.1.1 tagged on its #225 merge. Open: F-088, F-089. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 1.75 h across 2 open steps of 2 features. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-088"></a>[✨ F-088](#top)

**Landing queue: parallel agents land one PR at a time**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0.25 h | — | — | 🤖 | — | — |

💻 **→** Next: F-088-T01 — Landing queue in parallel-work and the AGENTS merge line (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Owner decision 2026-11-23, from NERV: five agents and several landing scripts merging at once queued up to 12 CI runs, each merge restarted every other PR (about N×(N−1)/2 extra runs), and timing-sensitive tests failed that pass alone. |
| **Reproduce** | Run several agents that each merge their own PR as soon as it is green. |
| **Check** | core/docs/agents/parallel-work.md "Landing queue": agents stop at ready; one lander merges one at a time, at most two PRs in CI; one heavy local run per machine; real failures go back to their owner. core/AGENTS.md lands through it. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-088-t01"></a>F-088-T01 — Landing queue in parallel-work and the AGENTS merge line | 0.25 h | 0 h | 0.25 h | Implemented; verification pending |
| 🟢 Small | **Total** | 0.25 h | 0 h (0 of 1 steps recorded) | 0.25 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-088.md)

| Field | Value |
|---|---|
| PR / evidence | Opened in [PR #236](https://github.com/voidbrain/project-harness/pull/236). |
| Opened | 2026-11-23 |
| Verification | — |
| Reviewed | 2026-11-23 |

</details>

---
### <a id="f-089"></a>[✨ F-089](#top)

**Skills stay valid across harness updates**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 1.5 h | — | — | 🤖 | — | — |

💻 **→** Next: F-089-T01 — check:skills verifies the commands and files a skill names; releases list skills touching changed files (Planned).

| | |
|---|---|
| **Issue** | Owner question 2026-11-23: check:skills validates structure and links only; nothing notices when a release renames a script, tool or document a skill names, or changes a rule a skill describes. Discovery stays periodic (reviews.skills.days); validity needs a per-release check. |
| **Reproduce** | Rename an npm script a skill names, release, and run check:skills: it still passes. |
| **Check** | check:skills fails on a named script, tool or doc missing from the release; each release lists skills that mention a changed file. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-089-t01"></a>F-089-T01 — check:skills verifies the commands and files a skill names; releases list skills touching changed files | 1.5 h | 0 h | 1.5 h | Planned |
| 🟡 Medium | **Total** | 1.5 h | 0 h (0 of 1 steps recorded) | 1.5 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-089.md)

| Field | Value |
|---|---|
| PR / evidence | Opened in [PR #236](https://github.com/voidbrain/project-harness/pull/236). |
| Opened | 2026-11-23 |
| Verification | — |
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
