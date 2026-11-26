# Karpathy guidelines against the harness rules (F-102), 2026-11-26

**Status: accepted 2026-11-26 (F-102-T01).** The owner's decision in chat: "proposals ok", every proposal F-102-T02 to F-102-T08 accepted as written, in the suggested order: F-102-T07 and F-102-T08 first, then F-102-T02 to F-102-T05 together in one minor release, F-102-T06 with them. Rule text changes only through those steps.

Compared at the owner's request (2026-11-26). Source: [`multica-ai/andrej-karpathy-skills`](https://github.com/multica-ai/andrej-karpathy-skills) (the former `forrestchang/andrej-karpathy-skills`, which redirects there) at commit [`2c60614`](https://github.com/multica-ai/andrej-karpathy-skills/tree/2c606141936f1eeef17fa3043a72095b4765b9c2) (`2c606141936f1eeef17fa3043a72095b4765b9c2`). Read: `CLAUDE.md` and `skills/karpathy-guidelines/SKILL.md` (the same four sections; the skill adds only front matter and a source link). Nothing was installed and none of its files were run. Harness side: `core/AGENTS.md` and the `core/docs/` procedures at `main` `9ea30a2` (v10.21.4), plus `core/tools/behaviour.mjs` for the agent-behaviour scenarios.

## Comparison

Covered: a harness rule already requires it. Partly: some of it, or only in one place or one area. Missing: no rule says it.

| # | Their rule | Harness | Where (template file:line at `9ea30a2`) |
|---|---|---|---|
| 1.1 | State assumptions explicitly; if uncertain, ask | Partly | `core/AGENTS.md:59` "Unsure: ask the user before editing. Never decide silently", but only for harness files; `core/AGENTS.md:30` asks first on a decision a record marks 🧑; `core/docs/backlog/feature-plans.md:11` records assumptions for estimates. No general rule for an unclear request. |
| 1.2 | Several interpretations: present them, don't pick silently | Partly | Same as 1.1 (`core/AGENTS.md:59`, harness files only). The behaviour scenario `ask-human-decision` tests only a decision a record already marks. |
| 1.3 | A simpler approach exists: say so, push back | Partly | `core/docs/agents/audit-findings.md:13` (a proposal names alternatives, cost and a success criterion) and `core/docs/agents/architecture-review.md:12`, both at audit or review time, not during a task. |
| 1.4 | Something is unclear: stop, name it, ask | Partly | As 1.1. |
| 2.1 | No features beyond what was asked | Partly | `core/AGENTS.md:30` asks first on material changes to an adopted feature plan; `core/docs/backlog/outcomes.md:7` records the agreed outcome before implementation. Nothing about the code itself. |
| 2.2 | No abstractions for single-use code | Missing | — |
| 2.3 | No unrequested flexibility or configurability | Missing | (The template's own `AGENTS.md` "settings live in `.harness.json`" is about copied tools, not this.) |
| 2.4 | No error handling for impossible scenarios | Missing | — |
| 2.5 | 200 lines that could be 50: rewrite | Missing | The independent review (`core/docs/agents/pull-requests.md`, "Independent review") reads for bugs, security and compliance, not for size or complexity. |
| 3.1 | Don't "improve" adjacent code, comments or formatting | Partly | Not in rule text. `core/tools/behaviour.mjs:238` scenario `keep-unrelated-code` already grades "Change what the task needs; unrelated code stays", a rule no core file states. `core/docs/agents/audit-findings.md:13`: a suggestion is no authorization to rewrite working code (audits only). |
| 3.2 | Don't refactor what isn't broken | Partly | As 3.1. |
| 3.3 | Match existing style | Partly | Formatter and linter required (`core/AGENTS.md:44`, `:49`), stack conventions (`core/AGENTS.md:43`), `docs/STYLE-GUIDE.md` for UI and text (`core/AGENTS.md:15`). No rule for code style a formatter cannot see (naming, structure, patterns). |
| 3.4 | Unrelated dead code: mention it, don't delete it | Covered | `core/AGENTS.md:30` asks first before "deleting what it did not create". |
| 3.5 | Remove what your change made unused | Covered | `core/AGENTS.md:52` "Replacing a feature removes its state, helpers and tests too: no dead code"; `core/AGENTS.md:43` `check:conventions` reports unused exports. |
| 3.6 | Every changed line traces to the request | Partly | PR title names its record ID (`core/docs/agents/pull-requests.md`, "Opening and updating a PR"); `core/AGENTS.md:115` a plan becomes records. No per-line test. |
| 4.1 | Turn a task into a verifiable goal | Covered | Every record has an observable Check (`core/docs/BACKLOG.md:23`); every step has `acceptance` and `validation` (`core/docs/agents/parallel-work.md:9`, `:15`). |
| 4.2 | Fix a bug: a test that reproduces it, then make it pass | Covered | `core/AGENTS.md:51`; `core/docs/backlog/records.md:15`; scenario `failing-test-first`. |
| 4.3 | Add validation: tests for invalid input, then pass | Partly | Bugs are test-first (4.2); features are not; `core/docs/agents/coverage-guide.md` measures coverage but sets no test-first rule. |
| 4.4 | Refactor: tests pass before and after | Partly | `core/AGENTS.md:50` "A failing test is evidence…": no rule that a refactor runs the same unchanged tests before and after. |
| 4.5 | Multi-step task: brief plan with a check per step | Covered | `core/docs/backlog/feature-plans.md:7`, `:11` (each step has scope, acceptance, dependencies, effort); `core/AGENTS.md:115`. |
| 4.6 | Loop until verified | Covered | Implemented is not Verified (`core/docs/BACKLOG.md:51–52`, `core/AGENTS.md:114`); never merge on a failing or pending check (`core/AGENTS.md:31`). |
| 0 | Bias to caution over speed; judgment on trivial tasks | Partly | Small and documentation-only PRs skip the independent review (`core/docs/agents/pull-requests.md`); no general statement. No proposal: the harness already weighs this per rule. |
| 5 | "Working if": fewer unnecessary diff changes, fewer rewrites, questions before mistakes | Partly | Measurable through the agent-behaviour checks (below); no scenario measures diff size or rewrites today. |

## Measuring a rule change on held-out tasks

The idea (from an article on "the end of harness engineering", as the owner summarised it; the article itself was not located): measure each rule change on tasks kept apart from rule writing, before and after, and keep the change only when it helps.

What `core/docs/agents/rule-review.md`, "Agent-behaviour checks", already does: fixture repositories built from the project's own rule files, a real agent runner, a model-free grader, `behaviour.times` runs per scenario (3 by default), passes reported per scenario, a rerun when the rule files change, "compare each scenario with its last run", and a failing scenario becomes a record. So the measurement exists.

What it does not do (partly covered):

- **No before/after in one run.** Fixtures always copy the current rule files (`behaviour.rules`); the "last run" is not stored, so the comparison is by hand and only if someone kept the earlier output.
- **No held-out set.** Each scenario is written for the rule it tests, often after the mistake it guards against, and rule text can be tuned until it passes. Nothing separates scenarios used while writing a rule from scenarios that judge it.
- **Small samples.** Three runs per scenario; no stated threshold for "better" or "worse".

## Proposals

Each is one step of F-102, for the owner to accept, amend or reject (F-102-T01). Every rule text below is a draft. Each accepted rule step adds a behaviour scenario where a grader can read the result, and reruns the agent-behaviour checks on the owner's runner (impact map row `behaviour`). Rule-load: `core/AGENTS.md` is always loaded (budget `rules.budgets.always` in `.harness.json` 3,500 tokens; the template's own AGENTS.md is 2,576 today); each line is about 40–60 tokens.

