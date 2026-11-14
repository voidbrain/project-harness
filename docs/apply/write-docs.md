# Writing the instruction and doc files (step 3)

Part of the [harness procedure](../../APPLY.md). Read when you write a project's instruction and documentation files.

## 3. Write the files

For each template file, adapt it to the project; do not copy it unchanged.

- **CLAUDE.md**: as the template. If one exists with more content, move that content into AGENTS.md or the area notes.

- **AGENTS.md**: the project sections of `core/AGENTS.md`. Stack rules load by trigger (8.12.0): for Angular, `docs/agents/angular.md` from `angular/docs/agents/angular.md`, minus rules that do not fit the project's framework version, with a procedures-table row "change Angular code" linking it. Fill each section from what the project really does. Delete a section that has nothing true to say rather than padding it. Keep it under ~200 lines; detail goes to `docs/agents/areas.md`.

- **docs/agents/areas.md**: one section per area of the code that has its own rules or lessons. Existing subagent definitions (`.claude/agents/*.md`) map naturally to areas. Keep the subagents and make them point to AGENTS.md and their area section instead of repeating rules, and fix any of their rules that contradict AGENTS.

- **Other agent instruction files** (Copilot, Cursor, Continue): reduce to a pointer to AGENTS.md plus anything that tool needs and the others do not.

- **docs/STYLE-GUIDE.md**: fill from the code (CSS custom properties, theme files, fonts actually loaded). The code is the source of truth. An existing art-direction or look-and-voice doc is **merged into it** (concept, references, do and don't, per-character or per-screen notes) and deleted, so one document owns the palette and type; values it gives that the code does not ship become a backlog record and are listed, not silently dropped. A full design-system folder (tokens file plus one guide per component) stays where it is; the style guide then links it instead of restating it.

- **docs/DESIGN.md** (optional): what the product does in its own terms (game design, domain model, protocol). Merge an existing game-design or spec doc into it, or keep its name if the project already uses one (`GAME-DESIGN.md`). It describes the rules and names where each one lives; tables of numbers stay in the code, linked. Check every claim against the code; promised but unbuilt behaviour becomes a backlog record. Skip the file if the README covers it.

- **Deploy notes**: a short deploy doc becomes a README section ("Deploying"); keep a separate file only when it is long or audience-specific.

- **docs/BACKLOG.md**: header with today's date and the current `main` commit (`git rev-parse --short origin/main`). Seed records from the baseline and hygiene findings, and from any TODO list or plan in the existing docs. Each record is reproducible and has a next action. A finding the user must decide on (naming, scope, deleting history) gets 🧑 Decision; one the user must run or check gets 🧑 Procedure. Add a record for the harness change itself (Implemented, verified by the first PR's CI).

- **docs/BACKLOG-RULES.md**: as the template, with the project name. Edit the Documentation consistency list to name the docs this project actually has.

- **docs/audits/<today>-<topic>.md** and matching **.audit.json**: baseline audit report and declared scope under the shared audit guide; name checks, limits, findings and owning records.

- **docs/archive/README.md** and **docs/audits/README.md**: adapt the template guidance and retain their stamp entries; audit evidence stays dated and append-only once published.

- **README.md**: keep the project's README and its voice. Add or correct "Run it" (the real commands), "Where things are", and a short "Working on it" section linking AGENTS, the backlog and the style guide. Fix claims the baseline proved wrong.
