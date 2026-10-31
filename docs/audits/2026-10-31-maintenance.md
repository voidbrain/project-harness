# Maintenance improvements — 31 October 2026

Scope: F-026/F-027/F-028, on main a1e3f3a. This is a scoped review, not a repeat of the full audit or evidence of consumer adoption.

Implemented optional local friction recording/reporting, a read-only reconciliation preview, and audit/event-triggered rule consolidation. All applicable rules remain mandatory from the start. No shorter rule tier, automatic telemetry, service installation or automatic rule expiry was introduced.

## Initial consolidation review

| Locations reviewed | Decision and requirement preserved |
|---|---|
| AGENTS and APPLY | Keep AGENTS as binding project-work entry and APPLY as adoption/release authority. The maintenance guide owns detailed measurement/preview/review procedure; summaries link there. No permission or release rule moved into a helper. |
| README and maintenance guide | README describes capability and links the authoritative procedure. Avoid reproducing measurement definitions in multiple normative places. |
| BACKLOG-RULES and new outcomes | Existing lifecycle/ownership rules stay unchanged. F-026/F-027/F-028 own implementation/release acceptance; routine review steps are not new checklist IDs. |
| Template and applied copies | Intentional copies remain stamped byte-identical; this is distribution, not redundant authority to delete. |
| Privacy/evidence/ownership safeguards | Retained. No age or trigger-frequency evidence justifies deletion. |

## Validation and limits

Template consistency, backlog/archive preservation and 59 fixture tests passed. New cases cover read-only preview state, copy/conflict/adapted/missing/base-unknown handling, invalid paths and CLI flags, numeric measurements, missing versus zero, damaged logs and dangling symlink write refusal. Fixtures use temporary repositories and no consumer or credentials. No real adoption duration or productivity gain is claimed; those require future observed samples with consistent boundaries. Preview reports conservative classifications and marked rules, not semantic proof or an automatic merge.

Actual CI, merge and v2.3.0 publication remain required before closing these outcomes. README, AGENTS, APPLY, stamp/scripts, template/distributed guides, area notes and backlog rules were reviewed; ownership and all startup requirements are preserved. Existing audit evidence remains dated and unchanged.
