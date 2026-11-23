---
name: fresh-context-review
description: Run an independent, read-only fresh-context review of a diff or PR using either the design reviewer (behaviour, security, migrations, lifecycle) or mechanical reviewer (byte copies, version bumps, pure reformats). Works standalone in any repository.
metadata:
  version: "1.0.0"
---

# Fresh-context review

Version: `1.0.0` · Releases: https://github.com/voidbrain/project-harness

Review a change from a fresh context without the author's assumptions. The reviewer reports findings only and never edits, commits, pushes, approves, or merges.

## Choose the reviewer mode

- **Design review**: Use for any change touching behaviour, logic, safety rules, security, privacy, data migrations, or service/process lifecycle.
- **Mechanical review**: Use only for pure byte-for-byte file copies, version-only bumps, AST-preserving reformats, or regenerated views. If judgment about behaviour, design, or safety is needed, stop and switch to Design review.

## Design review checklist

1. Read the repository's instructions and the task's acceptance criteria before inspecting the diff.
2. Inspect the full diff and trace representative execution, error, and recovery paths.
3. Check for:
   - Logic bugs, unhandled edge cases, and broken caller/callee contracts
   - Security and privacy issues (secrets, personal data, path traversal, unsanitized inputs)
   - Rule violations or claims in documentation or records that the code or test output does not support
4. Verify with read-only commands or isolated temporary-directory experiments. Never touch live data, running services, or the main checkout.
5. Report under **500 words**:
   - **Blockers** (each with a concrete failing scenario and `file:line` or command evidence)
   - **Should-fix** (with `file:line` or command evidence)
   - **Notes** and **Not verified** (explicitly state anything you could not run or verify)

## Mechanical review checklist

1. Run only the exact verification commands listed in the review request (e.g. diff against source tag, formatter check, syntax check).
2. Report each check with its exact command, observed output, and `pass`, `fail`, or `not verified`.
3. Never report an unrun check as passed. Keep the report under **250 words**, blockers first.
