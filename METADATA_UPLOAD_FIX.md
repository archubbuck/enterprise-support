# Metadata Upload Fix - Copyright and Screenshots

## Issue Summary

App metadata (copyright and screenshots) was not being uploaded to Apple Connect after pipeline runs. This prevented the app from being correctly set up for submission on the App Store.

## Root Cause

The fastlane `release` lane in `ios/App/fastlane/Fastfile` had an incorrect path configuration for the copyright automation:

```ruby
# INCORRECT - Includes extra "fastlane/" prefix
copyright_path = File.join(Dir.pwd, "fastlane", "metadata", "en-US", "copyright.txt")
```

When fastlane runs from `working-directory: ios/App`, it automatically changes into the `fastlane` subdirectory. Therefore, `Dir.pwd` evaluates to `/path/to/repo/ios/App/fastlane`. Adding another "fastlane/" to the path caused the copyright automation to look for the file at:
```
/path/to/repo/ios/App/fastlane/fastlane/metadata/en-US/copyright.txt (WRONG - double "fastlane")
```

However, the actual metadata directory is located at:
```
/path/to/repo/ios/App/fastlane/metadata/en-US/copyright.txt
```

Since the file couldn't be found, the copyright automation would fail, and metadata (including screenshots) would not be uploaded to Apple Connect.

## Solution

### 1. Fixed Copyright Path (Line 247)

```ruby
# CORRECT - Without extra "fastlane/" prefix since Dir.pwd is already in fastlane directory
copyright_path = File.join(Dir.pwd, "metadata", "en-US", "copyright.txt")
```

This ensures the copyright file is found at the correct location:
```
/path/to/repo/ios/App/fastlane/metadata/en-US/copyright.txt
```

### 2. Fixed Metadata Path Parameter (Line 326)

Updated the `metadata_path` parameter in the `upload_to_app_store` call:

```ruby
upload_to_app_store(
  api_key: api_key,
  app_identifier: APP_IDENTIFIER,
  skip_metadata: false,
  skip_screenshots: false,
  metadata_path: "./metadata",  # CORRECT - Relative from fastlane directory
  # ... other parameters
)
```

Since fastlane runs from the `ios/App/fastlane` directory, the metadata path should be relative to that location, not include an extra "fastlane/" prefix.

### 3. Enhanced Logging

Added comprehensive logging to help debug and verify the upload process:

```ruby
# Copyright file location log
UI.message("📂 Copyright file located at: #{copyright_path}")

# Screenshots verification
screenshots_path = File.join(Dir.pwd, "metadata", "en-US", "screenshots")
if Dir.exist?(screenshots_path)
  screenshot_files = Dir.glob(File.join(screenshots_path, "*.{png,jpg,jpeg}")).sort
  UI.message("📸 Found #{screenshot_files.length} screenshot(s) in: #{screenshots_path}")
  screenshot_files.each { |f| UI.message("  - #{File.basename(f)}") }
else
  UI.warning("⚠️  Screenshots directory not found at: #{screenshots_path}")
end

# Upload logging
UI.important("📁 Metadata path: ./metadata")
UI.important("📸 Screenshots path: ./metadata/en-US/screenshots")
```

## Changes Made

### File Modified: `ios/App/fastlane/Fastfile`

1. **Line 238**: Updated comment to reflect correct path
2. **Line 247**: Fixed copyright_path to remove extra "fastlane/" prefix
3. **Line 253**: Added logging for copyright file location
4. **Line 296**: Fixed screenshots_path to remove extra "fastlane/" prefix
5. **Lines 297-304**: Added screenshots verification and logging
6. **Lines 311-312**: Updated metadata and screenshots path logging
7. **Line 326**: Fixed metadata_path parameter to remove extra "fastlane/" prefix

## Testing

Verified the fix by testing path resolution:

```bash
cd ios/App/fastlane
ruby -e "
  copyright_path = File.join(Dir.pwd, 'metadata', 'en-US', 'copyright.txt')
  puts \"Copyright file exists: #{File.exist?(copyright_path)}\"
  
  screenshots_path = File.join(Dir.pwd, 'metadata', 'en-US', 'screenshots')
  screenshot_files = Dir.glob(File.join(screenshots_path, '*.{png,jpg,jpeg}'))
  puts \"Found #{screenshot_files.length} screenshots\"
"
```

