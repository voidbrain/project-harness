# Maintenance enforcement and quality — 31 October 2026

Scope: F-026/F-028 follow-up and F-029, based on merged #52 (413b13a), whose CI 41223980633 passed. Prepared 2.3.0 remains untagged; cumulative 3.0.0 introduces a breaking adoption requirement rather than claiming a published intermediate release.

Maintenance check is required at startup, PR CI and a daily read-only scheduled job. It checks configured input/policy hashes, review age, outcome references and measurement evidence. Agents investigate candidates, implement/test justified rules/tools/skills through owned PRs, or record no-change/backlog reasons. Automated checks do not establish semantic truth and no agent runs when no execution host is active. No unattended policy rewriting or prompt scraping was added.

Timing start/finish derives actual wall-clock elapsed time, including waits; observed counters are optional/unknown. The current validation/reconciliation workflow was timed after implementation began; it is not presented as a full implementation-duration or productivity baseline. Receipts share reviewed aggregates only; raw logs remain ignored/local.

Coverage enforcement is opt-in with configured tolerance and a baseline read from origin/main, so editing the PR's baseline cannot approve its regression. Missing comparable evidence fails in enforced mode. Warning-only behavior remains the default for coverage. No arbitrary mandatory increase or claim that browser execution is counted in unit coverage.

Regression fixtures cover automatic timing/session preservation, stale/changed/missing maintenance receipts, foreign/missing outcomes, symlink ancestors, candidate signals, edited coverage baseline bypass and missing coverage. The scoped consistency review covers AGENTS/APPLY/README, shared/copy guides, workflows, stamp/scripts, backlog rules and prior audit evidence (unchanged). CI and release publication remain pending; no actual OpenBando gate or threshold was adopted here.

Final local validation: all 64 fixtures, template consistency, four active records/archive preservation, required maintenance evidence and impact-map parity passed. Startup freshness invokes the maintenance gate automatically for 3.0; legacy freshness findings still warn. The receipt records one real timed review/validation workflow with unknown counters preserved. Daily checks begin only after the workflow lands on the default branch.
