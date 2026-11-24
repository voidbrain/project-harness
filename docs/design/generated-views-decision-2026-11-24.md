# Where generated backlog views live (F-096-T01), 2026-11-24

**Status: waiting for the owner's decision.**

Projects with source-owned work items commit the views built from them (`docs/BACKLOG.md`, recaps, totals). Each PR that changes a step rebuilds them, so parallel PRs conflict on the generated file even when their sources do not. Solution coordinators read the committed `docs/BACKLOG.md` of each component on GitHub. Projects without `workItems` keep a hand-written `docs/BACKLOG.md` and are not affected by any option.

## Options

| | Option | Built where | Readers and links | Cost and risk |
|---|---|---|---|---|
| A | Keep committing views (today) | Each PR | Unchanged | Conflicts stay; `merge-backlog` and rebuild-on-conflict stay the remedy |
| B | **Generated branch** (proposed) | CI on `main` pushes the views to a `backlog-views` branch; each PR gets them as a CI artifact | Links point to `blob/backlog-views/docs/BACKLOG.md#f-005`; a coordinator reads that branch at a resolved commit, or rebuilds from sources | CI needs `contents: write` on that branch only; no Pages setup; works in private repositories |
| C | GitHub Pages | CI on `main` publishes a Pages site | Links to the site; coordinators read the site or rebuild | Pages must be enabled (a repository setting, asked first per project); private repositories need a paid plan |
| D | Release asset | Built at each release | Links to the latest release asset | Views are stale between releases; agents still build locally |

In every option except A: `docs/BACKLOG.md` and the other views are ignored by git in the source tree, `npm run work:build` writes them locally for agents, and CI checks the sources and a fresh build.

## Also to decide

1. **Transition**: one minor release where views are both committed and published (proposed), then a major release that stops committing them; or a single major release.
2. **Default**: projects opt in during the transition (proposed), or switch at the major release.
3. **Coordinators**: read the published view (B, C, D) or always rebuild from the component's sources with the copied tool at the resolved commit (proposed: published view first, rebuild when it is missing; the dashboard names which and the source commit).

## Decision

_Owner: write the option (A–D or an amendment) and answers 1–3 here, with the date._
