# How CI may write the backlog-views branch (F-096-T03), 2026-11-25

**Status: waiting on the owner's decision.**

Option B (decided 2026-11-24, [the views decision](generated-views-decision-2026-11-24.md)) publishes the built views from CI on `main` to a `backlog-views` branch, with "`contents: write` on that branch only". Two facts found while starting F-096-T03 stop the work:

1. The `GITHUB_TOKEN` cannot be limited to one branch: `contents: write` lets the job push to every branch the repository's rules do not protect.
2. The template's own reviewed contract (`tools/check-template.mjs`, check 5) requires every shipped workflow to be `contents: read` with no job-level `permissions`. A publishing job breaks it.

Nothing is published yet; F-096-T02 (built views, opt-in, unreleased) is merged and works without publishing. The PR artifact part of F-096-T03 needs only `contents: read` and can go ahead with any option.

## Options

| | Option | What the project needs | Risk |
|---|---|---|---|
| A | **One publishing job with `contents: write`** (proposed): a separate workflow, run only on push to `main` (never on a PR, so no PR code runs with write), serialised by a concurrency group, pushing only `refs/heads/backlog-views` as a fast-forward (never a force-push). `check-template` allows exactly that job and keeps every other workflow read-only. | Nothing new, unless an organisation policy forbids write tokens in workflows. Branch protection on `main` (already required) keeps `main` safe. | The job's token could push to any unprotected branch; only trusted `main` code runs it. |
| B | Option A plus a ruleset restricting `backlog-views` (and other branches) | A repository ruleset per project: an owner setting | Smallest reach; a setting each owner must add. |
| C | A deploy key with write access as a secret | A key and a secret per project: owner settings; breaks the "no secrets in shipped CI" contract too | Wider than A (a key outlives a run). |
| D | No branch: the built views as a CI artifact on PRs and on `main` only | Nothing | Links cannot point at a stable page; coordinators must rebuild (changes the decided option B). |

## To decide

Choose an option (A proposed). A, B and C relax the template's read-only workflow contract for one named job; D changes option B. Reply in the session or on F-096.
