# Friction, reconciliation previews and rule review

All applicable rules are binding from the start. An index can reduce repeated navigation, but never defers reading relevant instructions or makes ownership, evidence, privacy or safety optional.

## Measure actual friction

Measurement is explicit and local, not background telemetry. Time an adoption or reconciliation from reading its applicable rules through validation, with pauses/excluded work stated in the owning record. Record only observed duration and counters:

```bash
node tools/friction.mjs record --operation=reconciliation --duration-ms=120000 --conflicts=1 --unnecessary-prompts=0 --repeated-context-loads=2
node tools/friction.mjs report
```

The numbers above are examples, not a baseline. Omitted counters are unknown, never zero. Define a conflict as a file requiring manual resolution; count an unnecessary prompt only after reviewing why existing authorization sufficed; count a repeated context load only when unchanged material was reread unnecessarily. Distinguish deliberate rule refreshes from waste. Use consistent start/end boundaries and note unusual task scope in the owning backlog evidence, not in the numeric log.

`.harness/friction.jsonl` is append-only local data, ignored by default. It contains operation, timestamp, observed duration and optional counts only; no prompt/source text, identity or credentials. Report sample counts, missing values and medians separately for adoption/reconciliation. Do not compare incomparable scopes, turn estimates into observations, infer token usage from reads, or claim a productivity gain from one sample. Share aggregates deliberately, never upload automatically. A summary is diagnostic evidence, not a CI gate or completion score.

## Preview before writing

```bash
node tools/reconcile-preview.mjs --template=/path/to/project-harness --to=v2.3.0
node tools/reconcile-preview.mjs --template=/path/to/project-harness --to=v2.3.0 --json
```

Run from the applied project through its copied script. It reads the project stamp and release-tag content, lists copy updates, local/conflicting differences, missing sources/base tags and adapted-file review, and shows marked project rules plus required checks. It never fetches, writes, merges or applies. Verify the remote release under APPLY first; a local tag alone is not proof of publication. Dirty template state is reported. All project-specific content must survive adaptation, including unmarked rules: marker extraction cannot prove semantic preservation. Missing ancestry requires manual review rather than a guessed common base. Fork conflict classification is conservative; existing check-harness three-way merge remains a separate explicit operation.

Review the plan and record unresolved conflicts on the owning outcome before editing. Re-run it when source/target revisions change. A preview does not authorize edits, waive checks or establish that a rule is correct.

## Periodic rule consolidation

At an audit and after a repeated procedural conflict or significant workflow change, review the affected rule set for duplicates, contradictions, obsolete assumptions and unnecessary repeated reading. The authoritative owner remains AGENTS, BACKLOG-RULES, APPLY or the appropriate area/style guide.

For each proposed consolidation record old locations, the requirement they enforce, new owner/location, preserved exceptions, why the text is redundant/obsolete, and the check establishing no requirement was lost. Replace duplicate normative text with a short pointer where useful. Explicitly preserve applicable rules from session start. Update every affected summary, template/adapted copy and test in the same change; generic changes release upstream before projects adopt them. If deletion changes behavior, treat it as a policy change with its own acceptance, not editorial cleanup.

Age, rare use and no recent incident do not justify deleting ownership, evidence, privacy or safety safeguards. Do not automatically expire rules or create an empty review artifact on every edit. Track actual unresolved findings/outcomes; completed scoped reviews can record no changes with inspected scope and reasons. This is an event-driven procedure, not scheduled background execution.
