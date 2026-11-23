---
name: architecture-reassessment
description: Run an evidence-based architecture reassessment when boundaries shift, recurring failures expose design assumptions, or hardware/dependencies change, including optional outside-landscape comparison. Works standalone in any repository.
metadata:
  version: "1.0.0"
---

# Architecture reassessment

Version: `1.0.0` · Releases: https://github.com/voidbrain/project-harness

Use this focused review when a system boundary changes significantly, recurring failures expose a design assumption, a dependency/hardware change opens a viable alternative, or the owner requests a review.

## Procedure

1. **Pin the baseline**: Record the repository revision, changed scope, and authoritative requirements.
2. **Compare code vs records**: Inspect actual code, architecture docs, decision records, roadmap, and active backlog. Distinguish shipped behaviour, intended work, hypotheses, and conflicts.
3. **Trace end-to-end paths**: Trace representative happy paths and failure/recovery paths, including ownership, privacy, permissions, state consistency, runtime resources, and deployment.
4. **Evaluate each material choice**:

| Question | Required evidence |
|---|---|
| What problem and constraints does this solve now? | Current requirements, measured behaviour, explicit limits |
| What assumptions justified the existing decision? | Original decision/source and whether assumptions still hold |
| Which contradictions or duplicated responsibilities exist? | Named code, documentation, or contracts and concrete conflicting behaviour |
| Which alternatives are viable, including previously rejected ones? | Current primary sources, compatibility, representative experiment if needed |
| Why retain or change? | Reliability/security/operability/cost benefit vs migration and maintenance cost |
| What would cause reconsideration? | Observable trigger, owner, and expected evidence |

5. **Preserve decision history**: Supersede a prior decision with a new dated decision rather than silently rewriting history. Keep rejected alternatives and original rationale intact.
6. **Outside-landscape comparison (optional)**: Run generic web searches (no project names, private data, code, or usage figures) of comparable systems and record a table with concept, disposition (`adopt` / `adapt` / `reject` / `watch`), entry level, rationale, and sources.
7. **Write the dated report**: Save a dated architecture review report (for example `<date>-architecture-review.md`) recording baseline, scope, inspected paths, evidence, exclusions, decisions (`retain`, `change`, `experiment`, or `defer` with a named blocker), findings, and next actions. Never treat a prose architecture discussion as a substitute for a full code/security audit or an automatic migration.
