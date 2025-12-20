# Deployment Fix Investigation - v1.0.18

## Issue Description

The deployment workflow was failing with the following error:

```
[21:01:40]: You passed invalid parameters to 'upload_to_app_store'.
[21:01:40]: Check out the error below and available options by running `fastlane action upload_to_app_store`
[21:01:40]: ⚠️  Upload failed: Could not find option 'skip_waiting_for_build_processing' in the list of available options
```

## Root Cause Analysis

The error occurred because the Fastfile (located at `ios/App/fastlane/Fastfile`) was using an invalid parameter `skip_waiting_for_build_processing` with the `upload_to_app_store` action.

After investigating the Fastlane documentation and related issues:

1. **`skip_waiting_for_build_processing`** is a valid parameter, BUT only for `upload_to_testflight` (also known as `pilot`) action
2. **`upload_to_app_store`** (also known as `deliver`) does NOT support this parameter
3. The two actions serve different purposes:
   - `upload_to_testflight`: Uploads builds to TestFlight for beta testing
   - `upload_to_app_store`: Uploads builds and metadata to App Store Connect for production release

## The Fix

### Change Made
Removed the invalid `skip_waiting_for_build_processing: true` parameter from the `upload_to_app_store` call in `ios/App/fastlane/Fastfile` (line 214).

### Before:
```ruby
upload_to_app_store(
  api_key: api_key,
  app_identifier: APP_IDENTIFIER,
  skip_metadata: true,
  submit_for_review: false,
  precheck_include_in_app_purchases: false,
  skip_waiting_for_build_processing: true,  # ❌ Invalid for upload_to_app_store
)
```

### After:
```ruby
upload_to_app_store(
  api_key: api_key,
  app_identifier: APP_IDENTIFIER,
  skip_metadata: true,
  submit_for_review: false,
  precheck_include_in_app_purchases: false
)
```

## Why This Fixes the Issue

1. **Non-interactive mode error**: The error message "Could not retrieve response as fastlane runs in non-interactive mode" was occurring because Fastlane was trying to prompt the user about the invalid parameter in a CI/CD environment where no interaction is possible.

2. **Invalid parameter validation**: Fastlane validates parameters before execution. When it encounters an unknown parameter, it tries to ask for clarification, which fails in non-interactive mode.

3. **Proper parameter usage**: By removing the invalid parameter, the action can now proceed with only valid parameters that `upload_to_app_store` recognizes.

## Additional Notes

- The `upload_to_app_store` action handles build processing differently than `upload_to_testflight`
- For App Store uploads, the build is validated and processed by App Store Connect automatically
- The retry logic with exponential backoff (already implemented in the Fastfile) will handle any transient upload failures

## References

- [Fastlane `upload_to_app_store` documentation](https://docs.fastlane.tools/actions/upload_to_app_store/)
- [Fastlane `upload_to_testflight` documentation](https://docs.fastlane.tools/actions/testflight/)
- [GitHub Issue: skip_waiting_for_build_processing with changelog](https://github.com/fastlane/fastlane/issues/20503)
- [Fastlane non-interactive mode issues](https://github.com/fastlane/fastlane/issues/20661)
