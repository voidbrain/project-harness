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

<!-- harness: branch protection and PR rules if any; the exact commands, first the session-start freshness check. -->
Open every PR against `main`.

```bash
npm run check:freshness   # first, at session start: backlog behind main, merged branches, audit age
{{LINT}}
{{TEST}}
{{BUILD}}
{{TYPECHECK}}
npm run check:backlog     # active record layout and lifecycle cues
npm run check:conventions # stack conventions above and unused exports (when the stack has one)
```

- A test that fails because the code changed is stale: fix the test deliberately and say why.
- Do not leave dead code behind when replacing a feature: its state, helpers and tests go too.

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
- the backlog is behind `main`: read the CI of the PRs merged since (`npm run ci:status -- <numbers>`), update or close their records, archive closed ones, move the header to the current `main`;
- merged branches are still on GitHub: delete them (and their local branches and worktrees);
- the newest audit in `docs/audits/` is more than 7 days old: audit what changed since (docs, tests, style guide, accessibility, privacy) and write `docs/audits/<date>.md`;
- the harness template has a newer release (`.harness.json` names the one this project is on), or its clone is missing, behind or unreachable: pull it first (`git -C ~/Projects/project-harness pull --ff-only --tags`), reconcile as its `APPLY.md` ("Reconciling") says, then move `version` forward. A copied tool under `tools/` is never edited here unless it is listed under `forked` in `.harness.json`; its settings are there too.

CI prints the same as warnings on every PR (it never blocks). `ci:status` needs a logged-in `gh`; if it is not, say so instead of skipping the step.

- [docs/BACKLOG.md](docs/BACKLOG.md) is the source of truth for status; [docs/BACKLOG-RULES.md](docs/BACKLOG-RULES.md) is the procedure (statuses, human-action cues, record layout, CI reconciliation, closure and archives, documentation ownership and the consistency check every PR records). Update the affected records in the same PR as the change, and run `npm run check:backlog`.
- Keep a confirmed bug, a candidate fix awaiting review, an unimplemented feature and a completed check distinct. A merge is not verification, and a passing unit test is not a verified visual, pointer or device fix. A green CI run establishes the checks it named, not the absence of bugs. Archives (`docs/archive/`) and audits (`docs/audits/`) are dated evidence, not current status; the current audit is the newest file in `docs/audits/`.
- A request that changes a copied tool, or adds a rule that would hold for every project, is a harness change: make it in the template first, then reconcile here, as the template's `APPLY.md` ("Changing the harness from a project") says. Settings and project content in adapted files stay here; a change only this project needs is a project override, marked or forked as `APPLY.md` ("Project overrides") says.
