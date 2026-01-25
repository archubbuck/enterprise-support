# App Icon Setup and Configuration Guide

This guide explains how to configure and verify the app icon for the Enterprise Support iOS application, ensuring it is correctly included in App Store uploads.

## Overview

The app icon is a crucial part of your iOS application's identity. This document covers:
- Where to place your app icon
- Required icon specifications
- How to verify the icon in Xcode
- How the icon is automatically uploaded to the App Store
- Troubleshooting common icon issues

## Icon Requirements

### Apple's Icon Specifications

For iOS apps, Apple requires a **single 1024x1024px icon** in the Asset Catalog:

- **Size**: 1024x1024 pixels
- **Format**: PNG (no transparency)
- **Color Space**: sRGB or P3
- **File Name**: Can be any valid filename (commonly `AppIcon-512@2x.png`)

This single icon is automatically scaled by iOS to all required sizes (20pt, 29pt, 40pt, 58pt, 60pt, 76pt, 80pt, 87pt, 120pt, 152pt, 167pt, and 180pt).

### Design Guidelines

- **No transparency**: App icons cannot have transparent backgrounds
- **No rounded corners**: iOS automatically applies rounded corners
- **Simple and recognizable**: Icons should be clear even at small sizes
- **Consistent branding**: Use colors and design elements that match your brand

## Step 1: Prepare Your App Icon

1. **Design your icon** at 1024x1024px resolution
2. **Export as PNG** with no transparency
3. **Test at different sizes** to ensure it looks good when scaled down

### Example Icon

The Enterprise Support app uses a cloud computing icon that represents IT support and cloud services. Your icon should reflect your organization's brand and the app's purpose.

## Step 2: Place Icon in Asset Catalog

Place your app icon file in the iOS Asset Catalog directory:

```bash
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

### File Structure

```
ios/App/App/Assets.xcassets/
└── AppIcon.appiconset/
    ├── AppIcon-512@2x.png    # Your 1024x1024 icon
    └── Contents.json         # Asset catalog metadata
