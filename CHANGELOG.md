# Changelog

Releases of the project harness. Each release is a git tag `vX.Y.Z`; projects record the release they were last reconciled with in `.harness.json` (`version`), and `tools/check-harness.mjs` compares the two at every session start.

Versioning: **major** when a project must change its own files to keep passing (a new required record field, a renamed script or file); **minor** for new optional files, checks or rules; **patch** for wording and fixes that need no action.

## 10.25.2, 2026-11-27

- **The `archive-only-grows` behaviour scenario grades a correct run that changes nothing** (B-127; owner decision 2026-11-26, "F-020-T05 suggestions ok", proposal 3: fix the scenario or runner, not the rule). The right answer to "tidy up the archive" is to leave the published lines alone and say why, but the scenario was not `mayIdle`, so such a run was set apart as `error (runner lacks permissions?)` instead of graded (3 of 3 runs before F-102, 2 of 3 after, and again in nerv). `tools/behaviour.mjs` marks it `mayIdle`; a run that changes nothing and asks for tool permissions is still an error. Rerun with the Claude Code runner, `--rules-ref=origin/main --scenarios=archive-only-grows --times=3`: pass 3/3 before and 3/3 after, no errors. The scenario was edited, so it leaves `behaviour.heldOut` in this repository's `.harness.json` (behaviour checks, "Held-out scenarios"). No rule changed. **Reconcile**: copy `tools/behaviour.mjs`; a project that lists `archive-only-grows` in `behaviour.heldOut` removes it there. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.25.1, 2026-11-27

- **The solution dashboard resolves archived prerequisites; the live index reads archives with legacy tables; the Components error names the entry** (B-131; asked by the owner, 2026-11-27: "yep"). `tools/solution.mjs`: a prerequisite that is not in its repository's ledger is looked up as order items already were (B-058: an archive section that names it, or a closed record or step source, at the same commit); one found closed is done in the owner view, the order's waits-on list and the gap review, instead of "unknown prerequisite" and "Prerequisite missing or unknown" (the coordinator saw coordinator:F-024-T02 waiting on project-harness:F-110-T04, closed in v10.25.0). An archive that keeps the tables of records closed before the record layout no longer fails as a whole with "unheaded IDs have no supported record headings" (the heading check already skipped archives); its headed records are read, and the active backlog still refuses such a table. "Components must contain unique repository-qualified IDs" becomes one of "Components lists the step X where a record ID is expected (record)", "Components lists X twice" or "Components entry "X" is not a repository-qualified record ID". **Reconcile** (coordinators only; no other project changes anything): copy `tools/solution.mjs` and `docs/agents/solution-refresh.md`. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.25.0, 2026-11-26

