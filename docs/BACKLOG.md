# Project harness backlog

Current work ledger, reviewed 7 November 2026 against main `ddd1bc9`: PR #75 CI 42372844701 and #76 CI 42373069398 passed; v3.5.0 published and F-044 archived. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

[Linked prerequisites and unlocks](agents/backlog-dependencies.md) · [Work queue](agents/backlog-queue.md).

## Bugs and reliability

None open.

## Features and improvements

### F-045

**Remaining-effort backlog format and a transparent prioritized work queue**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟡 Medium |

💻 **→ Human action required: No**<br />Next: validate and independently review 4.0.0, then publish its tag.

| | |
|---|---|
| **Issue** | Completion percentages overlap with remaining-effort estimates and imply precision. Projects need a reusable work-order view that can deliberately prioritize records while preserving human cues, dependencies and source ownership. |
| **Reproduce** | Compare percentage and remaining-effort fields, then choose the next record from a ledger with explicit ordering, open prerequisites, human decisions and roadmap placements. |
| **Check** | Active four-column records retain remaining effort/rationale and acceptance safeguards; published archives remain unchanged/readable. Optional queue has explicit record order/reason, impact priority, roadmap context, direct dependents and effort with visible reasons; human/blocker/prerequisite lanes remain separate. No source mutations, weighted score, completion percentage or inferred authorization. Owned fixtures, rule/reader/CI/docs compatibility, independent review, green CI and published v4.0.0 tag. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Implemented on the 4.0.0 branch. The major release requires active-record migration, with historical archives preserved. Validate using owned fixture repositories only; release acceptance has no consumer adoption gate. Review all affected rule text/readers and run the configured behavior runner if present (none configured here).

**Estimates:** Medium remaining effort. Estimated 2026-11-07 from rule/validator/reader compatibility, safe queue generation, review and release work; no token estimate is inferred.

| Field | Value |
|---|---|
| Queue order | 1 — Owner-requested harness release |
| PR / evidence | [PR #77](https://github.com/voidbrain/project-harness/pull/77); 127 tool tests passed; fresh-context review correction verified with no remaining findings |
| Opened | 2026-11-07 |
| Verification | 2026-11-07: 127 tool tests pass, including template-application joins and historical readers. Review: separate fresh-context reviewer found one six-column unavailable-row defect, fixed with regression; re-review reports no remaining actionable findings. No agent-behavior runner configured; scenario executions not claimed. Release CI and tag pending. |
| Reviewed | 2026-11-07 |

</details>

---

## Other changes

Published [v3.4.0](https://github.com/voidbrain/project-harness/tree/v3.4.0), tagged on `main` `a2c90f5` after [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325). F-041–F-043 are closed and archived with their full history in [#74](https://github.com/voidbrain/project-harness/pull/74).

Published [v3.3.0](https://github.com/voidbrain/project-harness/tree/v3.3.0), tagged on `main` `a0ae25e` after [#66](https://github.com/voidbrain/project-harness/pull/66)–[#70](https://github.com/voidbrain/project-harness/pull/70) merged on green CI. F-032–F-037 are closed and archived with their history. The push guard is not installed in this clone and no behaviour-check runner is configured here: both are the owner's choice.

Published [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1): annotated tag `bea6c60140f9ecf4fb9fa75849da5578fd5667e6` resolves remotely to approved main commit `7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031`. [Publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) passed every verification/publication step, including all 72 fixtures. B-013/B-014 and F-026–F-030 are verified, closed and archived with their original IDs/dates/history. [#58](https://github.com/voidbrain/project-harness/pull/58) removes the one-time operational workflow and records closure. No release action or human dependency remains.

Full audit F-031 verified and closed 2026-10-31 after [#55](https://github.com/voidbrain/project-harness/pull/55) merged with [CI 41228352936](https://github.com/voidbrain/project-harness/actions/runs/41228352936) green. All eight areas have a dated full report/manifest; both confirmed defects are fixed with failing-before/passing-after regressions. Those records were release-pending at that review; the verified v3.1.1 publication above now closes them. Historical audit prose remains unchanged.

Published [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) at verified commit `0764a36`. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step and all 56 fixtures. B-011, B-012 and F-021–F-025 are closed and archived with their complete history. [PR #51](https://github.com/voidbrain/project-harness/pull/51) removes the one-time publication workflow. No publication blocker remains for v2.2.2. The newer cumulative release was subsequently published through the one-time workflow above. No new permission request or consumer dependency is implied.

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

Each item shows its ID and title, a signal table (priority, status, remaining effort), Human action required (🧑 Yes / 💻 No), and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Status and verification evidence describe progress; effort is an estimate of work still required. A `---` line ends every item.
