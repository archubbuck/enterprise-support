# Fastlane Metadata Files - Scaffold Information

This document explains the metadata files that have been scaffolded for fastlane App Store deployment.

## Overview

All metadata files that fastlane can detect have been created as empty placeholders. Files will only be used by fastlane when they contain content.

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

**Usage:** Required for Korean App Store distribution. Leave empty if not distributing in Korea.

## How to Use These Files

1. **Leave Empty:** Files you don't need can remain empty. Fastlane will skip them.

2. **Add Content:** Simply add text content to any file to enable that metadata field.

3. **Validation:** Run `npm run validate:metadata` to check your changes.

4. **Deployment:** These files are automatically read by the `fastlane deliver` action during deployment.

## Examples

### Adding Review Information

```bash
# Add review contact information
echo "John" > metadata/review_information/first_name.txt
echo "Doe" > metadata/review_information/last_name.txt
echo "+1 555-123-4567" > metadata/review_information/phone_number.txt
echo "review@example.com" > metadata/review_information/email_address.txt

# Add demo credentials (if app requires login)
echo "demo_user" > metadata/review_information/demo_user.txt
echo "demo_pass123" > metadata/review_information/demo_password.txt

# Add notes for reviewers
echo "Please use the demo account to test all features." > metadata/review_information/notes.txt
```

### Adding Subcategories

```bash
# If your primary category is BUSINESS, you might add:
echo "ENTERPRISE" > metadata/primary_first_sub_category.txt
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
