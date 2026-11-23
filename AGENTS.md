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

A rule for every project, a check, a stack add-on and a change asked from a project each touch several files in order: [adding things](docs/agents/adding-things.md).

### Checks before you finish

Before you open, update or merge a PR, read [pull requests](docs/agents/pull-requests.md): PRs against `main`, a green PR takes no new work, conflict-only pushes, `merge-backlog`.

<!-- safety:start -->
**What the agent does on its own, and what it asks first** (the same rule as `core/AGENTS.md`; it loads in every session, procedures only when they apply). On its own: branch from `main` in a separate `git worktree` (every task; the primary checkout stays on `main` with no edits of its own), commit, push its branches, open PRs against `main` (then name the PR by its number in the records, and push that at once), land its own PR through the landing queue once every check has passed and GitHub can merge it: one lander merges ready PRs one at a time, with at most two in CI ([parallel work](docs/agents/parallel-work.md), "Landing queue"; `node tools/merge-when-green.mjs <PR>`), tag and publish the release on `main` after that merge as "Releasing" says, delete merged branches and their worktrees, reconcile and close records. Asks first: material changes to an adopted upfront feature plan (BACKLOG-RULES, "Optional upfront feature plans"); a decision a record marks 🧑, repository settings and code-scanning dismissals, rewriting published history or moving a published tag, deleting what it did not create. Never: merge with a failing or pending check.

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

- Scoped verification, when enabled: [verification selection](docs/agents/verification.md); otherwise the checks above are required.
- A copied tool is verified with this repository's own fixtures and contract checks; a release never waits for a consumer.
- A removed rule goes from every file that mentions it: no dead template text.
- A bug fix starts with a committed test that fails without the fix; the fix never edits that test to pass (BACKLOG-RULES, "A bug fix starts with a failing test").
- A PR that closes a P1 record or changes a template or harness file gets a fresh-context review before it merges, with the exemptions listed there; the reviewer reports, never approves or merges (BACKLOG-RULES, "Independent review").

### Releasing

1. **Online first**: `git pull --ff-only --tags` in the primary checkout on `main`, clean tree, then `git worktree add ../project-harness-<task> -b <branch> main` and work there.
2. Change, add the CHANGELOG entry, set `VERSION` and this repository's `.harness.json` `version` to the new release, copy `core/tools/` to `tools/`, record the change in the backlog.
3. `npm run check:template`, `npm run test:tools` and `npm run check:backlog`; PR; CI green.
4. After merge, in the primary checkout (still on `main`): `git pull --ff-only`, `git tag -a vX.Y.Z -m "…"`, `git push origin vX.Y.Z`, then publish its Release (F-079): `awk '/^## X\.Y\.Z,/{f=1;next} /^## /{f=0} f' CHANGELOG.md | gh release create vX.Y.Z --verify-tag -t "X.Y.Z — <first bold headline>" -F -`. A release exists only once its tag is on GitHub, and its backlog record closes then. Projects pick it up at their next session start and record their reconcile in their own backlogs ([BACKLOG-RULES](docs/BACKLOG-RULES.md), "One repository, one backlog").

### Procedures: read before the task

Each procedure is binding when its trigger applies: read it before the task; a short index never defers a requirement. All of them: [procedure index](docs/agents/procedures.md). `npm run check:rules` fails when a never or ask-first rule lives only in a procedure.

| Before you | Read |
|---|---|
| start a session | [session start](docs/agents/session-start.md) |
| open, update or merge a PR | [pull requests](docs/agents/pull-requests.md) |
| update or close a backlog record | [backlog rules](docs/BACKLOG-RULES.md) (it names the one file a change needs) |
| write or change documentation | [documentation](docs/backlog/documentation.md) |
| apply, reconcile or release the harness, or take a change asked from a project | [APPLY.md](APPLY.md) |
| add a rule, a check or a stack add-on | [adding things](docs/agents/adding-things.md) |
| change template content, tools or procedure | its section in [area notes](docs/agents/areas.md) |
| change `core/AGENTS.md`, `core/CLAUDE.md`, `core/docs/BACKLOG-RULES.md` or `core/docs/backlog/`; measure friction; consolidate rules | [rule review](docs/agents/rule-review.md) (rerun the agent-behaviour checks; the impact map lists it) |
| change something another output is derived from | [change impact](docs/agents/change-impact.md) |
| switch tasks or hand off context | [task context](docs/agents/task-context.md) |
| work in parallel: claimed tasks, branches, model assignments | [parallel work](docs/agents/parallel-work.md) (claims inside) |
| start, change the phase of or finish a job, when `workUsage.enabled` | [job usage](docs/agents/work-usage.md) |
| reassess architecture or decisions | [architecture review](docs/agents/architecture-review.md) |
| set up a project or change its stack or workflow (capability assessment) | [MCP guidance](docs/agents/mcp.md), "In short" |
| add, configure or rely on an MCP connection | [MCP guidance](docs/agents/mcp.md) |
| work across repositories of a solution | [solution profile](docs/agents/solution-profile.md) |
| add or use a shared skill | [skills](docs/agents/skills.md) |
| reconcile or review maintenance evidence | [maintenance](docs/agents/maintenance.md) |
| run an audit, or record its findings or an improvement proposal | [audit](docs/agents/audit.md) ([findings](docs/agents/audit-findings.md)) |

## Area notes

Before changing an area, read its section in [docs/agents/areas.md](docs/agents/areas.md).

| Area | Covers |
|---|---|
| Template content | `core/`, `angular/`: the files projects receive |
| Tools | the copied checks and their settings in `.harness.json` |
| Procedure | `APPLY.md`, the skill, versioning and reconciling |

## Work tracking

**At the start of every session, before other work, run `npm run check:freshness`** and do what it lists, as [session start](docs/agents/session-start.md) says, with two additions here:
- the template clone is behind, ahead of or unreachable from GitHub: pull or push first; never change a stale clone;
- an audit covers template text, tools, procedure, the projects that apply it, and what the outputs rely on outside the repository.

- This backlog owns only this repository's work: reject foreign next actions and closure conditions; a master never waits on what derives from it (BACKLOG-RULES, "One repository, one backlog"). [docs/BACKLOG.md](docs/BACKLOG.md) is the status ledger, [docs/BACKLOG-RULES.md](docs/BACKLOG-RULES.md) the procedure: update affected records in the same PR and run `npm run check:backlog`.
- Keep a confirmed bug, a candidate fix, an unimplemented feature and a completed check distinct. A merge is not a release: the tag is.
