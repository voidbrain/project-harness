# Reconciliation log 2026

## 2026-11-24 — main `1df48a6`

PRs #241–#242 merged on green CI: #241 (closed F-089; skill discovery review opened B-049, F-091, F-092), #242 (F-092, closed). Reconciled by #243 (B-049).

## 2026-11-24 — main `6e731fd`

PR #240 merged on green CI: v10.6.0 (F-089, closed). Skill discovery review recorded (docs/reviews/skills/2026-11-24.md): opened B-049, F-091, F-092. Reconciled by #241.

## 2026-11-24 — main `7f5c29a`

PR #239 merged on green CI: backlog only (closed F-090, reconciled #237–#238); no record names it. F-088 closed on its v10.4.0 Release. Reconciled by #240 (F-089).

## 2026-11-24 — main `89a3657`

PRs #237–#238 merged on green CI: #237 (backlog; v10.1.1 tagged late), #238 (v10.5.0, F-090). Reconciled by the F-090 closure PR.

## 2026-11-23 — main `2d179d0`

PRs #234–#236 merged on green CI: #234 (v10.3.1, B-048), #235 (closed B-048), #236 (v10.4.0, F-088). Correction to the entry below: v10.1.1 is now tagged on its #225 merge commit `1ad9eec` and has a Release (owner request).

## 2026-11-23 — main `e416eaa`

PRs #225–#233 merged on green CI: #225 (CHANGELOG 10.1.1, never tagged), #226 (reconcile of #209–#224), #227 (v10.2.0), #228 (opened F-087), #229–#231 (v10.3.0: F-075 T01–T02, F-087), #232–#233 (closed F-075, F-086, F-087). Reconciled by PR #234 with the B-048 fix (v10.3.1).

## 2026-11-22 — main `364274a`

PRs #209–#224 merged on green CI: released v8.18.0 (#211), v9.0.0 (#215), v10.0.0 (#217–#218), and v10.1.0 (#222–#223); closed F-080, F-083–F-085, and B-043–B-047; PR #224 updated PR title/signature rules. Cleared 7-day full 8-area audit (`docs/audits/2026-11-22-full-harness.md`) and periodic token/architecture reviews (`docs/reviews/token/2026-11-22.md`, `docs/reviews/architecture/2026-11-22.md`). Reconciled by PR #226.

Dated reconciliation entries and archived `Other changes` entries moved from `docs/BACKLOG.md`.

## Archived Other changes (moved from BACKLOG.md on 2026-11-13)

Published v4.7.0 after PR #99 / CI42887014187 passed169 fixtures/check and independent review fixes. [PR #100](https://github.com/voidbrain/project-harness/pull/100) records closure. F-048 is closed and archived with completed step table and all source limitations; no active feature remains. Release closure is independently owned here, with consumer reconciliation separately owned.

