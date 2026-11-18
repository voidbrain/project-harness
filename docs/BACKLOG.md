# Project harness backlog

Current work ledger, reviewed 15 November 2026 against main `4152ff3` (PRs #206–#208, green CI). v8.17.0 release: F-080-T02 and F-082 verified. Open: F-080, F-083, F-084, F-075. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 6 h agent + 0.75 h owner across 12 open steps of 2 features. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-075"></a>[✨ F-075](#top)

**Self-contained skills packaged for distribution outside Git (Agensi)**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🔴 Large | 5 h agent + 0.5 h owner | — | — | 🤖 | — | — |

💻 **→** Next: F-075-T01.

| | |
|---|---|
| **Issue** | Owner request 2026-11-14: Agensi distributes skills only as self-contained zips (SKILL.md at the root with valid frontmatter, plus scripts, references and templates). A listing cannot fetch its content from GitHub, and there is no Git sync, so an update is a manual re-upload to the same listing. The harness's only skill, `skills/apply-harness`, is a pointer to this repository and cannot be listed. Seven workflows can stand alone: change impact, fresh-context review, copy-paste owner checks, failing test before the fix, architecture reassessment, task handoff and documentation hygiene. |
| **Reproduce** | Zip `skills/apply-harness`: the result tells an agent to fetch the template and read `APPLY.md`, which the zip does not contain. |
| **Check** | Each of the seven skills lives once under `skills/<name>/` and is the source both the harness and the zip use; `npm run skills:package` writes one zip per skill with `SKILL.md` at the root, `LICENSE` and a version; a check in CI fails when a skill links a file it does not bundle (`AGENTS.md`, `BACKLOG-RULES`, `tools/`, `docs/`) or needs `.harness.json` to work; each skill states its version and the repository link for newer releases; the owner uploads the first zip and records the listing. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who |
|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-075-t01"></a>F-075-T01 — Skills layout and packaging script | 1 h | 0 h | 1 h | Ready | 🤖 |
| 🟢 Small | <a id="f-075-t02"></a>F-075-T02 — Self-contained check in CI | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-075-T01](#f-075-t01) | ⏳ 🤖 |
| 🟢 Small | <a id="f-075-t03"></a>F-075-T03 — Skill: change impact | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-075-T01](#f-075-t01), [F-075-T02](#f-075-t02) | ⏳ 🤖 |
| 🟢 Small | <a id="f-075-t04"></a>F-075-T04 — Skill: fresh-context review | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-075-T01](#f-075-t01), [F-075-T02](#f-075-t02) | ⏳ 🤖 |
| 🟢 Small | <a id="f-075-t05"></a>F-075-T05 — Skill: copy-paste owner checks | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-075-T01](#f-075-t01), [F-075-T02](#f-075-t02) | ⏳ 🤖 |
| 🟢 Small | <a id="f-075-t06"></a>F-075-T06 — Skill: failing test before the fix | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-075-T01](#f-075-t01), [F-075-T02](#f-075-t02) | ⏳ 🤖 |
| 🟢 Small | <a id="f-075-t07"></a>F-075-T07 — Skill: architecture reassessment | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-075-T01](#f-075-t01), [F-075-T02](#f-075-t02) | ⏳ 🤖 |
| 🟢 Small | <a id="f-075-t08"></a>F-075-T08 — Skill: task handoff and context | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-075-T01](#f-075-t01), [F-075-T02](#f-075-t02) | ⏳ 🤖 |
| 🟢 Small | <a id="f-075-t09"></a>F-075-T09 — Skill: documentation hygiene | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-075-T01](#f-075-t01), [F-075-T02](#f-075-t02) | ⏳ 🤖 |
| 🟢 Small | <a id="f-075-t10"></a>F-075-T10 — Upload the first skills to Agensi and record the listings | 0 h | 0 h | 0 h agent + 0.5 h owner | Planned · waits on [F-075-T03](#f-075-t03), [F-075-T04](#f-075-t04), [F-075-T05](#f-075-t05), [F-075-T06](#f-075-t06), [F-075-T07](#f-075-t07), [F-075-T08](#f-075-t08), [F-075-T09](#f-075-t09) | ⏳ 🧑‍🔧 |
| 🔴 Large | **Total** | 5 h | 0 h (0 of 10 steps recorded) | 5 h agent + 0.5 h owner | 0 of 10 completed | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-075.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #167](https://github.com/voidbrain/project-harness/pull/167) (record and steps opened) |
| Opened | 2026-11-14 |
| Verification | Pending. |
| Reviewed | 2026-11-14 |

</details>

---
### <a id="f-080"></a>[✨ F-080](#top)

**Measured actuals leave out time the agent could not run**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h agent + 0.25 h owner | — | — | ⏳ | 🧑‍🔧 | — |

🧑 **→** Next: F-080-T03 (owner captures Gemini CLI quota sample; see `docs/design/gemini-quota-sample-2026-11-14.md`).

| | |
|---|---|
| **Issue** | Owner report 2026-11-14: a Codex job stopped at its usage limit and finished hours later; the step's `measured` actual (job start to finish) read 4.5 h against a 0.5 h estimate, so calibration took a stall for an estimation miss. |
| **Reproduce** | Start a job, wait out a long stop without work, finish it: `work-usage report` gives the whole span as elapsed time, with nothing to set the stop apart. |
| **Check** | A recorded pause is subtracted from the effective elapsed time in the report, per step and in estimate comparisons, while reviews and CI waits stay counted; the report suggests pauses from allowance snapshots at their limit and from long gaps without activity, never subtracting one on its own; Gemini allowance snapshots are read like Codex and Claude ones. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who | PRs |
|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-080-t03"></a>F-080-T03 — Capture a Gemini CLI quota sample | — | 0 h | 0 h agent + 0.25 h owner | Planned | [🧑‍🔧](design/gemini-quota-sample-2026-11-14.md) | — |
| 🟢 Small | <a id="f-080-t04"></a>F-080-T04 — Gemini allowance snapshots | 1 h | 0 h | 1 h | Planned · waits on [F-080-T03](#f-080-t03) | ⏳ 🤖 | — |
| 🟢 Small | **Total** | 2.75 h (3 of 4 steps) | 0 h (0 of 4 steps recorded) | 1 h agent + 0.25 h owner | 2 of 4 completed | | |

<details><summary>Done steps (2)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| — | <a id="f-080-t01"></a>F-080-T01 — Paused intervals and effective elapsed time | 0.75 h | 0 h | Completed | PR #202 implementation |
| — | <a id="f-080-t02"></a>F-080-T02 — Suggested pauses from allowance limits and activity gaps | 1 h | 0 h | Completed | PR #207 suggestedPauses |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-080.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-080-T01: PR #202 implementation · F-080-T02: PR #207 suggestedPauses; step review: fresh-context subagent review: clean. [PR #202](https://github.com/voidbrain/project-harness/pull/202) (F-080-T01, record and steps opened) |
| Opened | 2026-11-14 |
| Verification | 2026-11-18: F-080-T01 and F-080-T02 verified on green CI (PR #202, PR #207). |
| Reviewed | 2026-11-18 |

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
