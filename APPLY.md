# Applying the harness to a project

The procedure an agent follows. Template root: `~/Projects/project-harness` (`core/`, plus one stack folder when it applies), published at https://github.com/voidbrain/project-harness.

## Required steps and conditional work

This table clarifies the existing procedure; optional profiles and artifacts do not become new adoption gates. A required applicable step is performed, or its actual blocker and next action are recorded on the owning backlog outcome. Do not create one feature/bug per routine step. Record accepted deliverables and unresolved work at the start; put their acceptance checks in their records.

| Step | Trigger and obligation | Evidence / tracking |
|---|---|---|
| Read relevant code, rules and existing tooling | Required before proposing or changing the affected behaviour; first adoption reads the target baseline. | Report inspected scope; record unresolved findings on their owning outcomes. |
| Verify template source/release | Required for application, reconciliation and template changes, under step 0. | Name actual revision/tag and connectivity limits; no silent stale application. |
| Assess available and missing capabilities | Required at setup and relevant stack/workflow changes, scaled to the task. | Existing tools may suffice. Record selected recommendations/review evidence when useful; no mandatory marketplace search. |
| Recommend/configure/install MCPs or skills | Conditional on a useful gap and authorized host access. | Optional selections and setup evidence; missing optional tools do not block independent work. |
| Check rule/interface conflicts | Required when applying/reconciling instructions or changing a shared boundary. | Resolve discrepancies in the same change or record the owner/blocker. A separate conflict map is conditional on meaningful complexity; no empty-map requirement. |
| Map derived outputs and external dependencies | Required when the project has those relationships; maintain affected rows on changes. | Impact map and owned checks. Record a justified deferral; do not invent dependencies to populate a map. |
| Validate and reconcile evidence | Required checks follow the actual change/profile and owning record's acceptance. | Run applicable checks, distinguish pass/fail/unavailable, update backlog and affected docs. Optional runtime checks remain conditional. |

## 0. Online first

Before applying the harness, reconciling a project or changing the template, get the published latest:

```bash
git -C ~/Projects/project-harness pull --ff-only --tags   # or: git clone https://github.com/voidbrain/project-harness ~/Projects/project-harness
git -C ~/Projects/project-harness status --short          # must be empty
git -C ~/Projects/project-harness tag --sort=-v:refname | head -1   # the release to apply
```

Apply from that release tag, never from a stale, diverged or dirty clone. If the remote cannot be reached, say so and stop rather than apply local files. `check-harness` reports the same conditions at every session start.

## 1. Read the target before writing anything

- `git status`, branch, remote, recent log. If the tree is dirty, stop and ask. If on the default branch, create `harness/agent-harness` first. While applying the harness for the first time, do not commit or push unless the user asks: the project has not adopted AGENTS ("What the agent does on its own") yet; once it has, that section says what the agent does without asking.
- Existing agent and doc files: `AGENTS.md`, `CLAUDE.md`, `.claude/` (agents, commands, settings), `.github/copilot-instructions.md`, `.cursor/`, `.continue/`, `README.md`, `docs/`, contributing guides. Their content is the starting material. Merge it in; never drop a project rule silently.
- Stack and tooling: `package.json` (scripts, versions), `angular.json`, linters, formatters, test runners, CI workflows, deploy setup.
- Source layout: which folders hold pure logic, framework code, UI, assets, tests.
- The baseline: run lint, unit tests, build and the type check the project already has. Record what passes and what fails, with the error. Do not fix failures as part of applying the harness. They become backlog records.
- Hygiene a reviewer would flag: build output or dependencies tracked in git, ignored files that are tracked, duplicate or conflicting workflows, docs that disagree with the code (tokens, commands, file names), rules that contradict each other.

## 2. Choose the stack add-ons

- Angular project (`angular.json`, `@angular/core`): add `angular/`.
- Other stacks: `core/` only. Write the stack rules section of AGENTS by hand from the project's own conventions, and leave `check:conventions` out unless you write one.

## 2a. Optional MCP recommendations

Read [MCP guidance](core/docs/agents/mcp.md) before choosing recommendations. MCP installation remains optional.

- **MCP recommendations:** copy `core/tools/mcp.mjs`, `core/tools/mcp-catalog.json` and the shared `core/docs/agents/` guides to their applied paths and include their stamp entries. For Node projects add `check:integrations` and `mcp:recommend` from the package-scripts fragment; CI may run the metadata check, which passes with no selections. Read the actual task/stack, discover already available tools and research only missing capabilities. Populate the optional `integrations` field with project-specific reasons, reviewed sources/versions, fallbacks and genuine review dates. Configure/install only on the authorized execution host; generated snippets never replace instructions or existing settings. Never infer a working connection from a registry listing or file.
## 2b. Optional solution profile

Read [solution-profile guidance](core/docs/agents/solution-profile.md) when the owner has chosen multi-repository coordination. This profile does not require an MCP connection.

- **Coordinator repository:** when the owner has chosen a multi-repository solution, use a separate coordinator even for a small solution. Apply `core/`, then merge `solution/.harness.fragment.json`: concatenate stacks, merge copied/adapted entries and add `solution.role/manifest`. Fill `.solution.json` from the actual repositories, source refs and checkout layout; adapt `solution/docs/SOLUTION.md` to own contracts and integration acceptance. Copy the dashboard helper and merge the coordinator CI template (own backlog/integration metadata only; component availability is not a default gate). Node coordinators may merge `solution/package-scripts.json`. Add relevant catalogue selections at solution scope only when they benefit shared workflows.
- **Components:** apply their normal stack profile independently. A component can point `solution: {role: "component", id: "<manifest-id>", manifest: "../coordination/.solution.json"}` at available context. It keeps its own backlog and acceptance. Missing coordinator access does not block independent work. Do not apply a coordinator's availability checks as a mandatory component build gate.
- **Dashboard:** add qualified `Components` metadata links to solution-owned records. Provision authorized local component checkouts or deliberately use GitHub reads. Run the solution check and generate a snapshot; inspect revisions, local changes, missing links/sources and integration status. Never mirror editable component statuses or average percentages. Configure archive sources when linked records close. Snapshot refresh is deliberate and timestamped, not an automatic claim of live status.

