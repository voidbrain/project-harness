# Project harness backlog

Current work ledger, reviewed 14 November 2026 against main `be6c2f5` (PRs #194–#196, green CI). v8.14.1 published: B-023 closed and archived. Open: F-075. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 5.75 h agent + 0.5 h owner across 13 open steps of 1 feature and 3 other records. 0.5 h of actual effort recorded on 1 step. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="b-025"></a>[🐞 B-025](#top)

**`rule-load` builds a file pattern and a heading slug with incomplete escaping (CodeQL, high)**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🟡 Implemented | 🔶 P2 | 🟢 Small | 0 h | — | — | — | — | — |

💻 **→** Next: tag v8.14.2, then close.

| | |
|---|---|
| **Issue** | Found 2026-11-14 by CodeQL on NERV PR #404 (alerts 30 and 31, high) after NERV adopted `tools/rule-load.mjs`. `glob()` escapes only `.` when it turns a `rules.procedures` pattern into a regular expression, so `(`, `+` and other characters change what matches; `slug()` removes `<…>` once, so nested input leaves a fragment. Input is the project's own config and headings, so the risk is wrong matches and wrong anchors, not code execution; the alerts block NERV's required CodeQL check. |
| **Reproduce** | `rules.procedures: ["docs/notes/plan(v1)+*.md"]` matches `planv1a.md` and `planv11a.md` but not `plan(v1)+a.md`; `slug("Release <<b>b>notes</b>")` is `release-bnotes`. |
| **Check** | A committed test fails first for each; every regular-expression character except `*` is escaped; tags are removed until none remain; CodeQL reports no alert on the file. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-025-t01"></a>B-025-T01 — Complete escaping in rule-load glob and slug | 0.5 h | 0.5 h so far (stated) | 0 h | Implemented; verification pending |
| 🟢 Small | **Total** | 0.5 h | 0.5 h | 0 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-025.md)

| Field | Value |
|---|---|
| PR / evidence | Fix and release [PR #199](https://github.com/voidbrain/project-harness/pull/199); CodeQL alerts 30 and 31 on NERV PR #404 |
| Opened | 2026-11-14 |
| Verification | 2026-11-14, Script: `test-rule-load.mjs` 13 pass; `rule-load --check` within budgets. CodeQL runs in projects (NERV), not here: its result is checked when NERV copies 8.14.2. |
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
### <a id="b-024"></a>[🐞 B-024](#top)

**`reconcile:draft` drafts an entry a log-built header cannot read, and flags scoped-verification skips**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0.5 h | — | — | 🤖 | — | — |

💻 **→** Next: B-024-T01.

| | |
|---|---|
| **Issue** | Found 2026-11-14 reconciling gauntlet-protocol and NERV to 8.14.1. (1) The draft heading is `## <date> (<branch> \`<sha>\`)`; projects whose header is generated from the log (F-066) need `## <date> — <branch> \`<sha>\``, so the draft cannot be pasted there. (2) A PR whose CI skipped jobs by design (scoped verification) is flagged "CI green with skipped checks" and counted as not green ("0 of 1 on green CI"), noise in every NERV reconcile. |
| **Reproduce** | Run `npm run reconcile:draft` in NERV after #403 (scoped verification skipped jobs). |
| **Check** | A committed test fails first; the draft heading uses the F-066 entry format so `work-items` reads it; a skip is not counted against green when `verification` is enabled in `.harness.json` (still flagged otherwise, as `ci:status` does); the summary counts are accurate. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-024-t01"></a>B-024-T01 — Draft entry format and scoped-verification skips | 0.5 h | 0 h | 0.5 h | Ready |
| 🟢 Small | **Total** | 0.5 h | 0 h (0 of 1 steps recorded) | 0.5 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-024.md)

| Field | Value |
|---|---|
| PR / evidence | Opened in [PR #198](https://github.com/voidbrain/project-harness/pull/198); gauntlet-protocol #53 and NERV #404 reconciles, 2026-11-14 |
| Opened | 2026-11-14 |
| Verification | Pending. |
| Reviewed | 2026-11-14 |

</details>

---
### <a id="b-026"></a>[🐞 B-026](#top)

**`rule-load` holds a generated lookup page to the procedure-file budget**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0.25 h | — | — | 🤖 | — | — |

💻 **→** Next: B-026-T01.

| | |
|---|---|
| **Issue** | Found 2026-11-14 in NERV after harness 8.14.2: `check:rule-load` warns that `docs/agents/impact-map.md` is 4,358 tokens, over the 2,000 budget for one procedure file. The page is written by `tools/impact-map.mjs` (its first line says so) and no route reads it (the impact route reads `change-impact.md`; `check:freshness` prints the rows a branch triggers), so splitting it is not the fix. It counts only because `rules.procedures` includes `docs/agents/*.md`. |
| **Reproduce** | A `docs/agents/` page whose first line is `<!-- Written by tools/… -->` and over 2,000 tokens. |
| **Check** | A committed test fails first; a page whose first line marks it as written by a tool has no procedure-file budget (a route that links it still counts it); ordinary files are still reported. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-026-t01"></a>B-026-T01 — Generated pages have no procedure budget | 0.25 h | 0 h | 0.25 h | Ready |
| 🟢 Small | **Total** | 0.25 h | 0 h (0 of 1 steps recorded) | 0.25 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-026.md)

| Field | Value |
|---|---|
| PR / evidence | NERV `check:rule-load` on main after #404 |
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
