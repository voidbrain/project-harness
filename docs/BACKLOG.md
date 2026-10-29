# Project harness backlog

Current work ledger, reviewed 29 October 2026 against main `129efa0` (merged #5, tagged v1.5.0; CI read with `ci:status`). The [baseline audit](audits/2026-10-29.md) records this repository's state when it began following its own harness. Closed items are in [the archive](archive/backlog-2026-10-29.md). IDs are stable: do not reuse them.

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

### B-001

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | B-001 | 🔺 P1 | Implemented | Archived records lost by a rewrite; archives now only grow (1.6.0) |

💻 **→ Human action required: No**<br />Merge, tag `v1.6.0`, reconcile marginalia-wars and OpenBando.

**Next action / closure evidence:** Found 2026-10-29 while reconciling marginalia-wars with 1.5.0: the agent's archiving scripts opened the archive for writing before reading it (`open(p,'w').write(open(p).read() + …)`), so each archiving replaced the file with only the new records. Lost on `main`: here F-001 and F-003 (in #3's 1.4.0 PR) and F-004 (in #5); in marginalia-wars F-005, B-005, F-007 and F-008 (in its #12). OpenBando's archives only ever grew (checked across their history). Restored from git history: every committed version of the archive, each record's latest text, in archiving order. Guard: `check-backlog` fails when a record or closed row an archive has on the published default branch is missing locally; a fixture test covers it and fails on the 1.5.0 tool. Closes when `v1.6.0` is tagged and both projects report it, with their archives restored.

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#6](https://github.com/voidbrain/project-harness/pull/6) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 15/15 (the guard test fails on the 1.5.0 tool), archives rebuilt and diffed against `main` (insertions only), 2026-10-29. CI: Pending |
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

### F-006

| Signal | ID | Priority | Status | Item |
|:---:|---|---|---|---|
| 🟡 | F-006 | 🔶 P2 | Implemented | Review follow-ups: proven tools, lighter defaults (1.5.0) |

💻 **→ Human action required: No**<br />Reconcile marginalia-wars and OpenBando (with 1.6.0).

**Next action / closure evidence:** An outside review (2026-10-29) found, and the code confirmed: a test rule that invites changing tests to match regressions; `check-freshness` scanning `HEAD` (blind to PRs merged on GitHub while the local branch is behind) and only merge commits; `main` hard-coded; a fixed 7-day audit; `.pathname` paths; heuristic convention results presented as exact; no behavioural tests. The owner declined its task-size tiers (harness work keeps its order). Release 1.5.0 fixes each and adds `tools/test-tools.mjs`: 14 fixture tests, of which 12 fail against the 1.4.0 tools. The new tools give the same output as the old ones in marginalia-wars and OpenBando, except the new `check-conventions` wording. Closes when `v1.5.0` is tagged and both projects report "Harness: on template v1.5.0".

<details>
<summary>PR history, dates and verification</summary>

| Field | Value |
|---|---|
| PR / evidence | [#5](https://github.com/voidbrain/project-harness/pull/5) |
| Opened | 2026-10-29 |
| Verification | Script: `test:tools` 14/14 (12/14 fail on 1.4.0 tools), `check:template`, `check:backlog`, before/after output in both projects, 2026-10-29. CI `check`: success on #5 (`test:tools` 14/14 on Linux); `v1.5.0` tagged |
| Reviewed | 2026-10-29 |

</details>

---

## Other changes

None yet.
