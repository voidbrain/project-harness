<!-- harness: put the stack section here (angular/AGENTS.angular.md for Angular projects), then the sections below. Delete a section that has nothing true to say; keep the file under ~200 lines and move detail to docs/agents/areas.md. -->

## Project conventions ({{PROJECT_NAME}})

<!-- harness: one paragraph: what the product is, the repository, the build project name, where it is deployed and how (base href, output folder). -->
The app is **{{PROJECT_NAME}}**. The repository is `{{REPO}}`{{, the Angular project `NAME`}} and the site lives at `{{SITE_URL}}`.

### Architecture

<!-- harness: the layers and what may import what; where logic goes; the source of truth for data and how it is edited; units and coordinate conventions; anything that is easy to get wrong. Name the check that enforces each rule. -->
- `{{PURE_DIR}}` is plain TypeScript with no framework imports, so it stays unit-testable (enforced by {{CHECK}}). Put logic there and keep components thin.

### Style guide

- Before any UI change (templates, styles, user-facing text) read [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md). Follow its voice, tokens, type and spacing; use the `var(--…)` tokens, never a new literal colour.
- A new token or shared component updates the style guide in the same change.

### Adding things

<!-- harness: one bullet per recurring kind of addition (a page, an entity, a command, an asset): every file it touches, in order, and the test it needs. -->
- **{{A THING}}**: …

### Checks before you finish

<!-- harness: branch protection and required checks if any; the exact commands, first the session-start freshness check. -->
Open every PR against `main`, never on another PR's branch (merging it would not reach `main`). Once a PR's CI is green the owner may merge it at any moment: push no new work to it, open a new PR. Exception: a green PR that conflicts with `main` cannot merge, so it may get a push that only resolves the conflict; its checks run again before it can merge.

```bash
npm run check:freshness   # first, at session start: backlog behind main, merged branches, audit age
{{LINT}}
{{TEST}}
{{BUILD}}
{{TYPECHECK}}
npm run check:backlog     # active record layout and lifecycle cues
npm run check:conventions # stack conventions above and unused exports (when the stack has one)
```

- A failing test is evidence until shown otherwise: check it against the intended behaviour. Change its expectation only when the requirement deliberately changed, and say which requirement; otherwise fix the code.
- Do not leave dead code behind when replacing a feature: its state, helpers and tests go too.

### Changing a harness file

Before editing a file listed in `.harness.json` (`copied`, `forked`, `adapted`, or `.harness.json` itself), decide whether the change holds for this project only or for every project. The edit is the trigger, whatever the request's words: an "allow X" that changes how work is done is a rule.
- **This project only**: its content or a setting stays here. A project line inside a section that comes from the template ends with `<!-- project -->`, so a reconcile keeps it; a changed harness rule is an override (APPLY.md, "Project overrides").
- **Every project**: the template first, then reconcile here (APPLY.md, "Changing the harness from a project").
- **Unsure**: ask the user before editing. Never decide silently.

`npm run check:freshness` lists the harness files a branch changes, locally and on every PR.

### What follows a change

Everything derived from something else is a row of the impact map, `impact` in `.harness.json`: generated pages and data, recordings (clips, screenshots, films), translations, guides and tours, docs that describe a feature. A row: `{ "id", "when": [file globs], "then": "what must follow", "run": "command", "checked": "what verifies it", "after": [ids] }`. `after` makes chains: when a row it names must run again, so must this one (a catalogue rebuilt → the examples that use it → their pages).
- Rows are as fine as the code can name things (a recording per step, not "all recordings"), and complete: a derived thing you find without a row gets one in the same PR.
- A row watches what its output is made of, not only code: the data a recording or a generated page loads (an example, a demo file, a fixture) belongs in its `when`. A setting with a wide reach (a theme colour, a font, a scale) has its own row chained to every output it shows in, art included.
- **Couplings.** A value used in two places (a timing, a colour, an offset, a size) has one source that both read. If it cannot, a test asserts the relation and the map has a row from each place to the other. A value copied by hand is a bug waiting to happen.
- `npm run check:freshness` lists, locally and on every PR, the rows a branch sets off and the order to run them. Do each in the same PR, or record in the backlog why not.
- `node tools/impact-map.mjs` writes the rows as a page (`docs/agents/impact-map.md`), which CI keeps equal to the rows. A row that nothing checks is a candidate for a check.

### Testing the joins

- A change that touches how two parts meet gets a test across both, not one per side. Unit tests on each part did not catch the bugs that reached users.

### Known pitfalls

<!-- harness: real traps with their cause, from the project's history and docs. Delete the section if there are none yet. -->
- …

## Area notes

Before changing an area, read its section in [docs/agents/areas.md](docs/agents/areas.md): the rules and lessons there are as binding as this file.

| Area | Covers |
|---|---|
| {{AREA}} | {{WHAT}} |

<!-- harness: if the project has subagents in .claude/agents/, list them here with the area each one owns. -->

## Privacy

<!-- harness: private data that must never enter the repository (keys, personal data, locations) and how tests avoid it. Delete if none. -->
- Never commit secrets, tokens or personal data. Test data is neutral and invented.

## Work tracking

**At the start of every session, before other work, run `npm run check:freshness`** and do what it lists, in the session's first PR:
- the backlog is behind `main`: read the CI of the PRs merged since (`npm run ci:status -- <numbers>`) and review any commit it lists without a PR, update or close their records, archive closed ones, move the header to the current `main`;
- merged branches are still on GitHub: delete them (and their local branches and worktrees);
- the newest audit in `docs/audits/` is older than `freshness.auditDays` in `.harness.json` (7 by default): audit what changed since (docs, tests, style guide, accessibility, privacy, and what the outputs rely on outside the repository: dependency upgrades, the CI browser and machine, external services and data) and write `docs/audits/<date>.md`;
- the harness template has a newer release (`.harness.json` names the one this project is on), or its clone is missing, behind or unreachable: pull it first (`git -C ~/Projects/project-harness pull --ff-only --tags`), reconcile as its `APPLY.md` ("Reconciling") says, then move `version` forward. A copied tool under `tools/` is never edited here unless it is listed under `forked` in `.harness.json`; its settings are there too.

CI prints the same as warnings on every PR (it never blocks). `ci:status` needs a logged-in `gh`; if it is not, say so instead of skipping the step.

- [docs/BACKLOG.md](docs/BACKLOG.md) is the source of truth for status; [docs/BACKLOG-RULES.md](docs/BACKLOG-RULES.md) is the procedure (statuses, human-action cues, record layout, CI reconciliation, closure and archives, documentation ownership and the consistency check every PR records). Update the affected records in the same PR as the change, and run `npm run check:backlog`.
- Keep a confirmed bug, a candidate fix awaiting review, an unimplemented feature and a completed check distinct. A merge is not verification, and a passing unit test is not a verified visual, pointer or device fix. A green CI run establishes the checks it named, not the absence of bugs. Archives (`docs/archive/`) and audits (`docs/audits/`) are dated evidence, not current status; the current audit is the newest file in `docs/audits/`.
- A change to a harness file follows "Changing a harness file" above: this project only, every project (the template first), or ask.
- A plan or promise given to the user (steps, a table to build, a later fix) becomes backlog records in the same change, and the reply names them. Nothing promised lives only in the conversation.
