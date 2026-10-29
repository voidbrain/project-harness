# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `98d8876` (merged #8, tagged v1.8.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

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
| 🟡 | F-002 | 🔹 P3 | Implemented | Template check in project CI (1.9.0) |

💻 **→ Human action required: No**<br />Merge #10 on a green CI and tag `v1.9.0`.

**Next action / closure evidence:** `check-harness` ran at session start on a developer machine; in project CI there was no template clone, so it was skipped and a project that fell behind a release was only noticed locally. Decided 2026-10-29: the owner made the repository public, so CI can `git clone` it without a token. Release 1.9.0: the Angular `CI` workflow clones `template.repo` into the runner's temp folder and runs `check:freshness -- --github` with `HARNESS_HOME` on it; a failed clone is a warning. No tool logic changed (comments in `check-harness`). Closes when `v1.9.0` is tagged.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#10](https://github.com/voidbrain/project-harness/pull/10) |
| Opened | 2026-10-29 |
| Verification | Project trial: marginalia-wars (on 1.6.0) run as the CI step runs it (fresh public clone, `CI=true`, `--github`): `::warning` lines for each file to update and "v1.8.0 is out (this project is on v1.6.0)", exit 0; without a clone, skipped quietly, 2026-10-29. Script: Pending |
| Reviewed | 2026-10-29 |

</details>

---

## Other changes

None yet.
