# Optional built backlog views (10.14.0)

Part of the [harness procedure](../../APPLY.md). Read when a project adopts built backlog views or a coordinator reads them.

A project with source-owned records (`workItems.enabled`) may stop committing its generated `docs/BACKLOG.md` (F-096, owner decision 2026-11-24: a `backlog-views` branch). Committed views stay the default during this transition; a later major release stops committing them, announced in its own entry. To opt in:

1. Copy, at 10.14.0 or later, `tools/work-items.mjs`, `check-backlog.mjs`, `check-freshness.mjs`, `maintenance.mjs`, `reconcile-draft.mjs`, and `backlog-dependencies.mjs` / `backlog-queue.mjs` if adopted, and `docs/agents/pull-requests.md` and `session-start.md`; re-adapt `docs/backlog/review.md` step 1.
2. Set `workItems.views` to `"built"`, add `docs/BACKLOG.md` to `.gitignore`, run `git rm --cached docs/BACKLOG.md`, then `npm run work:build` to write it locally. `work-items check` refuses a ledger that git still tracks or does not ignore.
3. CI: run `node tools/work-items.mjs check` before every step that reads the ledger (it writes the fresh build; the maintenance check reads it too) and attach it as the `backlog-views` artifact, as `angular/.github/workflows/ci.yml` and `solution/.github/workflows/ci.yml` do. Check out with `fetch-depth: 0` so `check-backlog` can compare with `origin/backlog-views`.
4. Publishing: copy `core/.github/workflows/backlog-views.yml` unchanged to `.github/workflows/` and list it under `copied`. It is the one shipped workflow with `contents: write`: on push to `main` only, serialised, it runs `work-items publish`, which fast-forwards `backlog-views` with `main`'s tree plus the ledger. It needs no secret. If an organisation policy forbids write tokens in workflows, or a ruleset blocks the branch, publishing fails: changing either is the owner's repository setting, asked first.
5. Links: the README links the published view, `https://github.com/<owner>/<repo>/blob/backlog-views/docs/BACKLOG.md` (see the note in `core/README.md`). Solution coordinators copy `tools/solution.mjs` at 10.14.0 or later: they read the publication of the resolved commit, or rebuild it from a local checkout with their own `tools/work-items.mjs`.

To go back, set `views` to `"committed"`, remove the `.gitignore` line, run `npm run work:build` and commit the ledger; the `backlog-views` branch can stay or be deleted by its owner.

The copy and stamp steps for archive recaps (3.2.0), browser and combined coverage (3.3.0), work usage (4.4.0–4.8.0) and upfront feature plans (4.5.0) were in upgrade notes the owner removed (F-078 D2); read them in `APPLY.md` at tag `v8.13.0`. Their guides describe use.
