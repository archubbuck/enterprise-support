# Apple Connect Copyright Field Automation

## Overview

This document describes the automated copyright field management for App Store Connect submissions. The automation ensures that the copyright field is automatically updated with the current year during each app release, eliminating manual intervention and reducing the risk of errors.

## Problem Statement

Previously, setting the copyright field for an app version in Apple Connect required manual entry through the App Store Connect web interface. This manual process:
- Slowed down app submissions
- Increased the risk of human error (wrong year, typos)
- Required manual updates for each release
- Created friction in the release pipeline

## Solution

The copyright automation is implemented in the Fastlane deployment pipeline (`ios/App/fastlane/Fastfile`) and automatically:
1. Reads the existing copyright text from the metadata file
2. Extracts the company name while preserving it
3. Updates the year to the current year
4. Writes the updated copyright back to the metadata file
5. Uploads the metadata to App Store Connect during deployment

### Implementation Details

The automation is part of the `release` lane in the Fastfile and executes before uploading the app to App Store Connect.

**Key Features:**
- **Preserves company name**: The company name is extracted from the existing copyright and preserved across updates
- **Smart parsing**: Handles multiple copyright formats (with/without year prefix)
- **Validation**: Ensures the copyright file exists and contains valid data
- **Fallback mechanism**: Uses a default company name if extraction fails
- **Current year**: Always uses the current year at build time

## How It Works

### File Location

The copyright metadata is stored in:
```
ios/App/fastlane/metadata/en-US/copyright.txt
```

### Supported Formats

The automation supports multiple copyright formats:

| Input Format | Extracted Company Name | Output (2025) |
|--------------|------------------------|---------------|
| `2025 Enterprise Support` | `Enterprise Support` | `2025 Enterprise Support` |
| `2024 My Company` | `My Company` | `2025 My Company` |
| `2020 Acme Corporation` | `Acme Corporation` | `2025 Acme Corporation` |
| `My Company Name` | `My Company Name` | `2025 My Company Name` |
| `2025` | Uses default | `2025 Enterprise Support` |
| Empty string | Uses default | `2025 Enterprise Support` |
| `Enterprise Support` | `Enterprise Support` | `2025 Enterprise Support` |

### Automation Logic

```ruby
# Read existing copyright
existing_copyright = File.read(copyright_path).strip

# Extract company name
parts = existing_copyright.split(' ', 2)
if parts[0] =~ /^\d{4}$/ && parts.length > 1
  # Year followed by company name
  company_name = parts[1]
elsif parts[0] =~ /^\d{4}$/ && parts.length == 1
  # Only year, use default
  company_name = "Enterprise Support"
else
  # No year, treat entire text as company name
  company_name = existing_copyright
end

# Generate new copyright with current year
current_year = Time.now.year
copyright_text = "#{current_year} #{company_name}"
```

## Configuration

### Setting Your Company Name

To customize the copyright for your organization:

1. Edit the copyright file:
   ```bash
   nano ios/App/fastlane/metadata/en-US/copyright.txt
   ```

2. Set your company name (with or without a year):
   ```
   Your Company Name
   ```
   or
   ```
   2025 Your Company Name
   ```

3. The automation will preserve your company name and update the year automatically on each release.

### Default Company Name

The default company name is set to `"Enterprise Support"` in the Fastfile. To change the default:

1. Edit `ios/App/fastlane/Fastfile`
2. Locate the line:
   ```ruby
   default_company_name = "Enterprise Support"
   ```
3. Change it to your preferred default:
   ```ruby
   default_company_name = "Your Company Name"
   ```

## Testing the Automation

### Manual Test

You can test the copyright automation locally without running a full build:

1. Create a test script:
   ```ruby
   #!/usr/bin/env ruby
   require 'time'
   
   # Test with different copyright formats
   test_cases = [
     "2024 My Company",
     "My Company",
     "2025",
     ""
   ]
   
   # Run the logic for each test case
   # (See full test script in repository)
   ```

2. Run the test:
   ```bash
   ruby test_copyright.rb
   ```

### CI/CD Test

The automation runs automatically during GitHub Actions deployments. Check the workflow logs:

1. Go to Actions → Deploy to App Store
2. Find the "Run Fastlane release" step
3. Look for the copyright update logs:
   ```
   🕐 Updating copyright metadata...
   📝 Updated copyright to: 2025 Your Company
   ✅ Copyright updated in 0.1s
   ```

## Validation

The automation includes several validation checks:

1. **File existence**: Verifies the copyright file exists
   ```ruby
   UI.user_error!("Copyright file not found at: #{copyright_path}") unless File.exist?(copyright_path)
   ```

2. **Non-empty company name**: Ensures company name is not empty
   ```ruby
   company_name = default_company_name if company_name.nil? || company_name.strip.empty?
   ```

3. **Year format**: Validates that years are 4-digit numbers
   ```ruby
   year_regex = /^\d{4}$/
   ```

## Benefits

### Automation Benefits
- ✅ **Eliminates manual entry**: No need to log into App Store Connect to set copyright
- ✅ **Always current**: Year is automatically updated to the current year
- ✅ **Consistent**: Same format across all releases
- ✅ **Error-free**: No typos or wrong years
- ✅ **Fast**: Reduces release time by eliminating manual steps

