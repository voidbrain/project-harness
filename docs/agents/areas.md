# Project harness area notes

Rules and lessons per area of this repository. Read the section of the area you change; AGENTS.md applies to every task.

## Template content

- `core/` must stay true for any project: no stack, product or person in it. A stack rule goes in its stack folder.
- Every file a project receives is listed in `core/.harness.json` or a stack fragment, as `copied` (byte-identical) or `adapted` (rewritten for the project). A new template file is listed in the same change, or projects never hear of it.
- Placeholders are `{{NAME}}`; instructions to the applying agent are `<!-- harness: … -->`. Both must be gone from an applied project (APPLY.md, "Validate").
- Lesson: the first marginalia-wars application found that subagent files and an ESLint rule contradicted the Angular rules. APPLY.md now says to look for contradictions in existing agent and lint files, not only to add new ones.

## Tools

- Copied tools read their settings from the project's `.harness.json`, and work when a setting or a folder is missing (empty backlog, no `docs/audits/`, no framework-free layer).
- `check-harness` and `check-freshness` never fail; `check-backlog`, `check-conventions` and `check-template` do.
- `check-harness` compares against release **tags** only, after fetching them from GitHub; untagged commits on `main` are not a release.
- Lesson: OpenBando's own tools were swapped for the template copies and gave identical output (2026-10-29, openbando#195). Do the same before/after comparison for any change to a copied tool.

## Procedure

- APPLY.md is followed literally by agents: every step names its command or file, and it starts online (step 0).
- The `apply-harness` skill lives outside this repository (`~/.claude/skills/apply-harness/SKILL.md`); a procedure change here updates it in the same session.
- Versioning follows the CHANGELOG preamble. A release that changes a copied tool is at least minor.
