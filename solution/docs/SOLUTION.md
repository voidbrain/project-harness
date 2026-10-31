# {{SOLUTION_NAME}}

<!-- harness: Fill from the actual solution. The coordinator is a separate repository even for a small multi-repository solution. Do not create or repair component repositories while applying this profile unless the user authorized that work. -->

This repository owns solution outcomes, architecture, shared contracts and integration acceptance. Components own implementation and their own backlogs. The [manifest](../.solution.json) names sources; the [solution backlog](BACKLOG.md) owns integration status; [solution-profile guidance](agents/solution-profile.md) defines aggregation. A dashboard is generated evidence, not an editable second ledger.

## Components and contracts

<!-- harness: List real repository IDs, responsibilities, interface/schema ownership, units, authentication, compatibility and release references. Link an authoritative contract rather than copying it. Explain environment boundaries such as local devices and hosted services. -->

## Integration acceptance

<!-- harness: Record observable end-to-end checks and which environment can run them. Component CI is evidence for its own scope; the solution may legitimately wait for component releases before verifying integration. It must not hold an independently complete component record open. -->

## Work tracking

Use ordinary B-/F- IDs in this repository's backlog. A solution record's Issue, next action and closure describe coordination, contracts or integration owned here. Add `| Components | component:F-001, other:B-002 |` to its metadata table to link implementation work. Use exact manifest IDs. A component may link back using a `Solution` metadata field; do not copy statuses or histories between ledgers.

Run `node tools/solution.mjs check` for local snapshots. Run `node tools/solution.mjs dashboard --write` to refresh the dashboard. Add `--remote` to resolve component refs through GitHub; configure an appropriately scoped `GH_TOKEN` locally for private repositories. Never commit credentials. Check in a dashboard only after reviewing its revisions, local-change indicators and problems. Failed sources remain Unknown and produce a failing exit status, even when a partial dashboard is written.

## MCP and execution environments

Use [MCP guidance](agents/mcp.md). A shared recommendation does not grant every agent access to every component or device. Record useful solution-level capabilities with their reasons and fallbacks. Credentials, client approval and actual connectivity belong to the executing environment.
