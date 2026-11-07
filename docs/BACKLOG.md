# Project harness backlog

Current work ledger, reviewed 7 November 2026 against main `2748403` (PR #72 CI 42315543152 green; #71 CI 42314894799 green: F-032–F-037 closed after v3.3.0). [Rules](BACKLOG-RULES.md) · [Archive](archive/README.md).

## Bugs and reliability

None open.

## Features and improvements

### F-041

**Skill review checklist from the OWASP Agentic Skills Top 10**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟢 Small | ~80% |

💻 **→ Human action required: No**<br />Add the AST10-mapped review checklist, draft-status caveat and review-record requirements to the shared skills guide.

| | |
|---|---|
| **Issue** | `docs/agents/skills.md` asks to inspect a candidate skill's instructions, scripts, dependencies, licence and access, but gives no list of what to look for. The [OWASP Agentic Skills Top 10](https://owasp.org/www-project-agentic-skills-top-10/) (AST10) catalogues the risks of agent skills (SKILL.md, Claude Code, Cursor/Codex, VS Code), prompted by a skill registry poisoned at scale. |
| **Reproduce** | Review a third-party skill with the current guidance: nothing prompts a check for hidden instructions, over-broad tool access, network calls in bundled scripts or an unpinned upstream. |
| **Check** | The shared skills guide maps each of AST01–AST10 to a concise review check and names the checked IDs plus source, revision/date, purpose, limits and fallback in the review record. It describes AST10 as draft guidance while OWASP's project materials disagree on release status. APPLY carries the checklist into skill review. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation is on `harness/owasp-backlog`; the independent review found no significant issues. Open a PR against `main`; close after the merged PR's green CI and the v3.4.0 release tag. Downstream reconciliation remains each project's own work.

**Estimates:** Small. ~80% complete. Set 2026-11-07.

| Field | Value |
|---|---|
| PR / evidence | [#72](https://github.com/voidbrain/project-harness/pull/72) record; implementation on `harness/owasp-backlog` |
| Opened | 2026-11-07 |
| Verification | Script: 2026-11-07 `check:template`, `check:backlog` and `check:rules` pass. Documentation: 2026-11-07 AST01–AST10 checklist and draft-status source reviewed; PR CI pending. |
| Reviewed | 2026-11-07 |

</details>

---
### F-042

**CI templates reviewed against the OWASP Top 10 CI/CD Security Risks, with a dependency SBOM**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔶 P2 | Implemented | 🟡 Medium | ~80% |

💻 **→ Human action required: No**<br />Review shipped workflows against CICD-SEC-1 to 10, harden their owned controls and attach CycloneDX SBOM artifacts to Node CI.

| | |
|---|---|
| **Issue** | The workflows the harness ships (`core/.github/workflows/maintenance.yml`, the Angular CI workflow) were never reviewed against a published CI/CD risk list, and consumers get no bill of materials of their dependencies. |
| **Reproduce** | Read the workflows against the [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/): job token permissions, actions pinned by tag rather than commit, behaviour on pull requests from forks, and how the lockfile is installed are not stated anywhere as reviewed. |
| **Check** | A dated review maps all ten CICD-SEC risks to covered, fixed or not applicable with reasons and limits. Shipped workflows use only `contents: read`, pin actions to verified commit SHAs with release comments, avoid `pull_request_target` and secret references, use `npm ci` where a lockfile is required, and attach `npm sbom --sbom-format cyclonedx` artifacts to root and Angular Node CI. `check:template` enforces these workflow contracts; APPLY documents manual pin updates. [SPVS](https://owasp.org/www-project-spvs/) is a reference, not a certification. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation is on `harness/owasp-backlog`; the independent review found no significant issues. Open a PR against `main`; close after the merged PR's green CI and the v3.4.0 release tag. The APPLY release guidance defines manual action-pin verification; no stale-pin checker is claimed.

**Estimates:** Medium. ~80% complete. Set 2026-11-07.

| Field | Value |
|---|---|
| PR / evidence | [#72](https://github.com/voidbrain/project-harness/pull/72) record; implementation on `harness/owasp-backlog` |
| Opened | 2026-11-07 |
| Verification | Script: 2026-11-07 `check:template`, `test:tools` and `check:audits` pass; a broadened-permission probe fails as required. Documentation: 2026-11-07 all ten CICD-SEC risks reviewed; PR CI pending. |
| Reviewed | 2026-11-07 |

</details>

---
### F-043

**Audits cite stable security references: OpenCRE and version-pinned standard IDs**

| Signal | Priority | Status | Effort | Complete |
|:---:|---|---|---|---|
| 🟡 | 🔹 P3 | Implemented | 🟢 Small | ~80% |

💻 **→ Human action required: No**<br />Allow optional stable requirement references in audit findings and catalogue OpenCRE's reviewed, public-read MCP server for audit context.

| | |
|---|---|
| **Issue** | Audit findings name security concerns in free text, so two audits or two projects cannot be compared, and a reader cannot follow a finding to the requirement behind it. [OpenCRE](https://www.opencre.org/) links each Common Requirement to ASVS, AISVS, NIST, ISO and CWE sections, has a REST API and ships a local stdio MCP server over public reads. |
| **Reproduce** | Take a privacy or security finding from any consumer audit and look for a requirement ID: there is none. |
| **Check** | `docs/agents/audit.md` allows an optional reference per finding: an OpenCRE CRE ID or version-pinned standard ID (for example `v1.01-C9.4.3` for AISVS), never an unpinned one, and states that a reference is context, not a compliance claim. The catalogue pins OpenCRE's source revision and stdio transport; the review confirms only public GET tools are enabled by default and instructs users to leave authenticated tools disabled. The public REST API is the fallback. `check:audits` does not require the optional reference. |

<details>
<summary>Next action, estimates and PR history</summary>

**Next action / closure evidence:** Implementation is on `harness/owasp-backlog`; the independent review found no significant issues. Open a PR against `main`; close after the merged PR's green CI and the v3.4.0 release tag. OpenCRE's official source was reviewed at `ace5f0bdc4031ed805fd550d13f6a5931a91606d`; its local stdio server defaults to public GET tools, while authenticated tools (including one write) require explicit opt-in. The catalogue tells users to keep that opt-in unset and names the public REST API as fallback.

**Estimates:** Small. ~80% complete. Set 2026-11-07.

| Field | Value |
|---|---|
| PR / evidence | [#72](https://github.com/voidbrain/project-harness/pull/72) record; implementation on `harness/owasp-backlog` |
| Opened | 2026-11-07 |
| Verification | Script: 2026-11-07 OpenCRE catalogue fixture, `check:integrations` and `check:audits` pass. Documentation: 2026-11-07 source revision and stdio/public-read boundary reviewed; PR CI pending. |
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
