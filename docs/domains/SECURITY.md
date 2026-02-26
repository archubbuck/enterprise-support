# Security and Privacy

## Privacy Summary

The app is designed for minimal data exposure:

- No account/login requirement.
- No analytics or advertising trackers.
- No personal data collection by default.
- Content and preferences are stored locally on device.

## Data Handling

- Support content is loaded from bundled/public documentation assets.
- App configuration values are client-visible and must not contain secrets.
- Deployment secrets (signing, App Store API, match credentials) must remain in GitHub Actions secrets.

## Security Practices

- Use `npm run validate:all` before release.
- Keep dependencies updated and review security alerts.
- Rotate iOS signing and API credentials per organizational policy.

## Reporting and Policy

- Security policy: `/.github/SECURITY.md`
- Support guidance: `/.github/SUPPORT.md`

## Privacy Policy Reference

If you need a standalone policy for legal/compliance publishing, use this document as source and link it from App Store metadata URLs.
