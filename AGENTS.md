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

Open every change as a PR against `main`, never on another PR's branch. Once a PR's CI is green the owner may merge it at any moment: push no new work to it, open a new PR. Exception: a green PR that conflicts with `main` may get a push that only resolves the conflict; its checks run again before it can merge. A conflict in `docs/BACKLOG.md` is resolved record by record with `node tools/merge-backlog.mjs`.

**What the agent does on its own, and what it asks first** (the same rule as `core/AGENTS.md`). On its own: branch, commit, push its branches, open PRs against `main` (then name the PR by its number in the records, and push that at once), merge its own PR once every check has passed and GitHub can merge it (`node tools/merge-when-green.mjs <PR>`), tag the release on `main` after that merge as "Releasing" says, reconcile and close records. Asks first: a decision a record marks 🧑, repository settings and code-scanning dismissals, rewriting published history or moving a published tag, deleting what it did not create. Never: merge with a failing or pending check.

```bash
npm run check:freshness   # first, at session start: online latest, backlog behind main, merged branches, audit age
npm run check:template    # VERSION, CHANGELOG, stamps, copied tools, syntax, links
npm run test:tools        # the copied tools against throwaway git repositories (fixtures)
npm run check:backlog     # active record layout and lifecycle cues
```

- A change to a copied tool is verified with this repository’s self-contained regression fixtures and contract checks. A completed real-consumer trial may provide additional evidence, but a release never waits for consumer changes or adoption.
- Do not leave dead template text behind: a removed rule goes from every file that mentions it.

### Releasing

1. **Online first**: `git pull --ff-only --tags` on `main`, clean tree, then branch.
2. Change, add the CHANGELOG entry, set `VERSION` and this repository's `.harness.json` `version` to the new release, copy `core/tools/` to `tools/`, record the change in the backlog.
3. `npm run check:template`, `npm run test:tools` and `npm run check:backlog`; PR; CI green.
4. After merge: `git switch main && git pull --ff-only`, `git tag -a vX.Y.Z -m "…"`, `git push origin vX.Y.Z`. A release exists only once its tag is on GitHub, and its backlog record closes then. Projects pick it up at their next session start and record their reconcile in their own backlogs ([BACKLOG-RULES](docs/BACKLOG-RULES.md), "One repository, one backlog").

## Area notes

Before changing an area, read its section in [docs/agents/areas.md](docs/agents/areas.md).

| Area | Covers |
|---|---|
| Template content | `core/`, `angular/`: the files projects receive |
| Tools | the copied checks and their settings in `.harness.json` |
| Procedure | `APPLY.md`, the skill, versioning and reconciling |

### Capability assessment

At setup and relevant stack/workflow changes, understand the project and assess existing capabilities and useful gaps. At session start, inspect `.harness.json` for selected integrations and solution context. Existing tools may suffice; assessment does not require installing an integration.

### MCP recommendations

Read [MCP guidance](docs/agents/mcp.md) when configured/relevant. Discover actual host tools before installing duplicates; a recommendation or generated config is not a working connection. Research fresh candidates only when the workflow needs them, following trusted sources and existing authorization. Missing optional connections do not block independent work.

### Solution context

Read available [solution context](docs/agents/solution-profile.md) when configured/relevant; missing coordinator access does not block independent component work. A solution coordinator owns contracts, compatibility and integration acceptance in its own backlog; components own implementation and their independent acceptance. Link records using repository-qualified IDs and derive dashboards from source ledgers without copying editable statuses or averaging completion. A reusable master never waits for downstream adoption. Only the coordinator writes its dashboard; source revisions, unavailable inputs and dirty snapshots remain explicit.

## Work tracking

- Keep single responsibility and dependency inversion across repository boundaries: reusable masters define contracts; derived projects supply their adapters/configuration. A master never depends on derived implementation, deployment or adoption for its release or acceptance. Each backlog owns only its repository’s work; reject foreign next actions and closure conditions (BACKLOG-RULES, Ownership rejection and dependency direction).

**At the start of every session, before other work, run `npm run check:freshness`** and do what it lists, in the session's first PR:
- the template clone is behind, ahead of or unreachable from GitHub: pull or push first; never change a stale clone;
- the backlog is behind `main`: read the CI of the PRs merged since (`npm run ci:status -- <numbers>`) and review any commit it lists without a PR, update or close their records, archive closed ones, move the header to the current `main`;
- merged branches are still on GitHub: delete them;
- the newest audit in `docs/audits/` is older than `freshness.auditDays` (7 by default): audit what changed since (template text, tools, procedure, the projects that apply it, and what the outputs rely on outside the repository: dependency upgrades, external services) and write `docs/audits/<date>.md`.

- [docs/BACKLOG.md](docs/BACKLOG.md) is the source of truth for status; [docs/BACKLOG-RULES.md](docs/BACKLOG-RULES.md) is the procedure. Update the affected records in the same PR as the change, and run `npm run check:backlog`.
- Keep a confirmed bug, a candidate fix, an unimplemented feature and a completed check distinct. A merge is not a release: the tag is.

### Optional shared skills

When a workflow needs an additional skill, read [skill guidance](docs/agents/skills.md). Discover existing capabilities first; review source, dependencies and project-rule compatibility before use. Shared skills are optional entry points and do not replace project rules or grant installation permissions.

### Maintenance cost and rule consolidation

All applicable rules must be known and followed from the start; shorter indexes never defer requirements. Use [maintenance guidance](docs/agents/maintenance.md) for an optional read-only reconciliation preview and observed local friction measurements. At audits, repeated procedural conflicts or significant workflow changes, consolidate redundant rules with requirement/owner/exception traceability. Never remove a safeguard just because it is old or rarely triggered. Record unresolved findings on their owning outcomes; no automatic expiry or telemetry.
