# Lean AGENTS traceability (F-090), 2026-11-23

Where each part of the old `core/AGENTS.md` (v10.4.0) and this repository's own `AGENTS.md` went when they were made leaner for the always-loaded budget (`rules.budgets.always`, 3,500 tokens). A script compared every sentence of the old files with the new AGENTS plus the procedure files. Each sentence not found verbatim is listed below with its new place. No requirement was dropped. The safety block (`<!-- safety:start -->` … `<!-- safety:end -->`) is byte-identical.

Result, measured with `tools/rule-load.mjs` (characters ÷ 4): `core/AGENTS.md` 3,156 → about 2,575 tokens; this repository's always-loaded set 3,522 → about 2,540.

## `core/AGENTS.md` (what projects receive)

| Old text | Now |
|---|---|
| Style guide, two bullets | One bullet, same requirements: read the style guide before a UI change; tokens, never a new literal colour; a new token or shared component updates it in the same change |
| Documentation, three bullets (top-level docs concise, details in topic files, no backlog IDs or planned lists) | `docs/backlog/documentation.md`, "Top-level documents", verbatim; a procedures row "write or change documentation" |
| "PRs against `main`, when a green PR takes new work, …" (summary after the pull-requests link) | `docs/agents/pull-requests.md` (the link stays; it owns those rules) |
| "Every project formats and lints its source, in CI too: `check:tooling` fails without both. A project with no source code records `tooling.exempt` …" | Kept, shortened: "Format and lint in CI too (`check:tooling`; a project with no source code records `tooling.exempt` with its reason)" |
| Failing test is evidence: "check it against the intended behaviour; change its expectation only when the requirement deliberately changed, and say which requirement" | Kept, shortened, same requirement |
| "Do not leave dead code behind when replacing a feature: its state, helpers and tests go too" | Kept, reworded |
| Changing a harness file, bullets and closing line | Kept, shortened; "lists the harness files a branch changes" stays |
| Procedures intro (all rules known from the start; discovery index; binding when its trigger applies) | Kept, shortened; "from the start" is also in `docs/agents/procedures.md` and `maintenance.md` |
| Procedures rows: job usage, usage sources, effectiveness | One row → `work-usage.md`, which links both |
| Rows: parallel work, shared claims | One row → `parallel-work.md`, which links `claims.md` |
| Rows: capability assessment, MCP connection, MCP selections and commands | One row → `mcp.md`, which links `mcp-commands.md` |
| Rows: solution profile, solution refresh | One row → `solution-profile.md`, which links `solution-refresh.md` |
| Rows: rule files changed (agent-behaviour checks), friction / consolidation / token review | One row → `rule-review.md` |
| Rows: run an audit, record audit findings | One row → `audit.md`, which links `audit-findings.md` |
| Row: maintenance "(`node tools/maintenance.mjs check` runs at session start and in CI)" | Row kept; the parenthesis is in `maintenance.md` ("Run `node tools/maintenance.mjs check` at session start and in CI") |
| Row: change impact, "do each in the same PR, or record in the backlog why not" | Kept, shortened |
| Work tracking: single responsibility and dependency inversion; a master never depends on derived work; reject foreign next actions and closure conditions | One line pointing to BACKLOG-RULES "One repository, one backlog"; the full text is in `docs/backlog/ownership.md` |
| Work tracking: distinct bug / fix / feature / check; merge is not verification; green CI proves only its checks; archives and audits are dated evidence | Kept, shortened. "Current audit coverage is reported per area by check:audits; a scoped report never resets the full-audit baseline" is in `docs/agents/audit.md` ("Triggers and scope") |
| Work tracking: "A change to a harness file follows 'Changing a harness file' above" | Removed as a duplicate of that section, which is in AGENTS |
| Plan or promise becomes records "(steps, a table to build, a later fix)" | Kept, examples included |

## This repository's `AGENTS.md`

| Old text | Now |
|---|---|
| Adding things (a rule for every project, a check, a change asked from a project, a stack add-on) | `docs/agents/adding-things.md`, verbatim; a procedures row |
| Checks: PRs against `main`, never on another PR's branch; a green PR takes no new work; conflict-only push; `merge-backlog` | `docs/agents/pull-requests.md` (verbatim there); AGENTS links it |
| Scoped verification: fast checks and affected regressions by default, full checks on request, risk or freshness | `docs/agents/verification.md`; AGENTS keeps one line |
| Copied tool verified with own fixtures; a consumer trial is extra evidence, a release never waits for a consumer | Kept, shortened; the full rule is in `docs/backlog/ownership.md` |
| Independent review, "with the exemptions listed there" | Kept |
| Task context section | `docs/agents/task-context.md` (same text there); the procedures row stays |
| Development usage (optional) | `docs/agents/work-usage.md`, line 11, verbatim; a procedures row "track job usage" |
| Work tracking: ownership paragraph | As in `core/AGENTS.md` above |
| Session start list (integrations, backlog behind, merged branches, audit) | `docs/agents/session-start.md`; AGENTS keeps the two repository-specific items (stale template clone; what an audit covers here) |
| Ledger and procedure bullet "(with authoritative per-record sources when `workItems.enabled` …)" | Kept, shortened; the parenthesis is in `docs/BACKLOG-RULES.md` verbatim |
| Procedures rows | Compacted as in `core/AGENTS.md`, plus "add a rule, a check or a stack add-on" |

`docs/agents/work-usage.md` said "AGENTS owns the rule"; it now says the guide owns it and AGENTS routes there.

## After the review (PR #238)

A fresh-context review found triggers that the first draft had narrowed. All were restored, because the budget has room:

- the job-usage row says "start, change the phase of or finish a job" again, so it fires at every job, not only when an agent thinks it is "tracking usage";
- "reject foreign next actions and closure conditions" is always-loaded again;
- the MCP rows say "add, configure or rely on" again, and the capability-assessment row ("change its stack or workflow", "In short") is back;
- the change-impact row keeps its examples (generated pages and data, guides);
- the audit row covers "improvement proposals" again;
- the rule-review row names `docs/backlog/` (and, here, the `core/` paths and the impact-map note) again;
- this repository's AGENTS has a "write or change documentation" row too;
- the CHANGELOG step treats `docs/backlog/documentation.md` as adapted: add the section, do not copy the file.