```

### Contents.json Configuration

The `Contents.json` file should be configured as follows:

```json
{
  "images" : [
    {
      "filename" : "AppIcon-512@2x.png",
      "idiom" : "universal",
      "platform" : "ios",
      "size" : "1024x1024"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
```

**Important**: If you use a different filename, update the `filename` field in `Contents.json` to match.

## Step 3: Configure App Identity

Edit `app.config.json` in the project root to configure your app's identity:

```json
{
  "companyName": "Your Company",
  "appName": "Your Company Support",
  "appId": "com.yourcompany.support",
  // ... other configuration
}
```

### Configuration Fields

| Field | Description | Example |
|-------|-------------|---------|
| `companyName` | Your organization's name | `"Acme Corporation"` |
| `appName` | Full application name shown in iOS | `"Acme Support"` |
| `appId` | iOS bundle identifier (reverse domain) | `"com.acmecorp.support"` |

**Critical**: The `appId` must:
- Be unique in the App Store
- Match your Apple Developer provisioning profile
- Never change after first App Store submission
- Use only lowercase letters, numbers, hyphens, and dots

### How Configuration is Used

The values from `app.config.json` are automatically injected into:
- `capacitor.config.ts` (Capacitor configuration)
- `ios/App/App.xcodeproj` (Xcode project settings)
- `ios/App/App/Info.plist` (iOS app metadata)

This is handled by the Capacitor build system. See [`capacitor.config.ts`](../capacitor.config.ts) for implementation details.

## Step 4: Verify Icon in Xcode

### Open the iOS Project

```bash
npm run ios:open
```

Or manually:

```bash
npx cap open ios
```

### Check Icon in Xcode

1. **In the Project Navigator**, expand:
   ```
   App
   └── App
       └── Assets.xcassets
           └── AppIcon
   ```

2. **Verify the icon appears** in the asset catalog viewer

3. **Check all icon slots** are filled (Xcode shows the 1024x1024 icon in the Universal slot)

### Test in iOS Simulator

1. **Select a simulator** from the device dropdown (e.g., iPhone 15)
2. **Click Run** (▶️) or press `Cmd + R`
3. **Check the Home Screen** - your icon should appear on the simulated device
4. **Test on multiple device sizes** to ensure the icon scales well:
   - iPhone 15 Pro Max (large display)
   - iPhone SE (small display)
   - iPad Pro (tablet)

### Test on Physical Device

1. **Connect your iPhone** via USB
2. **Select your device** from the device dropdown in Xcode
3. **Configure signing**:
   - Select the project in the navigator
   - Go to "Signing & Capabilities"
   - Select your Apple Developer team
4. **Click Run** (▶️)
5. **Check the Home Screen** on your physical device

## Step 5: App Store Upload (Automated)

The app icon is **automatically included** in App Store uploads via Fastlane.

### How It Works

When you deploy the app using the CI/CD pipeline:

1. **Build Process**:
   - The web app is built: `npm run build`
   - Assets are synced to iOS: `npx cap sync ios`
   - Xcode builds the app with the icon in the asset catalog

2. **Fastlane Upload**:
   - The [`ios/App/fastlane/Fastfile`](../ios/App/fastlane/Fastfile) defines the upload process
   - The `upload_to_app_store` action is called:
     ```ruby
     upload_to_app_store(
       api_key: api_key,
       app_identifier: APP_IDENTIFIER,
       skip_metadata: false,
       skip_screenshots: false,
       submit_for_review: false,
       force: true
     )
     ```
   - The icon is **embedded in the IPA file** and uploaded to App Store Connect

3. **App Store Processing**:
   - Apple's servers extract the icon from the IPA
   - The icon appears in your App Store listing
   - Users see the icon when installing the app

### Deployment Workflow

The deployment is triggered by pushing a version tag:

```bash
# Commit your changes
git add .
git commit -m "Update app icon"

# Create and push version tag
git tag v1.0.0
git push origin v1.0.0
```

This triggers the [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) workflow, which:
1. Validates required secrets (certificates, App Store API keys)
2. Builds the web app and iOS project
3. Signs the app with certificates from Fastlane Match
4. Uploads to App Store Connect
5. Uploads metadata and screenshots

### Required Secrets

Ensure these GitHub secrets are configured (see [CI/CD Documentation](./CI_CD.md)):

- `MATCH_PASSWORD` - Certificate encryption password
- `MATCH_GIT_URL` - Git URL of certificates repository
- `GIT_AUTHORIZATION` - GitHub PAT with repo access
- `APPSTORE_ISSUER_ID` - App Store Connect API Issuer ID
- `APPSTORE_KEY_ID` - App Store Connect API Key ID
- `APPSTORE_P8` - App Store Connect API .p8 key content
- `APPLE_TEAM_ID` - Apple Developer Team ID

## Step 6: Verify Icon in App Store Connect

After the deployment workflow completes:

1. **Log in to [App Store Connect](https://appstoreconnect.apple.com)**
2. **Select your app** from "My Apps"
3. **Go to the app version** that was just uploaded
4. **Check "App Information"** section:
   - The app icon should appear in the preview
   - The icon should match what you uploaded

5. **Check "App Store" tab**:
   - The icon appears in the App Store listing preview
   - The icon is shown on the install button preview

6. **Test in TestFlight** (optional):
   - Invite testers via TestFlight
   - Have testers check the icon appears correctly
   - Verify icon on different device sizes

## Troubleshooting

### Icon Not Appearing in Xcode

**Symptom**: The icon doesn't appear in Xcode's asset catalog viewer.

**Solutions**:
1. **Check file location**: Ensure the PNG file is in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. **Verify filename**: Check that the filename in `Contents.json` matches your PNG file
3. **Clean Xcode cache**: Product → Clean Build Folder (`Cmd + Shift + K`)
4. **Re-sync Capacitor**:
   ```bash
   npm run build
   npx cap sync ios
   ```

### Icon Not Appearing in Simulator/Device

**Symptom**: The app installs but shows a blank or default icon.

**Solutions**:
1. **Rebuild the app**: Clean build folder and rebuild
2. **Check icon format**: Ensure PNG has no transparency
3. **Verify icon size**: Must be exactly 1024x1024 pixels
4. **Delete app from device**: Remove the app and reinstall
5. **Reset simulator**: Device → Erase All Content and Settings

### Icon Not Appearing in App Store Connect

**Symptom**: After upload, the icon doesn't appear in App Store Connect.

**Solutions**:
1. **Wait for processing**: Apple's servers may take 10-30 minutes to process the upload
2. **Check build status**: Go to "Activity" tab to see if the build is still processing
3. **Verify IPA contents**: Download the IPA from App Store Connect and inspect the asset catalog
4. **Check provisioning**: Ensure the app ID matches the provisioning profile
5. **Re-upload**: If the icon still doesn't appear after 1 hour, re-run the deployment workflow

### Icon Appears Blurry or Pixelated

**Symptom**: The icon looks blurry or pixelated on devices.

**Solutions**:
1. **Export at high quality**: Ensure PNG is exported at 100% quality
2. **Use vector graphics**: Design in vector format (SVG, AI) and export to PNG at exact size
3. **Avoid upscaling**: Start with a high-resolution design, don't upscale a small image
4. **Check color profile**: Use sRGB or P3 color space

### Bundle Identifier Mismatch

**Symptom**: Build fails with "Bundle identifier does not match provisioning profile"

**Solutions**:
1. **Check `app.config.json`**: Ensure `appId` is correct
2. **Verify provisioning profile**: Log in to Apple Developer and check the app ID
3. **Update certificates**: Run the "iOS One-Time Match Setup" workflow
4. **Check `APP_IDENTIFIER` in Fastfile**: Ensure it matches `app.config.json`

### Deployment Workflow Fails

**Symptom**: The GitHub Actions workflow fails during upload.

**Solutions**:
1. **Check secrets**: Verify all required GitHub secrets are configured
2. **Validate API key**: Ensure the App Store Connect API key is valid and not expired
3. **Check logs**: Review the workflow logs for specific error messages
4. **Verify certificates**: Ensure Fastlane Match has been set up correctly
5. **See [CI/CD Documentation](./CI_CD.md)**: For detailed troubleshooting

## Advanced Configuration

### Using a Different Icon Filename

If you want to use a different filename:

1. **Rename your icon file** (e.g., `MyAppIcon.png`)
2. **Update `Contents.json`**:
   ```json
   {
     "images" : [
       {
         "filename" : "MyAppIcon.png",
         "idiom" : "universal",
         "platform" : "ios",
         "size" : "1024x1024"
       }
     ],
     "info" : {
       "author" : "xcode",
       "version" : 1
     }
   }
   ```

### Multiple Icons for Different Environments

To use different icons for development vs. production:

1. **Create separate asset catalogs** (e.g., `AppIcon-Dev`, `AppIcon-Prod`)
2. **In Xcode**, select the app target
3. **Go to "Build Settings"** → search for "App Icon"
4. **Set "Asset Catalog App Icon Set Name"** to the appropriate name

### Updating the Icon

To update the icon after the app is live:

1. **Replace the PNG file** in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. **Keep the same filename** (or update `Contents.json`)
3. **Rebuild and deploy**:
   ```bash
   npm run build
   npx cap sync ios
   git add .
   git commit -m "Update app icon"
   git tag v1.1.0
   git push origin v1.1.0
   ```

**Note**: Icon changes will appear to users when they update to the new version.

## Key Files Reference

| File | Purpose |
|------|---------|
| [`app.config.json`](../app.config.json) | App identity configuration (company name, app name, app ID) |
| [`capacitor.config.ts`](../capacitor.config.ts) | Capacitor configuration that reads from `app.config.json` |
| [`src/types/app-config.ts`](../src/types/app-config.ts) | TypeScript types and validation for app configuration |
| [`ios/App/App/Assets.xcassets/AppIcon.appiconset/`](../ios/App/App/Assets.xcassets/AppIcon.appiconset/) | iOS app icon asset catalog |
| [`ios/App/fastlane/Fastfile`](../ios/App/fastlane/Fastfile) | Fastlane configuration for App Store upload |
| [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | GitHub Actions deployment workflow |
| [`.github/workflows/setup_match.yml`](../.github/workflows/setup_match.yml) | GitHub Actions certificate setup workflow |

## Related Documentation

- [iOS Development Guide](./iOS_DEVELOPMENT.md) - Complete iOS development workflow
- [CI/CD Documentation](./CI_CD.md) - Deployment pipeline and secrets
- [Apple Connect Metadata](./APPLE_CONNECT_METADATA.md) - App Store metadata automation
- [Configuration Guide](./CONFIGURATION.md) - General app configuration
- [Quick Start Guide](./QUICK_START.md) - Getting started with development

## Best Practices

1. **Design for multiple sizes**: Even though you only need 1024x1024, design so it looks good when scaled to 60x60 or smaller
2. **Test on real devices**: Simulators are helpful, but always test on physical devices
3. **Use version control**: Commit icon changes to git for history tracking
4. **Keep backups**: Save original design files (AI, PSD, Sketch) separately
5. **Update consistently**: When changing branding, update the icon at the same time
6. **Document changes**: Note icon updates in your CHANGELOG.md
7. **Review before release**: Always verify the icon in App Store Connect before submitting for review

## Support

For questions or issues:
- **Project Issues**: [GitHub Issues](https://github.com/archubbuck/enterprise-support/issues)
- **iOS Development**: See [iOS_DEVELOPMENT.md](./iOS_DEVELOPMENT.md)
- **Deployment**: See [CI_CD.md](./CI_CD.md)

---

**Last Updated**: 2026-01-25  
**Version**: 1.0
