# Fastlane Metadata Files - Configuration Guide

This document explains the metadata files that have been scaffolded for fastlane App Store deployment and how to configure them using environment variables.

## Overview

All metadata files that fastlane can detect have been created as empty placeholders. **Sensitive metadata values (like phone numbers and emails) should be defined in environment variables** instead of being committed to the repository.

## Environment-Based Configuration (Recommended)

To prevent sensitive information from being committed to git, metadata values can be injected from environment variables:

1. **Copy the example file:**
   ```bash
   cp ios/App/fastlane/.env.example ios/App/fastlane/.env
   ```

2. **Edit `.env` with your values:**
   ```bash
   # Add your review contact information
   METADATA_REVIEW_FIRST_NAME=John
   METADATA_REVIEW_LAST_NAME=Doe
   METADATA_REVIEW_PHONE=+1-555-123-4567
   METADATA_REVIEW_EMAIL=review@example.com
   ```

3. **Run fastlane:**
   When you run the `release` lane, metadata values are automatically injected from environment variables into the metadata files before upload.

### Available Environment Variables

#### Review Information (Sensitive)
- `METADATA_REVIEW_FIRST_NAME` - First name of App Store review contact
- `METADATA_REVIEW_LAST_NAME` - Last name of App Store review contact
- `METADATA_REVIEW_PHONE` - Phone number for review team
- `METADATA_REVIEW_EMAIL` - Email address for review team
- `METADATA_REVIEW_DEMO_USER` - Demo account username
- `METADATA_REVIEW_DEMO_PASSWORD` - Demo account password
- `METADATA_REVIEW_NOTES` - Notes for reviewers

#### Trade Representative Contact (Sensitive)
- `METADATA_TRADE_REP_FIRST_NAME` - Trade rep first name
- `METADATA_TRADE_REP_LAST_NAME` - Trade rep last name
- `METADATA_TRADE_REP_ADDRESS_LINE1` - Address line 1
- `METADATA_TRADE_REP_ADDRESS_LINE2` - Address line 2
- `METADATA_TRADE_REP_ADDRESS_LINE3` - Address line 3
- `METADATA_TRADE_REP_CITY` - City name
- `METADATA_TRADE_REP_STATE` - State/Province
- `METADATA_TRADE_REP_COUNTRY` - Country
- `METADATA_TRADE_REP_POSTAL_CODE` - Postal code
- `METADATA_TRADE_REP_PHONE` - Contact phone
- `METADATA_TRADE_REP_EMAIL` - Contact email
- `METADATA_TRADE_REP_DISPLAY_ON_APP_STORE` - Display on Korean App Store (true/false)

#### Optional Metadata
- `METADATA_PRIMARY_FIRST_SUB_CATEGORY` - Primary category first subcategory
- `METADATA_PRIMARY_SECOND_SUB_CATEGORY` - Primary category second subcategory
- `METADATA_SECONDARY_FIRST_SUB_CATEGORY` - Secondary category first subcategory
- `METADATA_SECONDARY_SECOND_SUB_CATEGORY` - Secondary category second subcategory
- `METADATA_APPLE_TV_PRIVACY_POLICY` - Apple TV privacy policy text

### CI/CD Integration

In GitHub Actions or other CI environments, set these as secrets:

```yaml
env:
  METADATA_REVIEW_FIRST_NAME: ${{ secrets.METADATA_REVIEW_FIRST_NAME }}
  METADATA_REVIEW_LAST_NAME: ${{ secrets.METADATA_REVIEW_LAST_NAME }}
  METADATA_REVIEW_PHONE: ${{ secrets.METADATA_REVIEW_PHONE }}
  METADATA_REVIEW_EMAIL: ${{ secrets.METADATA_REVIEW_EMAIL }}
  # ... other variables
```

## Manual File Configuration (Alternative)

If you prefer to manage metadata files directly without environment variables:

1. **Leave Empty:** Files you don't need can remain empty. Fastlane will skip them.

2. **Add Content:** Simply add text content to any file to enable that metadata field.

3. **Validation:** Run `npm run validate:metadata` to check your changes.

4. **Deployment:** These files are automatically read by the `fastlane deliver` action during deployment.

