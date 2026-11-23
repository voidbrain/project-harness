---
name: change-impact
description: Track derived outputs, input dependencies, value couplings, and outside dependencies so changes never leave generated pages, recordings, translations, or guides stale. Works standalone in any repository.
metadata:
  version: "1.0.0"
---

# Change impact

Version: `1.0.0` · Releases: https://github.com/voidbrain/project-harness

Keep every derived output, shared constant, and external dependency synchronized whenever a source file or input changes.

## When to use

- Before editing or opening a PR that touches source data, shared constants, themes, generated pages, screenshots/recordings, translations, or user guides.
- When you discover a derived artifact that has no documented rebuild step or verification check.

## Procedure

1. **Inventory derived outputs**: List every file generated from another file (generated pages/data, recordings, screenshots, translations, guides, tours, feature docs) and record:
   - `when`: source file globs that trigger a rebuild
   - `inputs`: data, fixtures, or examples loaded by the output
   - `then`: what must be regenerated or updated
   - `run`: exact command to rebuild it
   - `checked`: command or assertion that verifies it is up to date
   - `after`: upstream rows that must run first (chains: catalogue rebuilt -> examples -> pages)
2. **Track value couplings**: If a constant (timing, colour, offset, size, schema version) is used in two or more places, prefer a single source of truth that all consumers read. If two copies must exist, add a test asserting they match and record both locations as a coupling so changing one always checks the other.
3. **List outside dependencies**: Record external factors that can alter outputs without a commit (library upgrades, CI OS/browser versions, external APIs or datasets) with what they affect and when they were last reviewed.
4. **Execute in dependency order**: Whenever a change matches `when` or `inputs`, run each triggered row (respecting `after` order) in the same PR, or record explicitly why a row was deferred.
5. **Scope verification**: If only a subset of outputs is affected, run every affected rebuild and check and record any unverified area honestly rather than claiming a full pass.

## Optional template

See [impact-map.json](templates/impact-map.json) for a portable JSON schema you can keep in any repository to document `impact`, `couplings`, and `outside` entries.
