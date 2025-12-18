# iOS Development Guide

This guide explains how to develop and build the Barings Support iOS app on both Windows and Mac devices.

## Overview

The Barings Support app is built using **Capacitor**, which wraps the React web application into a native iOS app. This allows the web app to be packaged and distributed as a native iOS application while maintaining a single codebase.

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
git clone https://github.com/archubbuck/barings-support.git
cd barings-support
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

# Terminal 2: In Xcode, configure the app to load from localhost
# Set server.url in capacitor.config.ts to 'http://localhost:5173'
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

## Project Structure

```
barings-support/
├── src/                 # React source code (web app)
├── dist/                # Built web assets (generated)
├── ios/                 # iOS native project (Capacitor generated)
│   └── App/             # Xcode project
│       ├── App/         # iOS app code and resources
│       ├── Pods/        # CocoaPods dependencies
│       └── App.xcodeproj # Xcode project file
├── capacitor.config.ts  # Capacitor configuration
└── package.json         # Node.js dependencies and scripts
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

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Xcode Help](https://developer.apple.com/xcode/)

## Support

For project-specific questions, please open an issue on the GitHub repository.
