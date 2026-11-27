# Project harness backlog

Current work ledger, reviewed 27 November 2026 against main `7a70ef6` (PRs #326–#328, green CI). B-132 closed on v10.25.3; F-113 (optional step `runner`) ships in 10.26.0; next: B-126 (rerun name-the-pr at --times=10). History: [reconciliation log](archive/reconciliation-2026.md).

<!-- totals:start -->
**Remaining effort:** 84.5 h across 48 open steps of 11 features and 1 other record. Generated from the task files.
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

### <a id="f-106"></a>[✨ F-106](#top)

**Dependency vulnerability audit in CI and a Dependabot config for GitHub Actions**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔶 P2 | 🔴 Large | 5 h | — | — | 🤖 | — | — |

💻 **→** Next: F-106-T01 — Dependency audit tool, warn first and enforce by setting (Planned).

| | |
|---|---|
| **Issue** | None of the nine repositories runs a dependency vulnerability audit in CI (report M3) and none has a `dependabot.yml` (M4); all nine pin their workflow actions by SHA, so the pins never move. Between alert reviews a known CVE in a production dependency goes unseen, and a pinned action never receives a security fix. Evidence: [NERV practices transfer report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md), class A items A11 and A12, missing practices M3 and M4, situation gap X5. Owner decision 2026-11-26 in chat: "NERV practices inventory accept all" (all 22 proposals of the [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); this record is proposal 8). |
| **Reproduce** | Search the nine repositories for `npm audit` in `.github/workflows/` and for `.github/dependabot.yml`: no match. `core/` and `angular/` CI snippets in this repository have neither. |
| **Check** | A template tool runs `npm audit --omit=dev --audit-level=high`, warn-only by default and enforcing by a `.harness.json` setting, and reports an unreachable registry as unknown, never as clean (F-106-T01); the CI snippets call it (F-106-T02); a template `dependabot.yml` updates the `github-actions` ecosystem weekly with npm version updates off, and `check:tooling` notes its absence (F-106-T03); released as a minor version (F-106-T04). The owner-side repository settings (Dependabot alerts and security updates) are the coordinator baseline, not this record. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-106-t01"></a>F-106-T01 — Dependency audit tool, warn first and enforce by setting | 2 h | 0 h | 2 h | Planned | — | [F-106-T02](#f-106-t02) |
| 🟢 Small | <a id="f-106-t03"></a>F-106-T03 — Dependabot config for GitHub Actions and a tooling note | 1 h | 0 h | 1 h | Planned | — | [F-106-T04](#f-106-t04) |
| 🟢 Small | <a id="f-106-t02"></a>F-106-T02 — Wire the audit into the CI snippets and document the setting | 1 h | 0 h | 1 h | Planned | [F-106-T01](#f-106-t01) | [F-106-T04](#f-106-t04) |
| 🟢 Small | <a id="f-106-t04"></a>F-106-T04 — Release the audit and Dependabot template | 1 h | 0 h | 1 h | Planned | [F-106-T02](#f-106-t02), [F-106-T03](#f-106-t03) | — |
| 🔴 Large | **Total** | 5 h | 0 h (0 of 4 steps recorded) | 5 h | 0 of 4 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-106.md)

| Field | Value |
|---|---|
| PR / evidence | [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); owner decision 2026-11-26; [#307](https://github.com/voidbrain/project-harness/pull/307) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

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
### <a id="f-113"></a>[✨ F-113](#top)

**Steps record who runs them: an optional `runner` field**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟢 Small | 0 h | — | — | 🤖 | — | — |

💻 **→** Next: F-113-T01 — Optional runner field on steps: validator, ledger column, index column (Implemented; verification pending).

| | |
|---|---|
| **Issue** | Asked by the owner, 2026-11-27 ("ok"): steps should record who runs them, so the coordinator's work graph (coordinator:F-026, lanes) can show owner / agent / night run / Codex / Gemini lanes without guessing. A data field, not a rule (process freeze, coordinator:F-020): nothing requires it to be filled. |
| **Reproduce** | A task file with a `runner` key is refused today: `Invalid task identity/status`. |
| **Check** | Tests committed failing first (`tools/test-work-items.mjs` and `tools/test-backlog-index.mjs`, "F-113"): a task file takes an optional `runner` (lowercase kebab, up to 40 characters; other values refused), the ledger shows a Runner column only in a record where an open step has one, and the backlog index carries `steps.runner`, adding the column to an index file written before it. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | PRs |
|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-113-t01"></a>F-113-T01 — Optional runner field on steps: validator, ledger column, index column | 1 h | 0 h | 0 h | Implemented; verification pending | PR #329 |
| 🟢 Small | **Total** | 1 h | 0 h (0 of 1 steps recorded) | 0 h | 0 of 1 completed | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-113.md)

| Field | Value |
|---|---|
| PR / evidence | Steps: F-113-T01: PR #329; step review: Fresh-context design-reviewer (Opus), 2026-11-27: no blockers; fixed both should-fix items (dump of an index file written before the runner column now reads null, test failing first; CHANGELOG names the coordinator-first upgrade order).. [#329](https://github.com/voidbrain/project-harness/pull/329) |
| Components | coordinator:F-026 |
| Opened | 2026-11-27 |
| Verification | Pending |
| Reviewed | 2026-11-27 |

</details>

---
### <a id="f-109"></a>[✨ F-109](#top)

**Axe accessibility pass per main route in the Angular template**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟡 Medium | 3 h | — | — | 🤖 | — | — |

💻 **→** Next: F-109-T01 — Axe helper and per-route pattern for the Angular template (Planned).

| | |
|---|---|
| **Issue** | NERV runs axe in its browser suites (four tests); bricks and openbando also use axe; grover, fpvbuddy and hobo have no accessibility check beyond contrast. The `angular/` template ships no axe helper, so each project would write its own. Evidence: [NERV practices transfer report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md), inventory 13; class A item A10; missing practice M12. Owner decision 2026-11-26 in chat: "NERV practices inventory accept all" (all 22 proposals of the [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); this record is proposal 17). |
| **Reproduce** | Read `angular/` (no axe helper) and the CI of grover, fpvbuddy and hobo (no axe step). |
| **Check** | The `angular/` template has a documented axe helper and a pattern for one pass per main route in the browser suite, proved by a fixture page with a seeded violation (F-109-T01); the CI snippet runs it and a minor version ships (F-109-T02). The three adopting projects add their routes in their own records (grover, fpvbuddy, hobo). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-109-t01"></a>F-109-T01 — Axe helper and per-route pattern for the Angular template | 2 h | 0 h | 2 h | Planned | — | [F-109-T02](#f-109-t02) |
| 🟢 Small | <a id="f-109-t02"></a>F-109-T02 — CI wiring and release of the axe template | 1 h | 0 h | 1 h | Planned | [F-109-T01](#f-109-t01) | — |
| 🟡 Medium | **Total** | 3 h | 0 h (0 of 2 steps recorded) | 3 h | 0 of 2 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-109.md)

| Field | Value |
|---|---|
| PR / evidence | [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); owner decision 2026-11-26; [#307](https://github.com/voidbrain/project-harness/pull/307) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-112"></a>[✨ F-112](#top)

**Harness changes from the F-020 owner decisions: drop the friction logs as evidence, write the behaviour-run rule**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟡 Medium | 2 h | `coordinator:F-020-T06` | — | ⏳ | — | — |

💻 **→** Next: blocked by coordinator:F-020-T06 (the freeze); then from tasks.

| | |
|---|---|
| **Issue** | Owner decision 2026-11-26, chat "F-020-T05 suggestions ok" (proposals 7 and 8): (7) the friction logs are dropped as evidence (they measure reconcile time in nerv only and never slips); the removal itself is a harness change after the freeze. (8) The owner rule becomes the written one: run behaviour checks only for real rule changes, not for wording, typo, link or layout fixes; the PR says which. That is a governing-rule change, so it lands with the F-020 consolidation and is not written unattended now. |
| **Reproduce** | Read the friction measurement: `docs/reviews/2026-11-coherence/friction.md` in the coordinator repository ([coordinator#117](https://github.com/voidbrain/coordinator/pull/117)). |
| **Check** | The logs are no longer cited as evidence and the page says what they measure (F-112-T01); the behaviour-run rule is written once and the PR says "rule change" or "wording only" (F-112-T02). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟢 Small | <a id="f-112-t01"></a>F-112-T01 — Drop the friction logs as evidence for rule changes | 1 h | 0 h | 1 h | Planned | `coordinator:F-020-T06` | — |
| 🟢 Small | <a id="f-112-t02"></a>F-112-T02 — Write the behaviour-run rule: only for real rule changes | 1 h | 0 h | 1 h | Planned | `coordinator:F-020-T06` | — |
| 🟡 Medium | **Total** | 2 h | 0 h (0 of 2 steps recorded) | 2 h | 0 of 2 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-112.md)

| Field | Value |
|---|---|
| PR / evidence | [coordinator#117](https://github.com/voidbrain/coordinator/pull/117); owner decision 2026-11-26, chat "F-020-T05 suggestions ok"; [#322](https://github.com/voidbrain/project-harness/pull/322) |
| Components | coordinator:F-020 |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-107"></a>[✨ F-107](#top)

**Template checks: PR names itself, conflict markers and an optional roadmap status**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🔴 Large | 7.5 h | — | — | 🤖 | — | — |

💻 **→** Next: F-107-T01 — Conflict-marker check (Planned).

| | |
|---|---|
| **Issue** | The rule "name the PR in the records before the checks finish" has no check in any repository except nerv (`tools/check-pr-record.mjs`, F-105 there), and nothing but nerv fails on tracked conflict markers (`tools/check-conflict-markers.mjs`, B-089 there). `docs/ROADMAP.md` is kept by hand in gauntlet-protocol and fpvbuddy; nerv generates its milestone status (`tools/roadmap-status.mjs`). Evidence: [NERV practices transfer report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md), inventory 1, 2 and 15; class A items A1 and A2; class B item B3 (optional roadmap check, proposal 21). Owner decision 2026-11-26 in chat: "NERV practices inventory accept all" (all 22 proposals of the [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); this record is proposal 11). |
| **Reproduce** | Open a PR whose number is in no record, or commit a file with a `<<<<<<<` marker, in any adopter other than nerv: CI stays green. |
| **Check** | A conflict-marker check runs in `check:fast` and CI (F-107-T01); a check fails a PR whose number is in no record, task or log and skips bots and runs with no PR (F-107-T02); an optional roadmap status tool generates milestone status from the records and is enabled by a `.harness.json` setting (F-107-T03); the CI snippets and documentation wire all three and a minor version ships (F-107-T04). A test that configured secrets never reach logs stays nerv-only (report S10, proposal 14): it checks a nerv log file, so there is no generic form to template. |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-107-t01"></a>F-107-T01 — Conflict-marker check | 1.5 h | 0 h | 1.5 h | Planned | — | [F-107-T04](#f-107-t04) |
| 🟡 Medium | <a id="f-107-t02"></a>F-107-T02 — PR names itself check | 2.5 h | 0 h | 2.5 h | Planned | — | [F-107-T04](#f-107-t04) |
| 🟡 Medium | <a id="f-107-t03"></a>F-107-T03 — Optional roadmap status tool | 2 h | 0 h | 2 h | Planned | — | [F-107-T04](#f-107-t04) |
| 🟡 Medium | <a id="f-107-t04"></a>F-107-T04 — Wire the checks, document them and release | 1.5 h | 0 h | 1.5 h | Planned | [F-107-T01](#f-107-t01), [F-107-T02](#f-107-t02), [F-107-T03](#f-107-t03) | — |
| 🔴 Large | **Total** | 7.5 h | 0 h (0 of 4 steps recorded) | 7.5 h | 0 of 4 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-107.md)

| Field | Value |
|---|---|
| PR / evidence | [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); owner decision 2026-11-26; [#307](https://github.com/voidbrain/project-harness/pull/307) |
| Opened | 2026-11-26 |
| Verification | Pending |
| Reviewed | 2026-11-26 |

</details>

---
### <a id="f-111"></a>[✨ F-111](#top)

**Three behaviour scenarios for the 2026-11-26 slips: copied page named by a step, owner decision vs older record, primary checkout**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🔴 Large | 4.5 h | `coordinator:F-020-T06` | — | ⏳ | — | — |

💻 **→** Next: blocked by coordinator:F-020-T06 (the freeze); then from tasks.

| | |
|---|---|
| **Issue** | The coherence friction measurement (coordinator F-020-T03) found three real slips of 2026-11-26 that no behaviour scenario covers: a step named a copied harness page and the copy was forked without asking; an owner decision was contradicted by an older record that stayed unchanged; the primary checkout was edited or switched off `main`. Owner decision 2026-11-26, chat "F-020-T05 suggestions ok" (proposals 4 to 6): add the scenarios AFTER the freeze. They are test cases for rules that already exist: no rule, procedure or check is added. |
| **Reproduce** | Read the friction measurement: `docs/reviews/2026-11-coherence/friction.md` in the coordinator repository ([coordinator#117](https://github.com/voidbrain/coordinator/pull/117)). |
| **Check** | Three scenarios exist, each with a grader test, and each fails a run that repeats the slip and passes a run that follows the rule (F-111-T01 to T03). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-111-t01"></a>F-111-T01 — Scenario: a step names a copied harness page to edit | 1.5 h | 0 h | 1.5 h | Planned | `coordinator:F-020-T06` | — |
| 🟡 Medium | <a id="f-111-t02"></a>F-111-T02 — Scenario: an owner decision contradicts an older record | 1.5 h | 0 h | 1.5 h | Planned | `coordinator:F-020-T06` | — |
| 🟡 Medium | <a id="f-111-t03"></a>F-111-T03 — Scenario: the primary checkout is edited or switched off main | 1.5 h | 0 h | 1.5 h | Planned | `coordinator:F-020-T06` | — |
| 🔴 Large | **Total** | 4.5 h | 0 h (0 of 3 steps recorded) | 4.5 h | 0 of 3 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-111.md)

| Field | Value |
|---|---|
| PR / evidence | [coordinator#117](https://github.com/voidbrain/coordinator/pull/117); owner decision 2026-11-26, chat "F-020-T05 suggestions ok"; [#322](https://github.com/voidbrain/project-harness/pull/322) |
| Components | coordinator:F-020 |
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
### <a id="f-108"></a>[✨ F-108](#top)

**Template defaults from NERV: check:fast, test timing, guarded install, action pin check, source-size budget, SBOM for every stack, decision records**

| Status | Priority | Effort | Remaining | Depends on | Unlocks | Agent | Procedures | Decisions |
|---|---|---|---|---|---|:---:|:---:|:---:|
| 🔴 Open | 🔹 P3 | 🟣 Very large | 12.5 h | — | — | 🤖 | — | — |

💻 **→** Next: F-108-T01 — Action pin check in check:tooling (Planned).

| | |
|---|---|
| **Issue** | Five repositories wrote their own `check:fast` bundle (coordinator, grover, fpvbuddy, hobo, bricks); only nerv times tests per file (`tools/test-timing-reporter.mjs`), refuses `npm ci` through a symlinked `node_modules` (`tools/install-deps.mjs`), tests that every workflow action is pinned by SHA (`test/ci-pins.test.mjs`) and reports files over 600 lines. The SBOM step exists only in the `angular/` CI; coordinator and gauntlet-protocol have none. Decision records exist in four repositories with no shared place or shape: the template only says "add a decision record". Evidence: [NERV practices transfer report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md), inventory 3 to 9; class A items A3 to A9; missing practices M6 and M15. Owner decision 2026-11-26 in chat: "NERV practices inventory accept all" (all 22 proposals of the [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); this record is proposal 16). |
| **Reproduce** | Read `core/package-scripts.json` (no `check:fast`), `core/tools/` (no timing reporter, no install guard, no size report), `core/tools/check-tooling.mjs` (no pin check) and `core/docs/agents/architecture-review.md:18`. |
| **Check** | A default `check:fast` is assembled from the adopted checks and project lines extend it (F-108-T05); a timing reporter sits next to the quiet reporter (F-108-T03); a guarded `deps:install` is in the worktree procedure (F-108-T02); `check:tooling` fails on an action not pinned by SHA (F-108-T01); a warn-only source-size report takes its threshold from `.harness.json` (F-108-T04); the SBOM step is in the core CI guidance (F-108-T06); `docs/decisions/README.md` index and record shape ship (F-108-T07); one minor version ships them (F-108-T08). |

**Feature steps**

| Effort | Step | Estimate | Actual | Remaining | Status | Depends on | Unlocks |
|---|---|---|---|---|---|---|---|
| 🟡 Medium | <a id="f-108-t01"></a>F-108-T01 — Action pin check in check:tooling | 1.5 h | 0 h | 1.5 h | Planned | — | [F-108-T05](#f-108-t05) |
| 🟡 Medium | <a id="f-108-t02"></a>F-108-T02 — Guarded install in the worktree procedure | 1.5 h | 0 h | 1.5 h | Planned | — | [F-108-T05](#f-108-t05) |
| 🟡 Medium | <a id="f-108-t03"></a>F-108-T03 — Test timing reporter | 2 h | 0 h | 2 h | Planned | — | [F-108-T05](#f-108-t05) |
| 🟡 Medium | <a id="f-108-t04"></a>F-108-T04 — Source-size budget, warn-only | 1.5 h | 0 h | 1.5 h | Planned | — | [F-108-T05](#f-108-t05) |
| 🟢 Small | <a id="f-108-t06"></a>F-108-T06 — SBOM step for every stack | 1 h | 0 h | 1 h | Planned | — | [F-108-T08](#f-108-t08) |
| 🟡 Medium | <a id="f-108-t07"></a>F-108-T07 — Decision-record convention | 1.5 h | 0 h | 1.5 h | Planned | — | [F-108-T08](#f-108-t08) |
| 🟡 Medium | <a id="f-108-t05"></a>F-108-T05 — Default check:fast from the adopted checks | 2 h | 0 h | 2 h | Planned | [F-108-T01](#f-108-t01), [F-108-T02](#f-108-t02), [F-108-T03](#f-108-t03), [F-108-T04](#f-108-t04) | [F-108-T08](#f-108-t08) |
| 🟡 Medium | <a id="f-108-t08"></a>F-108-T08 — Release the template defaults | 1.5 h | 0 h | 1.5 h | Planned | [F-108-T05](#f-108-t05), [F-108-T06](#f-108-t06), [F-108-T07](#f-108-t07) | — |
| 🟣 Very large | **Total** | 12.5 h | 0 h (0 of 8 steps recorded) | 12.5 h | 0 of 8 completed | | |

<details>
<summary>Next action, estimates and evidence</summary>

[Full notes & evidence](work/records/F-108.md)

| Field | Value |
|---|---|
| PR / evidence | [report](https://github.com/voidbrain/coordinator/blob/main/docs/reviews/2026-11-26-nerv-practices-transfer.md); owner decision 2026-11-26; [#307](https://github.com/voidbrain/project-harness/pull/307) |
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
