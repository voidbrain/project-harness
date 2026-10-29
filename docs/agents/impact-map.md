<!-- Written by tools/impact-map.mjs from the "impact" rows of .harness.json: change the rows, then run it. -->

# Impact map

What must follow a change, and what must run again after it (AGENTS, "What follows a change"). `npm run check:freshness` lists, on every PR, the rows a branch sets off and the order to run them.

| Id | When these change | This must follow | Command | Runs again after | Checked by |
|---|---|---|---|---|---|
| tools | `core/tools/**` | copy core/tools/ to tools/ | `cp core/tools/*.mjs tools/` |  | check:template |
| release | `core/**`, `angular/**` | a CHANGELOG entry with a step for projects, VERSION and the stamps |  |  | nothing |
| impact-page | `.harness.json` | regenerate the impact map page | `node tools/impact-map.mjs` | tools | CI (impact map page matches the rows) |
