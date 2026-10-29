# Applying the harness to a project

The procedure an agent follows. Template root: `~/Projects/project-harness` (`core/`, plus one stack folder when it applies).

## 1. Read the target before writing anything

- `git status`, branch, remote, recent log. If the tree is dirty, stop and ask. If on the default branch, create `harness/agent-harness` first. Do not commit or push unless the user asks.
- Existing agent and doc files: `AGENTS.md`, `CLAUDE.md`, `.claude/` (agents, commands, settings), `.github/copilot-instructions.md`, `.cursor/`, `.continue/`, `README.md`, `docs/`, contributing guides. Their content is the starting material. Merge it in; never drop a project rule silently.
- Stack and tooling: `package.json` (scripts, versions), `angular.json`, linters, formatters, test runners, CI workflows, deploy setup.
- Source layout: which folders hold pure logic, framework code, UI, assets, tests.
- The baseline: run lint, unit tests, build and the type check the project already has. Record what passes and what fails, with the error. Do not fix failures as part of applying the harness. They become backlog records.
- Hygiene a reviewer would flag: build output or dependencies tracked in git, ignored files that are tracked, duplicate or conflicting workflows, docs that disagree with the code (tokens, commands, file names), rules that contradict each other.

## 2. Choose the stack add-ons

- Angular project (`angular.json`, `@angular/core`): add `angular/`.
- Other stacks: `core/` only. Write the stack rules section of AGENTS by hand from the project's own conventions, and leave `check:conventions` out unless you write one.

## 3. Write the files

For each template file, adapt it to the project; do not copy it unchanged.

- **CLAUDE.md**: as the template. If one exists with more content, move that content into AGENTS.md or the area notes.
- **AGENTS.md**: the stack section first (from `angular/AGENTS.angular.md` when it applies, minus rules that do not fit the project's framework version), then the project sections of `core/AGENTS.md`. Fill each section from what the project really does. Delete a section that has nothing true to say rather than padding it. Keep it under ~200 lines; detail goes to `docs/agents/areas.md`.
- **docs/agents/areas.md**: one section per area of the code that has its own rules or lessons. Existing subagent definitions (`.claude/agents/*.md`) map naturally to areas. Keep the subagents and make them point to AGENTS.md and their area section instead of repeating rules, and fix any of their rules that contradict AGENTS.
- **Other agent instruction files** (Copilot, Cursor, Continue): reduce to a pointer to AGENTS.md plus anything that tool needs and the others do not.
- **docs/STYLE-GUIDE.md**: fill from the code (CSS custom properties, theme files, fonts actually loaded) and from existing art or design docs. The code is the source of truth. A design doc that disagrees with it becomes a backlog record, not a silent edit. Link existing art direction or design-system docs rather than duplicating them.
- **docs/BACKLOG.md**: header with today's date and the current `main` commit (`git rev-parse --short origin/main`). Seed records from the baseline and hygiene findings, and from any TODO list or plan in the existing docs. Each record is reproducible and has a next action. A finding the user must decide on (naming, scope, deleting history) gets 🧑 Yes. Add a record for the harness change itself (Implemented, verified by the first PR's CI).
- **docs/BACKLOG-RULES.md**: as the template, with the project name. Edit the Documentation consistency list to name the docs this project actually has.
- **docs/audits/<today>.md**: the baseline audit: what was checked, how, what passed, what failed, which records it opened.
- **docs/archive/README.md**: as the template.
- **README.md**: keep the project's README and its voice. Add or correct "Run it" (the real commands), "Where things are", and a short "Working on it" section linking AGENTS, the backlog and the style guide. Fix claims the baseline proved wrong.
- **tools/**: copy `check-backlog.mjs`, `check-freshness.mjs` and `ci-status.mjs` unchanged. For Angular, copy `check-conventions.mjs` and set `PURE_DIRS` (and the allowed imports) at its top to the project's framework-free folders, or leave the list empty.
- **package.json scripts** (Node projects): add `check:backlog`, `check:freshness`, `ci:status` and, with Angular, `check:conventions`, from `angular/package-scripts.json`. Do not rename existing scripts.
- **Lint and format config** (Angular): merge `angular/eslint.config.mjs` into the existing config. Keep the project's own rules unless they contradict AGENTS (for example, an ESLint rule requiring explicit `OnPush` when AGENTS says it is the default); remove the contradiction and say so. Add Prettier and `.editorconfig` only if the project has none.
- **CI**: add `angular/.github/workflows/ci.yml` (workflow name `CI`, which `ci-status.mjs` looks for) if the project has no PR workflow, otherwise add the harness steps to it. A check the current code fails (conventions on legacy code, for example) runs with `continue-on-error: true` and a comment naming its backlog record, so it is visible without blocking. Remove the allowance when the record closes.
- **.gitignore**: merge `core/gitignore.txt`. Do not ignore `.claude/` as a whole. Ignore only `.claude/settings.local.json` and `.claude/worktrees/`, so shared agents and commands are versioned.

## 4. Validate

- `node tools/check-backlog.mjs` passes; `node tools/check-freshness.mjs` runs (warnings are expected before the first PR merges).
- `check-conventions` runs. Record its result in the audit and in a backlog record if it reports problems.
- No `{{` placeholders or `<!-- harness:` notes remain: `grep -rn '{{\|harness:' AGENTS.md CLAUDE.md README.md docs tools .claude`.
- Every local link in the new docs resolves.
- Lint still passes if it passed before.

## 5. Report

Tell the user what was added and changed, which existing rules were merged or contradicted, the baseline (what passes and what fails), and the backlog records that need their decision. Point at the branch. Offer to commit and open the PR; do not do it unasked.
