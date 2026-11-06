# Project harness backlog

Current work ledger, reviewed 7 November 2026 against main `fdaee82` (PR #66 CI 42308464563, #67 CI 42310176675, #68 CI 42311372002 and #69 CI 42312513742 green; v3.3.0 in preparation). [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

## Bugs and reliability

None open.

## Features and improvements



### F-033

**Executable guards for the rules agents must never break**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟢 | 🔶 P2 | Verified | 🟡 Medium | ~100% |

💻 **→ Human action required: No**<br />Close when v3.3.0 is tagged.

| | |
|---|---|
| **Issue** | The never/ask-first rules (no push to `main`, no force-push or history rewrite, archives only grow, no deleting branches the agent did not create) are prose; only branch protection enforces any of them, and only on the server. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): skills and instructions are advisory, critical rules need hooks. |
| **Reproduce** | In a consumer, `git push origin HEAD:main` from a feature branch, or `git push --force`: nothing local stops it before GitHub does (and nothing at all on a repository without protection). |
| **Check** | One guard script (no dependency on any agent platform) refuses a push to the default branch, a force-push and a change that removes or edits a line of an archive already on the default branch, with the rule it enforces; installed as a git `pre-push` hook by an opt-in setup step; an optional adapter runs the same script as a Claude Code `PreToolUse` hook (exit code 2), so other agents and plain git get the same rule; `check:harness` reports whether the guard is installed; tests cover each refusal and an allowed push. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implemented 2026-11-07: `core/tools/guard.mjs` (copied; Node and git only) refuses a push to the default branch, a force-push (a remote branch rewound or replaced; deleting another branch stays allowed), a published tag moved or deleted, and a push whose archives drop or change a line that was on the default branch where the branch left it, each citing its AGENTS or BACKLOG-RULES rule. It is installed opt-in as the git pre-push hook (`guard:install`, never replacing another hook); the optional Claude Code PreToolUse adapter (`guard.mjs claude`, exit code 2) refuses forced or default-branch `git push` commands and Edit/MultiEdit/Write calls that remove an archive line. Owner-approved exceptions run with `HARNESS_GUARD_ALLOW=<rule>`. `check-harness` reports an adopted guard not installed in the clone. AGENTS (both) carry one line that cites the rules; APPLY has the setup step and the adapter snippet; README and CHANGELOG list it. `tools/test-guard.mjs` covers each refusal, the allowed pushes, the exception, a branch older than main, the adapter and the check-harness report, a remote not named origin, quoted (`bash -c`, `eval`) and implicit (`git push` on main) pushes and recap edits. Verify on the merged PR's green CI; close when v3.3.0 is tagged. Not installed in this clone: installing is the owner's choice.

**Estimates:** Small effort left; ~100% complete. Reassessed 2026-11-07: verified on the merged PR's green CI; only the release tag remains, then closure.

