# Reconciling a project with a newer template

Part of the [harness procedure](../../APPLY.md). Read when `check:freshness` reports a newer template release.

## Reconciling a project with a newer template

`npm run check:freshness` (through `check-harness.mjs`) lists, at every session start, what a new release means for the project. Handle it in the session's first PR:

- **update**: a copied file the project never changed; copy it from the template's latest release.
- **CONFLICT**: a copied file changed in both places. Merge by hand: generic changes go back into the template (a new release), project settings move into `.harness.json`, then copy the merged file.
- **differs**: a copied file changed only here. Same as a conflict: upstream it, move the setting into `.harness.json`, or make it a fork ("Project overrides").
- **forked**: a forked file whose template source changed since its `base`. Run `node tools/check-harness.mjs --merge`; resolve any conflict markers, then set `base` to the latest release.
- **reconcile by hand**: an adapted file whose template source changed. Read the template diff the warning prints and carry over what applies, keeping project content and every line marked `<!-- project -->`. A line in a template section that differs from the template and has no mark is either a lost template update or an unmarked project line: ask if it is not clear which, then mark it or restore the template's.
- Then set `version` in `.harness.json` to the latest release, run the checks, and say in the PR which release it reconciles and what was skipped and why.
- Record the reconcile in the project's own backlog (Other changes, or the record of the work it carries). The template's record for that release closed on its tag; it does not wait for this project (BACKLOG-RULES, "One repository, one backlog").

Upgrade notes for each release since 6.0.0 are in `docs/apply/upgrades/` ([6.x–7.x](upgrades/6-7.md), [8.x](upgrades/8.md)): read only the notes after the version in your `.harness.json`. A project on a release before 6.0.0 re-applies the harness from scratch ([adopting](adopt.md)) or reads the older notes in `APPLY.md` at tag `v8.13.0`, the last release that carries them (owner decision, F-078 D2).

## Reconciliation preview and friction

All applicable rules remain mandatory from the start. Before writes, optionally run the read-only `tools/reconcile-preview.mjs` against the online-verified release; review project rules, missing ancestry and unresolved changes. For adopted 3.0+ policy, use timed start/finish and required review evidence as the maintenance guide specifies; legacy explicit record mode remains available for genuinely observed durations. Never fabricate a historical baseline. Follow [maintenance guidance](../../core/docs/agents/maintenance.md). Copy the helpers/guide and stamp entries required by the adopted version; merge scripts and the local measurement ignore entry. No installation or record-schema migration is required.

## Updating GitHub Actions pins

When adding or updating a workflow action, resolve its release tag in the action's official repository and pin the full 40-character commit SHA, keeping the release tag in a comment beside it. Verify the tag-to-commit mapping from the official source before release, and update the SHA and comment together. This is a manual review; the harness does not claim to detect stale pins. Keep workflow permissions explicit and least-privileged, and review any change to fork-triggered workflows or secret access.
