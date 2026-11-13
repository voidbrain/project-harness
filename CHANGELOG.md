# Changelog

Releases of the project harness. Each release is a git tag `vX.Y.Z`; projects record the release they were last reconciled with in `.harness.json` (`version`), and `tools/check-harness.mjs` compares the two at every session start.

Versioning: **major** when a project must change its own files to keep passing (a new required record field, a renamed script or file); **minor** for new optional files, checks or rules; **patch** for wording and fixes that need no action.

## 8.6.0, 2026-11-13

- **Concise `## Other changes` in `BACKLOG.md`**: `core/tools/check-backlog.mjs` now checks that `## Other changes` in `docs/BACKLOG.md` stays at most 2 paragraphs and 1000 characters; `core/docs/BACKLOG-RULES.md` ("When to update and review") requires moving older entries to `docs/archive/reconciliation-<year>.md` under `## Archived Other changes`. Copy `tools/check-backlog.mjs`, reconcile `docs/BACKLOG-RULES.md`, and move older `## Other changes` entries to `docs/archive/reconciliation-<year>.md`.

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
