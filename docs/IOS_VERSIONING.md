# iOS App Versioning Strategy

## Overview

The iOS app uses a two-part versioning system that ensures proper version management in both local development and CI/CD environments.

## Version Components

### 1. Marketing Version (`MARKETING_VERSION` / `CFBundleShortVersionString`)
- **What it is**: The user-visible version number displayed in the App Store
- **Format**: Semantic versioning (e.g., `1.0.69`, `2.1.0`)
- **Source**: Extracted from git tags with format `v*` (e.g., `v1.0.69`)

### 2. Build Number (`CURRENT_PROJECT_VERSION` / `CFBundleVersion`)
- **What it is**: Internal build identifier used by App Store Connect
- **Format**: Integer (e.g., `277`, `2`)
- **Source**: Total git commit count in the repository
- **Purpose**: Provides unique, monotonically increasing build numbers required by Apple

## How Versioning Works

### Local Development Builds
- The Xcode project contains default values for both version components
- These defaults are set to reasonable values based on the latest git state at the time of the commit
- Default values: `MARKETING_VERSION = 1.0.69`, `CURRENT_PROJECT_VERSION = 2`
- Local builds use these defaults unless explicitly changed in Xcode

### CI/CD Builds (Fastlane)
- The CI/CD workflow automatically overrides the default values during build
- Version is extracted from the git tag that triggered the deployment (e.g., `v1.0.68` → version `1.0.68`)
- Build number is set to the total commit count (e.g., `277`)
- This ensures every App Store deployment has unique, traceable version information

### Workflow Process
1. Developer creates a version tag (e.g., `git tag v1.0.70 && git push origin v1.0.70`)
2. GitHub Actions workflow triggers on the `v*` tag pattern
3. Fastlane's `release` lane runs:
   - Extracts version from tag: `v1.0.70` → `1.0.70`
   - Counts commits: e.g., `280`
   - Updates Xcode project: `MARKETING_VERSION = 1.0.70`, `CURRENT_PROJECT_VERSION = 280`
   - Builds and uploads to App Store Connect
4. App Store Connect displays: "Version 1.0.70 (Build 280)"

## Important Notes

### For Developers
- **DO NOT** manually upload builds to App Store Connect without using the CI/CD workflow
  - Manual builds will use the default version from Xcode (currently `1.0.69`)
  - This can cause confusion in App Store Connect if it doesn't match your deployment intent
- **ALWAYS** use the deployment workflow by creating and pushing a version tag
- The workflow ensures version consistency and traceability

### Version Tag Requirements
- Tags must start with `v` (e.g., `v1.0.68`, `v2.0.0`)
- Version must have at least two numeric components (e.g., `1.0`, `1.2.3`)
- No pre-release suffixes allowed (e.g., `v1.0.0-beta` is invalid)
- Single-component versions are not allowed (e.g., `v1` is invalid)

### Build Number Strategy
- Uses git commit count for build numbers
- Provides unique, monotonically increasing values
- **IMPORTANT**: Never rewrite git history (rebase, squash, filter-branch) after deploying
  - This could decrease the commit count and cause App Store Connect upload failures
  - App Store requires build numbers to always increase

## Updating Default Version
When the repository progresses to a new version, update the default values in the Xcode project:

```bash
# Edit ios/App/App.xcodeproj/project.pbxproj
# Update both Debug and Release configurations:
MARKETING_VERSION = <new-version>;     # e.g., 1.0.70
CURRENT_PROJECT_VERSION = <commit-count>;  # e.g., git rev-list --count HEAD
```

## Troubleshooting

### Problem: App Store Connect shows "Version 1.0 (Build 1)"
**Cause**: A build was uploaded manually without using the CI/CD workflow

**Solution**: 
1. Delete the incorrect build from App Store Connect (if not yet submitted)
2. Create and push a proper version tag: `git tag v1.0.70 && git push origin v1.0.70`
3. Let the CI/CD workflow build and upload automatically

### Problem: Build upload fails with "Build version already exists"
**Cause**: Trying to upload a build with the same build number as an existing build

**Solution**:
1. Ensure you have the latest commits: `git pull`
2. Make additional commits if needed to increment the commit count
3. Create and push a new version tag
4. The new commit count will generate a unique build number

### Problem: Version doesn't match expectations
**Cause**: Build is using Xcode project defaults instead of Fastlane-managed versions

**Solution**:
- Verify the build was created through the GitHub Actions workflow
- Check workflow logs to confirm Fastlane version setting succeeded
- Ensure the version tag follows the correct format (`v*`)

## References
- [Apple Documentation: CFBundleShortVersionString](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)
- [Apple Documentation: CFBundleVersion](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion)
- [Fastlane Documentation: increment_version_number](https://docs.fastlane.tools/actions/increment_version_number/)
- [Fastlane Documentation: increment_build_number](https://docs.fastlane.tools/actions/increment_build_number/)
