# Project harness backlog

Current work ledger, reviewed 10 November 2026 against main `3feebf3`. PR #100 / CI 42887701624 passed and closed the previously published F-048 T01–T03 scope. F-048 is reopened for new optional Codex/Claude subscription allowance capture, private report export and qualified estimation feedback under T04–T06; historic counters remain unknown. [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

[Linked prerequisites and unlocks](agents/backlog-dependencies.md) · [Work queue](agents/backlog-queue.md).

## Bugs and reliability

## Features and improvements

### F-048

**Measured development usage and operational effectiveness by task**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small |

💻 **→ Human action required: No**<br />Run independent review and required CI, then publish optional v4.8.0 under T06.

| | |
|---|---|
| **Issue** | Owners using Codex or Claude subscription plans can see rolling allowance percentages in their clients, but the harness does not retain those account-level observations or relate them safely to completed work. Reports also print only to stdout, making deliberate private snapshots awkward. |
| **Reproduce** | Run `node tools/work-usage.mjs report`: it prints JSON but does not save a report. Ask how much of a Codex or Claude Pro window changed during a task: token events may be unavailable, while subscription quota is not money and shared-account activity prevents exact task attribution. |
| **Check** | Optional collectors persist only documented allowance percentage/window/reset metadata, never prompts, credentials or account identity. Codex collection is a read-only app-server request; Claude capture accepts the documented status-line payload and discards unrelated fields. Reports can be saved explicitly to a new private file outside a checkout. Same-window changes, resets, overlap, source coverage and comparable estimate sample sizes remain explicit; subscription allowance is never converted to tokens, currency or exact per-task cost. |

**Feature steps** (remaining estimates; status is not parent acceptance)

| Step | Remaining effort | Status |
|---|---|---|
| F-048-T01 — Measured usage event contract, imports and phase reports | 🟢 Small — 0 remaining<br />2026-11-10: Closed on v4.4.0; original effort was not measured per step. | Completed |
| F-048-T02 — Validate native client sources and extend measured usage reports | 🟢 Small — 0 remaining<br />2026-11-10: Published v4.6.0 after PR98 green CI and independent review. Selected Codex/Claude metadata imports, prelaunch and parent handoff accepted; actual source limits retained. | Completed |
| F-048-T03 — Report operational effectiveness per completed task | 🟢 Small — 0 remaining<br />2026-11-10: Published v4.7.0 after PR99 exact headc43fd46 / CI42887014187 passed169 fixtures/check and independent fixes recheck. Initial estimate retained in Git. | Completed |
| F-048-T04 — Collect Codex and Claude subscription allowance snapshots | 🟢 Small — 0 implementation remaining; release acceptance is T06<br />2026-11-11: Codex live read and neutral Claude fixtures complete. Claude live coverage remains optional and unobserved until the owner configures a status line and a response exposes rate&#95;limits. | Implemented; verification pending |
| F-048-T05 — Export reports and calibrate comparable work estimates | 🟢 Small — 0 implementation remaining; release acceptance is T06<br />2026-11-11: Private export and conservative calibration are implemented; no automatic estimate or monetary conversion is introduced. | Implemented; verification pending |
| F-048-T06 — Verify and publish subscription usage support | 🟢 Small — 2–4 focused hours<br />2026-11-11: Verification estimate assumes local provider metadata interfaces are reachable; source limitations are reported honestly. | Ready |

<details>
<summary>Next action, estimates and evidence</summary>

**Reopened 2026-11-10:** The earlier T01–T03 scope remains closed and published in v4.4.0–v4.7.0; its immutable closure is preserved in the [2026 archive](archive/backlog-2026.md#f-048). Owner requested Codex and Claude Pro allowance collection, saved report output and use of measured history to improve future estimates. This is new optional harness-wide work, not evidence that historic token or quota counters exist.

**Safety and interpretation:** Account allowance observations are shared rolling-window metadata. A same-window percentage increase near a job is a qualified account-level change, not proof that the job caused it. Reset changes, decreases, missing observations and concurrent jobs break attribution. Subscription quota is not token count or currency; explicit API price observations and fixed-plan charges remain distinct. Reports inform human planning and never rewrite backlog estimates, priorities or budgets automatically.

**Feature steps:** T04 collects and validates provider snapshots; T05 adds private export and comparable-work calibration; T06 verifies, independently reviews and publishes optional v4.8.0. Steps may split only with owner agreement if discovery reveals a distinct outcome. Completed T01–T03 remain recorded in the archive and task catalogue.

**Implementation 2026-11-11:** T04 and T05 are implemented in `ebcfd08`. Twenty-two focused fixtures pass for provider normalization, Claude field confinement, replay/coalescing, reset boundaries, private output and sample-aware calibration. One live installed Codex app-server read produced four private buckets without a model call; no counter or account value is committed. A byte-identical mode-0600 report snapshot was saved outside the checkout. Claude live coverage remains unobserved because existing settings had no status line; [source review](reviews/2026-11-11-subscription-allowance-sources.md) retains that limit.

**Next action / closure evidence:** T06 requires fresh-context independent review, applicable/full deterministic checks, PR CI and publication of optional v4.8.0. Closure requires the published tag; consumer adoption and optional Claude settings are independently owned and do not gate this harness record.

**Estimates:** Small remaining effort, reviewed 2026-11-11: T04/T05 implementation is complete; T06 remains 2–4 focused hours for review, CI and release. Initial 2–3 day estimates for each implementation step remain in Git; Claude live coverage is optional and not inferred from fixtures.

| Field | Value |
|---|---|
| Queue order | 1 — Owner-selected harness work, 2026-11-10 |
| PR / evidence | [PR #101](https://github.com/voidbrain/project-harness/pull/101) T04–T06 implementation/release candidate; planning commit `efd2b94`; prior closure and releases: [archive](archive/backlog-2026.md#f-048). |
| Opened | 2026-11-09 |
| Verification | 2026-11-11: 22 focused fixtures and live read/export acceptance pass. Fresh-context independent review, required CI and publication remain. Prior T01–T03 verification remains archived and is not reopened. |
| Reviewed | 2026-11-11 |

</details>

---
## Current reopening

F-048 T01–T03 remain historically closed and published. The record is active again only for owner-requested T04–T06 subscription allowance, export and calibration work; the older closure note below describes the prior release boundary.

## Other changes

Published v4.7.0 after PR #99 / CI42887014187 passed169 fixtures/check and independent review fixes. [PR #100](https://github.com/voidbrain/project-harness/pull/100) records closure. F-048 is closed and archived with completed step table and all source limitations; no active feature remains. Release closure is independently owned here, with consumer reconciliation separately owned.

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
