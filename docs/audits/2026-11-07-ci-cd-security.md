# CI/CD security review — 7 November 2026

Baseline: `27484034d1a94799de75b76979688d67fb210f26` (`main`). This scoped review covers the repository's own CI, the generic maintenance workflow, and the shipped Angular and solution CI templates. It is not a full repository audit, a GitHub configuration review or a certification.

## Scope and method

Read the workflows and `tools/check-template.mjs`; compare their triggers, token permissions, action references, install steps, artifacts and secret use against the [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/). Verify the pinned action release tags against the official GitHub repositories. Review GitHub's [GITHUB_TOKEN permission guidance](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token), [secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use) and [pull-request event behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request). Run local template, backlog and MCP metadata checks. The report does not inspect repository branch-protection settings or execute a real fork PR.

The workflow fixes are enforced by `check:template`: all shipped workflows must grant only workflow-level `contents: read`, pin each action to a full commit SHA with its release tag in a comment, avoid `pull_request_target` and secret expressions, and generate/upload CycloneDX SBOMs in the two Node CI workflows.

## OWASP risk review

| Risk | Result | Evidence and limits |
|---|---|---|
| CICD-SEC-1 — Insufficient Flow Control Mechanisms | Not applicable to workflow YAML | CI runs on pull requests targeting `main`; required reviews and branch protection are GitHub repository settings, not controlled by these templates. Their presence was not checked and is not claimed. |
| CICD-SEC-2 — Inadequate Identity and Access Management | Fixed here | Every shipped workflow grants only `contents: read`; no job-level permission override is present. `checkout`, `setup-node` and `upload-artifact` are pinned to verified release commit SHAs. |
| CICD-SEC-3 — Dependency Chain Abuse | Fixed here | Angular CI uses `npm ci`; root and Angular Node CI emit a CycloneDX SBOM artifact. Actions are immutable-SHA pinned. The template root has no dependency lockfile or npm dependencies, so its SBOM lists the project itself and no third-party components; Angular consumers supply their committed lockfile. |
| CICD-SEC-4 — Poisoned Pipeline Execution (PPE) | Covered | PR workflows use `pull_request`, not `pull_request_target`, and contain no secret expressions. Fork PRs still execute untrusted project code, but the explicit token scope is read-only and no repository secrets are referenced. A live fork-PR execution was not performed. |
| CICD-SEC-5 — Insufficient Pipeline-Based Access Controls | Fixed here | Workflow-level `contents: read` is the only permission; no job receives write access. The template checker rejects a broadened or job-level permission block. |
| CICD-SEC-6 — Insufficient Credential Hygiene | Covered | No repository secrets are used or passed. GitHub may provide its automatically generated token; its permissions are limited to read-only contents. `actions/checkout` persists that token in the job's Git configuration by default, so untrusted PR code can use its limited read scope during the job. No write scope is available. |
| CICD-SEC-7 — Insecure System Configuration | Covered | CI uses GitHub-hosted `ubuntu-latest` runners and Node 22. Runner images and the Node major's patch release can drift; exact runner images and Node patch versions are not pinned. |
| CICD-SEC-8 — Ungoverned Usage of 3rd Party Services | Covered | Workflows call official GitHub Actions pinned to verified commits and npm for the declared lockfile install. Organization action allowlists, npm registry policy and service availability are external settings and were not inspected. |
| CICD-SEC-9 — Improper Artifact Integrity Validation | Not applicable to release/deployment | These workflows do not publish or deploy application releases. The SBOM is a retained CI artifact for inspection, not a signed build attestation or a guarantee of artifact provenance. |
| CICD-SEC-10 — Insufficient Logging and Visibility | Covered | GitHub Actions provides per-run logs; CI uploads SBOMs for 30 days and retains the Angular Playwright failure report for 7 days. Centralized log export, alerting and repository retention settings are outside this review. |

## Changes and verification

Action pins were verified against the official release tags: `actions/checkout` v7.0.1, `actions/setup-node` v7.1.0 and `actions/upload-artifact` v7.0.2. APPLY documents manual tag-to-SHA review on future workflow updates; no automated stale-pin check is claimed.

The local `npm sbom --sbom-format cyclonedx` command succeeded in the harness checkout. `check:template`, `test:tools`, `check:backlog`, `check:integrations`, `check:rules` and `check:audits` pass locally. A negative contract probe temporarily broadened the solution workflow permission; `check:template` failed with the expected error, and the change was restored. This macOS host injects `safe.bareRepository=explicit` through `GIT_CONFIG_*`; the fixture suite was rerun with those host overrides removed for that command, without changing repository or global Git configuration. Pull-request CI remains the final automated acceptance check. No real fork PR, GitHub repository settings, deployment or signed artifact was tested.

## Remaining limits

Branch protection, required-check configuration, organization action allowlists, npm registry controls, secret inventory, log retention and external workflow behavior require access to GitHub settings and remain unverified. This report does not establish that every consumer configures those controls.
