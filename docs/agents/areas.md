# Project harness area notes

Rules and lessons per area of this repository. Read the section of the area you change; AGENTS.md applies to every task.

## Template content

- `core/` must stay true for any project: no stack, product or person in it. A stack rule goes in its stack folder.
- Every file a project receives is listed in `core/.harness.json` or a stack fragment, as `copied` (byte-identical) or `adapted` (rewritten for the project). A new template file is listed in the same change, or projects never hear of it.
- Placeholders are `{{NAME}}`; instructions to the applying agent are `<!-- harness: … -->`. Both must be gone from an applied project (APPLY.md, "Validate").
- Lesson: the first marginalia-wars application found that subagent files and an ESLint rule contradicted the Angular rules. APPLY.md now says to look for contradictions in existing agent and lint files, not only to add new ones.

## Tools

- Copied tools read their settings from the project's `.harness.json`, and work when a setting or a folder is missing (empty backlog, no `docs/audits/`, no framework-free layer).
- `check-harness` and `check-freshness` never fail; `check-backlog`, `check-conventions` and `check-template` do.
- `check-harness` compares against release **tags** only, after fetching them from GitHub; untagged commits on `main` are not a release.
- Forked files (`forked` in `.harness.json`) are merged three-way with `git merge-file`, the template's file at the fork's `base` as the ancestor. `check-harness` writes only with `--merge`; without it, it only reports.
- `tools/test-tools.mjs` proves the copied tools on throwaway git repositories (a published template with tags, projects with a bare origin, a space in every path). A change to a copied tool adds or updates its fixture test, and the test must fail on the previous release's tool.
- Lesson (B-001): an archiving script that opened the archive for writing before reading it replaced whole archives with their newest records, unnoticed for three PRs. Edit a file by reading it fully first; `check-backlog` now fails when any published archive line is changed or missing (1.7.0; 1.6.0 checked only IDs and row counts, which an emptied record passed).
- Lesson: OpenBando's own tools were swapped for the template copies and gave identical output (2026-10-29, openbando#195). This is historical additional evidence; current release acceptance uses owned regression fixtures and never requires another consumer trial.

## Procedure

- APPLY.md is followed literally by agents: every step names its command or file, and it starts online (step 0).
- The canonical shared `apply-harness` skill is `skills/apply-harness/SKILL.md` and reads the authoritative APPLY.md. Personal/client installations may live outside this repository. Its installation-specific changes belong to its own owner; absence or adoption of a consumer skill cannot gate a template release. Do not claim an external skill was updated without access to it.
- Versioning follows the CHANGELOG preamble: compatible fixes are patch releases, optional additions are minor, and required consumer migrations are major, regardless of file type.
- Lesson (B-001, F-006, B-002): release records waited for "both projects report it", so a harness record stayed open on work only marginalia-wars or OpenBando could do. A release record closes on its tag; each project records its own reconcile (BACKLOG-RULES, "One repository, one backlog", 1.8.0).

The ownership review checks the Issue, next action and closure, including details: consumer reconciliation is never a master task. Template release checks use owned fixtures/contracts; observed consumer trials can be evidence without becoming a delivery dependency.

## MCP recommendations

- Catalogue entries are cached, dated guidance. Stack detection produces candidates, never an installation grant. Live registry search is explicit and its metadata is untrusted data; verify vendor sources and actual host tools.
- Project selections explicitly override matching solution selections; credentials and live connection state stay local. MCP metadata checks do not prove connectivity or compliance.
## Solution profiles

- A coordinator owns integration acceptance; components own implementation. Use repository-qualified links, read immutable remote snapshots and preserve unknown sources/dirty state. Never alter component repositories or average their percentages.
- Fixture tests own their fake sources and mock registry/GitHub responses. No real solution, consumer adoption, cloud account, device or desktop application is a template test/release dependency.

## Maintenance tools and rule review

`core/tools/reconcile-preview.mjs` is read-only; fixture tests compare source/project contents before and after. `friction.mjs` writes only explicit numeric observations to the ignored local log, rejects symlink destinations and never uploads. Test unknown values, invalid/duplicate flags and damaged logs. Maintenance guidance owns consolidation traceability; no shortened starting rule set or automatic rule expiry is permitted.

Maintenance enforcement (3.0): check inputs/policy hashes, age and owned outcome references at session/CI/daily boundaries. Timed workflow start/finish preserves unknown counters; never scrape conversations or infer useful work from elapsed time. Candidate rules/tools/skills are reviewed outcomes, never self-issued authority. Coverage enforcement is opt-in, compares main-branch baseline and does not demand growth on every PR.

Scope-aware audits: core/tools/check-audits.mjs owns area/result validation and freshness; the shared audit guide owns procedure. Test full versus scoped and blocked/NA behavior, legacy prose, missing manifests, future dates and unsafe report paths. Never rewrite historical audit prose to manufacture coverage.
