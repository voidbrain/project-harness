# Owner check: Upload standalone skills to Agensi (F-075-T10)

- **Machine:** Mac (`project-harness` checkout)
- **Precondition:** `F-075-T03` through `F-075-T09` merged on `main`.

## Step 1 — Package the 7 standalone skill zips

Run on the Mac in the `project-harness` directory:

```bash
git pull --ff-only && npm run check:skills && npm run skills:package
```

**Expected result:** `Skills check passed (7 standalone, 1 repo-only)` and 7 zips written under `dist/skills/` (`architecture-reassessment-1.0.0.zip`, `change-impact-1.0.0.zip`, `docs-hygiene-1.0.0.zip`, `failing-test-first-1.0.0.zip`, `fresh-context-review-1.0.0.zip`, `owner-check-1.0.0.zip`, `task-handoff-1.0.0.zip`).

## Step 2 — Upload to Agensi

Upload each of the 7 zips from `dist/skills/` as a free listing on Agensi, with `https://github.com/voidbrain/project-harness` linked in the description for newer releases.

**Expected result:** All 7 listings are published and reachable.

## Record result

Reply with the 7 Agensi listing URLs and the uploaded version (`1.0.0`) so `F-075-T10` and `F-075` can be closed.
