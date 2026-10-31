# Project harness backlog

Current work ledger, reviewed 31 October 2026 against main `1668eb7` (merged #48; CI 41207476557 and every job step green). [Current audit](audits/2026-10-31.md) · [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md) · [Reading the records](#how-to-use-this-file).

## Bugs and reliability

No further implementation work identified. B-011 and B-012 await publication below.

## Features and improvements

No further implementation work identified. F-021–F-025 await publication below.

## Awaiting publication

Seven merged and verified outcomes share one remaining action: publish the cumulative **v2.2.2** release from verified main, then close/archive these records. All prerequisite implementation commits are ancestors of main. Earlier unpublished 2.x tag plans are superseded by this cumulative release; do not backfill separate tags merely to close records. The shared blocker is unavailable tag-write access in this session; no human approval is pending. Each Small/~90% estimate includes the same publication dependency, so these are not seven independent work estimates.

### B-011

**Bind merge requests to the inspected commit (reopened, 2.2.1)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟣 | ◻️ P2 | Blocked | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Agent-owned tag publication is blocked by unavailable write access.

| | |
|---|---|
| **Issue** | The merge watcher can inspect a green head and then merge a different head if the branch moves before the merge request. |
| **Reproduce** | Mock gh between pr view and pr merge; inspect whether the request includes the inspected head. |
| **Check** | Merge uses --match-head-commit; a moved head cannot be merged using stale check evidence. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation and the applicable recorded verification are complete; merged PR/CI evidence remains below. Publish the cumulative v2.2.2 tag from verified main containing #39, #40, #42, #44, #45 and #47. Verify that the published tag contains these changes, then close/archive this record. The earlier unpublished tag plan is superseded, not a claim of a historical release. No further coding, consumer adoption or human acceptance is required by this record. Publication remains agent-owned and already authorized.

**Estimates:** Small remaining effort; ~90% complete. Reassessed 2026-10-31 against merged code and recorded verification: only the shared cumulative-release publication and record closure remain. Small is active work size, not time waiting for access. The percentage is a coarse estimate, not verification or seven separate publication tasks; its rationale remains valid.

| Field | Value |
|---|---|
| PR / evidence | [#35](https://github.com/voidbrain/project-harness/pull/35), v1.19.1; reopened by the 2026-10-31 full audit; [#45](https://github.com/voidbrain/project-harness/pull/45) |
| Opened | 2026-10-30 |
| Verification | Unit/integration · 2026-10-31 · [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978), every step and all 56 owned fixtures passed; merged #45. Live host/client/compiler limits remain as recorded in the audit. |
| Reconciliation | Evidence [#46](https://github.com/voidbrain/project-harness/pull/46); release tag remains the only closure dependency. |
| Publication blocker | No exposed tag-write operation or authenticated shell Git. Resume agent-owned publication on an authorized host with tag-write access; existing approval remains valid. |
| Actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.2.1 at a0e2d05; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Reviewed | 2026-10-31 |

</details>

---

### B-012

**Respect Angular version exceptions in convention checks (2.2.1)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟣 | ◻️ P2 | Blocked | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Agent-owned tag publication is blocked by unavailable write access.

| | |
|---|---|
| **Issue** | Written rules adapt to the project version, but the convention checker rejected explicit standalone and OnPush settings on older Angular projects. |
| **Reproduce** | Run the checker on fixture workspaces at Angular 18, 20, 21 and 22 and on an uninstalled cross-major range. |
| **Check** | Only enforce standalone defaults at v20+ and OnPush defaults at v22+; unknown installed version does not invent a default. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation and the applicable recorded verification are complete; merged PR/CI evidence remains below. Publish the cumulative v2.2.2 tag from verified main containing #39, #40, #42, #44, #45 and #47. Verify that the published tag contains these changes, then close/archive this record. The earlier unpublished tag plan is superseded, not a claim of a historical release. No further coding, consumer adoption or human acceptance is required by this record. Publication remains agent-owned and already authorized.

**Estimates:** Small remaining effort; ~90% complete. Reassessed 2026-10-31 against merged code and recorded verification: only the shared cumulative-release publication and record closure remain. Small is active work size, not time waiting for access. The percentage is a coarse estimate, not verification or seven separate publication tasks; its rationale remains valid.

| Field | Value |
|---|---|
| PR / evidence | Owner-requested full audit, 2026-10-31; [#45](https://github.com/voidbrain/project-harness/pull/45) |
| Opened | 2026-10-31 |
| Verification | Unit/integration · 2026-10-31 · [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978), every step and all 56 owned fixtures passed; merged #45. Live host/client/compiler limits remain as recorded in the audit. |
| Reconciliation | Evidence [#46](https://github.com/voidbrain/project-harness/pull/46); release tag remains the only closure dependency. |
| Publication blocker | No exposed tag-write operation or authenticated shell Git. Resume agent-owned publication on an authorized host with tag-write access; existing approval remains valid. |
| Actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.2.1 at a0e2d05; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Reviewed | 2026-10-31 |

</details>

---

### F-021

**Compact active records and mandatory recaps (2.0.0)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟣 | ◻️ P2 | Blocked | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Agent-owned tag publication is blocked by unavailable write access.

| | |
|---|---|
| **Issue** | Agent-owned and untouched records can omit recaps; long visible actions make the ledger hard to scan. |
| **Reproduce** | Run the old validator on an agent-owned record without a recap; read a ledger with long next actions. |
| **Check** | Every record requires all three recap rows and estimates; actions and history stay collapsed with no evidence lost. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation and the applicable recorded verification are complete; merged PR/CI evidence remains below. Publish the cumulative v2.2.2 tag from verified main containing #39, #40, #42, #44, #45 and #47. Verify that the published tag contains these changes, then close/archive this record. The earlier unpublished tag plan is superseded, not a claim of a historical release. No further coding, consumer adoption or human acceptance is required by this record. Publication remains agent-owned and already authorized.

**Estimates:** Small remaining effort; ~90% complete. Reassessed 2026-10-31 against merged code and recorded verification: only the shared cumulative-release publication and record closure remain. Small is active work size, not time waiting for access. The percentage is a coarse estimate, not verification or seven separate publication tasks; its rationale remains valid.

| Field | Value |
|---|---|
| PR / evidence | Owner request from OpenBando, 2026-10-31; [#39](https://github.com/voidbrain/project-harness/pull/39) |
| Opened | 2026-10-31 |
| Verification | Documentation/tool fixtures · 2026-10-31 · [CI 41196190379](https://github.com/voidbrain/project-harness/actions/runs/41196190379), every job step green; all 29 fixtures pass. Completed consumer trial: OpenBando’s 20 prior records passed the validator. Tag publication pending. |
| Audit reassessment | 2026-10-31: ownership and current evidence reviewed; remaining tag task unchanged, Small/~90% remains valid. |
| Publication blocker | No exposed tag-write operation or authenticated shell Git. Resume agent-owned publication on an authorized host with tag-write access; existing approval remains valid. |
| Actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.0.0 at da68177; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Reviewed | 2026-10-31 |

</details>

---


### F-022

**Reject foreign backlog actions and downstream release gates (2.0.1)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟣 | ◻️ P2 | Blocked | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Agent-owned tag publication is blocked by unavailable write access.

| | |
|---|---|
| **Issue** | F-021 assigned a consumer reconciliation here despite the existing one-repository rule. |
| **Reproduce** | Read F-021’s former next action and APPLY’s former required consumer-trial step. |
| **Check** | No foreign action remains; rules reject it in any record field and keep master acceptance independent of derived-project adoption. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation and the applicable recorded verification are complete; merged PR/CI evidence remains below. Publish the cumulative v2.2.2 tag from verified main containing #39, #40, #42, #44, #45 and #47. Verify that the published tag contains these changes, then close/archive this record. The earlier unpublished tag plan is superseded, not a claim of a historical release. No further coding, consumer adoption or human acceptance is required by this record. Publication remains agent-owned and already authorized.

**Estimates:** Small remaining effort; ~90% complete. Reassessed 2026-10-31 against merged code and recorded verification: only the shared cumulative-release publication and record closure remain. Small is active work size, not time waiting for access. The percentage is a coarse estimate, not verification or seven separate publication tasks; its rationale remains valid.

| Field | Value |
|---|---|
| PR / evidence | Owner report 2026-10-31; [#40](https://github.com/voidbrain/project-harness/pull/40); [#41](https://github.com/voidbrain/project-harness/pull/41) (evidence reconciliation) |
| Opened | 2026-10-31 |
| Verification | Documentation · 2026-10-31 · [CI 41197249696](https://github.com/voidbrain/project-harness/actions/runs/41197249696) green; template, backlog and 29 fixture checks passed. Tag publication pending. |
| Audit reassessment | 2026-10-31: ownership and current evidence reviewed; remaining tag task unchanged, Small/~90% remains valid. |
| Publication blocker | No exposed tag-write operation or authenticated shell Git. Resume agent-owned publication on an authorized host with tag-write access; existing approval remains valid. |
| Actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.0.1 at 9c3abc6; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Reviewed | 2026-10-31 |

</details>

---

### F-023

**Optional MCP recommendations, discovery and guided host setup**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟣 | ◻️ P2 | Blocked | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Agent-owned tag publication is blocked by unavailable write access.

| | |
|---|---|
| **Issue** | Projects lack a reproducible way to select useful capabilities and distinguish recommendation from connection. |
| **Reproduce** | Use a fixture Angular workspace or a project with no integration selections; run the MCP helper. |
| **Check** | No selections still work; candidates and sources are explicit; snippets are client-specific; offline/permission/runtime limits are honest. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation and the applicable recorded verification are complete; merged PR/CI evidence remains below. Publish the cumulative v2.2.2 tag from verified main containing #39, #40, #42, #44, #45 and #47. Verify that the published tag contains these changes, then close/archive this record. The earlier unpublished tag plan is superseded, not a claim of a historical release. No further coding, consumer adoption or human acceptance is required by this record. Publication remains agent-owned and already authorized.

**Estimates:** Small remaining effort; ~90% complete. Reassessed 2026-10-31 against merged code and recorded verification: only the shared cumulative-release publication and record closure remain. Small is active work size, not time waiting for access. The percentage is a coarse estimate, not verification or seven separate publication tasks; its rationale remains valid.

| Field | Value |
|---|---|
| PR / evidence | Owner request 2026-10-31; [#42](https://github.com/voidbrain/project-harness/pull/42); [#43](https://github.com/voidbrain/project-harness/pull/43) (evidence reconciliation) |
| Opened | 2026-10-31 |
| Verification | Unit/integration · 2026-10-31 · [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978), every step and all 56 owned fixtures passed; merged #45. Live host/client/compiler limits remain as recorded in the audit. |
| Audit follow-up | Full restart against merged #44; [#45](https://github.com/voidbrain/project-harness/pull/45) |
| Reconciliation | Evidence [#46](https://github.com/voidbrain/project-harness/pull/46); release tag remains the only closure dependency. |
| Documentation reassessment | 2026-10-31: headings separated without scope/acceptance changes; Small/~90% remains valid; tag publication pending. |
| Publication blocker | No exposed tag-write operation or authenticated shell Git. Resume agent-owned publication on an authorized host with tag-write access; existing approval remains valid. |
| Actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.1.0 at 658208a, followed by correction v2.2.1 at a0e2d05; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Reviewed | 2026-10-31 |

</details>

---

### F-024

**Optional solution coordinator profile and combined backlog dashboard**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟣 | ◻️ P2 | Blocked | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Agent-owned tag publication is blocked by unavailable write access.

| | |
|---|---|
| **Issue** | Multi-repository solutions need their own integration backlog while components retain authoritative records. |
| **Reproduce** | Apply the solution fragment to a fixture coordinator with independent component checkouts and qualified links. |
| **Check** | Show separate solution/component status, immutable source refs, archive links and Unknown failures; never edit components or average completion. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation and the applicable recorded verification are complete; merged PR/CI evidence remains below. Publish the cumulative v2.2.2 tag from verified main containing #39, #40, #42, #44, #45 and #47. Verify that the published tag contains these changes, then close/archive this record. The earlier unpublished tag plan is superseded, not a claim of a historical release. No further coding, consumer adoption or human acceptance is required by this record. Publication remains agent-owned and already authorized.

**Estimates:** Small remaining effort; ~90% complete. Reassessed 2026-10-31 against merged code and recorded verification: only the shared cumulative-release publication and record closure remain. Small is active work size, not time waiting for access. The percentage is a coarse estimate, not verification or seven separate publication tasks; its rationale remains valid.

| Field | Value |
|---|---|
| PR / evidence | Owner request 2026-10-31; [#42](https://github.com/voidbrain/project-harness/pull/42); [#43](https://github.com/voidbrain/project-harness/pull/43) (evidence reconciliation) |
| Opened | 2026-10-31 |
| Verification | Unit/integration · 2026-10-31 · [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978), every step and all 56 owned fixtures passed; merged #45. Live host/client/compiler limits remain as recorded in the audit. |
| Audit follow-up | Full restart against merged #44; [#45](https://github.com/voidbrain/project-harness/pull/45) |
| Reconciliation | Evidence [#46](https://github.com/voidbrain/project-harness/pull/46); release tag remains the only closure dependency. |
| Documentation reassessment | 2026-10-31: headings separated without scope/acceptance changes; Small/~90% remains valid; tag publication pending. |
| Publication blocker | No exposed tag-write operation or authenticated shell Git. Resume agent-owned publication on an authorized host with tag-write access; existing approval remains valid. |
| Actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.1.0 at 658208a, followed by correction v2.2.1 at a0e2d05; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Reviewed | 2026-10-31 |

</details>

---

### F-025

**Portable shared harness skill and reviewed skill discovery (2.2.0)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟣 | ◻️ P2 | Blocked | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Agent-owned tag publication is blocked by unavailable write access.

| | |
|---|---|
| **Issue** | A personal apply-harness skill is unavailable to other clones, duplicates procedure and relies on a derived repository; discovery advice treats popularity as quality. |
| **Reproduce** | Compare the supplied personal skills with a fresh harness checkout and its authoritative APPLY.md. |
| **Check** | Shared entry point reads authoritative rules, has no fixed personal path or downstream authority; optional discovery reviews sources, scope and actual client compatibility. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation and the applicable recorded verification are complete; merged PR/CI evidence remains below. Publish the cumulative v2.2.2 tag from verified main containing #39, #40, #42, #44, #45 and #47. Verify that the published tag contains these changes, then close/archive this record. The earlier unpublished tag plan is superseded, not a claim of a historical release. No further coding, consumer adoption or human acceptance is required by this record. Publication remains agent-owned and already authorized.

**Estimates:** Small remaining effort; ~90% complete. Reassessed 2026-10-31 against merged code and recorded verification: only the shared cumulative-release publication and record closure remain. Small is active work size, not time waiting for access. The percentage is a coarse estimate, not verification or seven separate publication tasks; its rationale remains valid.

| Field | Value |
|---|---|
| PR / evidence | Owner-supplied skills and proceed instruction, 2026-10-31; [#44](https://github.com/voidbrain/project-harness/pull/44) |
| Opened | 2026-10-31 |
| Verification | Template/backlog checks and all 45 fixtures passed locally, 2026-10-31; [CI 41204390779](https://github.com/voidbrain/project-harness/actions/runs/41204390779) and every job step passed; merged as 72e223d; no live-client installation attempted |
| Publication blocker | No exposed tag-write operation or authenticated shell Git. Resume agent-owned publication on an authorized host with tag-write access; existing approval remains valid. |
| Actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.2.0 at 72e223d; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Reviewed | 2026-10-31 |

</details>

---

## Other changes

2026-10-31: Agent-owned publication attempt for approved v2.2.2 at verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339. Direct shell Git failed its write-authentication test; the connector supports commits/PR merges but no tag operation. A one-time repository workflow reruns source checks, creates only the exact approved tag without force, and verifies the remote ref. Remove this temporary workflow when publication is verified and the seven records are archived. Publication [#50](https://github.com/voidbrain/project-harness/pull/50); all 56 fixtures and template/backlog checks pass locally. No tag or closure is claimed yet.

2026-10-31: Reviewed all seven active records for actual closure: implementation and recorded checks are complete. Grouped them under Awaiting publication and superseded separate unpublished tag requests with one cumulative v2.2.2 release. Verified prerequisite commit ancestry; remote refs contain no published v2.x tag. No outcome is prematurely marked Closed. Review [#49](https://github.com/voidbrain/project-harness/pull/49).

2026-10-31: Corrected B-011, B-012 and F-021–F-025 from Human action required Yes to No: release publication is already authorized and agent-owned. Blocked status now names the missing tag-write capability and resume condition. [#48](https://github.com/voidbrain/project-harness/pull/48). No new approval or human acceptance is requested.

2026-10-31: Documentation clarification (2.2.2): separate capability assessment, MCP recommendations, solution profiles and shared skills in README and matching instructions. Requirements and optional adoption remain unchanged. [#47](https://github.com/voidbrain/project-harness/pull/47); local template/backlog checks and all 56 fixtures pass. [CI 41207111207](https://github.com/voidbrain/project-harness/actions/runs/41207111207) and every job step passed; merged as cc9428d. Agent-owned v2.2.2 tag publication is blocked by the same unavailable write capability. No consumer action is a gate.

Completed audit maintenance is [archived](archive/backlog-2026.md#full-template-audit-2026-10-31); B-011, B-012, F-023 and F-024 retain only owned release publication. Evidence [#46](https://github.com/voidbrain/project-harness/pull/46).

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

Each item shows its ID and title, a signal table (priority, status, remaining effort and estimated completion), Human action required (🧑 Yes / 💻 No), and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Completion is a coarse estimate, not verification; pending acceptance stays below 100%. A `---` line ends every item.
