# Rule-load split plan for APPLY.md and three routes (F-078-T01), 2026-11-14

**Status: proposed, awaiting the owner's approval (D1–D6).** No rule text moves before approval (AGENTS: never rewrite governing rules unattended).

Counts are tokens by `node tools/rule-load.mjs --sections` (characters ÷ 4) on `main` after v8.12.0 and F-077. Budgets (F-076, D1): a procedure file ≤ 2,000; always loaded plus one route's reading ≤ 5,000. In this repository the always-loaded text is 3,440, so one route can read about 1,560.

## Where the tokens go today

| Route (AGENTS procedures table) | Reads | Tokens with always-loaded |
|---|---|---:|
| apply, reconcile or release the harness, or take a change asked from a project | APPLY.md (14,781) | 18,221 |
| change something another output is derived from | change-impact.md (690) + impact-map.md (1,231) | 5,361 |
| switch independent tasks or compact/handoff context | task-context.md (1,760) | 5,200 |
| change template content, tools or procedure | areas.md (1,587) | 5,027 |

Inside APPLY.md, **5,700 of its 14,781 tokens are per-version upgrade notes** (2.0.0 to 8.6.0) that a project reads only when it crosses that version. The reconcile procedure itself (statuses, then version and record) is about 410 tokens. "3. Write the files" is 3,125, of which "Lint and format config" alone is 650.

## Decisions for the owner

| # | Decision | Proposed |
|---|---|---|
| D1 | `APPLY.md` keeps its path as an index | It lists each route with its file, and names where every former heading went, so citations such as APPLY.md, "Reconciling" or "Project overrides" still resolve. The headings move verbatim to `docs/apply/`. |
| D2 | Version notes leave the reconcile procedure | Moved verbatim, newest first within each file, to `docs/apply/upgrades/`: `8.md` (8.0–8.6, 912), `6-7.md` (887), `5.3-5.6.md` (925), `5.0-5.2.md` (635), `4.md` (about 1,150), `2-3.md` (about 1,420). `reconcile.md` says: read only the files after the version in your `.harness.json`. Future notes go into the file of their major line. |
| D3 | One AGENTS row becomes routes by step | adopt (steps 0–2, 4–5); write the instruction and doc files; write tools, scripts and lint config; write CI, impact, coverage, guard and dotfiles; optional adoptions (two files); reconcile; upgrade notes; project overrides and changes asked from a project. Each route stays within 5,000. The template-release steps stay where they are (this repository's AGENTS and area notes). |
| D4 | Task context | "Prompt caching and actual cost" (344) moves verbatim to `docs/agents/prompt-caching.md` (template and here) with its own row, "compare prompt caching or model cost". `task-context.md` drops to about 1,416 (route 4,856). |
| D5 | Area notes are read by section | The "change template content, tools or procedure" row becomes rows that name the section, as `mcp.md "In short"` already does: tools → `areas.md "Tools"` (516), procedure → `"Procedure"` (314), and so on. No text moves; the largest route reads about 550. |
| D6 | The impact map is a lookup | The "change something another output is derived from" row reads `change-impact.md` only (route 4,130). `check:freshness` already prints each impact row a branch triggers, with its action; the generated `impact-map.md` page stays for looking a row up. |

## APPLY.md: the new files

| File (under `docs/apply/`) | From APPLY.md | Tokens | Route reads it when you |
|---|---|---:|---|
| `APPLY.md` (index, root) | new | ~300 | apply, reconcile or release (then one file below) |
| `adopt.md` | 0. Online first, 1. Read the target, 2. Choose the stack add-ons, 2a. MCP recommendations, 4. Validate, 5. Report | 1,168 | adopt the harness |
| `write-docs.md` | 3. Write the files: CLAUDE.md … README.md | 910 | write the instruction and doc files |
| `write-tools.md` | 3.: tools/, .harness.json, Quiet tests, package.json scripts, Lint and format config | 1,145 | write the tools, scripts and lint config |
| `write-ci.md` | 3.: CI, Impact map, Coverage, Push guard, .claude/agents/, .gitattributes, .gitignore, .npmrc | 1,075 | write CI, impact, coverage, guard and dotfiles |
| `optional-a.md` | Required steps and conditional work, 2b. Solution profile, 2c. Skills | 1,277 | decide what an adoption includes |
| `optional-b.md` | Parallel work, scoped verification, maintenance enforcement, task context, scope-aware audit | 1,368 | adopt one of those options |
| `reconcile.md` | Reconciling (procedure and statuses), Reconciliation preview and friction, Updating GitHub Actions pins | ~750 | reconcile with a newer release |
| `upgrades/*.md` | the per-version notes (D2) | 635–1,420 each | cross that version |
| `overrides.md` | Project overrides, Changing the harness from a project | 1,157 | keep a project-only change, or take a change asked from a project |

Every route then reads at most about 1,560 tokens on top of the always-loaded text: **at most about 5,000, against 18,221 today**. The per-file warning on `APPLY.md` goes away.

## How the next steps prove nothing was lost

- A traceability table (`docs/design/apply-split-traceability.md`) lists every paragraph and bullet of today's APPLY.md, and the moved task-context section, with its new file and heading; a script checks that every sentence is still present.
- `check:rules`, `check:template` (root docs and links) and `check:rule-load` pass, the last with no warning for these routes.
- `rule-load` numbers before and after go in the CHANGELOG entry; projects get a reconcile note: AGENTS rows and `session-start.md` point to `docs/apply/reconcile.md`.
- A fresh-context review compares the old text with the traceability table before release.

## Proposed steps after approval

| Step | Work | Estimate |
|---|---|---|
| F-078-T02 | Owner approves or amends D1–D6 | 0.25 h owner |
| F-078-T03 | Split APPLY.md per D1–D3, with traceability and the routing rows | 1.5 h agent |
| F-078-T04 | D4–D6: prompt-caching file, section rows for areas, impact route | 0.5 h agent |
| F-078-T05 | Fresh-context review and release | 0.5 h agent |

## Not in this plan

The always-loaded text itself (3,440 of a 3,500 budget here) and the remaining files near 2,000 tokens (`records.md` 1,929, `review.md` 1,893, `work-usage.md` 1,771): they are within budget today.
