---
name: docs-hygiene
description: Keep repository documentation concise, accurate, and free of stale claims by keeping entry points short (~150-200 lines), moving deep details to topic files, and documenting shipped behaviour only. Works standalone in any repository.
metadata:
  version: "1.0.0"
---

# Documentation hygiene

Version: `1.0.0` · Releases: https://github.com/voidbrain/project-harness

Keep documentation easy to navigate and strictly aligned with shipped behaviour.

## Rules

1. **Keep entry points concise**: Top-level docs (`README.md`, installation guides, style guides, contributing/agent guides) should stay around **150–200 lines max** and act as structured entry points.
2. **Move depth into topic files**: Put feature-specific, platform-specific, or deep technical details in dedicated files under a topic directory (such as `guides/`, `design/`, or `architecture/`) and link to them from the entry point.
3. **Document shipped behaviour only**: Keep general docs free of internal task/bug IDs and "planned / not yet shipped" lists. Track planned work in the backlog/issue tracker and link to it where needed.
4. **Check consistency on every modification**: Even for a small or doc-only change, check `README`, contributor/agent instructions, style guide, and linked guides for any affected claims, rules, links, or exceptions, and update them in the same PR.
5. **Preserve dated history**: Keep historical archives and dated audits append-only and dated rather than rewriting them as current verification.
6. **Verify links and structure**: After editing docs, confirm all relative links resolve and tables/headings remain valid.
