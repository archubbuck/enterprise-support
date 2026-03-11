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
ios/App/fastlane/metadata/copyright.txt
```

### Supported Formats

The automation supports multiple copyright formats and always outputs Apple's required format with the © symbol:

| Input Format | Extracted Company Name | Output (2025) |
|--------------|------------------------|---------------|
| `© 2025 Enterprise Support` | `Enterprise Support` | `© 2025 Enterprise Support` |
| `© 2024 My Company` | `My Company` | `© 2025 My Company` |
| `2025 Enterprise Support` | `Enterprise Support` | `© 2025 Enterprise Support` |
| `2024 Acme Corporation` | `Acme Corporation` | `© 2025 Acme Corporation` |
| `© My Company Name` | `My Company Name` | `© 2025 My Company Name` |
| `My Company Name` | `My Company Name` | `© 2025 My Company Name` |
| `© 2025` | Uses default | `© 2025 Enterprise Support` |
| `2025` | Uses default | `© 2025 Enterprise Support` |
| Empty string | Uses default | `© 2025 Enterprise Support` |

**Note:** Apple requires the copyright format to be `© YYYY Company Name` with the © symbol. The automation ensures this format is always used.

### Automation Logic

```ruby
# Read existing copyright
existing_copyright = File.read(copyright_path).strip

# Extract company name by removing the leading year and © symbol if present
# Supported formats:
# - "© YYYY Company Name" (Apple's recommended format)
# - "YYYY Company Name" (legacy format)
# - "Company Name" (company name only)
parts = existing_copyright.split(' ')

# Check if first part is copyright symbol
has_copyright_symbol = parts[0] == '©'
offset = has_copyright_symbol ? 1 : 0

# Check if we have a year after the optional © symbol
if parts.length > offset && parts[offset] =~ /^\d{4}$/
  # Format: "© YYYY Company Name" or "YYYY Company Name"
  company_name = parts[(offset + 1)..-1].join(' ')
elsif has_copyright_symbol && parts.length > 1
  # Format: "© Company Name" (no year)
  company_name = parts[1..-1].join(' ')
elsif !has_copyright_symbol && parts.length >= 1
  # Format: "Company Name" (no © symbol, no year)
  company_name = existing_copyright
else
  company_name = nil
end

# Ensure company name is not empty
company_name = "Enterprise Support" if company_name.nil? || company_name.strip.empty?

# Generate new copyright with current year and © symbol
current_year = Time.now.year
copyright_text = "© #{current_year} #{company_name}"
```

## Configuration

### Setting Your Company Name

To customize the copyright for your organization:

1. Edit the copyright file:
   ```bash
   nano ios/App/fastlane/metadata/copyright.txt
   ```

2. Set your company name (the © symbol and year will be added automatically):
   ```
   Your Company Name
   ```
   or include the © symbol and/or year (both will be updated automatically):
   ```
   © 2025 Your Company Name
   ```
   or
   ```
   © Your Company Name
   ```

3. The automation will preserve your company name and ensure the copyright format is `© YYYY Company Name` on each release.

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

You can test the copyright automation locally without running a full build using the provided test script:

```bash
ruby scripts/test-copyright-automation.rb
```

The test script validates the automation logic with multiple scenarios including:
- Standard format with year and company
- Outdated years that need updating
- Company name only (without year)
- Year only (fallback to default)
- Empty strings (fallback to default)
- Multi-word company names
- Whitespace handling

Example output:
```
Test Case 2: Outdated year
--------------------------------------------------------------------------------
Input copyright: '2024 My Company'
✓ Detected format: Year + Company (2024 My Company)
Output copyright: '2025 My Company'
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

The automation includes validation checks at two stages:

### Pre-deployment Validation (GitHub Action)

A GitHub Action (`verify-copyright`) runs before the Fastlane deployment to validate the copyright file format. This ensures early detection of format issues before the build process starts.

**Location**: `.github/actions/verify-copyright/action.yml`

**Validation checks:**

1. **File existence**: Verifies the copyright file exists
2. **Non-empty content**: Ensures the file is not empty
3. **Format validation**: Checks that the format is parseable by Fastlane
4. **Company name extraction**: Validates that a company name can be extracted

**Supported formats validated:**
- `© YYYY Company Name` - Full format with copyright symbol and year
- `© Company Name` - Copyright symbol without year (year added automatically)
- `YYYY Company Name` - Year without copyright symbol (symbol added automatically)
- `Company Name` - Company name only (both symbol and year added automatically). For this variant, any string with at least 2 characters and at least one letter is treated as the company name.

**Rejected formats:**
- `© YYYY` - Missing company name after year
- `YYYY` - Year only, no company name
- `©` - Copyright symbol only
- Empty file

Example validation output:
```
📋 Checking copyright file...
✅ Copyright file exists at: fastlane/metadata/copyright.txt
📝 Copyright value: © 2025 Enterprise Support
✅ Copyright format valid: © 2025 Enterprise Support
✅ Copyright metadata validation passed
```

### Deployment Validation (Fastlane)

