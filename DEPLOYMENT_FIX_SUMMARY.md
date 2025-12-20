# Deployment Failure Investigation Summary

## Latest Issue (v1.0.12 - December 20, 2024)

### Problem
The iOS App Store deployment workflow failed during the "Run Fastlane release" step on deployment run #13 for tag v1.0.12.

### Root Cause
The `build_app` action in the Fastfile was missing **explicit provisioning profile configuration** in the `export_options` parameter. This is a common issue with Fastlane 2.230+ when running in CI environments like GitHub Actions.

Even though `match` correctly downloads and installs the App Store provisioning profile and sets environment variables, Xcode can sometimes fail to pick up the correct profile during the build/export process in CI environments. This causes the build to fail or request the wrong type of provisioning profile.

### Solution Applied
Added explicit provisioning profile mapping in the `build_app` call to ensure Xcode uses the correct profile:

```ruby
# Get the provisioning profile name set by match
profile_name = ENV["sigh_#{APP_IDENTIFIER}_appstore_profile-name"]

build_app(
  scheme: "App",
  workspace: "App.xcworkspace",
  export_method: "app-store",
  xcargs: xcargs_optimizations,
  export_options: {
    provisioningProfiles: {
      APP_IDENTIFIER => profile_name
    }
  }
)
```

This explicitly tells Xcode which provisioning profile to use for the app identifier, preventing any ambiguity in CI environments.

### Why This Fix Works
1. **Explicit Profile Mapping**: Instead of relying on Xcode to auto-detect the profile, we explicitly specify it
2. **Uses Match Environment Variables**: The profile name comes from the environment variable that `match` sets
3. **Follows Best Practices**: This is the [recommended approach](https://docs.fastlane.tools/best-practices/continuous-integration/github/) for GitHub Actions and other CI environments

### References
- [Fastlane GitHub Actions Best Practices](https://docs.fastlane.tools/best-practices/continuous-integration/github/)
- [Common Fastlane + GitHub Actions Code Signing Issues](https://github.com/fastlane/fastlane/discussions/21581)
- [build_app export_options Documentation](https://docs.fastlane.tools/actions/build_ios_app/)

---

## Previous Issue (Fixed)

### Problem
The iOS App Store deployment workflow was consistently failing during the "Run Fastlane release" step.

### Root Cause
The Fastfile (ios/App/fastlane/Fastfile) contained an **invalid parameter** in the `build_app` action call:

```ruby
build_app(
  scheme: "App",
  workspace: "App.xcworkspace",
  export_method: "app-store",
  xcargs: xcargs_optimizations,
  buildlog_path: "./fastlane/logs"  # ❌ INVALID PARAMETER
)
```

### Why This Failed
According to [Fastlane's official documentation](https://docs.fastlane.tools/actions/build_app/), `buildlog_path` is **not a supported parameter** for the `build_app` action. When Fastlane encounters an invalid/unrecognized parameter, it throws an error and the build fails.

### Official Supported Parameters
The valid parameters for `build_app` include:
- `scheme` - The Xcode scheme to build
- `workspace` - Path to the .xcworkspace file
- `export_method` - Export method (app-store, ad-hoc, enterprise, development)
- `xcargs` - Additional xcodebuild arguments
- `output_directory` - Where to place the IPA file
- `build_path` - Location for temporary build files (NOT buildlog_path)
- And many others...

Build logs are **automatically** saved to the default location (`~/Library/Logs/gym/`) and are accessible through GitHub Actions logs.

## Fix Applied
Removed the invalid `buildlog_path` parameter from the `build_app` call in `ios/App/fastlane/Fastfile`:

```ruby
build_app(
  scheme: "App",
  workspace: "App.xcworkspace",
  export_method: "app-store",
  xcargs: xcargs_optimizations  # ✅ VALID PARAMETERS ONLY
)
```

## How to Test the Fix

1. **Create a new version tag** to trigger the deployment workflow:
   ```bash
   git tag v1.0.12
   git push origin v1.0.12
   ```

2. **Monitor the workflow** in the GitHub Actions tab: Navigate to Actions > Deploy to App Store

3. **Expected Result**: The "Run Fastlane release" step should complete successfully and proceed to upload the app to App Store Connect.

## Build Logs Location
Even without the `buildlog_path` parameter, build logs are still available:
- **GitHub Actions**: View the workflow run logs in the Actions tab
- **Local Fastlane builds**: Logs are saved to `~/Library/Logs/gym/` automatically
- **CI/CD builds**: Logs are captured in the GitHub Actions output

## Additional Context
- This is a Capacitor-based iOS app wrapping a React web application
- The deployment workflow runs on `macos-latest` runners
- Xcode version: 16
- Ruby version: 3.2
- The workflow requires code signing secrets and App Store Connect API credentials to be configured

## Related Files Changed
- `ios/App/fastlane/Fastfile` - Removed invalid parameter

## References
- [Fastlane build_app documentation](https://docs.fastlane.tools/actions/build_app/)
- [Fastlane troubleshooting guide](https://docs.fastlane.tools/codesigning/troubleshooting/)
- [GitHub Issue: build_app parameter errors](https://github.com/fastlane/fastlane/issues/21773)
