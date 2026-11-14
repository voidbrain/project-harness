# Area notes: maintenance tools and rule review

Part of the [area notes](areas.md); moved unchanged (F-078).

## Maintenance tools and rule review

`core/tools/reconcile-preview.mjs` is read-only; fixture tests compare source/project contents before and after. `friction.mjs` writes only explicit numeric observations to the ignored local log, rejects symlink destinations and never uploads. Test unknown values, invalid/duplicate flags and damaged logs. Maintenance guidance owns consolidation traceability; no shortened starting rule set or automatic rule expiry is permitted.

Maintenance enforcement (3.0): check inputs/policy hashes, age and owned outcome references at session/CI/daily boundaries. Timed workflow start/finish preserves unknown counters; never scrape conversations or infer useful work from elapsed time. Candidate rules/tools/skills are reviewed outcomes, never self-issued authority. Coverage enforcement is opt-in, compares main-branch baseline and does not demand growth on every PR.

Scope-aware audits: core/tools/check-audits.mjs owns area/result validation and freshness; the shared audit guide owns procedure. Test full versus scoped and blocked/NA behavior, legacy prose, missing manifests, future dates and unsafe report paths. Never rewrite historical audit prose to manufacture coverage.
