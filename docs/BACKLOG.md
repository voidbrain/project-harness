# Project harness backlog

Current work ledger, reviewed 15 November 2026 against main `4152ff3` (PRs #206–#208, green CI). v8.17.0 release: F-080-T02 and F-082 verified. Open: F-080, F-083, F-084, F-075. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 7.75 h agent + 0.75 h owner across 24 open steps of 4 features and 4 other records. 1 h of actual effort recorded on 4 steps. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="b-043"></a>[🐞 B-043](#top)

**A record whose steps are all done renders a broken steps table and can still show remaining hours**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: all steps closed; verify and close the record.

| | |
|---|---|
| **Issue** | Found 2026-11-15 by the owner on F-084: its only step F-084-T01 was verified, yet the record showed 1 h remaining and "0 of 1 completed", and its steps table rendered a header, a blank line and a loose Total row. Two causes: (1) when every step is done the main table has no rows and the generator still emits an empty row line, so a blank line splits the header from the Total row; (2) nothing refuses a verified or closed step that keeps `agentHours`/`ownerHours` (F-083-T01, F-083-T02 and F-084-T01 here; three NERV steps), so the totals keep counting it. |
| **Reproduce** | Render a record whose every step is verified or closed; give one of them `agentHours: 1`. |
| **Check** | Committed tests fail first: the Total row follows the table header directly when no step is open; `check:work` refuses a verified or closed step with remaining agent hours, owner hours or days, naming it; the rule is documented in `estimates.md`. "0 of N completed" counts closed steps only (Verified is a transition, closure.md) and stays as is. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | **Total** | 1 h | 0.5 h | 0 h | 2 of 2 completed |

<details><summary>Done steps (2)</summary>

| Effort | Step | Estimate | Actual | Status |
|---|---|---|---|---|
| 🟢 Small | <a id="b-043-t01"></a>B-043-T01 — The Total row follows the header when every step is done | 0.5 h | 0.25 h (stated) | Verified |
| 🟢 Small | <a id="b-043-t02"></a>B-043-T02 — check:work refuses a done step with remaining hours | 0.5 h | 0.25 h (stated) | Verified |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-043.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #212](https://github.com/voidbrain/project-harness/pull/212) |
| Opened | 2026-11-15 |
| Verification | Pending |
| Reviewed | 2026-11-15 |

</details>

---
### <a id="b-044"></a>[🐞 B-044](#top)

**Maintenance review rejects every backlog outcome whose record heading is generated**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: all steps closed; verify and close the record.

| | |
|---|---|
| **Issue** | Found 2026-11-15 recording the maintenance review for PR #212: `maintenance.mjs review` threw "Outcome must link an owning active backlog record" for F-083 and F-084, both active. The heading pattern in `tools/maintenance.mjs` escapes `\d` twice inside a template literal, so it matches a literal backslash and never matches a generated heading (`### <a id="f-083"></a>[✨ F-083](#top)`); only a plain `### F-083` heading passed, which is what the test used. Every `backlog` outcome in a project with a generated ledger was refused. |
| **Reproduce** | A `backlog` outcome targeting an active record whose heading carries its anchor and link. |
| **Check** | A committed test fails first: outcomes targeting a generated F- and B- heading are accepted; the pattern matches `\d`; core and root copies identical. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | **Total** | 0.25 h | 0.25 h | 0 h | 1 of 1 completed |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status |
|---|---|---|---|---|
| 🟢 Small | <a id="b-044-t01"></a>B-044-T01 — Backlog outcomes link generated record headings | 0.25 h | 0.25 h (stated) | Verified |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-044.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #212](https://github.com/voidbrain/project-harness/pull/212) |
| Opened | 2026-11-15 |
| Verification | Pending |
| Reviewed | 2026-11-15 |

</details>

---
### <a id="b-045"></a>[🐞 B-045](#top)

**An owner step without ownerKind has no page and check:work does not notice**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0.5 h | — | — | — | — | — |

💻 **→** Next: all steps closed; verify and close the record.

| | |
|---|---|
| **Issue** | Found 2026-11-15 by the owner in NERV (F-005-T15, "verification pending" with a 🧑 but no link): a step that owes `ownerHours` but has no `effort.ownerKind` (a pre-8.10 mixed step) shows a bare 🧑 without a page, and `check:work` lists only owner steps that declare an `ownerKind` (`ownerStepsWithoutLink`), so the missing procedure goes unnoticed. NERV has others (F-007-T05, F-060-T01 lack a link). |
| **Reproduce** | A step with `ownerHours: 0.5`, no `ownerKind`, no `ownerLink`, whose turn it is. |
| **Check** | A committed test fails first: `check:work` reports a step whose turn it is with owner hours but no `ownerKind` (and so no page), naming it; the steps rules say to split or classify it. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status | PRs |
|---|---|---|---|---|---|---|
| 🟢 Small | **Total** | 0.5 h | 0 h (0 of 1 steps recorded) | 0.5 h | 1 of 1 completed | |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-045-t01"></a>B-045-T01 — check:work reports owner hours without ownerKind | 0.5 h | 0 h | Verified | PR #214 ownerHours without ownerKind check and steps rule |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-045.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: B-045-T01: PR #214 ownerHours without ownerKind check and steps rule; step review: fresh-context subagent review (19df4a45): B-019 fixture line restored and verified. — |
| Opened | 2026-11-15 |
| Verification | Pending |
| Reviewed | 2026-11-15 |

</details>

---
### <a id="b-046"></a>[🐞 B-046](#top)

**A record's Total row says "0 of N completed" while its Done table lists every step**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: all steps closed; verify and close the record.

| | |
|---|---|
| **Issue** | Owner report 2026-11-15 on B-043: both steps sit in "Done steps (2)" (verified), yet the Total row reads "0 of 2 completed" and each done step's actual reads "0.25 h so far". The Done table counts verified and closed steps; the Total row counted only closed ones and the actual said "so far" for anything not closed, so one record contradicted itself. Raised by the PR #212 review (should-fix 4) and wrongly kept as "by design". |
| **Reproduce** | A record whose steps are all verified, with stated actuals. |
| **Check** | A committed test fails first: the Total row counts the steps the Done table lists (verified or closed) as completed, and a done step's actual has no "so far"; remaining effort and record size are unchanged. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | **Total** | 0.25 h | 0.25 h | 0 h | 1 of 1 completed |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status |
|---|---|---|---|---|
| 🟢 Small | <a id="b-046-t01"></a>B-046-T01 — Total row and actuals agree with the Done table | 0.25 h | 0.25 h (stated) | Verified |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-046.md)

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-15 |
| Verification | Pending |
| Reviewed | 2026-11-15 |

