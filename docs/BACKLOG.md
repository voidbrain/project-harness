# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `fa7ecfd` (v1.1.1). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items move to [the archive](archive/README.md). IDs are stable: do not reuse them.

## How to use this file

| Status | Requirements | Next statuses and conditions | Priority cue |
|---|---|---|---|
| **🔴 Open** | Reproducible bug or agreed capability; scope and next action recorded. | - **Investigate** if cause/scope is uncertain<br>- **Implemented** when code is complete<br>- **Blocked** if a named dependency prevents progress<br>- **Closed** if cancelled/superseded, with reason. | Coloured |
| **🟠 Investigate** | Report and unanswered question recorded; next diagnostic identified. | - **Open** when scope/cause is established<br>- **Implemented** when fixed<br>- **Blocked** if evidence/dependency is unavailable<br>- **Closed** if duplicate/not reproducible after documented investigation, with reason. | Coloured |
| **🟡 Implemented** | Code exists; required verification remains pending. | - **Verified** when all acceptance checks pass<br>- Open or Investigate if a check fails<br>- **Blocked** if a required check cannot proceed. | Coloured |
| **🟢 Verified** | All acceptance checks passed; date, method and evidence recorded, including human/device checks when required. | - **Closed** when no action remains and resolution is recorded<br>- **Open** or **Investigate** if new evidence invalidates verification. Do not leave completed items here indefinitely. | Coloured |
| **🟣 Blocked** | Specific blocker, affected work/check and resume condition recorded. | - Return to **Open**, **Investigate** or **Implemented** when unblocked<br>- **Verified** only after all checks pass<br>- **Closed** if cancelled/superseded, with reason. | Grey ◻️ |
| **🔵 Closed** | Resolution recorded and item archived. | - **Open** or **Investigate** if reopened by new evidence<br>Retain ID, original Opened date and historical closure record. | Grey ◻️ |

Follow [Backlog rules](BACKLOG-RULES.md) for updating records, reconciling PR/CI evidence, stale-state review, closure/archiving, human dependencies and table validation. Preserve stable IDs and existing user edits.

Each item has a compact summary, followed by its human-action line (icon first: 🧑 **→ Human action required: Yes** = a human is needed, including a decision; 💻 **→ Human action required: No** = agent-owned next action, not completion), then the full-width **Next action / closure evidence**. Expand its details for PR history, dates and verification evidence. A `---` line ends every item.

## Bugs and reliability

None open.

## Features and improvements

### F-001

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-001 | 🔶 P2 | Implemented | Online first, and the template follows its own harness (1.2.0) |

💻 **→ Human action required: No**<br />Open the PR; after merge, tag v1.2.0 on main and push the tag.

**Next action / closure evidence:** Release 1.2.0 (CHANGELOG): `check-harness` warns about an unreachable, behind, ahead, dirty, remote-less or missing template clone; APPLY.md step 0, the AGENTS template and the `apply-harness` skill pull the published template first; this repository gets its own AGENTS, area notes, backlog and rules, style guide, audits, `.harness.json`, scripts, `CI` workflow and `check-template`. Next: PR, CI green, merge, `git tag -a v1.2.0`, push the tag. Closes when the tag is on GitHub and `check:freshness` here reports the repository on v1.2.0.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#1](https://github.com/voidbrain/project-harness/pull/1) |
| Opened | 2026-10-29 |
| Verification | Script: `check:template`, `check:backlog`, `check:freshness` locally, 2026-10-29. CI: Pending |
| Reviewed | 2026-10-29 |

</details>

---

### F-002

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔴 | F-002 | 🔹 P3 | Open | Template check in project CI |

🧑 **→ Human action required: Yes**<br />Decide whether to make the template public or give project CI a read token.

**Next action / closure evidence:** `check-harness` runs at session start on a developer machine; in project CI there is no template clone, so it is skipped and a project that falls behind a release is only noticed locally. The template repository is private. Options: make it public (CI can `git clone` it), or add a read-only token secret to each project. Next, after the decision: a CI step in `angular/.github/workflows/ci.yml` that clones the template into `HARNESS_HOME` and runs `check-harness --github`. Closes when a project's PR shows a warning for an older release.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-10-29 |
| Verification | Pending |
| Reviewed | 2026-10-29 |

</details>

---

### F-003

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔴 | F-003 | 🔶 P2 | Open | Reconcile marginalia-wars and OpenBando with 1.2.0 |

💻 **→ Human action required: No**<br />After v1.2.0 is tagged, reconcile both projects in their next PRs.

**Next action / closure evidence:** Both projects are on 1.1.1 ([marginalia-wars#9](https://github.com/voidbrain/marginalia-wars/pull/9), [openbando#195](https://github.com/voidbrain/openbando/pull/195)). 1.2.0 changes their copied `check-harness.mjs` and the Work-tracking bullet of `core/AGENTS.md`. Next: once those PRs merge and v1.2.0 is tagged, each project's `check:freshness` lists the update; copy the tool, reconcile AGENTS, set `version`, one PR each. Closes when both stamps name 1.2.0 on their `main`.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-10-29 |
| Verification | Pending |
| Reviewed | 2026-10-29 |

</details>

---

## Other changes

None yet.
