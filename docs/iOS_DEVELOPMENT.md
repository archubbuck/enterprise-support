# iOS Development Guide

This guide explains how to develop and build the Enterprise Support iOS app on both Windows and Mac devices.

## Overview

This app is built using **Capacitor**, which wraps the React web application into a native iOS app. This allows the web app to be packaged and distributed as a native iOS application while maintaining a single codebase.

## Configuration

Before building the iOS app, configure it for your enterprise by editing `company.config.json`:

```json
{
  "companyName": "Your Company",
  "appName": "Your Company Support",
  "appId": "com.yourcompany.support",
  // ... other settings
}
```

The `appId` is particularly important for iOS as it's used as the bundle identifier.

## Prerequisites

### For Mac Development

1. **macOS** (required for building iOS apps)
2. **Xcode** (latest version recommended)
   - Install from the Mac App Store
   - Install Xcode Command Line Tools: `xcode-select --install`
3. **Node.js** (v16 or higher)
4. **npm** or **yarn**
5. **CocoaPods** (for iOS dependencies)
   - Install: `sudo gem install cocoapods`

### For Windows Development

> **Important**: Windows cannot directly build iOS apps. However, you can develop the web portion of the app on Windows and use cloud services or a Mac for final iOS builds.

**Option 1: Cloud Build Services (Recommended for Windows)**
- Use services like [Ionic Appflow](https://ionic.io/appflow) or [Microsoft App Center](https://appcenter.ms/)
- Push your code to GitHub
- Configure the cloud service to build iOS app

**Option 2: Remote Mac Access**
- Use services like [MacStadium](https://www.macstadium.com/) or [MacinCloud](https://www.macincloud.com/)
- Access a remote Mac to build the iOS app
- Develop on Windows, build on remote Mac

**Option 3: Develop Web Version**
- Develop and test the web version on Windows: `npm run dev`
- Use a Mac (yours or a teammate's) for iOS builds when needed
- The web app works identically to the iOS app

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/archubbuck/enterprise-support.git
cd enterprise-support
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Web App

The iOS app uses the built web assets from the `dist` folder:

```bash
npm run build
```

### 4. Sync Capacitor (Mac Only)

This copies the web assets to the iOS project and updates native dependencies:

```bash
npm run ios:build
```

Or manually:

```bash
npx cap sync ios
```

## Development Workflow

### Web Development (Windows & Mac)

During active development, work on the web version:

```bash
npm run dev
```

This starts a local development server at `http://localhost:5173`. All changes to React components, styles, and logic can be developed and tested in the browser.

### iOS Development (Mac Only)

#### Open Xcode

```bash
npm run ios:open
```

Or manually:

```bash
npx cap open ios
```

This opens the project in Xcode.

#### Run on Simulator

1. Open Xcode
2. Select a simulator from the device dropdown (e.g., iPhone 15)
3. Click the "Run" button (▶️) or press `Cmd + R`

#### Run on Physical Device

1. Connect your iPhone via USB
2. In Xcode, select your device from the device dropdown
3. You may need to configure signing:
   - Select the project in the navigator
   - Go to "Signing & Capabilities"
   - Select your Apple Developer team
4. Click the "Run" button (▶️) or press `Cmd + R`

### Making Changes

1. **Edit React/Web Code**: Make changes in the `src/` directory
2. **Build**: Run `npm run build` to create production assets
3. **Sync**: Run `npm run ios:build` to copy changes to the iOS project
4. **Test in Xcode**: Run the app in Xcode to see your changes

### Quick Development Cycle (Mac)

For rapid development on Mac:

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: In capacitor.config.ts, add server.url configuration:
# server: {
#   url: 'http://localhost:5173',
#   cleartext: true
# }
# Then run in Xcode
```

This allows live reloading during development.

## Building for Production

### Development Build

```bash
npm run ios:build
```

Then build in Xcode (Product → Build or `Cmd + B`)

### App Store Build

1. Update version numbers:
   - In `package.json`: Update `version`
   - In Xcode: Update "Version" and "Build" numbers

2. Build for release:
   - In Xcode: Product → Archive
   - Follow the App Store submission workflow

3. Submit to App Store:
   - Use Xcode Organizer to validate and upload
   - Complete App Store Connect listing
   - Submit for review

### App Store Metadata

This project includes pre-configured App Store metadata in the `ios/App/fastlane/metadata/en-US/` directory. This metadata is automatically uploaded to App Store Connect when using Fastlane.

#### Available Metadata Files

- **promotional_text.txt** - Short promotional text (max 170 characters)
- **description.txt** - Full app description (max 4,000 characters)
- **keywords.txt** - Comma-separated keywords (max 100 characters)
- **support_url.txt** - URL for customer support
- **marketing_url.txt** - Marketing website URL (optional)
- **copyright.txt** - Copyright notice (format: "YYYY Company Name", e.g., "2025 Enterprise Support")
- **screenshots/** - App screenshots for different device sizes (required for iOS)

#### App Screenshots

Screenshots are **required** for iOS apps submitted to the App Store. Only the first 3 screenshots will be displayed on the app installation sheets, but you can provide up to 10 screenshots per device size.

**Screenshot Requirements:**

- Screenshots must be actual captures of your app running on supported iOS devices
- Screenshots are required for at least one device size, but it's recommended to provide them for all supported sizes
- Supported device sizes:
  - 6.7-inch iPhone (1290 x 2796 pixels) - iPhone 15 Pro Max, iPhone 14 Pro Max
  - 6.5-inch iPhone (1284 x 2778 pixels) - iPhone 15 Plus, iPhone 14 Plus
  - 6.1-inch iPhone (1179 x 2556 pixels) - iPhone 15 Pro, iPhone 15, iPhone 14 Pro
- Screenshots must be in PNG or JPEG format
- File names should follow the pattern: `1_1.png`, `1_2.png`, `1_3.png`, etc.

**Adding Screenshots:**

1. Take screenshots on the actual devices or using iOS Simulator
2. Place them in `ios/App/fastlane/metadata/en-US/screenshots/`
3. Name them sequentially: `1_1.png`, `1_2.png`, `1_3.png`, etc.
4. Screenshots will be automatically uploaded during the next Fastlane deployment

Example using iOS Simulator:
```bash
# Run the app in the simulator
npm run ios:run

# Take a screenshot: Cmd + S (saves to Desktop)
# Resize and rename the screenshot
# Move to: ios/App/fastlane/metadata/en-US/screenshots/
```

**Note:** The project includes placeholder screenshots for initial setup. Replace these with actual app screenshots showing your app's key features and user interface before submitting to the App Store.

#### Customizing Metadata

To customize the App Store listing for your organization:

1. Edit the metadata files in `ios/App/fastlane/metadata/en-US/`
2. Keep within character limits (check with `wc -c <filename>`)
3. The changes will be uploaded automatically during the next Fastlane deployment

Example:
```bash
# Check character count
wc -c ios/App/fastlane/metadata/en-US/promotional_text.txt

# Edit the file
nano ios/App/fastlane/metadata/en-US/promotional_text.txt
```

#### Multiple Locales

To add metadata for additional languages:

1. Create a new directory: `ios/App/fastlane/metadata/<locale>/`
   - Examples: `en-GB`, `es-ES`, `fr-FR`, `de-DE`
2. Copy the metadata files from `en-US/` and translate them
3. Fastlane will automatically upload all locales

#### Metadata in CI/CD

The GitHub Actions deployment workflow (`.github/workflows/deploy.yml`) uses Fastlane's `upload_to_app_store` action, which automatically uploads metadata alongside the app binary. The metadata upload can be controlled via the `skip_metadata` parameter in the Fastfile.

## Project Structure

```
enterprise-support/
├── src/                   # React source code (web app)
├── dist/                  # Built web assets (generated)
├── ios/                   # iOS native project (Capacitor generated)
│   └── App/               # Xcode project
│       ├── App/           # iOS app code and resources
│       ├── Pods/          # CocoaPods dependencies
│       └── App.xcodeproj  # Xcode project file
├── company.config.json    # Company-specific configuration
├── capacitor.config.ts    # Capacitor configuration
└── package.json           # Node.js dependencies and scripts
```

## Common Tasks

### Update iOS Project After Code Changes

```bash
npm run ios:build
```

### Add Native iOS Plugins

1. Install the plugin:
   ```bash
   npm install @capacitor/[plugin-name]
   ```

2. Sync to iOS:
   ```bash
   npx cap sync ios
   ```

3. If needed, install CocoaPods dependencies (in Xcode project):
   ```bash
   cd ios/App
   pod install
   ```

### Clean Build (If Issues Occur)

```bash
# Clean web build
rm -rf dist
npm run build

# Clean iOS build (Mac)
cd ios/App
rm -rf Pods
rm -rf DerivedData
pod install
cd ../..
npx cap sync ios
```

Then clean build in Xcode: Product → Clean Build Folder (`Cmd + Shift + K`)

## CI/CD and Certificate Management

### GitHub Actions Workflows

This project includes GitHub Actions workflows for iOS certificate management and deployment:

- **iOS One-Time Match Setup** (`.github/workflows/setup_match.yml`) - One-time setup to generate and store certificates
- **Deploy to App Store** (`.github/workflows/deploy.yml`) - Automated deployment on version tags

### Setting Up Fastlane Match

[Fastlane Match](https://docs.fastlane.tools/actions/match/) is used to manage iOS certificates and provisioning profiles in a separate private repository.

#### Prerequisites

1. **Create a private repository** for storing certificates (e.g., `your-org/your-app-certificates`)
2. **Create an App Store Connect API Key**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com) → Users and Access → Keys
   - Create a new key with Admin or App Manager access
   - Download the `.p8` file and note the Key ID and Issuer ID

#### Required GitHub Secrets

Configure these secrets in your repository settings (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example/Format |
|-------------|-------------|----------------|
| `MATCH_GIT_URL` | Git URL of your certificates repository | `https://github.com/your-org/your-app-certificates` |
| `GIT_AUTHORIZATION` | GitHub Personal Access Token (PAT) with `repo` scope to access the certificates repository | Raw token like `ghp_xxxxxxxxxxxx` (will be automatically formatted) |
| `MATCH_PASSWORD` | Password to encrypt/decrypt certificates in the repository | A strong passphrase |
| `APPSTORE_ISSUER_ID` | App Store Connect API Issuer ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `APPSTORE_KEY_ID` | App Store Connect API Key ID | `XXXXXXXXXX` |
| `APPSTORE_P8` | Contents of the App Store Connect .p8 private key file | Copy entire content of the `.p8` file (raw text) |

##### What is GIT_AUTHORIZATION?

`GIT_AUTHORIZATION` is a GitHub Personal Access Token that enables Fastlane Match to authenticate with your private certificates repository during the iOS code signing process.

**Purpose:**
- Allows GitHub Actions workflows to access your private certificates repository
- Used by Fastlane Match for automated certificate management
- Provides secure, token-based authentication instead of username/password

**Format:**
- Provide the token in its raw format (e.g., `ghp_1234567890abcdef...`)
- The Fastlane `prepare_git_authorization` helper automatically formats it for git authentication
- Automatically converts to base64-encoded format: `x-access-token:TOKEN`

**Security:**
- Store as a GitHub Secret, never commit to code
- Token requires `repo` scope for accessing private repositories
- Use a descriptive name when creating (e.g., "iOS Match Certificate Access")
- Set an appropriate expiration date and rotate regularly

#### Creating the GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → [Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "iOS Match Certificate Access")
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Set an appropriate expiration date
6. Click "Generate token"
7. Copy the token (starts with `ghp_`) and save it as the `GIT_AUTHORIZATION` secret
8. **Important**: The token should be provided as a raw token. The Fastlane configuration will automatically format and encode it.

#### Running the Setup Workflow

Once secrets are configured:

1. Go to Actions → "iOS One-Time Match Setup"
2. Click "Run workflow"
3. This will generate certificates and push them to your certificates repository
4. You only need to run this once, or when adding new devices/capabilities

#### How It Works

The `GIT_AUTHORIZATION` secret is handled by the `prepare_git_authorization` helper in the Fastfile:
- Accepts a raw GitHub PAT
- Automatically detects if the token is already encoded (for backward compatibility)
- Formats as `x-access-token:TOKEN` and base64 encodes for git basic authentication
- Passes to Fastlane Match's `git_basic_authorization` parameter

This allows Fastlane Match to securely access your private certificates repository.

## Troubleshooting

### "npx cap sync" fails with missing dist directory

Build the web app first:
```bash
npm run build
```

### Xcode build errors about missing pods

Install CocoaPods dependencies:
```bash
cd ios/App
pod install
```

### App doesn't reflect code changes

1. Rebuild the web app: `npm run build`
2. Sync to iOS: `npx cap sync ios`
3. Clean build in Xcode: `Cmd + Shift + K`
4. Run again: `Cmd + R`

### Certificate/Signing errors (Mac)

1. Open Xcode
2. Select the project in the navigator
3. Go to "Signing & Capabilities"
4. Enable "Automatically manage signing"
5. Select your development team

### Cannot develop on Windows

Use one of the Windows development options listed in the Prerequisites section. The web version (`npm run dev`) works identically to the iOS app for most development purposes.

### GitHub Actions workflow fails with "authentication failed"

This typically indicates an issue with the `GIT_AUTHORIZATION` secret:

1. Verify the token is valid and not expired
2. Ensure the token has `repo` scope enabled
3. Confirm the token is stored as a raw token (starting with `ghp_`), not base64-encoded
4. Check that the certificates repository URL (`MATCH_GIT_URL`) is correct
5. Verify the token has access to the certificates repository

### Fastlane build is very slow or appears to hang

If the Fastlane release build is taking an unusually long time, particularly at the "[CP] Embed Pods Frameworks" step:

1. **Verify optimizations are in place**: Check that the `Podfile` includes the `post_install` hook with build optimizations (see [Build Performance Optimizations](#build-performance-optimizations))
2. **Check cache usage**: Verify that the GitHub Actions workflow is using the CocoaPods cache by checking the workflow logs
3. **Clear derived data**: If building locally, clean derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
4. **Reinstall pods**: Sometimes CocoaPods needs a fresh install:
   ```bash
   cd ios/App
   rm -rf Pods Podfile.lock
   pod install
   ```
5. **Review resource limits**: Ensure your build environment has sufficient CPU and memory resources

## FAQ

### What is GIT_AUTHORIZATION and why do I need it?

`GIT_AUTHORIZATION` is a GitHub Personal Access Token (PAT) used to authenticate with a private repository that stores iOS certificates and provisioning profiles managed by Fastlane Match. You need it to:
- Allow automated workflows to access your certificates repository
- Enable secure, token-based git authentication
- Support CI/CD deployments to the App Store

Without it, GitHub Actions cannot access the private certificates repository to sign your iOS builds.

### How do I create a GIT_AUTHORIZATION token?

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "iOS Match Certificate Access"
4. Select the `repo` scope (full control of private repositories)
5. Set an expiration date (recommendation: 90 days to 1 year)
6. Click "Generate token"
7. Copy the token (starts with `ghp_`)
8. Add it to your repository secrets as `GIT_AUTHORIZATION`

### What format should GIT_AUTHORIZATION be in?

Provide the token in its **raw format** as generated by GitHub (e.g., `ghp_1234567890abcdef...`). The Fastlane configuration automatically handles formatting and encoding. Do **not** base64-encode it yourself.

### How is GIT_AUTHORIZATION different from other secrets?

Unlike `APPSTORE_P8` (which is a private key file) or `MATCH_PASSWORD` (which is an encryption password), `GIT_AUTHORIZATION` is specifically a GitHub authentication token. It's used only for git operations to access the certificates repository, not for signing or encryption.

### Can I use a fine-grained personal access token?

Currently, the setup uses classic personal access tokens with `repo` scope. Fine-grained tokens may work but have not been tested. For best compatibility, use a classic token with `repo` scope.

## Build Performance Optimizations

This project includes several optimizations to improve iOS build performance, particularly for CI/CD deployments.

### Implemented Optimizations

#### 1. CocoaPods Build Settings (Podfile)

The `Podfile` includes a `post_install` hook that optimizes build settings for CocoaPods dependencies:

- **Disabled code signing for pods**: Code signing is disabled for CocoaPods frameworks during the build phase. This significantly speeds up the "[CP] Embed Pods Frameworks" step since each framework doesn't need to be individually signed during embedding.
- **Whole-module Swift compilation**: Optimizes Swift compilation by analyzing the entire module at once.
- **Disabled compiler index store**: Reduces I/O operations during builds.

#### 2. Fastlane Build Optimizations (Fastfile)

The Fastlane `release` lane includes several `xcargs` optimizations:

- `COMPILER_INDEX_STORE_ENABLE=NO`: Disables Xcode index store (not needed for CI builds)
- `SKIP_MACRO_VALIDATION=YES`: Skips macro validation to speed up builds
- `CLANG_ENABLE_MODULE_DEBUGGING=NO`: Disables module debugging symbols
- `ENABLE_BITCODE=NO`: Disables bitcode (no longer required by Apple)
- `SWIFT_COMPILATION_MODE=wholemodule`: Optimizes Swift compilation for release builds

#### 3. GitHub Actions Caching (deploy.yml)

The deployment workflow uses GitHub Actions caching for CocoaPods:

```yaml
- name: Cache CocoaPods
  uses: actions/cache@v4
  with:
    path: ios/App/Pods
    key: ${{ runner.os }}-pods-${{ hashFiles('ios/App/Podfile.lock') }}
    restore-keys: |
      ${{ runner.os }}-pods-
```

This avoids reinstalling CocoaPods dependencies when they haven't changed, saving significant time.

### Expected Performance Impact

These optimizations typically reduce build times by:
- **30-50%** reduction in "[CP] Embed Pods Frameworks" execution time
- **10-20%** faster overall build times
- **90%+** faster subsequent builds when pods are cached

### Troubleshooting Build Performance

If builds are still slow:

1. **Check runner resources**: Ensure GitHub Actions runners have sufficient resources
2. **Review build logs**: Check `ios/App/fastlane/logs` for bottlenecks
3. **Verify caching**: Confirm CocoaPods cache is being used in workflow logs
4. **Clean build**: Sometimes a clean build is needed: `cd ios/App && pod deintegrate && pod install`

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Xcode Help](https://developer.apple.com/xcode/)

## Related Documentation

- [Quick Start Guide](./QUICK_START.md) - Getting started with development
- [Configuration Guide](./CONFIGURATION.md) - Customizing the app
- [Document Management](./DOCUMENTS.md) - Managing support documents
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute

## Support

For project-specific questions, please open an issue on the [GitHub repository](https://github.com/archubbuck/enterprise-support/issues).
