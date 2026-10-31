---
name: apply-harness
description: Apply or reconcile the project harness, or prepare a harness template release. Use when explicitly asked to adopt or update the harness, or to resolve a reported template conflict.
---

# Apply the project harness

Locate the requested target repository and the authoritative template repository, `https://github.com/voidbrain/project-harness`. Use the target's `.harness.json` template configuration when present; otherwise use an existing checkout with that origin or obtain one through available Git/GitHub tools. Do not assume a home directory, operating system or particular checkout path.

Read the target's `AGENTS.md` and the template's `AGENTS.md`, `README.md` and `APPLY.md` before changing files. Follow `APPLY.md` for application, reconciliation, project overrides and template releases. Those documents own the procedure; this skill adds no release, permission or backlog rules. Existing user authorization continues to apply.

Verify the template source and release as APPLY.md requires. If connectivity is unavailable, report that application/reconciliation is blocked under its current online-first policy. Ordinary project work follows its own rules. Do not silently apply cached or untagged files as a published release.

Read the target before adapting files. Classify generic changes in the template and project-specific changes in the project. No derived project is an authority for missing template rules or a prerequisite for a master release. Report unresolved ambiguities against the owning repository.

Use available host capabilities; command examples do not require a particular CLI when an equivalent authenticated operation is available. Report the actual checks performed and their evidence. Never claim installation, client discovery, connectivity, merge or tag publication without verifying it.
