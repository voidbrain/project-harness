# Project harness

A reusable working harness for coding agents (Claude Code, Copilot, Codex, Continue) and the people who review their work. It was extracted from `a-bando-fpv-app` (OpenBando) and keeps that repository's structure, with the project-specific content removed.

Applying it gives a project:

| File | Owns |
|---|---|
| `CLAUDE.md` | Points Claude Code at `AGENTS.md` (`@AGENTS.md`). Nothing else lives here. |
| `AGENTS.md` | How to work in the repository: stack rules, architecture, how to add things, checks before you finish, pitfalls, area index, work tracking. Short and binding. |
| `docs/agents/areas.md` | Per-area rules and lessons, kept out of AGENTS so that file stays short. Equally binding. |
| `docs/BACKLOG.md` | The current work ledger: one record per bug (`B-nnn`) or feature (`F-nnn`), with status, priority, human-action cue, next action and evidence. |
| `docs/BACKLOG-RULES.md` | The procedure for updating the backlog: one repository per backlog, lifecycle, evidence, CI reconciliation, closure and archives, documentation consistency. |
| `docs/STYLE-GUIDE.md` | How the product looks and talks (voice, tokens, type, spacing, components, accessibility, art direction) and how repository docs are written. |
| `docs/DESIGN.md` | Optional: what the product does in its own terms (game design, domain model), with numbers left in the code. |
| `docs/audits/` | Dated audits. Reports preserve dated evidence; [scope-aware checks](docs/agents/audit.md) track freshness per area (7 days by default). |
| `docs/archive/` | Closed backlog records and finished plans, dated. History, not current status. |
| `README.md` | What the project is and does, how to run it, where things are. Summarises; links to the rest. |
| `tools/check-backlog.mjs` | Validates the backlog's record layout and cues (CI blocks on it). |
| `tools/check-freshness.mjs` | At session start: backlog behind `main` (every merged change, with its PR when one is found; an unreachable remote is reported), merged branches left on the remote, audit age, harness files and impact-map rows the branch touches, and (through `check-harness`) a newer template release. Ordinary findings warn; the adopted 3.0 maintenance gate can fail. |
| `tools/ci-status.mjs` | Lists each PR's CI jobs and failed/retried tests, as evidence for backlog records (needs `gh`). |
| `tools/check-harness.mjs` | Run by `check-freshness`: compares the project with the template release it was applied from and lists updates, conflicts, files to reconcile and forked files to merge (`--merge`). In CI too, where the Angular workflow clones the template, so a PR on an older release shows warnings. |
| `tools/impact-map.mjs` | The impact map: which rows a set of changed files sets off, chains (`after`) included, in run order (used by `check-freshness`); run directly, it writes `docs/agents/impact-map.md`. |
| `tools/merge-backlog.mjs` | Resolves a merge conflict in `docs/BACKLOG.md` record by record, three ways: a record only one side changed takes that side; one both changed is named, to merge by hand. |
| `tools/merge-when-green.mjs` | Merges the listed PRs once every check on each has passed and GitHub can merge it; stops on a failing check (required or not) or a conflict (needs `gh`). |
| `tools/coverage-table.mjs` | The code coverage table: per folder (lines, statements, branches, functions) and the files no test runs, from the standard coverage summary; `--write` refreshes `docs/agents/coverage.md` and its baseline, `--check` warns by default; coverage.enforce fails regressions against the main-branch baseline. |
| `.harness.json` | The project's stamp: template path and remote, release, stacks, copied, forked and adapted files, and the project settings (audit age, CI names, framework-free folders; `defaultBranch` when the remote's default cannot be read) the copied scripts read. |

Stack add-ons:

| Folder | Adds |
|---|---|
| `angular/` | Angular/TypeScript rules for AGENTS, `tools/check-conventions.mjs` (the AGENTS rules a script can check, plus unused exports), an ESLint flat config with a framework-free layer, Prettier, editor recommendations, a `CI` workflow and the npm scripts. |

## Capability assessment