</details>

---
### <a id="f-083"></a>[✨ F-083](#top)

**Token-cost and rule reviews run on a cadence, with an outside scan**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h | — | — | — | — | — |

💻 **→** Next: F-083-T03, the review findings and the opt-in cadence.

| | |
|---|---|
| **Issue** | Owner request 2026-11-15: token rules exist (rule-load budgets, task context, prompt caching, usage accounting) but nothing re-examines them on a schedule or looks outside for better techniques (for example terse-output styles, context trimming, caching changes in agent tools). |
| **Reproduce** | `check:freshness` never says a token or architecture review is due; `rule-review.md` measures friction only when triggered. |
| **Check** | Configurable cadences (`reviews.<name>.days`) make `check:freshness` report a due periodic review, like audits; the token review in `rule-review.md` compares measured usage (work-usage reports, rule-load) with current outside practice found by web search, and records each idea as adopt, adapt or reject with the reason, never changing rules unattended. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | PRs |
|---|---|---|---|---|---|---|
| 🟢 Small | **Total** | 3.5 h | 0 h (0 of 3 steps recorded) | 1 h | 3 of 3 completed | |

<details><summary>Done steps (3)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-083-t01"></a>F-083-T01 — Periodic review cadence | 1.5 h | 0 h | Verified | PR #210 periodic review cadence check and tests |
| 🟢 Small | <a id="f-083-t02"></a>F-083-T02 — Token review with an outside scan | 1 h | 0 h | Verified | PR #210 periodic token review procedure |
| 🟢 Small | <a id="f-083-t03"></a>F-083-T03 — Fix the review cadence findings and make it opt-in | 1 h | 0 h | Verified | PR #214 review cadence hardening, opt-in core config, private web scans |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-083.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-083-T01: PR #210 periodic review cadence check and tests; step review: None before merge: PR #210 merged without the independent review its harness changes required (the earlier note citing a fresh-context review and fc5eb847 was wrong; owner, 2026-11-15). Post-merge review: docs/reviews/2026-11-15-pr210-review.md. · F-083-T02: PR #210 periodic token review procedure; step review: None before merge: PR #210 merged without the independent review its harness changes required (the earlier note citing a fresh-context review and fc5eb847 was wrong; owner, 2026-11-15). Post-merge review: docs/reviews/2026-11-15-pr210-review.md. · F-083-T03: PR #214 review cadence hardening, opt-in core config, private web scans; step review: fresh-context subagent review (19df4a45): B-019 fixture line restored and verified. — |
| Opened | 2026-11-15 |
| Verification | Pending |
| Reviewed | 2026-11-15 |

