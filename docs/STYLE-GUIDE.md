# Project harness style guide

How this repository's template text and documents are written. It has no UI; the template's own [STYLE-GUIDE](../core/docs/STYLE-GUIDE.md) is what projects receive for theirs.

## Voice

- Plain English, short sentences, active voice, addressed to the agent or person doing the work: "Run", "Read", "Record". No "we", no hedging, no marketing.
- Rules say what to do and why in one line; examples come from real projects (OpenBando, marginalia-wars) rather than invented ones.
- Say what is, not what might be. A rule nobody checks says so, or gets a check.

## Template text

- Placeholders in capitals inside double braces: `{{PROJECT_NAME}}`, `{{MAIN_SHA}}`. Agent instructions in `<!-- harness: … -->` comments, saying what to fill and from where.
- A template section that may not apply says how to decide ("Delete the section if…").
- Template files keep the structure of an applied file, so a reconciled project can diff them section by section.

## Markdown

- Names as the code names them: files, commands, keys in backticks; paths linked when they are local.
- Dates absolute (`2026-10-29`). Tables with a header and `|---|` separators; a blank line before and after.
- One owner per fact: link rather than restate. AGENTS for how to work, the backlog for status, the CHANGELOG for what changed, APPLY.md for the procedure, README for what the harness is.

## Keeping it in step

A change to the voice or conventions here updates the template's own style guide in the same PR when it applies to projects too.
