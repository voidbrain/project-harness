# Project overrides and changes asked from a project

Part of the [harness procedure](../../APPLY.md). Read when a project needs a rule or tool to behave differently, or asks the template for a change.

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
2. Pull the template (step 0), branch, make the change as its [AGENTS.md](../../AGENTS.md) says, and record it in its backlog.
3. Verify a copied tool with the template repository’s self-contained fixtures and contract checks. A completed consumer trial may be recorded as evidence, but changing or reconciling that project is its own backlog item and never a template release gate.
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
