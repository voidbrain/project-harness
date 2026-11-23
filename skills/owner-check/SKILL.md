---
name: owner-check
description: Write clear, copy-pasteable human verification steps and decision prompts naming the target machine, exact commands or chat inputs, expected outputs, and options. Works standalone in any repository.
metadata:
  version: "1.0.0"
---

# Copy-paste owner checks

Version: `1.0.0` · Releases: https://github.com/voidbrain/project-harness

When a task requires a human to run a check on a real device/service or make a design decision, give them a single self-contained page or message they can execute without hunting across files.

## Classify the human action

- **Procedure**: Human must run, try, or inspect something (hardware, real device, private credentials, visual check).
- **Decision**: Human must choose between options or approve a scope/policy change.
- **Both**: Both a decision and a manual check are required.
- **None**: An agent can complete and verify the remaining work autonomously.

## Rules for procedure steps

1. Put the steps directly in the linked target page (never "below", "in collapsed details", or chained through another link).
2. Group steps into copy-paste blocks.
3. Name the **exact machine or environment** each block runs on (e.g. `Mac`, `Windows host`, `Telegram chat`).
4. State the **exact command or chat text** to enter.
5. State the **expected result** immediately after each step so pass/fail is unambiguous.
6. If nothing needs to be run, state **exactly what to look at** and what healthy vs broken looks like.

## Rules for decisions

1. State the question in one sentence.
2. List the concrete options with trade-offs and a recommended default if appropriate.
3. State what happens once the owner picks an option.

## Template

See [check-page.md](templates/check-page.md) for a copy-pasteable check page structure.
