<!-- harness: stack rules go in their own procedure file (Angular: docs/agents/angular.md, a row "change Angular code" in the procedures table). Delete a section that has nothing true to say; keep the file under ~200 lines and move detail to docs/agents/areas.md. -->

## Project conventions ({{PROJECT_NAME}})

<!-- harness: one paragraph: what the product is, the repository, the build project name, where it is deployed and how (base href, output folder). -->
The project is **{{PROJECT_NAME}}**. The repository is `{{REPO}}`{{, the Angular project `NAME`}} and the site lives at `{{SITE_URL}}`.

### Architecture

<!-- harness: the layers and what may import what; where logic goes; the source of truth for data and how it is edited; units and coordinate conventions; anything that is easy to get wrong. Name the check that enforces each rule. -->
- `{{PURE_DIR}}` is plain TypeScript with no framework imports, so it stays unit-testable (enforced by {{CHECK}}). Put logic there and keep components thin.

### Style guide

- Before any UI change (templates, styles, user-facing text) read [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md). Follow its voice, tokens, type and spacing; use the `var(--…)` tokens, never a new literal colour.
- A new token or shared component updates the style guide in the same change.

### Adding things

<!-- harness: one bullet per recurring kind of addition (a page, an entity, a command, an asset): every file it touches, in order, and the test it needs. -->
- **{{A THING}}**: …

### Documentation

- Keep top-level docs (`README.md`, `docs/README.md`, `docs/INSTALL.md`, `docs/STYLE-GUIDE.md`, and general guides) concise (~150–200 lines max) and clearly structured as entry points.
- Move feature-specific, platform-specific, or deep technical details into dedicated topic files under `docs/<topic>/` (e.g. `docs/install/`, `docs/design/`, `docs/architecture/`) and link to them.
- Keep docs current and free of backlog IDs or "not yet shipped / planned" lists; document shipped behavior and point to `docs/ROADMAP.md` & [docs/BACKLOG.md](docs/BACKLOG.md) where needed.

### Checks before you finish

<!-- harness: branch protection and required checks if any; the exact commands, first the session-start freshness check. -->
Before you open, update or merge a PR, read [pull requests](docs/agents/pull-requests.md): PRs against `main`, when a green PR takes new work, conflicts, scoped verification and independent review.

<!-- safety:start -->
**What the agent does on its own, and what it asks first.** These rules load with this file in every session; the procedures below are read when they apply, never in place of these rules.
- On its own: branch from `main` in a separate `git worktree` (every task, single or parallel: the primary checkout stays on `main` with no edits of its own, because a running service, another session or the owner may rely on it; put worktrees in a sibling directory or under `.claude/worktrees/`; a project names what relies on its primary checkout with a project line), commit, push its branches, open PRs against `main` (then name the PR by its number in the records it touches, and push that before the checks finish), resolve conflicts on its own PRs, merge its own PR once every check on it has passed and GitHub can merge it (`node tools/merge-when-green.mjs <PR>…` waits for that and stops on any failing check or conflict), delete merged branches and their worktrees, reconcile and close backlog records.
- Asks first: material changes to an adopted upfront feature plan (BACKLOG-RULES, "Optional upfront feature plans"); a decision or check a record marks 🧑; repository settings (branch protection, required checks, secrets) and dismissing a code-scanning alert; rewriting published history or force-pushing; deleting what it did not create; a harness change it cannot place as project or template ("Changing a harness file").
- Never: merge with a failing or pending check, or bypass the branch protection. A project narrows this list with a project line.
- Optional push guard: `node tools/guard.mjs install` makes git refuse a push to `main`, a force-push and an archive rewrite, citing these rules (APPLY.md, "Push guard"; a Claude Code adapter does the same before the command runs). A refused operation the owner approves runs once with `HARNESS_GUARD_ALLOW=<rule>`; never set it without that approval.
- Never remove a safeguard (an ownership, evidence, privacy or safety rule) because it is old or rarely triggered, and never rewrite governing rules unattended: consolidating rules keeps every requirement ([rule review](docs/agents/rule-review.md), "Periodic rule consolidation").
<!-- safety:end -->

```bash
npm run check:freshness   # first, at session start: backlog behind main, merged branches, audit age
{{LINT}}
{{TEST}}
{{BUILD}}
{{TYPECHECK}}
npm run check:backlog     # active record layout and lifecycle cues
npm run check:conventions # stack conventions (docs/agents/<stack>.md) and unused exports (when the stack has one)
npm run format:check      # formatter (or the script `tooling.format` names); `npm run format` fixes it
npm run check:tooling     # a formatter check and a linter exist and run in CI (required for every stack)
npm run code:map -- <path> # exports with line ranges: read those lines, not the whole file
```

- Every project formats and lints its source, in CI too: `check:tooling` fails without both. A project with no source code records `tooling.exempt` with its reason in `.harness.json`.

- A failing test is evidence until shown otherwise: check it against the intended behaviour. Change its expectation only when the requirement deliberately changed, and say which requirement; otherwise fix the code.
- Do not leave dead code behind when replacing a feature: its state, helpers and tests go too.
- A bug fix starts with a committed test that fails without the fix; the fix never edits that test to pass (BACKLOG-RULES, "A bug fix starts with a failing test").

### Changing a harness file