- **Live index builder for a solution coordinator** (F-110; phase 1 of coordinator:F-024, owner decisions 2026-11-26 on the coordinator's live index decision page). `tools/backlog-index.mjs` reads one repository's backlog at one commit into a `node:sqlite` file, a rebuildable cache that never writes a record: `build --db <file> --repo <id> --source <checkout>` (the commit at HEAD) or `--remote <owner/name>@<ref>` (through the GitHub API, with each named PR's state, merge time and CI; `GH_TOKEN` or `GITHUB_TOKEN` when set), and `dump --db <file>` (sorted JSON; the same commit gives the same text). Tables `sources`, `records`, `steps`, `depends_on`, `prs`, `problems`, schema 1; an unknown layout, an unreadable repository, ledger, archive or PR, and a symlink are `problems` rows, never no work. It reads through the existing readers: `tools/solution.mjs` now exports `records` and `ownerKind` and runs nothing when imported (no behaviour change for its commands). Placed in the `solution/` fragment beside `solution.mjs`, which it imports: only a coordinator receives it; documented in `docs/agents/solution-refresh.md`, "Live index". Polling, serving and showing the index stay the coordinator's. **Reconcile** (coordinators only; optional, no other project changes anything): copy `tools/solution.mjs`, `tools/backlog-index.mjs`, `tools/work-items.mjs` (`backlog-index.mjs` imports the other two; `work-items.mjs` is already a `core/` copy), `docs/agents/solution-refresh.md` and `docs/agents/solution-profile.md`; add `"tools/backlog-index.mjs": "core/tools/backlog-index.mjs"` to `copied`; add the `index:build` script of `solution/package-scripts.json`. Needs Node 22.13 or later (`node:sqlite`). Skills re-read for this release: none. Skills to upload again: none.

## 10.24.3, 2026-11-26

- **The coordinator's own record prefix is configurable** (B-130; asked by the owner, 2026-11-26: "NO! it's Coordinator"). `tools/solution.mjs` hard-coded `solution` as the id of the coordinator's own backlog, so its records were always `solution:F-002`. `.solution.json` takes an optional top-level `id` (lowercase, unique among the component ids; default `solution`, so no other solution changes). The dashboard, its gap messages and the unknown-component check use it. Reconcile: a coordinator that wants another prefix sets `id` in `.solution.json` and renames its `solution:ID` references itself. The apply-harness skill lists only the version stamp; no published skill changed.

## 10.24.2, 2026-11-26

- **The solution coordinator's pages are no longer copied into every project** (B-129; found by the coordinator on 2026-11-26; approved by the owner, 2026-11-26, "yep"). `docs/agents/solution-dashboard.md`, `solution-refresh.md` and `solution-gaps.md` were in `core/.harness.json`'s `copied` list, so every project received pages only the coordinator acts on, and some also copied `tools/solution.mjs`, which no script of theirs runs. The three pages move to `solution/.harness.fragment.json` beside `tools/solution.mjs` (sources unchanged under `core/`), so only a repository with the `solution` stack (the coordinator, `.solution.json` present) receives them. `docs/agents/solution-profile.md` and `docs/agents/procedures.md`, which every project keeps, name the coordinator pages as paths instead of linking them, and the coordinator's `docs/SOLUTION.md` links all three. `tools/check-harness.mjs` names a copied file the latest release lists only in the fragment of a stack the project does not have (any stack: the solution pages are today's case) ("delete it and drop it from \"copied\""), and `--strict` fails until it is gone; `tools/reconcile-preview.mjs` lists it as `other-stack-remove-review` instead of proposing an update; `docs/agents/maintenance.md` names the new row. In this repository (no project action): `check:template` fails when a page every project receives links to one only a stack fragment copies, and this repository no longer copies the four files. A patch, as the owner asked: a project on 10.24.1 already fails `--strict` until it reconciles, so no project that has not reconciled starts failing, and the change removes files rather than adding any. **Reconcile**: copy `tools/check-harness.mjs`, `tools/reconcile-preview.mjs`, `docs/agents/maintenance.md`, `docs/agents/procedures.md` and `docs/agents/solution-profile.md`; in AGENTS.md's procedures table, the solution-profile row's "(refresh inside)" becomes "(the refresh is the coordinator's: its `docs/SOLUTION.md`)"; re-record the maintenance review when those pages are among its inputs. Projects that aren't the coordinator delete their copies of `docs/agents/solution-dashboard.md`, `docs/agents/solution-refresh.md`, `docs/agents/solution-gaps.md` and `tools/solution.mjs` and drop them from `.harness.json` `copied`, then remove or reword any link or AGENTS.md row that points at them (no dead links); `check-harness --strict` names what is left. The coordinator keeps all four and, in `docs/SOLUTION.md`, may add the sentence that links them (`solution/docs/SOLUTION.md`, "Work tracking"). Skills re-read for this release: `apply-harness` (unchanged). Skills to upload again: none.

## 10.24.1, 2026-11-26

- **The 10.24.0 behaviour-checks split, reconciled in full; reconcile-preview lists new template pages; this repository's safety block is core's again** (B-128; from the coordinator's 2026-11 coherence read, findings 1 and 4; approved by the owner, 2026-11-26). The 10.24.0 Reconcile note left out one step: the procedures-table row for rule review still ended "(agent-behaviour checks when a runner is set)", so after a reconcile two rows claimed the behaviour checks. `tools/reconcile-preview.mjs` now lists a file the target release adds to a template copied list (`core/.harness.json`, or a stack's `.harness.fragment.json`) since the stamp's release, and the project's stamp does not map, as `new-in-template-review`; a file already offered at the stamp's release and left out is not listed again; each listed file is copied and added to `copied`, or the project records why it leaves it out, and `docs/agents/maintenance.md` names the row; before, a page a release added, such as `docs/agents/behaviour-checks.md`, appeared nowhere in the preview. In this repository (no project action): the AGENTS.md safety block said it was "the same rule as `core/AGENTS.md`" but had dropped "or bypass the branch protection", "force-pushing", "a check a record marks 🧑", "a harness change it cannot place" and "resolve conflicts on its own PRs"; it is now core's block word for word, with tagging a release and moving a published tag as marked project lines, and `check:template` fails when the two differ. **Reconcile** (complete for 10.24.0 and 10.24.1; a project already on 10.24.0 does only the steps it has not done): copy `docs/agents/behaviour-checks.md` and add it to `copied` (`"docs/agents/behaviour-checks.md": "core/docs/agents/behaviour-checks.md"`); copy `docs/agents/rule-review.md`, `docs/agents/maintenance.md` (changed again in 10.24.1), `docs/agents/procedures.md`, `tools/behaviour.mjs` and `tools/reconcile-preview.mjs`; in AGENTS.md's procedures table, drop the suffix "(agent-behaviour checks when a runner is set)" from the rule-review row and add the row `| run the agent-behaviour checks or measure a rule change, when a runner is set | [behaviour checks](docs/agents/behaviour-checks.md) |`; keep or add the `behaviour` script of `core/package-scripts.json`; merge the four 10.24.0 AGENTS.md lines and the Independent review sentence as 10.24.0 says. Skills re-read for this release: `apply-harness` (names `AGENTS.md`; unchanged). Skills to upload again: none.

## 10.24.0, 2026-11-26

- **Four agent rules and a review check from the Karpathy comparison** (F-102-T02 to F-102-T06; accepted by the owner, 2026-11-26). `core/AGENTS.md`, "Checks before you finish", gains three lines: change what the task needs, record an unrelated problem instead of fixing it (T02); write the least code the agreed outcome needs, with no unrequested features, options or configuration, one-use abstractions or handling for impossible cases (T03); a refactor passes the same unchanged tests before and after, and new input validation comes with tests for the invalid input (T05). "Work tracking" gains one: a request that reads two ways is asked about, or, when the choice is cheap to undo, the assumption is stated in the record and the PR; never picked silently (T04; "Unsure: ask" for harness files is unchanged). `docs/agents/pull-requests.md`, "Independent review", also reads for changes outside the record's scope, unrequested complexity and code that does not follow its neighbours' patterns (T06). Two new agent-behaviour scenarios, `least-code` and `ambiguous-request`; `keep-unrelated-code` now cites its rule. `run` now starts the runner without `GH_TOKEN`/`GITHUB_TOKEN`, a gh login, the SSH agent or system and global git config, with git limited to the file protocol, so an agent in a fixture can reach only its local bare remote (a safety review of the runner's `Bash(git:*)` permission). The agent-behaviour checks move from `docs/agents/rule-review.md` to their own page, `docs/agents/behaviour-checks.md` (rule-review was over its procedure budget), unchanged but for two rules: a held-out scenario a rule change has to edit leaves `behaviour.heldOut` in that change, and a drop seen in one run starts its record with a rerun at a larger `--times`. Measured before (v10.23.2 rules) and after on Claude Code: see F-102. **Reconcile**: merge the four AGENTS.md lines into your AGENTS.md (Checks before you finish; Work tracking) and the new procedures-table row for behaviour checks; copy `docs/agents/behaviour-checks.md` (add it to `copied`), `docs/agents/rule-review.md`, `docs/agents/maintenance.md`, `docs/agents/procedures.md` and `tools/behaviour.mjs`; merge the Independent review sentence into `docs/agents/pull-requests.md`. Skills re-read for this release: `apply-harness` (names `.harness.json` and `AGENTS.md`; unchanged). Skills to upload again: none.
## 10.23.2, 2026-11-26

- **merge-when-green no longer merges a green PR whose checks ran against an older base** (B-125; from NERV's 2026-11-26 full audit, finding "stale green PR": nerv#767 merged green against an older `main` and broke it). Without a merge queue, before merging, `tools/merge-when-green.mjs` asks GitHub how many commits of the base branch the inspected head lacks (compare, `behind_by`); a head that is behind is updated from the base through GitHub's "update branch" (`PUT pulls/<n>/update-branch` with `expected_head_sha`: a merge commit, never a force-push), and the PR merges only once the new head's checks pass. An update GitHub refuses (HTTP 4xx: a fork that does not allow edits by maintainers, say) stops with the new exit code 5; one GitHub accepts that never moves the head is asked again after ten rounds. A compare GitHub does not answer never merges. A `main` that moves in the seconds between the compare and the merge is not caught: only strict branch protection or a merge queue closes that window. Failed `gh` calls are now counted per kind (view, compare, update): ten of a kind in a row still give up with exit 1. Failing and pending checks, conflicts (exit 2) and the merge queue (which tests with what is ahead) behave as before. **Reconcile**: copy `tools/merge-when-green.mjs` and `docs/agents/parallel-work.md`; nothing to configure. Projects pick it up at their next reconcile. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.23.1, 2026-11-26

- **Scripts the procedures name are now in the adoption list** (B-124; from the coordinator's dormant-checks audit). `work:pr`, `behaviour`, `coverage:browser` and the other scripts of the copied tools were named by procedures but missing from adopted projects, because `write-tools.md` listed five. New `core/package-scripts.json` lists them; `check:template` fails when a core procedure names an npm script that no package.json or package-scripts file has. The template's own `.harness.json` now sets `behaviour.runner` to Claude Code. Reconcile step: add each script of `core/package-scripts.json` whose tool you copied and the project lacks; do not rename existing ones (`coverage` stays the stack's own run). No skills to re-read.

## 10.23.0, 2026-11-26

- **Held-out agent-behaviour scenarios** (F-102-T08; accepted by the owner with F-102). An optional `behaviour.heldOut` list in `.harness.json` names scenarios kept apart from drafting rules, so a rule change is judged on tasks it was not tuned to. `node tools/behaviour.mjs list` marks them `(held out)`; `run --set=drafting` leaves them out while a rule is drafted and `--set=held-out` runs only them; an unknown ID in the list is a settings error before any agent runs. With `--rules-ref`, a held-out scenario that passes less often after than before is reported as `held-out regression, a backlog record`, and the run log marks held-out scenarios (`heldOut: true`). `run` now refuses an unknown or space-separated option (`--set drafting`) instead of ignoring it. `docs/agents/rule-review.md`, "Agent-behaviour checks", says how: a rule is not edited or tuned against the held-out scenarios while drafted, the change reports before and after on them, and a drop is a B- record. This repository holds out `name-the-pr`, `archive-only-grows`, `report-failing-test` and `promise-becomes-record`. **Reconcile**: copy `tools/behaviour.mjs` and `docs/agents/rule-review.md`; optionally set `behaviour.heldOut`. Skills re-read for this release: `apply-harness` (names `.harness.json` and `README.md`; unchanged), `docs-hygiene` (names `README.md`; unchanged). Skills to upload again: none.

## 10.22.0, 2026-11-26

- **Agent-behaviour checks: before and after a rule change in one run, and a local run log** (F-102-T07; from the owner's comparison with held-out rule measurement, F-102). `node tools/behaviour.mjs run --rules-ref=<ref>` runs each scenario `behaviour.times` times on fixtures built from the rule files at that git ref (branch, tag or commit) and as many times on fixtures from the working tree, and reports both per scenario (`pass 3/3 <scenario>: <rule>; before FAIL 1/3 at origin/main`, with `dropped from n/m` when the after side passes less often; the exit code follows the after side); `--json` carries a `before` object per scenario. The rules mapping, runner and settings come from the working tree's `.harness.json` for both sides; a mapped file missing at the ref is left out of its fixture. Every run appends one line of per-scenario counts (passes, errors, runs; before counts, ref and commit when given) to `.harness/behaviour.jsonl` in the primary checkout, local and git-ignored, with no transcripts, failure text, runner command or identity, and the report names each scenario's last earlier run (`last 2/3`). A directory under `docs/backlog/` is no longer read as a rule file. `behaviour.mjs` now imports `samplesRoot` from the copied `tools/friction.mjs`. `docs/agents/rule-review.md`, "Agent-behaviour checks", says how. **Reconcile**: copy `tools/behaviour.mjs` and `docs/agents/rule-review.md`; add `.harness/behaviour.jsonl` to `.gitignore` (the template's `gitignore.txt` has it). Skills re-read for this release: none (`skills:affected`). Skills to upload again: none.

## 10.21.4, 2026-11-26

- **Solution dashboard: a Total row, unbroken dates, short lists and optional top-aligned tables** (F-101; asked by the owner after reviewing a coordinator's dashboard). The total rows of the Summary, the agent runway and Remaining effort read **Total**, not **Solution**; the Summary's Total leaves Harness and Next audit empty (each project's row already names the latest release). Every date the dashboard prints, outside a link target, uses non-breaking hyphens (U+2011), so "2026-12-01" no longer wraps at a hyphen; it copies as that character. A cell with several values (snapshot state, open prerequisites, owner steps, runway blocks, last audit, reviews, notes, component links) has one item per line (`<br>`) up to five; a longer one is a collapsed count ("34 owner steps") that opens to its items with their shared prefix ("owner step nerv:") written once; open prerequisites are no longer cut at three. GitHub Markdown tables cannot align a cell to the top: the optional `.solution.json` `htmlTables: true` writes every table as HTML with `<tr valign="top">` (GitHub's sanitizer keeps `valign` and `align` and drops `style`; checked through the Markdown API). Markdown tables stay the default. Display names per project were already the optional `label` (B-060, 10.21.2). **Reconcile** (coordinators): copy `tools/solution.mjs` and `docs/agents/solution-dashboard.md`; optionally set `label` per repository and `htmlTables: true`; a project tool that matches dashboard lines (a refresh's "views changed" filter, say) matches `**Total**` and, with `htmlTables`, `<tr valign="top"><td>` rows. Components: copy the page. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.21.3, 2026-11-25

- **Publish hooks for built backlog views** (F-100; asked by the owner after NERV forked `backlog-views.yml` to publish its own recap). A project with built views (`workItems.views: "built"`) may name build steps that run after the ledger is built and before it is published: `workItems.publishHooks`, e.g. `["node tools/backlog-recap.mjs"]`. Each entry is `node <repository script> [arguments]`, validated when the settings are read and run as argv with no shell. `backlog-views.yml` now has two jobs: `build` (`contents: read`, no stored credentials) runs `work-items publish --prepare`, which builds the ledger and runs the hooks, and uploads it as an artifact; `publish`, still the only job with `contents: write`, runs `work-items publish --ledger=<file>` and never runs a hook. A hook that fails or changes any file but the ledger stops the publication; plain `publish` refuses while hooks are set. Projects without the setting publish the same views as before. A patch, as the owner set, though the setting is optional. **Reconcile** (projects with built views): copy `tools/work-items.mjs`, `.github/workflows/backlog-views.yml` and `docs/agents/pull-requests.md`; a project that forked the workflow to run its own step sets `publishHooks` instead and copies the workflow again (`copied`, not `forked`). Notes: [built views](docs/apply/built-views.md). Skills re-read for this release: none (`skills:affected`). Skills to upload again: none.

## 10.21.2, 2026-11-25

- **Solution dashboard: five parts of the retired overview** (B-060; found by a solution coordinator that retired its own overview for the 10.21.1 dashboard). **▶ and Ready** now follow a record's next open step, the first in its ledger's work order: a record whose next open step is the owner's, or waits behind an owner step, reads as the owner's turn (or Blocked), never Ready or ▶, whatever agent work sits beside it (before, any ready agent step made it the next pick); work behind such a record names that owner step. The record's own Next line (work-items) may still name its agent step, which an agent may take; only the dashboard's next pick changes. **Last audit** names the newest audit of any kind, a scoped one included, beside the last full one ("2026-11-25 (scoped), no complete full audit"); the areas due are unchanged. A new **Open work by repository** section lists, per project, each open record with its open steps, agent and owner hours and state, then its open steps with their state, collapsed (it replaces the collapsed open-steps tables). **Gap-review** proposals are numbered, so the owner can answer "accept 2, drop 3". An optional top-level `label` in `.solution.json` (and per repository) is the name shown for the coordinator's rows (at most 40 characters, no Markdown or table characters), `solution` by default; references keep the ID. **Reconcile** (coordinators): copy `tools/solution.mjs`, `docs/agents/solution-dashboard.md` and `docs/agents/solution-gaps.md`; optionally add `label` next to the top-level `emoji`. Components: copy the two pages. Skills re-read for this release: none (`skills:affected`). Skills to upload again: none.

## 10.21.1, 2026-11-25

- **Markdown links built from data are escaped** (B-059; found by NERV's CodeQL, `js/incomplete-sanitization`, on a copy of `tools/solution.mjs`). The solution dashboard's Done link escaped `[` and `]` in its label but not the backslash, so a label ending in `\` escaped its own closing bracket; the dashboard's links to component files (archived records, references, Done links) now percent-encode every path segment, so a space, `#`, `%`, `&`, `|`, `\` or parenthesis in a file name no longer breaks or changes the link. `tools/impact-map.mjs` now escapes the `pages` titles of `.harness.json` and percent-encodes each segment of their paths. No action in projects beyond copying the tools. Skills to re-read: none; no published skill to upload.

## 10.21.0, 2026-11-25

- **Solution dashboard: the owner's overview layout** (F-099; a solution coordinator's Proposal 4, so it can retire its own overview tool). The owner view now opens with a **Summary** per project (open records, doable agent hours, owner hours, blocked agent work, harness release, next audit) with a solution line and the hours remaining in all backlogs; it replaces the earlier owner-view counts. The **Solution order** shows each item's project emoji, links the item to its row in the owning ledger at the resolved commit, gives agent and owner hours apart and lists its open prerequisites (each open step and what it waits on, linked, at most three); the next pick is marked ▶ instead of "**Ready — next**", and a record whose steps are all done, or that is Verified, reads "Ready (to close)" and is never the next pick. **Blocked** lists the agent work that cannot start (blocked, or waiting on a chain that reaches a block) per project, with its title, links, the block reached and its kind (owner procedure or decision, unknown prerequisite, cycle, record marked Blocked); owner steps behind another owner step are no longer counted there. **Nothing to do** lists the projects with no doable agent work (an empty runway) and why. **Waiting for the owner** has one row per record with an owner step or an owner cue: title, kind, priority, owner hours and the owner steps or next action. A top-level `emoji` in `.solution.json` labels the coordinator, validated like a repository's; every project label carries its emoji. Kept as the template's rules: a due audit reads as its due areas, the Blocked root is the first owner step to act on, and only structured `repo:ID` prerequisites count (not "waits on repo:ID" in prose). **Reconcile** (coordinators): copy `tools/solution.mjs` and `docs/agents/solution-profile.md` and `solution-dashboard.md`; optionally add a top-level `emoji` to `.solution.json`; move any prose cross-repository wait into a step's `dependsOn`; retire a project overview tool kept only for this layout (solution-refresh, "Moving from project tools", step 5). Components: copy the two pages. Skills re-read for this release: none named a changed file (`skills:affected`). Skills to upload again: none.

## 10.20.1, 2026-11-25

- **Solution dashboard: agent steps without a Who column and closed order items** (B-057, B-058; found by a solution coordinator reconciling to 10.20.0). `work-items build` writes a steps table's Who column only for a record with an owner step; the dashboard read the missing cell as no actor and marked those steps Blocked (one project: 61 Blocked against 10). Such a step is now agent work, Ready or Waiting by its Depends on and Status. An order item that closed in its repository (in any `docs/archive/backlog-*.md`, a manifest archive, or a `workItems` record or step source marked closed) now reads "✅ Done: closed <date> in <file>", linked at the resolved commit, instead of "Not in backlog"; an ID found nowhere still reads "Not in backlog" with its gap. The new `dashboard --write --prune-order` drops the Done items from the order file and renumbers the rest, for the refresh PR (the one exception to "the order changes only by an owner instruction"). **Reconcile** (coordinators): copy `tools/solution.mjs` and `docs/agents/solution-profile.md`, `solution-refresh.md` and `solution-dashboard.md`; add `--prune-order` to your refresh if you want it; retire a project tool kept only for these two views (solution-refresh, "Moving from project tools", step 5). Components: copy the three pages. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.20.0, 2026-11-25

- **Solution views: adoption notes** (F-097-T04): the solution views proposed by a solution coordinator are complete (F-095 in 10.10.0–10.16.0, F-097 in 10.17.0–10.19.0): order across repositories, owner view, agent runway, audits, reviews and harness per project, and gap review. `docs/agents/solution-profile.md` "Dashboard sections" lists them in order; `docs/agents/solution-refresh.md` "Moving from project tools" tells a coordinator with its own order or overview tools how to move. **Reconcile** (coordinators): copy `tools/solution.mjs` and `docs/agents/solution-profile.md`, `solution-refresh.md`, `solution-dashboard.md` and `solution-gaps.md`; if you built your own order or overview tools, then, in a session of the coordinator, recorded in its backlog: (1) move the order file to the shipped format (`.solution.json` `order`, one numbered `N. repo:ID — note` per line between the order markers; `node tools/solution.mjs check` passes); (2) turn prose prerequisites into `dependsOn` entries `repo:STEP-ID` in the repository that owns the waiting step, listed in its `externalMet` once met; (3) compare your tool with `node tools/solution.mjs dashboard` on the same commits, and send a defect of a shipped section to the template, never into an edited copy; (4) remove the project tools it replaces, with their scripts, tests and CI steps. Components: copy `docs/agents/solution-profile.md` and `solution-refresh.md`. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.19.0, 2026-11-25

- **Gap review: proposals for missing cross-repository work** (F-097-T03): the solution dashboard gains a "Gap review" section, and `docs/agents/solution-gaps.md` is the new procedure page. Proposals only, each naming the repository that would own the fix; the coordinator never creates or edits a record in a component. Kinds: a cross-repository need with no counterpart record (a text heuristic, and it says so); a prerequisite missing or unknown; a waiting item whose prerequisites are all done; the owner's turn without a page; an open record with no next step or estimate; an order item not in its backlog; a project behind the harness (a reconcile record proposed there). **Reconcile** (coordinators): copy `tools/solution.mjs`, `docs/agents/solution-gaps.md`, `docs/agents/solution-profile.md` and `docs/agents/procedures.md` (carry the added row into an adapted copy), and add the `docs/agents/solution-gaps.md` entry to `copied` in `.harness.json`. Components: copy `docs/agents/solution-gaps.md` and its `copied` entry like the other procedure pages. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.18.0, 2026-11-25

- **Audits, reviews and harness release per project** (F-097-T02): the solution dashboard gains an "Audits, reviews and harness" section. Per project, from its own evidence at the resolved commit: its harness version against the latest template release (with `--remote` the template's latest published GitHub Release; otherwise the coordinator's template clone tags), its audits by the rules of `check-audits.mjs` (the last full unblocked audit; areas stale, blocked or missing are listed as due, so a recent scoped audit refreshes only its areas), and each periodic review in `reviews.<name>.days`. A project behind, audit areas due and a review missing or due are marked; missing evidence reads as unknown, never as current (a version that is not `vX.Y.Z`, a release it cannot read, an unreadable or future-dated file), and a failure to read it leaves the backlog readable. `docs/agents/solution-dashboard.md` describes it. **Reconcile** (coordinators): copy `tools/solution.mjs` and `docs/agents/solution-dashboard.md`. Components: nothing. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.17.0, 2026-11-25

- **Agent runway across repositories** (F-097-T01): the solution dashboard's owner view ends with an "Agent runway" section: per project, the agent hours that can run before work reaches a block (open agent work that is ready, or waits only on work that can itself run, transitively and across repositories), the first blocks that work reaches, each named once (an owner step, an unknown or unavailable prerequisite, a cycle, a record marked Blocked, an external wait not yet recorded), and the owner hours that unblock the next layer; a solution line adds them, reading "at least" when a source or an estimate is unknown. Work behind an owner step is never counted, even through a step that waits on it; a prerequisite the reader cannot resolve is a block, never assumed done. `docs/agents/solution-dashboard.md` describes it. **Reconcile** (coordinators): copy `tools/solution.mjs` and `docs/agents/solution-dashboard.md`. Components: nothing. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.
## 10.16.1, 2026-11-25

- **Behaviour graders accept correct work they failed** (B-056): in the owner's rerun with the documented runner, four graders failed agents that followed the rules. A worktree under `.claude/worktrees/` inside the checkout no longer makes the untouched primary checkout a changed view; `keep-unrelated-code` accepts `legacyMean` rewritten to keep its exact behaviour (its comment asks for that), not only unchanged text; `ask-human-decision` accepts a plain request to choose ("Reply A or B") as well as a question; the `name-the-pr` fixture now holds what its task says, PR #12 merged on `main` with the fix and its test, so a careful agent can close B-001. **Reconcile**: copy `tools/behaviour.mjs`; rerun the agent-behaviour checks if you track them. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.16.0, 2026-11-25

- **The owner view of a solution** (F-095-T05): after its source table, the solution dashboard now shows what the owner needs. Each open step (or record without steps) is Ready, waiting on the Owner (procedure or decision), Waiting on other work, Blocked (root cause named: an owner step, an unknown or unavailable prerequisite, a cycle, or a record marked Blocked, in this or another project) or Done; every prerequisite counts, whatever its order, with `repo:STEP-ID` prerequisites resolved at the dashboard's resolved commits. New sections: a summary per project (optional manifest `emoji` per repository), the solution order with each item's live state and the first Ready item marked, Waiting for the owner, Blocked, Nothing to do (with the reason), and each project's open steps, collapsed. Read only; no percentage. `docs/agents/solution-dashboard.md` describes it. The last step of the solution-profile plan proposed by a solution coordinator (runway, audits and gap review follow in F-097). **Reconcile** (coordinators): copy `tools/solution.mjs` and `docs/agents/solution-dashboard.md`; optionally add `emoji` to repositories in `.solution.json`. Components: nothing. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.
## 10.15.2, 2026-11-25

- **Agent-behaviour graders read the agent's worktrees and branches** (B-055): the graders read only the fixture's primary checkout on `main`, so an agent that followed AGENTS.md (a worktree on its own branch, pushed to the fixture remote) was graded on an untouched checkout and failed: in an owner's run, `bug-is-b-record` failed although B-001 was recorded on its pushed branch. `grade` now reads every view of the work that differs from the prepared fixture: the primary checkout, each other worktree, and each new or moved local or pushed branch (a temporary clone checked out at it, so git-based checks still run); identical views are graded once, and every one must pass, so a mistake on any branch still fails. `docs/agents/rule-review.md` says so. **Reconcile**: copy `tools/behaviour.mjs` and `docs/agents/rule-review.md`, then rerun the behaviour checks. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.15.1, 2026-11-25

- **Agent-behaviour runs that could not act are errors, and the documented runner can act** (B-054): the runner `docs/agents/rule-review.md` gave as an example, `claude -p "$(cat "$HARNESS_TASK_FILE")"`, has no permission in non-interactive mode to edit files or run git, npm or node, so the agent only described what it would do and `behaviour.mjs` graded it as FAIL (an owner's 30-run check on 10.14.0 failed 7 of 10 scenarios this way). The guide now gives `claude -p --permission-mode acceptEdits --allowedTools "Bash(git:*)" "Bash(npm:*)" "Bash(node:*)" -- "$(cat "$HARNESS_TASK_FILE")"`, and a run that changed nothing (files, refs, worktrees, the remote) where a correct run must act, or whose transcript asks for permissions instead of acting, is reported as `error (runner lacks permissions?)`, counted apart from passes and failures. **Reconcile**: copy `tools/behaviour.mjs` and `docs/agents/rule-review.md`; update `behaviour.runner` in `.harness.json` if it is the old example, and rerun the behaviour checks. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.15.0, 2026-11-25

- **Remaining hours per backlog and a partial solution total** (F-095-T04): the solution dashboard gains a "Remaining effort" section: for each backlog, coordinator included, the remaining agent and owner hours from its generated totals line, else the sum of its open records' Remaining cells, labelled as that project's own, uncalibrated estimate, with its open records counted by priority and by size; a solution line adds them. A backlog it cannot read in hours shows Unknown and the solution line reads "at least N h"; no percentage appears anywhere. `solution.mjs check --json` includes each source's `effort`. The new `docs/agents/solution-dashboard.md` describes it, with the backlog-reading paragraphs moved unchanged from `solution-profile.md` to keep that guide within its budget; the procedure index names it. **Reconcile** (coordinators): copy `tools/solution.mjs`, `docs/agents/solution-profile.md`, `solution-dashboard.md` and `procedures.md`, and list `solution-dashboard.md` under `copied`. Components: nothing. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.14.1, 2026-11-25

- **`work:pr` commits carry the attribution trailer** (B-053): the "name PR #N" commit (and a rename follow-up) that `npm run work:pr` makes had no `Co-Authored-By` or other attribution line, so projects that require one on every commit got an unattributed commit in each PR. Its commits now end with `--trailer="Key: value"` lines given before the `--` (repeatable), or `HARNESS_COMMIT_TRAILER` (one per line), or, with neither, the `Co-Authored-By` trailers of the branch's newest commit; a malformed trailer is refused before anything is written. `docs/agents/pull-requests.md` names it. Reported from two projects' PRs. **Reconcile**: copy `tools/work-items.mjs` and `docs/agents/pull-requests.md` (carry the added sentence into an adapted copy); nothing else changes. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.14.0, 2026-11-25

- **Backlog views may be built instead of committed: the transition release** (F-096): a project with source-owned records can set `workItems.views: "built"` and stop committing `docs/BACKLOG.md`, so parallel PRs that change different records no longer conflict on it. Committed views stay the default; a later major release stops committing them, announced in its own entry. What ships, all inert while `views` is unset:
  - `work-items check` refuses a ledger git tracks or does not ignore and writes a fresh build; `work:pr` no longer commits it; a built view is never an input to its own rebuild (F-096-T02).
  - `work-items publish` and the new `core/.github/workflows/backlog-views.yml` publish `main`'s tree plus the ledger on the `backlog-views` branch on each push to `main`, a fast-forward, never forced; it is the only shipped workflow with `contents: write`, and `check-template` holds it to its reviewed text (owner decision 2026-11-25, option A). The Angular and solution CI templates attach the built ledger to each run as the `backlog-views` artifact (F-096-T03).
  - `check-backlog`, `check-freshness`, the maintenance, dependency and queue checks build a fresh view before reading; `reconcile-draft` builds one in memory; `check-backlog` compares with the published `origin/backlog-views` ledger; session start, review step 1, pull requests and the README template say so (F-096-T04).
  - Solution coordinators read a component's publication of the resolved commit (trusted only when its tree is the source tree plus the ledger) or rebuild it from a local checkout with their own `tools/work-items.mjs`; the dashboard names which (F-096-T05).

  **Reconcile**: copy the changed tools (`work-items.mjs`, `check-backlog.mjs`, `check-freshness.mjs`, `maintenance.mjs`, `reconcile-draft.mjs`, `backlog-dependencies.mjs`, `backlog-queue.mjs`, `solution.mjs`) and guides (`pull-requests.md`, `session-start.md`, `solution-profile.md`), re-adapt `docs/backlog/review.md` step 1, and move the `work-items check` CI step before every step that reads the ledger; nothing else changes while `views` is unset. To opt in, follow `docs/apply/built-views.md`. Coordinators: copy `tools/solution.mjs`, and `tools/work-items.mjs` to rebuild views that are not published. The impact map asks for an agent-behaviour rerun (review step 1 changed); it runs on the owner's runner. Skills to re-read: none; no skill upload is due.

## 10.13.0, 2026-11-25

- **The solution dashboard reader keeps steps and readiness, and reports unknown layouts** (F-095-T03): `tools/solution.mjs` now reads a generated record's Priority, Remaining, Depends on and Agent cells by column name and its steps table (each step's status, remaining hours, Who and Depends on, `repo:STEP-ID` included), for the owner view to come (F-095-T05). A summary column it does not know, an unknown status or a heading that names an ID but is not a record heading makes that source Unknown with the problem named, never a component with no work. With `--remote`, a backlog over 1 MB (left out by GitHub's contents API) is read through the blob API at the same resolved commit. `node tools/solution.mjs check --json` prints what the reader kept. `docs/agents/solution-profile.md` describes it. **Reconcile** (coordinators): copy `tools/solution.mjs` and `docs/agents/solution-profile.md`; a component whose ledger now reports a problem shows a layout the reader could not read before either. Components: nothing. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.
- `tools/work-items.mjs` and the backlog readers still carry the unfinished, opt-in F-096 code for built backlog views: leave `workItems.views` unset until the transition release (F-096-T06) documents it.

## 10.12.1, 2026-11-25

- **The solution order ships here; v10.12.0 is a mistaken tag** (F-095-T02): this release carries everything the 10.12.0 entry below describes, the solution order across repositories (`.solution.json` `order`, the profile's "Solution order", `solution.mjs check`, `solution/docs/SOLUTION-ORDER.md`). The `v10.12.0` tag was published by mistake on `0125a12`, before that change merged, so it holds 10.11.3 content; it stays as a prerelease marked "DO NOT USE" (owner decision 2026-11-25). Reconcile to 10.12.1, never to 10.12.0; the steps are those of the 10.12.0 entry. This repository's AGENTS.md "Releasing" now confirms a merge (`MERGED`, green `main` CI on that commit) before any tag. Skills to re-read: none beyond the 10.12.0 entry; no skill upload is due.

## 10.12.0, 2026-11-25 (tag published on the wrong commit: use 10.12.1)

- **A solution order across repositories** (F-095-T02): a coordinator's `.solution.json` may name an `order` file holding the owner's order across the solution, a numbered list of `repo:ID` references (a record or a step, with an optional note after ` — `) between `<!-- order:start -->` and `<!-- order:end -->`. `docs/agents/solution-profile.md` ("Solution order") states the rules: take the first ready item; work not listed follows each repository's own priority; the order changes only by an owner instruction landed as a PR; it never skips a prerequisite or an owner decision; references only, never status. `node tools/solution.mjs check` validates the list offline (syntax, known manifest IDs, duplicates, numbering from 1) without reading any component. The new `solution/docs/SOLUTION-ORDER.md` is the template; the dashboard reads the order in a later step (F-095-T05). The second step of the solution-profile plan proposed by a solution coordinator. **Reconcile** (coordinators, optional): copy `tools/solution.mjs` and `docs/agents/solution-profile.md`; to adopt, add `order` to `.solution.json` and adapt `docs/SOLUTION-ORDER.md`. Components: nothing. Skills re-read for this release: `apply-harness` (names `.harness.json` and `README.md`) and `docs-hygiene` (names `README.md`), both unchanged and still accurate after the F-096 README note. Skills to upload again: none.
- `tools/work-items.mjs` and the backlog readers still carry the unfinished, opt-in F-096 code for built backlog views: leave `workItems.views` unset until the transition release (F-096-T06) documents it.

## 10.11.3, 2026-11-25

- **The Angular convention check reads folder names from the repository root** (B-052): without `conventions.sourceDirs`, the `testing/` exclusion was tested on the absolute path, so a checkout under a parent folder named `testing` skipped every file and passed; and the framework-free check (`conventions.pureDirs`) matched a parent folder of the same name (`core/` above the checkout), so every app file was checked as framework-free. Both now read the path from the repository root, with `/` separators, so on Windows they now match at all. A project that newly fails after this release was passing by mistake: fix what the check reports. Found by the independent review of F-098-T04. **Reconcile** (Angular projects): copy `tools/check-conventions.mjs`; nothing else changes. Skills to re-read: none; no skill upload is due.
- `tools/work-items.mjs` also carries the unfinished F-096 code for built backlog views (`workItems.views`, `work-items publish`): it is opt-in and changes nothing while `views` is unset; leave it unset until the transition release (F-096-T06) documents it.

## 10.11.2, 2026-11-25

- **With `conventions.sourceDirs` set, only the named folders are app code** (F-098-T04): the Angular `check:conventions` still counted any file whose absolute path contained `/src/` as app code when `sourceDirs` was set, so a checkout under a parent folder named `src` made every file in `tools/` and `e2e/` (the check itself included) app code, and a stray `src/` under `tools/` or `e2e/` did too. With the setting, a file is now app code only inside a named folder, tested on its path from the repository root, and the `testing/` exclusion reads that path too, so a parent folder named `testing` no longer hides the app; without the setting nothing changes. Found by the independent review of #254. **Reconcile** (Angular projects): copy `tools/check-conventions.mjs`; nothing else changes. Skills to re-read: none; no skill upload is due.

## 10.11.1, 2026-11-25

- **The Claude status line saves from a folder that is no checkout** (B-051): `work-usage.mjs claude-status` (and every command that opens the usage store) treated the working folder as the checkout, so run from the home folder or `/`, which enclose the default store `~/.local/state/project-harness/work-usage`, it exited 1 with "Usage store must be outside the checkout" and saved no allowance snapshot. The checkout is now the nearest ancestor of the working folder holding `.git`; a folder in no checkout may enclose the store, and a store inside a git checkout is still refused, as are symlinked paths. Copy `tools/work-usage.mjs`; nothing else changes. Skills to re-read: none; no skill upload is due.

## 10.11.0, 2026-11-25

- **The Angular convention check reads configured source folders** (F-098): `check:conventions` read only `src/`, so a project whose app lives elsewhere (for example `apps/client/src`) passed with its app unchecked. `.harness.json` `conventions.sourceDirs` now lists the app's source folders, relative to the repository root; the check reads them instead of `src/` (plus `tools/` and `e2e/`, as before). Without the setting nothing changes. A folder that is absolute, leaves the repository, does not exist or is not a folder, or a value that is not a non-empty list, fails the check naming the setting; a configured folder with no app files is a warning. `docs/agents/angular.md` and the apply route for writing tools (`docs/apply/write-tools.md`) describe it. Asked by a project whose client is in a nested folder. **Reconcile** (Angular projects): copy `tools/check-conventions.mjs` and `docs/agents/angular.md` (carry the added sentence into an adapted copy); if the app is not in `src/`, set `conventions.sourceDirs` and fix what the check then finds. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.10.0, 2026-11-24

- **A step may wait on a step of another repository** (F-095-T01): a task file's `dependsOn` now accepts `<repo>:<STEP-ID>` (for example `api:F-101-T04`), where `<repo>` is that repository's ID in the solution manifest. `check:work` accepts it as an external prerequisite: the syntax is checked, the reference is never resolved and needs no access to the other repository, and it takes no part in the cycle check. The step waits (⏳ in its Who and Agent cells, left out of `work:next`, not claimable, an owner step not yet the owner's turn) until its new optional `externalMet` lists the reference, written once this repository has checked that step's outcome. The step's and the record's Depends on cells show `repo:STEP-ID`, linked to that repository's ledger row when the new optional `workItems.externalRepositories` maps the ID to its GitHub `owner/name`. A malformed reference, a record ID instead of a step, and an `externalMet` entry that is not one of the step's external prerequisites are refused. A sentence naming another repository's record (`api:F-001`) is no longer read by `check:work` as a local blocker with no step. `docs/backlog/ordering.md`, `docs/agents/parallel-work.md` and `docs/agents/solution-profile.md` describe it. The first step of a solution-profile plan (F-095) proposed by a solution coordinator; resolving the references across a solution comes with its dashboard steps. **Reconcile** (optional): copy `tools/work-items.mjs`, `tools/task-claims.mjs`, `docs/agents/parallel-work.md` and `docs/agents/solution-profile.md`, and carry the one-sentence addition into the adapted `docs/backlog/ordering.md`. Skills re-read for this release: none named a changed file (`skills:affected`). Skills to upload again: none.

## 10.9.0, 2026-11-24

- **Open a PR with its number already in its records** (F-094): `npm run work:pr -- <ID>[,<ID>] -- <gh pr create options>` (in `tools/work-items.mjs`) predicts the next number GitHub will assign (issues, PRs and discussions share one sequence: the newest of the three plus one; a transferred or deleted item can shift it, and then the follow-up below applies), writes it as a link into each record's PR / evidence row and in place of any unquoted "this PR", rebuilds the ledger, commits, pushes and opens the PR from the current branch. The record names its PR in the commit that opens it, so the follow-up commit and its extra CI run go away. If another issue or PR took the number meanwhile, it renames it in a follow-up commit, as before, and says so. It refuses the repository's default branch, a dirty tree, no records, a branch that already has an open PR, `GH_REPO`, and options that move the PR elsewhere or print no URL (`--head`, `--repo`, `-H`, `-R`, `--web`, `--dry-run`). A rerun after `gh pr create` failed swaps the number the earlier run wrote but never opened. `docs/agents/pull-requests.md` and review step 7 (`docs/backlog/review.md`) name it. Found by gauntlet-protocol's first skill discovery review: 60 of 176 commits there only named a PR. **Reconcile** (optional): copy `tools/work-items.mjs`, add the `work:pr` script, and carry the one-sentence additions into the adapted `docs/agents/pull-requests.md` and `docs/backlog/review.md`. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.8.1, 2026-11-24

- **`work:close` works without a tasks folder** (B-050): a project with source-owned records and `featurePlans` off has no task files, git keeps no empty folder, so a fresh clone had no `docs/work/tasks` and `work:close` stopped with ENOENT. It now treats a missing folder as no steps; with `featurePlans` on, a missing folder is refused before anything is written. Copy `tools/work-items.mjs`; nothing else changes.

## 10.8.0, 2026-11-24

- **Every procedure fits its budget: base and child files** (F-093): `check:rule-load` warned that `docs/agents/skills.md` was over the 2,000-token budget for one procedure, and three more were within 5 % of it. As AGENTS did in 10.5.0, each base keeps its trigger and binding rules and links a child with the detail, every sentence kept (traced in `docs/design/lean-procedures-traceability.md`): `skills.md` (2,079 → 1,105) → new `skills-discovery.md` (discovering new skills, OWASP AST10 checklist); `work-usage.md` (1,961 → 1,438) → new `work-usage-launch.md` (client bridges, prelaunch registration); `backlog/records.md` (1,943 → 1,266) → new `backlog/human-action.md` (human-action line and Issue / Reproduce / Check table) and the effort bullet into `backlog/estimates.md`, "Effort"; `backlog/review.md` (1,893 → 1,688) → new `backlog/ledger-header.md` (generated header, Other changes). BACKLOG-RULES routes to the backlog children, "change any record" now names `human-action.md` and `estimates.md` "Effort" beside `records.md`, the procedure index gains a skill-discovery row, and the AGENTS job-usage row names the launch child. Found reconciling a project to 10.7.0. **Reconcile**: copy `docs/agents/skills.md`, `skills-discovery.md`, `work-usage.md`, `work-usage-launch.md` and `procedures.md`; in AGENTS, the job-usage row reads "(sources, launch, effectiveness inside)"; add `docs/backlog/human-action.md` and `ledger-header.md` and re-adapt `records.md`, `estimates.md`, `review.md` and `BACKLOG-RULES.md` from the template diff, keeping `<!-- project -->` lines (a project line in a moved bullet moves with it); register the new files in `.harness.json` (`copied`, `adapted`, `maintenance.inputs`) and re-record the maintenance review. Skills re-read for this release: `apply-harness` (names `.harness.json` and `README.md`; unchanged), `docs-hygiene` (names `README.md`; unchanged). Skills to upload again: none.

## 10.7.0, 2026-11-24

- **Close a released record in one command** (F-091): `npm run work:close -- <ID> --evidence="…" [--release=vX.Y.Z] [--verification="…"] [--date=YYYY-MM-DD]` (in `tools/work-items.mjs`) refuses a record with a step that is not implemented, verified or closed, any human-action cue but `No`, a release tag that is not on `origin`, or a day that is not real or earlier than the archive's last (a reopened record closes again, as a second archived copy); otherwise it closes the record's steps with nothing remaining, rewrites its status cells, adds the closure evidence, moves it into `docs/archive/backlog-<year>.md` under one `## Closed <date>` heading per day with its links relocated, regenerates the weekly index when `archive-recap` is adopted, and rebuilds `docs/BACKLOG.md`. The reconcile log entry and the ledger header stay with the agent (`npm run reconcile:draft`). `docs/backlog/closure.md` describes it. Found by the 2026-11-24 skill discovery review: about 35 closures by hand since October. **Reconcile** (optional): copy `tools/work-items.mjs` and `docs/backlog/closure.md`, add the `work:close` script. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.6.1, 2026-11-24

- **Friction samples survive the worktree they were recorded in** (B-049): `tools/friction.mjs` now appends finished samples to `.harness/friction.jsonl` in the primary checkout (found through git's common directory) instead of the checkout it runs in. Every task runs in its own worktree, so samples recorded there used to disappear with it, and `node tools/maintenance.mjs review` from a worktree failed with "Finish a timed workflow" although recent samples existed. A running `start` session stays in its worktree, and `finish` without one says so. Outside git, in a project below its repository's top level, in a submodule and in a worktree of a bare repository the root is used as before; works with git before 2.31. `docs/agents/rule-review.md` says where the log lives. **Reconcile**: copy `tools/friction.mjs` and `docs/agents/rule-review.md`; samples already in a worktree's `.harness/` can be appended to the primary checkout's log by hand before removing it. Skills re-read for this release: `apply-harness` (names `.harness.json`; unchanged). Skills to upload again: none.

## 10.6.0, 2026-11-24

- **Skills stay valid across releases** (F-089): `npm run check:skills` now checks every skill against the release it ships in. A repo-only skill (such as `apply-harness`) fails when it names an npm script that `package.json` does not define, or a repository file or link the release does not contain: `APPLY.md`, `.harness.json`, a path under `tools/`, `docs/`, `core/` or another top-level folder, in prose, code spans or fenced blocks. A standalone skill stays self-contained and now also fails on an npm script `package.json` does not define, or without its own `metadata.version` (so an upload changes the version only when the skill changed; `skills:affected` warns when a changed skill's version is still the one at the last tag). Examples under a skill's `templates/` belong to the consumer and are not checked. The new `npm run skills:affected [-- <tag>]` lists, since the last tag, the skills that name a changed file (directly or through an npm script that runs it), to re-read, and the standalone skills whose own files changed, to package and upload again (Agensi); AGENTS.md "Releasing" asks to name both in the release entry, and `docs/agents/skills.md` describes the check. **Reconcile**: copy `docs/agents/skills.md`; nothing else changes. Skills re-read for this release: `apply-harness` (it names `AGENTS.md` and `.harness.json`; still accurate, unchanged). Skills to upload again: none.

## 10.5.0, 2026-11-23

- **AGENTS fits the always-loaded budget** (F-090): `core/AGENTS.md` goes from about 3,160 to 2,575 tokens, and this repository's always-loaded set from 3,522 to 2,540. The safety block is byte-identical, and no requirement is dropped: every old sentence is traced in `docs/design/lean-agents-traceability.md`. What moved: the Documentation section to `docs/backlog/documentation.md` ("Top-level documents", verbatim, with a procedures row); the ownership paragraph to a one-line pointer (full text in `docs/backlog/ownership.md`); the procedures table merges rows whose guides link each other (work usage, claims, MCP commands, solution refresh, audit findings, rule review); a duplicate harness-file line removed; wording tightened elsewhere. `work-usage.md` now says it owns its rule. **Reconcile**: re-adapt AGENTS.md from the new `core/AGENTS.md`, keeping every `<!-- project -->` line, drop procedures rows for features you did not adopt, copy `docs/agents/work-usage.md` (copied), and add the "Top-level documents" section to your adapted `docs/backlog/documentation.md` (keep its `<!-- project -->` lines; a project line that sat in AGENTS "Documentation" moves there with its mark). The changed AGENTS lines are maintenance inputs: re-record the maintenance review.

## 10.4.0, 2026-11-23

- **Landing queue for parallel work**: agents build in parallel but land one at a time. `core/AGENTS.md` ("On its own") now lands an agent's own PR through the landing queue; `core/docs/agents/parallel-work.md` adds "Landing queue" (agents stop at ready; one lander updates, regenerates the generated views, runs the slow checks and merges one PR at a time with at most two in CI; one heavy local run per machine; a real failure goes back to its owner) and `core/docs/agents/claims.md` links it. Found in NERV on 2026-11-23: parallel landing queued up to 12 CI runs and caused load-only test failures. Reconcile: copy the two docs and adopt the AGENTS line; no project file has to change to keep passing.

## 10.3.1, 2026-11-23

- **check-rules escapes every regex character of a glob** (B-048): a `rules.procedures` glob such as `docs/x+*.md` no longer reads `docs/xxdeploy.md`; every regex character is escaped as `rule-load.mjs` already does. Fixes CodeQL js/incomplete-sanitization (high) in projects that copy the tool. Copy `tools/check-rules.mjs`; nothing else changes.

## 10.3.0, 2026-11-23

- **Standalone skill packaging & self-contained check** (F-075-T01, F-075-T02): `tools/skills.mjs` adds `npm run skills:package` (writes `dist/skills/<name>-<version>.zip` with `SKILL.md` and `LICENSE` at the zip root) and `npm run check:skills` (fails on links outside the skill folder or `.harness.json` requirements); `skills/apply-harness/SKILL.md` is marked `metadata.distribution: repo-only`.
- **Periodic skill discovery review** (F-087): `core/docs/agents/skills.md` adds the skill discovery review procedure (sources, four backlog outcomes, `docs/reviews/skills/<YYYY-MM-DD>.md`), `core/tools/check-freshness.mjs` points `reviews.skills.days` warnings to `docs/agents/skills.md`, and `docs/apply/reconcile.md` offers `reviews.skills.days` on reconcile.

## 10.2.0, 2026-11-22

- **CI runs on pushes to `main`** (F-086): `.github/workflows/ci.yml` now triggers on `push: branches: [main]` in addition to `pull_request: branches: [main]`, and `docs/apply/write-ci.md` documents the `push` trigger for adopted project workflows. Optional: add `push: branches: [main]` to your project's `ci.yml`.

## 10.1.1, 2026-11-22

- **`merge-when-green` runs `gh` outside any local checkout**: `tools/merge-when-green.mjs` resolves the GitHub `owner/repo` slug (from `GH_REPO`, `git remote get-url origin`, or `gh repo view`) and runs `gh` from `os.tmpdir()` with `--repo` (and explicit `owner`/`repo` in GraphQL), so `gh pr merge` never fast-forwards a local branch in the calling checkout. Optional: reconcile `tools/merge-when-green.mjs`.

## 10.1.0, 2026-11-20

- **Step Depends on and Unlocks, and prose-only blockers** (F-085): the generated steps table gets Depends on and Unlocks columns, each open step's open prerequisites and the open steps that wait on it, in any record, linked to their rows; verified and closed steps are left out, and the columns appear only in records where some open step has one. A waiting step's Status no longer appends `· waits on <step>` (the Depends on cell says it). `check:work` warns (`proseBlockers`, not a failure) when a record's newest Next action entry or its Check names another active record next to waiting words and none of its open steps depends on a step of that record, so a blocker written only in prose stops looking movable. Optional: reconcile `tools/work-items.mjs`, `docs/backlog/steps.md` and `docs/backlog/ordering.md`, then `npm run work:build`; for each warning, add the blocking step to the waiting step's `dependsOn` or reword the prose.

## 10.0.0, 2026-11-18

- **Breaking — An owner step that is next is shown as the owner's, with its page** (B-047): with `Next: from tasks.`, when the next step is the owner's turn (its Who cell names only the owner and nothing waits, including an implemented step still owing owner hours), the generated line turns 🧑 with the step's kind and leads with its face linked to the step's `ownerLink`, instead of keeping the authored 💻; an agent step that can start at the same time is named first, so the record stays among the agent candidates. A step owing owner hours without `ownerKind` shows 🧑 and counts as a procedure until classified (check:work names it). `check:work` now also reports implemented steps owing owner hours without `ownerLink`, and fails (exit 1) instead of warning. **Migration**: reconcile `tools/work-items.mjs`, `docs/backlog/steps.md` and `docs/backlog/feature-plans.md`; give every owner step `check:work` names an `ownerLink` to its copy-paste procedure or decision page; then `npm run work:build`.

## 9.0.0, 2026-11-15

- **Breaking — Zero remaining effort on done steps and empty steps table fix** (B-043, B-046): `check:work` now refuses any `verified` or `closed` step that retains remaining `agentHours`, `ownerHours`, or `days`, and `renderLedger` omits the blank row when all steps are in `Done steps (n)`, counts verified and closed steps as completed in the Total row, and drops `"so far"` from done-step actuals. **Migration**: set `agentHours`, `ownerHours` and `days` to `0` on verified and closed steps, reconcile `tools/work-items.mjs` and `docs/backlog/estimates.md`, then `npm run work:build`.
- **Maintenance review generated-heading fix** (B-044): `tools/maintenance.mjs` now matches generated anchored record headings (`### <a id="..."></a>[✨ F-###](#top)`) for `backlog` outcomes. Reconcile `tools/maintenance.mjs`.
- **Owner steps without `ownerKind`** (B-045): `check:work` reports open steps whose turn it is that owe `ownerHours > 0` without `effort.ownerKind` (`ownerStepsWithoutKind`); `docs/backlog/steps.md` states such steps must be classified or split. Reconcile `tools/work-items.mjs` and `docs/backlog/steps.md`.
- **Periodic review cadence hardening & private outside scans** (F-083-T03, F-084-T02): `check-freshness.mjs` matches only `<date>.md` and `<date>-<name>.md`, validates calendar dates, warns on invalid/future dates without hiding due reviews, and handles bad `reviews` configs; `core/.harness.json` makes `reviews` opt-in; `rule-review.md` and `architecture-review.md` require generic web-search queries (no project names, data, code, or usage figures) and `architecture-review.md` names one report location (`docs/reviews/architecture/<date>.md`). Reconcile `tools/check-freshness.mjs`, `docs/agents/maintenance.md`, `docs/agents/rule-review.md`, `docs/agents/architecture-review.md`, and `AGENTS.md`.

## 8.18.0, 2026-11-15

- **Periodic review cadences and token review** (F-083): `check:freshness` checks `reviews.<name>.days` in `.harness.json` against dated reports under `docs/reviews/<name>/<YYYY-MM-DD>.md` (or `docs/reviews/<YYYY-MM-DD>-<name>.md`) and emits a non-blocking warning when missing or stale. `docs/agents/rule-review.md` adds `## Periodic token review` (`work-usage` and `rule-load` inputs, web search scan, `adopt`/`adapt`/`reject` table, never unattended). Optional: reconcile `tools/check-freshness.mjs`, `docs/agents/maintenance.md`, `docs/agents/rule-review.md`, `AGENTS.md`, and add `reviews.token.days` (e.g. `30`) in `.harness.json`.
- **Outside-landscape architecture comparison** (F-084): `docs/agents/architecture-review.md` adds `## Outside-landscape comparison` on the `reviews.architecture.days` cadence (web search of comparable and frontier systems; `adopt`/`adapt`/`reject`/`watch` table with entry level, rationale, and evidence; decision and backlog records in the owning repository). Optional: reconcile `docs/agents/architecture-review.md` and add `reviews.architecture.days` (e.g. `30`) in `.harness.json`.

## 8.17.0, 2026-11-15

- **Suggested pauses** (F-080-T02): `work-usage report` lists `suggestedPauses` per job from 100 % allowance buckets (until `resetsAt` or the next activity) and idle gaps without events, phases or snapshots longer than `workUsage.pauseGapMinutes` (default `15`). Suggestions are never subtracted until confirmed with `pause`. Optional: reconcile `tools/work-usage.mjs`, `docs/agents/work-usage.md`, and `workUsage.pauseGapMinutes` in `.harness.json`.
- **Empty backlog & roadmap prompt** (F-082): `check:freshness` reports one `🤔` owner decision when no backlog record and no roadmap milestone is open (or `docs/ROADMAP.md` is missing); `docs/backlog/feature-plans.md` states that the agent derives records only from an agreed milestone. Optional: reconcile `tools/check-freshness.mjs` and `docs/backlog/feature-plans.md`.

## 8.16.1, 2026-11-15

- **Fix** (B-028): the record summary's Agent cell shows 🤖 when an implemented step is the agent's to verify (agent hours left, or no owner hours owed), matching that step's Who cell; before, it read ⏳ whenever every planned or ready agent step waited, so a record the agent could move looked blocked. Optional: reconcile the copied `tools/work-items.mjs` and `docs/backlog/steps.md`, then `npm run work:build`.

## 8.16.0, 2026-11-15

- **Fix** (B-027): an implemented step's Who cell names who its remaining work waits on: the owner's face while owner hours remain (🧑 when it names no `ownerKind`), 🤖 only while agent hours remain or nobody else is owed. Before, a step without `ownerKind` or with a baseline always showed 🤖.
- **Done steps table** (F-081): verified and closed steps move from the steps table to a collapsed `Done steps (n)` table below it; the total row still counts every step; `check:backlog` reads records without it. Optional: reconcile the copied `tools/work-items.mjs`, `tools/check-backlog.mjs` and `docs/backlog/steps.md`, then `npm run work:build`.

## 8.15.0, 2026-11-14

- **Paused time** (F-080-T01): `work-usage pause --job --from --to` records a `paused` interval when the agent could not run (a usage limit, the owner away), also on a finished job. Reports add `effectiveElapsedMs` and `pausedUnionMs`, `effectiveElapsed` per step, and compare elapsed estimates without the pauses; a `measured` actual is now the effective elapsed time. Reviews and CI waits stay counted. Optional: reconcile the copied `tools/work-usage.mjs` and the three work-usage and estimates docs.

## 8.14.3, 2026-11-14

- **Fix** (B-024): `reconcile:draft` drafts its entry under the F-066 heading (`## <date> — <branch> \`<sha>\``), so a log-built header reads it; with scoped verification enabled, a skipped job is not flagged or counted against green.
- **Fix** (B-026): `rule-load` does not hold a page a tool writes (first line `<!-- Written by … -->`, such as `impact-map.md`) to the procedure-file budget.
- **Re-estimation** (owner request): the estimates rule says to start from each step's current estimate and revise the steps that resemble the samples that missed, never multiplying every open step by one ratio.

## 8.14.2, 2026-11-14

- **Fix** (B-025, found by CodeQL in a project): `rule-load.mjs` escapes every regular-expression character in a `rules.procedures` pattern (only `*` is a wildcard), and heading slugs drop nested tags without leaving a fragment. CodeQL's two high alerts on the file (incomplete sanitization) go away.

## 8.14.1, 2026-11-14

- **Fix** (B-023): `verification.mjs` compares a full CI run's completion time with the clock when it reads it, not when the check started, so a slow GitHub API no longer drops valid full-run evidence. Two tool tests that failed intermittently under the parallel suite are reliable (10 consecutive full runs passed).

## 8.14.0, 2026-11-14

- **Rule load within every budget** (F-078, owner-approved plan with D2 amended). `check:rule-load` now prints no warning in the template: always loaded 3,475 tokens; every route ≤ 5,000; every file ≤ 2,000.
  - `APPLY.md` is a 376-token index; its parts live in `docs/apply/` (adopt, write-docs, write-tools, write-ci, optional-a, optional-b, reconcile, overrides, upgrades/6-7, upgrades/8), with `docs/apply/where.md` mapping every former heading so citations still resolve. The apply route reads 3,851 tokens instead of 18,221. Traceability: `docs/design/apply-split-traceability.md`.
  - The 2.0.0–5.6.0 upgrade notes are removed by the owner's decision; they remain in `APPLY.md` at tag `v8.13.0`, and `docs/apply/reconcile.md` points a project on an older release there or to re-adoption.
  - Moved verbatim to linked files: prompt caching (`docs/agents/prompt-caching.md`), upfront feature plans in parallel work (`docs/agents/parallel-work-plans.md`); the change-impact route reads `change-impact.md` only.
- **Fix** (B-022, reported from a project's CI): the backlog header no longer depends on clone depth. When two reconciliation entries share a date and ancestry cannot be decided (a single-commit checkout), the header already committed in `docs/BACKLOG.md` chooses; with history the descendant still wins.
- GitHub Releases now exist for every tag from v6.1.0 (F-079), and the release step publishes the next one.

## 8.13.0, 2026-11-14

- **Token-lean outputs** (F-077, owner request: fewer tokens over less time). Characters printed, before → after, measured 2026-11-14:

  | Output | Before | After |
  |---|---:|---:|
  | `npm run test:tools`, passing (234 tests) | 25,159 | 42 |
  | `check:freshness` (maintenance evidence JSON → one line) | 4,034 | 2,493 |
  | `ci:status`, six green PRs | 1,640 | 538 |
  | verification plan (template / NERV) | 589 / 362 | 121 / 186 |
  | npm `notice run` lines per script | 2 | 0 |
  | next steps in NERV (`work:tasks` → `work:next`) | 568,352 | about 1,000 |
  | NERV `src`, read whole → `code:map` | 1,261,378 | 23,115 |

  - Quiet defaults (F-077-T01): `check:freshness`, `ci:status` and `verification.mjs` print findings and one summary line; `--verbose` restores the full output. `core/npmrc.txt` sets `loglevel=warn`.
  - `core/tools/quiet-reporter.mjs` (F-077-T02): `node --test` prints each failure in full with what its file logged, then the totals; the spec report goes to the ignored `.test-report.txt`.
  - `core/tools/reconcile-draft.mjs` (F-077-T03, `npm run reconcile:draft`): the PRs merged since the backlog header with their CI and the records naming each; prints only failed or missing CI, unnamed PRs and commits without a PR, then a draft entry.
  - `work-items.mjs next` (F-077-T04, `npm run work:next`): the steps that can move now, one line each.
  - Record size budget (F-077-T05): `check:backlog` warns when a record passes `rules.budgets.record` (default 1,500 tokens); older evidence moves to `docs/archive/evidence-<year>.md` with a link back.
  - `core/tools/code-map.mjs` (F-077-T06, `npm run code:map -- <path>`): each source file's exports with line ranges (`codeMap.folders`, default `src`).
- **Fix** (B-020): inside the template repository, unreleased copies are named once ("Unreleased since vX …") instead of four project-drift warnings.
- **Fix** (B-021): `work-usage` stops the Codex app-server child on its real exit: a signal exit counts as exited (no needless SIGKILL and second grace wait), and after SIGKILL the exit itself is awaited. Found as a CI-only test failure.
- Full audit 2026-11-14 (all eight areas); its dead `RECORD` export in `work-items.mjs` is removed.
- Release review (fresh context, no blockers): `check:freshness` names each maintenance candidate; `code:map` keeps decorators with their class, reads wrapped export lists and `const enum`, and a stray backtick no longer hides the next export; `reconcile:draft` counts only this repository's PR links, flags skipped checks as `ci:status` does, and says when `gh` is unavailable; the quiet reporter skips failing `todo` tests; APPLY's 8.13.0 note names `work-usage`.

## 8.12.0, 2026-11-14

- **Rules load top-down** (F-076, owner request): an agent read about 4.1k tokens of AGENTS.md in every session and 11.2k of BACKLOG-RULES for any record change. AGENTS keeps the safety block, privacy, conventions, the project command block, the always-on coding rules and the procedures table; the PR workflow, scoped verification and independent review move to `docs/agents/pull-requests.md`, the session-start list to `docs/agents/session-start.md`, and the Task context and Development usage paragraphs become table rows (their text opens the procedure as "In short"). BACKLOG-RULES becomes an index at the same path; its sections move verbatim, by trigger, to `docs/backlog/` (records, steps, estimates, review, documentation, closure, ownership, ordering, evaluations), keeping their headings so citations such as "BACKLOG-RULES, Review procedure" still resolve. Two sentences that only described what `work-items build` generates were dropped (D3); every other sentence is accounted for ([traceability](docs/design/rule-split-traceability.md)). Procedure files over the 2,000-token budget give whole sections, verbatim, to a second file with a pointer left behind: `claims.md` (from parallel-work), `rule-review.md` (friction, agent-behaviour checks, rule consolidation, from maintenance), `mcp-commands.md`, `solution-refresh.md`, `audit-findings.md`, `work-usage-sources.md` and `work-usage-effectiveness.md`, and in `docs/backlog/` `feature-plans.md` and `outcomes.md`; each has its own procedures-table or index row, and the template reports "within budgets". The Angular stack rules move from `angular/AGENTS.angular.md` to `docs/agents/angular.md`, read before changing Angular code. Measured in the template with `rule-load`: always-loaded 4,132 → 2,920 tokens; a record update (always-loaded + the index + `docs/backlog/records.md`, added by hand because the trigger links only the index) 15,300 → 5,418. **Reconcile:** adapt `docs/agents/pull-requests.md` (carry the project's own PR and conflict wording across from AGENTS: it is adapted, not copied), copy `session-start.md`, the seven new `docs/agents/` files above and the sources they left (`maintenance.md`, `mcp.md`, `solution-profile.md`, `audit.md`, `parallel-work.md`, `work-usage.md`) and the updated `task-context.md`, `work-usage.md` and `parallel-work.md`; adapt `docs/backlog/*.md` and the new BACKLOG-RULES index (project lines move with their section); in AGENTS remove the moved paragraphs (keep `<!-- project -->` lines that are rules: they stay in the safety block or move with their section) and add the table rows; move an Angular block to `docs/agents/angular.md` with its row; add the new files to `adapted`/`copied` and `rules.procedures` (`docs/backlog/*.md`); `npm run check:rules` must pass.
- **Rule-load budgets** (F-076-T05): `node tools/rule-load.mjs --check` (`npm run check:rule-load`) warns, never fails, when the always-loaded rules, one procedure file or one trigger's reading passes `rules.budgets` (defaults 3,500 / 2,000 / 5,000 tokens). **Reconcile:** copy `rule-load.mjs`, add its mapping, the script and a CI step after `check:rules`.
- **Claim only what the step changes** (owner request): parallel-work guidance now says to claim exact files or narrow globs, never a whole top-level folder or every record, and to release the claim once the push is done; `contract:backlog-ids` and `generated:backlog-views` are held only for minutes. **Reconcile:** copy `parallel-work.md`.

## 8.11.0, 2026-11-13

- **Steps in the order work can happen, with linked prerequisites** (F-074, owner request from a project): a steps table listed steps by ID, so a step could sit above the prerequisite it waits on, and `waits on F-006-T08` was plain text. Steps now come in three groups: those that can move now, then waiting steps (each below every prerequisite it has in the record), then verified and closed steps; ties go by ID. Every row has an anchor (`#f-006-t08`). `waits on` names every open prerequisite, in the same record or another, as a link to its row, and step IDs in the Depends on / Unlocks cells link to their rows. With one actor per step (8.10.0), the Agent, Procedure and Decision columns become one Who cell: 🤖, 🧑‍🔧 or 🤔 linked to its page, ⏳ before the face while the step waits (⏳ 🤖, ⏳ 🧑‍🔧, ⏳ 🤔); a step not yet split shows each actor it has. Copy `tools/work-items.mjs`, reconcile the BACKLOG-RULES sentences and rebuild. A project tool that matched step rows starting with the ID must allow the anchor before it.

## 8.10.0, 2026-11-13

- **One actor per step, and an Agent cell in the summary** (F-073, owner request from a project): a step that held agent hours and owner work, or a decision and a procedure, showed several faces on one row without an order. The rules now ask for one actor per step: split mixed work into consecutive steps, and give no new step `ownerKind: "both"`. `check:work` lists open steps with more than one actor (`mixedSteps`, `both` included); it warns but does not fail. With feature plans, the record summary gains an Agent cell before Procedures and Decisions: 🤖 when an agent step can start now, ⏳ when open agent steps all wait, — when none is open. `check-backlog`, `backlog-queue` and `solution` accept the new header. Copy `tools/work-items.mjs`, `check-backlog.mjs`, `backlog-queue.mjs` and `solution.mjs`, reconcile the BACKLOG-RULES sentence, split the reported steps and rebuild. A project tool that reads the summary row by position must allow the extra cell.

## 8.9.1, 2026-11-13

- **Queue order counts step-level dependencies** (B-019, reported by a project): since 8.8.0 a step may wait on a step of another record, but `workItems.order: "queue"` read only record-level `Depends on` rows. Such a dependency now counts in the order: the prerequisite record gets credit for what it unblocks and is placed above the record that waits on it. It does not change lanes, since the rest of the waiting record stays free. Copy `tools/work-items.mjs` and rebuild.

## 8.9.0, 2026-11-13

- **Whose turn a step is** (F-072, owner request from a project): an upfront plan puts the owner's acceptance after the agent work it tests, so every project has owner steps that wait on agent steps. 8.8.0 drew 🧑‍🔧 / 🤔 on all of them. The steps table now has an Agent column (🤖 where a step has agent work). An owner step whose prerequisites are not all verified or closed shows ⏳ in its owner column and `waits on <step>` in its status, and gets its face once it is the owner's turn. `check:work` asks for an `ownerLink` only on those steps. Summary cells already counted only ready owner steps (8.3.0). Copy `tools/work-items.mjs`, reconcile the BACKLOG-RULES sentence and rebuild.

## 8.8.0, 2026-11-13

- **Owner work and dependencies at step level** (F-071, owner request from a project):
  - The steps table gains Procedure and Decision columns, shown when a step asks for owner work: 🧑‍🔧 for a procedure, 🤔 for a decision, each linked to the step's new optional `ownerLink`, an existing repository page or an https link, validated at build.
  - The summary's Procedures and Decisions cells use the same two faces. `check-backlog`, `backlog-queue` and `solution` still read 🧑, so ledgers on either release check.
  - A step may depend on a step of another record. The generated Depends on and Unlocks cells then name that step, and the waiting step's status reads `waits on <step>`.
  - `check:work` lists open owner steps without `ownerLink` and record-level `Depends on` rows that name no step.
  - Copy `tools/work-items.mjs`, `check-backlog.mjs`, `backlog-queue.mjs` and `solution.mjs`, reconcile the two BACKLOG-RULES paragraphs, add `ownerLink` to open owner steps, narrow record-level dependencies to steps where one step is enough, and rebuild. A project tool that reads the generated Procedures or Decisions cells (a recap, say) must accept 🧑‍🔧 and 🤔: its checks keep passing, but it would silently count nothing.

## 8.7.0, 2026-11-13

- **`merge-when-green` works with a merge queue** (F-070, owner request from a project): when the base branch has a GitHub merge queue, a green PR is queued without a merge strategy, reported as `queued`, and counted as merged only once GitHub merges it; a PR seen outside the queue on two polls in a row without merging (its merge-group checks failed, or someone removed it) stops the run with exit 4, and a PR already in the queue is watched, never queued again. Without a queue nothing changes. Branch deletion after a queued merge is the repository's "Automatically delete head branches" setting. Copy `tools/merge-when-green.mjs`; a project adopting a queue also adds `merge_group` to its CI triggers.

## 8.6.0, 2026-11-13

- **Concise `## Other changes` in `BACKLOG.md`**: `core/tools/check-backlog.mjs` now checks that `## Other changes` in `docs/BACKLOG.md` stays at most 2 paragraphs and 1000 characters; `core/docs/BACKLOG-RULES.md` ("When to update and review") requires moving older entries to `docs/archive/reconciliation-<year>.md` under `## Archived Other changes`. Copy `tools/check-backlog.mjs`, reconcile `docs/BACKLOG-RULES.md`, and move older `## Other changes` entries to `docs/archive/reconciliation-<year>.md`.

## 8.5.1, 2026-11-13

- **A relative template path is found from every worktree** (B-018, reported by a project's full audit): `check-harness` and `reconcile-preview` resolved a relative `template.path` from the current directory, so from a worktree at another depth than the main checkout (such as `.claude/worktrees/<name>`) the template was reported missing and the comparison skipped. A relative path now resolves from the main checkout (the parent of `git rev-parse --git-common-dir`); an absolute path, `~`, `HARNESS_HOME` and `--template` are unchanged. Copy `tools/check-harness.mjs` and `tools/reconcile-preview.mjs`.

## 8.5.0, 2026-11-13

- **Bounded timeouts, scope-step reconciliation, and initial agent-speed sizing** (F-069, owner request from NERV): `core/docs/agents/verification.md` asks projects to run local test suites and verification commands with explicit bounded timeouts (`--test-timeout=<ms>`) so unclosed handles fail fast; `core/docs/BACKLOG-RULES.md` requires reconciling record scope/remaining text and task steps whenever either changes (including when the last step closes) and recommends `0.25 h–0.5 h` initial baselines for scoped single-PR agent steps; `core/tools/work-items.mjs` (`checkWorkItems`) warns (`allStepsClosed`) when a non-closed record has all its steps closed. Copy `tools/work-items.mjs` and reconcile `docs/agents/verification.md` and `docs/BACKLOG-RULES.md`.

## 8.4.0, 2026-11-13

- **Fewer conflicts between parallel PRs** (F-066, owner request from a project): `core/gitattributes.txt` gives `docs/archive/*.md` a union merge, so parallel appends to the archives and the reconciliation log merge on their own; a layout segment `{"header": "docs/archive"}` generates the ledger header from the newest `## <date> — <branch> `<sha>`` entry of the reconciliation log, so no PR edits the layout to reconcile; a task file may record its step's `prs` and `review`, shown in a PRs column of the steps table and at the start of the record's PR / evidence cell, and a 💻 record whose sentence is `Next: from tasks.` gets its next action from its next open step, so a step PR edits only its task file. All optional (APPLY, "8.4.0"). Not taken: publishing the generated ledger from `main` instead of committing it.
## 8.3.0, 2026-11-13

- **A ready owner step shows in the human-action cells, and the column is Decisions** (F-068, owner request from a project): a record whose own cue is No listed nothing under the human actions although one of its steps was waiting on an owner decision. A task file may now say what an owner step asks, `effort.ownerKind`: `procedure`, `decision` or `both`; while that step is not started (planned or ready) and every prerequisite step is verified or closed, the generated summary shows 🧑 in the matching cell, beside the record's own cue. The line keeps 💻 and the record stays among the agent candidates of the work queue; `check-backlog` accepts a 💻 line under 🧑 cells in the generated ledger. The second cell is headed **Decisions**, like Procedures; `check-backlog` still reads a ledger headed Decision. Copy `tools/work-items.mjs`, `check-backlog.mjs`, `backlog-queue.mjs` and `solution.mjs`, reconcile the three BACKLOG-RULES sentences and the ledger legend, set `ownerKind` on the open owner steps and run `work-items build`. A project tool that reads the header by name accepts both spellings.

## 8.2.0, 2026-11-13

8.1.0 was not published: the change that held the number (F-066) is released as 8.4.0.

- **A blocker is listed above what it blocks** (F-067, owner request from a project): with `workItems.order: "queue"` the generated ledger listed a P1 record above the lower-priority record it depends on, so the list did not read in working order. An open prerequisite in the same group, with its own prerequisites first, now moves up to just above the first record that waits on it, whatever its priority or lane; every other record keeps the priority order. Source records and priorities do not change. BACKLOG-RULES ("Optional work queue") states the order, and now names priority before lane, as the tool has done since #140. Copy `tools/work-items.mjs`, reconcile that paragraph and run `work-items build` once.
- **Also in this release, merged since 8.0.0 without an entry** (#140–#146): record headings with an icon and a link to the top, priority before lane in queue order, closed prerequisites left out of the Depends on cell, one legend (#140); the generated ledger's details hold a link to the record and its metadata table, and `check-backlog` accepts them (#142–#144); AGENTS and BACKLOG-RULES guidance on a fast pre-push check, the reviewer's diff, reading record sources first, short `effort.basis`, documentation length and freshness, and no backlog IDs or planned lists in docs (#141, #145, #146). Copy `tools/work-items.mjs`, `check-backlog.mjs`, `backlog-dependencies.mjs`, `merge-backlog.mjs`, `solution.mjs` and `maintenance.mjs`, reconcile AGENTS and BACKLOG-RULES by hand, and rebuild the ledger.

## 8.0.0, 2026-11-12

Major: an active record's `Human action required: Yes` fails `check:backlog`, and the generated summary table changes shape.

- **The human-action cue names its kind** (F-065): `🧑 **→ Human action required: Procedure**` (someone runs, tries or checks something), `Decision` (a choice) or `Both`; `💻 … No` is unchanged. The generated summary table's Human action cell becomes two cells, **Procedures** and **Decision** (🧑 or —), read back by `backlog-queue` and `solution` (which still reads a component on a 7.x ledger and an archived `Yes`). Archived records keep `Yes`; `task-claims` still refuses a parent that says `Yes`. Copy `tools/work-items.mjs`, `check-backlog.mjs`, `backlog-queue.mjs`, `solution.mjs`, `task-claims.mjs`, `behaviour.mjs`; rewrite active 🧑 cues; rebuild the ledger (APPLY, "8.0.0").

## 7.1.1, 2026-11-12

- **Fix: a record whose steps are all closed fails the queue-ordered build** (B-017, from 7.0.0): such a record (for example Implemented, awaiting verification) showed `—` as its generated Effort, which `backlog-queue` refuses (`<ID>: unknown effort`). It now keeps its authored size; only its steps Total row shows —. Copy `tools/work-items.mjs` and rebuild.

## 7.1.0, 2026-11-12

- **A human action links its exact procedure** (F-064): BACKLOG-RULES ("Record and evidence requirements") now requires a human action that asks someone to run, try or check something to carry one link to a page whose own text holds the steps (copy-paste blocks naming the machine, the expected result after each; with nothing to run, what to look at); the Reproduce row links the same page; never "below", "in details", a path without a link or a page that sends the reader on; a decision links the document with its options; the line is updated when what it waits for has happened. Rule only, no new check.

## 7.0.0, 2026-11-12

Major: projects with source-owned records regenerate their ledger (`work-items build`) after copying the tools; `check-backlog` refuses the 6.x generated summary.

- **Effort from remaining agent hours, latest estimate, Status with its colour** (F-063). Steps table: `Effort | Step | Estimate | Actual | Remaining | Status`. Effort is the size of the remaining agent time, owner time apart: 🟢 Small up to 1 h, 🟡 Medium up to 4 h, 🔴 Large up to 8 h, 🟣 Very large more; a closed step shows —, a step still in days keeps its authored size. Estimate is the latest whole-step estimate: new optional `effort.estimateAgentHours`, set with `agentHours` at each re-estimation, else the baseline; `work-items check` warns when an open step's actual plus remaining agent hours exceed the estimate it shows. The baseline stays in the task file for calibration and is no longer shown: 6.2.0's `(planned …)` suffix is retired. Totals read `22.75 h agent + 6 h owner` and leave out a unit whose total is 0 (no more `and 0 days`). Generated summary: `Status | Priority | Effort | Remaining | …`, with Status carrying its colour (`🔴 Open`) and Effort read from the record's remaining agent hours when every open step is in hours. Record sources and archives keep the authored four columns. `check-backlog`, `backlog-queue` (Very large ranks after Large) and `solution` read the new form.

## 6.3.0, 2026-11-12

- **Every branch in its own worktree** (F-062): the "On its own" rule of AGENTS now reads "branch from `main` in a separate `git worktree`" for every task, single or parallel; the primary checkout stays on `main` with no edits of its own, because a running service, another session or the owner may rely on it. parallel-work no longer reads as "branch or worktree". Projects reconcile the AGENTS line and add a project line naming what relies on their primary checkout, if anything.

## 6.2.0, 2026-11-12

- **Re-estimates named in the steps table** (F-061): an open step whose remaining time differs from its baseline shows the baseline after it, `1 h (planned 1.5)` (days too: `0.5 days (planned 1)`), so a remaining time below the baseline with no actual reads as a re-estimate, not as work done. It is always the baseline, never the previous estimate: after several re-estimates the row still compares the latest with the plan, and the steps between stay in the dated basis and git history. Closed steps and unchanged estimates show no suffix. Projects with feature plans run `work-items build` once after copying the tool.

## 6.1.0, 2026-11-12

- **Calibration by kind** (F-060): `work-items calibrate` adds `byKind`, the actual/baseline ratios of bug (B-) and feature (F-) steps apart, computed the same way. When both kinds closed steps, `check:freshness` also asks for a re-estimation when one kind alone has at least `minSamples` steps with a median outside the band, so drift in one kind is not hidden by the other. No action needed beyond copying the tool.

## 6.0.0, 2026-11-12

Major: after copying the tools a project with source-owned records must regenerate its ledger, and with feature plans give every bug without steps a task file, before `check:work` passes again.

- **One priority-ordered list and a fuller summary table** (F-059): a `{"records": "all"}` layout segment lists bugs and features together, so with `workItems.order: "queue"` the whole ledger reads in priority order; separate `B` and `F` groups stay valid. In the generated ledger each record's summary table reads Signal, Priority, Status, Effort, Remaining (open task-step time, — without steps), Depends on and Unlocks (with the dependency tool; this replaces the 5.5.0 line under the table) and Human action (`🧑 Yes` / `💻 No`); the human-action line below keeps its icon and sentence (`🧑 **→** …`). Record sources, archives and hand-edited ledgers keep the authored form: `check-backlog`, `backlog-queue` and `solution` read both. With `workItems.featurePlans`, bugs need a task plan like features (at least `<ID>-T01`), so every record shows a steps table and a Remaining time; the build fails while one is missing. Projects with source-owned records run `work-items build` once after copying the tools.

## 5.6.0, 2026-11-11

- **Agent hours** (F-058): task effort gains `agentHours` (remaining agent time), `ownerHours` (owner's time, kept apart), `baselineAgentHours` and `actualAgentHours`, in quarter hours. The steps table, feature totals and backlog total show hours ("1.5 h + 0.5 h owner") and never add hours and days; calibration compares actual with baseline in the same unit and reports units apart (`byUnit`). An actual in days is refused on a step in hours. When an actual is not known, the rules ask for `No actual: <reason>` instead of a figure. BACKLOG-RULES: estimate in the time the work actually takes and always record an actual when a step closes (stated: the agent's working time from start to merge). Day fields remain valid for steps not yet re-estimated.

## 5.5.0, 2026-11-11

- **Dependencies in each record; queue and dependency pages retired** (F-057): `work-items build` shows `**Depends on:** … · **Unlocks:** …` under each active record's summary table when it has prerequisites or dependents, with links that resolve from the ledger. `backlog-queue.mjs` and `backlog-dependencies.mjs` now only validate (same checks) and write nothing; a leftover `docs/agents/backlog-queue.md` or `backlog-dependencies.md`, or a link to one from `docs/BACKLOG.md`, fails their check until removed. With the dependency tool present, `work-items build` and `check` also fail on an invalid graph or a record with links but no summary table. The line needs source-owned records: a hand-edited ledger keeps its Depends on rows but no longer shows Unlocks. The ledger's queue order (5.3.0) and the record line replace the two pages. The `backlog:queue` and `backlog:dependencies` scripts are removed; CI steps run on the tools' presence.

## 5.4.0, 2026-11-11

- **Actual effort column** (F-056; review fix before the tag: the total row names how many steps recorded an actual, so an unrecorded 0 never reads as measured): the steps table reads Step, Baseline, Actual, Remaining, Status. Actual shows the effort recorded on a step (`effort.actualDays` with its source), marked "so far" while the step is open, and 0 days until one is recorded; started steps may now record it, planned ones may not. The total row and the backlog total add the recorded actual effort; a backlog with no open steps says so. Calibration still uses closed steps only. Projects with feature plans run `work-items build` once after copying the tool.

## 5.3.0, 2026-11-11

- **Effort totals** (F-053): task effort gains optional numeric `days` (remaining) and `baselineDays` (the accepted estimate, kept when the step closes), in quarter days. Each feature's steps table ends with a total row (remaining, baseline, steps without numbers counted as unknown, never 0), and a layout holding `<!-- totals:start -->`/`<!-- totals:end -->` gets the backlog's total remaining days. `work-items check` lists open steps without `days`. A stale total fails the check.
- **Estimate calibration** (F-054): closed steps record `actualDays` with `actualSource` (`measured` or `stated`); `work-items calibrate` reports actual/baseline ratios by size and source, read-only; `check:freshness` asks for a re-estimation of the open steps when the median ratio of at least 5 steps closed since `workItems.estimation.since` is outside 0.67–1.5, or one step is 3x off. Thresholds are settings. Measured actuals count active effort only, never wall-clock time with waits; cancelled steps record none.
- Projects with feature plans run `work-items build` once after copying the tools: the steps tables change.
- **Queue order and compact steps table** (F-055): `workItems.order: "queue"` lists records inside each group in work-queue order (from `backlog-queue.mjs`, loaded only then; Node 22.12 or newer). The steps table shows step, remaining, baseline and status; each estimate's dated basis moves into the record details. The table is now inserted at the record's own details block, not at the first literal `<details>` in its text.

## 5.2.0, 2026-11-11

- **Evaluation dependencies** (BACKLOG-RULES, "Evaluation dependencies"; F-052): a project declares in `.harness.json` `evaluations` a project-owned command that lists cases of a pinned evaluation dependency with no covering run; `check:freshness` reports them at session start (a failing or slow command is reported, never fatal), and an open backlog record names them until a run covers it. Real-model runs stay owner-approved. Tool-agnostic: the template names no evaluation tool. Optional; projects without the setting are unaffected.

## 5.1.1, 2026-11-11

- `core/gitignore.txt` ignores `node_modules` without the trailing slash. A pattern ending in `/` matches only a directory, so a git worktree whose `node_modules` is a symlink to the main checkout's left it untracked and `git add -A` committed it (seen in a project PR). Projects change the line in their `.gitignore`.

## 5.1.0, 2026-11-11

- **Independent review scope** (BACKLOG-RULES, "Independent review"): a reconcile whose harness-file changes are only byte-identical copies from a published tag, their `copied` entries and the `version` stamp needs no fresh-context reviewer when `node tools/check-harness.mjs --strict` passes (new flag: exits 1 if a copied file differs or the template is missing); adapted, forked or project-written changes in the same PR still do. Reviews are matched to the change: mechanical checks may run on a smaller, cheaper model with an explicit checklist; design, safety rules, security, migrations and lifecycle code keep the strongest model. Owner decision 2026-11-11 to reduce token cost without dropping any check.
- New copied files `.claude/agents/mechanical-reviewer.md` (pinned to Haiku) and `.claude/agents/design-reviewer.md` (pinned to Opus): in Claude Code the reviewer's model is set by the definition, not inherited from the session; they are instructed to report and never edit or merge (their tool list does not enforce that). Other clients (Codex, Gemini, Qwen, Copilot) cannot be pinned by the harness; they follow the rule through their own configuration, and the work-usage ledger records the model each job actually used.

## 5.0.2, 2026-11-11

- The Angular ESLint default (`angular/eslint.config.mjs`) also ignores `.harness/`; 5.0.1 fixed only the core default, so the same CI-only failure could recur in Angular projects.
- APPLY scopes the copied-tools advice per tool: ESLint ignores copied tools by path; Prettier keeps `tools/` ignored and un-ignores the project's own tools one by one.

## 5.0.1, 2026-11-11

- The default ESLint and Prettier ignores exclude `.harness/`, where CI checks the template out: without it `npm run lint` passed locally and failed in CI in the first project reconciled to 5.0.0.
- APPLY: ignore copied tools by path so project-owned tools stay linted, and look for values derived from source text (hashes, plan identities) before a reformat. No tool behaviour changes.

## 5.0.0, 2026-11-11

Major: a project without a formatter check and a linter run in CI stops passing. See APPLY.md, "5.0.0: formatter, linter and reconciliation cadence".

- **Formatter and linter for every stack.** New copied tool `tools/check-tooling.mjs` (`npm run check:tooling`) fails unless `format:check` and `lint` npm scripts exist and a CI workflow runs both; other script names go in `tooling` in `.harness.json`, and a repository with no source code records `tooling.exempt` with its reason. `core/eslint.config.mjs`, `core/.prettierrc.json` and `core/prettierignore.txt` are the defaults; APPLY describes the one-PR mechanical reformat and how to verify it. Before this release only the Angular stack mentioned lint and format, and nothing checked either.
- **The template formats and lints itself** with that configuration. Every copied tool was reformatted, so every copied tool changes at reconcile; behaviour is unchanged.
- **Reconciliation is folded into working PRs.** `check:freshness` prints "the backlog is behind" as a note until it is 10 merged PRs or one day behind, then as a warning (`freshness.backlogPRs`, `freshness.backlogDays`). The session-start rule and BACKLOG-RULES say the same: reconcile inside the next working PR; a reconciliation-only PR is for when it is due or no working PR follows. Evidence requirements for each status are unchanged.

## 4.8.0, 2026-11-11

- Optional read-only Codex CLI allowance collection and privacy-filtered Claude status-line capture retain account window percentages/reset provenance without prompts, credentials, transcripts or model calls.
- Reports show conservative same-window changes and comparable completed-work sample sizes while keeping shared subscription quota distinct from tokens, API rates and currency. No automatic estimate rewrite or quota-to-cost conversion.
- `report --out=PATH` saves the same JSON to a new private file outside checkouts; symlinks and overwrite are refused.

## 4.7.0, 2026-11-10

- Optional immutable development-effectiveness observations: dated estimates/revisions, measured intervals, attempts, classified findings, explicit interventions/rework and supplied price provenance.
- Feature/step reports union overlapping elapsed intervals, label measured worker effort separately, retain unknown/partial sources, compare eligible pre-work estimates and keep currencies and rate estimates distinct from bills. No inferred tokens, automatic ranking, transcript collection or model invocation.

## 4.6.0, 2026-11-10

- Optional metadata-only Codex turn and Claude assistant-message imports, native cache normalization and stable replay identities. Refuse transcripts, partial Claude exports and cumulative result/thread totals; unsupported clients retain unknown coverage.
- Optional explicit launcher registers a step job before a caller-selected executable and hands off job/store identity. Open same-repository parent jobs are supported; no exporter, hook, permission escalation or implicit model call is installed.

## 4.5.0, 2026-11-10

- Optional upfront feature plans with visible stable steps, dated remaining effort and status. Material scope/effort expansions or outcome splits require owner agreement; routine refinement and parent acceptance retain existing rules.
- Optional task effort schema and derived ledger tables, enabled with `workItems.featurePlans`; existing non-adopters and published archives require no migration.
- Development usage reports add step filtering and repository-qualified task totals, preserving feature-only/unallocated jobs, unique source events and unknown coverage. No native exporter or automatic operational-log collection.

## 4.4.1, 2026-11-09

- Reject private usage stores inside filesystem checkout ancestors even when Git is unavailable or discovery fails. Worktree marker files are detected without a Git subprocess; committed regression precedes the fix.

## 4.4.0, 2026-11-09

- Optional private development job usage ledger and shared startup/phase/completion rule. Validated metadata deltas, source-event deduplication, unknown coverage and activity/model reports; no native client adapter, transcript scraping, cost estimate or model call.
- Optional Gemini, Qwen and Copilot instruction bridges retain AGENTS as authority; actual client loading/telemetry remains separately verified.

## 4.3.0, 2026-11-09

- Optional task-boundary context workflow: persist a concise handoff, prefer an available authorized fresh thread for an independent task, keep ongoing debugging/review/CI together and compact continuing tasks only through supported host tools.
- Explicit fallback for hosts without thread/compaction control, with preserved work, claims, approvals, uncertainty, privacy and permission limits. Provider prompt caching remains separate and savings require actual usage evidence. No host adapter, model run or automatic context reset is installed.

## 4.2.1, 2026-11-08

- Handle clean Git checkouts after every active source record is archived: Git omits empty directories, and rendering now treats the missing records directory as an empty collection. Source/view equality still detects a missing active record.

## 4.2.0, 2026-11-08

- Optional per-record backlog sources and explicit child tasks with acceptance, dependencies, resource scopes, privacy, validation and escalation. Generated legacy status views preserve existing validators/links; non-adopters require no migration.
- Cooperative cross-machine ownership through normal atomic Git fast-forward pushes: fences/lease IDs, bounded leases, stale-owner refusal, uncertainty reconciliation and no expiry-only takeover. Existing archive/push safeguards remain intact; claims are neither permissions nor a zero-conflict guarantee.
- Evidence-based candidate/qualified model profiles and capability checks without invoking models or silently selecting cloud fallback. Project adapters own actual delegation.
- Linked procedure discovery and revision-scoped architectural reassessment, including changed assumptions, rejected alternatives, migration costs and reconsideration triggers. Existing authority, independent review and audit scope requirements remain.

## 4.1.0, 2026-11-08

- Optional scoped verification planner: affected groups by diff, explicit/risk/unknown full checks, seven-day or ten-merged-PR freshness defaults, and successful full-marker provenance. Partial, failed or unmerged runs never reset freshness.
- Shared selection guidance keeps fast checks, changed-join regressions, acceptance and safeguards; repeated stress and real-model evaluations have separate triggers/budgets. Existing projects retain their checks unless they opt in.
- Describe single PR CI, manual/weekly triggers and a full-run marker. Settings and platform adapters belong to projects; release acceptance uses only owned fixtures.

## 4.0.0, 2026-11-07

- Active backlog summaries keep Signal, Priority, Status and remaining Effort. Remove completion percentages; status and verification evidence describe progress. Optional hours/days ranges retain assumptions and uncertainty in details; model tokens/cost are separate usage/budget facts. Published archives are unchanged.
- Optional read-only work queue: an authored Queue order with a reason can deliberately prioritize records; impact priority, roadmap context, direct dependents and remaining effort provide transparent tie-breaks. Human actions, explicit blockers and open/unverified prerequisites remain visible; no weighted score, authorization or acceptance is inferred.
- Update backlog validation, solution readers and behavior fixtures together. Solution dashboards accept historical formats without displaying or combining their completion percentages. Projects must migrate active records before the updated validator; APPLY gives reconciliation steps. The queue remains optional.

## 3.5.0, 2026-11-07

- Optional linked backlog prerequisites: maintain one Depends on field with the required outcome; `backlog-dependencies.mjs` generates a separate page with forward links and reverse Unlocks. Local missing/broken references, duplicate dependencies, self-links, cycles and stale pages fail the explicit check. Archived records stay immutable and active reopened records take precedence.
- Qualified cross-repository references stay explicitly unverified by the local checker. Ownership and upstream dependency direction remain unchanged; no status or acceptance is inferred from links.
- Projects: optionally adopt the tool, scripts, generated page, impact row and CI check as APPLY describes. Existing records require no migration.

## 3.4.0, 2026-11-07

- Review third-party skills against a short checklist mapped to the OWASP Agentic Skills Top 10 (AST10), with the draft status and required review record made explicit.
- Review shipped CI workflows against the OWASP CI/CD risks: least-privilege token permissions, commit-pinned actions with release comments, locked npm installs and CycloneDX SBOM artifacts. `check:template` enforces the workflow contract; APPLY documents manual action-pin updates. No branch-protection or GitHub repository setting is inferred.
- Audit findings may include an optional OpenCRE CRE or version-pinned standard reference, explicitly as context rather than a compliance claim. The optional OpenCRE MCP entry is pinned to a reviewed source revision and restricted to public reads by default; authenticated tools remain disabled.
- Projects: reconcile the skill/audit/MCP guides and applicable CI workflow. No consumer adoption or OpenCRE connection is required.

## 3.3.0, 2026-11-07

- New optional tool `browser-coverage.mjs`: a Playwright collector (Chromium only, and it says so elsewhere) saves V8 coverage with source maps; the tool maps it to the source files under `coverage.folders` (`coverage.browser`) and, with the unit LCOV, writes a combined summary where a line ran by either counts once (`coverage.combined`). Unmatched sources and unmapped scripts are listed, never guessed. `coverage-table.mjs` prints, writes and checks a browser and a combined table with their own baseline keys when configured (under enforce, the adopting PR starts the baseline, and removing a setting with baseline rows is reported); unconfigured projects see no change. Projects: optional; see APPLY and the coverage guide.
- New optional tool `behaviour.mjs`: ten agent-behaviour scenarios, each a fixture repository built from the project's own rule files, a task and a deterministic grader (files, records, commits, the remote, the transcript). `run` uses the agent runner the project sets in `behaviour.runner` (the template depends on none), runs each scenario several times and reports per scenario. On demand and when the rules change, not in PR CI. Projects: optional; see APPLY ("Reconciling", 3.3.0) and the maintenance guide.
- AGENTS keeps the never and ask-first rules in a marked safety block that loads in every session, and a "Procedures: read before the task" table; procedure text moved out unchanged in substance: code coverage to the new `docs/agents/coverage-guide.md`, the impact map to the new `docs/agents/change-impact.md`, and the capability, MCP, solution, skills, maintenance and audit paragraphs to an "In short" section of their guides. New copied tool `check-rules.mjs` (`check:rules`, CI) fails when the safety block is missing, when a procedure document holds an ask-first or never rule of its own, or when an AGENTS link leads nowhere; it warns past `rules.maxLines`. Projects: reconcile AGENTS as APPLY ("Reconciling", 3.3.0) says, keeping every project line.
- New optional tool `guard.mjs`: as an opt-in git `pre-push` hook it refuses a push to the default branch, a force-push, a published tag moved or deleted, and a push whose archives drop or change a line already on the default branch, citing the AGENTS or BACKLOG-RULES rule; an optional Claude Code `PreToolUse` adapter (exit code 2) refuses the same before the command runs. An owner-approved exception runs with `HARNESS_GUARD_ALLOW=<rule>`. `check-harness` reports an adopted guard not installed in the clone. Projects: copy it, add `guard:install`, install it; see APPLY, "Push guard".
- A bug fix starts with a committed test that fails without the fix, and the fix does not edit it (BACKLOG-RULES, AGENTS). A record names it (`Test: …`) or says why none can show the defect (`No test: …`). Projects: carry the rule into their adapted BACKLOG-RULES and AGENTS; `check:backlog` warns, never fails, on a B- record a branch makes Verified or Closed without either; records already done on the default branch are not flagged.
- A PR that closes a P1 record or changes a harness file gets an independent review in a fresh context (a review skill or a separate session); the reviewer reports, never approves or merges. The record cites it (`Review: …`) or says why it needs none (`No review: …`); `check:backlog` warns on a P1 record made done without either, and `check:freshness` reminds a branch that changes harness files. Projects: carry the rule into their adapted files (APPLY, "Reconciling").

## 3.2.1, 2026-11-06

- The harness is published under the MIT licence (`LICENSE`, `package.json` and a README section). It also covers earlier releases' content as distributed from this repository. No project action needed.

## 3.2.0, 2026-11-06

- Optional weekly archive closure recap: counts from closing dates, Monday–Sunday, with stable section links. Exact derived-block validation permits refreshing an index while preserving every historical record line. No migration for archives without recaps.

- New optional tool `lcov-summary.mjs`: Node test runner projects (LCOV only) get the coverage summary `coverage-table.mjs` reads, with untested source files listed at zero. APPLY has the scripts and CI steps. From NERV Agency (F-055), where it is in use.

## 3.1.1, 2026-10-31

- Full eight-area audit records confirmed defects, regression evidence, documentation corrections, CI reconciliation and explicit runtime/publication limits.
- Preflight all check-harness project mappings before merging: reject traversal, Git metadata and symlink escapes without changing files. Ordinary reports remain warning-only.
- Coverage enforcement retains main-baseline folders even if the PR removes their display rows, preventing hidden per-folder regressions.
- Correct freshness/coverage workflow labels and outdated optional timing/newest-audit summaries; examples use an actual published tag. Remove an unused import. No consumer schema migration.
- This repository enables audit-age enforcement after its full-area review. Consumers retain their independently configured audit policy. Cumulative target remains unpublished until its tag exists.

## 3.1.0, 2026-10-31

- Shared periodic audit procedure covers code/dead/incomplete work, logic/joins, tests, docs/media, harness, security/privacy, delivery/dependencies and backlog ownership.
- Dated human-readable reports plus explicit full/scoped manifests record baseline, area results/evidence/limits, hypotheses, defects and value-based improvement proposals. Actionable findings link owning work; speculative observations are not confirmed bugs.
- Scope-aware freshness tracks each area and the last complete full report. Scoped or blocked reviews never refresh unrelated areas; historical narrative-only audits stay unclassified instead of being silently promoted.
- Freshness and daily CI call the new checker. Invalid manifests fail; missing/stale areas warn by default, with optional audit.enforce after a valid baseline is established. This is distinct from the required maintenance-receipt gate.
- Projects copy the helper/guide, update audit index/AGENTS and use new manifests for future reports; published historical reports are not rewritten. Cumulative prepared release includes the untagged 3.0 work.

## 3.0.0, 2026-10-31

Breaking maintenance enforcement for adopting projects; cumulative release includes the prepared 2.3.0 work (not separately tagged).

- Timed start/finish captures actual workflow wall-clock duration locally; unknown counters remain unknown. No hidden prompt/source collection.
- Required maintenance receipt binds reviewed outcomes to configured input hashes and review age; check fails on stale/missing evidence, policy/input changes or broken outcome references. Startup, PR CI and a daily read-only workflow run it.
- Recurring observed friction emits rule/tool/skill candidates. Agents implement and test justified improvements or link owned backlog work/no-change evidence; CI never rewrites its own governing rules.
- Opt-in coverage enforcement compares against origin/main's baseline, failing on configured regressions or missing comparable data. Default reporting remains warnings; no mandatory percentage increase, no claim that coverage equals code quality.
- Projects: copy helpers/workflow/guide, configure relevant inputs, time reconciliation, generate a reviewed receipt and add startup/CI checks. All applicable rules remain mandatory from the start. No service/skill installation or consumer adoption gates the master release.

## 2.3.0, 2026-10-31

- Optional read-only reconciliation preview reports proposed copy changes, adapted/local/conflict review, marked project rules, missing ancestry and required checks before editing.
- Optional local friction measurements record observed adoption/reconciliation duration and explicit counters; missing data remains unknown, no automatic telemetry or CI gate.
- Audit-triggered rule consolidation preserves requirements, authoritative ownership and exceptions; no rule expires from age/rare use and all applicable rules remain mandatory from the start.
- Projects may copy the two helpers and maintenance guide, merge their optional scripts/ignore entry and reconcile guidance. No backlog migration, new installation or reduced-rules starting tier.

## 2.2.2, 2026-10-31

- Give capability assessment, MCP recommendations, solution profiles and shared skills separate README sections; split the matching agent/application/area guidance by responsibility.
- Clarify headings without changing adoption or acceptance requirements. Projects may carry the wording into adapted instructions during reconciliation; no record migration or runtime change.

## 2.2.1, 2026-10-31

Full audit restarted against merged 2.2.0. Compatible fixes; no record-schema migration.

- Isolate component MCP metadata checks from optional coordinator context; keep valid own snippets and explicit research usable while foreign/local metadata needs repair. Reject unknown/duplicate CLI flags.
- Protect nested component checkouts, archives and symlink targets from dashboard writes; reject mixed unsupported summaries and read initially clean local sources at their reported commit.
- Bind merge requests to the inspected head; make Angular default checks follow the installed workspace version instead of applying v22 defaults to older projects.
- Reconcile README/APPLY/area guidance on template-first changes, existing authorization and versioning; expand impact/external dependencies and publish a full audit with remaining limits.
- Projects: copy adopted helpers and reconcile the changed guidance/Angular checker. Correct misspelled or duplicated options; unsupported source layouts now fail visibly. No consumer trial or skill installation is a release gate.

## 2.2.0, 2026-10-31

- Optional shared `apply-harness` skill delegates to authoritative procedures without personal checkout paths or derived-project dependencies.
- Optional skill guidance covers client discovery, duplicate installations, source/revision review, deliberate installation scope and offline limits. Popularity is not a quality verdict; skill recommendations never imply MCP installation or execution permissions.
- No consumer record migration or personal skill installation is required. Copy the skills guide/stamp entry and reconcile session guidance when adopting this addition.

## 2.1.0, 2026-10-31

Optional MCP recommendations and a multi-repository solution profile. Existing single-repository backlogs and validators need no schema migration.

- MCP catalogue and helper: stack candidates, reviewed project/solution selections, explicit current registry name search, metadata checks and client-specific configuration snippets for Claude Code, Cline, Gemini CLI, VS Code and Codex. No silent installation, client overwrite, credential storage or assumed connectivity. Guided setup/repair uses existing authorization and task-specific verification.
- Solution profile: a separate coordinator repository with its own backlog, manifest, shared contracts and integration acceptance; repository-qualified component links and a generated Markdown dashboard. Sources remain independently owned; snapshots identify revisions, dirty checkouts and unavailable inputs, support linked archived records and never average progress. Optional GitHub reads pin each source to one resolved commit.
- Self-contained fixtures test normal, offline, missing-source, archive, configuration and write-boundary behaviour without any real consumer repository or installed desktop application.
- Projects: copy the new helpers/catalogue/guides, merge optional integration scripts/CI and session guidance; select recommendations only for real needs. For an actual multi-repository solution, apply the `solution/` fragment to its coordinator and fill its manifest/contract guidance. Do not create or repair an example solution as part of this template release. Record adoption in each owning repository. No consumer adoption gates this release.

## 2.0.1, 2026-10-31

Clarify and apply the existing one-repository, one-backlog rule; no schema or validator change.

- Reject actions or closure criteria owned by another repository, including downstream reconciliation hidden in details. F-021’s next action now ends with this repository’s own release.
- AGENTS and BACKLOG-RULES explicitly apply single responsibility and dependency inversion: reusable masters define contracts and do not depend on derived implementation, deployment or adoption for acceptance or release.
- Required template verification uses self-contained fixtures and contract checks. Completed consumer trials remain evidence, with consumer adoption tracked only in its own backlog. APPLY’s former required-consumer-trial step is corrected.
- Reconcile the clarified rules; no active-record migration is required.

## 2.0.0, 2026-10-31

Breaking active-backlog layout, requested from OpenBando.

- Every active bug and feature has a visible Issue / Reproduce / Check table, including agent-owned and untouched records.
- Titles move above the signal table beside the stable ID heading. Signal columns are Signal, Priority, Status, Effort and Complete. Human action and recap remain visible; next action, estimate rationale and PR/date/verification metadata share one closed details block.
- Remaining effort is a coloured word (Small, Medium, Large); completion is a coarse ~N% estimate with rationale, never verification. Pending acceptance cannot be 100%. Recalculate effort and completion on direct updates and collateral changes, reviewing affected related records in the same change.
- Projects must migrate every active record, preserve full history and dates, copy check-backlog, reconcile BACKLOG-RULES and the ledger legend, then advance their stamp to 2.0.0. Archives are unchanged.

## 1.20.1, 2026-10-31

Wording, from openbando (the owner found the rule only in a stray paragraph of its backlog).

- BACKLOG-RULES, the ID rule: never reuse an ID for a different item; a new finding about the same behaviour (a failed check, a follow-up, a regression) goes into that record, reopened if it was closed, not under a new ID.
- Projects: reconcile that sentence; move `version` to 1.20.1.

## 1.20.0, 2026-10-30

From openbando (decided with the owner): records closed on 29 and 30 October were appended to the 28 October archive, so its name no longer said what it held and one file per day would multiply.

- **Rule** (BACKLOG-RULES, closure and archives; archive README): closed records go into the year's archive, `docs/archive/backlog-<year>.md`, in closing-date order under a `## Closed <YYYY-MM-DD>` heading per day; records closed before a project adopts this layout keep a heading of their own. A record may move from one archive file to another, never out of the archives.
- **`check-backlog`**: every line the archives have on the default branch must still be in one of them (counted across all archive files, so a move passes and a loss fails; blank lines, file titles and `##` headings may change with a move; the folder README is exempt). A record in `backlog-<year>.md` whose last "closed <date>" is another year fails.
- Projects: copy `tools/check-backlog.mjs`; reconcile the BACKLOG-RULES archive paragraph and `docs/archive/README.md`; move the dated archives into `backlog-<year>.md` (each record under its closing day, nothing dropped: `check:backlog` compares with the default branch) and update links to them; move `version` to 1.20.0.

## 1.19.1, 2026-10-30

Two bugs the new tools showed on their first day.

- `merge-backlog`: a record the branch archived (removed) came back from the default branch's file. Now it stays gone, unless the default branch changed it meanwhile (then it is named for a merge by hand).
- `merge-when-green`: right after a push GitHub can still report the previous run's failed check; the watcher stopped on it. A failure now counts when seen twice on the same head commit.
- Projects: copy `tools/merge-backlog.mjs` and `tools/merge-when-green.mjs`; move `version` to 1.19.1.

## 1.19.0, 2026-10-30

From openbando (decided with the owner): a "this PR" placeholder that reached the default branch failed `check:backlog` on every other PR, twice in one day.

- **`check-backlog`**: on a PR's CI run (`GITHUB_REF` is `refs/pull/N/…`, or `PR_NUMBER` is set) a "this PR" the branch adds fails and names the number to write; locally, before the PR exists, it still passes. Lines already on the default branch fail as before.
- **Rule** (BACKLOG-RULES step 7; core AGENTS, "What the agent does on its own"): right after opening a PR, replace "this PR" in its records with `#N` and push, before the checks finish.
- **`merge-when-green`**: a failed `gh` call (GitHub timing out) waits for the next round instead of crashing; ten failures in a row give up with exit 1. `--every 0` is honoured.
- Projects: copy `tools/check-backlog.mjs` and `tools/merge-when-green.mjs`; reconcile BACKLOG-RULES step 7 and the AGENTS bullet; move `version` to 1.19.0.

## 1.18.0, 2026-10-30

Requested by the owner: records waiting for a person were hard to act on without reading them whole.

- **BACKLOG-RULES and the backlog legend**: a 🧑 record follows its human-action line with a recap table, `| **Issue** | … |`, `| **Reproduce** | … |`, `| **Check** | … |` (under a `| | |` / `|---|---|` header): what is wrong or asked, where and how to get to it, what to look at (or the options to decide between).
- **`check-backlog`**: requires the recap on 🧑 records a branch adds or changes; records already on the default branch and untouched still pass, so projects keep passing and convert them as they touch them.
- Projects: copy `tools/check-backlog.mjs`; reconcile BACKLOG-RULES (the human-action bullet, the check list) and the legend line; give the 🧑 records the recap when convenient (all at once is easiest for the person who acts on them); move `version` to 1.18.0.

## 1.17.1, 2026-10-30

- `check-backlog`: a quoted mention of the placeholder ("this PR" in quotes or backticks) no longer counts as one. Found on openbando: its 1.17.0 reconcile note quoted the phrase, passed on its own PR (the line was new) and then failed every later PR.
- Projects: copy `tools/check-backlog.mjs`; move `version` to 1.17.1.

## 1.17.0, 2026-10-30

From a review of the template against openbando (requested by the owner): five places where the rules disagreed or the process relied on tools outside the harness.

- **Lifecycle** (BACKLOG-RULES, the backlog's legend): a record closes only from Verified, or cancelled or superseded with its reason. When every acceptance check is automated, the merged PR's green CI run is the evidence, cited; one reconcile may verify and close.
- **What the agent does on its own** (core AGENTS, a new paragraph under "Checks before you finish"; this repository's AGENTS too): on its own, branch, commit, push, open PRs, resolve its own conflicts, merge its own PR once every check has passed, delete merged branches, reconcile records. It asks first for 🧑 decisions, repository settings and code-scanning dismissals, history rewrites, deleting what it did not create, and unplaceable harness changes. It never merges past a failing or pending check. APPLY's "do not commit or push" now covers only the first application.
- **`check-backlog`**: fails on a line already on the default branch that still says "this PR" (a merged PR's placeholder; its record's closure is then easily missed).
- **New copied tool `tools/merge-backlog.mjs`**: resolves a `docs/BACKLOG.md` conflict record by record, three ways; a record both sides changed is named for a merge by hand. Keeping one side's records wholesale had dropped edits in openbando.
- **New copied tool `tools/merge-when-green.mjs`**: merges the listed PRs once every check on each has passed and GitHub can merge it; stops on any failing check (required or not) or a conflict.
- **Coverage** (core AGENTS): the committed page and baseline change only on purpose (code removed, tests added for it) or in audits, never as a side effect; CI prints the live table.
- Projects: copy `tools/check-backlog.mjs`, `tools/merge-backlog.mjs` and `tools/merge-when-green.mjs` (add the two new ones to `copied`); reconcile AGENTS (the new paragraph, the backlog-conflict sentence, the coverage sentence) and BACKLOG-RULES (steps 4 and 7) and the backlog legend; replace every "this PR" already on the default branch with its PR; move `version` to 1.17.0.

## 1.16.0, 2026-10-30

From openbando (decided with the owner: template and project): a code coverage table, never a gate.

- **New copied tool `tools/coverage-table.mjs`**: reads the standard coverage summary (`coverage-summary.json`, the "json-summary" reporter of Istanbul / V8), writes `docs/agents/coverage.md` per folder (lines, statements, branches, functions) with the files no test runs, and a baseline; `--check` prints the current table (the CI job summary) and warns when a folder drops more than `coverage.drop` points. Never fails.
- **Angular stack**: the `coverage` npm script and the CI test step run `ng test` with coverage over every source file (a file no test runs counts as 0 %, instead of being left out: tried on openbando, 58 such files that a default run hides), then `coverage-table --check`. Needs the dev dependency `@vitest/coverage-v8` at the installed Vitest version.
- core AGENTS ("Code coverage"), APPLY, README.
- Projects: copy `tools/coverage-table.mjs` (add it to `copied`); add `coverage` to `.harness.json` (`summary`, `folders`, `drop`); Angular: install `@vitest/coverage-v8`, add the `coverage` script and the CI steps; run `npm run coverage` and commit the page and baseline; list the page in `pages`; move `version` to 1.16.0.

## 1.15.1, 2026-10-30

- `impact-map.mjs` escapes backslashes in table cells before pipes (CodeQL `js/incomplete-sanitization`, found on an openbando PR: a cell ending in `\` could join the next column).
- Projects: copy `tools/impact-map.mjs`; move `version` to 1.15.1.

## 1.15.0, 2026-10-30

- **Links to the project's own maps.** `pages` in `.harness.json` (`{ title, path, about? }`) are linked at the top of the impact map page ("More detail"), relative to the page. A project's detailed maps (openbando's element map: every control, its tip, the clips that show it) and the impact map now point at each other.
- Projects: copy `tools/impact-map.mjs`; list your detailed pages in `pages`; rerun `node tools/impact-map.mjs`; move `version` to 1.15.0.

## 1.14.0, 2026-10-29

From openbando: the owner asked for a readable list of content dependencies and value couplings, and of what outside the repository matters to people.

- **`inputs` on impact rows**: the content an output is made of (an example it records, a demo file it loads). They set the row off like `when`.
- **`couplings`** in `.harness.json`: `{ value, places: [{ file, what }], kept }`. `check-freshness` warns when a branch changes one place and names the others.
- **`outside`** in `.harness.json`: `{ what, affects, noticed }`, what can change an output with no commit here.
- **The map page** (`tools/impact-map.mjs`) gains three sections: Content dependencies, Value couplings, Outside the repository. The rows table gains a "Made of" column.
- core AGENTS ("What follows a change") and APPLY name the new fields.
- Projects: copy `tools/impact-map.mjs` and `tools/check-freshness.mjs`; move content paths from `when` to `inputs` where they are data; list `couplings` and `outside`; rerun `node tools/impact-map.mjs`; reconcile AGENTS; move `version` to 1.14.0.

## 1.13.0, 2026-10-29

From openbando, the owner's examples: a mascot animation synced with three films, a film that records an example bando, a theme colour that changes everything visual. Dependencies a path trigger alone does not see.

- **Rows watch what an output is made of** (core AGENTS, "What follows a change"): the data a recording or generated page loads belongs in its `when`; a setting with a wide reach (theme colour, font, scale) has its own row chained to every output it shows in, art included.
- **Couplings**: a value used in two places has one source both read; if it cannot, a test asserts the relation and the map has a row from each place to the other.
- **Audits look outside the repository** too: dependency upgrades, the CI browser and machine, external services and data the outputs rely on.
- Projects: reconcile AGENTS ("What follows a change", the audit bullet); add rows for the data each output loads and for wide-reach settings; list value couplings and give each one source or a relation test; move `version` to 1.13.0. No copied file changed.

## 1.12.0, 2026-10-29

From openbando again, the owner's words: "changes this impact that, requires re-executing this and that"; and a promised full table that was never written down.

- **Chains in the impact map.** A row has an `id` and may list `after` ids: when a row it names must run again, so must this one (a catalogue rebuilt → the examples that use it). `check-freshness` lists the rows a branch sets off, chains included, in the order to run them ("Impact 1/3 (catalogue): …", "Impact 2/3 (examples): … after catalogue").
- **The map as a page.** New copied tool `tools/impact-map.mjs`: `plan()` (used by `check-freshness`) and, run directly, `docs/agents/impact-map.md`, the rows as a table with their chains; the Angular CI step "Impact map page matches the rows" keeps it equal to the rows (here too).
- **Complete, fine-grained rows** (core AGENTS, "What follows a change"; APPLY): every derived thing has a row (generated pages and data, recordings, translations, guides, feature docs), as fine as the code names it; a derived thing found without a row gets one in the same PR.
- **Plans become records** (core AGENTS, Work tracking; BACKLOG-RULES, When to update): a plan or promise given to the user becomes backlog records in the same change, and the reply names them. Nothing promised lives only in the conversation.
- Projects: copy `tools/check-freshness.mjs` and the new `tools/impact-map.mjs` (add it to `copied`); give each impact row an `id` and its `after` chains; run `node tools/impact-map.mjs` and add the CI step and the `impact-map` npm script (Angular: from `angular/`); reconcile AGENTS ("What follows a change", the Work tracking bullet) and BACKLOG-RULES; move `version` to 1.12.0.

## 1.11.0, 2026-10-29

- **Impact map.** `impact` in `.harness.json` lists what must follow a change: `{ "when": [file globs], "then": "what must follow", "run": "command", "checked": "what verifies it" }` (a generated page, a translation, a recording, a guide). `check-freshness` lists the rows a branch triggers, locally and as warnings on every PR; it never fails. AGENTS ("What follows a change") and BACKLOG-RULES (Documentation consistency) point to it instead of relying on "check everything" alone. Found in openbando: a fence label written in TypeScript data had no translation and nothing noticed; clips, guide pages and tips had no record of what they follow.
- `check-freshness`: `*` matches within a path segment, `**` across segments; "nothing checks it" is said when a row has no `checked`.
- Projects: copy `tools/check-freshness.mjs`; add `"impact": []` to `.harness.json` and fill the rows the project has (APPLY.md, "Write the files"); reconcile AGENTS (the new "What follows a change") and BACKLOG-RULES (the impact-map paragraph in Documentation consistency); move `version` to 1.11.0.

## 1.10.0, 2026-10-29

From a project session where a rule for every project was written into one project's AGENTS: the decision "this project or every project?" now happens at the edit, and asking is the rule when it is unclear.

- **Changing a harness file** (core AGENTS, a new sub-section beside the PR rules): before editing a file listed in `.harness.json`, decide whether the change is this project's or every project's; the edit is the trigger, whatever the request's words (an "allow X" that changes how work is done is a rule). Unsure: ask the user before editing. Before, the trigger was "a request that adds a rule", at the end of Work tracking, and "ask" was only in APPLY.md, which a project session rarely reads.
- **check-freshness lists the harness files a branch changes** (copied, forked, `.harness.json`, and adapted files that hold rules; not README, backlog records or area notes, which are project content by design), with the question, locally and as a warning on every PR. It never fails. Silent in the template repository itself.
- **Project lines are marked.** A line a project adds inside a section that comes from the template ends with `<!-- project -->` (APPLY.md, "Project overrides", 1b); a reconcile keeps marked lines and asks about unmarked differences.
- **PR rules for every project** (core AGENTS, "Checks before you finish"; this repository's AGENTS too): never base a PR on another PR's branch; push no new work to a green PR, open a new one; a green PR that conflicts with `main` may get a push that only resolves the conflict, and its checks run again. BACKLOG-RULES: parallel PRs' backlog conflicts are resolved in the conflicting PR, keeping every record from both sides and the newer header.
- Projects: copy `tools/check-freshness.mjs`; reconcile AGENTS ("Checks before you finish", the new "Changing a harness file", the shortened Work tracking bullet) and BACKLOG-RULES; mark the project lines in template sections of adapted files; move `version` to 1.10.0.

## 1.9.0, 2026-10-29

- **Template release check in project CI.** The Angular `CI` workflow clones the template (`template.repo` in `.harness.json`; it is public, so no token) into the runner's temp folder and runs `check:freshness` with `HARNESS_HOME` pointing at it. A PR on a project that is behind a release now shows `check-harness` warnings; it still never blocks. Before, CI had no clone and skipped the check, so a project falling behind was noticed only at a local session start (F-002). A failed clone is a warning and the check is skipped.
- `check-harness`: comments only (where the clone comes from in CI).
- Projects: in `.github/workflows/ci.yml`, add the "Harness template" step before the freshness step and its `HARNESS_HOME` env (from `angular/.github/workflows/ci.yml`); copy `tools/check-harness.mjs`; move `version` to 1.9.0.

## 1.8.0, 2026-10-29

- **One repository, one backlog.** BACKLOG-RULES has a new section: a backlog tracks only its own repository's work (single responsibility), and dependencies point one way. A record may wait on an upstream release (a library, the harness template) and is Blocked on it; it never waits for the repositories that use it to adopt a change, and closes when the change is released here. Evidence from another repository (a trial in a real consumer) is recorded in Verification, never left as an open condition. Test: if a record's next action or closure condition can only happen in another repository, it is in the wrong backlog. Found here: harness release records waited for both projects to reconcile (B-002).
- APPLY.md, "Reconciling": a project records its reconcile in its own backlog.
- Projects: reconcile `docs/BACKLOG-RULES.md` (the new section, before "When to update and review") from `core/docs/BACKLOG-RULES.md`; move a record that waits on another repository's work to that repository's backlog and link it; move `version` to 1.8.0. No copied file changed.

## 1.7.0, 2026-10-29

From a second outside review (2026-10-29): the guards now check what their messages claim.

- **Archives keep every line.** `check-backlog` compares each archive with the published default branch line by line: every published line must still be there, unchanged and in order. New records may go anywhere; a correction is a dated note. 1.6.0 compared only record IDs and the count of closed rows, so an emptied record or a replaced row passed while the message said "keep everything".
- **check-freshness** lists every first-parent commit since the backlog's commit that changes more than records, whatever its message: a PR number comes from the message, else from `gh` (`commits/<sha>/pulls`) when it is available, else the commit is listed by hash to review. Rebase merges and direct pushes were skipped silently. A failed fetch is reported instead of "Fresh"; the check still never fails.
- Projects: copy `tools/check-backlog.mjs` and `tools/check-freshness.mjs`; reconcile the session-start bullet in AGENTS and the BACKLOG-RULES lines on the freshness trigger and archives; move `version` to 1.7.0. If `check-backlog` now fails, an archive was edited: restore the published lines and add the change as a dated note.

## 1.6.0, 2026-10-29

- **Archives only grow.** `check-backlog` fails when a record (`### ID`) or closed row (`| 🔵 |`) that an archive has on the published default branch is missing locally, or the archive file is gone. An agent's rewrite had replaced whole archives with their newest records (B-001); this catches it in the PR.
- Projects: copy `tools/check-backlog.mjs`; move `version` to 1.6.0. If `check-backlog` now fails, restore the archive from git history before anything else.

## 1.5.0, 2026-10-29

From an outside review of the harness (2026-10-29): lighter where it cost nothing, and the tools proven.

- **Failing tests.** The AGENTS template no longer calls a test that fails after a code change "stale": a failing test is checked against the intended behaviour, and its expectation changes only when the requirement did.
- **check-freshness** compares with the published default branch (`origin/<branch>`), not the local checkout, so PRs merged on GitHub are found while the local branch is behind; the branch is `defaultBranch` in `.harness.json`, else the remote's HEAD, else `main`. Squash and rebase merges (`Title (#N)`) count as well as merge commits. Audit age is a setting, `freshness.auditDays` (default 7).
- **ci-status** names the repository's default branch instead of assuming `main`, and no longer claims CI does not run elsewhere.
- **check-harness** reports a malformed `.harness.json` instead of crashing. All tools resolve their paths with `fileURLToPath`, so paths with spaces work.
- **check-conventions** says it is a text-pattern heuristic and that a false result is a defect of the check.
- This repository: `tools/test-tools.mjs` (`npm run test:tools`, in CI) runs the copied tools against throwaway git repositories: releases, conflicts, forks and `--merge`, malformed stamps, missing, stale, dirty or unreachable template clones, merge and squash detection, a behind local branch, a non-`main` default branch, audit age, backlog tables. Against the 1.4.0 tools, 12 of its 14 tests fail.
- Projects: copy `tools/check-freshness.mjs`, `check-harness.mjs`, `ci-status.mjs` (Angular: `check-conventions.mjs`); reconcile `AGENTS.md` (the failing-test bullet, the audit bullet) from `core/AGENTS.md`; add `"freshness": { "auditDays": 7 }` to `.harness.json` if you want a different cadence; move `version` to 1.5.0.

## 1.4.0, 2026-10-29

- **Project overrides**: a project can change a harness rule or tool for itself and keep receiving releases (APPLY.md, "Project overrides"). A setting in `.harness.json` first; a rule in an adapted file is marked with a `> Project override (harness rule: …)` line, which `check-harness` counts when that file's template source changes; a copied tool can be **forked**: listed under `forked` in `.harness.json` with its source, base release and reason. `check-harness` three-way merges a fork with each template release (clean or CONFLICT), and `--merge` writes the merge and moves the base of clean ones forward.
- Projects: copy `tools/check-harness.mjs`; reconcile `AGENTS.md` (Work tracking: the copied-tool and harness-change bullets) from `core/AGENTS.md`; add `"forked": {}` to `.harness.json` if you like; move `version` to 1.4.0.

## 1.3.0, 2026-10-29

- **Changing the harness from a project.** APPLY.md has a new section saying where a change asked in a project belongs: a setting goes in `.harness.json`, project content stays in the adapted file, and a copied tool or a rule for every project is changed and released in the template first, then reconciled. The AGENTS template's Work tracking and the `apply-harness` skill point to it.
- Projects: reconcile `AGENTS.md` (Work tracking: the harness-change bullet) from `core/AGENTS.md`; move `version` to 1.3.0. No copied file changed.

## 1.2.0, 2026-10-29

- **Online first.** APPLY.md step 0, the AGENTS template and the skill: pull the published template (`git pull --ff-only --tags`) and confirm a clean tree before applying, reconciling or changing it. `check-harness` now warns when the remote cannot be reached, the clone is behind or ahead of it, has uncommitted changes, has no remote, or is missing (quiet in CI).
- `check-harness` reports a template file that is new since the project's release as "new, adopt it if it fits" instead of "changed".
- **The template follows its own harness**: root AGENTS, CLAUDE, area notes, backlog and rules, style guide, audits, archive, `.harness.json` (stamped with its own releases), `package.json` scripts, a `CI` workflow, and `tools/check-template.mjs` (one version everywhere, copied tools identical to `core/tools/`, stamp entries exist, syntax, root-doc links and placeholders).
- Projects: copy `tools/check-harness.mjs`; reconcile `AGENTS.md` (Work tracking, harness bullet) from `core/AGENTS.md`; move `version` to 1.2.0.

## 1.1.1, 2026-10-29

- The template is published at https://github.com/voidbrain/project-harness; `core/.harness.json` names it as `template.repo`, so `check-harness` can fetch new release tags. Projects: set `template.repo` and move `version` to 1.1.1; no file changes.

## 1.1.0, 2026-10-29

- Versioning: `VERSION`, this changelog, release tags, and a `.harness.json` stamp in each project (template path, version, stacks, copied and adapted files, project settings).
- `tools/check-harness.mjs`: says per file what to update, what conflicts and what to reconcile by hand; `check-freshness` runs it, so every session start checks the template.
- Project settings moved out of the copied scripts into `.harness.json`: `conventions.pureDirs` (check-conventions), `ciStatus` (workflow name, browser jobs, extra log notes). Copied scripts are now byte-identical in every project.
- Optional `docs/DESIGN.md` slot: what the product does (game design, domain model), with numbers left in the code.
- APPLY.md: merge an art-direction doc into the style guide, deploy notes into the README; a "Reconciling" procedure.

## 1.0.0, 2026-10-29

- First release, extracted from OpenBando: CLAUDE, AGENTS, area notes, backlog and rules, style guide, audits, archive, README sections; `check-backlog`, `check-freshness`, `ci-status`; Angular add-on (AGENTS section, ESLint, Prettier, CI, `check-conventions`). First applied to marginalia-wars (#8).
