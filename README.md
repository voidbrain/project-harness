# Project harness

A reusable working harness for coding agents (Claude Code, Copilot, Codex, Continue) and the people who review their work. It was extracted from `a-bando-fpv-app` (OpenBando) and keeps that repository's structure, with the project-specific content removed.

Applying it gives a project:

| File | Owns |
|---|---|
| `CLAUDE.md` | Points Claude Code at `AGENTS.md` (`@AGENTS.md`). Nothing else lives here. |
| `AGENTS.md` | How to work in the repository: stack rules, architecture, how to add things, checks before you finish, pitfalls, area index, work tracking. Short and binding. |
| `docs/agents/areas.md` | Per-area rules and lessons, kept out of AGENTS so that file stays short. Equally binding. |
| `docs/BACKLOG.md` | The current work ledger: one record per bug (`B-nnn`) or feature (`F-nnn`), with status, priority, human-action cue, next action and evidence. |
| `docs/BACKLOG-RULES.md` | The procedure for updating the backlog: lifecycle, evidence, CI reconciliation, closure and archives, documentation consistency. |
| `docs/STYLE-GUIDE.md` | How the product looks and talks (voice, tokens, type, spacing, components, accessibility) and how repository docs are written. |
| `docs/audits/` | Dated audits. The newest one is the current audit; `check:freshness` warns when it is more than 7 days old. |
| `docs/archive/` | Closed backlog records and finished plans, dated. History, not current status. |
| `README.md` | What the project is and does, how to run it, where things are. Summarises; links to the rest. |
| `tools/check-backlog.mjs` | Validates the backlog's record layout and cues (CI blocks on it). |
| `tools/check-freshness.mjs` | At session start: backlog behind `main`, merged branches left on the remote, audit age. Never fails. |
| `tools/ci-status.mjs` | Lists each PR's CI jobs and failed/retried tests, as evidence for backlog records (needs `gh`). |

Stack add-ons:

| Folder | Adds |
|---|---|
| `angular/` | Angular/TypeScript rules for AGENTS, `tools/check-conventions.mjs` (the AGENTS rules a script can check, plus unused exports), an ESLint flat config with a framework-free layer, Prettier, editor recommendations, a `CI` workflow and the npm scripts. |

## Layout of this folder

```
core/       every project: CLAUDE, AGENTS skeleton, README skeleton, docs/, tools/
angular/    Angular projects: AGENTS stack section, ESLint, Prettier, CI, check-conventions, npm scripts
APPLY.md    the procedure an agent follows to apply the harness to a project
```

Files contain `{{PLACEHOLDERS}}` (project name, repo, paths, commands) and `<!-- harness: ... -->` notes saying what to fill in. A placeholder or note left in an applied project is a defect.

## Applying it

Ask Claude Code, from any directory: "apply the project harness to `~/Projects/<name>`" (the `apply-harness` skill in `~/.claude/skills/` loads [APPLY.md](APPLY.md)). The agent reads the target first and adapts each file to what the project actually is. It does not copy the files blindly: existing docs are merged in, the backlog starts with real findings, and the first audit records the baseline.

## Changing the template

Improve a rule in a project, then bring it back here if it is not project-specific. Keep the `core/` files generic. A rule that only matters for one stack goes in that stack's folder. Applied projects do not update themselves: re-apply by asking the agent to "reconcile `<project>` with the project harness", which diffs the shared tools and procedures and keeps project content.