Before editing a file listed in `.harness.json` (`copied`, `forked`, `adapted`, or `.harness.json` itself), decide whether the change holds for this project only or for every project. The edit is the trigger, whatever the request's words: an "allow X" that changes how work is done is a rule.
- **This project only**: its content or a setting stays here. A project line inside a section that comes from the template ends with `<!-- project -->`, so a reconcile keeps it; a changed harness rule is an override (APPLY.md, "Project overrides").
- **Every project**: the template first, then reconcile here (APPLY.md, "Changing the harness from a project").
- **Unsure**: ask the user before editing. Never decide silently.

`npm run check:freshness` lists the harness files a branch changes, locally and on every PR.

### Procedures: read before the task

All applicable rules must be known and followed from the start; shorter indexes never defer requirements. The [procedure discovery index](docs/agents/procedures.md) links authorities and expected evidence. Each procedure below is binding when its trigger applies: read it before starting that task. `npm run check:rules` fails when a never or ask-first rule lives only in a procedure.

| Before you | Read |
|---|---|
| start a session (`npm run check:freshness` lists what is due) | [session start](docs/agents/session-start.md) |
| open, update or merge a PR | [pull requests](docs/agents/pull-requests.md) |
| start, change the phase of or finish a job, when `workUsage.enabled` | [job usage](docs/agents/work-usage.md) |
| import usage counters or allowance snapshots, or save a usage report | [usage sources](docs/agents/work-usage-sources.md) |
| record an effectiveness observation | [effectiveness observations](docs/agents/work-usage-effectiveness.md) |
| switch independent tasks or compact/handoff context | [Task context](docs/agents/task-context.md) |
| work on claimed tasks, parallel branches or model assignments | [Parallel work](docs/agents/parallel-work.md) |
| claim, renew or release a task | [shared claims](docs/agents/claims.md) |
| reassess architecture, decisions or alternatives | [Architecture reassessment](docs/agents/architecture-review.md) |
| change tests, coverage settings or the coverage page | [coverage guide](docs/agents/coverage-guide.md) |
| change something another output is derived from (generated pages and data, recordings, translations, guides, a value used in two places) | [change impact](docs/agents/change-impact.md); `check:freshness` lists the rows a branch sets off: do each in the same PR, or record in the backlog why not |
| set up the project or change its stack or workflow (capability assessment) | [MCP guidance](docs/agents/mcp.md), "In short" |
| add, configure or rely on an MCP connection | [MCP guidance](docs/agents/mcp.md) |
| edit the project's MCP selections or run the MCP commands | [MCP selections and commands](docs/agents/mcp-commands.md) |
| work across repositories of a solution | [solution profile](docs/agents/solution-profile.md) |
| refresh or verify a solution dashboard, or adopt the profile in CI | [solution refresh](docs/agents/solution-refresh.md) |
| add or use a shared skill | [skill guidance](docs/agents/skills.md) |
| adopt or reconcile the harness or review maintenance evidence (`node tools/maintenance.mjs check` runs at session start and in CI) | [maintenance guidance](docs/agents/maintenance.md) |
| change AGENTS.md, CLAUDE.md, BACKLOG-RULES or `docs/backlog/` (rerun the agent-behaviour checks when a runner is configured) | [rule review](docs/agents/rule-review.md), "Agent-behaviour checks" |
| measure friction or consolidate rules | [rule review](docs/agents/rule-review.md) |
| run an audit (`check:freshness` says when) | [audit procedure](docs/agents/audit.md) |
| record audit findings or improvement proposals | [audit findings](docs/agents/audit-findings.md) |
| update or close a backlog record | [backlog rules](docs/BACKLOG-RULES.md): its table names the one file the change needs |

### Testing the joins

- A change that touches how two parts meet gets a test across both, not one per side. Unit tests on each part did not catch the bugs that reached users.

### Known pitfalls

<!-- harness: real traps with their cause, from the project's history and docs. Delete the section if there are none yet. -->
- …

## Area notes

Before changing an area, read its section in [docs/agents/areas.md](docs/agents/areas.md): the rules and lessons there are as binding as this file.

| Area | Covers |
|---|---|
| {{AREA}} | {{WHAT}} |

<!-- harness: if the project has subagents in .claude/agents/, list them here with the area each one owns. -->

## Privacy

<!-- harness: private data that must never enter the repository (keys, personal data, locations) and how tests avoid it. Delete if none. -->
- Never commit secrets, tokens or personal data. Test data is neutral and invented.

## Work tracking

- Keep single responsibility and dependency inversion across repository boundaries: reusable masters define contracts; derived projects supply their adapters/configuration. A master never depends on derived implementation, deployment or adoption for its release or acceptance. Each backlog owns only its repository’s work; reject foreign next actions and closure conditions (BACKLOG-RULES, Ownership rejection and dependency direction).

**At the start of every session, before other work, run `npm run check:freshness`** and do what it lists, as [session start](docs/agents/session-start.md) says for each finding.

- Keep a confirmed bug, a candidate fix awaiting review, an unimplemented feature and a completed check distinct. A merge is not verification, and a passing unit test is not a verified visual, pointer or device fix. A green CI run establishes the checks it named, not the absence of bugs. Archives (`docs/archive/`) and audits (`docs/audits/`) are dated evidence, not current status; current audit coverage is reported per area by check:audits; a scoped report never resets the full-audit baseline.
- A change to a harness file follows "Changing a harness file" above: this project only, every project (the template first), or ask.
- A plan or promise given to the user (steps, a table to build, a later fix) becomes backlog records in the same change, and the reply names them. Nothing promised lives only in the conversation.

