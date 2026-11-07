# Project harness backlog

Current work ledger, reviewed 7 November 2026 against main `8abfe4b` (PR #71 CI 42314894799 green: F-032–F-037 closed after v3.3.0). [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

## Bugs and reliability

None open.

## Features and improvements

### F-041

**Skill review checklist from the OWASP Agentic Skills Top 10**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟢 Small | ~0% |

💻 **→ Human action required: No**<br />Turn the skill-review paragraph of `docs/agents/skills.md` into a checklist tied to the AST10 risks.

| | |
|---|---|
| **Issue** | `docs/agents/skills.md` asks to inspect a candidate skill's instructions, scripts, dependencies, licence and access, but gives no list of what to look for. The [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/) (AST10) catalogues the risks of agent skills (SKILL.md, Claude Code, Cursor/Codex, VS Code), prompted by a skill registry poisoned at scale. |
| **Reproduce** | Review a third-party skill with the current guidance: nothing prompts a check for hidden instructions, over-broad tool access, network calls in bundled scripts or an unpinned upstream. |
| **Check** | The skills guide carries a short checklist, each line citing its AST10 risk by ID, and the review record (source, revision, purpose, limits, fallback) names which lines were checked. Cite AST10 as a draft until OWASP publishes a dated release: its pages disagree (v1.0 2026 Edition versus "Launch Preparation"). Consumers receive it through reconciliation. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Proposed 2026-11-07 from an OWASP standards review in NERV Agency ([nerv#179](https://github.com/voidbrain/nerv/pull/179) recorded NERV's own items). Read the AST10 list and its mitigations, map them to the existing review steps, add only what is missing.

**Estimates:** Small. ~0% complete. Set 2026-11-07.

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-07 |
| Verification | Script: Pending. |
| Reviewed | 2026-11-07 |

</details>

---
### F-042

**CI templates reviewed against the OWASP Top 10 CI/CD Security Risks, with a dependency SBOM**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔶 P2 | Open | 🟡 Medium | ~0% |

💻 **→ Human action required: No**<br />Review the shipped workflows against CICD-SEC-1 to 10 and add a CycloneDX SBOM artifact.

| | |
|---|---|
| **Issue** | The workflows the harness ships (`core/.github/workflows/maintenance.yml`, the Angular CI workflow) were never reviewed against a published CI/CD risk list, and consumers get no bill of materials of their dependencies. |
| **Reproduce** | Read the workflows against the [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/): job token permissions, actions pinned by tag rather than commit, behaviour on pull requests from forks, and how the lockfile is installed are not stated anywhere as reviewed. |
| **Check** | A dated review lists each CICD-SEC risk as covered, fixed here or not applicable with the reason; fixes land in the templates (least `permissions:`, actions pinned to a commit with the tag in a comment, no secrets on fork PRs, `npm ci`); the Node workflows attach `npm sbom --sbom-format cyclonedx` output as an artifact; `test:tools` or `check:template` fails when a template loses least permissions. [SPVS](https://owasp.org/www-project-spvs/) is a reference for the review, not a certification. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Proposed 2026-11-07 from the same OWASP review. Commit-pinned actions need a way to keep pins current; decide in the PR between a documented manual bump in the release procedure and a check that names stale pins.

**Estimates:** Medium. ~0% complete. Set 2026-11-07.

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-07 |
| Verification | Script: Pending. |
| Reviewed | 2026-11-07 |

</details>

---
### F-043

**Audits cite stable security references: OpenCRE and version-pinned standard IDs**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🔴 | 🔹 P3 | Open | 🟢 Small | ~0% |

💻 **→ Human action required: No**<br />Add an optional reference column to the audit guide and OpenCRE's MCP server to the catalogue.

| | |
|---|---|
| **Issue** | Audit findings name security concerns in free text, so two audits or two projects cannot be compared, and a reader cannot follow a finding to the requirement behind it. [OpenCRE](https://www.opencre.org/) links each Common Requirement to ASVS, AISVS, NIST, ISO and CWE sections, has a REST API and ships a local stdio MCP server over public reads. |
| **Reproduce** | Take a privacy or security finding from any consumer audit and look for a requirement ID: there is none. |
| **Check** | `docs/agents/audit.md` allows an optional reference per finding: a CRE ID or a version-pinned standard ID (for example `v1.01-C9.4.3` for AISVS), never an unpinned one, and states that a reference is context, not a compliance claim. `core/tools/mcp-catalog.json` lists OpenCRE's MCP server as optional for audits, reviewed per the MCP guidance (source, revision, access: read-only public data). `check:audits` accepts but never requires the column. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Proposed 2026-11-07 from the same OWASP review. Review the OpenCRE MCP server's source and transport before listing it; if it needs anything beyond public read access, list the REST API only.

**Estimates:** Small. ~0% complete. Set 2026-11-07.

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-11-07 |
| Verification | Script: Pending. |
| Reviewed | 2026-11-07 |

</details>

---

## Other changes

Published [v3.3.0](https://github.com/voidbrain/project-harness/tree/v3.3.0), tagged on `main` `a0ae25e` after [#66](https://github.com/voidbrain/project-harness/pull/66)–[#70](https://github.com/voidbrain/project-harness/pull/70) merged on green CI. F-032–F-037 are closed and archived with their history. The push guard is not installed in this clone and no behaviour-check runner is configured here: both are the owner's choice.

Published [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1): annotated tag `bea6c60140f9ecf4fb9fa75849da5578fd5667e6` resolves remotely to approved main commit `7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031`. [Publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) passed every verification/publication step, including all 72 fixtures. B-013/B-014 and F-026–F-030 are verified, closed and archived with their original IDs/dates/history. [#58](https://github.com/voidbrain/project-harness/pull/58) removes the one-time operational workflow and records closure. No release action or human dependency remains.

Full audit F-031 verified and closed 2026-10-31 after [#55](https://github.com/voidbrain/project-harness/pull/55) merged with [CI 41228352936](https://github.com/voidbrain/project-harness/actions/runs/41228352936) green. All eight areas have a dated full report/manifest; both confirmed defects are fixed with failing-before/passing-after regressions. Those records were release-pending at that review; the verified v3.1.1 publication above now closes them. Historical audit prose remains unchanged.

Published [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) at verified commit `0764a36`. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step and all 56 fixtures. B-011, B-012 and F-021–F-025 are closed and archived with their complete history. [PR #51](https://github.com/voidbrain/project-harness/pull/51) removes the one-time publication workflow. No publication blocker remains for v2.2.2. The newer cumulative release was subsequently published through the one-time workflow above. No new permission request or consumer dependency is implied.

## How to use this file

| Status | Requirements | Next statuses and conditions | Priority cue |
|---|---|---|---|
| **🔴 Open** | Reproducible bug or agreed capability; scope and next action recorded. | - **Investigate** if cause/scope is uncertain<br>- **Implemented** when code is complete<br>- **Blocked** if a named dependency prevents progress<br>- **Closed** if cancelled/superseded, with reason. | Coloured |
| **🟠 Investigate** | Report and unanswered question recorded; next diagnostic identified. | - **Open** when scope/cause is established<br>- **Implemented** when fixed<br>- **Blocked** if evidence/dependency is unavailable<br>- **Closed** if duplicate/not reproducible after documented investigation, with reason. | Coloured |
| **🟡 Implemented** | Code exists; required verification remains pending. | - **Verified** when all acceptance checks pass (automated ones: the merged PR's green CI run)<br>- Open or Investigate if a check fails<br>- **Blocked** if a required check cannot proceed. | Coloured |
| **🟢 Verified** | All acceptance checks passed; date, method and evidence recorded, including human/device checks when required. | - **Closed** when no action remains and resolution is recorded<br>- **Open** or **Investigate** if new evidence invalidates verification. Do not leave completed items here indefinitely. | Coloured |
| **🟣 Blocked** | Specific blocker, affected work/check and resume condition recorded. | - Return to **Open**, **Investigate** or **Implemented** when unblocked<br>- **Verified** only after all checks pass<br>- **Closed** if cancelled/superseded, with reason. | Grey ◻️ |
| **🔵 Closed** | Resolution recorded and item archived. | - **Open** or **Investigate** if reopened by new evidence<br>Retain ID, original Opened date and historical closure record. | Grey ◻️ |

Follow [Backlog rules](BACKLOG-RULES.md) for updating records, reconciling PR/CI evidence, stale-state review, closure/archiving, human dependencies and table validation. Preserve stable IDs and existing user edits.

Each item shows its ID and title, a signal table (priority, status, remaining effort and estimated completion), Human action required (🧑 Yes / 💻 No), and Issue / Reproduce / Check. Expand the closed details for next actions, estimate rationale, PR history, dates and verification. Effort: 🟢 Small ≤1 day · 🟡 Medium 2–3 days · 🔴 Large ≥4 days. Completion is a coarse estimate, not verification; pending acceptance stays below 100%. A `---` line ends every item.
