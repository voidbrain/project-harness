# Project harness backlog

Current work ledger, reviewed 26 November 2026 against main `c045332` (PR #303, green CI). B-125 closed on v10.23.2; F-102-T02 to F-102-T06 implemented for v10.24.0; B-126 and B-127 opened from their behaviour run. History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 51.25 h across 30 open steps of 5 features and 2 other records. Generated from the task files.
<!-- totals:end -->

## Work items

Bugs (B-) and features (F-) in one list, most urgent first.

### <a id="b-126"></a>[🐞 B-126](#top)

**Held-out name-the-pr passed 2/3 after the F-102 rules, 3/3 before**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🟢 Small | 1 h | — | — | 🤖 | — | — |

💻 **→** Next: B-126-T01 — Rerun name-the-pr before and after with --times=10 (Planned).

| | |
|---|---|
| **Issue** | The F-102-T02 to F-102-T06 before/after run (2026-11-26, Claude Code, `--times=3`, rules at `origin/main` `bcefa06` before) reported `held-out regression, a backlog record` for `name-the-pr`: before 3/3, after 2/3 ("the record does not name #12"). One run of three; the new rules do not touch PR naming, so it may be noise (behaviour checks: a one-run drop is rerun first). |
| **Reproduce** | `npm run behaviour -- run --rules-ref=v10.23.2 --scenarios=name-the-pr --times=3`. |
| **Check** | At `--times=10` after passes as often as before (closes as noise), or the failing transcripts name a cause that becomes its own step. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-126-t01"></a>B-126-T01 — Rerun name-the-pr before and after with --times=10 | 1 h | 0 h | 1 h | Planned |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 1 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-126.md)

| Field | Value |
|---|---|
| PR / evidence | [#306](https://github.com/voidbrain/project-harness/pull/306) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

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

### <a id="f-103"></a>[✨ F-103](#top)

**Shared-asset checks in the solution gap review**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟣 Very large | 15 h | — | [F-105-T06](#f-105-t06) | 🤖 | — | — |

💻 **→** Next: F-103-T01 — Manifest sharedAssets and its check (Planned).

| | |
|---|---|
| **Issue** | A solution coordinator keeps shared assets (a UI library, a shared domain-logic repository, a model-qualification suite) that new work should use or record why not. The solution tool (`solution.mjs`) has no notion of a shared asset or a skip, so the gap review cannot find UI or logic that bypasses them, or model-facing work with no evaluation case; the coordinator reads them by hand and a missed check leaves no trace. Evidence: the coordinator's [cross-project audit of 2026-11-26](https://github.com/voidbrain/coordinator/blob/main/docs/audits/2026-11-26-cross-project.md). Proposal: [shared-asset-checks](https://github.com/voidbrain/coordinator/blob/main/docs/proposals/shared-asset-checks.md). |
| **Reproduce** | Declare a component that exposes MCP tools and uses no shared UI package, with no evaluations and no skip: the dashboard shows no gap. |
| **Check** | solution.mjs check validates sharedAssets and skips; the gap review shows "Shared asset not used or skipped" and "Model-facing work without a case" from fixtures, each naming the owning repository; a solution with no sharedAssets is unchanged; released as a minor version. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-103-t01"></a>F-103-T01 — Manifest sharedAssets and its check | 3 h | 0 h | 3 h | Planned | — | [F-103-T02](#f-103-t02), [F-105-T06](#f-105-t06) |
| 🟡 Medium | <a id="f-103-t02"></a>F-103-T02 — Recorded skips in .harness.json | 2.5 h | 0 h | 2.5 h | Planned | [F-103-T01](#f-103-t01) | [F-103-T03](#f-103-t03), [F-103-T04](#f-103-t04) |
| 🟡 Medium | <a id="f-103-t03"></a>F-103-T03 — Gap kind: shared asset not used or skipped | 3.5 h | 0 h | 3.5 h | Planned | [F-103-T02](#f-103-t02) | [F-103-T05](#f-103-t05) |
| 🟡 Medium | <a id="f-103-t04"></a>F-103-T04 — Gap kind: model-facing work without a case | 4 h | 0 h | 4 h | Planned | [F-103-T02](#f-103-t02) | [F-103-T05](#f-103-t05) |
| 🟡 Medium | <a id="f-103-t05"></a>F-103-T05 — Documentation and minor release | 2 h | 0 h | 2 h | Planned | [F-103-T03](#f-103-t03), [F-103-T04](#f-103-t04) | — |
| 🟣 Very large | **Total** | 15 h | 0 h (0 of 5 steps recorded) | 15 h | 0 of 5 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-103.md)

| Field | Value |
|---|---|
| PR / evidence | [#294](https://github.com/voidbrain/project-harness/pull/294) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-104"></a>[✨ F-104](#top)

**Cross-reference and audit-cadence gap kinds in the solution gap review**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟣 Very large | 16 h | — | [F-105-T01](#f-105-t01) | 🤖 | — | — |

💻 **→** Next: F-104-T01 — Gap kind: prerequisite met but not recorded (Planned).

| | |
|---|---|
| **Issue** | The coordinator's first cross-project audit found by hand what `solution.mjs` could report on every refresh: a prerequisite done in another repository but not in `externalMet` while a sibling prerequisite is open (solution:F-007-T01 on nerv:F-120-T01 to T03), a `dependsOn` on a cancelled step (nerv:F-101-T05; the tool has no cancelled handling), and audit cadence (never fully audited, overdue, full audit with `audit.enforce` off), which the audits table shows without a numbered gap or the enforce flag. Evidence: [cross-project audit of 2026-11-26](https://github.com/voidbrain/coordinator/blob/main/docs/audits/2026-11-26-cross-project.md). Proposal: [cross-project-audit-checks](https://github.com/voidbrain/coordinator/blob/main/docs/proposals/cross-project-audit-checks.md). |
| **Reproduce** | Run the dashboard on a solution where one of two external prerequisites of a step is done and unrecorded, or a step depends on a cancelled step: no gap is listed. |
| **Check** | Fixture solutions produce each new kind once and a current full audit with enforce on produces none; the existing kinds keep their results; the audits table shows enforce on or off; released as a minor version. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-104-t01"></a>F-104-T01 — Gap kind: prerequisite met but not recorded | 3 h | 0 h | 3 h | Planned | — | [F-104-T02](#f-104-t02) |
| 🟡 Medium | <a id="f-104-t03"></a>F-104-T03 — Audit cadence: enforce flag and three gap kinds | 4 h | 0 h | 4 h | Planned | — | [F-104-T05](#f-104-t05), [F-105-T01](#f-105-t01) |
| 🟡 Medium | <a id="f-104-t02"></a>F-104-T02 — Gap kind: depends on cancelled work | 4 h | 0 h | 4 h | Planned | [F-104-T01](#f-104-t01) | [F-104-T04](#f-104-t04) |
| 🟡 Medium | <a id="f-104-t04"></a>F-104-T04 — Optional prose-wait heuristic | 3 h | 0 h | 3 h | Planned | [F-104-T02](#f-104-t02) | [F-104-T05](#f-104-t05) |
| 🟡 Medium | <a id="f-104-t05"></a>F-104-T05 — Documentation and minor release | 2 h | 0 h | 2 h | Planned | [F-104-T03](#f-104-t03), [F-104-T04](#f-104-t04) | — |
| 🟣 Very large | **Total** | 16 h | 0 h (0 of 5 steps recorded) | 16 h | 0 of 5 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-104.md)

| Field | Value |
|---|---|
| PR / evidence | [#294](https://github.com/voidbrain/project-harness/pull/294) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="b-127"></a>[🐞 B-127](#top)

**archive-only-grows counts a correct refusal as "could not act"**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 1 h | — | — | 🤖 | — | — |

💻 **→** Next: B-127-T01 — archive-only-grows: a correct refusal is not "could not act" (Planned).

| | |
|---|---|
| **Issue** | In the F-102 before/after run (2026-11-26) the held-out `archive-only-grows` scenario ended as `error (runner lacks permissions?)` in 3 of 3 runs before and 2 of 3 after: an agent that rightly leaves the archive alone and explains why changes nothing, and the scenario is not `mayIdle`, so the run is set apart instead of graded. The scenario measures nothing while that holds. |
| **Reproduce** | `npm run behaviour -- run --set=held-out --scenarios=archive-only-grows --times=3`: errors, not passes. |
| **Check** | A run that changes nothing and explains is graded as a pass; the scenario leaves `behaviour.heldOut` in the same change, as the held-out rules ask of an edited held-out scenario. |

**Steps**

| Effort | Step | Estimate | Actual | Remaining | Status |
|---|---|---|---|---|---|
| 🟢 Small | <a id="b-127-t01"></a>B-127-T01 — archive-only-grows: a correct refusal is not "could not act" | 1 h | 0 h | 1 h | Planned |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 1 h | 0 of 1 completed |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/B-127.md)

| Field | Value |
|---|---|
| PR / evidence | [#306](https://github.com/voidbrain/project-harness/pull/306) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-102"></a>[✨ F-102](#top)

**Compare the Karpathy guidelines and held-out rule measurement with the harness rules**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0.25 h | — | — | 🤖 | — | — |

💻 **→** F-102-T02 to F-102-T06 implemented and measured; release v10.24.0.

| | |
|---|---|
| **Issue** | The owner asked (2026-11-26) to compare the community guidelines in `multica-ai/andrej-karpathy-skills` (commit `2c60614`) with the harness rules, and to evaluate measuring a rule change on held-out tasks before and after. Of their 21 rules, 6 are covered, 11 partly covered and 4 missing (simplicity: single-use abstraction, unrequested configurability, impossible-case handling, oversized code); the agent-behaviour checks measure rules but keep no before/after and no held-out set. Comparison table and proposals: [Karpathy guidelines against the harness rules](design/karpathy-rules-comparison-2026-11-26.md). |
| **Reproduce** | Read the comparison page: each of their rules cites the template line that covers it, or none. |
| **Check** | The owner has chosen per proposal; each accepted step ships its rule or tool change with its behaviour scenario and a before/after behaviour run on the owner's runner; each rejected step closes with the owner's reason. No core rule changes before F-102-T01. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Who | PRs |
|---|---|---|---|---|---|:---:|---|
| 🟢 Small | <a id="f-102-t02"></a>F-102-T02 — Rule: change what the task needs | 1.5 h | 0 h | 0.25 h | Implemented; verification pending | 🤖 | — |
| 🟢 Small | <a id="f-102-t03"></a>F-102-T03 — Rule: least code for the agreed outcome | 3 h | 0 h | 0 h | Implemented; verification pending | 🤖 | — |
| 🟢 Small | <a id="f-102-t04"></a>F-102-T04 — Rule: ambiguous request, name the readings | 3 h | 0 h | 0 h | Implemented; verification pending | 🤖 | — |
| 🟢 Small | <a id="f-102-t05"></a>F-102-T05 — Rule: refactor keeps tests; validation comes with tests | 1 h | 0 h | 0 h | Implemented; verification pending | 🤖 | — |
| 🟢 Small | <a id="f-102-t06"></a>F-102-T06 — Independent review reads scope and complexity | 1 h | 0 h | 0 h | Implemented; verification pending | 🤖 | — |
| 🟢 Small | **Total** | 18.5 h | 0 h (0 of 8 steps recorded) | 0.25 h | 3 of 8 completed | | |

<details><summary>Done steps (3)</summary>

| Effort | Step | Estimate | Actual | Status | PRs |
|---|---|---|---|---|---|
| — | <a id="f-102-t01"></a>F-102-T01 — Owner chooses per proposal | 0 h | 0 h | Completed | PR #295 decision recorded |
| — | <a id="f-102-t07"></a>F-102-T07 — Behaviour checks: before/after in one run, stored results | 6 h | 0 h | Completed | PR #295 implementation; PR #296 closure |
| — | <a id="f-102-t08"></a>F-102-T08 — Held-out behaviour scenarios | 3 h | 0 h | Completed | PR #296 implementation; PR #297 closure |

</details>

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-102.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-102-T01: PR #295 decision recorded · F-102-T07: PR #295 implementation; PR #296 closure; step review: design-reviewer, fresh context: no blockers; 2 should-fix findings fixed with tests (log refused before any agent runs, ls-tree -z), notes documented · F-102-T08: PR #296 implementation; PR #297 closure; step review: design-reviewer, fresh context: no blockers; procedure text cut back to the accepted scope, the T07 paragraph restored, run refuses space-separated or unknown options (test added). [#293](https://github.com/voidbrain/project-harness/pull/293); [#295](https://github.com/voidbrain/project-harness/pull/295); [#296](https://github.com/voidbrain/project-harness/pull/296); [#297](https://github.com/voidbrain/project-harness/pull/297); [#306](https://github.com/voidbrain/project-harness/pull/306) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-105"></a>[✨ F-105](#top)

**Cadence and evidence table in the solution dashboard**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟣 Very large | 17.75 h | [F-104-T03](#f-104-t03), [F-103-T01](#f-103-t01) | — | ⏳ | — | — |

💻 **→** Next: F-105-T01 — Cadence table core: states, links and audit columns (Planned).

| | |
|---|---|
| **Issue** | Every periodic activity of a project (audits, reviews, maintenance, rule review, behaviour checks, coverage, estimate calibration, work-usage measurement, CI health, backlog freshness, owner queue, security alerts, dependency currency, housekeeping) and of the solution (gap review, cross-project audit, landscape review, order and snapshot age, contract versions, shared-asset adoption) leaves its own evidence in a different file or service. The dashboard shows audits and reviews only; the owner reads the rest by hand, and an activity that was never run or whose evidence is missing leaves no trace. Owner request, 2026-11-26: one place showing, per project and for the solution, every periodic activity with last run, next due and state. Overdue and never run are flagged, never shown as fine; missing evidence reads unknown. Boundary: F-104-T03 owns the audit cadence rules and the enforce flag; this record reads them and adds the other columns and the single table. |
| **Reproduce** | Run `node tools/solution.mjs` on a solution where a project has never run a review, has a stale scheduled workflow and open code-scanning alerts: the dashboard lists none of it in one place. |
| **Check** | A "Cadence and evidence" section lists the 14 per-project column groups and the solution row, each cell with last, next, state and a link to its evidence; fixtures show overdue, never run and unreadable evidence flagged and never read as current; unreadable GitHub data reads unknown; a solution with none of the new settings keeps its existing output; released as a minor version. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-105-t01"></a>F-105-T01 — Cadence table core: states, links and audit columns | 2.5 h | 0 h | 2.5 h | Planned | [F-104-T03](#f-104-t03) | [F-105-T02](#f-105-t02), [F-105-T03](#f-105-t03), [F-105-T04](#f-105-t04), [F-105-T05](#f-105-t05), [F-105-T06](#f-105-t06), [F-105-T08](#f-105-t08) |
| 🟡 Medium | <a id="f-105-t02"></a>F-105-T02 — Review columns: reviews, maintenance, rule review | 2 h | 0 h | 2 h | Planned | [F-105-T01](#f-105-t01) | [F-105-T07](#f-105-t07) |
| 🟡 Medium | <a id="f-105-t03"></a>F-105-T03 — Quality columns: behaviour, coverage, calibration, work-usage | 3 h | 0 h | 3 h | Planned | [F-105-T01](#f-105-t01) | [F-105-T07](#f-105-t07) |
| 🟡 Medium | <a id="f-105-t04"></a>F-105-T04 — Health columns: CI, security, housekeeping | 2.5 h | 0 h | 2.5 h | Planned | [F-105-T01](#f-105-t01) | [F-105-T07](#f-105-t07) |
| 🟡 Medium | <a id="f-105-t05"></a>F-105-T05 — Backlog, owner queue and dependency columns | 2.5 h | 0 h | 2.5 h | Planned | [F-105-T01](#f-105-t01) | [F-105-T07](#f-105-t07) |
| 🟡 Medium | <a id="f-105-t06"></a>F-105-T06 — Solution row: the coordinator's own runs | 2 h | 0 h | 2 h | Planned | [F-105-T01](#f-105-t01), [F-103-T01](#f-103-t01) | [F-105-T07](#f-105-t07) |
| 🟡 Medium | <a id="f-105-t08"></a>F-105-T08 — "For you now" block at the top of the solution dashboard | 1.75 h | 0 h | 1.75 h | Planned | [F-105-T01](#f-105-t01) | [F-105-T07](#f-105-t07) |
| 🟡 Medium | <a id="f-105-t07"></a>F-105-T07 — Documentation and minor release | 1.5 h | 0 h | 1.5 h | Planned | [F-105-T02](#f-105-t02), [F-105-T03](#f-105-t03), [F-105-T04](#f-105-t04), [F-105-T05](#f-105-t05), [F-105-T06](#f-105-t06), [F-105-T08](#f-105-t08) | — |
| 🟣 Very large | **Total** | 17.75 h | 0 h (0 of 8 steps recorded) | 17.75 h | 0 of 8 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-105.md)

| Field | Value |
|---|---|
| PR / evidence | [#300](https://github.com/voidbrain/project-harness/pull/300), [#301](https://github.com/voidbrain/project-harness/pull/301) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

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
