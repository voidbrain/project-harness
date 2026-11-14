# What an adoption includes

Part of the [harness procedure](../../APPLY.md). Read when you decide which required and optional parts a project takes.

## Required steps and conditional work

This table clarifies the existing procedure; optional profiles and artifacts do not become new adoption gates. A required applicable step is performed, or its actual blocker and next action are recorded on the owning backlog outcome. Do not create one feature/bug per routine step. Record accepted deliverables and unresolved work at the start; put their acceptance checks in their records.

| Step | Trigger and obligation | Evidence / tracking |
|---|---|---|
| Read relevant code, rules and existing tooling | Required before proposing or changing the affected behaviour; first adoption reads the target baseline. | Report inspected scope; record unresolved findings on their owning outcomes. |
| Verify template source/release | Required for application, reconciliation and template changes, under step 0. | Name actual revision/tag and connectivity limits; no silent stale application. |
| Assess available and missing capabilities | Required at setup and relevant stack/workflow changes, scaled to the task. | Existing tools may suffice. Record selected recommendations/review evidence when useful; no mandatory marketplace search. |
| Recommend/configure/install MCPs or skills | Conditional on a useful gap and authorized host access. | Optional selections and setup evidence; missing optional tools do not block independent work. |
| Check rule/interface conflicts | Required when applying/reconciling instructions or changing a shared boundary. | Resolve discrepancies in the same change or record the owner/blocker. A separate conflict map is conditional on meaningful complexity; no empty-map requirement. |
| Map derived outputs and external dependencies | Required when the project has those relationships; maintain affected rows on changes. | Impact map and owned checks. Record a justified deferral; do not invent dependencies to populate a map. |
| Validate and reconcile evidence | Required checks follow the actual change/profile and owning record's acceptance. | Run applicable checks, distinguish pass/fail/unavailable, update backlog and affected docs. Optional runtime checks remain conditional. |

## 2b. Optional solution profile

Read [solution-profile guidance](../../core/docs/agents/solution-profile.md) when the owner has chosen multi-repository coordination. This profile does not require an MCP connection.

- **Coordinator repository:** when the owner has chosen a multi-repository solution, use a separate coordinator even for a small solution. Apply `core/`, then merge `solution/.harness.fragment.json`: concatenate stacks, merge copied/adapted entries and add `solution.role/manifest`. Fill `.solution.json` from the actual repositories, source refs and checkout layout; adapt `solution/docs/SOLUTION.md` to own contracts and integration acceptance. Copy the dashboard helper and merge the coordinator CI template (own backlog/integration metadata only; component availability is not a default gate). Node coordinators may merge `solution/package-scripts.json`. Add relevant catalogue selections at solution scope only when they benefit shared workflows.
- **Components:** apply their normal stack profile independently. A component can point `solution: {role: "component", id: "<manifest-id>", manifest: "../coordination/.solution.json"}` at available context. It keeps its own backlog and acceptance. Missing coordinator access does not block independent work. Do not apply a coordinator's availability checks as a mandatory component build gate.
- **Dashboard:** add qualified `Components` metadata links to solution-owned records. Provision authorized local component checkouts or deliberately use GitHub reads. Run the solution check and generate a snapshot; inspect revisions, local changes, missing links/sources and integration status. Never mirror editable component statuses or average percentages. Configure archive sources when linked records close. Snapshot refresh is deliberate and timestamped, not an automatic claim of live status.

A user-provided example is a design/fixture case. It does not authorize creating, repairing, adopting or releasing a real consumer solution. Generic acceptance uses this repository's fixtures and never depends on downstream adoption.

## 2c. Optional skills

Read [skill guidance](../../core/docs/agents/skills.md). Copy that guide and its stamp entry when adopting it. Use its AST10-mapped checklist when reviewing third-party skills; record the source revision, purpose, limits, fallback and AST IDs checked. AST10 is draft guidance until OWASP publishes a dated release. The shared `skills/apply-harness/SKILL.md` stays in the template repository; locate it at the reviewed template revision. Register/install it for the actual client only when needed and authorized, checking duplicate personal/project names and current discovery support. No skill installation is required to follow this procedure. Keep client-specific adapters thin; do not duplicate release or permission rules. Research additional skills only for a missing capability and inspect their sources before execution.
