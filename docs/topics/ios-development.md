# iOS Development

This document covers iOS platform development requirements. Release operations and App Store deployment are documented in [release-operations.md](./release-operations.md).

## Prerequisites (macOS)

- Xcode (latest supported)
- Xcode Command Line Tools (`xcode-select --install`)
- CocoaPods (`sudo gem install cocoapods`)
- Node.js `22+`

## Standard iOS Dev Loop

```bash
npm run ios:build
npm run ios:open
```

Then run from Xcode (`Cmd + R`) on simulator or connected device.

## Web-First Workflow

Most development can be completed using web mode:

```bash
npm run dev
```

After changes are ready for iOS validation, run `npm run ios:build` and test in Xcode.

## Windows Contributors

Windows cannot build iOS binaries directly. Recommended split:

- Windows: application code, config, content, and tests.
- macOS release owner: sync, sign, archive, and publish.

## iOS Metadata and Encryption Notes

- Metadata templates are under `ios/App/fastlane/metadata/en-US/`.
- The app currently uses `ITSAppUsesNonExemptEncryption=false` in `ios/App/App/Info.plist`.
- If encryption behavior changes, reassess App Store export compliance before release.

## Common Commands

```bash
npm run ios:build
npm run ios:open
npm run ios:run
```

## Related Docs

- [release-operations.md](./release-operations.md)
- [runbook.md](./runbook.md)
- [troubleshooting.md](./troubleshooting.md)