</details>

---

### <a id="f-084"></a>[✨ F-084](#top)

**Architecture reassessment compares with outside systems on a cadence**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 0.25 h | — | — | — | — | — |

💻 **→** Next: F-084-T02, private scans and one report location; then close.

| | |
|---|---|
| **Issue** | Owner request 2026-11-15: `architecture-review.md` runs only on triggers and does not ask for a comparison with frontier and similar systems (concepts to keep, integrate or reject, at what level and why). |
| **Reproduce** | Read `docs/agents/architecture-review.md`: no cadence and no outside-landscape step. |
| **Check** | The procedure gains an outside-landscape step (web search of comparable and frontier systems; per concept: adopt, adapt, reject or watch, the level it would enter at, why and why not) and uses the F-083 cadence (`reviews.architecture.days`); results are decision records and backlog records in the owning repository. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | PRs |
|---|---|---|---|---|---|---|
| 🟢 Small | **Total** | 1.25 h | 0 h (0 of 2 steps recorded) | 0.25 h | 2 of 2 completed | |

<details><summary>Done steps (2)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-084-t01"></a>F-084-T01 — Outside landscape in the architecture review | 1 h | 0 h | Verified | PR #210 outside-landscape architecture comparison |
| 🟢 Small | <a id="f-084-t02"></a>F-084-T02 — Private outside scans and one report location | 0.25 h | 0 h | Verified | PR #214 private outside scans and single report location |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-084.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-084-T01: PR #210 outside-landscape architecture comparison; step review: None before merge: PR #210 merged without the independent review its harness changes required (the earlier note citing a fresh-context review and fc5eb847 was wrong; owner, 2026-11-15). Post-merge review: docs/reviews/2026-11-15-pr210-review.md. · F-084-T02: PR #214 private outside scans and single report location; step review: fresh-context subagent review (19df4a45): B-019 fixture line restored and verified. — |
| Opened | 2026-11-15 |
| Verification | Pending |
| Reviewed | 2026-11-15 |

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
### <a id="f-080"></a>[✨ F-080](#top)

**Measured actuals leave out time the agent could not run**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h agent + 0.25 h owner | — | — | 🤖 | 🧑‍🔧 | — |

🧑 **→** Next: F-080-T03 (owner captures Gemini CLI quota sample; see `docs/design/gemini-quota-sample-2026-11-14.md`).

| | |
|---|---|
| **Issue** | Owner report 2026-11-14: a Codex job stopped at its usage limit and finished hours later; the step's `measured` actual (job start to finish) read 4.5 h against a 0.5 h estimate, so calibration took a stall for an estimation miss. |
| **Reproduce** | Start a job, wait out a long stop without work, finish it: `work-usage report` gives the whole span as elapsed time, with nothing to set the stop apart. |
| **Check** | A recorded pause is subtracted from the effective elapsed time in the report, per step and in estimate comparisons, while reviews and CI waits stay counted; the report suggests pauses from allowance snapshots at their limit and from long gaps without activity, never subtracting one on its own; Gemini allowance snapshots are read like Codex and Claude ones. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who | PRs |
|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-080-t01"></a>F-080-T01 — Paused intervals and effective elapsed time | 0.75 h | 0 h | 0 h | Implemented; verification pending | 🤖 | — |
| 🟢 Small | <a id="f-080-t03"></a>F-080-T03 — Capture a Gemini CLI quota sample | — | 0 h | 0 h agent + 0.25 h owner | Planned | [🧑‍🔧](design/gemini-quota-sample-2026-11-14.md) | — |
| 🟢 Small | <a id="f-080-t04"></a>F-080-T04 — Gemini allowance snapshots | 1 h | 0 h | 1 h | Planned · waits on [F-080-T01](#f-080-t01), [F-080-T03](#f-080-t03) | ⏳ 🤖 | — |
| 🟢 Small | **Total** | 2.75 h (3 of 4 steps) | 0 h (0 of 4 steps recorded) | 1 h agent + 0.25 h owner | 1 of 4 completed | | |

<details><summary>Done steps (1)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-080-t02"></a>F-080-T02 — Suggested pauses from allowance limits and activity gaps | 1 h | 0 h | Verified | PR #207 suggestedPauses |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-080.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-080-T02: PR #207 suggestedPauses; step review: fresh-context subagent review: clean. [PR #202](https://github.com/voidbrain/project-harness/pull/202) (F-080-T01, record and steps opened) |
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
