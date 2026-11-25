# Optional adoptions

Part of the [harness procedure](../../APPLY.md). Read when you adopt one of these options.

## Optional parallel work adoption (4.2.0)

Copy `work-items.mjs`, `task-claims.mjs` and the parallel-work, architecture-review and procedures guides with their stamp mappings. The guides are discovery/procedure additions; record migration and claims remain opt-in. Add their procedure triggers to AGENTS and reconcile the source-aware BACKLOG-RULES paragraph, preserving all existing safeguards. Copy the package scripts and conditional CI check. No model, service, credential or repository setting is installed/changed by adoption.

For record/task adoption set `workItems` to `{ "enabled": true, "layout": "docs/work/layout.json", "records": "docs/work/records", "tasks": "docs/work/tasks", "profiles": "docs/agents/model-profiles.json" }`. Start with a reviewed clean ledger, run `node tools/work-items.mjs migrate` and verify exact byte preservation. Review unsupported layouts rather than discarding content. Seed a profiles file (`version: 1`, `profiles: []` is valid), add explicit reviewed tasks, and run `work-items check`, backlog/dependency/queue/roadmap checks. `work-items build` regenerates current status; archives stay untouched. Treat record sources as canonical in project rules. Add impact rows watching source records/tasks/profiles; generated views remain read-only. Required checks still run on adopters. Other projects need no migration or new fields to keep passing.

Before parallel work, review/create the dedicated claim registry once under the shared guide. Claims use normal authenticated Git fast-forward pushes and preserve existing push/archive safeguards. Synchronize clocks, stop on unknown ownership, and verify before mutations/push/integration. Expiry alone never proves work stopped. Do not merge the metadata branch or erase/reinitialize its fencing history. External/model adapters remain project-owned; unmeasured Gemma or other profiles stay candidates until evaluated. A shared release uses owned neutral fixtures and never waits for downstream adoption or model inference.

## Optional scoped verification (4.1)

Copy `core/tools/verification.mjs` and `core/docs/agents/verification.md`, add their stamp entries and `verification:plan`. Defaults stay disabled; no existing required check changes automatically. Read the guide, configure the project's source/risk/documentation patterns and affected groups, and map current impact obligations and acceptance checks before opting in. Preserve static/security checks, failing-test-first and independent-review requirements. A project without a complete mapping keeps full verification for unknown paths.

Reconcile AGENTS' blanket check list into the opted-in selection procedure; retain every command as an available full/affected check. Separate deterministic full checks from stress/model/device campaigns. Adapt CI with one PR trigger, manual full and weekly main checks, bounded read-only Actions history, stable required jobs and a full marker that cannot succeed after a partial/failed run. Settings/platform test execution belong to the project, not to copied tools. Verify the routing and full-marker contract with owned fixtures; do not change repository protection settings. A successful full PR run can reset freshness after merge without another main run when the exact tested head matches.

## Adopting required maintenance enforcement (3.0.0)

Copy maintenance/friction helpers and shared guide/workflow; merge check:maintenance and the PR CI check. Configure maintenance.inputs to the project’s actual governing files (adapted paths included), reviewDays and requireMeasurement; enable the gate. Start timing before reconciliation work, finish with observed counters, review the proposed changes, and record tested rule/tool/skill outcomes or owned backlog/no-change reasons. Generate the committed receipt with the reviewed outcome array and run check:maintenance. Retain all applicable starting rules. The daily read-only workflow checks between sessions, not an autonomous repair daemon. No API keys or new service is required. Coverage enforcement is a separate opt-in policy, with risk-based acceptance rather than universal percentage growth.

## Optional task context adoption (4.3.0)

Copy `core/docs/agents/task-context.md` to `docs/agents/task-context.md`, add its copied mapping and maintenance input, and carry the short AGENTS task-context trigger/paragraph plus the procedures-index row. Preserve every project rule and existing authorization. This optional workflow adds no required record fields or CI gates. It is procedural agent behavior: actual fresh-thread/compaction calls need a supported authorized host capability, and the fallback keeps work continuous when unavailable. No provider cache, host adapter, model runner or UI automation is installed. Validate handoff preservation, inspect actual host capability and retain honest unrun/unknown usage evidence. Existing projects need no migration to keep passing.

## Scope-aware audit adoption (3.1)

Copy check-audits and the shared audit guide; add check:audits plus CI/daily checks. Reconcile audit indexes and AGENTS to use per-area coverage, not the newest filename. Future audits write dated Markdown reports and manifests; reuse old evidence explicitly but do not rewrite published reports or invent a full scope for them. Due areas warn initially; opt into audit.enforce only after actual baseline coverage is established. The mandatory maintenance gate remains distinct.

## Optional work queue

Optionally adopt the work queue: copy `core/tools/backlog-queue.mjs` and `core/tools/backlog-dependencies.mjs` with copied mappings; register `check:queue` / `check:dependencies` from the script catalogue and include the conditional CI checks. With source-owned records, set `workItems.order: "queue"` so the ledger follows the queue, and `work-items build` shows Depends on and Unlocks in each record's summary table. Optional `workQueue.roadmap` selects a repository-relative placement table with Records and Scope or Acceptance columns. Author `Queue order` only to express a deliberate ordering, with a positive unique integer and reason. Run both checks after ledger edits and closure. A missing queue is valid for non-adopters; no behaviour runner is installed or inferred.
