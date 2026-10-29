# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `c4c0f9a` (merged #7, tagged v1.7.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

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

### B-002

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | B-002 | 🔶 P2 | Implemented | Guards that claimed more than they checked: archive lines, unfetched remote, commits without a PR (1.7.0) |

💻 **→ Human action required: No**<br />Reconcile marginalia-wars to 1.7.0.

**Next action / closure evidence:** A second outside review (2026-10-29) reproduced three gaps, all confirmed in the code: `check-backlog` compared only archived IDs and closed-row counts, so an emptied record or a replaced row passed while it printed "keep everything"; `check-freshness` ignored a failed fetch and could print "Fresh" from stale refs; it found changes only through `Merge pull request #N` or `(#N)` in the message, so a rebase merge or direct push was skipped silently. Release 1.7.0: every published archive line must still be there, in order (corrections are dated notes); a failed fetch is a warning; every first-parent commit that changes more than records is listed, with its PR from the message or `gh`, else by hash. Merged in #7 and tagged `v1.7.0`; OpenBando's main reports 1.7.0, marginalia-wars is still on 1.6.0 (main `2d446b29`). Closes when marginalia-wars reports 1.7.0.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#7](https://github.com/voidbrain/project-harness/pull/7) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 17/17 (the three new behaviours fail on the 1.6.0 tools); the new tools in marginalia-wars and OpenBando pass their archives and find exactly #13 and #199, 2026-10-29. CI: [#7 check success](https://github.com/voidbrain/project-harness/actions/runs/40914058081), 2026-10-29 |
| Reviewed | 2026-10-29 |

</details>

---

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

## Other changes

None yet.
