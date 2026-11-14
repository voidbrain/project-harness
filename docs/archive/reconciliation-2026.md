# Reconciliation log 2026

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

[#197](https://github.com/voidbrain/project-harness/pull/197) closed B-023; [#198](https://github.com/voidbrain/project-harness/pull/198) opened B-024; [#199](https://github.com/voidbrain/project-harness/pull/199) fixed B-025 and released v8.14.2; [#200](https://github.com/voidbrain/project-harness/pull/200) fixed B-024 and B-026 and released v8.14.3. B-024, B-025 and B-026 closed and archived.
