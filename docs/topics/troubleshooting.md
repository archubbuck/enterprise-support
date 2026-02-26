# Troubleshooting

Use this page for common maintainer issues. For release-specific escalation and rollback, see [runbook.md](./runbook.md).

## Fast Triage

Run baseline checks first:

```bash
npm ci
npm run validate:all
npm run build
```

If these fail, fix errors in this order: configuration, JSON syntax, lint/type issues, then iOS/signing.

## Common Problems

### Invalid JSON

Symptoms: validation errors from `package.json` or `manifest.json`.

Fix:

```bash
npm run validate:json
```

Correct malformed JSON (trailing commas/comments/quotes) and re-run.

### App Config Validation Fails

Symptoms: missing/invalid `APP_CONFIG_*` values.

Fix:

```bash
npm run validate:app-config
```

Ensure required keys are set in `.env.development` and formats are valid.

### Build Fails Locally

Symptoms: `vite`/`tsc` errors or dependency issues.

Fix:

```bash
npm ci
npm run build
```

Confirm Node.js is `22+`.

### iOS Sync or Xcode Issues

Symptoms: `ios:build` fails, CocoaPods errors, or Xcode runtime/signing issues.

Fix:

```bash
npm run ios:build
npm run ios:open
```

Then validate signing and run from Xcode. See [ios-development.md](./ios-development.md).

### Deployment Workflow Fails

Symptoms: `deploy.yml` fails during metadata, signing, or Fastlane steps.

Fix:

- Verify required secrets exist and are valid.
- Run local metadata checks: `npm run validate:metadata`.
- Follow recovery flow in [runbook.md](./runbook.md).

## Prevention

- Use `npm run validate:all` before merge.
- Keep `.env.example` updated when config keys change.
- Keep docs aligned with scripts in `package.json`.
