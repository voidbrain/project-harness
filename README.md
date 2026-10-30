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
| `docs/audits/` | Dated audits. The newest one is the current audit; `check:freshness` warns when it is older than `freshness.auditDays` in `.harness.json` (7 by default). |
| `docs/archive/` | Closed backlog records and finished plans, dated. History, not current status. |
| `README.md` | What the project is and does, how to run it, where things are. Summarises; links to the rest. |
| `tools/check-backlog.mjs` | Validates the backlog's record layout and cues (CI blocks on it). |
| `tools/check-freshness.mjs` | At session start: backlog behind `main` (every merged change, with its PR when one is found; an unreachable remote is reported), merged branches left on the remote, audit age, harness files and impact-map rows the branch touches, and (through `check-harness`) a newer template release. Never fails. |
| `tools/ci-status.mjs` | Lists each PR's CI jobs and failed/retried tests, as evidence for backlog records (needs `gh`). |
| `tools/check-harness.mjs` | Run by `check-freshness`: compares the project with the template release it was applied from and lists updates, conflicts, files to reconcile and forked files to merge (`--merge`). In CI too, where the Angular workflow clones the template, so a PR on an older release shows warnings. |
| `tools/impact-map.mjs` | The impact map: which rows a set of changed files sets off, chains (`after`) included, in run order (used by `check-freshness`); run directly, it writes `docs/agents/impact-map.md`. |
| `tools/coverage-table.mjs` | The code coverage table: per folder (lines, statements, branches, functions) and the files no test runs, from the standard coverage summary; `--write` refreshes `docs/agents/coverage.md` and its baseline, `--check` warns in CI when a folder drops. Never fails. |
| `.harness.json` | The project's stamp: template path and remote, release, stacks, copied, forked and adapted files, and the project settings (audit age, CI names, framework-free folders; `defaultBranch` when the remote's default cannot be read) the copied scripts read. |

Stack add-ons:

| Folder | Adds |
|---|---|
| `angular/` | Angular/TypeScript rules for AGENTS, `tools/check-conventions.mjs` (the AGENTS rules a script can check, plus unused exports), an ESLint flat config with a framework-free layer, Prettier, editor recommendations, a `CI` workflow and the npm scripts. |

## Layout of this folder

```
core/       every project: CLAUDE, AGENTS skeleton, README skeleton, docs/, tools/, .harness.json
angular/    Angular projects: AGENTS stack section, ESLint, Prettier, CI, check-conventions, npm scripts, stamp fragment
APPLY.md    the procedure an agent follows to apply the harness to a project, and to reconcile one
VERSION     the current release; CHANGELOG.md lists every release
```

Files contain `{{PLACEHOLDERS}}` (project name, repo, paths, commands) and `<!-- harness: ... -->` notes saying what to fill in. A placeholder or note left in an applied project is a defect.

## Applying it

First pull the published latest ([APPLY.md](APPLY.md), step 0). Then ask Claude Code, from any directory: "apply the project harness to `~/Projects/<name>`" (the `apply-harness` skill in `~/.claude/skills/` loads [APPLY.md](APPLY.md)). The agent reads the target first and adapts each file to what the project actually is. It does not copy the files blindly: existing docs are merged in, the backlog starts with real findings, and the first audit records the baseline.

## Versions

The template is a git repository; every release is a tag `vX.Y.Z` with a [CHANGELOG](CHANGELOG.md) entry and the same number in `VERSION`. Each project records the release it was last reconciled with in `.harness.json`, so projects can sit on different releases and be moved forward one at a time.

Two kinds of files:

- **Copied** files (the `tools/` scripts) are byte-identical in every project. Their per-project settings live in `.harness.json`, so a new release can simply be copied over. Editing one inside a project shows up as a difference or a conflict.
- **Adapted** files (AGENTS, README, backlog, rules, style guide, ESLint, CI) were rewritten for the project. A release that changes their template source is reconciled by hand, from the diff `check-harness` prints.

A project that needs a rule or a tool to behave differently keeps receiving releases: a setting in `.harness.json`, a marked override line in an adapted file, or a **forked** copied file that `check-harness` three-way merges with each release, reporting only overlapping changes as conflicts ([APPLY.md](APPLY.md), "Project overrides").

## Changing the template

Improve a rule in a project, then bring it back here if it is not project-specific. Keep the `core/` files generic; a rule that only matters for one stack goes in that stack's folder. This repository follows its own harness: [AGENTS.md](AGENTS.md) is how to work on it (online first, a PR per change, the release procedure), [docs/BACKLOG.md](docs/BACKLOG.md) its work, `npm run check:template` its own consistency check. Every project that includes the harness runs `check:freshness` at session start, which reports the new release and what to reconcile ([APPLY.md](APPLY.md), "Reconciling").
