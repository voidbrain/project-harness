# Project harness backlog

Current work ledger, reviewed 6 November 2026 against main `a799e10` (PR #62 CI 42283633421 green; v3.2.0 published). [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

## Bugs and reliability

None open.

## Features and improvements



### F-033

**Executable guards for the rules agents must never break**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟡 Medium | ~0% |

💻 **→ Human action required: No**<br />Next: a portable guard script, a git pre-push hook and an optional Claude Code adapter.

| | |
|---|---|
| **Issue** | The never/ask-first rules (no push to `main`, no force-push or history rewrite, archives only grow, no deleting branches the agent did not create) are prose; only branch protection enforces any of them, and only on the server. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): skills and instructions are advisory, critical rules need hooks. |
| **Reproduce** | In a consumer, `git push origin HEAD:main` from a feature branch, or `git push --force`: nothing local stops it before GitHub does (and nothing at all on a repository without protection). |
| **Check** | One guard script (no dependency on any agent platform) refuses a push to the default branch, a force-push and a change that removes or edits a line of an archive already on the default branch, with the rule it enforces; installed as a git `pre-push` hook by an opt-in setup step; an optional adapter runs the same script as a Claude Code `PreToolUse` hook (exit code 2), so other agents and plain git get the same rule; `check:harness` reports whether the guard is installed; tests cover each refusal and an allowed push. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Planned 2026-11-05. Keep the rules in AGENTS.md as the source; the guard cites them, never restates them differently. The adapter is optional: the harness must not require Claude Code.

**Estimates:** Medium effort; ~0% complete. Nothing implemented yet.

| Field | Value |
|---|---|
| PR / evidence | [#60](https://github.com/voidbrain/project-harness/pull/60) records only; owner decision 2026-11-05 (NERV session, review of Anthropic's AI-native SDLC playbook, 2026-08-21) |
| Opened | 2026-11-05 |
| Verification | Pending |
| Reviewed | 2026-11-05 |

</details>

---

### F-034

**A bug fix starts with a committed failing test**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟢 Small | ~0% |

💻 **→ Human action required: No**<br />Next: the rule in BACKLOG-RULES and AGENTS, and a check on B- records.

| | |
|---|---|
| **Issue** | B- records have a Reproduce field, but nothing asks that it becomes a test before the fix. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): commit the failing test first, then fix without editing it. NERV #96 did this (the test failed without the fix) and it pinned a race no review had found. |
| **Reproduce** | Close a B- record whose PR changes code but adds no test: nothing objects. |
| **Check** | BACKLOG-RULES says a B- fix commits a test that fails without the fix (or records why none can, e.g. a visual or device-only defect, with the manual check instead); the record names the test; `check:backlog` warns on a Verified or Closed B- record that names no test and no reason; template fixtures cover both. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Planned 2026-11-05. Optional later: a guard (F-033) that refuses edits to that test file during the fix commits.

**Estimates:** Small effort; ~0% complete. Nothing implemented yet.

| Field | Value |
|---|---|
| PR / evidence | [#60](https://github.com/voidbrain/project-harness/pull/60) records only; owner decision 2026-11-05 (NERV session, review of Anthropic's AI-native SDLC playbook, 2026-08-21) |
| Opened | 2026-11-05 |
| Verification | Pending |
| Reviewed | 2026-11-05 |

</details>

---

### F-035

**A small set of agent-behaviour checks, rerun when the rules change**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔹 P3 | Open | 🔴 Large | ~0% |

💻 **→ Human action required: No**<br />Next: about ten scenarios with deterministic graders.

| | |
|---|---|
| **Issue** | Tools check records and files, not whether an agent following AGENTS.md behaves as intended (asks before a 🧑 decision, names the PR instead of "this PR", files a bug as B-, keeps unrelated code, reports a failing test honestly). Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21) recommends 20–50 cases rerun whenever CLAUDE.md, skills or hooks change; start with about ten. |
| **Reproduce** | Change a rule in core/AGENTS.md; nothing tells whether agents still follow the old and new rules. |
| **Check** | About ten scenarios, each a fixture repository, a task and a grader that reads the result (files, records, commits, refusals) without a model; runnable on demand and when core/AGENTS.md, BACKLOG-RULES or skills change, never on every PR by default (cost); each scenario run several times, results compared per scenario, not only as a total; a finding from an audit or a real mistake can be added as a scenario. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Planned 2026-11-05. Needs an agent runner chosen by the project (no platform dependency in the template); the graders and fixtures are the template part.

**Estimates:** Large effort; ~0% complete. Nothing implemented yet.

