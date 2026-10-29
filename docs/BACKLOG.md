# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `722d202` (merged #3, tagged v1.3.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

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

### F-002

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🔴 | F-002 | 🔹 P3 | Open | Template check in project CI |

💻 **→ Human action required: No**<br />Add a template-check CI step to the Angular CI template and release it.

**Next action / closure evidence:** `check-harness` runs at session start on a developer machine; in project CI there is no template clone, so it is skipped and a project that falls behind a release is only noticed locally. Decided 2026-10-29: the owner made the repository public, so CI can `git clone` it without a token. Next: a CI step in `angular/.github/workflows/ci.yml` that clones the template into `HARNESS_HOME` and runs `check-harness --github`. Closes when a project's PR shows a warning for an older release.

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

### F-005

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-005 | 🔶 P2 | Implemented | Project overrides: marked rules and forked tools (1.4.0) |

💻 **→ Human action required: No**<br />Merge, tag `v1.4.0`, reconcile marginalia-wars and OpenBando.

**Next action / closure evidence:** Asked 2026-10-29: change a harness setting, behaviour or rule for one project only, like a fork that still receives releases and surfaces conflicts. Release 1.4.0: APPLY.md "Project overrides" (setting first; a `> Project override` line in an adapted file, counted by `check-harness` when the template source changes; a copied tool listed under `forked` with source, base and reason, three-way merged with each release, `--merge` to write it). Tried in a scratch copy of marginalia-wars with `check-freshness.mjs` forked from v1.0.0: a non-overlapping edit (audit age 14) merged cleanly and gained the template's harness hook, base moved to 1.3.0, then quiet; an edit to the first line conflicted with markers and the base stayed; a missing reason and an unknown base were reported; an override line was counted. Closes when `v1.4.0` is tagged and both projects report "Harness: on template v1.4.0".

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | — |
| Opened | 2026-10-29 |
| Verification | Script: scratch fork tests above, `check:template`, `check:backlog`, 2026-10-29. CI: Pending |
| Reviewed | 2026-10-29 |

</details>

---

## Other changes

None yet.