| Field | Value |
|---|---|
| PR / evidence | [#67](https://github.com/voidbrain/project-harness/pull/67); owner decision 2026-11-05 ([#60](https://github.com/voidbrain/project-harness/pull/60) records). Review: code-review skill (medium, forked context) 2026-11-07, 9 findings: 8 fixed in the PR (hand-installed hook recognised, implicit and quoted pushes, published tags, the remote git names, recap edits, cached archive reads, one status check shared with check-harness); 1 answered (defaultBranch is an existing optional setting the other tools read, documented in README; not added to the core stamp) |
| Opened | 2026-11-05 |
| Verification | Script · 2026-11-07 · [#67](https://github.com/voidbrain/project-harness/pull/67) merged on green [CI 42310176675](https://github.com/voidbrain/project-harness/actions/runs/42310176675) (check:template, test:tools, check:backlog, maintenance) |
| Reviewed | 2026-11-07 |

</details>

---

### F-034

**A bug fix starts with a committed failing test**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟢 | 🔶 P2 | Verified | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />Close when v3.3.0 is tagged.

| | |
|---|---|
| **Issue** | B- records have a Reproduce field, but nothing asks that it becomes a test before the fix. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): commit the failing test first, then fix without editing it. NERV #96 did this (the test failed without the fix) and it pinned a race no review had found. |
| **Reproduce** | Close a B- record whose PR changes code but adds no test: nothing objects. |
| **Check** | BACKLOG-RULES says a B- fix commits a test that fails without the fix (or records why none can, e.g. a visual or device-only defect, with the manual check instead); the record names the test; `check:backlog` warns on a Verified or Closed B- record that names no test and no reason; template fixtures cover both. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implemented 2026-11-06: BACKLOG-RULES (template and this repository) has "A bug fix starts with a failing test" (test committed first, not edited by the fix; `Test: …` or `No test: …` on the record); both AGENTS files point to it; `check:backlog` warns on a Verified or Closed B- record with neither, only for a record a branch makes done (older done records are not flagged), as an escaped GitHub annotation in CI. A fixture covers the warning, both accepted forms and the annotation; it failed before the check existed. Verify on the merged PR's green CI; close when v3.3.0 is tagged. Optional later: a guard (F-033) that refuses edits to that test file during the fix commits.

**Estimates:** Small effort left; ~100% complete. Reassessed 2026-11-07: verified on the merged PR's green CI; only the release tag remains, then closure.

| Field | Value |
|---|---|
| PR / evidence | [#66](https://github.com/voidbrain/project-harness/pull/66); owner decision 2026-11-05 ([#60](https://github.com/voidbrain/project-harness/pull/60) records). Review: code-review skill (medium, forked context) 2026-11-06, 8 findings, all fixed in the PR (evidence matching, grandfathered done records, annotation escaping, APPLY step, wording) |
| Opened | 2026-11-05 |
| Verification | Script · 2026-11-07 · [#66](https://github.com/voidbrain/project-harness/pull/66) merged on green [CI 42308464563](https://github.com/voidbrain/project-harness/actions/runs/42308464563) (check:template, test:tools, check:backlog, maintenance) |
| Reviewed | 2026-11-07 |

</details>

---

### F-035

**A small set of agent-behaviour checks, rerun when the rules change**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟢 | 🔹 P3 | Verified | 🔴 Large | ~100% |

💻 **→ Human action required: No**<br />Close when v3.3.0 is tagged.

| | |
|---|---|
| **Issue** | Tools check records and files, not whether an agent following AGENTS.md behaves as intended (asks before a 🧑 decision, names the PR instead of "this PR", files a bug as B-, keeps unrelated code, reports a failing test honestly). Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21) recommends 20–50 cases rerun whenever CLAUDE.md, skills or hooks change; start with about ten. |
| **Reproduce** | Change a rule in core/AGENTS.md; nothing tells whether agents still follow the old and new rules. |
| **Check** | About ten scenarios, each a fixture repository, a task and a grader that reads the result (files, records, commits, refusals) without a model; runnable on demand and when core/AGENTS.md, BACKLOG-RULES or skills change, never on every PR by default (cost); each scenario run several times, results compared per scenario, not only as a total; a finding from an audit or a real mistake can be added as a scenario. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implemented 2026-11-07: copied tool `core/tools/behaviour.mjs` with ten scenarios (ask before a 🧑 decision, name the PR, a bug is a B- record, keep unrelated code, report a failing test, no push to main, archives only grow, failing test first, a plan becomes a record, copied tool untouched). Each builds a fixture repository from the project's own rule files (`behaviour.rules`; here the template's core files, placeholders neutralised), a tiny Node project and a bare remote, and grades the result without a model. `list`, `prepare`, `grade` and `run` (`--scenarios`, `--times`, `--runner`, `--keep`, `--json`); `run` reports passes per scenario, never only a total. The runner is the project's choice (`behaviour.runner`); the template names none, and this repository sets none (choosing an agent and its permissions for a throwaway fixture is the owner's call). A runner that fails to start, exits non-zero or times out (`behaviour.timeoutMs`; its whole process group is stopped) is a failed run, never graded. Rerun on demand and when the rule files the fixture copies change: an impact-map row here, an AGENTS trigger row, the procedure in the maintenance guide; never in PR CI by default. `tools/test-behaviour.mjs` checks every grader passes a rule-following example and fails a typical mistake (`tools/behaviour-examples.mjs`), and `run` with a scripted runner (14 tests). No real agent run is claimed. Verify on the merged PR's green CI; close when v3.3.0 is tagged.

**Estimates:** Effort left small; ~100% complete. Reassessed 2026-11-07: verified on the merged PR's green CI; only the release tag remains, then closure.

