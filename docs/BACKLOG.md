# Project harness backlog

Current work ledger, reviewed 8 November 2026 against main `bba6735`: PR #81 CI reconciliation reviewed; v4.1.0 published. Accepted parallel-work/model/reassessment/index work owns F-047. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

[Linked prerequisites and unlocks](agents/backlog-dependencies.md) · [Work queue](agents/backlog-queue.md).

## Bugs and reliability

None open.

## Features and improvements

### F-047

**Explicit parallel tasks, evidence-based model assignment and design/procedure review**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔺 P1 | Implemented | 🟡 Medium |

💻 **→ Human action required: No**<br />Release the optional workflow after owned fixtures, current CI and independent review.

| | |
|---|---|
| **Issue** | Concurrent agents need explicit independent work, shared ownership and honest model suitability; architecture and procedures need discoverable review paths. |
| **Reproduce** | Two clones claim overlapping work, update separate records, select an unmeasured model and inspect changed design assumptions. |
| **Check** | Exact record migration, validated task/profile contracts, one concurrent resource owner, stale/uncertain claim reconciliation without safeguard exceptions; linked procedure authorities and scoped design alternatives; independent review, green CI and published v4.2.0 tag. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Deliver work-item source/task tooling, cooperative remote Git CAS and evidence-based model profiles, architecture reassessment and linked procedure discovery. Validate on owned fixtures, including real competing pushes with the archive guard installed. Review in a fresh context, publish the tag after green CI, then close this repository's release outcome. No downstream adoption, actual model inference, device or credential is required for acceptance.

**Estimates:** Medium remaining effort, reassessed 2026-11-08: implementation/owned fixtures and independent review complete; final CI and publication remain.

| Field | Value |
|---|---|
| PR / evidence | [PR #82](https://github.com/voidbrain/project-harness/pull/82) candidate optional workflow; owned fixtures and independent report-only review |
| Opened | 2026-11-08 |
| Verification | 144 owned tool fixtures passed before final link changes; 15 targeted work-item/claim contracts pass after the final changes. Test: committed migration/link regressions 3279a90, e223710 and 90bb8c1 precede their fixes, with assertions preserved. Review: fresh-context report-only review found link/reference/code-span cases; all were fixed and final inspection reports no remaining high-impact blocker. Behavior runner is unconfigured; no agent-behavior/model campaign was run. Final CI and v4.2.0 tag pending. |
| Reviewed | 2026-11-08 |

</details>

---



## Other changes

Published [v4.1.0](https://github.com/voidbrain/project-harness/tree/v4.1.0) at `a8a358e` after PR #80 passed owned CI and independent review. F-046 closes on the published tag; project adoption is independently owned.

Published [v4.0.0](https://github.com/voidbrain/project-harness/tree/v4.0.0) at `bdec31f`; release record F-045 archived after green CI and fresh-context review.

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
