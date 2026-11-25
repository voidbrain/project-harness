# Project harness backlog

Current work ledger, reviewed 25 November 2026 against main `351f3e2` (PR #274, green CI). B-054 closed on v10.15.1. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 11.25 h across 12 open steps of 3 features and 1 other record. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-095"></a>[✨ F-095](#top)

**Solution profile: one order and an owner view, with cross-repository step prerequisites**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 3.25 h | — | [F-097-T03](#f-097-t03), [F-097-T04](#f-097-t04) | 🤖 | — | — |

💻 **→** Next: F-095-T04 — Remaining hours per backlog and a partial solution total (Implemented; verification pending).

| | |
|---|---|
| **Issue** | A solution coordinator proposed (2026-11-24, at its owner's instruction) that the solution profile give an owner steering several repositories one order across them, readiness instead of status only, remaining hours, the agent hours doable before a block, gaps between repositories, and first-class step prerequisites across repositories. It has these today as its own project tools. |
| **Reproduce** | Run `node tools/solution.mjs dashboard` on a coordinator: it lists each component's records with status, human action and effort, but no order across repositories, no readiness, hours or runway, and no cross-repository step link; a task file's `dependsOn` refuses a step of another repository. |
| **Check** | Fixture coordinators and components in the template's tests: an order with a ready item behind a waiting one; an order reference to a closed record; an unknown heading and a renamed summary column (reported, not empty); an unreadable total (partial sum); a step depending on `repo:STEP-ID` accepted and waiting until met. Runway, audits and gap review: F-097. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-095-t04"></a>F-095-T04 — Remaining hours per backlog and a partial solution total | 1.5 h | 0 h | 0.25 h | Implemented; verification pending | — | [F-097-T04](#f-097-t04) |
| 🟡 Medium | <a id="f-095-t05"></a>F-095-T05 — Owner view: order with live state, waiting on the owner, blocked and nothing to do | 3 h | 0 h | 3 h | Planned | — | [F-097-T03](#f-097-t03), [F-097-T04](#f-097-t04) |
| 🟡 Medium | **Total** | 11 h | 0 h (0 of 5 steps recorded) | 3.25 h | 3 of 5 completed | | |

<details><summary>Done steps (3)</summary>

| Effort | Step | Estimate | Actual | Status |
|---|---|---|---|---|
| — | <a id="f-095-t01"></a>F-095-T01 — Steps may depend on a step of another repository (repo:STEP-ID) | 2 h | 0 h | Completed |
| — | <a id="f-095-t02"></a>F-095-T02 — Solution order file and its rules | 2 h | 0 h | Completed |
| — | <a id="f-095-t03"></a>F-095-T03 — Dashboard reader keeps steps and readiness, and reports unknown layouts | 2.5 h | 0 h | Completed |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-095.md)

| Field | Value |
|---|---|
| PR / evidence | [#252](https://github.com/voidbrain/project-harness/pull/252) · Review: independent design review (coordinator session, 2026-11-24), clean to land; minors fixed (claim fixture test, link-path note, a `repo:ID` in prose no longer reads as a local blocker). Test: `tools/test-work-items.mjs` F-095-T01 tests.; [#257](https://github.com/voidbrain/project-harness/pull/257); [#265](https://github.com/voidbrain/project-harness/pull/265); [#266](https://github.com/voidbrain/project-harness/pull/266); [#267](https://github.com/voidbrain/project-harness/pull/267); [#269](https://github.com/voidbrain/project-harness/pull/269); [#270](https://github.com/voidbrain/project-harness/pull/270); [#273](https://github.com/voidbrain/project-harness/pull/273) |
| Opened | 2026-11-24 |
| Verification | Script: F-095-T01 passed (#252 CI green, 2026-11-24); released in v10.10.0. Remaining steps pending. |
| Reviewed | 2026-11-25 |

</details>

---

### <a id="b-055"></a>[🐞 B-055](#top)

**Agent-behaviour graders look only at the primary checkout**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0.25 h | — | — | 🤖 | — | — |

💻 **→** Next: B-055-T01 — Graders read the agent's worktrees and branches (Implemented; verification pending).

| | |
|---|---|
| **Issue** | The behaviour graders read the fixture's primary checkout on `main`. An agent that follows AGENTS.md works in a git worktree on its own branch and pushes it: in the owner's run with permissions, `bug-is-b-record` failed although the agent created B-001 on branch `backlog/b-001-sum-empty` in a worktree and pushed it. Likely affects every grader that reads files (`name-the-pr`, `keep-unrelated-code`, `failing-test-first`, `promise-becomes-record`, `report-failing-test`, …). Reported by the coordinator on 2026-11-25. |
| **Reproduce** | Prepare `bug-is-b-record`, record B-001 in a new worktree on a branch, commit and push it, leave the primary checkout untouched: `node tools/behaviour.mjs grade bug-is-b-record <dir>` fails. |
| **Check** | Fixture tests: a scenario's work done in another worktree, on a local branch only, or on a branch pushed to the fixture remote is graded there; the primary checkout is graded when it is the only one changed; when several views changed, each is graded and every one must pass (a violation on any branch still fails). |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-055-t01"></a>B-055-T01 — Graders read the agent's worktrees and branches | 1 h | 0 h | 0.25 h | Implemented; verification pending |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 0.25 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-055.md)

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-25 |
| Verification | Pending |
| Reviewed | 2026-11-25 |

</details>

---
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

### <a id="f-097"></a>[✨ F-097](#top)

**Solution profile: agent runway, audits per project and gap review**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🔴 Large | 7.5 h | [F-095-T05](#f-095-t05), [F-095-T04](#f-095-t04) | — | 🤖 | — | — |

💻 **→** Next: F-097-T01 — Agent runway across repositories (Planned).

| | |
|---|---|
| **Issue** | Split from F-095 by the owner on 2026-11-24. A solution coordinator's owner needs to see how many agent hours can run across repositories before work reaches a block, which projects are due an audit or behind the harness, and which cross-repository records are missing. The coordinator has these as its own project tools today. |
| **Reproduce** | Run `node tools/solution.mjs dashboard` on a coordinator: no runway, no audit or harness status per project, no gap proposals. |
| **Check** | Fixture coordinators and components: a chain A (agent) → B (agent, other repository) → C (owner) counts A and B and reports C; a cycle and a missing prerequisite are reported, not looped; an overdue audit and a project behind the harness are shown; a cross-repository sentence with and without a counterpart and an owner step with no page give gap proposals, each naming the repository that would own the fix. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-097-t01"></a>F-097-T01 — Agent runway across repositories | 2.5 h | 0 h | 2.5 h | Planned | — | [F-097-T04](#f-097-t04) |
| 🟡 Medium | <a id="f-097-t02"></a>F-097-T02 — Audits, reviews and harness release per project | 1.5 h | 0 h | 1.5 h | Planned | — | [F-097-T03](#f-097-t03) |
| 🟡 Medium | <a id="f-097-t03"></a>F-097-T03 — Gap review: proposals for missing cross-repository work | 2.5 h | 0 h | 2.5 h | Planned | [F-095-T05](#f-095-t05), [F-097-T02](#f-097-t02) | [F-097-T04](#f-097-t04) |
| 🟢 Small | <a id="f-097-t04"></a>F-097-T04 — Coordinator adoption notes and release for the solution views | 1 h | 0 h | 1 h | Planned | [F-095-T04](#f-095-t04), [F-095-T05](#f-095-t05), [F-097-T01](#f-097-t01), [F-097-T03](#f-097-t03) | — |
| 🔴 Large | **Total** | 7.5 h | 0 h (0 of 4 steps recorded) | 7.5 h | 0 of 4 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-097.md)

| Field | Value |
|---|---|
| PR / evidence | [#253](https://github.com/voidbrain/project-harness/pull/253) |
| Opened | 2026-11-24 |
| Verification | Pending |
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
