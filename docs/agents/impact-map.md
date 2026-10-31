<!-- Written by tools/impact-map.mjs from the "impact" rows of .harness.json: change the rows, then run it. -->

# Impact map

What must follow a change, and what must run again after it (AGENTS, "What follows a change"). `npm run check:freshness` lists, on every PR, the rows a branch sets off and the order to run them.

| Id | When these change | Made of (content) | This must follow | Command | Runs again after | Checked by |
|---|---|---|---|---|---|---|
| tools | `core/tools/**` |  | copy core/tools/ to tools/ | `cp core/tools/*.mjs tools/` |  | check:template |
| release | `core/**`, `angular/**`, `solution/**`, `skills/**`, `APPLY.md` |  | a CHANGELOG entry with a step for projects, VERSION and the stamps |  |  | nothing |
| impact-page | `.harness.json` |  | regenerate the impact map page | `node tools/impact-map.mjs` | tools | CI (impact map page matches the rows) |
| shared-guides | `core/docs/agents/*.md` |  | copy adopted shared guides to docs/agents/ |  |  | check:template (copied stamp entries) |

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
