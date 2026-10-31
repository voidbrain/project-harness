# Project harness backlog

Current work ledger, reviewed 31 October 2026 against main `bc7d743` (merged #55; CI 41228352936 green; cumulative 3.1.1 target untagged). [Current full audit](audits/2026-10-31-full-harness.md) · [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md) · [Reading the records](#how-to-use-this-file).

## Bugs and reliability

### B-013

**Contain configured fork merges inside the project checkout**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔺 P1 | Implemented | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Inspect owned PR CI and publish the verified outcome; release-dependent fixes remain open until tagged.

| | |
|---|---|
| **Issue** | check-harness --merge trusted mapped destinations and could modify a sibling file or Git metadata. |
| **Reproduce** | Run the regression fixture with ../sibling/victim.mjs or a symlink pointing outside the project; the former helper merged and rewrote the sibling. |
| **Check** | All destinations preflight before any write; traversal, Git metadata and symlink escapes leave targets and stamp unchanged; valid fork/conflict behavior stays covered. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Fix and failing-before/passing-after fixture exist. Merged #55 after green CI 41228352936; publish cumulative 3.1.1 and close on its tag; no consumer trial needed.

**Estimates:** Small remaining effort; ~90% complete. Local and merged #55 CI evidence exists; publication remains. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#55](https://github.com/voidbrain/project-harness/pull/55); [Full audit](audits/2026-10-31-full-harness.md#confirmed-findings) |
| Opened | 2026-10-31 |
| Verification | Automated/local review · 2026-10-31 · 72 fixtures and all #55 CI steps passed in run 41228352936; tag publication pending |
| Reviewed | 2026-10-31 |

</details>

---

### B-014

**Preserve enforced coverage checks for main-baseline folders**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Inspect owned PR CI and publish the verified outcome; release-dependent fixes remain open until tagged.

| | |
|---|---|
| **Issue** | Removing a display folder from config hid its coverage regression when another folder kept total coverage unchanged. |
| **Reproduce** | Baseline both folders at 90%; measure 80% and 100%, omit the first folder from configured folders; the former helper returned success. |
| **Check** | Opt-in enforcement checks every baseline folder regardless of displayed rows; the regression fails while default warning mode remains compatible. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Fix and failing-before/passing-after fixture exist. All #55 CI steps passed; publish cumulative 3.1.1 and close on its tag. Reviewed coverage policy changes remain explicit decisions.

**Estimates:** Small remaining effort; ~90% complete. Local and merged #55 CI evidence exists; publication remains. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#55](https://github.com/voidbrain/project-harness/pull/55); [Full audit](audits/2026-10-31-full-harness.md#confirmed-findings) |
| Opened | 2026-10-31 |
| Verification | Automated/local review · 2026-10-31 · 72 fixtures and all #55 CI steps passed in run 41228352936; tag publication pending |
| Reviewed | 2026-10-31 |

</details>

---

## Features and improvements

### F-026

**Measure observed adoption and reconciliation friction**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Validate, merge on green checks and publish the owned 3.1.1 tag.

| | |
|---|---|
| **Issue** | No consistent local measurement distinguishes actual friction from opinion. |
| **Reproduce** | Follow the maintenance guide; run the new helper fixtures and review the application/audit procedure. |
| **Check** | Numeric local observations preserve missing versus zero; reports separate operations/sample counts; no source/prompt text or telemetry; invalid inputs and unsafe destinations fail. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** CI run 41225792756 exposed a nonportable timer-test minimum-delay assumption (not a workflow timing failure); fixed with an injected clock asserting exact elapsed time. Follow-up in [#53](https://github.com/voidbrain/project-harness/pull/53). Additional request 2026-10-31: enforce maintenance review in session/CI, automate elapsed timing, and turn justified recurring findings into owned rule/tool/skill changes rather than silent self-modification. Implemented baseline in [#52](https://github.com/voidbrain/project-harness/pull/52). Run template/backlog/helper checks; inspect all PR checks, merge only when green, then publish cumulative v3.1.1 from verified main. Close on this repository’s own published release; consumer adoption is separate.

**Estimates:** Small remaining effort; ~90% complete. Implementation and documentation exist; baseline helpers passed merged #52 CI; the extended suite passes 64 fixtures; automatic timing/enforcement and quality policy now have regression checks; CI passed; cumulative 3.1.1 publication remains. Reassessed 2026-10-31. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#52](https://github.com/voidbrain/project-harness/pull/52); [maintenance guidance](agents/maintenance.md) |
| Opened | 2026-10-31 |
| Verification | Tool/documentation checks · 2026-10-31 · 59 fixtures, template consistency and backlog/archive preservation passed; Merged CI · 2026-10-31 · #52 run 41223980633 and #53 run 41226326072 passed; publication · Pending |
| Reviewed | 2026-10-31 |

</details>

---

### F-027

**Preview reconciliation before writes**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Validate, merge on green checks and publish the owned 3.1.1 tag.

| | |
|---|---|
| **Issue** | Agents need proposed changes, protected project rules and unresolved conflicts before editing. |
| **Reproduce** | Follow the maintenance guide; run the new helper fixtures and review the application/audit procedure. |
| **Check** | Preview is read-only, pins a local release commit, identifies changed/missing/conflicting and adapted files, shows project markers and required checks, and refuses invalid paths/options without claiming semantic verification. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Follow-up in [#53](https://github.com/voidbrain/project-harness/pull/53). Additional request 2026-10-31: enforce maintenance review in session/CI, automate elapsed timing, and turn justified recurring findings into owned rule/tool/skill changes rather than silent self-modification. Implemented baseline in [#52](https://github.com/voidbrain/project-harness/pull/52). Run template/backlog/helper checks; inspect all PR checks, merge only when green, then publish cumulative v3.1.1 from verified main. Close on this repository’s own published release; consumer adoption is separate.

**Estimates:** Small remaining effort; ~90% complete. Implementation and documentation exist; baseline helpers passed merged #52 CI; the extended suite passes 64 fixtures; automatic timing/enforcement and quality policy now have regression checks; CI passed; cumulative 3.1.1 publication remains. Reassessed 2026-10-31. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#52](https://github.com/voidbrain/project-harness/pull/52); [maintenance guidance](agents/maintenance.md) |
| Opened | 2026-10-31 |
| Verification | Tool/documentation checks · 2026-10-31 · 59 fixtures, template consistency and backlog/archive preservation passed; Merged CI · 2026-10-31 · #52 run 41223980633 and #53 run 41226326072 passed; publication · Pending |
| Reviewed | 2026-10-31 |

</details>

---

### F-028

**Consolidate redundant rules without weakening starting requirements**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Validate, merge on green checks and publish the owned 3.1.1 tag.

| | |
|---|---|
| **Issue** | Repeated rules and procedural conflicts need periodic review while all applicable rules remain known from the start. |
| **Reproduce** | Follow the maintenance guide; run the new helper fixtures and review the application/audit procedure. |
| **Check** | Audit/event-triggered review records old/new ownership, requirements and exceptions; duplicates may become pointers; age or rare use never automatically removes safeguards; no reduced-rule tier. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Follow-up in [#53](https://github.com/voidbrain/project-harness/pull/53). Additional request 2026-10-31: enforce maintenance review in session/CI, automate elapsed timing, and turn justified recurring findings into owned rule/tool/skill changes rather than silent self-modification. Implemented baseline in [#52](https://github.com/voidbrain/project-harness/pull/52). Run template/backlog/helper checks; inspect all PR checks, merge only when green, then publish cumulative v3.1.1 from verified main. Close on this repository’s own published release; consumer adoption is separate.

**Estimates:** Small remaining effort; ~90% complete. Implementation and documentation exist; baseline helpers passed merged #52 CI; the extended suite passes 64 fixtures; automatic timing/enforcement and quality policy now have regression checks; CI passed; cumulative 3.1.1 publication remains. Reassessed 2026-10-31. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#52](https://github.com/voidbrain/project-harness/pull/52); [maintenance guidance](agents/maintenance.md) |
| Opened | 2026-10-31 |
| Verification | Tool/documentation checks · 2026-10-31 · 59 fixtures, template consistency and backlog/archive preservation passed; Merged CI · 2026-10-31 · #52 run 41223980633 and #53 run 41226326072 passed; publication · Pending |
| Reviewed | 2026-10-31 |

</details>

---



### F-029

**Risk-based incremental quality and optional coverage non-regression**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Inspect CI and publish cumulative v3.1.1 on green checks.

| | |
|---|---|
| **Issue** | Coverage must guide quality improvements without arbitrary growth targets or a PR approving its own lowered baseline. |
| **Reproduce** | Enable coverage.enforce in a fixture; lower measured coverage and edit the PR baseline; run coverage-table --check. Also test disabled mode and missing evidence. |
| **Check** | Enforced checks compare against origin/main and fail regressions/missing comparable data; existing warning mode remains compatible. Policy requires changed-behavior tests and risk-based improvements, not percentage increases for every PR. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Coverage enforcement is opt-in per owning project and uses its configured tolerance; no OpenBando gate/threshold was silently adopted. Unit/browser/security quality evidence remains separate. Publish from this repository's verified main, then close on its own tag; consumer adoption is independent.

**Estimates:** Small remaining effort; ~90% complete. Implementation/fixtures and documented policy exist; CI passed; publication remains. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#53](https://github.com/voidbrain/project-harness/pull/53) |
| Opened | 2026-10-31 |
| Verification | Tool/documentation checks · 2026-10-31 · regression, edited-PR baseline bypass and missing-data fixtures passed; Merged CI · 2026-10-31 · #53 run 41226326072 passed; publication · Pending |
| Reviewed | 2026-10-31 |

</details>

---

### F-030

**Define comprehensive periodic audits and scope-aware dated findings**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | ~90% |

💻 **→ Human action required: No**<br />Validate audit scope fixtures and CI, then publish the cumulative owned release.

| | |
|---|---|
| **Issue** | Broad audit instructions omit a consistent inspection/output contract; a recent narrow report currently masks stale full-area coverage. |
| **Reproduce** | Add a fresh harness-only manifest beside an old full report and run audit freshness; inspect which areas refresh. Exercise full reports with missing/blocked evidence. |
| **Check** | Full audits require all eight areas; scoped reviews affect only declared areas, blocked results do not refresh coverage, historical prose is not guessed. Reports are dated and classify bugs, missing work, clues, annotations and value-based proposals with owned actionable tracking. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** [#54](https://github.com/voidbrain/project-harness/pull/54) adds the shared procedure, scope validator, startup/CI/daily integration and dated report with explicit findings and limits. Validate the fixtures, inspect merged CI and publish the owned cumulative release. New optional tools/suggestions do not authorize unrelated feature work or depend on consumer adoption.

**Estimates:** Small remaining effort; ~90% complete. Implementation/reporting contract exists; 70 fixtures and template/backlog checks pass; CI passed; publication remains. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#54](https://github.com/voidbrain/project-harness/pull/54); [audit procedure](agents/audit.md) |
| Opened | 2026-10-31 |
| Verification | Automated · 2026-10-31 · 70 fixtures and #54 CI run 41227408819 passed; publication · Pending |
| Reviewed | 2026-10-31 |

</details>

---

## Other changes

Publishing the approved cumulative v3.1.1 target `7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031` through a one-time repository workflow, following the successful v2.2.2 route. Verification reruns all owned checks at that exact commit; publication creates an annotated tag only after success and never rewrites an existing ref. Remove the operational workflow and reconcile B-013/B-014/F-026–F-030 after observing the remote tag and publication run. Publication is pending until then.

Full audit F-031 verified and closed 2026-10-31 after [#55](https://github.com/voidbrain/project-harness/pull/55) merged with [CI 41228352936](https://github.com/voidbrain/project-harness/actions/runs/41228352936) green. All eight areas have a dated full report/manifest; both confirmed defects are fixed with failing-before/passing-after regressions. B-013/B-014 and F-026–F-030 remain independently release-pending. Historical audit prose remains unchanged.

Published [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) at verified commit `0764a36`. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step and all 56 fixtures. B-011, B-012 and F-021–F-025 are closed and archived with their complete history. [PR #51](https://github.com/voidbrain/project-harness/pull/51) removes the one-time publication workflow. No publication blocker remains for v2.2.2. The newer cumulative target is still untagged; shell Git lacks write authentication and the available connector cannot create tags. No new permission request or consumer dependency is implied.

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
