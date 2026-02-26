# Release Operations

This document is the canonical guide for CI/CD, App Store metadata automation, and production release execution.

## Workflow Map

- `.github/workflows/ci.yml`: runs validation and build checks for code quality.
- `.github/workflows/release.yml`: auto-creates GitHub releases on `main` using `release/*` tags.
- `.github/workflows/deploy.yml`: deploys to App Store Connect when a manual `v*` tag is pushed.
- `.github/workflows/setup-match.yml`: one-time signing setup for match/certificates.

## Release Modes

### 1) Standard GitHub Release (automatic)

Trigger: merge/push to `main`.

Outcome:
- GitHub release tag in `release/YYYY.MM.DD.N` format.
- Release notes generated from commits.
- No App Store deployment.

### 2) App Store Deployment (manual trigger via tag)

Trigger: push a semantic tag like `v1.2.3`.

Command sequence:

```bash
git checkout main
git pull
git tag v1.2.3
git push origin v1.2.3
```

Outcome:
- Deploy workflow builds, signs, and uploads to App Store Connect.
- Metadata generation and upload are included in deployment.

## Local Pre-Release Validation

Run these before creating a deploy tag:

```bash
npm ci
npm run validate:all
npm run build
```

If iOS release owner is on macOS:

```bash
npm run ios:build
```

## App Store Metadata Automation

Metadata templates live under `ios/App/fastlane/metadata/en-US/` and are rendered from env values during release.

Key commands:

```bash
npm run validate:metadata
npm run prepare:metadata
```

Fastlane uploads generated metadata from `ios/App/fastlane/.generated-metadata`.

### Copyright Automation

During release, Fastlane updates the copyright line to the current year while preserving company name format.

Local verification:

```bash
ruby scripts/test-copyright-automation.rb
```

## Secrets and Credentials

Required secrets are maintained in GitHub repository secrets (deploy/signing/API auth). Common examples include App Store API keys and match credentials.

Use `setup-match.yml` once for initial signing bootstrap or whenever certificates/profiles are re-established.

## Troubleshooting During Release

- CI failures before tagging: see [troubleshooting.md](./troubleshooting.md)
- iOS/Xcode/signing issues: see [ios-development.md](./ios-development.md)
- Operational rollback/escalation: see [runbook.md](./runbook.md)

## Ownership Checklist (Handoff)

- Confirm who owns `v*` tag creation and approval.
- Confirm who rotates App Store and signing credentials.
- Validate at least one end-to-end dry run by the new team.
- Record release owner and backup owner in your team ops system.