A user-provided example is a design/fixture case. It does not authorize creating, repairing, adopting or releasing a real consumer solution. Generic acceptance uses this repository's fixtures and never depends on downstream adoption.

## 2c. Optional skills

Read [skill guidance](core/docs/agents/skills.md). Copy that guide and its stamp entry when adopting it. Use its AST10-mapped checklist when reviewing third-party skills; record the source revision, purpose, limits, fallback and AST IDs checked. AST10 is draft guidance until OWASP publishes a dated release. The shared `skills/apply-harness/SKILL.md` stays in the template repository; locate it at the reviewed template revision. Register/install it for the actual client only when needed and authorized, checking duplicate personal/project names and current discovery support. No skill installation is required to follow this procedure. Keep client-specific adapters thin; do not duplicate release or permission rules. Research additional skills only for a missing capability and inspect their sources before execution.

## 3. Write the files

For each template file, adapt it to the project; do not copy it unchanged.

- **CLAUDE.md**: as the template. If one exists with more content, move that content into AGENTS.md or the area notes.
- **AGENTS.md**: the stack section first (from `angular/AGENTS.angular.md` when it applies, minus rules that do not fit the project's framework version), then the project sections of `core/AGENTS.md`. Fill each section from what the project really does. Delete a section that has nothing true to say rather than padding it. Keep it under ~200 lines; detail goes to `docs/agents/areas.md`.
- **docs/agents/areas.md**: one section per area of the code that has its own rules or lessons. Existing subagent definitions (`.claude/agents/*.md`) map naturally to areas. Keep the subagents and make them point to AGENTS.md and their area section instead of repeating rules, and fix any of their rules that contradict AGENTS.
- **Other agent instruction files** (Copilot, Cursor, Continue): reduce to a pointer to AGENTS.md plus anything that tool needs and the others do not.
- **docs/STYLE-GUIDE.md**: fill from the code (CSS custom properties, theme files, fonts actually loaded). The code is the source of truth. An existing art-direction or look-and-voice doc is **merged into it** (concept, references, do and don't, per-character or per-screen notes) and deleted, so one document owns the palette and type; values it gives that the code does not ship become a backlog record and are listed, not silently dropped. A full design-system folder (tokens file plus one guide per component) stays where it is; the style guide then links it instead of restating it.
- **docs/DESIGN.md** (optional): what the product does in its own terms (game design, domain model, protocol). Merge an existing game-design or spec doc into it, or keep its name if the project already uses one (`GAME-DESIGN.md`). It describes the rules and names where each one lives; tables of numbers stay in the code, linked. Check every claim against the code; promised but unbuilt behaviour becomes a backlog record. Skip the file if the README covers it.
- **Deploy notes**: a short deploy doc becomes a README section ("Deploying"); keep a separate file only when it is long or audience-specific.
- **docs/BACKLOG.md**: header with today's date and the current `main` commit (`git rev-parse --short origin/main`). Seed records from the baseline and hygiene findings, and from any TODO list or plan in the existing docs. Each record is reproducible and has a next action. A finding the user must decide on (naming, scope, deleting history) gets 🧑 Decision; one the user must run or check gets 🧑 Procedure. Add a record for the harness change itself (Implemented, verified by the first PR's CI).
- **docs/BACKLOG-RULES.md**: as the template, with the project name. Edit the Documentation consistency list to name the docs this project actually has.
- **docs/audits/<today>-<topic>.md** and matching **.audit.json**: baseline audit report and declared scope under the shared audit guide; name checks, limits, findings and owning records.
- **docs/archive/README.md** and **docs/audits/README.md**: adapt the template guidance and retain their stamp entries; audit evidence stays dated and append-only once published.
- **README.md**: keep the project's README and its voice. Add or correct "Run it" (the real commands), "Where things are", and a short "Working on it" section linking AGENTS, the backlog and the style guide. Fix claims the baseline proved wrong.
- **tools/**: copy `check-backlog.mjs`, `check-freshness.mjs`, `check-harness.mjs`, `check-tooling.mjs`, `ci-status.mjs`, `impact-map.mjs` and `coverage-table.mjs` unchanged (and `lcov-summary.mjs` when the test runner writes only LCOV), and for Angular `check-conventions.mjs`. Never edit a copied file for one project: its settings live in `.harness.json`, and a change only that project needs is a fork ("Project overrides").
- **.harness.json**: start from `core/.harness.json`, merge the stack's `.harness.fragment.json` (concatenate `stacks`, merge `copied`, `adapted` and settings; an `adapted` path with two sources takes a list). Set `version` to the release you applied, `template.repo` to the template's remote if it has one, `conventions.pureDirs` to the framework-free folders and their allowed `@angular/core` names, `ciStatus` to the PR workflow's name and browser jobs. Add to `adapted` any template file you adapted under another name (`docs/GAME-DESIGN.md` from `core/docs/DESIGN.md`), and remove entries for files you deliberately skipped.
- **package.json scripts** (Node projects): add `check:backlog`, `check:freshness`, `ci:status` and, with Angular, `check:conventions`, from `angular/package-scripts.json`. Do not rename existing scripts.
- **Lint and format config** (every stack, required from 5.0.0): the project must have a formatter check and a linter as npm scripts (`format:check`, `lint`; other names go in `tooling` in `.harness.json`) and run both in CI. `npm run check:tooling` fails otherwise. If the project has none, add Prettier with `core/.prettierrc.json` and `core/prettierignore.txt` (as `.prettierignore`), and ESLint with `core/eslint.config.mjs` (Angular: `angular/eslint.config.mjs`); if it has its own, keep it and merge: keep the project's rules unless they contradict AGENTS (for example, an ESLint rule requiring explicit `OnPush` when AGENTS says it is the default); remove the contradiction and say so. Add `.editorconfig` only if the project has none. Exclude from formatting the files that must stay byte-identical: copied harness tools, vendored and generated files, fixtures. Keep `embeddedLanguageFormatting` off, so templates inside strings are not rewritten. The first reformat is one mechanical PR with no hand edits: compare a position-free syntax tree of every file before and after (and check that the comparison saw the files), run the full suite, and note that anything hashing its own source changes identity. Lint findings that need code edits go in a separate PR. Never leave the `{{LINT}}` line out of AGENTS because the project has no linter: add the linter. A repository with no source code records `tooling.exempt` with its reason. Script bodies for a plain Node project: `"format": "prettier --write ."`, `"format:check": "prettier --check ."`, `"lint": "eslint ."`, with exact-version dev dependencies `prettier`, `eslint` and `@eslint/js` (plus `typescript-eslint` for TypeScript). If the project's Prettier options differ from `core/.prettierrc.json`, the copied tools must be ignored or they stop matching the template byte for byte; the default ignore file excludes `tools/` for that reason. ESLint 10 uses the nearest `eslint.config.mjs` to each file: a repository with nested configs lints with `eslint -c eslint.config.mjs .`, and a template checkout inside the repository (CI often uses `.harness/template`) must be ignored by both tools or lint fails there only in CI. For ESLint, ignore the copied tools by path (the keys of `copied` in `.harness.json`), not the whole `tools/` folder, so project-owned tools are linted; for Prettier, keep `tools/` ignored and un-ignore the project's own tools one by one (`!tools/my-tool.mjs`). A reformat changes anything derived from source text, such as an evidence or engine hash or a plan identity: find those first and say so in the PR.
- **CI**: add `angular/.github/workflows/ci.yml` (workflow name `CI`, which `ci-status.mjs` looks for) if the project has no PR workflow, otherwise add the harness steps to it. The template clone step needs `template.repo` in `.harness.json`; keep it with the `HARNESS_HOME` line on the freshness step, or `check-harness` is skipped in CI. A check the current code fails (conventions on legacy code, for example) runs with `continue-on-error: true` and a comment naming its backlog record, so it is visible without blocking. Remove the allowance when the record closes.
- **Impact map** (`impact` in `.harness.json`): one row per derived thing the project has, as fine as the code names them: an `id`, which files set it off (`when`, globs), what must follow (`then`), the command (`run`), what checks it (`checked`) and the rows it must run again after (`after`). Find them in the build scripts, generated files, recordings, translations, guides and feature docs. List the content each output loads in its `inputs`, the values that live in two places in `couplings` and what outside the repository can change an output in `outside`. Then `node tools/impact-map.mjs` writes `docs/agents/impact-map.md`.
- **Coverage** (`coverage` in `.harness.json`: `summary` path, `folders`, `drop`): the test runner must write the standard `coverage-summary.json` ("json-summary" reporter) with every source file included. Angular (Vitest): add the dev dependency `@vitest/coverage-v8` at the installed Vitest version and the `coverage` npm script, then `npm run coverage` writes `docs/agents/coverage.md` and its baseline; the CI test step runs with coverage and `coverage-table --check`. Node test runner (`node --test`), which writes LCOV only: copy `lcov-summary.mjs`; a `test:coverage` script runs the suite once with `--experimental-test-coverage --test-coverage-include='src/**' --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=coverage/lcov.info` (create `coverage/` first) and then `node tools/lcov-summary.mjs`, which writes `coverage.summary` from `coverage.lcov` (default `coverage/lcov.info`) and adds source files under `coverage.folders` that no test loaded at zero; `coverage` adds `coverage-table --write`; CI runs the suite through `test:coverage` and `coverage-table --check`. List the page in `pages`. Browser tests (Playwright, Chromium) can add browser and combined tables: `coverage.browser`, `coverage.combined`, the collector and `coverage:browser`, as the coverage guide says.
- **Push guard** (optional, `tools/guard.mjs`): copy it with the other tools; it is opt-in per clone. `npm run guard:install` (or `node tools/guard.mjs install`) installs it as the git `pre-push` hook (it never replaces an existing hook: add `node tools/guard.mjs pre-push "$@"` to that one by hand). It refuses a push to the default branch, a force-push, a published tag moved or deleted, and a push whose archives drop or change a line already on the default branch, citing the AGENTS or BACKLOG-RULES rule. For Claude Code, also add the optional adapter to `.claude/settings.json`: `{"hooks":{"PreToolUse":[{"matcher":"Bash|Edit|MultiEdit|Write","hooks":[{"type":"command","command":"node \"$CLAUDE_PROJECT_DIR/tools/guard.mjs\" claude"}]}]}}`; other agents and plain git rely on the hook. After the owner approves one such operation, it runs with `HARNESS_GUARD_ALLOW=<rule>` (`default-branch`, `force-push`, `archive`). `check:freshness` (through `check-harness`) reports an adopted guard that is not installed in the clone.
- **.claude/agents/**: copy `mechanical-reviewer.md` and `design-reviewer.md` (listed under `copied`); they pin the reviewer's model in Claude Code.
- **.gitattributes**: merge `core/gitattributes.txt` (`docs/archive/*.md merge=union`: parallel appends to the archives and the reconciliation log merge on their own).
- **.gitignore**: merge `core/gitignore.txt`. Do not ignore `.claude/` as a whole. Ignore only `.claude/settings.local.json` and `.claude/worktrees/`, so shared agents and commands are versioned.

## 4. Validate

- Optional integration metadata passes `node tools/mcp.mjs check`; a missing selection is valid. Recommendation/config output must not be reported as installed or connected.
- For a coordinator, `node tools/solution.mjs check` names source/link problems; inspect a generated dashboard. Unknown sources and explicit failures remain visible. Never fabricate acceptance when private repositories or devices are unavailable.

- `node tools/check-backlog.mjs` passes; `node tools/check-freshness.mjs` runs (warnings are expected before the first PR merges) and ends with `Harness: on template vX.Y.Z; copied files match it.`
- `check-conventions` runs. Record its result in the audit and in a backlog record if it reports problems.
- No `{{` placeholders or `<!-- harness:` notes remain: `grep -rn '{{\|harness:' AGENTS.md CLAUDE.md README.md docs tools .claude`.
- Every local link in the new docs resolves.
- Lint still passes if it passed before.

## 5. Report

Tell the user what was added and changed, which existing rules were merged or contradicted, the baseline (what passes and what fails), and the backlog records that need their decision. Point at the branch. During first adoption, commit/push/PR follow the explicit authorization in step 1. In an adopted project or the template, follow its AGENTS and existing user authorization; do not ask again for authorized actions.

## Reconciliation preview and friction

All applicable rules remain mandatory from the start. Before writes, optionally run the read-only `tools/reconcile-preview.mjs` against the online-verified release; review project rules, missing ancestry and unresolved changes. For adopted 3.0+ policy, use timed start/finish and required review evidence as the maintenance guide specifies; legacy explicit record mode remains available for genuinely observed durations. Never fabricate a historical baseline. Follow [maintenance guidance](core/docs/agents/maintenance.md). Copy the helpers/guide and stamp entries required by the adopted version; merge scripts and the local measurement ignore entry. No installation or record-schema migration is required.

## Optional scoped verification (4.1)

Copy `core/tools/verification.mjs` and `core/docs/agents/verification.md`, add their stamp entries and `verification:plan`. Defaults stay disabled; no existing required check changes automatically. Read the guide, configure the project's source/risk/documentation patterns and affected groups, and map current impact obligations and acceptance checks before opting in. Preserve static/security checks, failing-test-first and independent-review requirements. A project without a complete mapping keeps full verification for unknown paths.

Reconcile AGENTS' blanket check list into the opted-in selection procedure; retain every command as an available full/affected check. Separate deterministic full checks from stress/model/device campaigns. Adapt CI with one PR trigger, manual full and weekly main checks, bounded read-only Actions history, stable required jobs and a full marker that cannot succeed after a partial/failed run. Settings/platform test execution belong to the project, not to copied tools. Verify the routing and full-marker contract with owned fixtures; do not change repository protection settings. A successful full PR run can reset freshness after merge without another main run when the exact tested head matches.

## Optional task context adoption (4.3.0)

Copy `core/docs/agents/task-context.md` to `docs/agents/task-context.md`, add its copied mapping and maintenance input, and carry the short AGENTS task-context trigger/paragraph plus the procedures-index row. Preserve every project rule and existing authorization. This optional workflow adds no required record fields or CI gates. It is procedural agent behavior: actual fresh-thread/compaction calls need a supported authorized host capability, and the fallback keeps work continuous when unavailable. No provider cache, host adapter, model runner or UI automation is installed. Validate handoff preservation, inspect actual host capability and retain honest unrun/unknown usage evidence. Existing projects need no migration to keep passing.

## Optional parallel work adoption (4.2.0)

Copy `work-items.mjs`, `task-claims.mjs` and the parallel-work, architecture-review and procedures guides with their stamp mappings. The guides are discovery/procedure additions; record migration and claims remain opt-in. Add their procedure triggers to AGENTS and reconcile the source-aware BACKLOG-RULES paragraph, preserving all existing safeguards. Copy the package scripts and conditional CI check. No model, service, credential or repository setting is installed/changed by adoption.

For record/task adoption set `workItems` to `{ "enabled": true, "layout": "docs/work/layout.json", "records": "docs/work/records", "tasks": "docs/work/tasks", "profiles": "docs/agents/model-profiles.json" }`. Start with a reviewed clean ledger, run `node tools/work-items.mjs migrate` and verify exact byte preservation. Review unsupported layouts rather than discarding content. Seed a profiles file (`version: 1`, `profiles: []` is valid), add explicit reviewed tasks, and run `work-items check`, backlog/dependency/queue/roadmap checks. `work-items build` regenerates current status; archives stay untouched. Treat record sources as canonical in project rules. Add impact rows watching source records/tasks/profiles; generated views remain read-only. Required checks still run on adopters. Other projects need no migration or new fields to keep passing.

Before parallel work, review/create the dedicated claim registry once under the shared guide. Claims use normal authenticated Git fast-forward pushes and preserve existing push/archive safeguards. Synchronize clocks, stop on unknown ownership, and verify before mutations/push/integration. Expiry alone never proves work stopped. Do not merge the metadata branch or erase/reinitialize its fencing history. External/model adapters remain project-owned; unmeasured Gemma or other profiles stay candidates until evaluated. A shared release uses owned neutral fixtures and never waits for downstream adoption or model inference.

## Reconciling a project with a newer template

For 4.8.0, copy the adopted work-usage tool and guide. Existing stores need no migration: an `allowances/` directory is created privately when used. Optional `collect-codex` reads documented CLI app-server rate limits without a model call. Optional Claude status-line capture must be merged deliberately with any existing client setting; the harness does not rewrite client configuration. `report --out=PATH` refuses checkout paths, links and overwrites. Allowance percentages remain shared account metadata, separate from tokens, explicit API rates and subscription charges; calibration groups are advisory samples and never rewrite estimates.

For 4.7.0, copy adopted work-usage tool and guide for optional immutable effectiveness observations and feature/step reports. Existing jobs/events need no migration. Import only explicit authorized metadata with stable source/event IDs; do not reconstruct estimates, interventions or counters from transcripts. Reports retain partial coverage, pre-work estimate revisions and separate currency/rate provenance. No native exporter, billing integration or automatic priority change is installed.

For 4.6.0, copy adopted work-usage tooling and guide for optional metadata-only Codex/Claude imports and parent job identity. Optionally copy `core/tools/usage-launch.mjs`, add its copied stamp and `work:launch` script, and include it in maintenance inputs. It launches only an explicitly supplied command under existing permissions, registers first and passes job identity; it installs no exporter or client hook. Preserve unknown coverage and do not point import at transcript files. Existing metadata and non-adopters need no migration.

For 4.5.0, optionally set `workItems.featurePlans: true` after reviewing the upfront-planning section in BACKLOG-RULES. Copy updated work-items/work-usage tools and adopted shared guides, reconcile the safety pointer and adapted backlog rules, and give each active feature an anticipated full step plan with dated task effort. Preserve existing task IDs, completed evidence, human decisions and original estimates when known; do not manufacture old estimates or rewrite archives. Run work-items build/check and existing backlog/dependency/queue/roadmap checks. Non-adopters require no migration. Usage reports add optional `--task` filtering and `byTask` groups; historical feature-only jobs stay unassigned. No native client adapter is installed.

For4.4.0, optionally adopt `core/tools/work-usage.mjs` and `core/docs/agents/work-usage.md` with copied stamps and `work:usage` from the script catalogue. Set `workUsage.enabled:true` only for projects selecting the workflow; carry the optional AGENTS section. Merge useful GEMINI/QWEN/Copilot bridges from `core/` into actual client entry points without overwriting existing instructions; list adopted bridges as adapted. Verify instruction loading on the actual client; no exporter or native usage adapter is installed. Private metadata stays outside the checkout and unavailable counters remain unknown. Existing jobs and permissions are unchanged.

`npm run check:freshness` (through `check-harness.mjs`) lists, at every session start, what a new release means for the project. Handle it in the session's first PR:

For 4.0.0, migrate active records to the four-column Signal / Priority / Status / Effort summary before running the updated validator. Remove only the completion column and active completion-percentage estimates; retain remaining-effort rationale, assumptions, dates, scope, next actions, blockers, human cues and acceptance evidence. Do not rewrite published archives or dated reports. Status and verification evidence remain the progress source. Copy the changed check-backlog, solution reader (when adopted) and behavior tool (when adopted); reconcile BACKLOG-RULES and live descriptions of the format. No status or acceptance advances because of migration. Optional hours/days ranges go in the remaining-effort rationale; tokens/cost remain separate.

Optionally adopt the work queue: copy `core/tools/backlog-queue.mjs` and `core/tools/backlog-dependencies.mjs` with copied mappings; register `check:queue` / `check:dependencies` from the script catalogue and include the conditional CI checks. With source-owned records, set `workItems.order: "queue"` so the ledger follows the queue, and `work-items build` shows Depends on and Unlocks in each record's summary table. Optional `workQueue.roadmap` selects a repository-relative placement table with Records and Scope or Acceptance columns. Author `Queue order` only to express a deliberate ordering, with a positive unique integer and reason. Run both checks after ledger edits and closure. A missing queue is valid for non-adopters; no behaviour runner is installed or inferred.

For 3.5.0, linked backlog prerequisites are optional. Copy `core/tools/backlog-dependencies.mjs` to `tools/`, add its copied mapping and the `backlog:dependencies` / `check:dependencies` scripts from the Angular script catalogue. Carry the optional Linked prerequisites section into BACKLOG-RULES. Add only reviewed hard prerequisites to details metadata, with linked IDs and required outcomes; preserve independent work and ownership direction. Generate `docs/agents/backlog-dependencies.md`, link it from the backlog, add an impact row watching the active backlog, yearly archives and generator, and run `check:dependencies` in CI. The shipped CI step checks only when this page exists, so non-adopters need no page or record migration. Cross-repository link existence/status/cycles require review; the tool makes no network calls. After archiving, update active dependency links and regenerate the page without editing historical records. No configured behaviour runner means that check remains explicitly unrun; an existing configured runner follows the rule-change impact row.

For 3.3.0, browser and combined coverage are optional: copy `browser-coverage.mjs` and the updated `coverage-table.mjs`, add the copied mapping and the `coverage:browser` script, set `coverage.browser` (and `coverage.combined` with the unit LCOV in `coverage.lcov`), add the collector to the Playwright fixture and run `coverage:browser` after the browser tests, before `coverage-table` (coverage guide, "Browser and combined coverage"). Without these settings nothing changes. The agent-behaviour checks are optional: copy `behaviour.mjs`, add the copied mapping, the `behaviour` script and `behaviour.times`; set `behaviour.runner` to the agent command the owner chooses (none is required, and the template names none), and add an impact-map row so a change to AGENTS.md, CLAUDE.md or BACKLOG-RULES reruns them (maintenance guidance, "Agent-behaviour checks"). Never put them in PR CI by default. AGENTS loads the safety rules always and procedures when needed. Copy `check-rules.mjs`, `docs/agents/change-impact.md` and `docs/agents/coverage-guide.md` (and the updated shared guides), add their copied mappings, the `rules` setting from `core/.harness.json`, the `check:rules` script and its CI step. In AGENTS: wrap the "What the agent does on its own, and what it asks first" list (and the guard line) in `<!-- safety:start -->`/`<!-- safety:end -->`; replace the sections "Code coverage", "What follows a change", "Capability assessment", "MCP recommendations", "Solution context", "Optional shared skills", "Maintenance cost and rule consolidation" and "Periodic audits and findings" with the template's "Procedures: read before the task" table, and carry the template's two lines that stay in AGENTS: the safeguard rule in the safety block and the session-start inspection of `.harness.json`. Add the moved guides to `maintenance.inputs`. A `<!-- project -->` line in a moved section stays in AGENTS when it is a never or ask-first rule (inside the safety block) or a project fact; a project procedure step goes to `docs/agents/areas.md` with a row in the table. Never drop a line: `check:rules` fails on an ask-first rule that only a procedure holds. The push guard is optional: copy `guard.mjs` and `check-harness.mjs`, add the copied mapping and the `guard:install` script, and install it as "Write the files" says (Push guard); carry the AGENTS guard line. Then carry the two new BACKLOG-RULES bullets ("A bug fix starts with a failing test", "Independent review") into the adapted BACKLOG-RULES and the two pointer lines into AGENTS, "Checks before you finish"; copy `check-backlog.mjs` and `check-freshness.mjs`. Records already Verified or Closed on the default branch are not flagged; a record made done after the reconcile names its `Test:`/`No test:` (bugs) and `Review:`/`No review:` (P1). No record migration.

For 3.2.0, archive recaps are optional. Copy `core/tools/archive-recap.mjs` to `tools/`, add its copied mapping, and run `node tools/archive-recap.mjs` after archiving records; use `--check` in CI. The current `check-backlog.mjs` validates an adopted recap before excluding only its derived block from history protection. Keep every original archived record line. Non-adopters need no archive edits. Add `archive:recap` and `check:archive-recap` scripts when adopting. Reconcile the closure-index paragraph in BACKLOG-RULES.

For 2.2.1, copy adopted MCP/solution helpers and the merge helper, reconcile their guidance and Angular version-aware conventions, and review the audit corrections. No existing backlog schema migration is required. Previously accepted misspelled/duplicate command flags now fail explicitly.

For 2.2.0, the optional shared skill stays in the template; copy the skills guide and reconcile relevant session guidance if adopted. No personal installation or new consumer repository is required.

For 2.1.0, the new MCP/solution helpers and guidance are optional additions. Reconcile generic session/ownership guidance and copy the files you adopt, preserving project settings. No existing active-record migration is required; a real coordinator/component adopts the profile only in its own authorized change.

For 2.0.0, migrate every active record before running the new validator: keep the stable ID heading, move its title above the signal table, add remaining-effort and completion estimates with rationale, add all three recap rows even for agent-owned records, and move the full next action into the existing closed details. Preserve every action, date and evidence link; archives keep their old layout. This migration does not verify product work.


- **update**: a copied file the project never changed; copy it from the template's latest release.
- **CONFLICT**: a copied file changed in both places. Merge by hand: generic changes go back into the template (a new release), project settings move into `.harness.json`, then copy the merged file.
- **differs**: a copied file changed only here. Same as a conflict: upstream it, move the setting into `.harness.json`, or make it a fork ("Project overrides").
- **forked**: a forked file whose template source changed since its `base`. Run `node tools/check-harness.mjs --merge`; resolve any conflict markers, then set `base` to the latest release.
- **reconcile by hand**: an adapted file whose template source changed. Read the template diff the warning prints and carry over what applies, keeping project content and every line marked `<!-- project -->`. A line in a template section that differs from the template and has no mark is either a lost template update or an unmarked project line: ask if it is not clear which, then mark it or restore the template's.
- Then set `version` in `.harness.json` to the latest release, run the checks, and say in the PR which release it reconciles and what was skipped and why.
- Record the reconcile in the project's own backlog (Other changes, or the record of the work it carries). The template's record for that release closed on its tag; it does not wait for this project (BACKLOG-RULES, "One repository, one backlog").

### 5.0.0: formatter, linter and reconciliation cadence

5.0.0 is a major release because a project without a formatter check and a linter in CI stops passing. Copy `tools/check-tooling.mjs`, add the `check:tooling` script and CI step, then follow "Lint and format config" above: adopt Prettier and ESLint (or map existing scripts in `tooling`), reformat in one mechanical PR, fix lint findings in a second. All copied tools were reformatted in this release, so every copied tool changes; a forked tool merges as usual.

The session-start rule and BACKLOG-RULES now fold reconciliation into the next working PR. `check:freshness` prints the backlog as a note until it is 10 merged PRs or one day behind, then as a warning; set `freshness.backlogPRs` / `freshness.backlogDays` to change the limits (1 and 0 restore the previous behaviour). Reconcile the two rule sentences in the project's AGENTS.md and BACKLOG-RULES by hand.

### 5.1.0: review scope and reviewer models

Copy `.claude/agents/mechanical-reviewer.md` and `.claude/agents/design-reviewer.md` (add them to `copied`; keep `.claude/agents/` versioned). Reconcile the "Independent review" paragraph of BACKLOG-RULES by hand. A project that already has reviewer agents keeps them and adds a `model:` line matching the rule. The 5.1.0 reconcile itself still needs a reviewer, because the BACKLOG-RULES paragraph is adapted by hand; later copy-only reconciles can use the exemption, citing `node tools/check-harness.mjs --strict`.

### 5.1.1: node_modules symlink

In the project's `.gitignore`, change `node_modules/` to `node_modules` so a worktree's `node_modules` symlink is ignored. If one was already committed, `git rm --cached node_modules`.

### 5.2.0: evaluation dependencies

Optional. A project that pins an evaluation dependency shipping test content (for example a test-pack release) adds `evaluations` to `.harness.json` with a project-owned `pending` command (an array: command and arguments) that exits 0 when every consumed case has a covering run and 1 listing the pending cases. Reconcile the new "Evaluation dependencies" paragraph of BACKLOG-RULES and the session-start bullet of AGENTS by hand, and copy `tools/check-freshness.mjs`. A project without the setting changes nothing else. If the project wants CI to fail on pending cases, it runs the same command in CI as its own step and keeps an open record naming them. `check:freshness` also runs in CI, where the command's inputs may be missing: it only warns there.

### 5.3.0: effort totals, estimate calibration, queue order

(5.4.0 later reorders the steps table to Step, Baseline, Actual, Remaining, Status; a project moving straight to 5.4.0 applies both steps.)

Copy `tools/work-items.mjs` and `tools/check-freshness.mjs`; reconcile the "Optional upfront feature plans" and "Estimate calibration" paragraphs of BACKLOG-RULES by hand. With `workItems.featurePlans`, give each open step `effort.days` (remaining) and `effort.baselineDays` (its current dated estimate, stated as a backfill in the basis): `work-items check` lists open steps still without `days`, and the totals count them as unknown. Add `<!-- totals:start -->` / `<!-- totals:end -->` to the first layout segment for the backlog total. For queue order, set `workItems.order: "queue"`: it needs the work queue adopted and Node 22.12 or newer, and a record the queue rejects (priority, effort or human cue) then fails `work-items build` and `check` with the queue's message; `id` stays the default for existing projects, new adoptions start with `queue`. The steps table is now compact (step, remaining, baseline, status) and the dated basis of each estimate moves into the record details: rebuild with `work-items build`, then run the queue, dependency and roadmap generators. The estimate-drift reminder is on with featurePlans; set `workItems.estimation` to tune it or `false` to turn it off. Closed steps from before 5.3.0 have no actual effort and are not samples. No field is required: after copying the tools, run `work-items build` once (the steps tables change) and commit the result, or `check:work` fails.

### 5.4.0: actual effort column

Copy `tools/work-items.mjs`; reconcile the one added sentence of the "Estimate calibration" paragraph of BACKLOG-RULES by hand; run `work-items build` and the queue, dependency and roadmap generators. Open steps may now record effort so far in `effort.actualDays`; nothing is required.

### 5.5.0: dependencies in each record, pages retired

Copy `tools/work-items.mjs`, `tools/backlog-queue.mjs` and `tools/backlog-dependencies.mjs`; reconcile the "Linked prerequisites" and "Optional work queue" paragraphs of BACKLOG-RULES by hand. Delete `docs/agents/backlog-queue.md` and `docs/agents/backlog-dependencies.md` and every link to them (both checks now fail while a page is left), remove the `backlog:queue` and `backlog:dependencies` package scripts (`check:queue` and `check:dependencies` stay), make the CI steps conditional on the tools instead of the pages, update impact rows that regenerated the pages, then run `work-items build`: records with prerequisites or dependents gain a `Depends on · Unlocks` line under their summary table. Only projects with source-owned records get that line, and their `work-items build` and `check` now fail on an invalid dependency graph; a project with a hand-edited ledger keeps its authored Depends on rows and no longer sees Unlocks. Both checks also fail while `docs/BACKLOG.md` still links a retired page.

### 5.6.0: agent hours

Copy `tools/work-items.mjs`; reconcile the "Optional upfront feature plans" and "Estimate calibration" paragraphs of BACKLOG-RULES by hand; rebuild. Re-estimate open steps in agent hours (`agentHours`, `ownerHours`, `baselineAgentHours`), saying in each basis how the figure was reached; keep their `baselineDays` as history. Record `actualAgentHours` with `actualSource` on every step closed from now on. Steps still in days stay valid and are totalled apart. Set `workItems.estimation.since` to the re-estimation day, so closed day-era steps no longer count as calibration samples (`calibrate` reports units apart in `byUnit`).

### 6.0.0: one priority-ordered list, a fuller summary table

Major: `check:work` fails until the ledger is rebuilt and, with feature plans, every bug has a step.

Copy `tools/work-items.mjs`, `tools/check-backlog.mjs`, `tools/backlog-queue.mjs` and `tools/solution.mjs` (the ones the project has); reconcile the "Record and evidence requirements" and "Optional work queue" paragraphs of BACKLOG-RULES by hand. To list bugs and features as one list in queue (priority) order, replace the `{"records": "B"}` and `{"records": "F"}` layout segments with one `{"records": "all"}` and merge their headings into one (the template ledger says `## Work items`); keeping two groups stays valid. With `workItems.featurePlans`, every active record now needs a task plan, bugs included: give each record without steps an `<ID>-T01` task (its remaining work in `agentHours`, a dated basis); `work-items build` fails while one is missing. Then run `work-items build`: with source-owned records each summary table gains Remaining (open task steps, — without steps), Depends on and Unlocks (when `backlog-dependencies.mjs` is present, replacing the 5.5.0 line under the table) and Human action (`🧑 Yes` / `💻 No`), and the human-action line keeps only its icon and sentence. Record sources keep the authored form; archives and hand-edited ledgers stay valid. The checks read both forms.

### 6.3.0: every branch in its own worktree

Copy `docs/agents/parallel-work.md`. Reconcile the "On its own" line of the AGENTS safety block by hand: "branch from `main` in a separate `git worktree`", the primary checkout staying on `main` with no edits of its own, worktrees in a sibling directory or under `.claude/worktrees/`, and "delete merged branches and their worktrees". When something relies on the primary checkout (a service it runs, another session), add a project line naming it, ending with `<!-- project -->`. The changed AGENTS line is a maintenance input: re-record the maintenance review afterwards, and rerun the agent-behaviour checks where a runner is configured.

### 7.0.0: effort from remaining agent hours, Status with its colour

Major: `check-backlog` refuses the 6.x generated summary until the ledger is rebuilt.

Copy `tools/work-items.mjs`, `tools/check-backlog.mjs`, `tools/backlog-queue.mjs` and `tools/solution.mjs` (the ones the project has). Reconcile by hand the "Record and evidence requirements", Effort, "Optional upfront feature plans" and "Estimate calibration" paragraphs of BACKLOG-RULES, and the effort legend of the ledger layout (sizes in hours: 🟢 ≤1 h · 🟡 ≤4 h · 🔴 ≤8 h · 🟣 more). Then run `work-items build` and the views that follow it. For steps re-estimated since their baseline, set `effort.estimateAgentHours` to the latest whole-step estimate (for a planned step, its `agentHours`) so the Estimate column shows it; without it the column shows the baseline, and `work-items check` warns when actual plus remaining exceed it. A project tool that finds the generated summary row by its first cell now reads `🔴 Open` there.

### 7.1.0: a human action links its procedure

Reconcile the human-action paragraph of BACKLOG-RULES ("Record and evidence requirements") by hand. Then review the project's active 🧑 lines: each that asks the owner to do something gets one link to a page holding the steps, and its Reproduce row links the same; record what is left in the project's own backlog. The changed paragraph is a maintenance input: re-record the maintenance review.

### 8.0.0: the human-action cue names its kind

Major: `check-backlog` refuses `Human action required: Yes` in an active record, and the generated summary table replaces its Human action cell with Procedures and Decision.

Copy `tools/work-items.mjs`, `tools/check-backlog.mjs`, `tools/backlog-queue.mjs`, `tools/solution.mjs`, `tools/task-claims.mjs` and `tools/behaviour.mjs` (the ones the project has). Reconcile by hand step 5 of the update procedure and the human-action paragraph of BACKLOG-RULES ("Record and evidence requirements"), and the legend sentence of the ledger layout. Then rewrite each active `🧑 **→ Human action required: Yes**` as `Procedure` (someone runs, tries or checks something: the line links its copy-paste page), `Decision` (a choice: the line links its options) or `Both`; archived records keep `Yes`. Rebuild the ledger (`work-items build`). A project tool that reads the cue or the Human action cell (a recap, a dashboard) reads the kind instead. The changed paragraphs are maintenance inputs: re-record the maintenance review.

### 8.1.0: fewer conflicts between parallel PRs

Optional. Merge `core/gitattributes.txt` into `.gitattributes`. Copy `tools/work-items.mjs`. To generate the header: start the reconciliation log's next entry as `## <date> — main `<sha>`` plus one paragraph (at most 300 characters), replace the authored "Current work ledger, reviewed …" line in the layout with a segment `{"header": "docs/archive"}`, rebuild. To keep step evidence out of the record source: set `workItems.repository` (`owner/name`), record each step's PRs in its task file (`prs`, `review`) from now on, and write `Next: from tasks.` as the sentence of a 💻 record whose next action is its next open step. Reconcile the "When to update and review" header bullet and the feature-plan paragraph of BACKLOG-RULES by hand. The changed paragraphs are maintenance inputs: re-record the maintenance review.

## Changing the harness from a project

A request made in a project can touch the harness. Before editing a harness file there, find it in the project's `.harness.json` and decide where the change belongs. The edit is the trigger, not the request's words: an "allow X" that changes how work is done is a rule. The project's AGENTS says the same ("Changing a harness file") and `check:freshness` lists the harness files a branch changes.

| The change is | Where it goes |
|---|---|
| A project setting (framework-free folders, CI workflow name, log notes) | The project's `.harness.json`. No release. |
| Project content in an adapted file (its conventions, area notes, look, design) | The project. No release. |
| A change to a copied file (`tools/check-*.mjs`, `ci-status.mjs`) that every project would want | The template first; never the project's copy. |
| A rule that would hold for every project, or every project on a stack | The template first, then the project. |
| A harness rule or tool behaviour changed for this project only | A project override (below). No release. |

**When it is not clear whether a change is general, ask the user before editing**, and say which release it would make. Never decide silently: a generic rule written into one project is found only when another project needs it.

Template first means, in order:

1. Tell the user the change is a harness change and which release it makes (CHANGELOG preamble: patch, minor or major).
2. Pull the template (step 0), branch, make the change as its [AGENTS.md](AGENTS.md) says, and record it in its backlog.
3. Verify a copied tool with the template repository’s self-contained fixtures and contract checks. A completed consumer trial may be recorded as evidence, but changing or reconciling that project is its own backlog item and never a template release gate.
4. Release: CHANGELOG entry, `VERSION`, copy `core/tools/` to `tools/`, `npm run check:template`, `npm run test:tools`, PR, merge when CI is green, tag `vX.Y.Z` on `main` and push the tag.
5. Reconcile the project with the release (above), then make the rest of the request on top of it. Its PR links the template PR.

If the release cannot land in the same session (the template PR awaits review), the project change waits, or ships without the generic part; the template's backlog record carries that part, and the project's backlog names it. The other projects see the release at their next session start.

## Project overrides

A project can change a harness rule or tool for itself and still receive every release. Prefer the first form that works:

1. **A setting.** If the behaviour can be a setting the tool reads from `.harness.json`, add the setting in the template (a release, as above) and set it in the project. Nothing diverges.
1b. **A project line in a template section.** A line a project adds inside a section that comes from the template (a required check next to "Open every PR against `main`") is not an override: it adds, it does not replace. End it with `<!-- project -->` so a reconcile keeps it and the next reader knows it is not template text.
2. **A rule in an adapted file.** Change the rule where the project's file states it and mark the change on its own line, so a reconcile keeps it:

   `> Project override (harness rule: <which rule>): <what this project does instead>, because <why>.`

   `check-harness` counts the markers in an adapted file whose template source changed ("reconcile by hand, keeping its N project override(s)"). When the template changes the rule an override replaces, decide whether the override still holds and update its reason.
3. **A copied tool, forked.** Move the file from `copied` to `forked` in `.harness.json`, with the template source, the release it was forked from and the reason, then edit it:

   ```json
   "forked": { "tools/check-freshness.mjs": { "from": "core/tools/check-freshness.mjs", "base": "1.3.0", "why": "audits every 14 days" } }
   ```

   At every session start `check-harness` compares the template's file at `base` with the latest release. If the template changed it, it reports whether a three-way merge with the project's file is clean or conflicts; `node tools/check-harness.mjs --merge` writes the merge and moves `base` of the clean ones forward. Resolve conflict markers by hand, then set `base` to the latest release. A fork that becomes identical to the template moves back to `copied`.

Record each override in the project's backlog or AGENTS when it is made, with its reason. An override that turns out to fit every project goes back into the template (above) and is removed here.

## Adopting required maintenance enforcement (3.0.0)

Copy maintenance/friction helpers and shared guide/workflow; merge check:maintenance and the PR CI check. Configure maintenance.inputs to the project’s actual governing files (adapted paths included), reviewDays and requireMeasurement; enable the gate. Start timing before reconciliation work, finish with observed counters, review the proposed changes, and record tested rule/tool/skill outcomes or owned backlog/no-change reasons. Generate the committed receipt with the reviewed outcome array and run check:maintenance. Retain all applicable starting rules. The daily read-only workflow checks between sessions, not an autonomous repair daemon. No API keys or new service is required. Coverage enforcement is a separate opt-in policy, with risk-based acceptance rather than universal percentage growth.

## Scope-aware audit adoption (3.1)

Copy check-audits and the shared audit guide; add check:audits plus CI/daily checks. Reconcile audit indexes and AGENTS to use per-area coverage, not the newest filename. Future audits write dated Markdown reports and manifests; reuse old evidence explicitly but do not rewrite published reports or invent a full scope for them. Due areas warn initially; opt into audit.enforce only after actual baseline coverage is established. The mandatory maintenance gate remains distinct.

## Updating GitHub Actions pins

When adding or updating a workflow action, resolve its release tag in the action's official repository and pin the full 40-character commit SHA, keeping the release tag in a comment beside it. Verify the tag-to-commit mapping from the official source before release, and update the SHA and comment together. This is a manual review; the harness does not claim to detect stale pins. Keep workflow permissions explicit and least-privileged, and review any change to fork-triggered workflows or secret access.
