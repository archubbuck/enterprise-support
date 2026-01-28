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
- **Source**: Git commit count reachable from current HEAD (`git rev-list --count HEAD`)
- **Purpose**: Provides unique, monotonically increasing build numbers required by Apple

## How Versioning Works

### Local Development Builds
- The Xcode project contains default values for both version components
- These defaults are set to reasonable values based on the git repository state at the time of this commit
- Default values: `MARKETING_VERSION = 1.0.69` (from git tag `v1.0.69`), `CURRENT_PROJECT_VERSION = 281` (from full-history `git rev-list --count HEAD`)
- Local builds use these defaults unless explicitly changed in Xcode
- **Note**: These defaults are snapshots and don't auto-update; they should be manually updated when preparing major version bumps. When recomputing `CURRENT_PROJECT_VERSION` locally using `git rev-list --count HEAD`, ensure you're using a non-shallow clone (run `git fetch --unshallow` if needed) so that the commit count matches the CI/CD environment.

### CI/CD Builds (Fastlane)
- The CI/CD workflow automatically overrides the default values during build
- Version is extracted from the git tag that triggered the deployment (e.g., `v1.0.68` → version `1.0.68`)
- Build number is set to the total commit count from the full git history in a non-shallow clone (e.g., `277`)
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
- **IMPORTANT**: Never rewrite git history (rebase, squash, filter-branch) **after uploading a build to App Store Connect**
  - This could decrease the commit count and cause upload failures because App Store requires each new build to have a higher build number than previous uploads
  - Git history rewriting is safe before any uploads (e.g., during feature branch development)
  - Once a build is uploaded to App Store Connect with build number N, all future uploads must have build numbers > N

## Maintaining Default Versions in Xcode Project

The Xcode project file (`ios/App/App.xcodeproj/project.pbxproj`) contains hardcoded default values for version and build number. These serve as fallbacks for local builds:

### When to Update
Update these defaults when:
- Preparing for a new major version release
- The defaults are significantly out of date (e.g., more than a few versions behind)
- You notice local builds showing outdated version information

### How to Update
```bash
# 1. Ensure you have full git history (not a shallow clone)
# Check if this is a shallow clone and fetch full history if needed
if [ -f .git/shallow ]; then
  git fetch --unshallow
else
  git fetch --tags --prune
fi

# 2. Get the latest version tag
git describe --tags --match "v*" --abbrev=0
# Example output: v1.0.70

# 3. Get the current commit count from full history
git rev-list --count HEAD
# Example output: 285 (must be from full history, not shallow clone)

# 4. Edit ios/App/App.xcodeproj/project.pbxproj
# Update both Debug and Release configurations (appears twice in the file):
MARKETING_VERSION = 1.0.70;        # Use version from step 2 (without 'v' prefix)
CURRENT_PROJECT_VERSION = 285;     # Use commit count from step 3 (from full history)
```

### Important Notes
- These are **fallback defaults only** - CI/CD builds always override them with dynamic values from Fastlane
- The defaults don't need to be updated with every commit; they're mainly to prevent "Version 1.0 (Build 1)" confusion
- Fastlane's `increment_version_number` and `increment_build_number` actions will override these during deployment

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
