# Full harness audit — 2026-11-22

- **Kind:** `full`
- **Baseline:** `364274a22645a4f4a53d91f925b8db522201b62e` (`main`, `v10.1.0`, PRs #209–#224)
- **Manifest:** `docs/audits/2026-11-22-full-harness.audit.json`

## Summary

All eight audit areas checked against `main` `364274a`. No blocking defects found. One existing advisory warning (`docs/agents/rule-review.md` trigger at `5,066` vs `5,000` token budget) and three dev-only `minimatch` moderate advisories (`eslint` transitive dependency) are recorded below.

## Results by area

| Area | Result | Checks & evidence | Limits |
|---|---|---|---|
| `code` | `checked` | `npm run format:check` and `npm run lint` (`eslint -c eslint.config.mjs .`) passed with 0 errors/warnings across all root and `core/` tools. | Static scans and targeted reads, not a line-by-line review of all tools. |
| `logic` | `checked` | `npm run check:template` passed (`Template 10.1.0: version, copied tools, stamps, 88 root docs and their links are consistent`); `check:work`, `check:dependencies`, `check:queue` passed. | Paths verified via tool runs and tests; no external consumer adoption run in this audit. |
| `tests` | `checked` | `npm run test:tools` passed **273/273** tests across all 19 tool test suites in `tools/test-*.mjs`. | Live `gh` / remote operations covered by fakes/stubs. |
| `documentation` | `checked` | `check:template` verified all 88 root docs and links; `check:rules` verified 51 procedure docs add no undeclared never/ask-first rules and all `AGENTS.md` links resolve. | External URLs in review docs not fetched live beyond search grounding. |
| `harness` | `checked` | `npm run check:rules` and `npm run check:rule-load` ran (`3,483` always-loaded tokens; 15/16 triggers under `5,000`; `rule-review.md` trigger at `5,066` advisory warning); `npm run check:maintenance` verified 39 outcomes, 0 open candidates. | Rule semantics sampled via automated checks. |
| `security` | `checked` | `npm audit --audit-level=moderate` reported 3 moderate `minimatch` advisories (`GHSA-g3hv-75wg-m249`) transitive under dev dependency `eslint`; zero runtime/production dependencies in `project-harness`. | Advisories as of 2026-11-22; not a penetration test. |
| `delivery` | `checked` | `npm run ci:status -- 209..224` confirmed all 16 merged PRs passed CI; `npm run check:tooling` verified `format:check` and `lint` in CI. Noted `.github/workflows/ci.yml` only triggers on `pull_request` (push-to-main trigger tracked separately). | No artifact signing in scope. |
| `backlog` | `checked` | `npm run check:backlog` and `npm run check:archive-recap` passed (`1` open record `F-075`, `108` tasks); header reconciled to `364274a`. | Own repository records only. |

## Findings

1. **Advisory — `rule-load` trigger over budget**: `docs/agents/rule-review.md` (`1,583` tokens, `5,066` combined) exceeds the `5,000`-token trigger budget by 66 tokens (`check:rule-load` warning). Tracked in `docs/reviews/token/2026-11-22.md`.
2. **Advisory — dev dependency `minimatch` (`GHSA-g3hv-75wg-m249`)**: 3 moderate advisories in `@eslint/config-array` -> `minimatch`, fixable only via `eslint@10.15.0` major bump outside current range; no production runtime impact.
