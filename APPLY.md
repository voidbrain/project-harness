# Applying the harness to a project

The procedure an agent follows. Template root: `~/Projects/project-harness` (`core/`, plus one stack folder when it applies), published at https://github.com/voidbrain/project-harness.

## 0. Online first

Before applying the harness, reconciling a project or changing the template, get the published latest:

```bash
git -C ~/Projects/project-harness pull --ff-only --tags   # or: git clone https://github.com/voidbrain/project-harness ~/Projects/project-harness
git -C ~/Projects/project-harness status --short          # must be empty
git -C ~/Projects/project-harness tag --sort=-v:refname | head -1   # the release to apply
```

Apply from that release tag, never from a stale, diverged or dirty clone. If the remote cannot be reached, say so and stop rather than apply local files. `check-harness` reports the same conditions at every session start.

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
- **docs/STYLE-GUIDE.md**: fill from the code (CSS custom properties, theme files, fonts actually loaded). The code is the source of truth. An existing art-direction or look-and-voice doc is **merged into it** (concept, references, do and don't, per-character or per-screen notes) and deleted, so one document owns the palette and type; values it gives that the code does not ship become a backlog record and are listed, not silently dropped. A full design-system folder (tokens file plus one guide per component) stays where it is; the style guide then links it instead of restating it.
- **docs/DESIGN.md** (optional): what the product does in its own terms (game design, domain model, protocol). Merge an existing game-design or spec doc into it, or keep its name if the project already uses one (`GAME-DESIGN.md`). It describes the rules and names where each one lives; tables of numbers stay in the code, linked. Check every claim against the code; promised but unbuilt behaviour becomes a backlog record. Skip the file if the README covers it.
- **Deploy notes**: a short deploy doc becomes a README section ("Deploying"); keep a separate file only when it is long or audience-specific.
- **docs/BACKLOG.md**: header with today's date and the current `main` commit (`git rev-parse --short origin/main`). Seed records from the baseline and hygiene findings, and from any TODO list or plan in the existing docs. Each record is reproducible and has a next action. A finding the user must decide on (naming, scope, deleting history) gets 🧑 Yes. Add a record for the harness change itself (Implemented, verified by the first PR's CI).
- **docs/BACKLOG-RULES.md**: as the template, with the project name. Edit the Documentation consistency list to name the docs this project actually has.
- **docs/audits/<today>.md**: the baseline audit: what was checked, how, what passed, what failed, which records it opened.
- **docs/archive/README.md**: as the template.
- **README.md**: keep the project's README and its voice. Add or correct "Run it" (the real commands), "Where things are", and a short "Working on it" section linking AGENTS, the backlog and the style guide. Fix claims the baseline proved wrong.
- **tools/**: copy `check-backlog.mjs`, `check-freshness.mjs`, `check-harness.mjs`, `ci-status.mjs`, `impact-map.mjs` and `coverage-table.mjs` unchanged, and for Angular `check-conventions.mjs`. Never edit a copied file for one project: its settings live in `.harness.json`, and a change only that project needs is a fork ("Project overrides").
- **.harness.json**: start from `core/.harness.json`, merge the stack's `.harness.fragment.json` (concatenate `stacks`, merge `copied`, `adapted` and settings; an `adapted` path with two sources takes a list). Set `version` to the release you applied, `template.repo` to the template's remote if it has one, `conventions.pureDirs` to the framework-free folders and their allowed `@angular/core` names, `ciStatus` to the PR workflow's name and browser jobs. Add to `adapted` any template file you adapted under another name (`docs/GAME-DESIGN.md` from `core/docs/DESIGN.md`), and remove entries for files you deliberately skipped.
- **package.json scripts** (Node projects): add `check:backlog`, `check:freshness`, `ci:status` and, with Angular, `check:conventions`, from `angular/package-scripts.json`. Do not rename existing scripts.
- **Lint and format config** (Angular): merge `angular/eslint.config.mjs` into the existing config. Keep the project's own rules unless they contradict AGENTS (for example, an ESLint rule requiring explicit `OnPush` when AGENTS says it is the default); remove the contradiction and say so. Add Prettier and `.editorconfig` only if the project has none.
- **CI**: add `angular/.github/workflows/ci.yml` (workflow name `CI`, which `ci-status.mjs` looks for) if the project has no PR workflow, otherwise add the harness steps to it. The template clone step needs `template.repo` in `.harness.json`; keep it with the `HARNESS_HOME` line on the freshness step, or `check-harness` is skipped in CI. A check the current code fails (conventions on legacy code, for example) runs with `continue-on-error: true` and a comment naming its backlog record, so it is visible without blocking. Remove the allowance when the record closes.
- **Impact map** (`impact` in `.harness.json`): one row per derived thing the project has, as fine as the code names them: an `id`, which files set it off (`when`, globs), what must follow (`then`), the command (`run`), what checks it (`checked`) and the rows it must run again after (`after`). Find them in the build scripts, generated files, recordings, translations, guides and feature docs. List the content each output loads in its `inputs`, the values that live in two places in `couplings` and what outside the repository can change an output in `outside`. Then `node tools/impact-map.mjs` writes `docs/agents/impact-map.md`.
- **Coverage** (`coverage` in `.harness.json`: `summary` path, `folders`, `drop`): the test runner must write the standard `coverage-summary.json` ("json-summary" reporter) with every source file included. Angular (Vitest): add the dev dependency `@vitest/coverage-v8` at the installed Vitest version and the `coverage` npm script, then `npm run coverage` writes `docs/agents/coverage.md` and its baseline; the CI test step runs with coverage and `coverage-table --check`. List the page in `pages`.
- **.gitignore**: merge `core/gitignore.txt`. Do not ignore `.claude/` as a whole. Ignore only `.claude/settings.local.json` and `.claude/worktrees/`, so shared agents and commands are versioned.

## 4. Validate

- `node tools/check-backlog.mjs` passes; `node tools/check-freshness.mjs` runs (warnings are expected before the first PR merges) and ends with `Harness: on template vX.Y.Z; copied files match it.`
- `check-conventions` runs. Record its result in the audit and in a backlog record if it reports problems.
- No `{{` placeholders or `<!-- harness:` notes remain: `grep -rn '{{\|harness:' AGENTS.md CLAUDE.md README.md docs tools .claude`.
- Every local link in the new docs resolves.
- Lint still passes if it passed before.

## 5. Report

Tell the user what was added and changed, which existing rules were merged or contradicted, the baseline (what passes and what fails), and the backlog records that need their decision. Point at the branch. Offer to commit and open the PR; do not do it unasked.

## Reconciling a project with a newer template

`npm run check:freshness` (through `check-harness.mjs`) lists, at every session start, what a new release means for the project. Handle it in the session's first PR, like the backlog:

- **update**: a copied file the project never changed; copy it from the template's latest release.
- **CONFLICT**: a copied file changed in both places. Merge by hand: generic changes go back into the template (a new release), project settings move into `.harness.json`, then copy the merged file.
- **differs**: a copied file changed only here. Same as a conflict: upstream it, move the setting into `.harness.json`, or make it a fork ("Project overrides").
- **forked**: a forked file whose template source changed since its `base`. Run `node tools/check-harness.mjs --merge`; resolve any conflict markers, then set `base` to the latest release.
- **reconcile by hand**: an adapted file whose template source changed. Read the template diff the warning prints and carry over what applies, keeping project content and every line marked `<!-- project -->`. A line in a template section that differs from the template and has no mark is either a lost template update or an unmarked project line: ask if it is not clear which, then mark it or restore the template's.
- Then set `version` in `.harness.json` to the latest release, run the checks, and say in the PR which release it reconciles and what was skipped and why.
- Record the reconcile in the project's own backlog (Other changes, or the record of the work it carries). The template's record for that release closed on its tag; it does not wait for this project (BACKLOG-RULES, "One repository, one backlog").

## Changing the harness from a project

A request made in a project can touch the harness. Before editing a harness file there, find it in the project's `.harness.json` and decide where the change belongs. The edit is the trigger, not the request's words: an "allow X" that changes how work is done is a rule. The project's AGENTS says the same ("Changing a harness file") and `check:freshness` lists the harness files a branch changes.

| The change is | Where it goes |
|---|---|
| A project setting (framework-free folders, CI workflow name, log notes) | The project's `.harness.json`. No release. |
| Project content in an adapted file (its conventions, area notes, look, design) | The project. No release. |
| A change to a copied file (`tools/check-*.mjs`, `ci-status.mjs`) that every project would want | The template first; never the project's copy. |
| A rule that would hold for every project, or every project on a stack | The template first, then the project. |
| A harness rule or tool behaviour changed for this project only | A project override (below). No release. |

**When it is not clear whether a change is general, ask the user before editing**, and say which release it would make. Never decide silently: a generic rule written into one project is found only when another project needs it.

Template first means, in order:

1. Tell the user the change is a harness change and which release it makes (CHANGELOG preamble: patch, minor or major).
2. Pull the template (step 0), branch, make the change as its [AGENTS.md](AGENTS.md) says, and record it in its backlog.
3. A copied tool is tried in the project that asked for it: copy the new tool in, run the project's checks, compare the output with the old tool's.
4. Release: CHANGELOG entry, `VERSION`, copy `core/tools/` to `tools/`, `npm run check:template`, `npm run test:tools`, PR, merge when CI is green, tag `vX.Y.Z` on `main` and push the tag.
5. Reconcile the project with the release (above), then make the rest of the request on top of it. Its PR links the template PR.

If the release cannot land in the same session (the template PR awaits review), the project change waits, or ships without the generic part; the template's backlog record carries that part, and the project's backlog names it. The other projects see the release at their next session start.

## Project overrides

A project can change a harness rule or tool for itself and still receive every release. Prefer the first form that works:

1. **A setting.** If the behaviour can be a setting the tool reads from `.harness.json`, add the setting in the template (a release, as above) and set it in the project. Nothing diverges.
1b. **A project line in a template section.** A line a project adds inside a section that comes from the template (a required check next to "Open every PR against `main`") is not an override: it adds, it does not replace. End it with `<!-- project -->` so a reconcile keeps it and the next reader knows it is not template text.
2. **A rule in an adapted file.** Change the rule where the project's file states it and mark the change on its own line, so a reconcile keeps it:

   `> Project override (harness rule: <which rule>): <what this project does instead>, because <why>.`

   `check-harness` counts the markers in an adapted file whose template source changed ("reconcile by hand, keeping its N project override(s)"). When the template changes the rule an override replaces, decide whether the override still holds and update its reason.
3. **A copied tool, forked.** Move the file from `copied` to `forked` in `.harness.json`, with the template source, the release it was forked from and the reason, then edit it:

   ```json
   "forked": { "tools/check-freshness.mjs": { "from": "core/tools/check-freshness.mjs", "base": "1.3.0", "why": "audits every 14 days" } }
   ```

   At every session start `check-harness` compares the template's file at `base` with the latest release. If the template changed it, it reports whether a three-way merge with the project's file is clean or conflicts; `node tools/check-harness.mjs --merge` writes the merge and moves `base` of the clean ones forward. Resolve conflict markers by hand, then set `base` to the latest release. A fork that becomes identical to the template moves back to `copied`.

Record each override in the project's backlog or AGENTS when it is made, with its reason. An override that turns out to fit every project goes back into the template (above) and is removed here.
