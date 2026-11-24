# Lean procedures: base and child files (F-093)

Every procedure file stays under the per-file budget (`rules.budgets.procedure`, 2,000 tokens) with room for its next edit. Like the lean AGENTS pass (F-090, [traceability](lean-agents-traceability.md)), a base file keeps its trigger and binding rules and links a child that holds the detail. Every moved sentence is verbatim; the only reworded sentence is listed below.

| Base (before → after, tokens) | Moved to child | What moved |
|---|---|---|
| `core/docs/agents/skills.md` (2,079 → 1,105) | `core/docs/agents/skills-discovery.md` (new, copied) | "Discover additional skills" with the OWASP AST10 checklist, verbatim |
| `core/docs/agents/work-usage.md` (1,961 → 1,438) | `core/docs/agents/work-usage-launch.md` (new, copied) | "Client instruction entry points" and "Explicit prelaunch registration"; one sentence reworded: "This guide owns the rule; AGENTS routes here" became "[Job usage] owns the rule; AGENTS routes there" (linking work-usage.md) |
| `core/docs/backlog/records.md` (1,943 → 1,266) | `core/docs/backlog/human-action.md` (new, adapted) | The human-action line and Issue / Reproduce / Check table bullet, verbatim |
| `core/docs/backlog/records.md` | `core/docs/backlog/estimates.md` (existing), "Effort" | The effort bullet, verbatim; the estimates trigger widens to "set effort" |
| `core/docs/backlog/review.md` (1,893 → 1,688) | `core/docs/backlog/ledger-header.md` (new, adapted) | The generated-header and "Other changes" bullets, verbatim |

Each base names its child in place of the moved text with the trigger to read it, [BACKLOG-RULES](../BACKLOG-RULES.md) routes to the backlog children ("change any record" names `human-action.md` and `estimates.md` "Effort", so the F-064 line update and effort reassessment are read on every record change), and the [procedure index](../agents/procedures.md) gains a skill-discovery row. Base and child are read together when both triggers apply; a child never defers a requirement of its base.