Published [v4.1.0](https://github.com/voidbrain/project-harness/tree/v4.1.0) at `a8a358e` after PR #80 passed owned CI and independent review. F-046 closes on the published tag; project adoption is independently owned.

Published [v4.0.0](https://github.com/voidbrain/project-harness/tree/v4.0.0) at `bdec31f`; release record F-045 archived after green CI and fresh-context review.

Published [v3.4.0](https://github.com/voidbrain/project-harness/tree/v3.4.0), tagged on `main` `a2c90f5` after [#73](https://github.com/voidbrain/project-harness/pull/73) merged on green [CI 42353515325](https://github.com/voidbrain/project-harness/actions/runs/42353515325). F-041–F-043 are closed and archived with their full history in [#74](https://github.com/voidbrain/project-harness/pull/74).

Published [v3.3.0](https://github.com/voidbrain/project-harness/tree/v3.3.0), tagged on `main` `a0ae25e` after [#66](https://github.com/voidbrain/project-harness/pull/66)–[#70](https://github.com/voidbrain/project-harness/pull/70) merged on green CI. F-032–F-037 are closed and archived with their history. The push guard is not installed in this clone and no behaviour-check runner is configured here: both are the owner's choice.

Published [v3.1.1](https://github.com/voidbrain/project-harness/tree/v3.1.1): annotated tag `bea6c60140f9ecf4fb9fa75849da5578fd5667e6` resolves remotely to approved main commit `7a81b930c5cbd689b8db9d4c74f9dd42ec1e7031`. [Publication run 41243779205](https://github.com/voidbrain/project-harness/actions/runs/41243779205) passed every verification/publication step, including all 72 fixtures. B-013/B-014 and F-026–F-030 are verified, closed and archived with their original IDs/dates/history. [#58](https://github.com/voidbrain/project-harness/pull/58) removes the one-time operational workflow and records closure. No release action or human dependency remains.

Full audit F-031 verified and closed 2026-10-31 after [#55](https://github.com/voidbrain/project-harness/pull/55) merged with [CI 41228352936](https://github.com/voidbrain/project-harness/actions/runs/41228352936) green. All eight areas have a dated full report/manifest; both confirmed defects are fixed with failing-before/passing-after regressions. Those records were release-pending at that review; the verified v3.1.1 publication above now closes them. Historical audit prose remains unchanged.

Published [v2.2.2](https://github.com/voidbrain/project-harness/tree/v2.2.2) at verified commit `0764a36`. [Publication run 41221315726](https://github.com/voidbrain/project-harness/actions/runs/41221315726) passed every verify/publish step and all 56 fixtures. B-011, B-012 and F-021–F-025 are closed and archived with their complete history. [PR #51](https://github.com/voidbrain/project-harness/pull/51) removes the one-time publication workflow. No publication blocker remains for v2.2.2. The newer cumulative release was subsequently published through the one-time workflow above. No new permission request or consumer dependency is implied.

## 2026-11-14 (main `c7fd76b`)

PRs [#167](https://github.com/voidbrain/project-harness/pull/167)–[#171](https://github.com/voidbrain/project-harness/pull/171) merged on green CI. #167 opened F-075, #168 opened F-076, #169 shipped F-076-T01, #170 opened F-077, #171 released v8.12.0 (F-076-T02–T06). F-076 closed and archived. Merged branch `feat/conflict-free-records` deleted from GitHub.

## 2026-11-14 (main `f209f34`)

[#172](https://github.com/voidbrain/project-harness/pull/172) closed F-076; [#173](https://github.com/voidbrain/project-harness/pull/173) shipped F-077-T01; both on green CI. The full audit ([report](../audits/2026-11-14-full-harness.md)) opened B-020, F-078 and F-079.

## 2026-11-14 (main `3cf831d`)

PRs [#174](https://github.com/voidbrain/project-harness/pull/174)–[#182](https://github.com/voidbrain/project-harness/pull/182) merged on green CI ([#180](https://github.com/voidbrain/project-harness/pull/180) after a re-run of a CI-only failure, tracked and fixed as B-021 in [#182](https://github.com/voidbrain/project-harness/pull/182)). #175: full audit, B-020, F-078, F-079; #174, #176–#179: F-077-T02–T06; #181: F-078-T01 plan; #180: B-020; #182: B-021. Drafted with `reconcile:draft`.

## 2026-11-14 (main `220727e`)

Published [v8.13.0](https://github.com/voidbrain/project-harness/tree/v8.13.0), tagged on `220727e` after [#183](https://github.com/voidbrain/project-harness/pull/183) (release), [#184](https://github.com/voidbrain/project-harness/pull/184) (F-078 owner decision) and [#185](https://github.com/voidbrain/project-harness/pull/185) (release review fixes) merged on green CI. F-077, B-020 and B-021 closed and archived in [#186](https://github.com/voidbrain/project-harness/pull/186).

## 2026-11-14 (F-079)

[#186](https://github.com/voidbrain/project-harness/pull/186) closed F-077, B-020 and B-021 on green CI. F-079: the owner chose a GitHub Release per tag; Releases v6.1.0–v8.13.0 published from the CHANGELOG, and the release step in AGENTS.md creates the next one.

## 2026-11-14 (main `f5e8f19`)

[#187](https://github.com/voidbrain/project-harness/pull/187)–[#191](https://github.com/voidbrain/project-harness/pull/191) merged on green CI: F-079 and its review fixes (#187, #188), F-078-T03 and T04 (#189, #191), B-022 (#190). Drafted with `reconcile:draft`; #188 was named by no record, so the F-079 archive gained an addendum.

## 2026-11-14 (main `bdf5517`)

Published [v8.14.0](https://github.com/voidbrain/project-harness/releases/tag/v8.14.0), tagged on `bdf5517` after [#192](https://github.com/voidbrain/project-harness/pull/192) (release) and [#193](https://github.com/voidbrain/project-harness/pull/193) (review fixes) merged on green CI. F-078 and B-022 closed and archived in [#194](https://github.com/voidbrain/project-harness/pull/194).

## 2026-11-14 (main `be6c2f5`)

[#194](https://github.com/voidbrain/project-harness/pull/194) closed F-078 and B-022; [#195](https://github.com/voidbrain/project-harness/pull/195) fixed B-023; [#196](https://github.com/voidbrain/project-harness/pull/196) released [v8.14.1](https://github.com/voidbrain/project-harness/releases/tag/v8.14.1). B-023 closed and archived in [#197](https://github.com/voidbrain/project-harness/pull/197).

## 2026-11-14 (main `9985802`)

[#197](https://github.com/voidbrain/project-harness/pull/197) closed B-023; [#198](https://github.com/voidbrain/project-harness/pull/198) opened B-024; [#199](https://github.com/voidbrain/project-harness/pull/199) fixed B-025 and released v8.14.2; [#200](https://github.com/voidbrain/project-harness/pull/200) fixed B-024 and B-026 and released v8.14.3. B-024, B-025 and B-026 closed and archived in [#201](https://github.com/voidbrain/project-harness/pull/201).

## 2026-11-15 (main `dcf3f1b`)

[#202](https://github.com/voidbrain/project-harness/pull/202) released v8.15.0 (F-080-T01); [#203](https://github.com/voidbrain/project-harness/pull/203) fixed B-027 and shipped F-081, released as v8.16.0. B-027 and F-081 closed and archived; F-082, F-083 and F-084 opened at the owner's request from NERV.

[#204](https://github.com/voidbrain/project-harness/pull/204) closed B-027 and F-081 and opened F-082–F-084; [#205](https://github.com/voidbrain/project-harness/pull/205) fixed B-028, released as v8.16.1. B-028 closed and archived.

## 2026-11-15 (main `4152ff3`)

[#206](https://github.com/voidbrain/project-harness/pull/206) closed B-028; [#207](https://github.com/voidbrain/project-harness/pull/207) shipped F-080-T02 (suggested pauses); [#208](https://github.com/voidbrain/project-harness/pull/208) shipped F-082-T01 (empty backlog and roadmap prompt), all green CI. Releasing v8.17.0.
