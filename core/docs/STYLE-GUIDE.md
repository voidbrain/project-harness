# {{PROJECT_NAME}} style guide

How the product looks and talks, and how this repository's documents are written. Read it before changing UI (templates, component styles, global styles, user-facing text). The values live in code: <!-- harness: where the tokens are defined, e.g. CSS custom properties in `src/styles.scss` (`:root`) -->. When this guide and the code disagree, the code is what ships: fix whichever is wrong and record the discrepancy in the backlog if it is not fixed in the same change.

<!-- harness: one paragraph on the product's character: who uses it, the mood, what carries the colour. Link existing art-direction or design-system docs instead of copying them. -->

## Documentation ownership

This guide governs the application UI and repository writing; [Backlog rules](BACKLOG-RULES.md) govern tracking. Backlog status/priority emoji are documentation cues, not app icons. README describes capabilities; AGENTS directs implementation. User instructions take precedence.

## Content and voice

<!-- harness: replace with the product's real voice, with two or three real examples from the UI. -->
- **Voice:** short, direct, addressed to the user. No "we", no exclamation marks, no emoji in the UI.
- **Sentence case** for buttons, labels and hints. Capitals come from a text style, never typed.
- **Say what happened, then what to do.** "Could not load the stage. Check your connection and reload."
- Units and numbers: <!-- harness: units, formats, separators -->.

## Visual foundations

### Colour

<!-- harness: one row per token actually defined in code. Name, value, role. Then the rules: what may be filled with what, state pairs, the one accent. -->

| Token | Value | Use |
|---|---|---|
| `--{{token}}` | `{{#hex}}` | {{role}} |

- Use tokens (`var(--…)`), never a new literal colour. A new colour is a new token, added here in the same change.
- Change fill and foreground as a pair, and check contrast (WCAG AA: 4.5:1 for text, 3:1 for large text and UI parts).

### Type

<!-- harness: faces actually loaded (and from where), base size/line height, the named text styles. -->

### Spacing and layout

<!-- harness: the spacing scale as it is in code, layout rules, breakpoints. -->

### Borders, radii, shadows

### States and motion

- Hover, active, selected, disabled and focus each have one treatment. Focus is always visible.
- Respect `prefers-reduced-motion`: decorative motion stops, essential motion shortens.

## Components

<!-- harness: one short entry per shared component: what it is for, its source file, its variants, what not to do. Split into docs/style-guide/<Component>.md when this grows past a screen. -->

## Accessibility

- Every interactive element is reachable and operable by keyboard, with a visible focus and an accessible name.
- Colour never carries meaning alone. Text meets WCAG AA contrast on its real background.
- Images that carry meaning have alt text; decorative ones have `alt=""`.

## Assets

<!-- harness: where images, fonts and media live; formats and size limits; provenance and licensing rules; metadata (GPS) stripping. -->

## Writing in this repository

- Plain English, short sentences, active voice. Say what is, not what might be.
- Name things as the code names them: files, functions, commands in backticks, linked when they are paths.
- Dates are absolute (`2026-10-29`), never "yesterday" or "last week".
- One owner per fact: link to it rather than restating it. AGENTS for how to work, the backlog for status, this guide for look and voice, README for what the product does.

## Keeping it in step

A change that adds or alters a token, a text style, a shared component or the voice updates this guide in the same PR. A design doc that disagrees with the code becomes a backlog record.
