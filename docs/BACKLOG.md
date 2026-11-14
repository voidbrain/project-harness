# Project harness backlog

Current work ledger, reviewed 14 November 2026 against main `f5e8f19` (PRs #187–#191, green CI). v8.14.0 releases F-078 and B-022; B-023 (intermittent tests) and F-075 open. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 6 h agent + 0.5 h owner across 12 open steps of 2 features and 1 other record. 3.75 h of actual effort recorded on 5 steps. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="b-022"></a>[🐞 B-022](#top)

**The backlog header depends on clone depth when two reconciliation entries share a date**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: release with F-078, then close.

| | |
|---|---|
| **Issue** | Reported 2026-11-14 from NERV PR #400: its CI validate job checks out one commit, and `work-items` orders same-day reconciliation entries by git ancestry (`headerSegment`, F-066). Without history the ancestry test fails and the earlier entry in the file wins, so CI built a different header than the full local clone and the check failed. NERV worked around it by putting its entry first. |
| **Reproduce** | Two `## <same date> — main \`<sha>\`` entries, the older commit first in the file; render the header in a full clone (the newer wins) and in `git clone --depth 1` (the older wins). |
| **Check** | A committed test fails first; when ancestry cannot be decided (a commit is missing), the header already committed in `docs/BACKLOG.md` chooses among the tied entries, so a single-commit clone renders what the full clone committed; the F-066 rule (the descendant wins whatever the file order) still holds with history. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| — | <a id="b-022-t01"></a>B-022-T01 — Header independent of clone depth | 0.5 h | 0.5 h (stated) | 0 h | Completed |
| — | **Total** | 0.5 h | 0.5 h | 0 h | 1 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-022.md)

| Field | Value |
|---|---|
| PR / evidence | Fix [PR #190](https://github.com/voidbrain/project-harness/pull/190); reported from NERV PR #400 (CI validate job, single-commit checkout) |
| Opened | 2026-11-14 |
| Verification | 2026-11-14, Script: `test-work-items.mjs` 46 pass, the B-022 single-commit clone test and the unchanged F-066 ancestry test included. |
| Reviewed | 2026-11-14 |

</details>

---
### <a id="b-023"></a>[🐞 B-023](#top)

**Two tool tests fail intermittently when the whole suite runs in parallel**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h | — | — | 🤖 | — | — |

💻 **→** Next: B-023-T01.

| | |
|---|---|
| **Issue** | Seen 2026-11-14 on the v8.14.0 release branch: `npm run test:tools` failed 2 of 249 once — "Codex collection terminates the app-server child after protocol error and timeout" (`test-work-usage.mjs:789`: got "timed out" instead of "failed": the fake app-server did not answer within the test's 1 s while 17 test files ran at once) and "CLI joins real git staged, unstaged, deleted and untracked paths with integration counting" (`test-verification.mjs`; its failure detail was overwritten before it was read). Both passed 3 of 3 alone and the next full run passed 249 of 249. Related: B-021's CI failure on the first test. |
| **Reproduce** | Run `npm run test:tools` repeatedly on a loaded machine; isolated runs pass. |
| **Check** | The verification test's failure detail survives the next run (`.test-report.txt` is overwritten by each run: keep it or copy it out first); each test's time budgets hold under the parallel suite (wait for the fake child's readiness, not a fixed 1 s), shown by 10 consecutive full runs passing; no assertion is weakened. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-023-t01"></a>B-023-T01 — Load-proof time budgets in two tool tests | 1 h | 0 h | 1 h | Ready |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 1 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-023.md)

| Field | Value |
|---|---|
| PR / evidence | Opened in [PR #192](https://github.com/voidbrain/project-harness/pull/192); local `test:tools` on the v8.14.0 release branch, 2026-11-14 (2 of 249 failed once, then 249 of 249) |
| Opened | 2026-11-14 |
| Verification | Pending. |
| Reviewed | 2026-11-14 |

</details>

---
### <a id="f-078"></a>[✨ F-078](#top)

**Rule load within budget: APPLY.md and the four heaviest triggers**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: F-078-T03 and F-078-T04.

| | |
|---|---|
| **Issue** | Full audit 2026-11-14, finding F3. F-076 added `check:rule-load` and brought AGENTS and BACKLOG-RULES within budget, but its release PR left the rest as follow-up work with no owning record: APPLY.md is 14,603 tokens against a 2,000-token file budget, and four triggers read more than 5,000 tokens (apply/reconcile/release 18,043; task context 5,200; template content 5,027; derived outputs 5,361). |
| **Reproduce** | `node tools/rule-load.mjs --check` in the template. |
| **Check** | APPLY.md split by trigger (adopt, reconcile, release, project overrides) with every sentence kept and a traceability table, as F-076 did; the four triggers route to files within budget; `check:rule-load` prints no warning; `check:rules` passes; fresh-context review; release. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who |
|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-078-t05"></a>F-078-T05 — Review and release | 0.5 h | 0.5 h so far (stated) | 0 h | Implemented; verification pending | 🤖 |
| — | <a id="f-078-t01"></a>F-078-T01 — Split plan for the owner's approval | 1 h | 0.75 h (stated) | 0 h | Completed | 🤖 |
| — | <a id="f-078-t02"></a>F-078-T02 — Owner approves or amends the split plan | 0 h | 0 h | 0 h | Completed | [🤔](design/apply-split-plan-2026-11-14.md) |
| — | <a id="f-078-t03"></a>F-078-T03 — Split APPLY.md by route | 1.5 h | 1.25 h (stated) | 0 h | Completed | 🤖 |
| — | <a id="f-078-t04"></a>F-078-T04 — Task context, area sections and the impact route | 0.75 h | 0.75 h (stated) | 0 h | Completed | 🤖 |
| 🟢 Small | **Total** | 3.75 h | 3.25 h (4 of 5 steps recorded) | 0 h | 4 of 5 completed | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-078.md)

| Field | Value |
|---|---|
| PR / evidence | Opened by the [full audit of 2026-11-14](audits/2026-11-14-full-harness.md) (finding F3), [PR #175](https://github.com/voidbrain/project-harness/pull/175); plan [PR #181](https://github.com/voidbrain/project-harness/pull/181); decision [PR #184](https://github.com/voidbrain/project-harness/pull/184); split [PR #189](https://github.com/voidbrain/project-harness/pull/189); routes [PR #191](https://github.com/voidbrain/project-harness/pull/191); release [PR #192](https://github.com/voidbrain/project-harness/pull/192) |
| Opened | 2026-11-14 |
| Verification | Pending. |
| Reviewed | 2026-11-14 |

</details>

---
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
