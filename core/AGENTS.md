<!-- harness: put the stack section here (angular/AGENTS.angular.md for Angular projects), then the sections below. Delete a section that has nothing true to say; keep the file under ~200 lines and move detail to docs/agents/areas.md. -->

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

### Checks before you finish

<!-- harness: branch protection and required checks if any; the exact commands, first the session-start freshness check. -->
Open every PR against `main`, never on another PR's branch (merging it would not reach `main`). Once a PR's CI is green the owner may merge it at any moment: push no new work to it, open a new PR. Exception: a green PR that conflicts with `main` cannot merge, so it may get a push that only resolves the conflict; its checks run again before it can merge. A conflict in `docs/BACKLOG.md` is resolved record by record with `node tools/merge-backlog.mjs`, never by keeping one side's record (that silently drops the other side's edits).

<!-- safety:start -->
**What the agent does on its own, and what it asks first.** These rules load with this file in every session; the procedures below are read when they apply, never in place of these rules.
- On its own: branch from `main`, commit, push its branches, open PRs against `main` (then name the PR by its number in the records it touches, and push that before the checks finish), resolve conflicts on its own PRs, merge its own PR once every check on it has passed and GitHub can merge it (`node tools/merge-when-green.mjs <PR>…` waits for that and stops on any failing check or conflict), delete merged branches, reconcile and close backlog records.
- Asks first: material changes to an adopted upfront feature plan (BACKLOG-RULES, "Optional upfront feature plans"); a decision or check a record marks 🧑; repository settings (branch protection, required checks, secrets) and dismissing a code-scanning alert; rewriting published history or force-pushing; deleting what it did not create; a harness change it cannot place as project or template ("Changing a harness file").
- Never: merge with a failing or pending check, or bypass the branch protection. A project narrows this list with a project line.
- Optional push guard: `node tools/guard.mjs install` makes git refuse a push to `main`, a force-push and an archive rewrite, citing these rules (APPLY.md, "Push guard"; a Claude Code adapter does the same before the command runs). A refused operation the owner approves runs once with `HARNESS_GUARD_ALLOW=<rule>`; never set it without that approval.
- Never remove a safeguard (an ownership, evidence, privacy or safety rule) because it is old or rarely triggered, and never rewrite governing rules unattended: consolidating rules keeps every requirement ([maintenance guidance](docs/agents/maintenance.md)).
<!-- safety:end -->

```bash
npm run check:freshness   # first, at session start: backlog behind main, merged branches, audit age
{{LINT}}
{{TEST}}
{{BUILD}}
{{TYPECHECK}}
npm run check:backlog     # active record layout and lifecycle cues
npm run check:conventions # stack conventions above and unused exports (when the stack has one)
npm run format:check      # formatter; `npm run format` fixes it
npm run check:tooling     # a formatter check and a linter exist and run in CI (required for every stack)
```

- Every project formats and lints its source, in CI too: `check:tooling` fails without both. A project with no source code records `tooling.exempt` with its reason in `.harness.json`.

- With scoped verification explicitly enabled, follow [verification selection](docs/agents/verification.md): applicable fast checks and affected regressions by default; full deterministic checks on request, risk or freshness limits. Without adoption, the checks above remain required.
- A failing test is evidence until shown otherwise: check it against the intended behaviour. Change its expectation only when the requirement deliberately changed, and say which requirement; otherwise fix the code.
- Do not leave dead code behind when replacing a feature: its state, helpers and tests go too.
- A bug fix starts with a committed test that fails without the fix; the fix never edits that test to pass (BACKLOG-RULES, "A bug fix starts with a failing test").
- A PR that closes a P1 record or changes a harness file gets a review in a fresh context before it merges; the reviewer reports, never approves or merges (BACKLOG-RULES, "Independent review").

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
| switch independent tasks or compact/handoff context | [Task context](docs/agents/task-context.md) |
| work on claimed tasks, parallel branches or model assignments | [Parallel work](docs/agents/parallel-work.md) |
| reassess architecture, decisions or alternatives | [Architecture reassessment](docs/agents/architecture-review.md) |
| change tests, coverage settings or the coverage page | [coverage guide](docs/agents/coverage-guide.md) |
| change something another output is derived from (generated pages and data, recordings, translations, guides, a value used in two places) | [change impact](docs/agents/change-impact.md); `check:freshness` lists the rows a branch sets off: do each in the same PR, or record in the backlog why not |
| set up the project or change its stack or workflow (capability assessment) | [MCP guidance](docs/agents/mcp.md), "In short" |
| add, configure or rely on an MCP connection | [MCP guidance](docs/agents/mcp.md) |
| work across repositories of a solution | [solution profile](docs/agents/solution-profile.md) |
| add or use a shared skill | [skill guidance](docs/agents/skills.md) |
| adopt or reconcile the harness, review maintenance evidence or consolidate rules (`node tools/maintenance.mjs check` runs at session start and in CI) | [maintenance guidance](docs/agents/maintenance.md) |
| change AGENTS.md, CLAUDE.md or BACKLOG-RULES (rerun the agent-behaviour checks when a runner is configured) | [maintenance guidance](docs/agents/maintenance.md), "Agent-behaviour checks" |
| run an audit (`check:freshness` says when) | [audit procedure](docs/agents/audit.md) |
| update or close a backlog record | [backlog rules](docs/BACKLOG-RULES.md) |

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