At setup and relevant stack/workflow changes, understand the project and assess existing tools and capability gaps. Existing capabilities may suffice. Assessment is required when applicable; adopting integrations or a solution profile depends on the actual need. See [required steps and conditional work](APPLY.md#required-steps-and-conditional-work).

## MCP recommendations

MCP support adds capability recommendations and guided setup, not a mandatory runtime dependency. `node tools/mcp.mjs recommend` checks saved project/solution selections and simple stack signals; `search --query=NAME` explicitly queries current official registry metadata; `check` validates owned selections without making component CI depend on optional coordinator metadata; `config --server=ID --client=CLIENT` prints a reviewed configuration snippet without installing or modifying client settings. Reuse existing tools and CLI alternatives. Connection and task acceptance still require observation. See [MCP guidance](docs/agents/mcp.md).

| Optional file | Owns |
|---|---|
| `tools/mcp.mjs` and `tools/mcp-catalog.json` | Recommendation metadata, explicit registry search and client snippets; no host installation or connection guarantees. |
| `docs/agents/mcp.md` | Session discovery, current-source research, authorization, offline limits and setup/repair procedures. |

## Solution profiles

For multiple repositories, use a separate coordinator with its own solution backlog, manifest, contracts and integration acceptance; each component retains its own backlog and release criteria. Apply `core/` plus the `solution/` fragment to the coordinator. `node tools/solution.mjs dashboard --write` reads source backlogs into a timestamped Markdown dashboard; `--remote` reads component refs through GitHub at resolved commits. Missing sources remain Unknown and fail visibly; local changes are marked; no component is modified and no combined percentage is invented. See [solution profile](docs/agents/solution-profile.md) and [applying it](APPLY.md).

| Optional file | Owns |
|---|---|
| `solution/` | Coordinator fragment, manifest, optional npm scripts and solution document template. |
| `tools/solution.mjs` | Source identity/ref checks, qualified component links and a generated dashboard; no semantic ownership inference. |
| `docs/agents/solution-profile.md` | Solution/component boundaries, source snapshots, dashboard refresh and integration acceptance. |

## Shared skills

Skills are optional workflow entry points. Review missing capabilities, source and client compatibility before installation; project rules and existing authorization remain authoritative. See [skill guidance](docs/agents/skills.md).

| Optional file | Owns |
|---|---|
| `skills/apply-harness/SKILL.md` | Optional shared entry point to APPLY; client discovery/installation is separate. |
| `docs/agents/skills.md` | Reviewed skill discovery, dependencies, duplicate installations and client compatibility limits. |

## Layout of this folder

```
core/       every project: CLAUDE, AGENTS skeleton, README skeleton, docs/, tools/, .harness.json
solution/   optional multi-repository coordinator profile and manifest
angular/    Angular projects: AGENTS stack section, ESLint, Prettier, CI, check-conventions, npm scripts, stamp fragment
APPLY.md    the procedure an agent follows to apply the harness to a project, and to reconcile one
VERSION     the release target; only a published tag establishes a release
```

Files contain `{{PLACEHOLDERS}}` (project name, repo, paths, commands) and `<!-- harness: ... -->` notes saying what to fill in. A placeholder or note left in an applied project is a defect.

## Applying it

Follow [APPLY.md](APPLY.md) to apply or reconcile the harness. The optional shared [apply-harness skill](skills/apply-harness/SKILL.md) reads that procedure; see [skill discovery and installation guidance](docs/agents/skills.md). No personal installation or fixed checkout path is required.

## Versions

The template is a git repository; every release is a tag `vX.Y.Z` with a [CHANGELOG](CHANGELOG.md) entry and the same number in `VERSION`. Each project records the release it was last reconciled with in `.harness.json`, so projects can sit on different releases and be moved forward one at a time.

Two kinds of files:

- **Copied** files (the `tools/` scripts, catalogue and selected shared guides) are byte-identical in every project. Their per-project settings live in `.harness.json`, so a new release can simply be copied over. Editing one inside a project shows up as a difference or a conflict.
- **Adapted** files (AGENTS, README, backlog, rules, style guide, ESLint, CI) were rewritten for the project. A release that changes their template source is reconciled by hand, from the diff `check-harness` prints.

A project that needs a rule or a tool to behave differently keeps receiving releases: a setting in `.harness.json`, a marked override line in an adapted file, or a **forked** copied file that `check-harness` three-way merges with each release, reporting only overlapping changes as conflicts ([APPLY.md](APPLY.md), "Project overrides").

## Changing the template

Classify a proposed change before editing: generic rules/tools change in this template first, then projects reconcile; project-specific content stays in its owning repository. Keep the `core/` files generic; a rule that only matters for one stack goes in that stack's folder. This repository follows its own harness: [AGENTS.md](AGENTS.md) is how to work on it (online first, a PR per change, the release procedure), [docs/BACKLOG.md](docs/BACKLOG.md) its work, `npm run check:template` its own consistency check. Every project that includes the harness runs `check:freshness` at session start, which reports the new release and what to reconcile ([APPLY.md](APPLY.md), "Reconciling").

Active backlogs show a title, signal/priority/status, remaining effort and estimated completion, a human cue and an Issue / Reproduce / Check recap for every record. Long actions, estimate rationale and history stay in closed details; archives retain their historical layout. See [Backlog rules](docs/BACKLOG-RULES.md).

Repository ownership is a required semantic review: reject foreign backlog actions and downstream adoption gates. Reusable masters define contracts; derived projects own their adapters and reconciliation. Self-contained tests gate a master release; completed consumer trials can add evidence.

The [full audit of 31 October 2026](docs/audits/2026-10-31.md) covers current rule ownership, tools, profiles and documented limits. Green fixture checks do not establish live MCP/client setup, semantic ownership or real-device acceptance.

## Maintenance cost without fewer rules

All applicable rules apply from the start. Optional `npm run reconcile:preview -- --template=PATH --to=v2.2.2` lists changes, protected-rule review and checks without writing/fetching. `npm run friction -- record …` and `npm run friction -- report` store explicit local observations only, with unknown counters kept distinct from zero. See [maintenance guidance](docs/agents/maintenance.md) for boundaries and audit-triggered consolidation that preserves requirements instead of expiring safeguards. No baseline or productivity improvement is claimed before real samples exist.

## Required maintenance feedback (3.0)

Adopting 3.0 requires automatically timed adoption/reconciliation and current input-bound review evidence. Session/PR CI checks fail when missing/stale, and a daily read-only workflow checks between sessions. Reviewed outcomes lead to tested rule/tool/skill improvements or an owned backlog/no-change decision; no bot silently changes governing rules. See [maintenance guidance](docs/agents/maintenance.md). This supersedes the optional enforcement described for prepared 2.3.0; all applicable rules still apply from the start.

Coverage reporting stays live per run. Optional coverage.enforce prevents aggregate regression against main; it does not require arbitrary percentage growth or treat unit coverage as a code-quality score.

## Scope-aware periodic audits

[The audit procedure](docs/agents/audit.md) covers code, logic, tests, documentation, harness, security, delivery and backlog. Every audit produces a dated report and manifest, with evidence, uncertainty, findings and value-based proposals. check:audits and freshness track actual area coverage; a recent scoped review cannot mask an overdue full audit. Invalid evidence fails; overdue areas warn by default (audit.enforce can make them fail after a real baseline is established). A maintenance receipt is not a product audit.
