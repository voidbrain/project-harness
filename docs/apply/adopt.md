# Adopting the harness

Part of the [harness procedure](../../APPLY.md). Read when you apply the harness to a project: steps 0–2, then 4 and 5; step 3 has its own files.

## 0. Online first

Before applying the harness, reconciling a project or changing the template, get the published latest:

```bash
git -C ~/Projects/project-harness pull --ff-only --tags   # or: git clone https://github.com/voidbrain/project-harness ~/Projects/project-harness
git -C ~/Projects/project-harness status --short          # must be empty
git -C ~/Projects/project-harness tag --sort=-v:refname | head -1   # the release to apply
```

Apply from that release tag, never from a stale, diverged or dirty clone. If the remote cannot be reached, say so and stop rather than apply local files. `check-harness` reports the same conditions at every session start.

## 1. Read the target before writing anything

- `git status`, branch, remote, recent log. If the tree is dirty, stop and ask. If on the default branch, create `harness/agent-harness` first. While applying the harness for the first time, do not commit or push unless the user asks: the project has not adopted AGENTS ("What the agent does on its own") yet; once it has, that section says what the agent does without asking.
- Existing agent and doc files: `AGENTS.md`, `CLAUDE.md`, `.claude/` (agents, commands, settings), `.github/copilot-instructions.md`, `.cursor/`, `.continue/`, `README.md`, `docs/`, contributing guides. Their content is the starting material. Merge it in; never drop a project rule silently.
- Stack and tooling: `package.json` (scripts, versions), `angular.json`, linters, formatters, test runners, CI workflows, deploy setup.
- Source layout: which folders hold pure logic, framework code, UI, assets, tests.
- The baseline: run lint, unit tests, build and the type check the project already has. Record what passes and what fails, with the error. Do not fix failures as part of applying the harness. They become backlog records.
- Hygiene a reviewer would flag: build output or dependencies tracked in git, ignored files that are tracked, duplicate or conflicting workflows, docs that disagree with the code (tokens, commands, file names), rules that contradict each other.

## 2. Choose the stack add-ons

- Angular project (`angular.json`, `@angular/core`): add `angular/`.
- Other stacks: `core/` only. Write the stack rules section of AGENTS by hand from the project's own conventions, and leave `check:conventions` out unless you write one.

## 2a. Optional MCP recommendations

Read [MCP guidance](../../core/docs/agents/mcp.md) before choosing recommendations. MCP installation remains optional.

- **MCP recommendations:** copy `core/tools/mcp.mjs`, `core/tools/mcp-catalog.json` and the shared `core/docs/agents/` guides to their applied paths and include their stamp entries. For Node projects add `check:integrations` and `mcp:recommend` from the package-scripts fragment; CI may run the metadata check, which passes with no selections. Read the actual task/stack, discover already available tools and research only missing capabilities. Populate the optional `integrations` field with project-specific reasons, reviewed sources/versions, fallbacks and genuine review dates. Configure/install only on the authorized execution host; generated snippets never replace instructions or existing settings. Never infer a working connection from a registry listing or file.

## 4. Validate

- Optional integration metadata passes `node tools/mcp.mjs check`; a missing selection is valid. Recommendation/config output must not be reported as installed or connected.
- For a coordinator, `node tools/solution.mjs check` names source/link problems; inspect a generated dashboard. Unknown sources and explicit failures remain visible. Never fabricate acceptance when private repositories or devices are unavailable.

- `node tools/check-backlog.mjs` passes; `node tools/check-freshness.mjs` runs (warnings are expected before the first PR merges) and ends with `Harness: on template vX.Y.Z; copied files match it.`
- `check-conventions` runs. Record its result in the audit and in a backlog record if it reports problems.
- No `{{` placeholders or `<!-- harness:` notes remain: `grep -rn '{{\|harness:' AGENTS.md CLAUDE.md README.md docs tools .claude`.
- Every local link in the new docs resolves.
- Lint still passes if it passed before.

## 5. Report

Tell the user what was added and changed, which existing rules were merged or contradicted, the baseline (what passes and what fails), and the backlog records that need their decision. Point at the branch. During first adoption, commit/push/PR follow the explicit authorization in step 1. In an adopted project or the template, follow its AGENTS and existing user authorization; do not ask again for authorized actions.
