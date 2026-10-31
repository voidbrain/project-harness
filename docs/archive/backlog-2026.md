# Closed backlog — 2026

Closed records, moved from the [active backlog](../BACKLOG.md) with their full history. Dated evidence, not current status.

One file per year; records follow their closing date, under a heading per day.

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
