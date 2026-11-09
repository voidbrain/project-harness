# Project harness backlog

Current work ledger, reviewed 9 November 2026 against main `340df85`: PR #87 CI42607598077 passed. F-048 usage accounting remains planned; F-049 implements optional task-context policy pending release. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

[Linked prerequisites and unlocks](agents/backlog-dependencies.md) · [Work queue](agents/backlog-queue.md).

## Bugs and reliability

## Features and improvements

### F-048

**Measured token usage by work item, task and activity**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟡 Medium |

💻 **→ Human action required: No**<br />Define the usage-event/import contract and discover runner/provider usage sources; retain unknown counts when unavailable.

| | |
|---|---|
| **Issue** | Owners need actual development token spend by feature and activity, including failed attempts and review/record maintenance, to plan useful work batches without guessing from elapsed time or conversation length. |
| **Reproduce** | Ask for an item's total and its planning/coding/testing/review/documentation/backlog/harness split across several jobs, retries and models. Existing friction counters measure workflow observations, not provider token usage. |
| **Check** | Explicit optional usage events/import adapters bind repository/item/task, job/attempt/phase, model/provider and measured input/output/cache counts to provenance. Missing data stays unknown, not zero. Stable source/event IDs prevent duplicate imports; allocations conserve shared-job totals; retries remain counted. Reports distinguish known spend, coverage and estimated remaining budget. Queue advice never overrides priority/dependencies/human gates or treats sunk cost as remaining effort. Privacy-safe local aggregates contain no prompts, secrets or personal session content. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Owner accepted2026-11-09. T01 defines/imports measured usage, then per-item/activity reports and optional remaining-budget guidance. Discover actual runner/provider outputs first; do not scrape conversations or infer usage from time, file reads, tool count or model guesses. Preserve provider definitions: cached input may be a subset of input and reasoning may be a subset of output, never added twice. Unknown source coverage makes the total explicitly incomplete. Shared activities use declared allocations or remain unallocated; never attribute100% to multiple items. Keep observed spend separate from remaining estimates, with sample size/configuration/confidence; no automatic priority scoring or quota enforcement follows.

The harness owns reusable development accounting. Evaluation usage remains owned by evaluation libraries; consumer runtime accounting remains consumer-owned. Adapters can reference/import measured events without duplicating their totals. No consumer implementation/adoption or real model campaign gates a harness release. Initial source assessment found existing friction.mjs duration/counter records but no per-task provider token import or phase ledger; actual session phase totals are unavailable from the currently observed tools and remain unknown. See [assessment](reviews/2026-11-09-task-token-accounting.md).

**Estimates:** Medium remaining effort, estimated2026-11-09: a versioned event/adapter/report slice and idempotency/allocation/privacy fixtures; actual runner API availability is not yet established and may constrain source coverage. No actual token spend estimated.

| Field | Value |
|---|---|
| PR / evidence | [PR #87](https://github.com/voidbrain/project-harness/pull/87), registration/design only; no accounting implementation or token measurement claimed. |
| Opened | 2026-11-09 |
| Verification | Documentation: requirements/source assessment recorded2026-11-09; usage imports, reports and scheduling guidance unimplemented. |
| Reviewed | 2026-11-09 |

</details>

---
### F-049

**Task-boundary context policy with durable handoffs and capability-aware fallback**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Review and release the optional4.3 policy; actual host thread APIs and token savings remain explicitly unverified.

| | |
|---|---|
| **Issue** | Long unrelated task histories can dilute context; clearing/compacting at every message instead can lose active work and repeatedly reload essentials. A portable harness needs safe task-boundary instructions without pretending to control every host's thread/cache API. |
| **Reproduce** | Finish one task and start an independent one, continue debugging the same task, and repeat on a host without fresh-thread/compaction tools. |
| **Check** | Optional shared policy prefers an authorized available fresh thread for independent work after persisted handoff; same-task implementation/review/CI stays together. Supported compaction preserves continuing-task state. Unavailable controls are reported without a false reset or unnecessary work stoppage. Preserve claims, pending jobs/approvals, uncertainty, privacy and authority; caching stays runtime-managed and savings unknown without measurements. Shared/root copies, adoption/stamps and review evidence agree; no host adapter or model campaign is claimed. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Owner requested the portable rule2026-11-09. [Task context](agents/task-context.md) and AGENTS/procedure triggers define handoff and continuity, distinct fresh-thread/compaction/cache operations, duplicate-worker/unknown-ack reconciliation and capability-limited fallback. This release is procedural agent guidance, not an executable host adapter, automatic clearing service or guaranteed usage reduction. Shared release acceptance uses owned checks/review and the published tag; consumer adoption is independent.

Preserved requirements: existing AGENTS safety/ownership/evidence, all starting applicable procedures, privacy and cost/approval boundaries, active work/claim recovery, independent review and green merges. No rule is retired or weakened to save tokens. Current session exposes no thread-start/compaction control. Behavior runner is unconfigured: live rule-following/host-transition/savings evidence remains unrun, never inferred from text checks. F-048 retains actual usage accounting, not this record's completion gate.

**Estimates:** Small remaining effort, estimated2026-11-09: shared guide/trigger implementation exists; independent review, owned checks and release remain. Timing uses an isolated worktree's final governing-input reconciliation/validation, excluding earlier source discovery; an existing measurement session in the original checkout is preserved untouched. No token savings estimate is inferred.

| Field | Value |
|---|---|
| PR / evidence | [PR #88](https://github.com/voidbrain/project-harness/pull/88); Review: [fresh-context report](reviews/2026-11-09-task-context-independent.md), no blocking findings, all governing requirements preserved; no host API or behavior-runner execution. |
| Opened | 2026-11-09 |
| Verification | Documentation: policy/ownership/capability assessment recorded; template/rule/work/backlog checks and all150 deterministic fixtures passed; maintenance receipt/release CI finalized before publication. Host transition and actual token savings unverified. |
| Reviewed | 2026-11-09 |

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
