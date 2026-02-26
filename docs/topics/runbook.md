# Runbook

This runbook is for maintainers operating the app after ownership transfer.

## Ownership Model

Define and maintain these roles in your team:

- Maintainer owner: code/config/content approvals.
- Release owner: `v*` tagging and App Store deployment.
- Backup release owner: failover for release windows.

## Operating Cadence

- Weekly: review open issues and failed workflows.
- Per release: run validation + release checklist.
- Quarterly: review signing credentials and metadata links.

## Release Checklist

1. Pull latest `main`.
2. Run:

```bash
npm ci
npm run validate:all
npm run build
```

3. Confirm document/content and config changes are expected.
4. Confirm release notes scope.
5. Create and push `v*` tag.
6. Monitor `.github/workflows/deploy.yml` through completion.

Detailed flow: [release-operations.md](./release-operations.md)

## Incident Triage

### CI or Build Failures

- Check recent workflow logs first.
- Re-run local `npm run validate:all`.
- Use [troubleshooting.md](./troubleshooting.md) to isolate root cause.

### App Store Deployment Failures

- Validate secrets are present and not expired.
- Confirm signing assets are valid.
- Confirm metadata validation passes locally (`npm run validate:metadata`).

### Content Regressions

- Validate `public/documents/manifest.json` syntax and references.
- Validate feature flags in env configuration.
- Confirm document files exist and open in app.

## Rollback Strategy

- Do not overwrite history on `main`.
- Create a new corrective commit and release.
- For App Store issues, redeploy the last known good version from a previous release tag.

## Escalation Notes

Maintain contact entries in your internal system for:

- App Store account admin
- iOS signing/certificate owner
- Primary repository maintainer

This repository intentionally does not hard-code personal contact information.
