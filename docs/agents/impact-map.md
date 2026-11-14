<!-- Written by tools/impact-map.mjs from the "impact" rows of .harness.json: change the rows, then run it. -->

# Impact map

What must follow a change, and what must run again after it (docs/agents/change-impact.md). `npm run check:freshness` lists, on every PR, the rows a branch sets off and the order to run them.

**More detail:** [Parallel Work](parallel-work.md) (Shared optional workflow procedure) · [Architecture Review](architecture-review.md) (Shared optional workflow procedure) · [Procedures](procedures.md) (Shared optional workflow procedure) · [Task context](task-context.md) (Optional task-boundary handoffs and host-aware context transitions)

| Id | When these change | Made of (content) | This must follow | Command | Runs again after | Checked by |
|---|---|---|---|---|---|---|
| tools | `core/tools/**` |  | copy core/tools/ to tools/ | `cp core/tools/*.mjs tools/` |  | check:template |
| release | `core/**`, `angular/**`, `solution/**`, `skills/**`, `APPLY.md`, `docs/apply/**` |  | a CHANGELOG entry with a step for projects, VERSION and the stamps |  |  | nothing |
| impact-page | `.harness.json` |  | regenerate the impact map page | `node tools/impact-map.mjs` | tools | CI (impact map page matches the rows) |
| shared-guides | `core/docs/agents/*.md` |  | copy adopted shared guides to docs/agents/ |  |  | check:template (copied stamp entries) |
| archive-recaps | `docs/archive/backlog-*.md`, `core/tools/archive-recap.mjs`, `tools/archive-recap.mjs` |  | Regenerate the weekly closure index without changing archived record lines. | `npm run archive:recap` |  | check:archive-recap, check:backlog history guard and owned fixtures |
| behaviour | `core/AGENTS.md`, `core/CLAUDE.md`, `core/docs/BACKLOG-RULES.md`, `core/docs/backlog/*.md`, `core/tools/check-backlog.mjs`, `core/tools/behaviour.mjs` |  | rerun the agent-behaviour checks with an agent runner and compare each scenario with the last run; a regression is a backlog record | `npm run behaviour -- run --runner="<agent command>"` |  | on demand, by the owner's runner (not CI: each run costs agent time) |
| backlog-dependencies | `docs/BACKLOG.md`, `docs/archive/backlog-*.md`, `core/tools/backlog-dependencies.mjs` |  | Validate linked prerequisites; work-items build shows Depends on and Unlocks in each record. Archived records stay unchanged. | `node tools/backlog-dependencies.mjs --check && node tools/work-items.mjs build` |  | npm run check:dependencies in CI |
| backlog-queue | `docs/BACKLOG.md`, `docs/archive/backlog-*.md`, `core/tools/backlog-queue.mjs`, `core/tools/backlog-dependencies.mjs`, `core/docs/BACKLOG-RULES.md`, `core/docs/backlog/*.md` |  | Validate the work queue (order, prerequisites, archive compatibility); work-items build lists records in its order. | `node tools/backlog-queue.mjs --check && node tools/work-items.mjs build` |  | npm run check:queue; owned queue fixtures and fresh-context review |
| verification-policy | `core/tools/verification.mjs`, `core/docs/agents/verification.md`, `tools/test-verification.mjs` |  | Verify scoped planning, full-run provenance and freshness boundaries with owned fixtures; reconcile adoption guidance. | `node --test tools/test-verification.mjs` |  | No model calls or real consumer adoption required. |
| work-items | `docs/work/**`, `docs/agents/model-profiles.json`, `core/tools/work-items.mjs`, `core/tools/task-claims.mjs` |  | Regenerate the source-owned backlog and validate explicit tasks, profile evidence and claim contracts. | `node tools/work-items.mjs build && node tools/work-items.mjs check` |  | Source/view and task fixtures, normal Git CAS under archive guard, existing backlog/dependency/queue checks |

## Content dependencies

What each output is made of, besides code: change one of these and the output is out of date.

| Output | Made of | Redo with |
|---|---|---|
| (none listed) | | |

## Value couplings

A value that lives in more than one place: change it in one, change it in all. Best kept by one shared source, else by a test.

| Value | Where | Kept equal by |
|---|---|---|
| (none listed) | | |

## Outside the repository

What can change an output with no commit here, and how we would notice.

| What | Affects | Noticed by |
|---|---|---|
| GitHub (gh CLI, Actions, the template clone) | ci-status, the CI freshness step, release tags | the tools report an unreachable remote; the audit |
| MCP vendors, official registry and client configuration/discovery formats | cached catalogue, setup guidance, generated snippets and skill discovery | dated source review during onboarding, relevant changes and audits; live host verification remains separate |
| Installed Angular/TypeScript, browser and desktop runtimes; CI action versions | version-specific conventions, snippets, browser/CAD workflows and CI | locked dependency checks, own fixtures and version-specific vendor docs; real runtimes require their own acceptance |
