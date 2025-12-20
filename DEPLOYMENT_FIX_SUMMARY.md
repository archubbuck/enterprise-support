# Deployment Failure Investigation Summary

## Issue
The iOS App Store deployment workflow was consistently failing during the "Run Fastlane release" step.

## Root Cause
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
