# Full harness audit — 14 November 2026

Full audit of all eight areas at baseline `f209f34` (main after [#173](https://github.com/voidbrain/project-harness/pull/173), release v8.12.0 plus F-077-T01). Manifest: [2026-11-14-full-harness.audit.json](2026-11-14-full-harness.audit.json). Previous full audit: [2026-10-31-full-harness.md](2026-10-31-full-harness.md) at `da37088`; scoped since: [2026-11-07-ci-cd-security.md](2026-11-07-ci-cd-security.md).

## Assessment

The template is in good order. Every deterministic check passes at the baseline; all 135 PRs merged since 31 October merged on all-success checks; no secret, personal data or unpinned action was found. The findings are small: one dead export, a misleading drift message inside the template repository, rule-load budgets left over from F-076 without an owning record, a stale GitHub "Latest" release, and a moderate dev-only advisory. The audit was triggered by `audit.enforce`: the 7-day interval ran out today and every PR's `check:freshness` failed (first seen on [#174](https://github.com/voidbrain/project-harness/pull/174)).

## Scope and method

- **Change set since the last full audit:** 118 first-parent merges, 283 files, +31,415 / −2,278 lines (v4.x → v8.12.0): source-owned records and tasks, claims, work usage, verification planning, rule split (F-076), quiet outputs (F-077-T01).
- **Automated:** every `check:*`, `test:tools`, `lint`, `format:check` script at the baseline, timed and with warnings counted. `npm audit`. `gh` history of CI runs and merged PRs since 2026-10-31.
- **Scans:** TODO/FIXME markers; `shell: true` and string `execSync`; tools without a test that names them; exports used by no other file and their internal use; relative Markdown links outside archives and audits; `npm run` commands named in README, APPLY and AGENTS against the scripts; secret, key and e-mail patterns; workflow triggers, permissions and action pinning; network calls in tools and their input validation.
- **Paths traced in use this session (logic):** freshness → maintenance receipt → harness drift; `ci-status`; `merge-when-green` (stopping on a failed check, #174); `task-claims` acquire/release; `work-items build/check/tasks`; archive closure and recap regeneration ([#172](https://github.com/voidbrain/project-harness/pull/172)); `verification.mjs` against this repository and an adopted project (read-only).
- **Backlog:** both active records (F-075, F-077) and their 17 steps; the header against main.

## Results by area

| Area | Result | Evidence | Limits |
|---|---|---|---|
| code | checked | No TODO/FIXME; every core tool is named by a test; one dead export (`RECORD` in `work-items.mjs`, F1); 18 other exports are used inside their own file; one `shell: true`, on the owner-configured tokenizer command in `rule-load.mjs` (context A1). | Static scans and targeted reading, not a full line review of 31k changed lines. |
| logic | checked | Traced paths above behaved as specified; the one surprise was the drift advice inside the template (F2). | No consumer adoption run; prose rules checked by `check:rules`, not proved. |
| tests | checked | `test:tools` 234 pass, 0 skipped, 0 todo, 42 s; fixtures invented. | No coverage measurement for tools; live `gh` paths covered by fakes. |
| documentation | checked | No `npm run` reference to a missing script; README 160 lines, STYLE-GUIDE 70; `check:template` links consistent. The only unresolved relative links are in `solution/docs/SOLUTION.md`, which resolve in an adopting solution (A2). APPLY.md is 304 lines and 14.6k tokens (F3). | External URLs not fetched. |
| harness | checked | `check:rules`, `check:maintenance`, `check:template`, `check:tooling` pass; `check:rule-load` warns on 5 budgets (F3); drift warnings for unreleased F-077-T01 files are expected until F-077-T07 releases them (F2). | Rule semantics reviewed by sampling, not exhaustively. |
| security | checked | No secret or personal-data pattern; workflows declare `permissions`, read-only maintenance; every action pinned to a commit SHA; no `pull_request_target`; network calls go to fixed hosts with validated `owner/name` and encoded paths and 15 s timeouts. `npm audit`: moderate minimatch ReDoS through eslint, dev-only (F5). | Not a penetration test; advisories as of today. |
| delivery | checked | Tags v8.9.0–v8.12.0 each have a CHANGELOG entry; 2 merges after v8.12.0, unreleased (F-077). Daily maintenance workflow green through 2026-11-13. GitHub Releases stop at v6.0.0, shown as Latest (F4). CI runs Node 22, local Node 26; no `engines` field; both pass. | Release tooling relies on tags; no artifact signing in scope. |
| backlog | checked | `check:backlog`, `check:work`, `check:dependencies`, `check:queue`, `check:archive-recap` pass; F-077-T01 estimate stale (F6, fixed here); F-076's archive entry does not name #172 (F7, dated note here); header behind by #172–#173 (reconciled here). | Foreign records excluded. |

## Findings

| # | Classification | Area / location | Evidence | Impact / confidence | Recommendation | Owner |
|---|---|---|---|---|---|---|
| F1 | Confirmed defect (dead code) | code / `core/tools/work-items.mjs:7` | `export const RECORD` has no use in any file. | Low / certain | Remove with the next change to the file. | Fixed in the F-077-T04 PR. |
| F2 | Confirmed defect | harness / `core/tools/check-harness.mjs` | In the template repository (HARNESS_HOME is itself), unreleased edits to copied files print "differs from template … a generic improvement goes back into the template", advice that cannot apply there; 4 such lines per session and CI run. | Low; noise and confusion / certain | Inside the template, report unreleased copies as one line naming the release that will carry them. | B-020 |
| F3 | Missing agreed work | harness, documentation / `APPLY.md`, rule-load triggers | `check:rule-load`: APPLY.md 14,603 tokens (budget 2,000 per file); 4 triggers over 5,000 (apply/reconcile 18,043). F-076's PR named this follow-up work but no record owned it. | Medium for small-context models / certain | Split APPLY.md by trigger and route the 4 triggers to smaller files. | F-078 |
| F4 | Annotation, owner decision | delivery / GitHub Releases | `gh release list`: Latest is v6.0.0 (2026-11-12); tags reach v8.12.0. No procedure or tool uses Releases. | Low; visitors see an old version / certain | Owner chooses: publish a Release per tag from the CHANGELOG, or remove Releases and rely on tags. | F-079 🧑 |
| F5 | Clue (dependency advisory) | security / `node_modules/minimatch` 10.2.6 via eslint 10.14.0 | `npm audit`: GHSA-g3hv-75wg-m249, moderate; fix only via `--force`. | Low: dev-only lint with repository-controlled patterns / high | No action now; recheck at the next audit or eslint upgrade. | Report-only (not actionable without a breaking downgrade). |
| F6 | Confirmed defect (record) | backlog / `F-077-T01` | `check:work`: actual 1 h plus remaining 1 h exceeds the 1 h estimate; the implemented step kept `agentHours: 1`. | Low / certain | Remaining 0 on an implemented step. | Fixed in this PR. |
| F7 | Confirmed defect (record) | backlog / archive F-076 | The closure PR #172 is not named in F-076's evidence (a failed follow-up commit, 2026-11-14). | Low / certain | Dated addendum in the archive; archive lines stay unchanged. | Fixed in this PR. |

## Context and proposals

- **A1 (context):** `rule-load.mjs` runs `--tokenizer` / `rules.tokenizer` through a shell by design; the command comes from the owner's configuration or command line, never from repository content read at run time.
- **A2 (context):** template files under `solution/` and `core/` link to paths of the adopting repository; a link scan of the template must skip them.
- **P1 (repeated friction, proposal):** the maintenance receipt requires a recent local friction sample, kept in the ignored `.harness/friction.jsonl` of one clone; each new worktree lacks it, so a receipt there fails until the file is copied (three times on 2026-11-14). Every PR that touches a maintenance input also rewrites `docs/agents/maintenance-review.json`, so parallel PRs conflict on it. Value: fewer stalls and conflicts. Options: read the sample from the main worktree (`git rev-parse --git-common-dir`), or record the sample's aggregate in the receipt. Success: a receipt from a fresh worktree passes without copying files. Not accepted work; the owner decides whether to open a record.
- **P2 (housekeeping):** 9 local worktrees from earlier sessions remain under `project-harness.worktrees/` and `project-harness-conflicts` holds uncommitted edits. Local only; not deleted because this session did not create them.

## Checks performed

Baseline `f209f34`: `check:template`, `check:backlog`, `check:harness`, `test:tools` (234), `check:integrations`, `check:maintenance`, `check:archive-recap`, `check:rules`, `check:tooling`, `format:check`, `lint`, `check:dependencies`, `check:queue`, `check:work`, `check:rule-load` exit 0; `check:freshness` and `check:audits` exit 1 only for the due audit this report resolves.

## Remaining actions and limits

B-020, F-078 and F-079 are open with a first step each; F-077 continues. No audit finds every defect: this one sampled the 31k-line change set through checks, scans and traced paths, and did not review every line.
