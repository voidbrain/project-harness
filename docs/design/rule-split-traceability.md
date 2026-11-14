# Rule split traceability (F-076), 2026-11-14

Where each part of the old AGENTS.md (template) and BACKLOG-RULES went. A script compared every sentence of the old files with the new ones: all are present verbatim except the two dropped under the approved decision D3, listed below. Approved plan: [rule split plan](rule-split-plan-2026-11-14.md).

## BACKLOG-RULES sections

| Old section | New file |
|---|---|
| (introduction) | `docs/BACKLOG-RULES.md` (now the index) |
| One repository, one backlog (with Ownership rejection and dependency direction, Solution coordinators) | `docs/backlog/ownership.md` |
| When to update and review; Review procedure; Procedures and tracked outcomes | `docs/backlog/review.md` |
| Documentation consistency | `docs/backlog/documentation.md` |
| Record and evidence requirements (less the bullets below) | `docs/backlog/records.md` |
| Record and evidence requirements: "Independent review" | `docs/agents/pull-requests.md` |
| Record and evidence requirements: "Evaluation dependencies" | `docs/backlog/evaluations.md` |
| Record and evidence requirements: the human-action bullet's sentences about owner steps, the steps table, one actor per step and owner pages | `docs/backlog/steps.md`, "Owner steps and the steps table" |
| Linked prerequisites (optional); Optional work queue | `docs/backlog/ordering.md` |
| Visual cues and table integrity | `docs/backlog/records.md` |
| Closure and archives | `docs/backlog/closure.md` |
| Optional explicit tasks and source-owned records; Optional upfront feature plans | `docs/backlog/steps.md` |
| Optional upfront feature plans: "Estimate calibration" paragraph | `docs/backlog/estimates.md` |

## Second round: files over the 2,000 budget

Whole sections moved verbatim; each source keeps a "Moved to" pointer.

| From | Sections | To |
|---|---|---|
| docs/agents/parallel-work.md | Shared claims | docs/agents/claims.md |
| docs/agents/maintenance.md | Measure actual friction, Agent-behaviour checks, Periodic rule consolidation | docs/agents/rule-review.md |
| docs/agents/mcp.md | Project selections, Commands | docs/agents/mcp-commands.md |
| docs/agents/solution-profile.md | Refresh and verification, Adoption and CI | docs/agents/solution-refresh.md |
| docs/agents/audit.md | Findings and improvement proposals | docs/agents/audit-findings.md |
| docs/agents/work-usage.md | Subscription allowance snapshots, Save a private report, Selected native metadata adapters, Import actual counters | docs/agents/work-usage-sources.md |
| docs/agents/work-usage.md | Effectiveness observations (optional) | docs/agents/work-usage-effectiveness.md |
| docs/backlog/steps.md | Optional upfront feature plans | docs/backlog/feature-plans.md |
| docs/backlog/review.md | Procedures and tracked outcomes | docs/backlog/outcomes.md |

## AGENTS.md (template) paragraphs

| Old place | New place |
|---|---|
| Checks before you finish: "Open every PR against `main`…" | `docs/agents/pull-requests.md`, "Opening and updating a PR" |
| Checks before you finish: scoped verification bullet; independent review bullet | `docs/agents/pull-requests.md`, "Checks" |
| Work tracking: session-start paragraph, its finding list and the CI paragraph | `docs/agents/session-start.md`; AGENTS keeps one line |
| Work tracking: the BACKLOG.md / BACKLOG-RULES pointer bullet | `docs/BACKLOG-RULES.md` (index) |
| Task context section | `docs/agents/task-context.md`, "In short"; a table row |
| Development usage section | `docs/agents/work-usage.md`, "In short"; a table row |
| Routing row "update or close a backlog record" | Same row, now saying the index names the one file needed |
| Stack section from `angular/AGENTS.angular.md` | `docs/agents/angular.md` with a row "change Angular code" |

Stayed in AGENTS.md: the safety block, privacy, project conventions, the project command block (APPLY fills it per project; a copied procedure file cannot carry it), the always-on coding rules, "Changing a harness file", the procedures table, testing the joins, known pitfalls, area notes, and the work-tracking rules (ownership direction, bug/fix/check distinct, plan or promise becomes records).

## Dropped under D3

- "With source-owned records the generated ledger extends it (F-059) and merges Signal into Status (F-063): Status with its colour (`🔴 Open`), Priority, Effort, R…" — describes what `work-items build` generates; no agent action (D3).
- "In the generated ledger the kind moves into the summary table's Procedures and Decisions cells (🧑‍🔧 and 🤔 since 8.8.0; readers still accept 🧑) and the line …" — describes what `work-items build` generates; no agent action (D3).