| Field | Value |
|---|---|
| PR / evidence | [#69](https://github.com/voidbrain/project-harness/pull/69); owner decision 2026-11-05 ([#60](https://github.com/voidbrain/project-harness/pull/60) records). Review: code-review skill (medium, forked context) 2026-11-07, 10 findings, all fixed in the PR (a runner that fails, exits non-zero or times out is a failed run and its process group is stopped; one run's crash no longer ends the report; agent code runs in a child process; the failing-test grader accepts any JS test and keeps new helpers; stricter claims and archive lines; the impact row follows the files the fixture copies; one git helper; receipt refreshed last) |
| Opened | 2026-11-05 |
| Verification | Script · 2026-11-07 · [#69](https://github.com/voidbrain/project-harness/pull/69) merged on green [CI 42312513742](https://github.com/voidbrain/project-harness/actions/runs/42312513742) (check:template, test:tools, check:rules, check:backlog, maintenance) |
| Reviewed | 2026-11-07 |

</details>

---

### F-036

**Independent review for P1 and harness changes**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟢 | 🔹 P3 | Verified | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />Close when v3.3.0 is tagged.

| | |
|---|---|
| **Issue** | The agent that wrote a change also certifies it. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): a separate reviewer pass (bugs, security, compliance with the record), which can never approve or merge. |
| **Reproduce** | Open a P1 fix or a harness-file change: no second look is required before merge. |
| **Check** | AGENTS/BACKLOG-RULES: a PR that closes a P1 record or changes a harness file gets a review in a fresh context (a review skill or a separate session), its findings fixed or answered in the PR; the record cites it; the reviewer never approves or merges; small and documentation-only changes are exempt. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implemented 2026-11-06: BACKLOG-RULES (template and this repository) has "Independent review" (a fresh-context review of a PR that closes a P1 record or changes a harness file; `Review: …` or `No review: …` on the record; the reviewer never approves or merges; documentation-only and small changes exempt); both AGENTS files point to it; `check:backlog` warns on a P1 record made done with neither, and `check:freshness` reminds a branch that changes harness files. Shares F-034's fixture. Verify on the merged PR's green CI; close when v3.3.0 is tagged.

**Estimates:** Small effort left; ~100% complete. Reassessed 2026-11-07: verified on the merged PR's green CI; only the release tag remains, then closure.

| Field | Value |
|---|---|
| PR / evidence | [#66](https://github.com/voidbrain/project-harness/pull/66); owner decision 2026-11-05 ([#60](https://github.com/voidbrain/project-harness/pull/60) records). Review: code-review skill (medium, forked context) 2026-11-06, 8 findings, all fixed in the PR (evidence matching, grandfathered done records, annotation escaping, APPLY step, wording) |
| Opened | 2026-11-05 |
| Verification | Script · 2026-11-07 · [#66](https://github.com/voidbrain/project-harness/pull/66) merged on green [CI 42308464563](https://github.com/voidbrain/project-harness/actions/runs/42308464563) (check:template, test:tools, check:backlog, maintenance) |
| Reviewed | 2026-11-07 |

</details>

---

### F-037

**Safety rules always loaded; procedures loaded when needed**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟢 | 🔶 P2 | Verified | 🟡 Medium | ~100% |

💻 **→ Human action required: No**<br />Close when v3.3.0 is tagged.

| | |
|---|---|
| **Issue** | Owner decision 2026-11-05: keep the safety rules always loaded and let procedures load when needed. Today AGENTS.md carries both, so every session loads every procedure (Anthropic, *When to fold subagents into your main agent loop* (2026-10-22): progressive disclosure; the playbook: CLAUDE.md under a page). The rule "all applicable rules must be known and followed from the start; shorter indexes never defer requirements" stays: what moves out is how to do a task, never what is allowed. |
| **Reproduce** | Count the lines of core/AGENTS.md a session loads before its first task. |
| **Check** | AGENTS.md keeps every never/ask-first rule, the checks before finishing and a one-line trigger per procedure ("before X, read Y"); procedures (reconciling, audits, maintenance review, impact map, releasing) live in their docs; a check fails if a never/ask-first rule exists only in a procedure document; APPLY.md reconciles consumers without losing project lines; consumers keep their `<!-- project -->` lines. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implemented 2026-11-07: core/AGENTS.md (134 → 115 lines) and this repository's AGENTS.md (103 → 91) keep the never and ask-first rules in a `<!-- safety:start -->`/`<!-- safety:end -->` block, the checks before finishing and a "Procedures: read before the task" table with one trigger per procedure. Moved out unchanged in substance: code coverage to the new copied guide `docs/agents/coverage-guide.md`, the impact map to `docs/agents/change-impact.md`, and the capability, MCP, solution, skills, maintenance and audit paragraphs to an "In short" section of their guides (a script checked that this repository's paragraphs equalled the template's before moving them). "All applicable rules must be known and followed from the start", the safeguard never-rule and the session-start inspection of `.harness.json` stay in AGENTS; the moved guides are maintenance inputs. New copied tool `check-rules.mjs` (`check:rules`, CI here and in the Angular workflow; `check:template` runs it on `core/`) fails on a missing safety block, an ask-first or never rule that only a procedure holds, and an AGENTS link that leads nowhere; warns past `rules.maxLines`. APPLY (3.3.0) says how consumers move sections and keep `<!-- project -->` lines. `tools/test-rules.mjs` covers each case. Verify on the merged PR's green CI; close when v3.3.0 is tagged. F-035 can now test this layout.

**Estimates:** Effort left small; ~100% complete. Reassessed 2026-11-07: verified on the merged PR's green CI; only the release tag remains, then closure.

| Field | Value |
|---|---|
| PR / evidence | [#68](https://github.com/voidbrain/project-harness/pull/68); owner decision 2026-11-05 ([#60](https://github.com/voidbrain/project-harness/pull/60) records). Review: code-review skill (medium, forked context) 2026-11-07, 10 findings, all fixed in the PR (the safeguard never-rule and the session-start inspection stay in AGENTS; moved guides are maintenance inputs; check-rules matches labels mid-paragraph, whole sentences and real citations, root globs; no link to a generated page; this repository does not copy the coverage guide it has no use for; receipt refreshed last) |
| Opened | 2026-11-05 |
| Verification | Script · 2026-11-07 · [#68](https://github.com/voidbrain/project-harness/pull/68) merged on green [CI 42311372002](https://github.com/voidbrain/project-harness/actions/runs/42311372002) (check:template, test:tools, check:rules, check:backlog, maintenance) |
| Reviewed | 2026-11-07 |

</details>

---

### F-032

**Optional browser and combined coverage contracts**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔹 P3 | Implemented | 🔴 Large | ~90% |

💻 **→ Human action required: No**<br />Verify on the PR's green CI, then close on the v3.3.0 tag.

| | |
|---|---|
| **Issue** | Accepted optional template capability was planned only in OpenBando F-039; reusable contracts and helpers belong here. |
| **Reproduce** | Compare the current unit-only coverage helper with the accepted browser/combined coverage request. |
| **Check** | Unconfigured projects keep current output; configured fixtures collect Chromium coverage, map source files, merge unit/browser coverage and report separate/combined figures without double counting. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implemented 2026-11-07: copied tool `core/tools/browser-coverage.mjs`. Contracts: `coverage.browser` { raw, summary } (raw: Playwright `stopJSCoverage()` entries with their source maps) and `coverage.combined` { summary } with the unit LCOV (`coverage.lcov`). A Playwright collector (`startBrowserCoverage`, `stopBrowserCoverage`; Chromium only, and it says so for other browsers) saves V8 coverage and fetches external source maps; the tool decodes source maps, maps V8 block counts to original lines under `coverage.folders`, counts a script seen in several runs as one file, lists unmatched sources and unmapped scripts instead of guessing, and writes browser and combined summaries (a line covered when either ran it, counted once). `coverage-table.mjs` prints, writes and checks a browser and a combined table with their own baseline keys (`browser:`/`combined:`) and the same drop rule; a configured summary that is missing is reported and fails under enforce; unconfigured output is unchanged (existing fixtures). Coverage guide, README, APPLY and CHANGELOG describe it. `tools/test-browser-coverage.mjs` (7 tests): mapping, block counts, duplicates, mismatches, missing artifacts and LCOV, combined count, tables and baselines, a drop and enforcement, adoption under enforce and a removed setting, source matching rules, LCOV through a symlink, and the collector against a fake Playwright page. A real Chromium run is not part of the fixtures (no browser dependency here). Verify on the merged PR's green CI; close when v3.3.0 is tagged. OpenBando F-039 owns its own integration.

**Estimates:** Large effort originally; ~90% complete. Reassessed 2026-11-07: contract, collector, conversion, merge, table and fixtures done; CI verification and the release tag remain.

| Field | Value |
|---|---|
| PR / evidence | [#70](https://github.com/voidbrain/project-harness/pull/70); [OpenBando F-039](https://github.com/voidbrain/openbando/blob/main/docs/BACKLOG.md#f-039); [#59](https://github.com/voidbrain/project-harness/pull/59) records ownership. Review: code-review skill (medium, forked context) 2026-11-07, 10 findings, all fixed in the PR (enforce adoption and removed settings; LCOV through symlinks; sourceRoot joining; no bare-name suffix match; bundler and virtual sources; combined on the unit run's executable lines; one run file per call without sourcesContent; one raw file in memory at a time and each map decoded once; coverage.folders required; receipt refreshed last) |
| Opened | 2026-10-31 |
| Verification | Script · 2026-11-07 · local `test:tools` (109, including 7 browser-coverage tests) passed; CI pending |
| Reviewed | 2026-11-07 |

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
