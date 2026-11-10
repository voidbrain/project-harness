# Subscription allowance source review — 2026-11-11

Scope: optional development-account allowance metadata for F-048 T04–T06. This is not consumer runtime accounting, billing, a model evaluation or proof of task causality.

## Selected sources

- Codex: the official [app-server documentation](https://learn.chatgpt.com/docs/app-server) exposes the read-only `account/rateLimits/read` method and documented `usedPercent`, window-duration and reset fields. The harness starts the installed `codex app-server` over stdio, initializes it, makes only that account read and exits. It does not invoke a model, alter authentication or persist the returned account identity/plan/credit fields.
- Claude Code: the official [status-line documentation](https://code.claude.com/docs/en/statusline) documents `rate_limits.five_hour` and `rate_limits.seven_day` percentage/reset fields for supported subscription plans after an API response. The capture command receives the status-line JSON on stdin and persists only those two windows. Session, transcript, workspace and cost fields are discarded.
- Claude cost guidance remains separate: the official [cost documentation](https://code.claude.com/docs/en/costs) describes client usage/cost surfaces, but a subscription allowance percentage is not an API token price or task bill. The harness performs no conversion.

## Local acceptance

On 2026-11-11, the installed Codex CLI completed one live read through `collect-codex`, linked to the active F-048 T04 job. Four documented buckets were normalized into the private usage store. The generated task-filtered report listed Codex as an observed provider and `report --out` produced byte-identical stdout/file JSON with mode 0600 in a private directory. Counter values and local account details remain in the private ledger and are not copied into this review.

Claude Code 2.1.312 is installed, but the existing user settings had no status-line command. Neutral fixtures verify filtering, missing-field behavior, reset/decrease boundaries, coalescing and report joins. This release does not silently edit global Claude settings; adoption is an explicit settings merge so an existing status line is preserved. Live Claude subscription coverage therefore remains unobserved until that optional setup is selected and a post-response payload contains `rate_limits`.

## Interpretation limits

Rolling allowance is account-wide and may overlap other sessions. A linked before/after percentage change requires stable source, bucket, window length and reset identity and is labelled shared-account metadata, not exact job usage. Concurrent ledger jobs overlapping that interval are listed; unknown external concurrency still prevents exclusivity claims. Reset changes, decreases and missing snapshots prevent attribution. Token totals still require authorized request metadata; currency still requires explicit rates or a separately recorded fixed subscription charge. No counter absence means zero, and no report rewrites a backlog estimate automatically.
