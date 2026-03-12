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

## Enterprise Distribution (In-House)

Enterprise distribution produces a signed `.ipa` for internal MDM delivery, bypassing the App Store.

### Prerequisites

- Active **Apple Developer Enterprise Program** enrollment (separate from the standard Apple Developer account).
- A match-compatible Git repository for storing enterprise certificates.
- App Store Connect API key issued under the Enterprise team.
- **Local Mac builds only:** macOS with Xcode (latest supported), CocoaPods, Ruby 3.2+, and Bundler.

### One-Time Setup

1. Copy `.env.enterprise.example` to `.env.enterprise.local` and fill in all values.
2. Configure the `APPLE_TEAM_ID` repository secret in GitHub (Settings > Secrets > Actions).
3. Bootstrap enterprise certificates and provisioning profiles (requires macOS):

```bash
npm run ios:enterprise:setup
```

This runs `match(type: "enterprise")` to generate and store an In-House Distribution Certificate and provisioning profile in the match Git repository.

### Building the IPA

#### Option A: CI Build (any OS, including Windows)

Trigger the workflow from any device:

1. Go to **Actions > "Build Enterprise IPA" > "Run workflow"** in the GitHub repository.
2. Select the branch (default: `main`) and click **Run workflow**.
3. When complete, download the `enterprise-ipa` artifact from the workflow run summary.

Alternatively, use the GitHub CLI:

```bash
gh workflow run build-enterprise.yml
gh run watch
gh run download --name enterprise-ipa
```

#### Option B: Local Mac Build

```bash
npm run ios:enterprise:build
```

This command:

1. Builds the web app (`npm run build`).
2. Syncs Capacitor (`npx cap sync ios`).
3. Downloads enterprise signing assets via match.
4. Archives and exports the IPA with `export_method: "enterprise"`.

The signed IPA is written to `ios/App/build/App.ipa`.

### Distributing via MDM

Upload the `.ipa` to your MDM solution (Intune, Jamf, Mosyle, etc.) for managed device deployment. No App Store review is involved.

### Profile Expiration

In-House provisioning profiles expire after three years. Re-run `npm run ios:enterprise:setup` before expiry to regenerate.

## Related Docs

- [release-operations.md](./release-operations.md)
- [runbook.md](./runbook.md)
- [troubleshooting.md](./troubleshooting.md)