| Field | Value |
|---|---|
| PR / evidence | [#60](https://github.com/voidbrain/project-harness/pull/60) records only; owner decision 2026-11-05 (NERV session, review of Anthropic's AI-native SDLC playbook, 2026-08-21) |
| Opened | 2026-11-05 |
| Verification | Pending |
| Reviewed | 2026-11-05 |

</details>

---

### F-036

**Independent review for P1 and harness changes**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔹 P3 | Open | 🟢 Small | ~0% |

💻 **→ Human action required: No**<br />Next: when a review is required and how it is recorded.

| | |
|---|---|
| **Issue** | The agent that wrote a change also certifies it. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): a separate reviewer pass (bugs, security, compliance with the record), which can never approve or merge. |
| **Reproduce** | Open a P1 fix or a harness-file change: no second look is required before merge. |
| **Check** | AGENTS/BACKLOG-RULES: a PR that closes a P1 record or changes a harness file gets a review in a fresh context (a review skill or a separate session), its findings fixed or answered in the PR; the record cites it; the reviewer never approves or merges; small and documentation-only changes are exempt. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Planned 2026-11-05. Uses existing review tools (e.g. a code-review skill); no new agent role in the template.

**Estimates:** Small effort; ~0% complete. Nothing implemented yet.

| Field | Value |
|---|---|
| PR / evidence | [#60](https://github.com/voidbrain/project-harness/pull/60) records only; owner decision 2026-11-05 (NERV session, review of Anthropic's AI-native SDLC playbook, 2026-08-21) |
| Opened | 2026-11-05 |
| Verification | Pending |
| Reviewed | 2026-11-05 |

</details>

---

### F-037

**Safety rules always loaded; procedures loaded when needed**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟡 Medium | ~0% |

💻 **→ Human action required: No**<br />Next: split AGENTS.md into the always-loaded rules and procedures read on demand.

| | |
|---|---|
| **Issue** | Owner decision 2026-11-05: keep the safety rules always loaded and let procedures load when needed. Today AGENTS.md carries both, so every session loads every procedure (Anthropic, *When to fold subagents into your main agent loop* (2026-10-22): progressive disclosure; the playbook: CLAUDE.md under a page). The rule "all applicable rules must be known and followed from the start; shorter indexes never defer requirements" stays: what moves out is how to do a task, never what is allowed. |
| **Reproduce** | Count the lines of core/AGENTS.md a session loads before its first task. |
| **Check** | AGENTS.md keeps every never/ask-first rule, the checks before finishing and a one-line trigger per procedure ("before X, read Y"); procedures (reconciling, audits, maintenance review, impact map, releasing) live in their docs; a check fails if a never/ask-first rule exists only in a procedure document; APPLY.md reconciles consumers without losing project lines; consumers keep their `<!-- project -->` lines. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Planned 2026-11-05. Do before F-035, so the behaviour checks test the new layout.

**Estimates:** Medium effort; ~0% complete. Nothing implemented yet.

| Field | Value |
|---|---|
| PR / evidence | [#60](https://github.com/voidbrain/project-harness/pull/60) records only; owner decision 2026-11-05 (NERV session, review of Anthropic's AI-native SDLC playbook, 2026-08-21) |
| Opened | 2026-11-05 |
| Verification | Pending |
| Reviewed | 2026-11-05 |

</details>

---

### F-032

**Optional browser and combined coverage contracts**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔹 P3 | Open | 🔴 Large | ~0% |

💻 **→ Human action required: No**<br />Define and implement optional browser/combined summaries and a repository-owned Playwright collection fixture.

| | |
|---|---|
| **Issue** | Accepted optional template capability was planned only in OpenBando F-039; reusable contracts and helpers belong here. |
| **Reproduce** | Compare the current unit-only coverage helper with the accepted browser/combined coverage request. |
| **Check** | Unconfigured projects keep current output; configured fixtures collect Chromium coverage, map source files, merge unit/browser coverage and report separate/combined figures without double counting. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Define optional coverage.browser/coverage.combined input contracts, extend the generic table and non-regression policy, add an opt-in Playwright collector and source-map merge fixture with reproducible tests. Check missing artifacts, unsupported browsers, source mismatches and duplicate records. Publish only after repository-owned fixtures pass. A consumer's adoption or CI wiring is not a release or acceptance condition here. OpenBando F-039 owns only its later integration. Request accepted 2026-10-30 and discovered missing upstream tracking during the 2026-10-31 OpenBando audit; no implementation is claimed.

**Estimates:** Large effort; ~0% complete. Contract and collection/conversion tests remain.

| Field | Value |
|---|---|
| PR / evidence | [OpenBando F-039](https://github.com/voidbrain/openbando/blob/main/docs/BACKLOG.md#f-039); [#59](https://github.com/voidbrain/project-harness/pull/59) records ownership only |
| Opened | 2026-10-31 |
| Verification | Documentation review · 2026-10-31 · ownership and independent acceptance reviewed; implementation not started |
| Reviewed | 2026-10-31 |

</details>

---


## Other changes

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

Each item shows its ID and title, a signal table (priority, status, remaining effort and estimated completion), Human action required (🧑 Yes / 💻 No), and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Completion is a coarse estimate, not verification; pending acceptance stays below 100%. A `---` line ends every item.
