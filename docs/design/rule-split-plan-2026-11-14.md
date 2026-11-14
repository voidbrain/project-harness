# Rule split plan (F-076-T02), 2026-11-14

**Status: approved by the owner on 2026-11-14 (D1–D5 as written).** Deviations in the implementation: the project command block stays in AGENTS.md (APPLY fills it per project); estimate calibration and documentation consistency got their own files to keep `steps.md` and `review.md` near the 2,000 budget; a second round moved whole sections out of every procedure file over 2,000 tokens (see the traceability map), so the template reports "within budgets". No rule text changes until it is approved (F-076-T03, F-076-T04 wait on it). Rule consolidation keeps every requirement: each one moves, or a checker that already enforces it replaces its prose. Nothing is dropped.

Counts are tokens by `node tools/rule-load.mjs --sections` (characters ÷ 4), on the template (`core/`) and on one adopted project (NERV).

## Where the tokens go today

| Reading | Template | NERV |
|---|---:|---:|
| Always loaded (AGENTS.md + CLAUDE.md) | 4,132 | 5,068 |
| Updating or closing a backlog record (adds all of BACKLOG-RULES) | 15,300 | 16,308 |
| Any other trigger (adds one procedure file) | 4,300–6,900 | 5,300–7,900 |

The two big costs are AGENTS' "Checks before you finish" (1,216) and "Work tracking" (1,085) sections, and BACKLOG-RULES as a whole (11,168). In BACKLOG-RULES the largest sections are "Record and evidence requirements" (2,968) and "Optional upfront feature plans" (2,063). A typical PR touches one record and needs perhaps a quarter of that file.

## Decisions for the owner

| # | Decision | Proposed |
|---|---|---|
| D1 | Budgets, warn-only (F-076-T05) | Always-loaded template text ≤ 2,500; a project's always-loaded total ≤ 3,500; each procedure file ≤ 2,000; the common record update (always + its reading) ≤ 5,000 |
| D2 | Session-start steps leave AGENTS | `check:freshness` already lists what is due; each finding names its fix and its procedure (with F-077-T01), so AGENTS keeps one line: "At session start run `npm run check:freshness` and do what it lists." The full list moves to `docs/agents/session-start.md` |
| D3 | Prose a checker enforces becomes a pointer | Record layout (signal table and its columns, cue icons, human-action line format, metadata details, the closing `---`, duplicate IDs) is enforced by `check:backlog` and `check:work`; the rules keep the meaning (what each status and cue means) and say "copy an existing record; `check:backlog` names any missing or wrong field". The list of replaced items goes in the traceability table for review |
| D4 | `docs/BACKLOG-RULES.md` keeps its path | It becomes an index of triggers to the new files, so every existing link and citation ("BACKLOG-RULES, 'Independent review'") still resolves; cited section names stay as headings in their new files and the index names where each went |
| D5 | Stack rules load by trigger | The Angular block (about 700 tokens in NERV) moves to `docs/agents/angular.md` with a row "change Angular code (web/)"; the same pattern applies to any stack add-on |

## AGENTS.md: what stays, what moves

| Section | Tokens | Plan |
|---|---:|---|
| Safety block (on its own, asks first, never, project lines) | in "Checks" | **Stays whole**; `check:rules` keeps enforcing it |
| Privacy, project conventions, architecture, style guide, adding things, documentation | ~600 | Stay (short, project-specific, always relevant) |
| Checks before you finish: PR against `main`, green PR gets no new work, conflict exception, generated-conflict resolution | ~350 | Move to `docs/agents/pull-requests.md`, row "open, update or merge a PR" |
| Checks before you finish: command catalogue | ~350 | Move to the same file; AGENTS keeps "run `npm run check:fast` before pushing" |
| Checks before you finish: failing test is evidence; no dead code; bug fix starts with a failing test | ~150 | Stay (every code change) |
| Checks before you finish: independent review pointer | ~80 | Moves with the PR procedure |
| Changing a harness file | 211 | Stays (an ask-first rule: "unsure, ask") |
| Procedures table | 536 | Stays, gains rows for the new files; trigger wording shortened |
| Work tracking: freshness steps | ~700 | Move per D2 |
| Work tracking: ownership and dependency direction, plan-or-promise-becomes-records, keep bug/fix/check distinct | ~250 | Stay (rules that apply to any task) |
| Work tracking: BACKLOG.md and ROADMAP pointers | ~150 | Move to the backlog index |
| Task context, Development usage | ~310 | Become table rows (their procedures already exist) |

Expected template always-loaded text: about 2,300 (from 4,132).

## BACKLOG-RULES: one file per trigger

| New file (under `docs/backlog/`) | From sections | Tokens now | Target | Read when you |
|---|---|---:|---:|---|
| `records.md` | Record and evidence requirements (layout per D3), Visual cues | 3,260 | ≤ 1,500 | change any record |
| `steps.md` | Optional upfront feature plans, explicit tasks, estimate calibration | 2,263 | ≤ 2,000 | plan a feature, add or close a step |
| `review.md` | When to update and review, Review procedure, Procedures and tracked outcomes, Documentation consistency | 2,746 | ≤ 2,000 | reconcile the backlog (a session-start finding) |
| `closure.md` | Closure and archives | 647 | 647 | close or archive a record |
| `ownership.md` | One repository, one backlog (incl. ownership rejection, solution coordinators) | 849 | 849 | work that touches another repository |
| `ordering.md` | Linked prerequisites, Optional work queue | 1,316 | 1,316 | add a prerequisite or order the queue |
| `evaluations.md` | Evaluation dependencies (from Record requirements) | ~300 | ~300 | pin or run an evaluation dependency |
| Independent review rule | from Record requirements | ~300 | ~300 | moves to `docs/agents/pull-requests.md` |

The common PR (update one record): always ~2,300 + `records.md` ~1,500 ≈ **3,800 in the template, about 4,800 in NERV, from 16,300**.

## How T03 and T04 prove nothing was lost

- A traceability table (`docs/design/rule-split-traceability.md`) lists every bullet and paragraph of the old AGENTS and BACKLOG-RULES with its new file and heading, or the checker and message that replaces it (D3).
- `check:rules` passes: every never and ask-first rule is still in the AGENTS safety block.
- `rule-load` before and after, in the CHANGELOG entry.
- The agent-behaviour checks rerun where a runner is configured (maintenance guidance).
- A fresh-context review compares the old text with the traceability table before release (F-076-T06).

## Not in this plan

Shortening the remaining procedure files (`work-usage.md` 4,236, `parallel-work.md` 2,432 and others) beyond the 2,000 budget warning; quiet tool outputs and the other token savings are F-077.
