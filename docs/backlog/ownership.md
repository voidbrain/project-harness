# Ownership

Read before work that touches another repository or a solution coordinator. Part of the [backlog rules](../BACKLOG-RULES.md).


## One repository, one backlog

Each backlog owns the work of its own repository and nothing else (single responsibility). Dependencies point one way: a repository may wait on what it uses, never on what uses it. For this repository, the projects that apply the harness are downstream.

- **Here.** A record tracks a change made in this repository: template text, tools, procedure. Its next action is a step taken here, and it closes on what this repository shows: the PR merged on a green CI and, for a release, its tag on GitHub.
- **Downstream: never wait for a project.** A release record closes on its tag. Reconciling a project with it is that project's work: its `check:freshness` reports the release at its next session start, and its own backlog records the reconcile. "Closes when both projects report it" is the wrong condition.
- **Evidence from projects** may supplement owned fixtures: cite an already completed consumer trial in Verification. It is optional evidence, never a required pre-tag trial or a pending consumer gate.
- Link a project's record when it matters (the request that started a change, a failure it found); never track its status here.

Test: if a record's next action or closure condition can only happen in another repository, it is in the wrong backlog. Move that part to the backlog it belongs to and link it.


### Ownership rejection and dependency direction

Reject an active record during review if its Issue, next action or closure criteria assign work to a different repository. Split that work into the owning repository's backlog and retain only an upstream dependency link or dated evidence here. A downstream adoption reminder is still foreign work when hidden in details, labelled a follow-up or placed after the release step. Check all three places, not only the title. This is a semantic review requirement; the layout validator does not establish ownership.

Apply single responsibility and dependency inversion to architecture and delivery: a reusable master/template/library owns generic contracts and behaviour; derived projects depend on those contracts through their own adapters or configuration. A master must not import derived-project implementation, require its private state or deployment, or make its release, acceptance or closure wait for downstream adoption. Required regression tests use repository-owned fixtures and contract tests. An already completed consumer trial may be cited as evidence; it never becomes a pending downstream release gate. Product-specific requirements stay in the product repository.


### Solution coordinators

An optional solution repository owns architecture/contracts, compatibility, coordination and end-to-end integration acceptance. It may legitimately depend on its component releases; this is composition, not a reusable master depending on derived consumers. Components retain their own implementation records and close them on their own acceptance. The coordinator's next action can be defining a contract or running integration checks, never doing a foreign repository's implementation under its own ID. Use the [solution profile](../agents/solution-profile.md) and qualified `Components` links. Generated dashboards are read-only snapshots, preserve source ownership/revisions and report missing sources as unknown; never edit copied statuses or average completion percentages. A generic harness release uses its own fixtures and never waits for a real coordinator to adopt it.
