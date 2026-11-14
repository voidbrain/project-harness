# Project harness backlog

Current work ledger, reviewed 14 November 2026 against main `cc1b5d4`. v8.4.0–v8.11.0 published (PRs #150–#166, all green CI): F-066 and F-069 closed and archived; F-070–F-074, B-018 and B-019 closed in their own PRs. F-075 opened.

<!-- totals:start -->
**Remaining effort:** 8.75 h agent + 0.75 h owner across 16 open steps of 2 features. 0.75 h of actual effort recorded on 1 step. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-076"></a>[✨ F-076](#top)

**Load rules top-down: a small always-loaded core, procedures by trigger, a token budget**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 3.75 h agent + 0.25 h owner | — | — | ⏳ | — | — |

💻 **→** Next: F-076-T01 — Rule-load measurement (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Owner question 2026-11-14, measured in a project (NERV): AGENTS.md is about 5k tokens loaded in every session, BACKLOG-RULES about 11k when read in full, all `docs/agents/` procedures about 28k (characters ÷ 4, not tokenizer counts). A typical PR needs only part of it: in BACKLOG-RULES, "Record and evidence requirements" (~3k) and "Optional upfront feature plans" (~2k) are the largest sections; in AGENTS, the session-start freshness steps (~1.1k) and stack sections apply only to their trigger. Much of the record prose restates what `check:backlog` and `check:work` already reject. Local models with 8–32k contexts cannot hold the rules plus a task. |
| **Reproduce** | Count the always-loaded and per-trigger instruction text of an adopted project. |
| **Check** | A tool reports the always-loaded load and the load per trigger in tokens (characters ÷ 4 by default, an exact count when a tokenizer is available); AGENTS.md keeps every never and ask-first rule, privacy, the worktree rule and the routing table and drops to the agreed budget; session-start and stack sections move to procedures read by trigger; BACKLOG-RULES splits by trigger, and prose that a checker enforces is replaced by "run the checker", keeping what no checker covers; a traceability table maps every moved or shortened requirement to its new place (no requirement dropped); `check:rules` still passes; a warn-only CI check flags a file or the always-loaded set over its budget; fresh-context review; release. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who | PRs |
|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-076-t01"></a>F-076-T01 — Rule-load measurement | 1 h | 0.75 h so far (stated) | 0.25 h | Implemented; verification pending | 🤖 | PR #169 tool, tests, review fixes |
| 🟢 Small | <a id="f-076-t02"></a>F-076-T02 — Split plan for owner approval | — | 0 h | 0 h agent + 0.25 h owner | Planned · waits on [F-076-T01](#f-076-t01) | ⏳ 🤔 | — |
| 🟢 Small | <a id="f-076-t03"></a>F-076-T03 — Split AGENTS.md | 1 h | 0 h | 1 h | Planned · waits on [F-076-T02](#f-076-t02) | ⏳ 🤖 | — |
| 🟡 Medium | <a id="f-076-t04"></a>F-076-T04 — Split BACKLOG-RULES by trigger | 1.5 h | 0 h | 1.5 h | Planned · waits on [F-076-T02](#f-076-t02) | ⏳ 🤖 | — |
| 🟢 Small | <a id="f-076-t05"></a>F-076-T05 — Token-budget check, warn only | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-076-T01](#f-076-t01), [F-076-T02](#f-076-t02) | ⏳ 🤖 | — |
| 🟢 Small | <a id="f-076-t06"></a>F-076-T06 — Review and release | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-076-T03](#f-076-t03), [F-076-T04](#f-076-t04), [F-076-T05](#f-076-t05) | ⏳ 🤖 | — |
| 🟡 Medium | **Total** | 4.5 h (5 of 6 steps) | 0.75 h (1 of 6 steps recorded) | 3.75 h agent + 0.25 h owner | 0 of 6 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-076.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-076-T01: PR #169 tool, tests, review fixes; step review: fresh-context design-reviewer on PR #169 (2026-11-14): no blocker; 3 should-fix fixed (symlink main guard, underscore anchors, a missing named section counted the whole file) and 6 notes taken (fence markers, closing hashes, escaped pipes, paths above the root, tokenizer named in the method; repeated-heading suffixes documented as unsupported); tests added for each. [PR #168](https://github.com/voidbrain/project-harness/pull/168) (record and steps opened) |
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