**Result:**
```
Copyright file exists: true
Found 9 screenshots
```

✅ Both the copyright file and screenshots are now accessible at the correct paths.

## Expected Behavior After Fix

When the deployment pipeline runs:

1. ✅ Copyright automation will successfully find and update the copyright file
2. ✅ Copyright will be updated with the current year (e.g., "2025 Enterprise Support")
3. ✅ Screenshots will be detected and logged (9 screenshots found)
4. ✅ Metadata will be uploaded to Apple Connect with explicit path
5. ✅ Screenshots will be uploaded to Apple Connect
6. ✅ Pipeline logs will show clear confirmation of all uploads

### Sample Log Output

```
🕐 Updating copyright metadata...
📂 Copyright file located at: /path/to/ios/App/fastlane/metadata/en-US/copyright.txt
📝 Updated copyright to: 2025 Enterprise Support
✅ Copyright updated in 0.1s

📸 Found 9 screenshot(s) in: /path/to/ios/App/fastlane/metadata/en-US/screenshots
  - 1_1.png
  - 1_2.png
  - 1_3.png
  - 2_1.png
  - 2_2.png
  - 2_3.png
  - 3_1.png
  - 3_2.png
  - 3_3.png

🚀 Starting App Store upload...
📦 IPA path: /path/to/App.ipa
🔑 API Key configured: true
📁 Metadata path: ./metadata
📸 Screenshots path: ./metadata/en-US/screenshots
✅ Upload completed successfully!
```

## Impact

### Before Fix
- ❌ Copyright field empty in Apple Connect
- ❌ Screenshots not uploaded (showing "0 of 10 screenshots" in Apple Connect)
- ❌ Metadata incomplete
- ❌ Manual intervention required to complete submission

### After Fix
- ✅ Copyright automatically updated with current year
- ✅ All 9 screenshots uploaded to Apple Connect (3 screenshots for each of 3 iPhone sizes)
- ✅ Complete metadata in Apple Connect
- ✅ Fully automated submission process

## Related Files

- **Fastfile**: `ios/App/fastlane/Fastfile` (main configuration)
- **Copyright**: `ios/App/fastlane/metadata/en-US/copyright.txt`
- **Screenshots**: `ios/App/fastlane/metadata/en-US/screenshots/*.png`
- **Workflow**: `.github/workflows/deploy.yml`

## Documentation

- [Apple Connect Copyright Automation](docs/APPLE_CONNECT_COPYRIGHT_AUTOMATION.md)
- [Apple Connect Metadata Automation](docs/APPLE_CONNECT_METADATA.md)
- [Screenshots README](ios/App/fastlane/metadata/en-US/screenshots/README.md)

## Prevention

To prevent similar issues in the future:

1. ✅ Added explicit `metadata_path` parameter to remove ambiguity
2. ✅ Added comprehensive logging to verify paths during runtime
3. ✅ Added screenshots verification that lists all found files
4. ✅ Clear error messages if files are not found

## Deployment

This fix will be applied on the next deployment:

1. Merge this PR
2. Create a new version tag (e.g., `v1.0.1`)
3. Push the tag: `git push origin v1.0.1`
4. GitHub Actions will automatically deploy with the fix
5. Verify in Apple Connect that copyright and screenshots are populated

## Verification Steps

After deployment, verify the fix by:

1. **Check Pipeline Logs**:
   - Look for "📂 Copyright file located at..." message
   - Look for "📸 Found X screenshot(s)..." message
   - Verify upload success message

2. **Check Apple Connect**:
   - Log in to [App Store Connect](https://appstoreconnect.apple.com)
   - Navigate to your app → Version 1.0
   - Verify copyright field shows current year (e.g., "2025 Enterprise Support")
   - Verify screenshots are displayed (should show 9 screenshots)

3. **Check Metadata**:
   - All metadata fields should be populated
   - No empty fields
   - Ready for submission

## Support

If you encounter any issues after this fix:

1. Check the GitHub Actions logs for the deploy workflow
2. Look for error messages in the fastlane output
3. Verify that the metadata files exist in the repository
4. See [SUPPORT.md](SUPPORT.md) for additional help