The Fastlane script includes additional validation during deployment:

1. **File existence**: Verifies the copyright file exists
   ```ruby
   UI.user_error!("Copyright file not found at: #{copyright_path}") unless File.exist?(copyright_path)
   ```

2. **Non-empty company name**: Ensures company name is not empty (fallback to default)
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

The copyright automation is integrated into the GitHub Actions deployment workflow with two stages:

### Stage 1: Pre-deployment Validation

The workflow validates the copyright file format before starting the build:

```yaml
# .github/workflows/deploy.yml
- name: Verify copyright file
  uses: ./.github/actions/verify-copyright
```

This step:
- Checks that the copyright file exists
- Validates the format is parseable
- Ensures a company name can be extracted
- Fails fast if the format is invalid

### Stage 2: Copyright Update and Deployment

The `release` lane then updates and uploads the copyright:

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

### Precheck Validation Failures

**Symptoms:**
- Error: "Copyright format invalid: Company name missing after year"
- Error: "Copyright format invalid: Company name missing after © symbol"
- Error: "Copyright file is empty"

**Solutions:**
1. Check the copyright file format:
   ```bash
   cat ios/App/fastlane/metadata/copyright.txt
   ```

2. Ensure the file contains a valid format:
   ```bash
   # Valid examples:
   echo "© 2025 Your Company Name" > ios/App/fastlane/metadata/copyright.txt
   # or
   echo "Your Company Name" > ios/App/fastlane/metadata/copyright.txt
   ```

3. Avoid invalid formats:
   ```bash
   # Invalid: year only
   echo "2025" > ios/App/fastlane/metadata/copyright.txt
   
   # Invalid: copyright symbol only
   echo "©" > ios/App/fastlane/metadata/copyright.txt
   
   # Invalid: copyright and year without company name
   echo "© 2025" > ios/App/fastlane/metadata/copyright.txt
   ```

### Copyright Not Updating

**Symptoms:**
- Copyright year remains old
- Error: "Copyright file not found"

**Solutions:**
1. Verify the file exists:
   ```bash
   ls -la ios/App/fastlane/metadata/copyright.txt
   ```

2. Check file permissions:
   ```bash
   chmod 644 ios/App/fastlane/metadata/copyright.txt
   ```

3. Verify file content:
   ```bash
   cat ios/App/fastlane/metadata/copyright.txt
   ```

### Wrong Company Name

**Symptoms:**
- Copyright shows "Enterprise Support" instead of your company

**Solutions:**
1. Update the copyright file with your company name:
   ```bash
   echo "Your Company Name" > ios/App/fastlane/metadata/copyright.txt
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

## Best Practices

### Keeping Copyright Current

While the Fastlane automation automatically updates the copyright year during deployment, it's recommended to keep the base copyright file in the repository current to avoid Apple App Store precheck warnings.

**Why keep it current?**
- Apple's precheck validation may flag outdated copyright years as warnings
- Reduces confusion during code reviews
- Provides accurate reference when viewing the repository
- Ensures consistency across manual and automated updates

**When to update:**
- **At the start of each year**: Update the copyright year in the repository
- **Before major releases**: Verify the copyright is current
- **After company name changes**: Update immediately

**How to update:**
```bash
# Update to current year
echo "© $(date +%Y) Enterprise Support" > ios/App/fastlane/metadata/copyright.txt

# Verify the update
cat ios/App/fastlane/metadata/copyright.txt

# Commit the change
git add ios/App/fastlane/metadata/copyright.txt
git commit -m "chore: update copyright year to $(date +%Y)"
```

**Automated reminders:**
Consider setting up a calendar reminder or GitHub workflow to:
1. Check copyright file on January 1st each year
2. Create a pull request to update the year
3. Notify team members to review

**Example GitHub Action (optional):**
```yaml
# .github/workflows/annual-copyright-update.yml
name: Annual Copyright Update
on:
  schedule:
    - cron: '0 0 1 1 *'  # January 1st at midnight UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  update-copyright:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Determine current year
        id: set_year
        run: echo "year=$(date +'%Y')" >> "$GITHUB_OUTPUT"
      - name: Update copyright year
        run: |
          CURRENT_YEAR="${{ steps.set_year.outputs.year }}"
          sed -i "s/© [0-9]\{4\}/© ${CURRENT_YEAR}/" ios/App/fastlane/metadata/copyright.txt
      - name: Create pull request
        uses: peter-evans/create-pull-request@5e914681df9dc83aa4e4905692ca88beb2f9e91f  # v7.0.5
        with:
          commit-message: "chore: update copyright year to ${{ steps.set_year.outputs.year }}"
          title: "Update copyright year to ${{ steps.set_year.outputs.year }}"
          body: "Automated update of copyright year for the new year."
          branch: "chore/copyright-${{ steps.set_year.outputs.year }}"
```

**Security Note:** This example uses an immutable commit SHA for v7.0.5 to reduce supply-chain risks from mutable version tags.

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
2. **App config integration**: Read company name from `app.config.json`
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
