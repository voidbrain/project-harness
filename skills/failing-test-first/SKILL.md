---
name: failing-test-first
description: Enforce bug-fix discipline by reproducing the defect with a committed failing test before writing the fix, preserving the test unchanged, or documenting a justified manual check when automation cannot reach it. Works standalone in any repository.
metadata:
  version: "1.0.0"
---

# Failing test before the fix

Version: `1.0.0` · Releases: https://github.com/voidbrain/project-harness

Every bug fix starts with proof of the failure so the regression test cannot accidentally pass for the wrong reason.

## Procedure

1. **Write the reproduction test first**: Add an automated test that triggers the reported bug and asserts the intended behaviour.
2. **Verify it fails**: Run the test before touching production code and confirm it fails for the exact reported defect.
3. **Commit the failing test** (or record its pre-fix failure output) before applying the fix.
4. **Implement the fix**: Change the production code until the new test and the existing suite pass.
5. **Do not edit the failing test to make it pass**: A test expectation may only change if the underlying requirement deliberately changed — in that case, explicitly state which requirement changed and why.
6. **Record the evidence**: Note `Test: <file or test name>` in the bug record or PR description.

## When no automated test can reproduce the defect

Use this fallback only for purely visual, hardware/device-only, or unmockable external-service behaviour:

1. State **why** an automated test cannot catch the defect.
2. State the **exact manual check** that replaces it (inputs, environment, expected output).
3. Record it explicitly as `No test: <reason and manual check>` in the bug record or PR description.
