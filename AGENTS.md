## Project conventions (Project harness)

This repository is the **project harness**: a versioned template of agent instructions, backlog procedure, style guide and checks that other projects apply and then follow. The repository is `voidbrain/project-harness`; its releases are tags `vX.Y.Z` with the same number in `VERSION` and an entry in [CHANGELOG.md](CHANGELOG.md). It follows its own harness: everything it prescribes to a project applies here too.

### Architecture

- `core/`, `angular/` and `solution/` are **template files**: what projects receive. They hold `{{PLACEHOLDERS}}` and `<!-- harness: … -->` notes on purpose, and their links are relative to an applied project, not to this repository.
- The shared `skills/` entry point delegates to APPLY and does not own procedure. Other files at the root (this file, `README.md`, `APPLY.md`, `CHANGELOG.md`, `docs/`, `tools/`, `.harness.json`) is **this repository's own harness**. It holds no placeholders.
- `tools/check-backlog.mjs`, `check-freshness.mjs`, `check-harness.mjs` and `ci-status.mjs` are copies of `core/tools/`, as in any project; `check-template.mjs` and `test-tools.mjs` are this repository's own checks. Change a copied tool in `core/tools/` and copy it to `tools/`; `check:template` fails if they differ.
- A copied tool never carries a project setting: settings live in `.harness.json` and the tool reads them. A change that makes a project edit a copied file is a design defect here.
- Releases are versioned as the CHANGELOG says: major when projects must change their own files to keep passing, minor for new optional files, checks or rules, patch for wording and fixes.

### Style guide

- Read [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) before writing template text or docs.

### Adding things

- **A rule for every project**: in the `core/` file that owns it (AGENTS template, BACKLOG-RULES, STYLE-GUIDE), the same rule in this repository's own copy when it applies here, a CHANGELOG line, and a step in [APPLY.md](APPLY.md) if applying or reconciling changes.
- **A check**: the script in `core/tools/` (copied) reading its settings from `.harness.json`, the setting in `core/.harness.json` or the stack fragment, the file in `copied`, the npm script in `angular/package-scripts.json`, the CI step in `angular/.github/workflows/ci.yml`, a row in the README table.
- **A change asked from a project**: decide where it belongs and release before the project reconciles, as [APPLY.md](APPLY.md) ("Changing the harness from a project") says.
- **A stack add-on**: a folder like `angular/` with its AGENTS section, tools, config and a `.harness.fragment.json`; a step in APPLY.md, "Choose the stack add-ons".

### Checks before you finish

Open every change as a PR against `main`, never on another PR's branch. Once a PR's CI is green the owner may merge it at any moment: push no new work to it, open a new PR. Exception: a green PR that conflicts with `main` may get a push that only resolves the conflict; its checks run again before it can merge. A conflict in `docs/BACKLOG.md` is resolved record by record with `node tools/merge-backlog.mjs`; adopted work-item sources resolve both source records and regenerate the view under [parallel work](docs/agents/parallel-work.md).

<!-- safety:start -->
**What the agent does on its own, and what it asks first** (the same rule as `core/AGENTS.md`; it loads in every session, procedures only when they apply). On its own: branch from `main` in a separate `git worktree` (every task; the primary checkout stays on `main` with no edits of its own), commit, push its branches, open PRs against `main` (then name the PR by its number in the records, and push that at once), merge its own PR once every check has passed and GitHub can merge it (`node tools/merge-when-green.mjs <PR>`), tag the release on `main` after that merge as "Releasing" says, delete merged branches and their worktrees, reconcile and close records. Asks first: material changes to an adopted upfront feature plan (BACKLOG-RULES, "Optional upfront feature plans"); a decision a record marks 🧑, repository settings and code-scanning dismissals, rewriting published history or moving a published tag, deleting what it did not create. Never: merge with a failing or pending check.

Optional push guard: `node tools/guard.mjs install` makes git refuse a push to `main`, a force-push and an archive rewrite, citing these rules (APPLY.md, "Push guard"; a Claude Code adapter does the same before the command runs). A refused operation the owner approves runs once with `HARNESS_GUARD_ALLOW=<rule>`; never set it without that approval.

