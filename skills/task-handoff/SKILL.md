---
name: task-handoff
description: Manage agent context boundaries cleanly across independent tasks, preserving repository state, active claims, running jobs, approvals, and privacy limits in concise handoffs. Works standalone in any repository.
metadata:
  version: "1.0.0"
---

# Task handoff and context

Version: `1.0.0` · Releases: https://github.com/voidbrain/project-harness

Keep agent context focused by choosing the right transition at real task boundaries and preserving authoritative state before switching or compacting.

## Choose at a real task boundary

| Situation | Context choice |
|---|---|
| Continue implementation, debugging, review fixes, or CI for the same outcome | Keep the current thread; a new message or retry is not a new job |
| Start a different independent task after current state is saved | Prefer a fresh thread (if supported by the host) with a concise handoff |
| Continue the same task near a context limit | Compact after preserving unresolved state; it remains the same task |
| Fresh-thread/compaction tools are unavailable | Note the limit briefly, keep context focused, and continue authorized work |

## Preserve the handoff before transitioning

Update the owning task/backlog and evidence first, then write a concise handoff naming:

1. **Identity & workspace**: Repository, task ID, base revision, branch/worktree, and uncommitted/changed files (preserve uncommitted work deliberately).
2. **Scope & rules**: Goal, acceptance criteria, accepted decisions, and task constraints with links to their sources.
3. **Verification state**: Checks actually run and their results, remaining checks, PR/CI links, blockers, and next authorized action (never mark unrun checks as passed).
4. **Concurrency & side effects**: Active claims/leases, running background jobs, pending approvals, and uncertain external effects.
5. **Boundaries**: Privacy/data-location limits, cost limits, and owner decisions.

Keep credentials, private prompts, conversation dumps, and personal/session content out of committed handoffs. On resume, reload repository rules and revalidate claims and approvals before writing.

See [handoff-template.md](templates/handoff-template.md) for a copy-paste handoff structure.