**Note:** Direct file editing is not recommended for sensitive information like phone numbers and emails.

## Files Created

### Non-Localized App Category Subcategories

Located in `metadata/`:

- `primary_first_sub_category.txt` - First subcategory for primary category
- `primary_second_sub_category.txt` - Second subcategory for primary category  
- `secondary_first_sub_category.txt` - First subcategory for secondary category
- `secondary_second_sub_category.txt` - Second subcategory for secondary category

**Usage:** These are optional refinements to the primary/secondary categories. Leave empty if not needed.

### Localized App Values

Located in `metadata/en-US/`:

- `apple_tv_privacy_policy.txt` - Privacy policy text specifically for Apple TV apps

**Usage:** Only needed if you're releasing an Apple TV version of your app. Can remain empty for iOS-only apps.

### Review Information

Located in `metadata/review_information/`:

- `first_name.txt` - First name of App Store review contact
- `last_name.txt` - Last name of App Store review contact
- `phone_number.txt` - Phone number for App Store review team
- `email_address.txt` - Email address for App Store review team
- `demo_user.txt` - Demo account username (if app requires login)
- `demo_password.txt` - Demo account password (if app requires login)
- `notes.txt` - Additional notes for the review team

**Usage:** Populate these files when submitting for App Store review. The demo credentials are especially important if your app requires authentication.

**Security Note:** Do not commit actual production credentials. Use dedicated demo accounts.

### Trade Representative Contact Information

Located in `metadata/trade_representative_contact_information/`:

- `first_name.txt` - Trade representative first name
- `last_name.txt` - Trade representative last name
- `address_line1.txt` - Address line 1
- `address_line2.txt` - Address line 2 (optional)
- `address_line3.txt` - Address line 3 (optional)
- `city_name.txt` - City name
- `state.txt` - State/Province
- `country.txt` - Country
- `postal_code.txt` - Postal/ZIP code
- `phone_number.txt` - Contact phone number
- `email_address.txt` - Contact email address
- `is_displayed_on_app_store.txt` - Whether to display on Korean App Store (true/false)

**Usage:** Required for Korean App Store distribution. Use environment variables to avoid committing sensitive contact information.

## How the Injection Works

When the `release` lane runs in fastlane:

1. The `inject_metadata.rb` script reads environment variables
2. Values are written to corresponding metadata files
3. Fastlane reads the metadata files and uploads to App Store Connect
4. Files are not committed to git (they remain empty placeholders in the repository)

This approach ensures:
- ✅ Sensitive information stays out of git history
- ✅ Easy configuration through .env files or CI secrets
- ✅ Same metadata structure as manual file editing
- ✅ Automatic injection on every deployment

## Example: Local Development Setup

```bash
# 1. Copy the example environment file
cp ios/App/fastlane/.env.example ios/App/fastlane/.env

# 2. Edit the .env file with your values
nano ios/App/fastlane/.env

# 3. Add your review information
METADATA_REVIEW_FIRST_NAME=John
METADATA_REVIEW_LAST_NAME=Doe
METADATA_REVIEW_PHONE=+1-555-123-4567
METADATA_REVIEW_EMAIL=review@example.com
METADATA_REVIEW_DEMO_USER=demo_user
METADATA_REVIEW_DEMO_PASSWORD=demo_pass123

# 4. Run fastlane (metadata is automatically injected)
cd ios/App
bundle exec fastlane release
```

## Testing Metadata Injection

You can test the metadata injection script without running the full release:

```bash
cd ios/App/fastlane

# Set some test environment variables
export METADATA_REVIEW_FIRST_NAME="Test User"
export METADATA_REVIEW_EMAIL="test@example.com"

# Run the injection script
ruby scripts/inject_metadata.rb

# Check the injected files
cat metadata/review_information/first_name.txt
cat metadata/review_information/email_address.txt
```

## Documentation

For more information:
- [Fastlane deliver Documentation](https://docs.fastlane.tools/actions/deliver/)
- [Apple Connect Metadata Documentation](../../../../../docs/APPLE_CONNECT_METADATA.md)
- [Main Metadata README](README.md)

## Validation

Always validate your metadata after making changes:

```bash
npm run validate:metadata
```

This ensures all files follow the correct format and character limits.
