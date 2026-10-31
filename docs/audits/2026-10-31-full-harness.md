# Full harness audit — 31 October 2026

Baseline: `da37088f63c7a7b80a7af69da7e2f0039132ab05` (merged #54), plus the corrections described below. This is a full review of the eight areas in the [audit procedure](../agents/audit.md), not a guarantee that every defect has been found. Outcome: F-031. The earlier [full audit](2026-10-31.md) and [scoped procedure review](2026-10-31-audit-procedure.md) remain unchanged historical evidence.

## Assessment

The harness has useful ownership boundaries, neutral fixture repositories, protected archive history and explicit evidence limits. It is not complete merely because CI is green: this review reproduced two defects in existing checks and found stale summaries after maintenance enforcement was added. Both defects are fixed and regression-tested in this change. Release publication and downstream adoption remain separate from implementation and audit completion.

## Scope and method

Read all reusable tool implementations, root and core agent/application/backlog/style/area guidance, profile and shared-skill contracts, stamps, workflows and active backlog records. Trace release comparison, fork merge, freshness, maintenance receipt generation/checking, coverage enforcement, dashboard snapshots and write protection, MCP metadata/config output and backlog preservation. Run repository-owned fixtures and structural checks; inspect actual merged PR CI through the authenticated GitHub connector. The `gh` CLI was not used or claimed.

The earlier full report's vendor-source review is reused only for unchanged catalogue entries and unchanged version-qualified guidance. The catalogue is unchanged against its `72e223d` baseline; the Angular instruction delta only adds clarification of installed-version detection. This review does not claim a new live client/vendor compatibility matrix. Current files and fixture behavior were re-inspected. No consumer repository was changed or required for acceptance.

| Area | Inspection and result | Limits |
|---|---|---|
| Code | Read every `core/tools/*.mjs`, template consistency and Angular convention checks; inspect child-process, file read/write and cleanup paths. Search tools/templates/workflows for TODO/FIXME/HACK/XXX, skipped/exclusive tests, eval, shell:true and execSync: no matches. Remove unused `basename` import in the audit helper. Fix B-013. | Text/export reference review is not a whole-program proof; dynamic CLI behavior and host differences remain. Legacy freshness and backlog-layout compatibility are deliberate, not removed as old code. |
| Logic | Trace copied/forked/adapted comparison, preflight-before-write, baseline folder comparisons, audit full/scoped/blocked/NA selection, input-bound receipts, impact chains, immutable remote snapshots and ownership boundaries. Fix B-014 with aggregate coverage deliberately held constant. | Trust in reviewed prose, policy edits and baseline truth remains semantic. Dirty dashboard sources are marked, non-atomic snapshots. Impact cycles terminate but cannot define a valid dependency order automatically. |
| Tests | All 72 helper fixtures pass locally on Node 24.22.1/Linux. New path and coverage regressions each fail on the original implementation and pass after correction. Existing fixtures exercise tags/conflicts, archives, head-bound merge requests, profile parsing, offline/invalid flags, symlinks, timed measurements and missing/stale evidence. | Fixtures/mocks are not live gh execution, every API page/rate limit, a full Angular compiler/app build, browser/a11y, desktop MCP or device acceptance. No repository-wide code coverage percentage was generated; fixture counts are not coverage. New PR CI is recorded separately. |
| Documentation | Review README/APPLY/AGENTS, own/core backlog rules, maintenance/audit/MCP/solution/skill guides, core UI/style skeleton, Angular and solution add-ons, stamps and workflow names. Correct newest-file freshness, never-fails summaries, optional timing language, an untagged example target and a consumer-trial ambiguity. Preserve historical audits/archives. | This repository ships Markdown/templates, not product guide films or app UI. Real consumer media and accessibility checks belong to their owners. Local link checks do not establish every external URL or client discovery behavior. |
| Harness | Check source ownership, copied parity, release/stamp/script consistency, tool input boundaries, authorized delivery and rule consolidation. Enable overdue-audit enforcement here after establishing actual full coverage; consumer defaults remain independent. Review maintained measurements without claiming a productivity improvement. | Gates validate declared structure, hashes, age and references, not the truth or completeness of prose. CI is not an unattended repair agent. No new rule tier, skill or connection is installed. |
| Security/privacy | Review fork-merge writes (B-013), other helper path guards, neutral fixture data, local ignored numeric logs, credential-free metadata/config output, GitHub token use and read-only workflow permissions. Search tracked paths for .env/dependency/build artifacts: none found. No runtime npm dependencies or package lock are declared in this template repository. | Not penetration testing or an exhaustive secret scan. No dependency advisory claim: consumers supply their own locked dependencies. Git/action/Node and vendor services remain supply-chain inputs; Actions are version-tag references, not immutable commit pins. No external private data/device interaction. |
| Delivery/dependencies | Inspect own CI, daily workflow and Angular/solution CI templates. Confirm final #52, #53 and #54 runs successful; check actual published tags. Own checks need Node built-ins/Git, with gh needed by dedicated live CLI helpers. | Local Node 24 differs from CI Node 22; Windows/macOS are not live-tested. Latest observed tag is v2.2.2; cumulative 3.1.1 is a target, not a published release. Shell Git lacks write authentication and available connector tools cannot create tags. No repository setting or release permission was requested. |
| Backlog | Review all five prior active records F-026–F-030 against their acceptance and actual merged CI; replace stale pending-CI claims and unify the cumulative target. Add B-013/B-014 and F-031 with evidence/next actions. Validate layout and append-only archives. | Publication-dependent records cannot close before the tag. F-031 closes on its own report/tracking/green merged CI, independently of fixes' publication. Consumer reconciliation remains foreign work. |

## Confirmed findings

| ID / classification | Reproduction and impact | Correction / confidence |
|---|---|---|
| B-013 — confirmed defect, P1 | Configure a fork destination `../sibling/victim.mjs`, matching old template content plus a local edit; run `check-harness --merge`. The original tool returned success, rewrote the sibling and advanced its stamp. A symlink can cross the same write boundary. This requires running the explicit merge against unsafe project configuration; it is not evidence of remote unauthenticated exploitation. | Preflight all mapped paths before any project read/merge, rejecting traversal, Git metadata and symlink escapes; target and stamp remain unchanged in the fixture. Existing legitimate/conflicting fork tests still pass. High confidence. |
| B-014 — confirmed defect, P2 | Main baseline has folders A/B at 90%; current data measures 80%/100%, preserving 90% total. Remove A from configured display rows. Original enforced check returned success. | Compare every main-baseline folder even when omitted from display configuration. New fixture returns failure while warning-only mode stays compatible. High confidence. |
| Documentation drift — maintenance correction | README still selected newest audit; area notes/workflow names said freshness never fails; APPLY described optional timing after 3.0 made it required; preview examples targeted an untagged 2.3.0. Root backlog rules could imply a required pre-tag consumer trial. | Synchronize authoritative owners/summaries without weakening enforcement or starting rules. Use an actual published tag in examples, with instructions to choose the real target. Recorded under F-031; no redundant bug ID. |

Regression evidence: the original path fixture reported a clean external merge instead of rejecting it; the original coverage fixture exited 0 instead of 1. Both now pass against corrected tools. These are behavioral tests, not implementation mirrors.

## Rule consolidation traceability

| Old location / claim | Authoritative requirement preserved | Resolution and check |
|---|---|---|
| Area notes and freshness/coverage workflow names: never fails | Ordinary reminders warn; maintenance and configured evidence gates fail. | Update summaries and comments; fixture tests retain legacy warning compatibility and enforced failure behavior. |
| APPLY optional-record wording and maintenance examples | 3.0 adopted timing/review is required; observations must be real; preview only accepts a real tag. | Point APPLY to maintenance owner; update own/copied guide examples; parity/link checks verify synchronization. |
| Root backlog consumer-trial wording | Owned fixtures establish generic acceptance; completed consumer evidence may supplement it. | Explicitly make trials optional, retaining independent release ownership. No downstream gate introduced. |

No safeguard was removed for age or infrequent use. No new skill is justified: existing tools/procedure cover the identified friction. Broad refactoring solely to reduce line counts would add churn without demonstrated value.

## CI reconciliation

| Merged PR | Final run inspected | Result |
|---|---|---|
| #52 | [41223980633](https://github.com/voidbrain/project-harness/actions/runs/41223980633) | Success; preview/friction baseline. |
| #53 | [41226326072](https://github.com/voidbrain/project-harness/actions/runs/41226326072) | Success after fixing the earlier timer fixture; maintenance/coverage enforcement. |
| #54 | [41227408819](https://github.com/voidbrain/project-harness/actions/runs/41227408819) | Success; scope-aware audit procedure. |

New audit/fix PR CI remains separate until actually observed. Past green CI is not substituted for it. Earlier failed runs remain historical evidence rather than being rewritten as successful.

## Clues, annotations and value-based proposals

| Classification | Observation / value | Cost, risk, alternative and success criterion / disposition |
|---|---|---|
| Clue | Host-specific filesystem differences may affect path guards beyond Linux fixtures. | A Windows/macOS CI matrix could expose differences; cost is runner/maintenance time. Alternative: current Linux fixtures with explicit limits. Success: identical rejection/no-write and valid-merge contracts across selected hosts. Report-only proposal, not an accepted new workflow. |
| Improvement proposal | Repeated path/flag/JSON validation across small CLI helpers can drift; B-013 demonstrates the risk. | A small shared containment utility could reduce omissions, but adds another adopted/copied dependency and migration surface. Alternative: keep self-contained tools and add a contract matrix. Success: all read/write entry points share tested behavior without breaking copied-tool deployment. Report-only design option; no broad rewrite authorized. |
| Improvement proposal | Immutable Action SHA pins and automated update PRs would narrow supply-chain changes behind version tags. | Adds update/review overhead and requires owning update policy. Alternative: current major-tag actions plus explicit audit review. Success: supported pinned sources with timely reviewed updates and passing fixture CI. Report-only policy choice; no security guarantee or settings change. |
| Annotation | Native fixture execution is comprehensive for declared contracts, not the same as total line/branch or product coverage. | Retain this distinction; adding a coverage instrumentation report is optional until it answers a concrete gap. No arbitrary percentage target or mirror tests. |
| Annotation | A dated full report refreshes review coverage even when it discovers unresolved bugs. | Preserve independent B-013/B-014 release acceptance and per-project product checks. A full report never means defect-free. |

## Final validation and remaining actions

Local validation: 72 helper fixtures, template version/stamp/copied-file/syntax/local-link checks, integration metadata, backlog/archive preservation, unchanged impact-map regeneration and diff whitespace checks. Audit metadata and required maintenance receipt checks run after final governing-file updates. Results and new PR CI are retained in the PR/ledger.

Unresolved actionable findings are owned by B-013/B-014 (fixed, release pending), F-026–F-030 (implemented, release pending) and F-031 (this review/report, new CI pending). Next: inspect the new PR's actual CI, merge only on green, publish the cumulative release through an available authorized tagging path, then reconcile release-dependent records. No new comprehensive OpenBando audit, downstream adoption, browser/device or real MCP compatibility pass is claimed.