### Developer Benefits
- ✅ **No configuration needed**: Works out of the box
- ✅ **Customizable**: Easy to change company name when needed
- ✅ **Transparent**: Clear logs show exactly what's being set
- ✅ **Reliable**: Robust error handling and fallback mechanisms

## Apple Connect API Capabilities

### Metadata Upload via Fastlane

The automation uses Fastlane's `upload_to_app_store` action, which leverages the App Store Connect API to upload metadata including copyright information.

**Capabilities:**
- ✅ Update copyright field programmatically
- ✅ Update all app metadata (description, keywords, screenshots, etc.)
- ✅ Upload via API authentication (no password required)
- ✅ Atomic updates (all metadata updated together)

**API Authentication:**
- Uses App Store Connect API Key (`.p8` file)
- Requires `APPSTORE_KEY_ID`, `APPSTORE_ISSUER_ID`, and `APPSTORE_P8` secrets
- API key provides secure, long-lived authentication

### Supported Metadata Fields

The following metadata fields can be automated via the API:
- Copyright (implemented ✅)
- Description
- Keywords
- Promotional text
- Support URL
- Marketing URL
- Screenshots
- Privacy policy
- What's new text

## Workflow Integration

The copyright automation is integrated into the GitHub Actions deployment workflow:

```yaml
# .github/workflows/deploy.yml
- name: Run Fastlane release
  env:
    APPSTORE_KEY_ID: ${{ secrets.APPSTORE_KEY_ID }}
    APPSTORE_ISSUER_ID: ${{ secrets.APPSTORE_ISSUER_ID }}
    APPSTORE_P8: ${{ secrets.APPSTORE_P8 }}
    # ... other secrets
  working-directory: ios/App
  run: bundle exec fastlane release
```

The `release` lane automatically:
1. Updates copyright with current year
2. Builds the iOS app
3. Uploads to App Store Connect with updated metadata

## Required Permissions

### GitHub Secrets

No additional secrets are required beyond the existing App Store Connect API credentials:
- `APPSTORE_KEY_ID` - API Key ID
- `APPSTORE_ISSUER_ID` - Issuer ID
- `APPSTORE_P8` - Private key content

### App Store Connect Permissions

The API key must have the following permissions:
- **App Manager** or **Admin** role
- Access to your app in App Store Connect
- Ability to upload builds and metadata

## Troubleshooting

### Copyright Not Updating

**Symptoms:**
- Copyright year remains old
- Error: "Copyright file not found"

**Solutions:**
1. Verify the file exists:
   ```bash
   ls -la ios/App/fastlane/metadata/en-US/copyright.txt
   ```

2. Check file permissions:
   ```bash
   chmod 644 ios/App/fastlane/metadata/en-US/copyright.txt
   ```

3. Verify file content:
   ```bash
   cat ios/App/fastlane/metadata/en-US/copyright.txt
   ```

### Wrong Company Name

**Symptoms:**
- Copyright shows "Enterprise Support" instead of your company

**Solutions:**
1. Update the copyright file with your company name:
   ```bash
   echo "Your Company Name" > ios/App/fastlane/metadata/en-US/copyright.txt
   ```

2. Or change the default in the Fastfile:
   ```ruby
   default_company_name = "Your Company Name"
   ```

### Upload Fails

**Symptoms:**
- Fastlane upload fails after copyright update
- Error: "Unable to authenticate"

**Solutions:**
1. Verify API key credentials are correct
2. Check App Store Connect API key hasn't expired
3. Ensure API key has proper permissions
4. Review Fastlane logs for specific error messages

### Year Not Updating in CI

**Symptoms:**
- Local builds work, but CI shows wrong year
- Year stays at build time instead of deployment time

**Solutions:**
1. This is expected behavior - the year is set at build time
2. Ensure system clock is correct in CI environment
3. Check GitHub Actions runner time zone settings

## Multiple Locales

To add copyright for additional languages:

1. Create a new locale directory:
   ```bash
   mkdir -p ios/App/fastlane/metadata/es-ES
   ```

2. Create a copyright file:
   ```bash
   echo "Your Company Name" > ios/App/fastlane/metadata/es-ES/copyright.txt
   ```

3. The automation will update all locale-specific copyright files automatically

**Note:** The current implementation only updates `en-US` locale. To support multiple locales, the Fastfile would need to be extended to iterate through all locale directories.

## Future Enhancements

Potential improvements to consider:

1. **Multi-locale support**: Automatically update copyright for all locales
2. **Company config integration**: Read company name from `company.config.json`
3. **Version-specific copyright**: Include version number in copyright text
4. **Validation warnings**: Alert if company name looks incorrect
5. **Copyright range**: Support year ranges (e.g., "2020-2025 Company")

## Related Documentation

- [iOS Development Guide](./iOS_DEVELOPMENT.md) - General iOS development and deployment
- [CI/CD Pipeline](./CI_CD.md) - Continuous integration and deployment setup
- [Fastlane Documentation](https://docs.fastlane.tools) - Official Fastlane documentation
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi) - Apple's API documentation

## Summary

The copyright field automation provides:
- ✅ Fully automated copyright updates
- ✅ Always uses current year
- ✅ Preserves company name
- ✅ Zero manual intervention required
- ✅ Integrated with CI/CD pipeline
- ✅ Robust error handling
- ✅ Easy to customize
- ✅ Well-documented

This automation streamlines the app release process and ensures copyright information is always accurate and up-to-date.