Never remove a safeguard (an ownership, evidence, privacy or safety rule) because it is old or rarely triggered, and never rewrite governing rules unattended: consolidating rules keeps every requirement ([rule review](docs/agents/rule-review.md), "Periodic rule consolidation").
<!-- safety:end -->

```bash
npm run check:freshness   # first, at session start: online latest, backlog behind main, merged branches, audit age
npm run check:template    # VERSION, CHANGELOG, stamps, copied tools, syntax, links
npm run test:tools        # the copied tools against throwaway git repositories (fixtures)
npm run check:backlog     # active record layout and lifecycle cues
npm run format:check      # Prettier; `npm run format` fixes it
npm run lint              # ESLint with the config projects receive (core/eslint.config.mjs)
npm run check:tooling     # both of the above exist and run in CI
```

- With scoped verification explicitly enabled, follow [verification selection](docs/agents/verification.md): applicable fast checks and affected regressions by default; full deterministic checks on request, risk or freshness limits. Without adoption, the checks above remain required.
- A change to a copied tool is verified with this repository’s self-contained regression fixtures and contract checks. A completed real-consumer trial may provide additional evidence, but a release never waits for consumer changes or adoption.
- Do not leave dead template text behind: a removed rule goes from every file that mentions it.
- A bug fix starts with a committed test that fails without the fix; the fix never edits that test to pass (BACKLOG-RULES, "A bug fix starts with a failing test").
- A PR that closes a P1 record or changes a template or harness file gets a review in a fresh context before it merges, with the exemptions listed there; the reviewer reports, never approves or merges (BACKLOG-RULES, "Independent review").

### Releasing

1. **Online first**: `git pull --ff-only --tags` in the primary checkout on `main`, clean tree, then `git worktree add ../project-harness-<task> -b <branch> main` and work there.
2. Change, add the CHANGELOG entry, set `VERSION` and this repository's `.harness.json` `version` to the new release, copy `core/tools/` to `tools/`, record the change in the backlog.
3. `npm run check:template`, `npm run test:tools` and `npm run check:backlog`; PR; CI green.
4. After merge, in the primary checkout (still on `main`): `git pull --ff-only`, `git tag -a vX.Y.Z -m "…"`, `git push origin vX.Y.Z`. A release exists only once its tag is on GitHub, and its backlog record closes then. Projects pick it up at their next session start and record their reconcile in their own backlogs ([BACKLOG-RULES](docs/BACKLOG-RULES.md), "One repository, one backlog").

### Procedures: read before the task

All applicable rules must be known and followed from the start; shorter indexes never defer requirements. The [procedure discovery index](docs/agents/procedures.md) links authorities and expected evidence. Each procedure is binding when its trigger applies: read it before starting that task. `npm run check:rules` fails when a never or ask-first rule lives only in a procedure.

| Before you | Read |
|---|---|
| switch independent tasks or compact/handoff context | [Task context](docs/agents/task-context.md) |
| work on claimed tasks, parallel branches or model assignments | [Parallel work](docs/agents/parallel-work.md) |
| claim, renew or release a task | [shared claims](docs/agents/claims.md) |
| reassess architecture, decisions or alternatives | [Architecture reassessment](docs/agents/architecture-review.md) |
| apply, reconcile or release the harness, or take a change asked from a project | [APPLY.md](APPLY.md) |
| change template content, tools or procedure | its section in [area notes](docs/agents/areas.md) |
| set up a project or change its stack or workflow (capability assessment) | [MCP guidance](docs/agents/mcp.md), "In short" |
| add, configure or rely on an MCP connection | [MCP guidance](docs/agents/mcp.md) |
| work across repositories of a solution | [solution profile](docs/agents/solution-profile.md) |
| add or use a shared skill | [skill guidance](docs/agents/skills.md) |
| reconcile or review maintenance evidence (`node tools/maintenance.mjs check` runs at session start and in CI) | [maintenance guidance](docs/agents/maintenance.md) |
| change `core/AGENTS.md`, `core/CLAUDE.md`, `core/docs/BACKLOG-RULES.md` or `core/docs/backlog/` (rerun the agent-behaviour checks; the impact map lists it) | [rule review](docs/agents/rule-review.md), "Agent-behaviour checks" |
| measure friction or consolidate rules | [rule review](docs/agents/rule-review.md) |
| run an audit (`check:freshness` says when) | [audit procedure](docs/agents/audit.md) |
| change something another output is derived from | [change impact](docs/agents/change-impact.md) and the [impact map](docs/agents/impact-map.md) |
| update or close a backlog record | [backlog rules](docs/BACKLOG-RULES.md): its table names the one file the change needs |