| Step | Covers | Draft rule (where) | Release | Agent estimate |
|---|---|---|---|---|
| F-102-T02 | 3.1, 3.2, 3.6 | "Change what the task needs: no reformatting, refactoring or 'improvements' of code the task does not touch; record an unrelated problem instead of fixing it." (`core/AGENTS.md`, Checks before you finish; the existing `keep-unrelated-code` scenario cites it) | minor | 1.5 h |
| F-102-T03 | 2.1–2.5 | "Write the least code the agreed outcome needs: no unrequested features, options or configuration, no abstraction with one use, no handling for cases that cannot occur." (`core/AGENTS.md`, Checks before you finish) plus a new scenario (a task that tempts an option or extra export) | minor | 3 h |
| F-102-T04 | 1.1–1.4 | Widen "Unsure: ask" beyond harness files: "When a request reads two ways that change the result, name both and ask before working; when the choice is cheap to undo, state the assumption in the record and the PR and go on. Never pick silently." (`core/AGENTS.md`, Work tracking) plus a scenario with an ambiguous task | minor | 3 h |
| F-102-T05 | 4.3, 4.4 | "A refactor keeps behaviour: the same tests, unchanged, pass before and after. New input validation comes with tests for the invalid input." (`core/AGENTS.md`, Checks before you finish) | minor | 1 h |
| F-102-T06 | 2.5, 3.3, 3.6 | The independent review also reads for changes outside the record's scope, unrequested complexity and code that does not follow its neighbours' patterns (`core/docs/agents/pull-requests.md`, Independent review; procedure, not always loaded) | minor | 1 h |
| F-102-T07 | held-out, before/after | `behaviour run --rules-ref=<git ref>`: build the fixtures from the rule files at that ref and at the working tree in one run and print before and after passes per scenario; append each run's per-scenario counts to `.harness/behaviour.jsonl` so "compare with the last run" reads a file (`core/tools/behaviour.mjs`, copied; fixtures in `tools/test-tools.mjs`) | minor | 6 h |
| F-102-T08 | held-out | `behaviour.heldOut`: scenarios not shown or edited while a rule is drafted; a rule change reports before/after on them and a drop is a regression record (`core/docs/agents/rule-review.md`, Agent-behaviour checks; `core/tools/behaviour.mjs` lists them) | minor | 3 h |

Suggested order: F-102-T07 and F-102-T08 first, so the rule steps T02–T06 are each measured before and after. Rule steps T02–T05 can ship together in one minor release (one reconcile for projects); T06, T07 and T08 can each ship alone. A rejected proposal closes its step as not done with the owner's reason.
