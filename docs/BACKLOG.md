# Project harness backlog

Current work ledger, reviewed 14 November 2026 against main `f209f34` (PRs #172–#173, green CI). Full audit 2026-11-14 opened B-020, F-078 and F-079; F-075 and F-077 open. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 10 h agent + 0.75 h owner across 20 open steps of 4 features and 1 other record. 3.25 h of actual effort recorded on 4 steps. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="f-078"></a>[✨ F-078](#top)

**Rule load within budget: APPLY.md and the four heaviest triggers**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h | — | — | 🤖 | — | — |

💻 **→** Next: F-078-T01.

| | |
|---|---|
| **Issue** | Full audit 2026-11-14, finding F3. F-076 added `check:rule-load` and brought AGENTS and BACKLOG-RULES within budget, but its release PR left the rest as follow-up work with no owning record: APPLY.md is 14,603 tokens against a 2,000-token file budget, and four triggers read more than 5,000 tokens (apply/reconcile/release 18,043; task context 5,200; template content 5,027; derived outputs 5,361). |
| **Reproduce** | `node tools/rule-load.mjs --check` in the template. |
| **Check** | APPLY.md split by trigger (adopt, reconcile, release, project overrides) with every sentence kept and a traceability table, as F-076 did; the four triggers route to files within budget; `check:rule-load` prints no warning; `check:rules` passes; fresh-context review; release. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-078-t01"></a>F-078-T01 — Split plan for the owner's approval | 1 h | 0 h | 1 h | Ready |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 1 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-078.md)

| Field | Value |
|---|---|
| PR / evidence | Opened by the [full audit of 2026-11-14](audits/2026-11-14-full-harness.md) (finding F3), [PR #175](https://github.com/voidbrain/project-harness/pull/175) |
| Opened | 2026-11-14 |
| Verification | Pending. |
| Reviewed | 2026-11-14 |

</details>

---
### <a id="f-077"></a>[✨ F-077](#top)

**Token-lean outputs: quiet tools and tests, scripted reconciliation, next steps, short records, a code map**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟡 Medium | 3.5 h | — | — | 🤖 | — | — |

💻 **→** Next: F-077-T01 — Quiet tool defaults and npm notices (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Owner request 2026-11-14: prefer fewer tokens to less time, with automated scripts. Measured in a project (NERV): a passing `npm test` prints 103k characters (about 26k tokens) against 786 with Node's dot reporter, though dots alone drop the totals, test names and what tests log; `check:freshness` puts a 10-line maintenance JSON block into every session start; the verification plan prints 3k characters; npm adds `npm notice run …` lines to each script; `work:tasks` dumps every task as JSON; a 16-PR reconciliation is read by hand from `ci:status` and the records; one record holds 28 KB of dated evidence; a 3,000-line source file is read whole for want of a map. |
| **Reproduce** | Run `npm test`, `npm run check:freshness` and `node tools/work-items.mjs tasks` in an adopted project and count the characters. |
| **Check** | Tools print findings and a one-line summary by default, the full output with `--verbose`; a quiet test reporter prints failures in full and the totals, with the complete report written to an ignored file, so nothing is lost; the template's `.npmrc` sets `loglevel=warn`; `reconcile-draft` lists merged PRs since the header with their CI and the records naming each, drafts the reconciliation entry, and flags only failures and PRs no record names; `work:next` prints the ready steps in a few lines; a warn-only check flags a record over its size budget and BACKLOG-RULES says where older evidence goes; a code map lists each source file's exports with line ranges; each output measured before and after; release. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="f-077-t01"></a>F-077-T01 — Quiet tool defaults and npm notices | 1 h | 1 h so far (stated) | 0 h | Implemented; verification pending |
| 🟢 Small | <a id="f-077-t02"></a>F-077-T02 — Quiet test reporter | 1 h | 0.75 h so far (stated) | 1 h | Implemented; verification pending |
| 🟢 Small | <a id="f-077-t03"></a>F-077-T03 — Scripted reconciliation draft | 1.5 h | 1 h so far (stated) | 0 h | Implemented; verification pending |
| 🟢 Small | <a id="f-077-t04"></a>F-077-T04 — Next steps in a few lines | 0.5 h | 0.5 h so far (stated) | 0 h | Implemented; verification pending |
| 🟢 Small | <a id="f-077-t05"></a>F-077-T05 — Record size budget and where evidence goes | 1 h | 0 h | 1 h | Ready |
| 🟢 Small | <a id="f-077-t06"></a>F-077-T06 — Code map | 1 h | 0 h | 1 h | Ready |
| 🟢 Small | <a id="f-077-t07"></a>F-077-T07 — Measure, review and release | 0.5 h | 0 h | 0.5 h | Planned · waits on [F-077-T01](#f-077-t01), [F-077-T02](#f-077-t02), [F-077-T03](#f-077-t03), [F-077-T04](#f-077-t04), [F-077-T05](#f-077-t05), [F-077-T06](#f-077-t06) |
| 🟡 Medium | **Total** | 6.5 h | 3.25 h (4 of 7 steps recorded) | 3.5 h | 0 of 7 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-077.md)

| Field | Value |
|---|---|
| PR / evidence | [PR #170](https://github.com/voidbrain/project-harness/pull/170) (record and steps opened), [PR #173](https://github.com/voidbrain/project-harness/pull/173) (F-077-T01), [PR #174](https://github.com/voidbrain/project-harness/pull/174) (F-077-T02), [PR #176](https://github.com/voidbrain/project-harness/pull/176) (F-077-T04), [PR #177](https://github.com/voidbrain/project-harness/pull/177) (F-077-T03) |
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
### <a id="b-020"></a>[🐞 B-020](#top)

**In the template repository, unreleased copied files are reported as project drift**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0.5 h | — | — | 🤖 | — | — |

💻 **→** Next: B-020-T01.

| | |
|---|---|
| **Issue** | Full audit 2026-11-14, finding F2: when `check-harness` runs inside the template repository (HARNESS_HOME is the repository itself), each copied file edited since the last tag prints "differs from template vX … a generic improvement goes back into the template; … a fork", advice that cannot apply there. Four such lines printed on every session start and CI run between F-077-T01 and its release. |
| **Reproduce** | In the template, edit `core/tools/ci-status.mjs` and copy it to `tools/`, then run `node tools/check-harness.mjs` with HARNESS_HOME set to the repository. |
| **Check** | A committed test fails first: inside the template, unreleased copies print one line naming them as waiting for the next release, with no project advice; in a project the existing drift message is unchanged. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-020-t01"></a>B-020-T01 — Template-aware drift message | 0.5 h | 0 h | 0.5 h | Ready |
| 🟢 Small | **Total** | 0.5 h | 0 h (0 of 1 steps recorded) | 0.5 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-020.md)

| Field | Value |
|---|---|
| PR / evidence | Opened by the [full audit of 2026-11-14](audits/2026-11-14-full-harness.md) (finding F2), [PR #175](https://github.com/voidbrain/project-harness/pull/175) |
| Opened | 2026-11-14 |
| Verification | Pending. |
| Reviewed | 2026-11-14 |

</details>

---
### <a id="f-079"></a>[✨ F-079](#top)

**GitHub Releases match the release tags, or are retired**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0.25 h owner | — | — | — | — | 🤔 |

🧑 **→** Choose: publish a GitHub Release per tag, or remove Releases and rely on tags.

| | |
|---|---|
| **Issue** | Full audit 2026-11-14, finding F4: the repository's GitHub Releases stop at v6.0.0, shown as Latest, while tags and the CHANGELOG reach v8.12.0. No procedure or tool reads Releases (`check-harness` uses tags), so visitors to the repository page see an old version. |
| **Reproduce** | `gh release list -L 3` against `git tag --sort=-creatordate \| head -3`. |
| **Check** | The owner's choice is recorded; then either every tag from v6.1.0 has a Release whose notes are its CHANGELOG entry and the release procedure in APPLY names the step, or Releases are removed and README says tags are the releases. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who |
|---|---|---|---|---|---|:---:|
| 🟢 Small | <a id="f-079-t01"></a>F-079-T01 — Owner chooses: Releases per tag, or tags only | 0 h | 0 h | 0 h agent + 0.25 h owner | Ready | [🤔](audits/2026-11-14-full-harness.md) |
| 🟢 Small | **Total** | 0 h | 0 h (0 of 1 steps recorded) | 0.25 h owner | 0 of 1 completed | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-079.md)

| Field | Value |
|---|---|
| PR / evidence | Opened by the [full audit of 2026-11-14](audits/2026-11-14-full-harness.md) (finding F4), [PR #175](https://github.com/voidbrain/project-harness/pull/175) |
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