## Area notes

Before changing an area, read its section in [docs/agents/areas.md](docs/agents/areas.md).

| Area | Covers |
|---|---|
| Template content | `core/`, `angular/`: the files projects receive |
| Tools | the copied checks and their settings in `.harness.json` |
| Procedure | `APPLY.md`, the skill, versioning and reconciling |

### Task context

At a new independent task, follow [task context and handoffs](docs/agents/task-context.md): persist the current scope and use a fresh thread through an available authorized host capability; keep the same task's debugging/review/CI together. Compaction is for a continuing task, and provider caching is a separate capability. Preserve work, claims, approvals, uncertain effects and all governing/privacy/permission limits across transitions. If thread/compaction tools are unavailable, report that limit briefly and continue with bounded relevant context rather than claiming a reset or blocking otherwise authorized work.

## Work tracking

- Keep single responsibility and dependency inversion across repository boundaries: reusable masters define contracts; derived projects supply their adapters/configuration. A master never depends on derived implementation, deployment or adoption for its release or acceptance. Each backlog owns only its repository’s work; reject foreign next actions and closure conditions (BACKLOG-RULES, Ownership rejection and dependency direction).

**At the start of every session, before other work, run `npm run check:freshness`**, inspect `.harness.json` for selected integrations and solution context ([MCP guidance](docs/agents/mcp.md), [solution profile](docs/agents/solution-profile.md)), and do what the check lists (in the session's first PR, except the backlog, which has its own rule below):
- the template clone is behind, ahead of or unreachable from GitHub: pull or push first; never change a stale clone;
- the backlog is behind `main`: read the CI of the PRs merged since (`npm run ci:status -- <numbers>`) and review any commit it lists without a PR, update or close their records, archive closed ones, move the header to the current `main`. Do this inside the session's working PR. A PR whose only purpose is reconciliation is opened only when the check marks it due (`!`): 10 merged PRs or one day behind by default (`freshness.backlogPRs`, `freshness.backlogDays`), a commit that reached `main` without a PR, or a session with no other PR;
- merged branches are still on GitHub: delete them (and their local branches and worktrees);
- the scope-aware audit checker reports missing/stale/blocked areas (7 days by default): audit what changed since (template text, tools, procedure, the projects that apply it, and what the outputs rely on outside the repository: dependency upgrades, external services) and write `docs/audits/<date>.md`.

- [docs/BACKLOG.md](docs/BACKLOG.md) is the current status ledger (with authoritative per-record sources when `workItems.enabled`; see [parallel work](docs/agents/parallel-work.md)); [docs/BACKLOG-RULES.md](docs/BACKLOG-RULES.md) is the procedure. Update the affected records in the same PR as the change, and run `npm run check:backlog`.
- Keep a confirmed bug, a candidate fix, an unimplemented feature and a completed check distinct. A merge is not a release: the tag is.

### Development usage (optional)

When `.harness.json` enables `workUsage.enabled`, follow [job usage](docs/agents/work-usage.md) at each job start, phase change and completion. Record actual client/model and backlog/task identity, import authorized metadata counters when exposed, and retain unknown coverage otherwise. Keep token metadata private and separate from prompts, credentials and conversation text. A model/client assignment need not be declared by the owner before launch unless task suitability requires it; instruction loading and measured usage availability still require verification.
