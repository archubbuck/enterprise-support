# App Store Metadata Management

This directory contains all metadata for the App Store Connect listing, managed according to [Fastlane conventions](https://docs.fastlane.tools/actions/upload_to_app_store/#non-localized-metadata).

⚠️ **IMPORTANT:** This folder is the **canonical source** for all App Store metadata. All metadata must be managed here. Do not edit metadata directly in App Store Connect, as changes will be overwritten on the next deployment.

## Quick Start

### Before Making Changes

Always validate your metadata before committing:

```bash
# Validate metadata structure and content
npm run validate:metadata

# Run all checks (recommended)
npm run check
```

### Common Tasks

**Update App Description:**
```bash
nano ios/App/fastlane/metadata/en-US/description.txt
npm run validate:metadata
git add . && git commit -m "Update app description"
```

**Add Screenshots:**
```bash
# Place screenshots in screenshots directory with proper naming
cp my-screenshot.png ios/App/fastlane/metadata/en-US/screenshots/1_4.png
npm run validate:metadata
```

**Change App Category:**
```bash
# Edit primary_category.txt with a valid category
echo "PRODUCTIVITY" > ios/App/fastlane/metadata/primary_category.txt
npm run validate:metadata
```

## Directory Structure

```
metadata/
├── copyright.txt                    # Non-localized copyright (auto-updated)
├── primary_category.txt             # Required: Primary App Store category
├── secondary_category.txt           # Optional: Secondary category
├── routing_app_coverage.geojson     # Optional: Geographic routing coverage
└── en-US/                           # Locale-specific metadata (required)
    ├── name.txt                     # App display name (30 char limit)
    ├── subtitle.txt                 # App subtitle (30 char limit)
    ├── description.txt              # Full description (4000 char limit)
    ├── keywords.txt                 # Search keywords (100 char limit)
    ├── promotional_text.txt         # Promotional banner (170 char limit)
    ├── release_notes.txt            # What's new (4000 char limit)
    ├── support_url.txt              # Support website URL (required)
    ├── privacy_url.txt              # Privacy policy URL (required)
    ├── marketing_url.txt            # Marketing website URL
    └── screenshots/                 # Screenshots & preview videos
        ├── 1_1.png                  # iPhone 6.7" - screenshot 1
        ├── 1_2.png                  # iPhone 6.7" - screenshot 2
        ├── 2_1.png                  # iPhone 6.5" - screenshot 1
        └── ...
```

## Best Practices

1. **Always validate before committing:** Run `npm run validate:metadata`
2. **Version control everything:** All changes should go through Git
3. **Review in PRs:** Have team members review metadata changes
4. **Test URLs:** Ensure all URLs are accessible before deployment
5. **Update regularly:** Keep screenshots current when UI changes
6. **Optimize keywords:** Review and update based on App Store analytics
7. **Follow character limits:** Stay well under limits for better display
8. **Use the metadata folder exclusively:** Do not edit metadata directly in App Store Connect

## Validation

### Local Validation

Before committing changes, always validate:

```bash
npm run validate:metadata
```

This checks:
- ✅ Required files exist
- ✅ Character limits are respected
- ✅ URLs are valid
- ✅ Categories are correct
- ✅ Screenshots follow naming conventions
- ✅ Fastfile configuration is proper

### CI/CD Validation

Validation runs automatically:
- **CI workflow:** On every pull request and push to main
- **Deploy workflow:** Before uploading to App Store Connect

This ensures metadata is always valid before deployment.

## Additional Resources

- [Fastlane deliver Documentation](https://docs.fastlane.tools/actions/deliver/)
- [Apple App Store Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications)
- [App Store Product Page](https://developer.apple.com/app-store/product-page/)
- [Apple Connect Metadata Documentation](../../../../../docs/APPLE_CONNECT_METADATA.md)
- [iOS Development Guide](../../../../../docs/iOS_DEVELOPMENT.md)
- [Screenshots README](en-US/screenshots/README.md)

For detailed information about each metadata file, see [Apple Connect Metadata Documentation](../../../../../docs/APPLE_CONNECT_METADATA.md).