### Task context

At a new independent task, follow [task context and handoffs](docs/agents/task-context.md): persist the current scope and use a fresh thread through an available authorized host capability; keep the same task's debugging/review/CI together. Compaction is for a continuing task, and provider caching is a separate capability. Preserve work, claims, approvals, uncertain effects and all governing/privacy/permission limits across transitions. If thread/compaction tools are unavailable, report that limit briefly and continue with bounded relevant context rather than claiming a reset or blocking otherwise authorized work.

## Work tracking

- Keep single responsibility and dependency inversion across repository boundaries: reusable masters define contracts; derived projects supply their adapters/configuration. A master never depends on derived implementation, deployment or adoption for its release or acceptance. Each backlog owns only its repository’s work; reject foreign next actions and closure conditions (BACKLOG-RULES, Ownership rejection and dependency direction).

**At the start of every session, before other work, run `npm run check:freshness`**, inspect `.harness.json` for selected integrations and solution context ([MCP guidance](docs/agents/mcp.md), [solution profile](docs/agents/solution-profile.md)), and do what the check lists, in the session's first PR:
- the backlog is behind `main`: read the CI of the PRs merged since (`npm run ci:status -- <numbers>`) and review any commit it lists without a PR, update or close their records, archive closed ones, move the header to the current `main`. Do this inside the session's working PR. A PR whose only purpose is reconciliation is opened only when the check marks it due (`!`): 10 merged PRs or one day behind by default (`freshness.backlogPRs`, `freshness.backlogDays`), or when the session has no other PR;
- merged branches are still on GitHub: delete them (and their local branches and worktrees);
- the scope-aware audit checker reports missing/stale/blocked areas (7 days by default): audit what changed since (docs, tests, style guide, accessibility, privacy, and what the outputs rely on outside the repository: dependency upgrades, the CI browser and machine, external services and data) and write `docs/audits/<date>.md`;
- the harness template has a newer release (`.harness.json` names the one this project is on), or its clone is missing, behind or unreachable: pull it first (`git -C ~/Projects/project-harness pull --ff-only --tags`), reconcile as its `APPLY.md` ("Reconciling") says, then move `version` forward. A copied tool under `tools/` is never edited here unless it is listed under `forked` in `.harness.json`; its settings are there too.

CI prints ordinary freshness findings as warnings; the required maintenance evidence check can fail in 3.0. `ci:status` needs a logged-in `gh`; if unavailable, inspect the same runs/jobs through an authenticated connector/API and name that evidence source. If neither is available, record the missing evidence; never claim the CLI ran.

- [docs/BACKLOG.md](docs/BACKLOG.md) is the current status ledger (with authoritative per-record sources when `workItems.enabled`; see [parallel work](docs/agents/parallel-work.md)); [docs/BACKLOG-RULES.md](docs/BACKLOG-RULES.md) is the procedure (statuses, human-action cues, record layout, CI reconciliation, closure and archives, documentation ownership and the consistency check every PR records). Update the affected records in the same PR as the change, and run `npm run check:backlog`.
- Keep a confirmed bug, a candidate fix awaiting review, an unimplemented feature and a completed check distinct. A merge is not verification, and a passing unit test is not a verified visual, pointer or device fix. A green CI run establishes the checks it named, not the absence of bugs. Archives (`docs/archive/`) and audits (`docs/audits/`) are dated evidence, not current status; current audit coverage is reported per area by check:audits; a scoped report never resets the full-audit baseline.
- A change to a harness file follows "Changing a harness file" above: this project only, every project (the template first), or ask.
- A plan or promise given to the user (steps, a table to build, a later fix) becomes backlog records in the same change, and the reply names them. Nothing promised lives only in the conversation.

### Development usage (optional)

When `.harness.json` enables `workUsage.enabled`, follow [job usage](docs/agents/work-usage.md) at each job start, phase change and completion. Record actual client/model and backlog/task identity, import authorized metadata counters when exposed, and retain unknown coverage otherwise. Keep token metadata private and separate from prompts, credentials and conversation text. A model/client assignment need not be declared by the owner before launch unless task suitability requires it; instruction loading and measured usage availability still require verification.
