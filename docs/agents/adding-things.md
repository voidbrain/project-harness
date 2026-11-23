# Adding things

Read before you add a rule for every project, a check, a stack add-on, or take a change asked from a project (AGENTS.md, procedures table). Moved from AGENTS.md in 10.5.0, unchanged in substance.

- **A rule for every project**: in the `core/` file that owns it (AGENTS template, BACKLOG-RULES, STYLE-GUIDE), the same rule in this repository's own copy when it applies here, a CHANGELOG line, and a step in [APPLY.md](../../APPLY.md) if applying or reconciling changes.
- **A check**: the script in `core/tools/` (copied) reading its settings from `.harness.json`, the setting in `core/.harness.json` or the stack fragment, the file in `copied`, the npm script in `angular/package-scripts.json`, the CI step in `angular/.github/workflows/ci.yml`, a row in the README table.
- **A change asked from a project**: decide where it belongs and release before the project reconciles, as [APPLY.md](../../APPLY.md) ("Changing the harness from a project") says.
- **A stack add-on**: a folder like `angular/` with its AGENTS section, tools, config and a `.harness.fragment.json`; a step in APPLY.md, "Choose the stack add-ons".
