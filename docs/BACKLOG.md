# Project harness backlog

Current work ledger, reviewed 25 November 2026 against main `5d91676` (PR #276, green CI). F-095 closed on v10.16.0. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 6.25 h across 10 open steps of 2 features and 1 other record. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="b-056"></a>[🐞 B-056](#top)

**Agent-behaviour graders fail correct work: nested worktrees, legacyMean, a request to choose, the name-the-pr fixture**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0.5 h | — | — | 🤖 | — | — |

💻 **→** Next: B-056-T01 — Graders accept correct work the owner's rerun failed (Implemented; verification pending).

| | |
|---|---|
| **Issue** | The owner's rerun on v10.15.2 with the documented runner still failed correct work (reported by the coordinator, 2026-11-25). Reproduced once per scenario with `--keep` and transcripts read: (1) an agent's worktree under `.claude/worktrees/` inside the checkout made the untouched primary checkout a changed view, graded and failed ("no new B- record (the primary checkout)"; also `keep-unrelated-code`, `failing-test-first`, `promise-becomes-record`); (2) `keep-unrelated-code` failed an agent that rewrote `legacyMean` to keep its exact behaviour, as the fixture's comment asks, because the grader compares text; (3) `ask-human-decision` failed "Reply A or B" for want of a `?`; (4) `name-the-pr` says PR #12 merged but the fixture's `main` has no such merge, fix or test, so the agent rightly refused to close B-001 (reported as could not act). |
| **Reproduce** | `node tools/behaviour.mjs run --scenarios=<id> --times=1 --keep --runner=…` with the runner in the rule-review guide, or the fixture tests "B-056: …" in `tools/test-behaviour.mjs`. |
| **Check** | Fixture tests: a worktree nested in the checkout is its own view, not a change to the checkout; `legacyMean` rewritten with the same results (mean, TypeError on an empty list) passes and removing it fails; a request to choose without `?` passes; the `name-the-pr` fixture has `Merge pull request #12` on `main` with the fix and an empty-list test. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-056-t01"></a>B-056-T01 — Graders accept correct work the owner's rerun failed | 1.5 h | 0 h | 0.5 h | Implemented; verification pending |
| 🟢 Small | **Total** | 1.5 h | 0 h (0 of 1 steps recorded) | 0.5 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-056.md)

| Field | Value |
|---|---|
| PR / evidence | Pending; [#278](https://github.com/voidbrain/project-harness/pull/278) |
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
| 🔴 Open | 🔶 P2 | 🔴 Large | 5.5 h | — | — | 🤖 | — | — |

💻 **→** Next: F-097-T01 — Agent runway across repositories (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Split from F-095 by the owner on 2026-11-24. A solution coordinator's owner needs to see how many agent hours can run across repositories before work reaches a block, which projects are due an audit or behind the harness, and which cross-repository records are missing. The coordinator has these as its own project tools today. |
| **Reproduce** | Run `node tools/solution.mjs dashboard` on a coordinator: no runway, no audit or harness status per project, no gap proposals. |
| **Check** | Fixture coordinators and components: a chain A (agent) → B (agent, other repository) → C (owner) counts A and B and reports C; a cycle and a missing prerequisite are reported, not looped; an overdue audit and a project behind the harness are shown; a cross-repository sentence with and without a counterpart and an owner step with no page give gap proposals, each naming the repository that would own the fix. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-097-t01"></a>F-097-T01 — Agent runway across repositories | 2.5 h | 0 h | 0.5 h | Implemented; verification pending | — | [F-097-T04](#f-097-t04) |
| 🟡 Medium | <a id="f-097-t02"></a>F-097-T02 — Audits, reviews and harness release per project | 1.5 h | 0 h | 1.5 h | Planned | — | [F-097-T03](#f-097-t03) |
| 🟡 Medium | <a id="f-097-t03"></a>F-097-T03 — Gap review: proposals for missing cross-repository work | 2.5 h | 0 h | 2.5 h | Planned | [F-097-T02](#f-097-t02) | [F-097-T04](#f-097-t04) |
| 🟢 Small | <a id="f-097-t04"></a>F-097-T04 — Coordinator adoption notes and release for the solution views | 1 h | 0 h | 1 h | Planned | [F-097-T01](#f-097-t01), [F-097-T03](#f-097-t03) | — |
| 🔴 Large | **Total** | 7.5 h | 0 h (0 of 4 steps recorded) | 5.5 h | 0 of 4 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-097.md)

| Field | Value |
|---|---|
| PR / evidence | [#253](https://github.com/voidbrain/project-harness/pull/253) |
| Opened | 2026-11-24 |
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
