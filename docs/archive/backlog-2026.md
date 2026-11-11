# Closed backlog — 2026

Closed records, moved from the [active backlog](../BACKLOG.md) with their full history. Dated evidence, not current status.

One file per year; records follow their closing date, under a heading per day.

<!-- archive-recap:start -->
## Weekly closure recaps

Closed records in this archive, grouped by closing date (Monday–Sunday). Links open the first section for that week; current status stays in the active backlog.

| Closing week | Features closed | Bugs closed |
|---|---:|---:|
| [2026-11-09 – 2026-11-15](#archive-week-2026-11-09) | 22 | 3 |
| [2026-11-02 – 2026-11-08](#archive-week-2026-11-02) | 16 | 1 |
| [2026-10-26 – 2026-11-01](#archive-week-2026-10-26) | 19 | 7 |
<!-- archive-recap:end -->

<a id="archive-week-2026-10-26"></a>
## Closed 2026-10-29

### F-001

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-001 | ◻️ P2 | Closed | Online first, and the template follows its own harness (1.2.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Release 1.2.0 (CHANGELOG): `check-harness` warns about an unreachable, behind, ahead, dirty, remote-less or missing template clone; APPLY.md step 0, the AGENTS template and the `apply-harness` skill pull the published template first; this repository gets its own AGENTS, area notes, backlog and rules, style guide, audits, `.harness.json`, scripts, `CI` workflow and `check-template`. Next: PR, CI green, merge, `git tag -a v1.2.0`, push the tag. Closed 2026-10-29: [#1](https://github.com/voidbrain/project-harness/pull/1) merged with a green `check` ([run 40868809685](https://github.com/voidbrain/project-harness/actions/runs/40868809685)), `v1.2.0` tagged on `main` and pushed; `check:freshness` reports "Harness: on template v1.2.0".

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#1](https://github.com/voidbrain/project-harness/pull/1) |
| Opened | 2026-10-29 |
| Verification | Script: `check:template`, `check:backlog`, `check:freshness` locally, 2026-10-29. CI `check`: success on #1, 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

<a id="archive-week-2026-11-09"></a>
## Closed 2026-11-11

### F-048

**Measured development usage and operational effectiveness by task**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; subscription allowance, export and calibration support is published.

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
| F-048-T04 — Collect Codex and Claude subscription allowance snapshots | 🟢 Small — 0 implementation remaining; release acceptance is T06<br />2026-11-11: Codex live read and neutral Claude fixtures complete. Claude live coverage remains optional and unobserved until the owner configures a status line and a response exposes rate&#95;limits. | Completed |
| F-048-T05 — Export reports and calibrate comparable work estimates | 🟢 Small — 0 implementation remaining; release acceptance is T06<br />2026-11-11: Private export and conservative calibration are implemented; no automatic estimate or monetary conversion is introduced. | Completed |
| F-048-T06 — Verify and publish subscription usage support | 🟢 Small — 0 remaining<br />2026-11-11: PR101 exact head f298cfe / CI42924669121 passed and merged as 490e235; annotated v4.8.0 tag resolves to that merge. | Completed |

<details>
<summary>Next action, estimates and evidence</summary>

**Reopened 2026-11-10:** The earlier T01–T03 scope remains closed and published in v4.4.0–v4.7.0; its immutable closure appears earlier in this archive. Owner requested Codex and Claude Pro allowance collection, saved report output and use of measured history to improve future estimates. This is new optional harness-wide work, not evidence that historic token or quota counters exist.

**Safety and interpretation:** Account allowance observations are shared rolling-window metadata. A same-window percentage increase near a job is a qualified account-level change, not proof that the job caused it. Reset changes, decreases, missing observations and concurrent jobs break attribution. Subscription quota is not token count or currency; explicit API price observations and fixed-plan charges remain distinct. Reports inform human planning and never rewrite backlog estimates, priorities or budgets automatically.

**Feature steps:** T04 collects and validates provider snapshots; T05 adds private export and comparable-work calibration; T06 verifies, independently reviews and publishes optional v4.8.0. Steps may split only with owner agreement if discovery reveals a distinct outcome. Completed T01–T03 remain recorded earlier in this archive and the task catalogue.

**Implementation 2026-11-11:** T04 and T05 are implemented in `ebcfd08`, with fresh-context review fixes in `72c2396` and the filtered-overlap fix following committed regression `535becf`. Twenty-five focused fixtures pass for provider normalization, Claude field confinement, replay/coalescing, child cleanup, stable source/window/reset boundaries, filtered overlap, successful-job calibration and private output. One live installed Codex app-server read produced four private buckets without a model call; no counter or account value is committed. A byte-identical mode-0600 report snapshot was saved outside the checkout. Claude live coverage remains unobserved because existing settings had no status line; [source review](../reviews/2026-11-11-subscription-allowance-sources.md) retains that limit.

**Next action / closure evidence:** Closed 2026-11-11. Fresh-context review first found four collector/calibration blockers; committed failing regressions precede every fix, and exact-head recheck `e4c983e` found no blocker. PR #101 exact head `f298cfe` / CI 42924669121 passed all 176 fixtures/check, merged as `490e235`, and annotated tag v4.8.0 resolves to that merge. Consumer adoption and optional Claude settings are independently owned and do not gate this harness release.

**Estimates:** Small remaining effort: zero; published 2026-11-11. Initial 2–3 day estimates for T04/T05 and 2–4 hours for T06 remain in Git; Claude live coverage is optional and not inferred from fixtures.

| Field | Value |
|---|---|
| Queue order | 1 — Owner-selected harness work, 2026-11-10 |
| PR / evidence | [PR #101](https://github.com/voidbrain/project-harness/pull/101) merged `490e235`; CI 42924669121; v4.8.0 published; planning commit `efd2b94`; prior closure and releases appear earlier in this archive. |
| Opened | 2026-11-09 |
| Verification | 2026-11-11: 25 focused fixtures and live read/export acceptance pass. Fresh-context review found lifecycle/calibration blockers; committed regressions cover every fix and exact-head recheck found no blocker. PR101 exact head `f298cfe` / CI42924669121 passed 176 fixtures/check; v4.8.0 is published. |
| Reviewed | 2026-11-11 |
| Closed | 2026-11-11 |

</details>

---

### F-003

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-003 | ◻️ P2 | Closed | Reconcile marginalia-wars and OpenBando with 1.2.0 |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Both projects reconciled from 1.1.1 at session start, as their `check:freshness` listed (copy `check-harness.mjs`, reconcile the AGENTS Work-tracking bullet, `version` 1.2.0): [marginalia-wars#10](https://github.com/voidbrain/marginalia-wars/pull/10) merged (`check` success; `e2e` failed only on its known B-008 spec); [openbando#196](https://github.com/voidbrain/openbando/pull/196) open with auto-merge on its required checks. Closes when #196 merges. Closed 2026-10-29: openbando#196 auto-merged as `be3e9103` after its required checks (`check`, `e2e (1–4)`, `race-browser`) passed; both projects report "Harness: on template v1.2.0".

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [marginalia-wars#10](https://github.com/voidbrain/marginalia-wars/pull/10), [openbando#196](https://github.com/voidbrain/openbando/pull/196) |
| Opened | 2026-10-29 |
| Verification | Script: both projects' `check:freshness` report "Harness: on template v1.2.0", 2026-10-29. CI: marginalia-wars#10 `check` success; openbando#196 all required checks success, merged 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

### F-004

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-004 | ◻️ P2 | Closed | Changing the harness from a project (1.3.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Asked 2026-10-29: what happens when a request in a harnessed project implies a harness change. Only copied tools were covered ("never edited here", "differs" at the next session); nothing said when a rule is general or in which order template and project change. Release 1.3.0 adds APPLY.md "Changing the harness from a project" (where a change belongs; template first, then reconcile; what to do when the release cannot land in the session), a Work-tracking bullet in the AGENTS template, an "Adding things" line here, and step 4 of the `apply-harness` skill. Closes when `v1.3.0` is tagged and both projects report "Harness: on template v1.3.0". Closed 2026-10-29: #3 merged by auto-merge after a green `check` ([run 40882174769](https://github.com/voidbrain/project-harness/actions/runs/40882174769)), `v1.3.0` tagged; [marginalia-wars#11](https://github.com/voidbrain/marginalia-wars/pull/11) and [openbando#197](https://github.com/voidbrain/openbando/pull/197) merged and report "Harness: on template v1.3.0".

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#3](https://github.com/voidbrain/project-harness/pull/3) |
| Opened | 2026-10-29 |
| Verification | CI `check`: success on #3; both projects' `check:freshness` on v1.3.0, 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

### F-005

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-005 | ◻️ P2 | Closed | Project overrides: marked rules and forked tools (1.4.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Asked 2026-10-29: change a harness setting, behaviour or rule for one project only, like a fork that still receives releases and surfaces conflicts. Release 1.4.0: APPLY.md "Project overrides" (setting first; a `> Project override` line in an adapted file, counted by `check-harness` when the template source changes; a copied tool listed under `forked` with source, base and reason, three-way merged with each release, `--merge` to write it). Tried in a scratch copy of marginalia-wars with `check-freshness.mjs` forked from v1.0.0: a non-overlapping edit (audit age 14) merged cleanly and gained the template's harness hook, base moved to 1.3.0, then quiet; an edit to the first line conflicted with markers and the base stayed; a missing reason and an unknown base were reported; an override line was counted. Closes when `v1.4.0` is tagged and both projects report "Harness: on template v1.4.0". Closed 2026-10-29: #4 merged by auto-merge on a green `check`, `v1.4.0` tagged; [marginalia-wars#12](https://github.com/voidbrain/marginalia-wars/pull/12) and [openbando#198](https://github.com/voidbrain/openbando/pull/198) merged and report "Harness: on template v1.4.0".

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#4](https://github.com/voidbrain/project-harness/pull/4) |
| Opened | 2026-10-29 |
| Verification | Script: scratch fork tests above, `check:template`, `check:backlog`, 2026-10-29. CI `check`: success on #4, 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

### B-001

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | B-001 | ◻️ P1 | Closed | Archived records lost by a rewrite; archives now only grow (1.6.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Found 2026-10-29 while reconciling marginalia-wars with 1.5.0: the agent's archiving scripts opened the archive for writing before reading it (`open(p,'w').write(open(p).read() + …)`), so each archiving replaced the file with only the new records. Lost on `main`: here F-001 and F-003 (in #3's 1.4.0 PR) and F-004 (in #5); in marginalia-wars F-005, B-005, F-007 and F-008 (in its #12). OpenBando's archives only ever grew (checked across their history). Restored from git history: every committed version of the archive, each record's latest text, in archiving order. Guard: `check-backlog` fails when a record or closed row an archive has on the published default branch is missing locally; a fixture test covers it and fails on the 1.5.0 tool. Closes when `v1.6.0` is tagged and both projects report it, with their archives restored. Closed 2026-10-29: #6 merged on a green `check`, `v1.6.0` tagged; [marginalia-wars#13](https://github.com/voidbrain/marginalia-wars/pull/13) and [openbando#199](https://github.com/voidbrain/openbando/pull/199) merged with their archives restored and report 1.6.0. The guard's gaps found afterwards (an emptied record passed) are B-002.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#6](https://github.com/voidbrain/project-harness/pull/6) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 15/15 (the guard test fails on the 1.5.0 tool), archives rebuilt and diffed against `main` (insertions only), 2026-10-29. CI `check`: success on #6 (`test:tools` 15/15 on Linux); `v1.6.0` tagged |
| Reviewed | 2026-10-29 |

</details>

---

### F-006

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-006 | ◻️ P2 | Closed | Review follow-ups: proven tools, lighter defaults (1.5.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** An outside review (2026-10-29) found, and the code confirmed: a test rule that invites changing tests to match regressions; `check-freshness` scanning `HEAD` (blind to PRs merged on GitHub while the local branch is behind) and only merge commits; `main` hard-coded; a fixed 7-day audit; `.pathname` paths; heuristic convention results presented as exact; no behavioural tests. The owner declined its task-size tiers (harness work keeps its order). Release 1.5.0 fixes each and adds `tools/test-tools.mjs`: 14 fixture tests, of which 12 fail against the 1.4.0 tools. The new tools give the same output as the old ones in marginalia-wars and OpenBando, except the new `check-conventions` wording. Closes when `v1.5.0` is tagged and both projects report "Harness: on template v1.5.0". Closed 2026-10-29: both projects reconciled to 1.5.0 and 1.6.0 together in [marginalia-wars#13](https://github.com/voidbrain/marginalia-wars/pull/13) and [openbando#199](https://github.com/voidbrain/openbando/pull/199), both merged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#5](https://github.com/voidbrain/project-harness/pull/5) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 14/14 (12/14 fail on 1.4.0 tools), `check:template`, `check:backlog`, before/after output in both projects, 2026-10-29. CI `check`: success on #5 (`test:tools` 14/14 on Linux); `v1.5.0` tagged |
| Reviewed | 2026-10-29 |

</details>

---

### B-002

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | B-002 | ◻️ P2 | Closed | Guards that claimed more than they checked: archive lines, unfetched remote, commits without a PR (1.7.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** A second outside review (2026-10-29) reproduced three gaps, all confirmed in the code: `check-backlog` compared only archived IDs and closed-row counts, so an emptied record or a replaced row passed while it printed "keep everything"; `check-freshness` ignored a failed fetch and could print "Fresh" from stale refs; it found changes only through `Merge pull request #N` or `(#N)` in the message, so a rebase merge or direct push was skipped silently. Release 1.7.0: every published archive line must still be there, in order (corrections are dated notes); a failed fetch is a warning; every first-parent commit that changes more than records is listed, with its PR from the message or `gh`, else by hash. Closed 2026-10-29: #7 merged on a green `check`, `v1.7.0` tagged. Reconciling each project is that project's own work, tracked in its backlog; the tools were tried in both before release (Verification).

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#7](https://github.com/voidbrain/project-harness/pull/7) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 17/17 (the three new behaviours fail on the 1.6.0 tools); the new tools in marginalia-wars and OpenBando pass their archives and find exactly #13 and #199, 2026-10-29. CI: [#7 check success](https://github.com/voidbrain/project-harness/actions/runs/40914058081), 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

### F-007

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-007 | ◻️ P2 | Closed | One repository, one backlog: records never wait for another repository (1.8.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Found 2026-10-29 by the owner while refreshing the backlog after #7: B-002 waited for marginalia-wars to reconcile, a step only that project can take (B-001 and F-006 did the same). Release 1.8.0 adds "One repository, one backlog" to BACKLOG-RULES (template and this copy): a backlog tracks its own repository's work, a record may wait upstream but never downstream, outside evidence goes in Verification. Also APPLY.md (a project records its reconcile), AGENTS (Releasing: the record closes on the tag), README, area notes. F-002's closure no longer waits on a project. Closes when `v1.8.0` is tagged. Closed 2026-10-29: #8 merged on a green `check`, `v1.8.0` tagged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#8](https://github.com/voidbrain/project-harness/pull/8) |
| Opened | 2026-10-29 |
| Verification | Documentation: `check:template`, `check:backlog`, 2026-10-29. CI: [#8 check success](https://github.com/voidbrain/project-harness/actions/runs/40926404724), 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

### F-002

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-002 | 🔹 P3 | Closed | Template check in project CI (1.9.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** `check-harness` ran at session start on a developer machine; in project CI there was no template clone, so it was skipped and a project that fell behind a release was only noticed locally. Decided 2026-10-29: the owner made the repository public, so CI can `git clone` it without a token. Release 1.9.0: the Angular `CI` workflow clones `template.repo` into the runner's temp folder and runs `check:freshness -- --github` with `HARNESS_HOME` on it; a failed clone is a warning. No tool logic changed (comments in `check-harness`). Closes when `v1.9.0` is tagged. Closed 2026-10-29: #10 merged on a green `check`, `v1.9.0` tagged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#10](https://github.com/voidbrain/project-harness/pull/10) |
| Opened | 2026-10-29 |
| Verification | Project trial: marginalia-wars (on 1.6.0) run as the CI step runs it (fresh public clone, `CI=true`, `--github`): `::warning` lines for each file to update and "v1.8.0 is out (this project is on v1.6.0)", exit 0; without a clone, skipped quietly, 2026-10-29. CI: [#10 check success](https://github.com/voidbrain/project-harness/actions/runs/40927859578), 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

### F-009

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-009 | ◻️ P2 | Closed | Project or template: decided at the edit, asked when unsure; PR rules for every project (1.10.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Found 2026-10-29 in openbando: the owner allowed a conflict-only push to a green PR and the agent wrote it into that project's AGENTS as a project rule, although it holds for every project (beside "Open every PR against `main`"), and the owner had said to ask when unsure. Causes: the rule's trigger was "a request that adds a rule" (an "allow X" did not look like one), it sat at the end of Work tracking, "ask" was only in APPLY.md, no check noticed a PR changing harness files, and adapted files did not show which lines are the project's. Release 1.10.0 (decided with the owner): core AGENTS "Changing a harness file" (the edit is the trigger; unsure: ask before editing), `check-freshness` lists the harness files a branch changes (warning, never blocks; project-content files and the template repository excluded), `<!-- project -->` marks for project lines in template sections (APPLY), the PR rules (no stacked PRs, no new work on a green PR, conflict-only pushes allowed) in core AGENTS and here, BACKLOG-RULES on parallel PRs' backlog conflicts. The owner's local apply-harness skill carries the same rule. Closes when `v1.10.0` is tagged. Closed 2026-10-29: #12 merged on a green `check`, `v1.10.0` tagged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#12](https://github.com/voidbrain/project-harness/pull/12) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 18/18 (a new case: a branch changing AGENTS is listed with the question, README and backlog records are not, never fails), 2026-10-29. Documentation: `check:template`, `check:backlog` |
| Reviewed | 2026-10-29 |

</details>

---

### F-010

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-010 | ◻️ P2 | Closed | Impact map: what must follow a change, reminded on every PR (1.11.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Requested 2026-10-29 from openbando (decided with the owner: a template feature, each project fills its rows). BACKLOG-RULES' consistency rule ("for every modification, check README, AGENTS…") names no derived things, so updates depended on memory: a fence label in TypeScript data had no translation, and clips, guide pages and tips had no record of what they follow. Release 1.11.0: `impact` rows in `.harness.json` (`when` globs, `then`, `run`, `checked`); `check-freshness` lists the rows a branch triggers (warning, never fails; "nothing checks it" when a row has no check); core AGENTS "What follows a change"; BACKLOG-RULES points to the map; APPLY asks for the rows when applying; this repository's own stamp has two rows (core tools copied to tools/, a CHANGELOG step for core and stack changes). Closes when `v1.11.0` is tagged. Closed 2026-10-29: #14 merged on a green `check`, `v1.11.0` tagged on its merge. A first `v1.11.0` tag had been pushed by mistake on the 1.10.0 commit (the merge had not happened yet, the tagging step did not check it) and was deleted within a minute; the release tag is the second one.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#14](https://github.com/voidbrain/project-harness/pull/14) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 19/19 (a new case: rows fire on matching changed files with their command and check, a non-matching row stays quiet, never fails), 2026-10-29. Documentation: `check:template`, `check:backlog` |
| Reviewed | 2026-10-29 |

</details>

---

### F-011

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-011 | ◻️ P2 | Closed | Impact chains, the map as a page, complete rows; plans become records (1.12.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Requested 2026-10-29 from openbando: a change sets off others that must be re-executed in turn ("changes this impact that, requires re-executing this and that"), which flat rows could not say; and a full impact table promised to the owner had not been written down, because the plan lived only in the conversation. Release 1.12.0: `id` / `after` chains, `tools/impact-map.mjs` (run order for `check-freshness`, the map as `docs/agents/impact-map.md`, a CI step keeps it equal), complete and fine-grained rows (AGENTS, APPLY), and plans or promises become backlog records in the same change (AGENTS, BACKLOG-RULES). This repository's own map gains ids and a chain. Closes when `v1.12.0` is tagged. Closed 2026-10-29: #16 merged on a green `check`, `v1.12.0` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#16](https://github.com/voidbrain/project-harness/pull/16) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 20/20 (chains in run order, the page with its chains), 2026-10-29. Documentation: `check:template`, `check:backlog` |
| Reviewed | 2026-10-29 |

</details>

---

### F-012

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-012 | ◻️ P2 | Closed | Inputs, wide-reach settings and value couplings in the impact map; audits look outside (1.13.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Requested 2026-10-29 from openbando (decided with the owner: a template rule). Dependencies a path trigger alone misses: a film records an example bando (data, not code), one theme colour reaches every visual output, a mascot timing is copied from three films (a value coupling), and renderer upgrades or external services change outputs without a change here. Release 1.13.0: rows watch the data an output loads and wide-reach settings get their own chained row; a value used in two places has one source or a relation test and a row; audits include upgrades, the CI machine and external services. Closes when `v1.13.0` is tagged. Closed 2026-10-29: #18 merged on a green `check`, `v1.13.0` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#18](https://github.com/voidbrain/project-harness/pull/18) |
| Opened | 2026-10-29 |
| Verification | Documentation: `check:template`, `check:backlog`, 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

### F-013

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-013 | ◻️ P2 | Closed | Readable content dependencies, value couplings and outside sources (1.14.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Requested 2026-10-29 from openbando: a readable list of content dependencies and value couplings, and of what outside the repository matters to people. Release 1.14.0: `inputs` on rows, `couplings` and `outside` in `.harness.json`; the map page gains the three sections; `check-freshness` names the other places of a coupled value a branch changes. This repository lists one outside source (GitHub). Closes when `v1.14.0` is tagged. Closed 2026-10-29: #20 merged on a green `check`, `v1.14.0` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#20](https://github.com/voidbrain/project-harness/pull/20) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 22/22 (inputs set a row off; a coupling warning names the other places; the page's three sections), 2026-10-29. Documentation: `check:template`, `check:backlog` |
| Reviewed | 2026-10-29 |

</details>

---

## Closed 2026-10-30

### F-014

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-014 | ◻️ P3 | Closed | The impact map links the project's own detailed maps (1.15.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Requested 2026-10-30 from openbando (decided with the owner): its element map links to the impact map, but the impact map, written by this template's tool, knew nothing of project pages and could not link back. Release 1.15.0: `pages` in `.harness.json`, linked at the top of the impact map, relative to it. Closes when `v1.15.0` is tagged. Closed 2026-10-30: #22 merged on a green `check`, `v1.15.0` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#22](https://github.com/voidbrain/project-harness/pull/22) |
| Opened | 2026-10-30 |
| Verification | Script: `test:tools` (a new case: pages linked, paths relative to the map), 2026-10-30. Documentation: `check:template`, `check:backlog` |
| Reviewed | 2026-10-30 |

</details>

---

### B-009

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | B-009 | ◻️ P3 | Closed | `impact-map.mjs` did not escape backslashes in table cells (1.15.1) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Found 2026-10-30 by CodeQL (`js/incomplete-sanitization`) on an openbando PR that copied the 1.15.0 tool: a cell escaped pipes but not backslashes, so a cell ending in `\` could join the next column. Patch 1.15.1 escapes backslashes first. Closes when `v1.15.1` is tagged. Closed 2026-10-30: #24 merged on a green `check`, `v1.15.1` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#24](https://github.com/voidbrain/project-harness/pull/24) |
| Opened | 2026-10-30 |
| Verification | Script: `test:tools`, `check:template`, 2026-10-30 |
| Reviewed | 2026-10-30 |

</details>

---

### F-015

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-015 | ◻️ P3 | Closed | Code coverage table, per folder, warning on drops (1.16.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Requested 2026-10-30 from openbando (decided with the owner: template and project; information, never a gate). Release 1.16.0: `tools/coverage-table.mjs` (page and baseline from the standard summary; drop warnings in CI), the Angular coverage run over every source file (tried on openbando: a default run left 58 untested files out of the table), AGENTS, APPLY, README. Closes when `v1.16.0` is tagged. Closed 2026-10-30: #26 merged on a green `check`, `v1.16.0` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#26](https://github.com/voidbrain/project-harness/pull/26) |
| Opened | 2026-10-30 |
| Verification | Script: `test:tools` 24/24 (a page per folder with untested files; a drop warns, never fails), 2026-10-30; tried on openbando's real summary (5 folders) |
| Reviewed | 2026-10-30 |

</details>

---

### F-016

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-016 | ◻️ P2 | Closed | Coherence fixes from the openbando review (1.17.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Requested 2026-10-30 by the owner after a review of the template against openbando (five inconsistencies; a sixth, the 🧑 waiting list, the owner keeps). (1) The lifecycle table had Implemented → Verified → Closed while the procedure let a record close "when no action remains": records were closed straight from Implemented on "merged, CI green". Now a record closes only from Verified (or cancelled/superseded); automated acceptance is the merged PR's green CI run, cited; one reconcile may verify and close. (2) What the agent may do alone was nowhere: APPLY said "do not commit or push unless the user asks", AGENTS "the owner may merge", and agents merged anyway. Now AGENTS, "What the agent does on its own, and what it asks first"; APPLY's line is scoped to the first application. (3) Records kept "this PR" after merging and their closure was missed (openbando F-028–F-030, F-038 for a day): `check-backlog` fails on a "this PR" line already on the default branch. (4) The coverage page was rewritten in every PR, so every two parallel PRs conflicted: it changes only on purpose or in audits. (5) The tools the process depends on lived in a session scratchpad; the backlog conflict helper kept one side's records and dropped openbando edits (F-024, F-033, B-030, B-031): now `tools/merge-backlog.mjs` (three-way, record by record) and `tools/merge-when-green.mjs` (merges once every check passed; stops on a failure or conflict), both tested. `test:tools` 27/27. Closed 2026-10-30: [#28](https://github.com/voidbrain/project-harness/pull/28) merged on a green `check` (merged by `merge-when-green.mjs` itself), `v1.17.0` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#28](https://github.com/voidbrain/project-harness/pull/28); tag `v1.17.0` |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 27/27 (new: stale "this PR", merge-backlog three ways, merge-when-green with a fake gh), `check:template`; [#28](https://github.com/voidbrain/project-harness/pull/28) CI passed |
| Reviewed | 2026-10-30 |

</details>

### B-010

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | B-010 | ◻️ P1 | Closed | `check-backlog` took a quoted mention of the placeholder for one (1.17.1) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Found 2026-10-30 on openbando: its 1.17.0 reconcile note quoted the placeholder phrase while describing the new rule; the line passed on its own PR (new there) and, once merged, failed `check:backlog` on every later PR. The check now ignores the phrase in quotes or backticks; `test:tools` covers a quoted mention already on the default branch (27/27). Verified and closed 2026-10-30: [#30](https://github.com/voidbrain/project-harness/pull/30) merged on a green `check`, `v1.17.1` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#30](https://github.com/voidbrain/project-harness/pull/30); tag `v1.17.1`; openbando [#245](https://github.com/voidbrain/openbando/pull/245) (the note reworded) |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 27/27, `check:template`; [#30](https://github.com/voidbrain/project-harness/pull/30) CI passed |
| Reviewed | 2026-10-30 |

</details>

### F-017

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-017 | ◻️ P2 | Closed | A recap for records waiting for a person: issue, reproduce, check (1.18.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Requested 2026-10-30 by the owner, reviewing openbando's 🧑 records ("not always easy to understand"): after the human-action line, a very small summary of the issue, how to reproduce it and what to check. BACKLOG-RULES and the legend define the table; `check-backlog` requires it on 🧑 records a branch adds or changes (older ones keep passing until touched, so the release is minor). `test:tools` 28/28. Verified and closed 2026-10-30: [#32](https://github.com/voidbrain/project-harness/pull/32) merged on a green `check`, `v1.18.0` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#32](https://github.com/voidbrain/project-harness/pull/32); tag `v1.18.0` |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 28/28 (new: a new 🧑 record without the recap fails, with it passes, an untouched old one passes), `check:template`; [#32](https://github.com/voidbrain/project-harness/pull/32) CI passed |
| Reviewed | 2026-10-30 |

</details>

### F-018

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-018 | ◻️ P2 | Closed | A PR's placeholder can no longer reach the default branch; the watcher survives GitHub timeouts (1.19.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Decided 2026-10-30 with the owner, after openbando's `check:backlog` failed on every PR twice in one day: a merged "this PR" line (its 1.17.0 note, then #250's B-029 record) is on the default branch, where the 1.17.0 check fails every other PR until someone fixes it. Now `check-backlog` fails on a PR's own CI run when the branch adds the placeholder, naming the number; the rule says to write the number right after opening the PR. The same day GitHub timed out for minutes and `merge-when-green` crashed on the first failed `gh` call: it now retries (ten failures in a row give up). `test:tools` 28/28. Verified and closed 2026-10-30: [#34](https://github.com/voidbrain/project-harness/pull/34) merged on a green `check`, `v1.19.0` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#34](https://github.com/voidbrain/project-harness/pull/34); tag `v1.19.0`; openbando [#251](https://github.com/voidbrain/openbando/pull/251) (the second unblock) |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 28/28 (new cases: a placeholder added on a PR run fails with the number, locally passes; gh failing twice then answering merges, ten failures give up); [#34](https://github.com/voidbrain/project-harness/pull/34) CI passed |
| Reviewed | 2026-10-30 |

</details>

### B-011

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | B-011 | ◻️ P2 | Closed | `merge-backlog` brought back archived records; `merge-when-green` stopped on a stale failure (1.19.1) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Found 2026-10-30 on their first day. Resolving #33's backlog conflict, `merge-backlog` kept main's F-017 although the branch had archived it (the tool only looked at records the branch still had). Watching #34, `merge-when-green` read the previous run's failed `check` right after a push and stopped. Both fixed, both covered in `test:tools` (28/28). Verified and closed 2026-10-30: [#35](https://github.com/voidbrain/project-harness/pull/35) merged on a green `check`, `v1.19.1` tagged on its merge.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#35](https://github.com/voidbrain/project-harness/pull/35); tag `v1.19.1`; found on [#33](https://github.com/voidbrain/project-harness/pull/33) and [#34](https://github.com/voidbrain/project-harness/pull/34) |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 28/28 (an archived record stays gone; a failure counts on its second sighting); [#35](https://github.com/voidbrain/project-harness/pull/35) CI passed |
| Reviewed | 2026-10-30 |

</details>

## Closed 2026-10-31

### F-019

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-019 | ◻️ P2 | Closed | One backlog archive per year, in closing-date order (1.20.0) |

💻 **→ Human action required: No**<br />None: closed.

**Next action / closure evidence:** Decided 2026-10-30 with the owner, after openbando's records closed on 29 and 30 October were appended to its 28 October archive: one archive per year, `docs/archive/backlog-<year>.md`, a `## Closed <date>` heading per day. `check-backlog` now counts every published archive line across all archive files (a record may move between them, nothing may vanish; the folder README is exempt) and fails on a record whose last "closed <date>" is not its file's year. This repository's own archive moved to `backlog-2026.md`. `test:tools` 29/29. Verified and closed 2026-10-31: [#37](https://github.com/voidbrain/project-harness/pull/37) merged on a green `check` ([run 41131710040](https://github.com/voidbrain/project-harness/actions/runs/41131710040); its first commit's run failed on the placeholder, as 1.19.0 intends), `v1.20.0` tagged; openbando [#264](https://github.com/voidbrain/openbando/pull/264) reconciled with every job green.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#37](https://github.com/voidbrain/project-harness/pull/37); found on openbando's `docs/archive/backlog-2026-10-28.md` |
| Opened | 2026-10-30 |
| Verification | Script · 2026-10-30 · `test:tools` 29/29 (a record moved to a year's archive under new headings passes; a line lost from every archive fails; a record closed in another year fails); [#37](https://github.com/voidbrain/project-harness/pull/37) CI passed |
| Reviewed | 2026-10-31 |

</details>

---

### F-020

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔵 | F-020 | ◻️ P3 | Closed | A new finding about the same behaviour goes into its record, not a new ID (1.20.1) |

💻 **→ Human action required: No**<br />No action remains; release v1.20.1 is tagged.

**Next action / closure evidence:** Found 2026-10-31 by the owner on openbando: a loose paragraph between two records ("New findings reuse an existing ID when they concern the same behavior"), left from the old table layout, was the only place this rule lived; next to "never reuse an ID" it read as a contradiction. BACKLOG-RULES now says it beside the ID rule: never reuse an ID for a different item; a new finding about the same behaviour (a failed check, a follow-up, a regression) goes into that record, reopened if it was closed. Wording only.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#38](https://github.com/voidbrain/project-harness/pull/38); found on openbando's backlog 2026-10-31 |
| Opened | 2026-10-31 |
| Verification | Documentation · 2026-10-31 · [CI run 41152418062](https://github.com/voidbrain/project-harness/actions/runs/41152418062), check and all steps green; published v1.20.1 tag. Closed 2026-10-31. |
| Reviewed | 2026-10-31 |

</details>

---


#### Full template audit, 2026-10-31

Closed 2026-10-31: restarted against merged #44 and published the [full audit](../audits/2026-10-31.md) in [#45](https://github.com/voidbrain/project-harness/pull/45), merged at a0e2d0561a81d8d3cc049f4e7a44947ef700e4bc. [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978) and every step passed: 56 fixtures, template/backlog/integration metadata and impact map checks. Reviewed README, AGENTS/area notes, BACKLOG/RULES, style guide and current outside sources; corrected conflicting summaries and explicit required/conditional procedure triggers. No consumer or personal installation changed. Audit maintenance is complete; this does not close B-011, B-012, F-023/F-024 or other release records while their tag publication remains pending. Live-runtime, semantic/security and portability limits are explicit in the dated audit.


#### Cumulative v2.2.2 publication and closure, 2026-10-31

Closed 2026-10-31: the seven outcomes below were already implemented/verified and shared only a publication dependency. [#50](https://github.com/voidbrain/project-harness/pull/50) merged after every PR check passed. Its one-time publication workflow reran source checks at 0764a362d3c81d828ff6f1bf936e3a2782f19339 and published annotated v2.2.2 without moving any existing ref. [Run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) verify/publish jobs and every step passed. Remote tag object 159845274a3e89323ab27b4d6477552d1974c3a0 and peeled commit independently verified. The temporary workflow is removed by the archive PR. Earlier unpublished tag plans are superseded by the cumulative release. No consumer adoption or human acceptance is pending.

#### Pre-publication maintenance history

The following notes are retained from the ledger before publication; their pending-tag statements describe that earlier state and are resolved by the evidence above.

2026-10-31: Agent-owned publication attempt for approved v2.2.2 at verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339. Direct shell Git failed its write-authentication test; the connector supports commits/PR merges but no tag operation. A one-time repository workflow reruns source checks, creates only the exact approved tag without force, and verifies the remote ref. Remove this temporary workflow when publication is verified and the seven records are archived. Publication [#50](https://github.com/voidbrain/project-harness/pull/50); all 56 fixtures and template/backlog checks pass locally. No tag or closure is claimed yet.

2026-10-31: Reviewed all seven active records for actual closure: implementation and recorded checks are complete. Grouped them under Awaiting publication and superseded separate unpublished tag requests with one cumulative v2.2.2 release. Verified prerequisite commit ancestry; remote refs contain no published v2.x tag. No outcome is prematurely marked Closed. Review [#49](https://github.com/voidbrain/project-harness/pull/49).

2026-10-31: Corrected B-011, B-012 and F-021–F-025 from Human action required Yes to No: release publication is already authorized and agent-owned. Blocked status now names the missing tag-write capability and resume condition. [#48](https://github.com/voidbrain/project-harness/pull/48). No new approval or human acceptance is requested.

2026-10-31: Documentation clarification (2.2.2): separate capability assessment, MCP recommendations, solution profiles and shared skills in README and matching instructions. Requirements and optional adoption remain unchanged. [#47](https://github.com/voidbrain/project-harness/pull/47); local template/backlog checks and all 56 fixtures pass. [CI 41207111207](https://github.com/voidbrain/project-harness/actions/runs/41207111207) and every job step passed; merged as cc9428d. Agent-owned v2.2.2 tag publication is blocked by the same unavailable write capability. No consumer action is a gate.

Completed audit maintenance is [archived](backlog-2026.md#full-template-audit-2026-10-31); B-011, B-012, F-023 and F-024 retain only owned release publication. Evidence [#46](https://github.com/voidbrain/project-harness/pull/46).

### B-011

**Bind merge requests to the inspected commit (reopened, 2.2.1)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: closed after verified v2.2.2 publication.

| | |
|---|---|
| **Issue** | The merge watcher can inspect a green head and then merge a different head if the branch moves before the merge request. |
| **Reproduce** | Mock gh between pr view and pr merge; inspect whether the request includes the inspected head. |
| **Check** | Merge uses --match-head-commit; a moved head cannot be merged using stale check evidence. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-10-31: cumulative [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) is published. Annotated tag object 159845274a3e89323ab27b4d6477552d1974c3a0 resolves to verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339, containing all recorded implementation/fix commits. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step, including all 56 fixtures and template/backlog/integration checks. Remote ref and target were independently read through GitHub and fetched with Git. No action remains for this outcome.

**Estimates:** Small remaining-effort category; ~100% complete. Reassessed 2026-10-31: the previously shared publication dependency is resolved and the record is closed; zero implementation, verification or publication work remains. The earlier ~90% estimate described the pre-publication state.

| Field | Value |
|---|---|
| PR / evidence | [#35](https://github.com/voidbrain/project-harness/pull/35), v1.19.1; reopened by the 2026-10-31 full audit; [#45](https://github.com/voidbrain/project-harness/pull/45) |
| Opened | 2026-10-30 |
| Verification | Unit/integration · 2026-10-31 · [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978), every step and all 56 owned fixtures passed; merged #45. Live host/client/compiler limits remain as recorded in the audit. |
| Prior reconciliation | Evidence [#46](https://github.com/voidbrain/project-harness/pull/46); release tag remains the only closure dependency. |
| Publication blocker | Resolved 2026-10-31 by the approved one-time repository workflow in #50; no new secret or repository setting was needed. |
| Prior actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.2.1 at a0e2d05; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Publication verification | 2026-10-31: annotated v2.2.2 tag and exact target verified; [run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) all steps success; [#50](https://github.com/voidbrain/project-harness/pull/50). |
| Closure maintenance | [PR #51](https://github.com/voidbrain/project-harness/pull/51); original IDs, Opened dates and prior verification preserved. |
| Reviewed | 2026-10-31 |

</details>

---

### B-012

**Respect Angular version exceptions in convention checks (2.2.1)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: closed after verified v2.2.2 publication.

| | |
|---|---|
| **Issue** | Written rules adapt to the project version, but the convention checker rejected explicit standalone and OnPush settings on older Angular projects. |
| **Reproduce** | Run the checker on fixture workspaces at Angular 18, 20, 21 and 22 and on an uninstalled cross-major range. |
| **Check** | Only enforce standalone defaults at v20+ and OnPush defaults at v22+; unknown installed version does not invent a default. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-10-31: cumulative [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) is published. Annotated tag object 159845274a3e89323ab27b4d6477552d1974c3a0 resolves to verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339, containing all recorded implementation/fix commits. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step, including all 56 fixtures and template/backlog/integration checks. Remote ref and target were independently read through GitHub and fetched with Git. No action remains for this outcome.

**Estimates:** Small remaining-effort category; ~100% complete. Reassessed 2026-10-31: the previously shared publication dependency is resolved and the record is closed; zero implementation, verification or publication work remains. The earlier ~90% estimate described the pre-publication state.

| Field | Value |
|---|---|
| PR / evidence | Owner-requested full audit, 2026-10-31; [#45](https://github.com/voidbrain/project-harness/pull/45) |
| Opened | 2026-10-31 |
| Verification | Unit/integration · 2026-10-31 · [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978), every step and all 56 owned fixtures passed; merged #45. Live host/client/compiler limits remain as recorded in the audit. |
| Prior reconciliation | Evidence [#46](https://github.com/voidbrain/project-harness/pull/46); release tag remains the only closure dependency. |
| Publication blocker | Resolved 2026-10-31 by the approved one-time repository workflow in #50; no new secret or repository setting was needed. |
| Prior actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.2.1 at a0e2d05; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Publication verification | 2026-10-31: annotated v2.2.2 tag and exact target verified; [run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) all steps success; [#50](https://github.com/voidbrain/project-harness/pull/50). |
| Closure maintenance | [PR #51](https://github.com/voidbrain/project-harness/pull/51); original IDs, Opened dates and prior verification preserved. |
| Reviewed | 2026-10-31 |

</details>

---

### F-021

**Compact active records and mandatory recaps (2.0.0)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: closed after verified v2.2.2 publication.

| | |
|---|---|
| **Issue** | Agent-owned and untouched records can omit recaps; long visible actions make the ledger hard to scan. |
| **Reproduce** | Run the old validator on an agent-owned record without a recap; read a ledger with long next actions. |
| **Check** | Every record requires all three recap rows and estimates; actions and history stay collapsed with no evidence lost. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-10-31: cumulative [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) is published. Annotated tag object 159845274a3e89323ab27b4d6477552d1974c3a0 resolves to verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339, containing all recorded implementation/fix commits. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step, including all 56 fixtures and template/backlog/integration checks. Remote ref and target were independently read through GitHub and fetched with Git. No action remains for this outcome.

**Estimates:** Small remaining-effort category; ~100% complete. Reassessed 2026-10-31: the previously shared publication dependency is resolved and the record is closed; zero implementation, verification or publication work remains. The earlier ~90% estimate described the pre-publication state.

| Field | Value |
|---|---|
| PR / evidence | Owner request from OpenBando, 2026-10-31; [#39](https://github.com/voidbrain/project-harness/pull/39) |
| Opened | 2026-10-31 |
| Verification | Documentation/tool fixtures · 2026-10-31 · [CI 41196190379](https://github.com/voidbrain/project-harness/actions/runs/41196190379), every job step green; all 29 fixtures pass. Completed consumer trial: OpenBando’s 20 prior records passed the validator. Publication verified on 2026-10-31 by the annotated v2.2.2 remote tag. |
| Prior audit reassessment | 2026-10-31: ownership and current evidence reviewed; remaining tag task unchanged, Small/~90% remains valid. |
| Publication blocker | Resolved 2026-10-31 by the approved one-time repository workflow in #50; no new secret or repository setting was needed. |
| Prior actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.0.0 at da68177; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Publication verification | 2026-10-31: annotated v2.2.2 tag and exact target verified; [run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) all steps success; [#50](https://github.com/voidbrain/project-harness/pull/50). |
| Closure maintenance | [PR #51](https://github.com/voidbrain/project-harness/pull/51); original IDs, Opened dates and prior verification preserved. |
| Reviewed | 2026-10-31 |

</details>

---

### F-022

**Reject foreign backlog actions and downstream release gates (2.0.1)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: closed after verified v2.2.2 publication.

| | |
|---|---|
| **Issue** | F-021 assigned a consumer reconciliation here despite the existing one-repository rule. |
| **Reproduce** | Read F-021’s former next action and APPLY’s former required consumer-trial step. |
| **Check** | No foreign action remains; rules reject it in any record field and keep master acceptance independent of derived-project adoption. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-10-31: cumulative [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) is published. Annotated tag object 159845274a3e89323ab27b4d6477552d1974c3a0 resolves to verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339, containing all recorded implementation/fix commits. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step, including all 56 fixtures and template/backlog/integration checks. Remote ref and target were independently read through GitHub and fetched with Git. No action remains for this outcome.

**Estimates:** Small remaining-effort category; ~100% complete. Reassessed 2026-10-31: the previously shared publication dependency is resolved and the record is closed; zero implementation, verification or publication work remains. The earlier ~90% estimate described the pre-publication state.

| Field | Value |
|---|---|
| PR / evidence | Owner report 2026-10-31; [#40](https://github.com/voidbrain/project-harness/pull/40); [#41](https://github.com/voidbrain/project-harness/pull/41) (evidence reconciliation) |
| Opened | 2026-10-31 |
| Verification | Documentation · 2026-10-31 · [CI 41197249696](https://github.com/voidbrain/project-harness/actions/runs/41197249696) green; template, backlog and 29 fixture checks passed. Publication verified on 2026-10-31 by the annotated v2.2.2 remote tag. |
| Prior audit reassessment | 2026-10-31: ownership and current evidence reviewed; remaining tag task unchanged, Small/~90% remains valid. |
| Publication blocker | Resolved 2026-10-31 by the approved one-time repository workflow in #50; no new secret or repository setting was needed. |
| Prior actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.0.1 at 9c3abc6; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Publication verification | 2026-10-31: annotated v2.2.2 tag and exact target verified; [run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) all steps success; [#50](https://github.com/voidbrain/project-harness/pull/50). |
| Closure maintenance | [PR #51](https://github.com/voidbrain/project-harness/pull/51); original IDs, Opened dates and prior verification preserved. |
| Reviewed | 2026-10-31 |

</details>

---

### F-023

**Optional MCP recommendations, discovery and guided host setup**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: closed after verified v2.2.2 publication.

| | |
|---|---|
| **Issue** | Projects lack a reproducible way to select useful capabilities and distinguish recommendation from connection. |
| **Reproduce** | Use a fixture Angular workspace or a project with no integration selections; run the MCP helper. |
| **Check** | No selections still work; candidates and sources are explicit; snippets are client-specific; offline/permission/runtime limits are honest. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-10-31: cumulative [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) is published. Annotated tag object 159845274a3e89323ab27b4d6477552d1974c3a0 resolves to verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339, containing all recorded implementation/fix commits. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step, including all 56 fixtures and template/backlog/integration checks. Remote ref and target were independently read through GitHub and fetched with Git. No action remains for this outcome.

**Estimates:** Small remaining-effort category; ~100% complete. Reassessed 2026-10-31: the previously shared publication dependency is resolved and the record is closed; zero implementation, verification or publication work remains. The earlier ~90% estimate described the pre-publication state.

| Field | Value |
|---|---|
| PR / evidence | Owner request 2026-10-31; [#42](https://github.com/voidbrain/project-harness/pull/42); [#43](https://github.com/voidbrain/project-harness/pull/43) (evidence reconciliation) |
| Opened | 2026-10-31 |
| Verification | Unit/integration · 2026-10-31 · [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978), every step and all 56 owned fixtures passed; merged #45. Live host/client/compiler limits remain as recorded in the audit. |
| Audit follow-up | Full restart against merged #44; [#45](https://github.com/voidbrain/project-harness/pull/45) |
| Prior reconciliation | Evidence [#46](https://github.com/voidbrain/project-harness/pull/46); release tag remains the only closure dependency. |
| Prior documentation reassessment | 2026-10-31: headings separated without scope/acceptance changes; Small/~90% remains valid; tag publication pending. |
| Publication blocker | Resolved 2026-10-31 by the approved one-time repository workflow in #50; no new secret or repository setting was needed. |
| Prior actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.1.0 at 658208a, followed by correction v2.2.1 at a0e2d05; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Publication verification | 2026-10-31: annotated v2.2.2 tag and exact target verified; [run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) all steps success; [#50](https://github.com/voidbrain/project-harness/pull/50). |
| Closure maintenance | [PR #51](https://github.com/voidbrain/project-harness/pull/51); original IDs, Opened dates and prior verification preserved. |
| Reviewed | 2026-10-31 |

</details>

---

### F-024

**Optional solution coordinator profile and combined backlog dashboard**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: closed after verified v2.2.2 publication.

| | |
|---|---|
| **Issue** | Multi-repository solutions need their own integration backlog while components retain authoritative records. |
| **Reproduce** | Apply the solution fragment to a fixture coordinator with independent component checkouts and qualified links. |
| **Check** | Show separate solution/component status, immutable source refs, archive links and Unknown failures; never edit components or average completion. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-10-31: cumulative [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) is published. Annotated tag object 159845274a3e89323ab27b4d6477552d1974c3a0 resolves to verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339, containing all recorded implementation/fix commits. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step, including all 56 fixtures and template/backlog/integration checks. Remote ref and target were independently read through GitHub and fetched with Git. No action remains for this outcome.

**Estimates:** Small remaining-effort category; ~100% complete. Reassessed 2026-10-31: the previously shared publication dependency is resolved and the record is closed; zero implementation, verification or publication work remains. The earlier ~90% estimate described the pre-publication state.

| Field | Value |
|---|---|
| PR / evidence | Owner request 2026-10-31; [#42](https://github.com/voidbrain/project-harness/pull/42); [#43](https://github.com/voidbrain/project-harness/pull/43) (evidence reconciliation) |
| Opened | 2026-10-31 |
| Verification | Unit/integration · 2026-10-31 · [CI 41205627978](https://github.com/voidbrain/project-harness/actions/runs/41205627978), every step and all 56 owned fixtures passed; merged #45. Live host/client/compiler limits remain as recorded in the audit. |
| Audit follow-up | Full restart against merged #44; [#45](https://github.com/voidbrain/project-harness/pull/45) |
| Prior reconciliation | Evidence [#46](https://github.com/voidbrain/project-harness/pull/46); release tag remains the only closure dependency. |
| Prior documentation reassessment | 2026-10-31: headings separated without scope/acceptance changes; Small/~90% remains valid; tag publication pending. |
| Publication blocker | Resolved 2026-10-31 by the approved one-time repository workflow in #50; no new secret or repository setting was needed. |
| Prior actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.1.0 at 658208a, followed by correction v2.2.1 at a0e2d05; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Publication verification | 2026-10-31: annotated v2.2.2 tag and exact target verified; [run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) all steps success; [#50](https://github.com/voidbrain/project-harness/pull/50). |
| Closure maintenance | [PR #51](https://github.com/voidbrain/project-harness/pull/51); original IDs, Opened dates and prior verification preserved. |
| Reviewed | 2026-10-31 |

</details>

---

### F-025

**Portable shared harness skill and reviewed skill discovery (2.2.0)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: closed after verified v2.2.2 publication.

| | |
|---|---|
| **Issue** | A personal apply-harness skill is unavailable to other clones, duplicates procedure and relies on a derived repository; discovery advice treats popularity as quality. |
| **Reproduce** | Compare the supplied personal skills with a fresh harness checkout and its authoritative APPLY.md. |
| **Check** | Shared entry point reads authoritative rules, has no fixed personal path or downstream authority; optional discovery reviews sources, scope and actual client compatibility. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-10-31: cumulative [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) is published. Annotated tag object 159845274a3e89323ab27b4d6477552d1974c3a0 resolves to verified main commit 0764a362d3c81d828ff6f1bf936e3a2782f19339, containing all recorded implementation/fix commits. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step, including all 56 fixtures and template/backlog/integration checks. Remote ref and target were independently read through GitHub and fetched with Git. No action remains for this outcome.

**Estimates:** Small remaining-effort category; ~100% complete. Reassessed 2026-10-31: the previously shared publication dependency is resolved and the record is closed; zero implementation, verification or publication work remains. The earlier ~90% estimate described the pre-publication state.

| Field | Value |
|---|---|
| PR / evidence | Owner-supplied skills and proceed instruction, 2026-10-31; [#44](https://github.com/voidbrain/project-harness/pull/44) |
| Opened | 2026-10-31 |
| Verification | Template/backlog checks and all 45 fixtures passed locally, 2026-10-31; [CI 41204390779](https://github.com/voidbrain/project-harness/actions/runs/41204390779) and every job step passed; merged as 72e223d; no live-client installation attempted |
| Publication blocker | Resolved 2026-10-31 by the approved one-time repository workflow in #50; no new secret or repository setting was needed. |
| Prior actor reassessment | 2026-10-31: no human decision or acceptance is required. Tool limitation changes status to Blocked; remaining effort and ~90% estimate are unchanged. |
| Superseded release plan | v2.2.0 at 72e223d; unpublished, retained as history. Current closure target is the cumulative v2.2.2 release. |
| Closure review | 2026-10-31: all implementation commits are ancestors of main; no independent implementation/acceptance gap remains. Review [#49](https://github.com/voidbrain/project-harness/pull/49). |
| Publication verification | 2026-10-31: annotated v2.2.2 tag and exact target verified; [run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) all steps success; [#50](https://github.com/voidbrain/project-harness/pull/50). |
| Closure maintenance | [PR #51](https://github.com/voidbrain/project-harness/pull/51); original IDs, Opened dates and prior verification preserved. |
| Reviewed | 2026-10-31 |

</details>

---

### F-031

**Complete the full eight-area harness audit**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None for this audit outcome; related release-dependent fixes remain on their own active records.

| | |
|---|---|
| **Issue** | The newly introduced procedure needs a real full repository review, not only a scoped tooling report. |
| **Reproduce** | Review baseline da37088 and previous dated audit; trace tools, profile contracts, delivery evidence and every active record. |
| **Check** | Dated full report/manifest covers all eight areas, confirms findings with evidence, tracks unresolved work, reconciles CI and preserves historical reports. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Verified and closed 2026-10-31: #55 merged at bc7d743 after every step of CI run 41228352936 passed; dated report, full manifest, findings and tracking are complete. No audit-specific action remains. B-013/B-014 and F-026–F-030 retain their independent publication criteria.

**Estimates:** No remaining audit effort; ~100% complete. Report/tracking and merged green CI establish acceptance; publication is not this audit outcome’s closure criterion. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#55](https://github.com/voidbrain/project-harness/pull/55); [Full audit](../audits/2026-10-31-full-harness.md) |
| Opened | 2026-10-31 |
| Verification | Automated and source review · 2026-10-31 · 72 fixtures; all #55 CI steps passed in [run 41228352936](https://github.com/voidbrain/project-harness/actions/runs/41228352936); report/manifest on main |
| Closure maintenance | [#56](https://github.com/voidbrain/project-harness/pull/56) |
| Reviewed | 2026-10-31 |

</details>

---

### B-013

**Contain configured fork merges inside the project checkout**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P1 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None; verified and closed on the published v3.1.1 release.

| | |
|---|---|
| **Issue** | check-harness --merge trusted mapped destinations and could modify a sibling file or Git metadata. |
| **Reproduce** | Run the regression fixture with ../sibling/victim.mjs or a symlink pointing outside the project; the former helper merged and rewrote the sibling. |
| **Check** | All destinations preflight before any write; traversal, Git metadata and symlink escapes leave targets and stamp unchanged; valid fork/conflict behavior stays covered. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Verified and closed 2026-10-31: annotated v3.1.1 points to approved main commit 7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031; publication run 41243779205 passed every verify/publish step. No remaining action. Prior implementation/publication path (historical): Fix and failing-before/passing-after fixture exist. Merged #55 after green CI 41228352936; publish cumulative 3.1.1 and close on its tag; no consumer trial needed.

**Estimates:** No remaining effort; ~100% complete, after observed tag publication. Prior estimate (historical): Small remaining effort; ~90% complete. Local and merged #55 CI evidence exists; publication remains. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#55](https://github.com/voidbrain/project-harness/pull/55); [Full audit](../audits/2026-10-31-full-harness.md#confirmed-findings) |
| Opened | 2026-10-31 |
| Verification | Automated/local review · 2026-10-31 · 72 fixtures and all #55 CI steps passed in run 41228352936; tag publication pending |
| Publication verification | 2026-10-31 · annotated [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1) at 7a81b93; [publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) all steps passed; [#57](https://github.com/voidbrain/project-harness/pull/57). |
| Closure maintenance | [#58](https://github.com/voidbrain/project-harness/pull/58) |
| Reviewed | 2026-10-31 |

</details>

---

### B-014

**Preserve enforced coverage checks for main-baseline folders**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None; verified and closed on the published v3.1.1 release.

| | |
|---|---|
| **Issue** | Removing a display folder from config hid its coverage regression when another folder kept total coverage unchanged. |
| **Reproduce** | Baseline both folders at 90%; measure 80% and 100%, omit the first folder from configured folders; the former helper returned success. |
| **Check** | Opt-in enforcement checks every baseline folder regardless of displayed rows; the regression fails while default warning mode remains compatible. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Verified and closed 2026-10-31: annotated v3.1.1 points to approved main commit 7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031; publication run 41243779205 passed every verify/publish step. No remaining action. Prior implementation/publication path (historical): Fix and failing-before/passing-after fixture exist. All #55 CI steps passed; publish cumulative 3.1.1 and close on its tag. Reviewed coverage policy changes remain explicit decisions.

**Estimates:** No remaining effort; ~100% complete, after observed tag publication. Prior estimate (historical): Small remaining effort; ~90% complete. Local and merged #55 CI evidence exists; publication remains. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#55](https://github.com/voidbrain/project-harness/pull/55); [Full audit](../audits/2026-10-31-full-harness.md#confirmed-findings) |
| Opened | 2026-10-31 |
| Verification | Automated/local review · 2026-10-31 · 72 fixtures and all #55 CI steps passed in run 41228352936; tag publication pending |
| Publication verification | 2026-10-31 · annotated [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1) at 7a81b93; [publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) all steps passed; [#57](https://github.com/voidbrain/project-harness/pull/57). |
| Closure maintenance | [#58](https://github.com/voidbrain/project-harness/pull/58) |
| Reviewed | 2026-10-31 |

</details>

---

### F-026

**Measure observed adoption and reconciliation friction**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None; verified and closed on the published v3.1.1 release.

| | |
|---|---|
| **Issue** | No consistent local measurement distinguishes actual friction from opinion. |
| **Reproduce** | Follow the maintenance guide; run the new helper fixtures and review the application/audit procedure. |
| **Check** | Numeric local observations preserve missing versus zero; reports separate operations/sample counts; no source/prompt text or telemetry; invalid inputs and unsafe destinations fail. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Verified and closed 2026-10-31: annotated v3.1.1 points to approved main commit 7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031; publication run 41243779205 passed every verify/publish step. No remaining action. Prior implementation/publication path (historical): CI run 41225792756 exposed a nonportable timer-test minimum-delay assumption (not a workflow timing failure); fixed with an injected clock asserting exact elapsed time. Follow-up in [#53](https://github.com/voidbrain/project-harness/pull/53). Additional request 2026-10-31: enforce maintenance review in session/CI, automate elapsed timing, and turn justified recurring findings into owned rule/tool/skill changes rather than silent self-modification. Implemented baseline in [#52](https://github.com/voidbrain/project-harness/pull/52). Run template/backlog/helper checks; inspect all PR checks, merge only when green, then publish cumulative v3.1.1 from verified main. Close on this repository’s own published release; consumer adoption is separate.

**Estimates:** No remaining effort; ~100% complete, after observed tag publication. Prior estimate (historical): Small remaining effort; ~90% complete. Implementation and documentation exist; baseline helpers passed merged #52 CI; the extended suite passes 64 fixtures; automatic timing/enforcement and quality policy now have regression checks; CI passed; cumulative 3.1.1 publication remains. Reassessed 2026-10-31. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#52](https://github.com/voidbrain/project-harness/pull/52); [maintenance guidance](../agents/maintenance.md) |
| Opened | 2026-10-31 |
| Verification | Tool/documentation checks · 2026-10-31 · 59 fixtures, template consistency and backlog/archive preservation passed; Merged CI · 2026-10-31 · #52 run 41223980633 and #53 run 41226326072 passed; publication · Pending |
| Publication verification | 2026-10-31 · annotated [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1) at 7a81b93; [publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) all steps passed; [#57](https://github.com/voidbrain/project-harness/pull/57). |
| Closure maintenance | [#58](https://github.com/voidbrain/project-harness/pull/58) |
| Reviewed | 2026-10-31 |

</details>

---

### F-027

**Preview reconciliation before writes**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None; verified and closed on the published v3.1.1 release.

| | |
|---|---|
| **Issue** | Agents need proposed changes, protected project rules and unresolved conflicts before editing. |
| **Reproduce** | Follow the maintenance guide; run the new helper fixtures and review the application/audit procedure. |
| **Check** | Preview is read-only, pins a local release commit, identifies changed/missing/conflicting and adapted files, shows project markers and required checks, and refuses invalid paths/options without claiming semantic verification. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Verified and closed 2026-10-31: annotated v3.1.1 points to approved main commit 7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031; publication run 41243779205 passed every verify/publish step. No remaining action. Prior implementation/publication path (historical): Follow-up in [#53](https://github.com/voidbrain/project-harness/pull/53). Additional request 2026-10-31: enforce maintenance review in session/CI, automate elapsed timing, and turn justified recurring findings into owned rule/tool/skill changes rather than silent self-modification. Implemented baseline in [#52](https://github.com/voidbrain/project-harness/pull/52). Run template/backlog/helper checks; inspect all PR checks, merge only when green, then publish cumulative v3.1.1 from verified main. Close on this repository’s own published release; consumer adoption is separate.

**Estimates:** No remaining effort; ~100% complete, after observed tag publication. Prior estimate (historical): Small remaining effort; ~90% complete. Implementation and documentation exist; baseline helpers passed merged #52 CI; the extended suite passes 64 fixtures; automatic timing/enforcement and quality policy now have regression checks; CI passed; cumulative 3.1.1 publication remains. Reassessed 2026-10-31. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#52](https://github.com/voidbrain/project-harness/pull/52); [maintenance guidance](../agents/maintenance.md) |
| Opened | 2026-10-31 |
| Verification | Tool/documentation checks · 2026-10-31 · 59 fixtures, template consistency and backlog/archive preservation passed; Merged CI · 2026-10-31 · #52 run 41223980633 and #53 run 41226326072 passed; publication · Pending |
| Publication verification | 2026-10-31 · annotated [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1) at 7a81b93; [publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) all steps passed; [#57](https://github.com/voidbrain/project-harness/pull/57). |
| Closure maintenance | [#58](https://github.com/voidbrain/project-harness/pull/58) |
| Reviewed | 2026-10-31 |

</details>

---

### F-028

**Consolidate redundant rules without weakening starting requirements**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None; verified and closed on the published v3.1.1 release.

| | |
|---|---|
| **Issue** | Repeated rules and procedural conflicts need periodic review while all applicable rules remain known from the start. |
| **Reproduce** | Follow the maintenance guide; run the new helper fixtures and review the application/audit procedure. |
| **Check** | Audit/event-triggered review records old/new ownership, requirements and exceptions; duplicates may become pointers; age or rare use never automatically removes safeguards; no reduced-rule tier. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Verified and closed 2026-10-31: annotated v3.1.1 points to approved main commit 7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031; publication run 41243779205 passed every verify/publish step. No remaining action. Prior implementation/publication path (historical): Follow-up in [#53](https://github.com/voidbrain/project-harness/pull/53). Additional request 2026-10-31: enforce maintenance review in session/CI, automate elapsed timing, and turn justified recurring findings into owned rule/tool/skill changes rather than silent self-modification. Implemented baseline in [#52](https://github.com/voidbrain/project-harness/pull/52). Run template/backlog/helper checks; inspect all PR checks, merge only when green, then publish cumulative v3.1.1 from verified main. Close on this repository’s own published release; consumer adoption is separate.

**Estimates:** No remaining effort; ~100% complete, after observed tag publication. Prior estimate (historical): Small remaining effort; ~90% complete. Implementation and documentation exist; baseline helpers passed merged #52 CI; the extended suite passes 64 fixtures; automatic timing/enforcement and quality policy now have regression checks; CI passed; cumulative 3.1.1 publication remains. Reassessed 2026-10-31. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#52](https://github.com/voidbrain/project-harness/pull/52); [maintenance guidance](../agents/maintenance.md) |
| Opened | 2026-10-31 |
| Verification | Tool/documentation checks · 2026-10-31 · 59 fixtures, template consistency and backlog/archive preservation passed; Merged CI · 2026-10-31 · #52 run 41223980633 and #53 run 41226326072 passed; publication · Pending |
| Publication verification | 2026-10-31 · annotated [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1) at 7a81b93; [publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) all steps passed; [#57](https://github.com/voidbrain/project-harness/pull/57). |
| Closure maintenance | [#58](https://github.com/voidbrain/project-harness/pull/58) |
| Reviewed | 2026-10-31 |

</details>

---

### F-029

**Risk-based incremental quality and optional coverage non-regression**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None; verified and closed on the published v3.1.1 release.

| | |
|---|---|
| **Issue** | Coverage must guide quality improvements without arbitrary growth targets or a PR approving its own lowered baseline. |
| **Reproduce** | Enable coverage.enforce in a fixture; lower measured coverage and edit the PR baseline; run coverage-table --check. Also test disabled mode and missing evidence. |
| **Check** | Enforced checks compare against origin/main and fail regressions/missing comparable data; existing warning mode remains compatible. Policy requires changed-behavior tests and risk-based improvements, not percentage increases for every PR. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Verified and closed 2026-10-31: annotated v3.1.1 points to approved main commit 7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031; publication run 41243779205 passed every verify/publish step. No remaining action. Prior implementation/publication path (historical): Coverage enforcement is opt-in per owning project and uses its configured tolerance; no OpenBando gate/threshold was silently adopted. Unit/browser/security quality evidence remains separate. Publish from this repository's verified main, then close on its own tag; consumer adoption is independent.

**Estimates:** No remaining effort; ~100% complete, after observed tag publication. Prior estimate (historical): Small remaining effort; ~90% complete. Implementation/fixtures and documented policy exist; CI passed; publication remains. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#53](https://github.com/voidbrain/project-harness/pull/53) |
| Opened | 2026-10-31 |
| Verification | Tool/documentation checks · 2026-10-31 · regression, edited-PR baseline bypass and missing-data fixtures passed; Merged CI · 2026-10-31 · #53 run 41226326072 passed; publication · Pending |
| Publication verification | 2026-10-31 · annotated [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1) at 7a81b93; [publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) all steps passed; [#57](https://github.com/voidbrain/project-harness/pull/57). |
| Closure maintenance | [#58](https://github.com/voidbrain/project-harness/pull/58) |
| Reviewed | 2026-10-31 |

</details>

---

### F-030

**Define comprehensive periodic audits and scope-aware dated findings**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None; verified and closed on the published v3.1.1 release.

| | |
|---|---|
| **Issue** | Broad audit instructions omit a consistent inspection/output contract; a recent narrow report currently masks stale full-area coverage. |
| **Reproduce** | Add a fresh harness-only manifest beside an old full report and run audit freshness; inspect which areas refresh. Exercise full reports with missing/blocked evidence. |
| **Check** | Full audits require all eight areas; scoped reviews affect only declared areas, blocked results do not refresh coverage, historical prose is not guessed. Reports are dated and classify bugs, missing work, clues, annotations and value-based proposals with owned actionable tracking. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Verified and closed 2026-10-31: annotated v3.1.1 points to approved main commit 7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031; publication run 41243779205 passed every verify/publish step. No remaining action. Prior implementation/publication path (historical): [#54](https://github.com/voidbrain/project-harness/pull/54) adds the shared procedure, scope validator, startup/CI/daily integration and dated report with explicit findings and limits. Validate the fixtures, inspect merged CI and publish the owned cumulative release. New optional tools/suggestions do not authorize unrelated feature work or depend on consumer adoption.

**Estimates:** No remaining effort; ~100% complete, after observed tag publication. Prior estimate (historical): Small remaining effort; ~90% complete. Implementation/reporting contract exists; 70 fixtures and template/backlog checks pass; CI passed; publication remains. Estimated 2026-10-31; not acceptance evidence.

| Field | Value |
|---|---|
| PR / evidence | [#54](https://github.com/voidbrain/project-harness/pull/54); [audit procedure](../agents/audit.md) |
| Opened | 2026-10-31 |
| Verification | Automated · 2026-10-31 · 70 fixtures and #54 CI run 41227408819 passed; publication · Pending |
| Publication verification | 2026-10-31 · annotated [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1) at 7a81b93; [publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) all steps passed; [#57](https://github.com/voidbrain/project-harness/pull/57). |
| Closure maintenance | [#58](https://github.com/voidbrain/project-harness/pull/58) |
| Reviewed | 2026-10-31 |

</details>

---

<a id="archive-week-2026-11-02"></a>
## Closed 2026-11-06

### F-040

**Publish the harness under the MIT licence**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-06: v3.2.1 tagged and GitHub detects MIT.

| | |
|---|---|
| **Issue** | Owner decision 2026-11-06: the repository is public but had no licence, so by default nobody could legally adopt or adapt it. MIT chosen over Apache-2.0: harness files are copied and edited in every project, and Apache-2.0 would require marking each modified file. |
| **Reproduce** | Open the repository on GitHub: no licence detected; no `LICENSE` file. |
| **Check** | `LICENSE` holds the MIT text with the copyright holder; `package.json` declares `MIT`; the README states what copying projects keep; release 3.2.1 is tagged on GitHub and GitHub detects the licence. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-06: PR #64 merged after CI passed (run 42300639890, ci:status); tag v3.2.1 pushed; `gh repo view` reports MIT License. Patch release 3.2.1 (no project action). Close once the v3.2.1 tag is on GitHub and the repository page shows MIT. A notice header in each copied tool is not part of this change.

**Estimates:** Done; ~100%. Reassessed 2026-11-06 after the tag.

| Field | Value |
|---|---|
| PR / evidence | [PR #64](https://github.com/voidbrain/project-harness/pull/64); owner decision 2026-11-06 |
| Opened | 2026-11-06 |
| Verification | 2026-11-06 Documentation: PR #64 CI check passed (run 42300639890); v3.2.1 tag on GitHub; repository licence detected as MIT. |
| Reviewed | 2026-11-06 |

</details>

---

### F-039

**Weekly closure recaps in yearly backlog archives**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: released as v3.2.0 after green template CI.

| | |
|---|---|
| **Issue** | Archived records have no weekly closure index. NERV Agency requested Monday–Sunday recaps at the top with links to the start of each closing cohort. |
| **Reproduce** | Open a yearly archive containing closures across several weeks; navigate and count them manually. |
| **Check** | An optional tool derives per-week feature/bug closure counts from closing dates and links to stable section anchors. The checked generated index can refresh without permitting historical record edits. Malformed/stale/forged blocks, unsafe destinations and invalid dates fail; non-adopters need no migration. Release acceptance uses only template-owned fixtures and the published tag. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-06 in [PR #63](https://github.com/voidbrain/project-harness/pull/63) after PR #62 CI run 42283633421 passed check and the v3.2.0 tag was pushed. Template-owned fixtures and release acceptance passed; no consumer adoption is required.  Implemented core/tools/archive-recap.mjs, strict derived-block validation in check-backlog, adoption guidance and fixtures for week/year boundaries, idempotence, unsafe output preflight and unchanged history. Optional minor release 3.2.0; NERV adoption belongs to its own record and is not a release gate.

**Estimates:** Small remaining effort; ~100% complete. Estimated 2026-11-06: implementation and focused fixtures pass; Full local checks passed; CI and tag remain. Timed template reconciliation overlaps the NERV documentation inspection in the same session; elapsed wall time includes that work and waits and is not a comparable implementation-only measure.

| Field | Value |
|---|---|
| PR / evidence | [PR #62](https://github.com/voidbrain/project-harness/pull/62) release 3.2.0;  Owner request from NERV Agency, 2026-11-06 |
| Opened | 2026-11-06 |
| Verification | 2026-11-06 PR #62 CI check passed (run 42283633421); published v3.2.0 tag verified. |
| Reviewed | 2026-11-06 |

</details>

---

### F-038

**Coverage for test runners that write only LCOV (the Node test runner)**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P3 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />None: released as v3.2.0 after green template CI.

| | |
|---|---|
| **Issue** | `coverage-table.mjs` reads the json-summary that Istanbul / V8 reporters write; the Node test runner writes only LCOV, so a Node backend project (NERV Agency, F-055) could not follow the coverage rule without its own converter. |
| **Reproduce** | Run `node --test --experimental-test-coverage` with the LCOV reporter: no coverage-summary.json for the table. |
| **Check** | An optional copied tool turns LCOV into the json-summary for the configured folders, adds untested sources at zero, leaves test files and files outside the folders out; APPLY gives the scripts and CI steps; a template test covers it. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-06 in [PR #63](https://github.com/voidbrain/project-harness/pull/63) after PR #62 CI run 42283633421 passed check and the v3.2.0 tag was pushed. Template-owned fixtures and release acceptance passed; no consumer adoption is required.  Added in [PR #61](https://github.com/voidbrain/project-harness/pull/61) (2026-11-05): `core/tools/lcov-summary.mjs` (copied, optional), APPLY coverage guidance for the Node test runner, README row, changelog entry, test in tools/test-tools.mjs. Taken from NERV Agency's F-055 (owner decision 2026-11-05: move the converter to the template), made generic (folders and the LCOV path from `.harness.json`).

**Estimates:** Small remaining effort; ~100% complete. Estimated 2026-11-05.

| Field | Value |
|---|---|
| PR / evidence | [PR #62](https://github.com/voidbrain/project-harness/pull/62) release 3.2.0;  NERV Agency F-055 ([voidbrain/nerv#138](https://github.com/voidbrain/nerv/pull/138)) |
| Opened | 2026-11-05 |
| Verification | 2026-11-06 PR #62 CI check passed (run 42283633421); published v3.2.0 tag verified. |
| Reviewed | 2026-11-05 |

</details>

---

## Closed 2026-11-07

### F-032

**Optional browser and combined coverage contracts**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P3 | Closed | 🔴 Large | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.3.0 tagged on GitHub.

| | |
|---|---|
| **Issue** | Accepted optional template capability was planned only in OpenBando F-039; reusable contracts and helpers belong here. |
| **Reproduce** | Compare the current unit-only coverage helper with the accepted browser/combined coverage request. |
| **Check** | Unconfigured projects keep current output; configured fixtures collect Chromium coverage, map source files, merge unit/browser coverage and report separate/combined figures without double counting. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#70](https://github.com/voidbrain/project-harness/pull/70) merged on green [CI 42314461338](https://github.com/voidbrain/project-harness/actions/runs/42314461338); `v3.3.0` tagged on `main` (a0ae25e) and pushed. Earlier: Implemented 2026-11-07: copied tool `core/tools/browser-coverage.mjs`. Contracts: `coverage.browser` { raw, summary } (raw: Playwright `stopJSCoverage()` entries with their source maps) and `coverage.combined` { summary } with the unit LCOV (`coverage.lcov`). A Playwright collector (`startBrowserCoverage`, `stopBrowserCoverage`; Chromium only, and it says so for other browsers) saves V8 coverage and fetches external source maps; the tool decodes source maps, maps V8 block counts to original lines under `coverage.folders`, counts a script seen in several runs as one file, lists unmatched sources and unmapped scripts instead of guessing, and writes browser and combined summaries (a line covered when either ran it, counted once). `coverage-table.mjs` prints, writes and checks a browser and a combined table with their own baseline keys (`browser:`/`combined:`) and the same drop rule; a configured summary that is missing is reported and fails under enforce; unconfigured output is unchanged (existing fixtures). Coverage guide, README, APPLY and CHANGELOG describe it. `tools/test-browser-coverage.mjs` (7 tests): mapping, block counts, duplicates, mismatches, missing artifacts and LCOV, combined count, tables and baselines, a drop and enforcement, adoption under enforce and a removed setting, source matching rules, LCOV through a symlink, and the collector against a fake Playwright page. A real Chromium run is not part of the fixtures (no browser dependency here). Verify on the merged PR's green CI; close when v3.3.0 is tagged. OpenBando F-039 owns its own integration.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after the tag.

| Field | Value |
|---|---|
| PR / evidence | [#70](https://github.com/voidbrain/project-harness/pull/70); [OpenBando F-039](https://github.com/voidbrain/openbando/blob/main/docs/BACKLOG.md#f-039); [#59](https://github.com/voidbrain/project-harness/pull/59) records ownership. Review: code-review skill (medium, forked context) 2026-11-07, 10 findings, all fixed in the PR (enforce adoption and removed settings; LCOV through symlinks; sourceRoot joining; no bare-name suffix match; bundler and virtual sources; combined on the unit run's executable lines; one run file per call without sourcesContent; one raw file in memory at a time and each map decoded once; coverage.folders required; receipt refreshed last) |
| Opened | 2026-10-31 |
| Verification | Script · 2026-11-07 · [#70](https://github.com/voidbrain/project-harness/pull/70) merged on green [CI 42314461338](https://github.com/voidbrain/project-harness/actions/runs/42314461338) (check:template, test:tools with 7 browser-coverage tests, check:rules, check:backlog, maintenance); no real Chromium run (fixtures use a hand-built bundle and a fake Playwright page) |
| Reviewed | 2026-11-07 |

</details>

---

### F-033

**Executable guards for the rules agents must never break**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟡 Medium | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.3.0 tagged on GitHub.

| | |
|---|---|
| **Issue** | The never/ask-first rules (no push to `main`, no force-push or history rewrite, archives only grow, no deleting branches the agent did not create) are prose; only branch protection enforces any of them, and only on the server. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): skills and instructions are advisory, critical rules need hooks. |
| **Reproduce** | In a consumer, `git push origin HEAD:main` from a feature branch, or `git push --force`: nothing local stops it before GitHub does (and nothing at all on a repository without protection). |
| **Check** | One guard script (no dependency on any agent platform) refuses a push to the default branch, a force-push and a change that removes or edits a line of an archive already on the default branch, with the rule it enforces; installed as a git `pre-push` hook by an opt-in setup step; an optional adapter runs the same script as a Claude Code `PreToolUse` hook (exit code 2), so other agents and plain git get the same rule; `check:harness` reports whether the guard is installed; tests cover each refusal and an allowed push. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#67](https://github.com/voidbrain/project-harness/pull/67) merged on green [CI 42310176675](https://github.com/voidbrain/project-harness/actions/runs/42310176675); `v3.3.0` tagged on `main` (a0ae25e) and pushed. Earlier: Implemented 2026-11-07: `core/tools/guard.mjs` (copied; Node and git only) refuses a push to the default branch, a force-push (a remote branch rewound or replaced; deleting another branch stays allowed), a published tag moved or deleted, and a push whose archives drop or change a line that was on the default branch where the branch left it, each citing its AGENTS or BACKLOG-RULES rule. It is installed opt-in as the git pre-push hook (`guard:install`, never replacing another hook); the optional Claude Code PreToolUse adapter (`guard.mjs claude`, exit code 2) refuses forced or default-branch `git push` commands and Edit/MultiEdit/Write calls that remove an archive line. Owner-approved exceptions run with `HARNESS_GUARD_ALLOW=<rule>`. `check-harness` reports an adopted guard not installed in the clone. AGENTS (both) carry one line that cites the rules; APPLY has the setup step and the adapter snippet; README and CHANGELOG list it. `tools/test-guard.mjs` covers each refusal, the allowed pushes, the exception, a branch older than main, the adapter and the check-harness report, a remote not named origin, quoted (`bash -c`, `eval`) and implicit (`git push` on main) pushes and recap edits. Verify on the merged PR's green CI; close when v3.3.0 is tagged. Not installed in this clone: installing is the owner's choice.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after the tag.

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
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.3.0 tagged on GitHub.

| | |
|---|---|
| **Issue** | B- records have a Reproduce field, but nothing asks that it becomes a test before the fix. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): commit the failing test first, then fix without editing it. NERV #96 did this (the test failed without the fix) and it pinned a race no review had found. |
| **Reproduce** | Close a B- record whose PR changes code but adds no test: nothing objects. |
| **Check** | BACKLOG-RULES says a B- fix commits a test that fails without the fix (or records why none can, e.g. a visual or device-only defect, with the manual check instead); the record names the test; `check:backlog` warns on a Verified or Closed B- record that names no test and no reason; template fixtures cover both. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#66](https://github.com/voidbrain/project-harness/pull/66) merged on green [CI 42308464563](https://github.com/voidbrain/project-harness/actions/runs/42308464563); `v3.3.0` tagged on `main` (a0ae25e) and pushed. Earlier: Implemented 2026-11-06: BACKLOG-RULES (template and this repository) has "A bug fix starts with a failing test" (test committed first, not edited by the fix; `Test: …` or `No test: …` on the record); both AGENTS files point to it; `check:backlog` warns on a Verified or Closed B- record with neither, only for a record a branch makes done (older done records are not flagged), as an escaped GitHub annotation in CI. A fixture covers the warning, both accepted forms and the annotation; it failed before the check existed. Verify on the merged PR's green CI; close when v3.3.0 is tagged. Optional later: a guard (F-033) that refuses edits to that test file during the fix commits.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after the tag.

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
| 🔵 | ◻️ P3 | Closed | 🔴 Large | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.3.0 tagged on GitHub.

| | |
|---|---|
| **Issue** | Tools check records and files, not whether an agent following AGENTS.md behaves as intended (asks before a 🧑 decision, names the PR instead of "this PR", files a bug as B-, keeps unrelated code, reports a failing test honestly). Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21) recommends 20–50 cases rerun whenever CLAUDE.md, skills or hooks change; start with about ten. |
| **Reproduce** | Change a rule in core/AGENTS.md; nothing tells whether agents still follow the old and new rules. |
| **Check** | About ten scenarios, each a fixture repository, a task and a grader that reads the result (files, records, commits, refusals) without a model; runnable on demand and when core/AGENTS.md, BACKLOG-RULES or skills change, never on every PR by default (cost); each scenario run several times, results compared per scenario, not only as a total; a finding from an audit or a real mistake can be added as a scenario. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#69](https://github.com/voidbrain/project-harness/pull/69) merged on green [CI 42312513742](https://github.com/voidbrain/project-harness/actions/runs/42312513742); `v3.3.0` tagged on `main` (a0ae25e) and pushed. Earlier: Implemented 2026-11-07: copied tool `core/tools/behaviour.mjs` with ten scenarios (ask before a 🧑 decision, name the PR, a bug is a B- record, keep unrelated code, report a failing test, no push to main, archives only grow, failing test first, a plan becomes a record, copied tool untouched). Each builds a fixture repository from the project's own rule files (`behaviour.rules`; here the template's core files, placeholders neutralised), a tiny Node project and a bare remote, and grades the result without a model. `list`, `prepare`, `grade` and `run` (`--scenarios`, `--times`, `--runner`, `--keep`, `--json`); `run` reports passes per scenario, never only a total. The runner is the project's choice (`behaviour.runner`); the template names none, and this repository sets none (choosing an agent and its permissions for a throwaway fixture is the owner's call). A runner that fails to start, exits non-zero or times out (`behaviour.timeoutMs`; its whole process group is stopped) is a failed run, never graded. Rerun on demand and when the rule files the fixture copies change: an impact-map row here, an AGENTS trigger row, the procedure in the maintenance guide; never in PR CI by default. `tools/test-behaviour.mjs` checks every grader passes a rule-following example and fails a typical mistake (`tools/behaviour-examples.mjs`), and `run` with a scripted runner (14 tests). No real agent run is claimed. Verify on the merged PR's green CI; close when v3.3.0 is tagged.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after the tag.

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
| 🔵 | ◻️ P3 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.3.0 tagged on GitHub.

| | |
|---|---|
| **Issue** | The agent that wrote a change also certifies it. Source: Anthropic, *The AI-native SDLC playbook* (2026-08-21): a separate reviewer pass (bugs, security, compliance with the record), which can never approve or merge. |
| **Reproduce** | Open a P1 fix or a harness-file change: no second look is required before merge. |
| **Check** | AGENTS/BACKLOG-RULES: a PR that closes a P1 record or changes a harness file gets a review in a fresh context (a review skill or a separate session), its findings fixed or answered in the PR; the record cites it; the reviewer never approves or merges; small and documentation-only changes are exempt. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#66](https://github.com/voidbrain/project-harness/pull/66) merged on green [CI 42308464563](https://github.com/voidbrain/project-harness/actions/runs/42308464563); `v3.3.0` tagged on `main` (a0ae25e) and pushed. Earlier: Implemented 2026-11-06: BACKLOG-RULES (template and this repository) has "Independent review" (a fresh-context review of a PR that closes a P1 record or changes a harness file; `Review: …` or `No review: …` on the record; the reviewer never approves or merges; documentation-only and small changes exempt); both AGENTS files point to it; `check:backlog` warns on a P1 record made done with neither, and `check:freshness` reminds a branch that changes harness files. Shares F-034's fixture. Verify on the merged PR's green CI; close when v3.3.0 is tagged.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after the tag.

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
| 🔵 | ◻️ P2 | Closed | 🟡 Medium | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.3.0 tagged on GitHub.

| | |
|---|---|
| **Issue** | Owner decision 2026-11-05: keep the safety rules always loaded and let procedures load when needed. Today AGENTS.md carries both, so every session loads every procedure (Anthropic, *When to fold subagents into your main agent loop* (2026-10-22): progressive disclosure; the playbook: CLAUDE.md under a page). The rule "all applicable rules must be known and followed from the start; shorter indexes never defer requirements" stays: what moves out is how to do a task, never what is allowed. |
| **Reproduce** | Count the lines of core/AGENTS.md a session loads before its first task. |
| **Check** | AGENTS.md keeps every never/ask-first rule, the checks before finishing and a one-line trigger per procedure ("before X, read Y"); procedures (reconciling, audits, maintenance review, impact map, releasing) live in their docs; a check fails if a never/ask-first rule exists only in a procedure document; APPLY.md reconciles consumers without losing project lines; consumers keep their `<!-- project -->` lines. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#68](https://github.com/voidbrain/project-harness/pull/68) merged on green [CI 42311372002](https://github.com/voidbrain/project-harness/actions/runs/42311372002); `v3.3.0` tagged on `main` (a0ae25e) and pushed. Earlier: Implemented 2026-11-07: core/AGENTS.md (134 → 115 lines) and this repository's AGENTS.md (103 → 91) keep the never and ask-first rules in a `<!-- safety:start -->`/`<!-- safety:end -->` block, the checks before finishing and a "Procedures: read before the task" table with one trigger per procedure. Moved out unchanged in substance: code coverage to the new copied guide `docs/agents/coverage-guide.md`, the impact map to `docs/agents/change-impact.md`, and the capability, MCP, solution, skills, maintenance and audit paragraphs to an "In short" section of their guides (a script checked that this repository's paragraphs equalled the template's before moving them). "All applicable rules must be known and followed from the start", the safeguard never-rule and the session-start inspection of `.harness.json` stay in AGENTS; the moved guides are maintenance inputs. New copied tool `check-rules.mjs` (`check:rules`, CI here and in the Angular workflow; `check:template` runs it on `core/`) fails on a missing safety block, an ask-first or never rule that only a procedure holds, and an AGENTS link that leads nowhere; warns past `rules.maxLines`. APPLY (3.3.0) says how consumers move sections and keep `<!-- project -->` lines. `tools/test-rules.mjs` covers each case. Verify on the merged PR's green CI; close when v3.3.0 is tagged. F-035 can now test this layout.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after the tag.

| Field | Value |
|---|---|
| PR / evidence | [#68](https://github.com/voidbrain/project-harness/pull/68); owner decision 2026-11-05 ([#60](https://github.com/voidbrain/project-harness/pull/60) records). Review: code-review skill (medium, forked context) 2026-11-07, 10 findings, all fixed in the PR (the safeguard never-rule and the session-start inspection stay in AGENTS; moved guides are maintenance inputs; check-rules matches labels mid-paragraph, whole sentences and real citations, root globs; no link to a generated page; this repository does not copy the coverage guide it has no use for; receipt refreshed last) |
| Opened | 2026-11-05 |
| Verification | Script · 2026-11-07 · [#68](https://github.com/voidbrain/project-harness/pull/68) merged on green [CI 42311372002](https://github.com/voidbrain/project-harness/actions/runs/42311372002) (check:template, test:tools, check:rules, check:backlog, maintenance) |
| Reviewed | 2026-11-07 |

</details>

---

### F-041

**Skill review checklist from the OWASP Agentic Skills Top 10**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.4.0 tagged and published on GitHub.

| | |
|---|---|
| **Issue** | `docs/agents/skills.md` asks to inspect a candidate skill's instructions, scripts, dependencies, licence and access, but gives no list of what to look for. The [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/) (AST10) catalogues the risks of agent skills (SKILL.md, Claude Code, Cursor/Codex, VS Code), prompted by a skill registry poisoned at scale. |
| **Reproduce** | Review a third-party skill with the current guidance: nothing prompts a check for hidden instructions, over-broad tool access, network calls in bundled scripts or an unpinned upstream. |
| **Check** | The shared skills guide maps each of AST01–AST10 to a concise review check and names the checked IDs plus source, revision/date, purpose, limits and fallback in the review record. It describes AST10 as draft guidance while OWASP's project materials disagree on release status. APPLY carries the checklist into skill review. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325); annotated `v3.4.0` tagged on `main` (`a2c90f5`) and pushed. The shared skills guide now includes the AST01–AST10 checklist, records checked IDs and review provenance, and preserves the draft-status caveat.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after release; all acceptance checks passed.

| Field | Value |
|---|---|
| PR / evidence | [#73](https://github.com/voidbrain/project-harness/pull/73) implementation; [#74](https://github.com/voidbrain/project-harness/pull/74) closure/archive; [#72](https://github.com/voidbrain/project-harness/pull/72) records. Review: independent fresh-context code review found no significant issues. |
| Opened | 2026-11-07 |
| Verification | Script · 2026-11-07 · [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325) (template consistency, fixture suite, integration metadata, audit, rules, backlog and maintenance checks); `v3.4.0` tag pushed. Documentation · AST01–AST10 checklist and draft-status source reviewed. |
| Reviewed | 2026-11-07 |

</details>

---

### F-042

**CI templates reviewed against the OWASP Top 10 CI/CD Security Risks, with a dependency SBOM**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟡 Medium | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.4.0 tagged and published on GitHub.

| | |
|---|---|
| **Issue** | The workflows the harness ships (`core/.github/workflows/maintenance.yml`, the Angular CI workflow) were never reviewed against a published CI/CD risk list, and consumers get no bill of materials of their dependencies. |
| **Reproduce** | Read the workflows against the [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/): job token permissions, actions pinned by tag rather than commit, behaviour on pull requests from forks, and how the lockfile is installed are not stated anywhere as reviewed. |
| **Check** | A dated review maps all ten CICD-SEC risks to covered, fixed or not applicable with reasons and limits. Shipped workflows use only `contents: read`, pin actions to verified commit SHAs with release comments, avoid `pull_request_target` and secret references, use `npm ci` where a lockfile is required, and attach `npm sbom --sbom-format cyclonedx` artifacts to root and Angular Node CI. `check:template` enforces these workflow contracts; APPLY documents manual pin updates. [SPVS](https://owasp.org/www-project-spvs/) is a reference, not a certification. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325); annotated `v3.4.0` tagged on `main` (`a2c90f5`) and pushed. The shipped workflows use least privilege, verified commit-pinned actions, and SBOM generation/upload; `check:template` enforces these contracts. APPLY documents manual action-pin verification; no stale-pin checker is claimed.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after release; all acceptance checks passed.

| Field | Value |
|---|---|
| PR / evidence | [#73](https://github.com/voidbrain/project-harness/pull/73) implementation; [#74](https://github.com/voidbrain/project-harness/pull/74) closure/archive; [#72](https://github.com/voidbrain/project-harness/pull/72) records. Review: independent fresh-context code review found no significant issues. |
| Opened | 2026-11-07 |
| Verification | Script · 2026-11-07 · [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325) (template consistency, fixture suite, backlog, maintenance and audit checks); CycloneDX SBOM generation/upload passed; broadened-permission probe failed as required; `v3.4.0` tag pushed. Documentation · all ten CICD-SEC risks reviewed. |
| Reviewed | 2026-11-07 |

</details>

---

### F-043

**Audits cite stable security references: OpenCRE and version-pinned standard IDs**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔵 | ◻️ P3 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />Closed 2026-11-07: v3.4.0 tagged and published on GitHub.

| | |
|---|---|
| **Issue** | Audit findings name security concerns in free text, so two audits or two projects cannot be compared, and a reader cannot follow a finding to the requirement behind it. [OpenCRE](https://www.opencre.org/) links each Common Requirement to ASVS, AISVS, NIST, ISO and CWE sections, has a REST API and ships a local stdio MCP server over public reads. |
| **Reproduce** | Take a privacy or security finding from any consumer audit and look for a requirement ID: there is none. |
| **Check** | `docs/agents/audit.md` allows an optional reference per finding: an OpenCRE CRE ID or version-pinned standard ID (for example `v1.01-C9.4.3` for AISVS), never an unpinned one, and states that a reference is context, not a compliance claim. The catalogue pins OpenCRE's source revision and stdio transport; the review confirms only public GET tools are enabled by default and instructs users to leave authenticated tools disabled. The public REST API is the fallback. `check:audits` does not require the optional reference. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Closed 2026-11-07: [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325); annotated `v3.4.0` tagged on `main` (`a2c90f5`) and pushed. The audit guide now allows optional OpenCRE CRE or version-pinned standard references as context only. OpenCRE's official source was reviewed at `ace5f0bdc4031ed805fd550d13f6a5931a91606d`; its local stdio server defaults to public GET tools, while authenticated tools (including one write) require explicit opt-in. The catalogue tells users to keep that opt-in unset and names the public REST API as fallback.

**Estimates:** Done; ~100%. Reassessed 2026-11-07 after release; all acceptance checks passed.

| Field | Value |
|---|---|
| PR / evidence | [#73](https://github.com/voidbrain/project-harness/pull/73) implementation; [#74](https://github.com/voidbrain/project-harness/pull/74) closure/archive; [#72](https://github.com/voidbrain/project-harness/pull/72) records. Review: independent fresh-context code review found no significant issues. |
| Opened | 2026-11-07 |
| Verification | Script · 2026-11-07 · [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325) (template consistency, fixture suite, integration metadata, audits and backlog checks); `v3.4.0` tag pushed. Documentation · OpenCRE source revision and stdio/public-read boundary reviewed. |
| Reviewed | 2026-11-07 |

</details>

---


## Closed 2026-11-07

### F-044

**Linked prerequisites and generated unlocks**

| Signal | Priority | Status | Effort | Complete |
|---|---|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small | ~100% |

💻 **→ Human action required: No**<br />No action remains; v3.5.0 is published.

| | |
|---|---|
| **Issue** | Prerequisites hidden in prose make sequencing and downstream impact hard to inspect. |
| **Reproduce** | Read backlog records with prerequisites; finding their dependents requires a text search. |
| **Check** | One maintained linked Depends on field with required outcomes; generated Unlocks; missing/local duplicate/self/cycle validation; archive/reopen and qualified external-reference fixtures; optional adoption; independent review, green CI and published tag. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-07: v3.5.0 published after PR #75 merged on green CI 42372844701. Implemented the optional generator and check with eight owned fixtures and documentation; 118 tests passed. Fresh-context review found dangling output symlink and archived-link relocation defects; both fixed and covered. Review: separate fresh-context agent review; two findings fixed; recheck passed with no remaining actionable findings. Release acceptance uses this repository alone. Close after v3.5.0 is remotely published; consumer adoption is not a release gate.

**Estimates:** 2026-11-07: Small, ~100%; implementation, review recheck, 118 tests, CI and remote release publication complete.

| | |
|---|---|
| PR / evidence | [PR #76](https://github.com/voidbrain/project-harness/pull/76) release evidence;  [PR #75](https://github.com/voidbrain/project-harness/pull/75) implementation, eight dependency fixtures and fresh-context review |
| Opened | 2026-11-07 |
| Verification | Script: 2026-11-07, 118 tests passed; template/backlog/rules/dependencies/integrations/archive/audit checks passed. CI 42372844701 passed; v3.5.0 tag verified remotely. |
| Reviewed | 2026-11-07 |

</details>

---

### F-045

**Remaining-effort backlog format and a transparent prioritized work queue**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />None: release acceptance passed and v4.0.0 is published.

| | |
|---|---|
| **Issue** | Completion percentages overlap with remaining-effort estimates and imply precision. Projects need a reusable work-order view that can deliberately prioritize records while preserving human cues, dependencies and source ownership. |
| **Reproduce** | Compare percentage and remaining-effort fields, then choose the next record from a ledger with explicit ordering, open prerequisites, human decisions and roadmap placements. |
| **Check** | Active four-column records retain remaining effort/rationale and acceptance safeguards; published archives remain unchanged/readable. Optional queue has explicit record order/reason, impact priority, roadmap context, direct dependents and effort with visible reasons; human/blocker/prerequisite lanes remain separate. No source mutations, weighted score, completion percentage or inferred authorization. Owned fixtures, rule/reader/CI/docs compatibility, independent review, green CI and published v4.0.0 tag. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-07: v4.0.0 published at bdec31f after green PRs #77/#78. The major release requires active-record migration, with historical archives preserved. Validate using owned fixture repositories only; release acceptance has no consumer adoption gate. Review all affected rule text/readers and run the configured behavior runner if present (none configured here).

**Estimates:** No remaining release work. Historical estimate: Medium. Estimated 2026-11-07 from rule/validator/reader compatibility, safe queue generation, review and release work; no token estimate is inferred.

| Field | Value |
|---|---|
| Queue order | 1 — Owner-requested harness release |
| PR / evidence | [PR #79](https://github.com/voidbrain/project-harness/pull/79) closure reconciliation; [PR #77](https://github.com/voidbrain/project-harness/pull/77); 127 tool tests passed; fresh-context review correction verified with no remaining findings |
| Opened | 2026-11-07 |
| Verification | 2026-11-07: 127 tool tests pass, including template-application joins and historical readers. Review: separate fresh-context reviewer found one six-column unavailable-row defect, fixed with regression; re-review reports no remaining actionable findings. No agent-behavior runner configured; scenario executions not claimed. PR #77 CI 42397531754 passed. [PR #78](https://github.com/voidbrain/project-harness/pull/78) corrects the remaining active-table width wording; PR #78 CI 42397672129 passed; annotated v4.0.0 tag published at bdec31f. |
| Reviewed | 2026-11-07 |

</details>

---

## Closed 2026-11-08

### F-046

**Optional scoped verification and full-suite freshness**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | — |

💻 **→ Human action required: No**<br />No release work remains; v4.1.0 is published.

| | |
|---|---|
| **Issue** | Blanket repeated suites waste work; projects need explicit affected groups and trustworthy periodic full evidence. |
| **Reproduce** | Run tools/test-verification.mjs against scoped changes and mocked Actions history. |
| **Check** | Risk, request, unknown paths and stale/missing full evidence select full; partial/failed/unmerged runs cannot reset age/count. No consumer adoption gate. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-08. v4.1.0 published at a8a358e after PR #80 CI 42467435438 passed; remote annotated tag aa23409d resolves to that main commit. Preserve regression, safety, privacy and review requirements. Projects supply their adapters/settings independently.

**Estimates:** No remaining release work; consumer adoption never gates this record.

| Field | Value |
|---|---|
| PR / evidence | [PR #81](https://github.com/voidbrain/project-harness/pull/81) reviewed release closure;  [PR #80](https://github.com/voidbrain/project-harness/pull/80) implementation/release; Test: tools/test-verification.mjs; six fixtures cover routing, freshness and GitHub provenance without real model calls. |
| Opened | 2026-11-08 |
| Verification | Six local planner/real-git fixtures and template consistency pass. Review: independent fresh-context report-only review found no blockers in implementation or this release closure; requested real-git integration coverage added and passed. PR #80 CI 42467435438 passed all owned checks including the sixth fixture; remote v4.1.0 publication verified. |
| Reviewed | 2026-11-08 |

</details>

---

### F-047

**Explicit parallel tasks, evidence-based model assignment and design/procedure review**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P1 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; v4.2.0 is published.

| | |
|---|---|
| **Issue** | Concurrent agents need explicit independent work, shared ownership and honest model suitability; architecture and procedures need discoverable review paths. |
| **Reproduce** | Two clones claim overlapping work, update separate records, select an unmeasured model and inspect changed design assumptions. |
| **Check** | Exact record migration, validated task/profile contracts, one concurrent resource owner, stale/uncertain claim reconciliation without safeguard exceptions; linked procedure authorities and scoped design alternatives; independent review, green CI and published v4.2.0 tag. |

<details>
<summary>Next action, estimates and evidence</summary>

**Resolution:** Published [v4.2.0](https://github.com/voidbrain/project-harness/tree/v4.2.0) at `296cdfa` after PR #83 CI 42516530661 completed successfully; PR #82 CI 42516212268 also passed. All required release acceptance is complete.

**Historical implementation scope:** Deliver work-item source/task tooling, cooperative remote Git CAS and evidence-based model profiles, architecture reassessment and linked procedure discovery. Validate on owned fixtures, including real competing pushes with the archive guard installed. Review in a fresh context, publish the tag after green CI, then close this repository's release outcome. No downstream adoption, actual model inference, device or credential is required for acceptance.

**Estimates:** No remaining release work, reconciled 2026-11-08.

| Field | Value |
|---|---|
| PR / evidence | [PR #84](https://github.com/voidbrain/project-harness/pull/84) release closure; [PR #83](https://github.com/voidbrain/project-harness/pull/83) final pre-publication hardening; [PR #82](https://github.com/voidbrain/project-harness/pull/82) candidate optional workflow; owned fixtures and independent report-only review |
| Opened | 2026-11-08 |
| Verification | 144 owned tool fixtures passed before final link changes; 15 targeted work-item/claim contracts pass after the final changes. Test: committed migration/link regressions 3279a90, e223710 and 90bb8c1 precede their fixes, with assertions preserved. Review: fresh-context report-only review found link/reference/code-span cases; all were fixed and final inspection reports no remaining high-impact blocker. Behavior runner is unconfigured; no agent-behavior/model campaign was run. PR #82 CI 42516212268 passed; nested-definition regression 44013c1 precedes fix ed27b1a in the final follow-up. Its targeted case passes; final PR #83 CI 42516530661 passed and the v4.2.0 tag is published. |
| Reviewed | 2026-11-08 |

</details>

---




### B-015

**Empty active-record checkout fails after archival**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P1 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No release action remains.

| | |
|---|---|
| **Issue** | Git omits an empty records directory; PR #84 CI failed after archiving the final source record. |
| **Reproduce** | Migrate records, archive all sources, clone the resulting tree and run work-items check. |
| **Check** | An empty active ledger checks without a tracked directory; missing active sources still fail source/view equality; committed regression, independent review, green CI and published patch tag. |

<details>
<summary>Next action, estimates and evidence</summary>

**Resolution:** Published v4.2.1 at `490190e` after PR #84 CI 42517786923 completed successfully. No downstream adoption gate.

**Historical implementation:** Treat a missing records directory as an empty collection, preserving path safety and source/view validation. Publish v4.2.1 on main after green CI, then close this repository-owned patch.

**Estimates:** No remaining patch work, reconciled 2026-11-08.

| Field | Value |
|---|---|
| PR / evidence | [PR #85](https://github.com/voidbrain/project-harness/pull/85) patch closure; [PR #84](https://github.com/voidbrain/project-harness/pull/84); failing CI 42517514835. Test: tools/test-work-items.mjs, empty active record checkout; committed failing regression 3ffa9b8 precedes unchanged-assertion fix. |
| Opened | 2026-11-08 |
| Verification | 2026-11-08: committed regression fails with ENOENT before fix; all 17 work-item/claim fixtures and template/source/backlog checks pass. Review: fresh-context report-only review found no blocker and independently reran all 17 fixtures. Final CI 42517786923 passed; v4.2.1 tag published |
| Reviewed | 2026-11-08 |

</details>

---

### Release closure evidence addendum — 2026-11-08

[PR #86](https://github.com/voidbrain/project-harness/pull/86) records these explicit dates without rewriting published evidence.

F-047: **Closed 2026-11-08** on published v4.2.0 (`296cdfa`), after PR #83 CI 42516530661 passed. Its archived resolution and original evidence remain unchanged.

B-015: **Closed 2026-11-08** on published v4.2.1 (`490190e`), after PR #84 CI 42517786923 passed. Its archived resolution and original evidence remain unchanged.


## Closed 2026-11-09

### F-049

**Task-boundary context policy with durable handoffs and capability-aware fallback**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No remaining policy-release action; published v4.3.0. Actual host control and savings remain explicitly unverified.

| | |
|---|---|
| **Issue** | Long unrelated task histories can dilute context; clearing/compacting at every message instead can lose active work and repeatedly reload essentials. A portable harness needs safe task-boundary instructions without pretending to control every host's thread/cache API. |
| **Reproduce** | Finish one task and start an independent one, continue debugging the same task, and repeat on a host without fresh-thread/compaction tools. |
| **Check** | Optional shared policy prefers an authorized available fresh thread for independent work after persisted handoff; same-task implementation/review/CI stays together. Supported compaction preserves continuing-task state. Unavailable controls are reported without a false reset or unnecessary work stoppage. Preserve claims, pending jobs/approvals, uncertainty, privacy and authority; caching stays runtime-managed and savings unknown without measurements. Shared/root copies, adoption/stamps and review evidence agree; no host adapter or model campaign is claimed. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Owner requested the portable rule2026-11-09. [Task context](../agents/task-context.md) and AGENTS/procedure triggers define handoff and continuity, distinct fresh-thread/compaction/cache operations, duplicate-worker/unknown-ack reconciliation and capability-limited fallback. This release is procedural agent guidance, not an executable host adapter, automatic clearing service or guaranteed usage reduction. Shared release accepted after PR88 exacthead2f9329e / CI42611729777 passed, mergedmain889f1e7, published v4.3.0. Closed 2026-11-09; consumer adoption is independent.

Preserved requirements: existing AGENTS safety/ownership/evidence, all starting applicable procedures, privacy and cost/approval boundaries, active work/claim recovery, independent review and green merges. No rule is retired or weakened to save tokens. Current session exposes no thread-start/compaction control. Behavior runner is unconfigured: live rule-following/host-transition/savings evidence remains unrun, never inferred from text checks. F-048 retains actual usage accounting, not this record's completion gate.

**Estimates:** Small remaining effort, estimated2026-11-09: shared guide/trigger implementation exists; independent review, all150 owned fixtures and CI passed; release complete, no remaining owned policy work. Timing uses an isolated worktree's final governing-input reconciliation/validation, excluding earlier source discovery; an existing measurement session in the original checkout is preserved untouched. No token savings estimate is inferred.

| Field | Value |
|---|---|
| PR / evidence | [PR #88](https://github.com/voidbrain/project-harness/pull/88); Release acceptance: [PR #89](https://github.com/voidbrain/project-harness/pull/89); Review: [fresh-context report](../reviews/2026-11-09-task-context-independent.md), no blocking findings, all governing requirements preserved; no host API or behavior-runner execution. |
| Opened | 2026-11-09 |
| Verification | Documentation: policy/ownership/capability assessment recorded; template/rule/work/backlog checks and all150 deterministic fixtures passed; current input-bound maintenance receipt and CI42611729777 passed before publication. Host transition and actual token savings unverified. |
| Reviewed | 2026-11-09 |

</details>

---

## Closed 2026-11-10

### F-050

**Upfront feature steps, effort and step-level work evidence**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 4.5.0 is published.

| | |
|---|---|
| **Issue** | Features need an initial delivery plan before implementation, rather than revealing only the next step after the previous one finishes. |
| **Reproduce** | Open a feature and ask for all anticipated steps, effort per step, completion and attributable work/usage evidence. |
| **Check** | Optional generated plans list stable steps, dated remaining effort and status; material expansion/splitting requires owner agreement. Step reports conserve feature totals and retain missing/shared coverage. Owned fixtures, review, green CI and published tag establish release acceptance. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-10 after PR #97 exact head195ec78 / CI42883653995 passed160 fixtures and the check job, merged e566e81, and v4.5.0 was published on GitHub. Source and report acceptance complete; F-048 remains independently open. Owner accepted 2026-11-10. Implement optional workItems.featurePlans with task effort, visible derived tables and step usage filtering/grouping. Apply the plan to remaining owned harness work. Native source adapters and effectiveness delivery remain F-048, in the owner-selected T02 then T03 order. No consumer adoption gates this release. Host has no fresh-thread operation; this is bounded continuation with repository sources reloaded. Existing interrupted friction session from 2026-11-06 was finished with its full elapsed interval retained; it is not a comparable focused-work sample.

**Estimates:** Small remaining effort: zero; released. Initial Medium estimate, estimated 2026-11-10: 2–3 focused days for optional schema/render/report joins, policy, tests and release. Reuse existing task IDs and private usage ledger. Actual token counters are unavailable; no elapsed time implies tokens. These are initial estimates, not observed duration.

| Field | Value |
|---|---|
| PR / evidence | [PR #97](https://github.com/voidbrain/project-harness/pull/97); Test: tools/test-work-items.mjs and tools/test-work-usage.mjs; new acceptance failed before implementation at cdaae54. Review: independent fresh-context feature_plan_review found no implementation blocker; 27 focused tests passed. Its pending maintenance receipt finding is resolved by the current input-bound review; full deterministic160/160 pass. |
| Opened | 2026-11-10 |
| Verification | 2026-11-10 Script: 27 focused task/usage tests pass; two new join tests failed on the previous implementation (commit cdaae54) and pass unchanged. All 160 deterministic fixtures pass; template, rules, work-item and backlog checks pass. Independent fresh-context review found no implementation blocker; PR #97 exact head195ec78 / CI42883653995 passed160 fixtures and static checks; v4.5.0 published on GitHub. No behaviour runner is configured: live agent-behaviour checks were not run. |
| Reviewed | 2026-11-10 |

</details>

---

## Closed 2026-11-10

### F-048

**Measured development usage and operational effectiveness by task**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; selected usage and effectiveness scope is released.

| | |
|---|---|
| **Issue** | Owners need actual development token spend by feature and activity, including failed attempts and review/record maintenance, to plan useful work batches without guessing from elapsed time or conversation length. |
| **Reproduce** | Ask for an item's total and its planning/coding/testing/review/documentation/backlog/harness split across several jobs, retries and models. Existing friction counters measure workflow observations, not provider token usage. |
| **Check** | Explicit optional usage events/import adapters bind repository/item/task, job/attempt/phase, model/provider and measured input/output/cache counts to provenance. Missing data stays unknown, not zero. Stable source/event IDs prevent duplicate imports; allocations conserve shared-job totals; retries remain counted. Reports distinguish known spend, coverage and estimated remaining budget. Queue advice never overrides priority/dependencies/human gates or treats sunk cost as remaining effort. Privacy-safe local aggregates contain no prompts, secrets or personal session content. |

**Feature steps** (remaining estimates; status is not parent acceptance)

| Step | Remaining effort | Status |
|---|---|---|
| F-048-T01 — Measured usage event contract, imports and phase reports | 🟢 Small — 0 remaining<br />2026-11-10: Closed on v4.4.0; original effort was not measured per step. | Completed |
| F-048-T02 — Validate native client sources and extend measured usage reports | 🟢 Small — 0 remaining<br />2026-11-10: Published v4.6.0 after PR98 green CI and independent review. Selected Codex/Claude metadata imports, prelaunch and parent handoff accepted; actual source limits retained. | Completed |
| F-048-T03 — Report operational effectiveness per completed task | 🟢 Small — 0 remaining<br />2026-11-10: Published v4.7.0 after PR99 exact headc43fd46 / CI42887014187 passed169 fixtures/check and independent fixes recheck. Initial estimate retained in Git. | Completed |

<details>
<summary>Next action, estimates and evidence</summary>

**T03 implementation 2026-11-10:** Immutable explicit observations and feature/step effectiveness reports are implemented;18 focused usage fixtures pass. Elapsed unions, measured effort, retries/findings/interventions, estimate revisions, rates/currencies and missing coverage are kept distinct. T02 closed on published v4.6.0 after PR #98 exact head72e2774 / CI42885088773 passed164 fixtures/check, merged95cc60d. All169 deterministic fixtures pass; independent fresh-context review found two reporting gaps, captured by committed failing regressions7d1f333/21ec362 before unchanged-test fixes. Recheck18/18 reports no remaining blocker. Final PR99 CI42887014187 passed169 fixtures/check and v4.7.0 is published. One earlier full run failed an unchanged verification CLI fixture (expected scoped selection, received full); directed6/6 and final169/169 reruns pass without editing that fixture or its assertions. Cause remains unconfirmed; no acceptance is inferred from the failed run. Actual host token totals remain unknown.

**T02 implementation 2026-11-10 (historical):** Selected metadata-only Codex and Claude adapters and optional explicit prelaunch/parent handoff are implemented; 13 focused fixtures pass. [Source assessment](../reviews/2026-11-10-client-usage-sources.md) names unsupported/unverified clients and actual host limits. No real counts, automatic collection or universal client-loading acceptance is claimed. Price/batch guidance remains unavailable without observed supporting evidence. All164 deterministic fixtures plus template/rules/work/backlog checks pass. Review: independent fresh-context native_usage_review found no code blockers;13 focused fixtures passed. Its maintenance receipt finding is resolved by current input-bound evidence. PR98 final CI42885088773 passed and v4.6.0 is published. No behaviour runner is configured; no live rule-following claim.

**Owner-selected order2026-11-10:** Work T02 before T03. This is execution order, not a new technical prerequisite or a consumer adoption gate. T02 is now closed on v4.6.0; T03 is implemented with release acceptance pending. Generic ledger/startup rule is already released.

**Next action / closure evidence:** Closed 2026-11-10 after PR #99 exact headc43fd46 / CI42887014187 passed169 fixtures and check, merged85a038c, and v4.7.0 was published on GitHub. T01 accepted4.4.0, T02 accepted4.6.0, T03 accepted4.7.0. Selected metadata adapters/reports are complete; inaccessible source/live-loading coverage remains explicitly unknown, not a promised universal collector. No consumer adoption or live model run gates closure. Owner accepted2026-11-09. T01 defines/imports measured usage, then per-item/activity reports and optional remaining-budget guidance. Discover actual runner/provider outputs first; do not scrape conversations or infer usage from time, file reads, tool count or model guesses. Preserve provider definitions: cached input may be a subset of input and reasoning may be a subset of output, never added twice. Unknown source coverage makes the total explicitly incomplete. Shared activities use declared allocations or remain unallocated; never attribute100% to multiple items. Keep observed spend separate from remaining estimates, with sample size/configuration/confidence; no automatic priority scoring or quota enforcement follows.

The harness owns reusable development accounting. Evaluation usage remains owned by evaluation libraries; consumer runtime accounting remains consumer-owned. Adapters can reference/import measured events without duplicating their totals. No consumer implementation/adoption or real model campaign gates a harness release. Initial source assessment found existing friction.mjs duration/counter records but no per-task provider token import or phase ledger; actual session phase totals are unavailable from the currently observed tools and remain unknown. See [assessment](../reviews/2026-11-09-task-token-accounting.md).

**Implementation2026-11-09:** Optional generic ledger/startup rule and client instruction bridges are released in4.4.0 after PR #90 / CI42676203479; T01 closed on the published tag. Canonical metadata deltas, immutable source IDs, cross-job deduplication, unknown coverage, unallocated shared work and activity/model reports have six neutral join fixtures. Native client log adapters, live client instruction loading, pricing and remaining-budget guidance remain unimplemented; the parent is not closed. No actual development token totals or model campaign are claimed.

**Confirmed confinement gap2026-11-09:** After4.4.0 publication, independent failure-capture review identified a matching usage-store bug: unavailable Git discovery could treat an enclosing checkout as external. Committed regressiond88cc74 fails before the fix. Filesystem ancestor `.git` markers now enforce confinement without Git, retaining link/ownership/privacy gates. Patch4.4.1 published after PR #91 exacthead952e619 / CI42678501222 passed158 fixtures and template/static checks, mergedmain64d034f; independent recheck8/8 found no blocker. no native client adapter or actual count is inferred.

**Observed startup omission2026-11-09:** A report-only adoption reviewer confirmed it omitted private job registration although the tool was available; read-only scope did not prevent registration. This is an actual rule-following omission, not a missing capability. No counters were exposed or retrospectively assigned. T02 must assess host/launcher registration before agent invocation, handoff job identity and source coverage; entry-file presence alone cannot certify automatic collection across clients. This observation does not invalidate the ledger import/privacy fixtures or imply every client behaves the same way.

**Reconciliation2026-11-09:** PR #93 exacthead04ce2f5 / CI42686991099 passed, mergedd135f63; PR92 release acceptance CI was inspected through `npm run ci:status -- 93 92`. This validates documentation/template fixtures, not live startup or native counters. T02 remains open with the observed omission and host/launcher/source acceptance.

**Effectiveness direction reviewed2026-11-10:** The next reporting slice is T03: completed-task development cost, elapsed/execution/wait time, failed attempts, confirmed regressions and human interventions, compared with dated pre-work estimates. This is planned, not implemented. Retain numeric tokens and price/source/currency/date when exposed; subscription quota is not inferred money. A passing retry never erases a failed attempt. Separate confirmed code regressions, infrastructure failures, review findings and unverified suspicions. Human intervention counts require explicit metadata, not transcript inference; record intervention duration only when measured. No automatic blame, ranking or queue reprioritization follows. Partial sources permit a clearly incomplete report; absence never means zero. Existing start/end/phase timestamps can support elapsed intervals but do not prove active effort or causal savings. Parallel wall-clock intervals use their union, not a sum; summed worker effort is separately labelled and only reported when measured. Preserve reopened/reworked tasks and per-attempt attribution. Generic reporting stays here; evaluation/runtime events retain their owning source and stable identity without double counting.

**Estimates:** Small remaining effort: zero; published2026-11-10. Prior pre-release estimate: final full fixtures/review/CI/release, up to1 focused day. Earlier pre-implementation estimate: Large remaining effort, reassessed 2026-11-10: T02 4–6 and T03 2–3 focused days, with native-source availability uncertain. Initial per-step estimates are dated, not measured. Earlier estimate2026-11-09: a versioned event/adapter/report slice and idempotency/allocation/privacy fixtures; actual runner API availability is not yet established and may constrain source coverage. No actual token spend estimated.

| Field | Value |
|---|---|
| Queue order | 1 — Owner-selected next harness work, 2026-11-10 |
| PR / evidence | [PR #100](https://github.com/voidbrain/project-harness/pull/100) release acceptance and closure; [PR #99](https://github.com/voidbrain/project-harness/pull/99) immutable effectiveness observations/reports; [PR #98](https://github.com/voidbrain/project-harness/pull/98) T02 metadata adapters/prelaunch handoff; [PR #96](https://github.com/voidbrain/project-harness/pull/96) owner-selected T02 then T03 order; [PR #95](https://github.com/voidbrain/project-harness/pull/95) T03 operational effectiveness scope;  [PR #93](https://github.com/voidbrain/project-harness/pull/93) observed startup omission and launcher follow-up;  Release acceptance: [PR #92](https://github.com/voidbrain/project-harness/pull/92); Confinement patch: [PR #91](https://github.com/voidbrain/project-harness/pull/91); committed regressions d88cc74/12f99e3 precede fix; fresh-context recheck8/8 passed; Generic ledger/rule: [PR #90](https://github.com/voidbrain/project-harness/pull/90); Review: independent fresh-context report, three findings fixed and6/6 rechecked without blocker; [PR #87](https://github.com/voidbrain/project-harness/pull/87), registration/design only; no accounting implementation or token measurement claimed. |
| Opened | 2026-11-09 |
| Verification | 2026-11-10 Script: PR99 exact headc43fd46 / CI42887014187 passed169 deterministic fixtures and static checks; independent recheck18/18 found no remaining blocker after committed failing regressions7d1f333/21ec362 and unchanged-test fixes; v4.7.0 published. Actual session counts and universal client loading remain unknown. Historical2026-11-09 Unit/integration: six neutral ledger/import/report/privacy tests pass, including nested checkout confinement, symlink rejection and empty-job coverage. Independent fresh-context review found three gaps, fixed and rechecked6/6 with no code blocker. PR90 exactheadb018f28 / CI42676203479 passed156 deterministic fixtures and template checks; mergedmain236db16 and4.4.0 tag published. actual client loading, native source adapters and budget guidance remain unverified/unimplemented under T02. |
| Reviewed | 2026-11-10 |

</details>

---

## Closed 2026-11-11

### F-051

**Formatter and linter for every stack, and reconciliation folded into working PRs**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 5.0.0 is published.

| | |
|---|---|
| **Issue** | Owner decision 2026-11-11 after a direction review of a derived project: (1) the template named lint and format only for the Angular stack, worded as merging into an existing config, and nothing checked it, so a project could run for weeks with neither and with source lines thousands of characters long; the template's own tools had neither as well. (2) Reconciliation after every merge produced a records-only PR for almost every working PR. |
| **Reproduce** | Apply the core stack to a Node project: no formatter or linter is required and no check fails. Merge one PR in a project: `check:freshness` warns at once and the session-start rule asks for reconciliation in the session's first PR. |
| **Check** | `check-tooling` fails without a formatter check and a linter as npm scripts run in CI, accepts renamed scripts from the stamp and a recorded exemption, and ignores commented steps. `check-freshness` prints the backlog as a note below 10 merged PRs and one day, and as a warning at either limit; both limits are settings. The template formats and lints its own tools with the configuration it gives projects. Rule text in AGENTS and BACKLOG-RULES keeps every evidence requirement. Fixtures, independent review, green CI and the published tag establish release acceptance. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-11 after PR #103 / CI 42986113197 passed, merged 2597453, and v5.0.0 was published on GitHub. Two projects reconciled the same day; the first found that the default ignores missed the in-repository template checkout, fixed in 5.0.1. Implemented 2026-11-11 for release 5.0.0 (major: a project without both tools stops passing). New copied tool `check-tooling.mjs`, `core/eslint.config.mjs`, `core/.prettierrc.json`, `core/prettierignore.txt`; APPLY "Lint and format config" now covers every stack and describes the one-PR mechanical reformat and its verification; `freshness.backlogPRs` / `backlogDays` in `check-freshness`; session-start and BACKLOG-RULES sentences fold reconciliation into the next working PR. The template adopts Prettier 3.9.10 and ESLint 10.14.0 itself: all 73 JavaScript files reformatted with no hand edits, 16 lint findings fixed at 12 edit sites. No consumer adoption gates this release; each project records its own reconcile.

**Estimates:** Small remaining effort: zero; released.

| Field | Value |
|---|---|
| PR / evidence | [PR #103](https://github.com/voidbrain/project-harness/pull/103); Test: tools/test-tooling.mjs (5 fixtures) and the cadence fixture in tools/test-tools.mjs |
| Opened | 2026-11-11 |
| Closed | 2026-11-11 |
| Verification | 2026-11-11 Script: all tool fixtures pass after the reformat; a position-free syntax tree (espree) of each of the 73 files is equal before and after formatting except `work-usage.mjs`, where Prettier dropped redundant parentheses inside one `\|\|` chain. Lint clean. Independent fresh-context review of 281fc3d found no blocker and confirmed the reformat and hand edits; its findings are fixed in the same PR with fixtures (a commit without a PR still warns at once, aggregate scripts and pnpm/yarn count, settings are validated, a malformed stamp fails, stale first-PR wording, README and APPLY rows) or documented as limits in the tool. The fixes were not re-reviewed. PR #103 / CI 42986113197 passed 184 fixtures and the check job; v5.0.0 published on GitHub. No behaviour runner is configured: live agent-behaviour checks were not run. |
| Reviewed | 2026-11-11 |

</details>

---

## Closed 2026-11-11

### B-016

**A worktree's node_modules symlink is not ignored**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 5.1.1 is published.

| | |
|---|---|
| **Issue** | `core/gitignore.txt` ignored `node_modules/`; a pattern ending in `/` matches only directories, so a git worktree whose `node_modules` is a symlink to the main checkout's showed it as untracked, and `git add -A` committed it. Origin: found in the NERV repository (voidbrain/nerv [PR #264](https://github.com/voidbrain/nerv/pull/264); the symlink was removed there in commit 6f04ef5). That is NERV evidence, not a harness record. |
| **Reproduce** | In a repository using `core/gitignore.txt`, `ln -s ../other/node_modules node_modules`, then `git check-ignore node_modules` exits 1. |
| **Check** | `git check-ignore node_modules` exits 0 for a symlink; regression in tools/test-tools.mjs fails before the fix and passes after; v5.1.1 tagged. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-11 after PR #107's final head 9f2fdbd passed `check`, merged as 300ecb2, and tag v5.1.1 points at that merge commit. Project reconciles are owned by each project.

**Estimates:** Small remaining effort: zero; released.

| Field | Value |
|---|---|
| PR / evidence | [PR #107](https://github.com/voidbrain/project-harness/pull/107). Test: tools/test-tools.mjs, "gitignore: node_modules is ignored when it is a symlink" (committed failing first). The branch's first four commit messages say "B-032" by mistake: this record is B-016, and B-032 is an unrelated NERV record. CI 43009207651 failed only `Required maintenance evidence`: APPLY.md is a maintenance input and the receipt was missing; recorded in the next commit. |
| Opened | 2026-11-11 |
| Closed | 2026-11-11 |
| Verification | 2026-11-11: regression fails before the fix (`git check-ignore` exit 1) and passes after. Review: fresh-context mechanical review (Haiku) confirmed the one-line pattern change in both files, the failing test committed first and unchanged, `git check-ignore` exit 1 before and 0 after, the 5.1.1 stamps and template/backlog/maintenance checks; it did not run the test through the runner. CI 43009632384 failed `Optional source-owned records`: the record was written into the generated ledger instead of `docs/work/records/`; moved. |
| Reviewed | 2026-11-11 |

</details>

---

## Closed 2026-11-11

### F-052

**Evaluation dependencies raise a run when their test content changes**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 5.2.0 is published.

| | |
|---|---|
| **Issue** | A project that pins an evaluation dependency shipping test packs gets no signal when a new pin adds or changes cases: in a derived project, a pin added 28 cases that were never run or indexed. The harness already reports its own newer releases at session start, but not new test content in a project’s evaluation dependencies. |
| **Reproduce** | In a project with an evaluation dependency, pin a release that adds a pack: `check:freshness` and CI stay silent. |
| **Check** | A project declares evaluation dependencies in `.harness.json` (`evaluations`: name and a project-owned pending command that exits 1 and lists cases when any are unrun); `check:freshness` runs each and reports pending cases at session start; BACKLOG-RULES: a pending case keeps an open record naming it until a run covers it, and running real models stays owner-approved; APPLY explains adoption. No evaluation tool is named or imported by the template; a project without the setting is unaffected. Released as a minor version. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-11 after PR #110 / CI 43019509190 passed, merged c828f7d, and v5.2.0 was tagged and published on GitHub. Projects adopt it in their own backlogs.

**Estimates:** Small remaining effort: zero; released.

| Field | Value |
|---|---|
| PR / evidence | [PR #110](https://github.com/voidbrain/project-harness/pull/110). Test: tools/test-tools.mjs, "check-freshness: declared evaluation dependencies report pending cases and never fail the session". Review: fresh-context design review (Opus): one blocker (an invalid `timeoutMs` crashed check:freshness with ERR_OUT_OF_RANGE, 0 disabled the timeout) and should-fix items (SIGTERM-ignoring command outlived the timeout; exit 1 with no output reported as 0 cases; stderr discarded; record lacked the PR), all fixed in #110 with fixtures. |
| Opened | 2026-11-11 |
| Closed | 2026-11-11 |
| Verification | 2026-11-11 Script: tools/test-tools.mjs "check-freshness: declared evaluation dependencies report pending cases and never fail the session" (nothing pending, two listed, cut after ten, crash, missing command, timeout, a command ignoring SIGTERM, exit 1 with no cases, invalid and zero timeouts, malformed settings); test:tools pass. No behaviour runner is configured, so the agent-behaviour checks for the changed AGENTS/BACKLOG-RULES were not rerun. |
| Reviewed | 2026-11-11 |

</details>

---

## Closed 2026-11-11

### F-053

**Summable step estimates with feature and ledger totals**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 5.3.0 is published.

| | |
|---|---|
| **Issue** | Step estimates are free text ("0.5 focused day", "0 remaining"), so a feature's total and the backlog's total cannot be computed, and a completed step drops its original estimate to "0 remaining", leaving no baseline to compare with what it actually took. Owner request 2026-11-11: show each feature's total estimated days and the total of all features at the top of the backlog. |
| **Reproduce** | Open any derived project's generated backlog: no feature shows a total; the header shows none; a closed step reads 0 remaining with its original estimate only in Git history. |
| **Check** | Tasks carry optional numeric `days` (remaining) and `baselineDays` (first accepted estimate, kept at close); each feature's steps table has a total row (remaining, baseline, steps with unknown estimates, never counted as 0); the ledger header shows total remaining days of open records; totals are generated and check:work fails when stale; APPLY says how to backfill. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-11 after PR #113 and PR #114 passed CI and merged (main bf78bcb), and v5.3.0 was tagged and published on GitHub. Projects adopt it in their own backlogs.

**Estimates:** Small remaining effort: zero; released.

| Field | Value |
|---|---|
| PR / evidence | Implemented in [PR #113](https://github.com/voidbrain/project-harness/pull/113) (CI 43068637718). Review: fresh-context design review (Opus), no blocker, NERV compatibility checked on a copy; should-fix items (require(esm) needs Node 22.12, `since` kept same-day samples, measured mixed waits into focused days and zero actuals were outliers, a summary without a following blank line put the basis before it) and nits fixed in [PR #114](https://github.com/voidbrain/project-harness/pull/114) with regressions committed first. Planned in [PR #112](https://github.com/voidbrain/project-harness/pull/112) (owner request, 2026-11-11, from a derived project session). |
| Opened | 2026-11-11 |
| Closed | 2026-11-11 |
| Verification | 2026-11-11 Script: tools/test-work-items.mjs (F-053 totals, F-055 queue order and compact table, 5.3.0 review regressions) and tools/test-tools.mjs; test:tools 193 pass. Consumer compatibility checked by the reviewer on a copy of a derived project's backlog. |
| Reviewed | 2026-11-11 |

</details>

---

## Closed 2026-11-11

### F-055

**Backlog ordered by the work queue, with a compact steps table**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 5.3.0 is published.

| | |
|---|---|
| **Issue** | The generated backlog lists records by ID, so the next thing to work on is found only on the separate work-queue page; the feature steps table carries long dated basis text in every row, which makes it hard to scan. Owner request 2026-11-11: order the backlog by the work queue by default and put the feature steps table before the expandable sections. |
| **Reproduce** | Open a derived project's docs/BACKLOG.md: records are in ID order; the steps table (rendered just before the collapsed details) has multi-line effort cells. |
| **Check** | `workItems.order` = `queue` (default for new adoptions) or `id`; within each group records follow tools/backlog-queue.mjs order, deterministic on ties; the steps table shows step, remaining, baseline and status with the basis moved into details; placement confirmed by the owner. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-11 after PR #113 and PR #114 passed CI and merged (main bf78bcb), and v5.3.0 was tagged and published on GitHub. Projects adopt it in their own backlogs.

**Estimates:** Small remaining effort: zero; released.

| Field | Value |
|---|---|
| PR / evidence | Implemented in [PR #113](https://github.com/voidbrain/project-harness/pull/113) (CI 43068637718). Review: fresh-context design review (Opus), no blocker, NERV compatibility checked on a copy; should-fix items (require(esm) needs Node 22.12, `since` kept same-day samples, measured mixed waits into focused days and zero actuals were outliers, a summary without a following blank line put the basis before it) and nits fixed in [PR #114](https://github.com/voidbrain/project-harness/pull/114) with regressions committed first. Planned in [PR #112](https://github.com/voidbrain/project-harness/pull/112) (owner request, 2026-11-11, from a derived project session). |
| Owner decision | 2026-11-11: the steps table stays just before the collapsed details ("yeah, it's fine"). |
| Opened | 2026-11-11 |
| Closed | 2026-11-11 |
| Verification | 2026-11-11 Script: tools/test-work-items.mjs (F-053 totals, F-055 queue order and compact table, 5.3.0 review regressions) and tools/test-tools.mjs; test:tools 193 pass. Consumer compatibility checked by the reviewer on a copy of a derived project's backlog. |
| Reviewed | 2026-11-11 |

</details>

---

## Closed 2026-11-11

### F-054

**Compare estimates with actual effort and re-estimate when they drift**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 5.3.0 is published and the owner confirmed the thresholds.

| | |
|---|---|
| **Issue** | Estimates are never checked against what steps actually took, so a systematic bias (for example every "0.5 day" step taking 2) persists into every new plan. work-usage already compares a job's pre-work estimate with its elapsed time, but nothing links that to backlog steps or prompts a re-estimate. Owner request 2026-11-11: compare each completed step's estimate with real data and add a periodic, conditional re-estimation rule triggered by the number and size of discrepancies. |
| **Reproduce** | Close several steps in a derived project whose actual effort differs from the estimate: nothing reports the gap and open steps keep their old estimates. |
| **Check** | A closed step records `actualDays` with its source (measured from work-usage, or stated, never shown as measured); `work-items calibrate` reports actual/baseline ratios by size and capability with sample counts, read-only; check:freshness asks to re-estimate the named open steps when at least `estimation.minSamples` closed steps since the last calibration have a median ratio beyond `estimation.ratio` or any step beyond `estimation.outlier`; re-estimates change `days` with a dated basis and keep `baselineDays`; a material increase still goes to the owner. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-11: released in v5.3.0 (PRs #113 and #114, main bf78bcb); the owner confirmed the default thresholds (5 samples, 1.5x median, 3x outlier, 6 hours a day) the same day.

**Estimates:** Small remaining effort: zero; released.

| Field | Value |
|---|---|
| PR / evidence | Implemented in [PR #113](https://github.com/voidbrain/project-harness/pull/113) (CI 43068637718). Review: fresh-context design review (Opus), no blocker, NERV compatibility checked on a copy; should-fix items (require(esm) needs Node 22.12, `since` kept same-day samples, measured mixed waits into focused days and zero actuals were outliers, a summary without a following blank line put the basis before it) and nits fixed in [PR #114](https://github.com/voidbrain/project-harness/pull/114) with regressions committed first. Planned in [PR #112](https://github.com/voidbrain/project-harness/pull/112) (owner request, 2026-11-11, from a derived project session). |
| Owner decision | 2026-11-11: default re-estimation thresholds confirmed. |
| Opened | 2026-11-11 |
| Closed | 2026-11-11 |
| Verification | 2026-11-11 Script: tools/test-work-items.mjs (actual effort validation, calibrate, since, zero actuals) and tools/test-tools.mjs (check-freshness reminder); test:tools 193 pass. |
| Reviewed | 2026-11-11 |

</details>

---

## Closed 2026-11-11

### F-056

**Actual effort next to baseline and remaining in the steps table**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 5.4.0 is published.

| | |
|---|---|
| **Issue** | The steps table shows remaining and baseline effort but not the time already spent, so completed and partly done steps cannot be compared with their estimate at a glance. Owner request 2026-11-11: add a column with completed or partial work time, ordered Baseline, Actual, Remaining; a step without a recorded actual shows 0. |
| **Reproduce** | Render a feature with feature plans in 5.3.0: the table has Remaining, Baseline and Status only, and `actualDays` is refused on a step that is not closed. |
| **Check** | The steps table reads Step, Baseline, Actual, Remaining, Status; Actual shows `actualDays` with its source, marked "so far" for open steps, or 0 days when none is recorded; started steps may record `actualDays`, planned ones may not; the total row and backlog total add recorded actual effort; calibration uses recorded actuals of closed steps only; release with CHANGELOG and APPLY. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-11 after PR #117 and PR #118 passed CI and merged (main a415d04), and v5.4.0 was tagged and published on GitHub.

**Estimates:** Small remaining effort: zero; released.

| Field | Value |
|---|---|
| PR / evidence | [PR #117](https://github.com/voidbrain/project-harness/pull/117) (CI 43070967196). Review: fresh-context design review (Opus), no blocker; should-fix (the total row showed a bare 0 days when no step recorded an actual, reading as measured; docs did not say a row's 0 means not recorded) fixed in [PR #118](https://github.com/voidbrain/project-harness/pull/118) with its regression committed first. Test: tools/test-work-items.mjs "F-056: the steps table shows baseline, actual (final or so far) and remaining; totals add actual effort"; three 5.3.0 assertions changed because this record's Check reorders the columns and allows actual effort on started steps. |
| Opened | 2026-11-11 |
| Closed | 2026-11-11 |
| Verification | 2026-11-11 Script: tools/test-work-items.mjs F-056 test and review regression; test:tools 194 pass. |
| Reviewed | 2026-11-11 |

</details>

---

## Closed 2026-11-11

### F-057

**Dependencies in each record; retire the queue and dependency pages**

| Signal | Priority | Status | Effort |
|:---:|---|---|---|
| 🔵 | ◻️ P2 | Closed | 🟢 Small |

💻 **→ Human action required: No**<br />No action remains; release 5.5.0 is published.

| | |
|---|---|
| **Issue** | Since 5.3.0 the ledger lists records in work-queue order, so the generated work-queue page repeats it; the dependency page is the only place that shows a record's Unlocks, away from the record. Owner request 2026-11-11: remove both pages if agents do not need them, and show Depends on and Unlocks with each feature and bug. |
| **Reproduce** | Open a derived project's docs/BACKLOG.md and docs/agents/backlog-queue.md and backlog-dependencies.md: the queue page repeats the ledger order; Unlocks appear only on the dependency page. |
| **Check** | Each record with prerequisites or dependents shows a generated `Depends on · Unlocks` line with working links; both pages are no longer generated and projects delete them; the tools still validate cycles, links and queue fields in `--check`; rules, APPLY, README and CHANGELOG updated; released as 5.5.0. |

<details>
<summary>Next action, estimates and evidence</summary>

**Next action / closure evidence:** Closed 2026-11-11 after PR #120 and PR #121 passed CI and merged (main 6b6abf7), and v5.5.0 was tagged and published on GitHub. Projects adopt it in their own backlogs.

**Estimates:** Small remaining effort: zero; released. Estimated at about 2.5 focused days; the work took about 1.5 agent hours including review, the gap F-058 addresses.

| Field | Value |
|---|---|
| PR / evidence | [PR #120](https://github.com/voidbrain/project-harness/pull/120). Review: fresh-context design review (Opus), no blocker, checked on a copy of a derived backlog; should-fix items (a differently spaced summary header silently lost the line; projects without source-owned records lose Unlocks, now stated; links to the retired pages were not checked; the build now also fails on an invalid graph, now stated) fixed in [PR #121](https://github.com/voidbrain/project-harness/pull/121) with regressions committed first. Planned and implemented in one PR (owner request 2026-11-11). Agent use assessed: the queue page's order is the ledger's since 5.3.0, and its lanes follow from each record's human cue, status and prerequisites; the dependency page's only unique content, Unlocks, moves into the records. Validation stays. |
| Opened | 2026-11-11 |
| Closed | 2026-11-11 |
| Verification | 2026-11-11 Script: tools/test-work-items.mjs F-057 test, rewritten tools/test-backlog-queue.mjs and test-backlog-dependencies.mjs; record line checked on a copy of a derived project's backlog (40 records, backlog/queue/work checks pass). |
| Reviewed | 2026-11-11 |

</details>

---
