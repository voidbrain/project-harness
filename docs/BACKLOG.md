# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `dbec583` (merged #1, tagged v1.2.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

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

### F-003

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-003 | 🔶 P2 | Implemented | Reconcile marginalia-wars and OpenBando with 1.2.0 |

💻 **→ Human action required: No**<br />Close when openbando#196 merges.

**Next action / closure evidence:** Both projects reconciled from 1.1.1 at session start, as their `check:freshness` listed (copy `check-harness.mjs`, reconcile the AGENTS Work-tracking bullet, `version` 1.2.0): [marginalia-wars#10](https://github.com/voidbrain/marginalia-wars/pull/10) merged (`check` success; `e2e` failed only on its known B-008 spec); [openbando#196](https://github.com/voidbrain/openbando/pull/196) open with auto-merge on its required checks. Closes when #196 merges.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [marginalia-wars#10](https://github.com/voidbrain/marginalia-wars/pull/10), [openbando#196](https://github.com/voidbrain/openbando/pull/196) |
| Opened | 2026-10-29 |
| Verification | Script: both projects' `check:freshness` report "Harness: on template v1.2.0", 2026-10-29. CI: marginalia-wars#10 `check` success; openbando#196 pending |
| Reviewed | 2026-10-29 |

</details>

---

## Other changes

None yet.
