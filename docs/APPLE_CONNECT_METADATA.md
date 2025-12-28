# Apple Connect Metadata Automation

This document explains how the Enterprise Support app automates metadata uploads to Apple App Store Connect using Fastlane.

## Overview

When you run the deployment workflow (triggered by pushing a version tag like `v1.0.0`), the app automatically uploads metadata to App Store Connect, reducing manual data entry and ensuring consistency across releases.

## Automated Metadata Fields

### 1. Marketing URL ✅

**Status:** Fully Automated

The Marketing URL is automatically populated from the metadata file.

**Location:** `ios/App/fastlane/metadata/en-US/marketing_url.txt`

**Current Value:** `https://github.com/archubbuck`

**To Update:** Edit the file and commit your changes.

### 2. Version ✅

**Status:** Fully Automated

The app version is managed through Xcode's build system.

**Location:** `ios/App/App.xcodeproj/project.pbxproj`
- `MARKETING_VERSION`: User-facing version (e.g., "1.0")
- `CURRENT_PROJECT_VERSION`: Build number (e.g., "1")

**How It Works:**
- Version is read from the Xcode project during build
- Automatically included in the IPA metadata
- Synced to App Store Connect during upload

**To Update:** 
1. Edit the Xcode project file or use Xcode to update the version
2. Commit and push a new version tag (e.g., `v1.1.0`)

### 3. Copyright ✅

**Status:** Fully Automated with Auto-Update

The copyright field is automatically updated to include the current year.

**Location:** `ios/App/fastlane/metadata/en-US/copyright.txt`

**How It Works:**
The Fastlane script automatically:
1. Reads the existing copyright file
2. Extracts the company name
3. Updates the year to the current year
4. Writes the updated copyright back
5. Uploads to App Store Connect

**Example:**
```
2025 Enterprise Support
```

See [Apple Connect Copyright Automation](./APPLE_CONNECT_COPYRIGHT_AUTOMATION.md) for detailed documentation.

### 4. Routing App Coverage File ⚠️

**Status:** Template Provided

Apple requires routing apps to specify geographic coverage areas using a GeoJSON file.

**Location:** `ios/App/fastlane/metadata/routing_app_coverage.geojson`

**Format Requirements:**
- Must be valid GeoJSON
- Must contain a `MultiPolygon` type
- Coordinates in `[longitude, latitude]` format
- No holes, comments, or extra properties
- Recommended: < 20 points per polygon

**Sample File (San Francisco Bay Area):**
```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [-122.4194, 37.7749],
        [-122.4083, 37.7749],
        [-122.4083, 37.7849],
        [-122.4194, 37.7849],
        [-122.4194, 37.7749]
      ]
    ]
  ]
}
```

**To Customize:**
1. Create your coverage area polygon using a GeoJSON editor (e.g., [geojson.io](https://geojson.io))
2. Ensure it's a `MultiPolygon` type
3. Simplify to reduce points
4. Replace the contents of `routing_app_coverage.geojson`
5. Commit and deploy

**Note:** Currently, Fastlane doesn't automatically upload routing coverage files. You may need to upload this manually via App Store Connect or use the App Store Connect API.

### 5. Screenshots ✅

**Status:** Fully Automated

Screenshots are automatically uploaded from the metadata folder.

**Location:** `ios/App/fastlane/metadata/en-US/screenshots/`

**Current Device Sizes:**
- **6.7" iPhone** (1290 x 2796): `1_1.png`, `1_2.png`, `1_3.png`
- **6.5" iPhone** (1284 x 2778): `2_1.png`, `2_2.png`, `2_3.png`
- **6.1" iPhone** (1179 x 2556): `3_1.png`, `3_2.png`, `3_3.png`

**Required Sizes for Full Coverage:**

| Device | Display Size | Dimensions (Portrait) | Slot |
|--------|-------------|----------------------|------|
| iPhone | 6.7" | 1290 x 2796 | 1 |
| iPhone | 6.5" | 1284 x 2778 | 2 |
| iPhone | 6.1" | 1179 x 2556 | 3 |
| iPad Pro | 12.9" | 2048 x 2732 | 4 |
| iPad Pro | 11" | 1668 x 2388 | 5 |
| Apple Watch | 45mm | 396 x 484 | 6 |
| Apple Watch | 41mm | 324 x 394 | 7 |

**File Naming Convention:**
- `{slot}_{number}.png` (e.g., `1_1.png`, `1_2.png`, `4_1.png`)
- Slot = device size number
- Number = screenshot sequence (1-10)

**How to Add Screenshots:**

1. **Take Screenshots:**
   - Run your app in iOS Simulator or on a device
   - Press `Cmd+S` in Simulator to capture
   - Or use device screenshot (Volume Up + Side Button)

2. **Verify Dimensions:**
   ```bash
   file screenshot.png
   # Should show: PNG image data, 1290 x 2796, ...
   ```

3. **Rename and Place:**
   ```bash
   cp screenshot.png ios/App/fastlane/metadata/en-US/screenshots/1_1.png
   ```

4. **Commit and Deploy**

**Best Practices:**
- Upload 3-5 screenshots per device size
- Show key app features
- Use consistent styling
- First 3 screenshots appear on installation sheets

See `screenshots/README.md` for detailed instructions.

### 6. App Previews (Videos) 📹

**Status:** Infrastructure Ready

App Store Connect supports preview videos to showcase your app.

**Location:** `ios/App/fastlane/metadata/en-US/screenshots/` (same as screenshots)

**Requirements:**
- **Format:** .mov, .m4v, or .mp4
- **Codec:** H.264 or ProRes 422 HQ
- **Duration:** 15-30 seconds
- **Max File Size:** 500 MB
- **Up to 3 videos per device size**

**File Naming:**
- `{slot}_1.mov`, `{slot}_2.mov`, `{slot}_3.mov`
- Place in the same screenshots directory

**Dimensions by Device:**

| Device | Resolution (Portrait) |
|--------|----------------------|
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1284 x 2778 |
| iPhone 6.1" | 1179 x 2556 |
| iPad (all) | 1200 x 1600 |
| Apple Watch | 312 x 390 |

**To Add App Previews:**

1. Record your app in action (15-30 seconds)
2. Export as .mov with H.264 codec
3. Ensure correct dimensions
4. Name according to convention
5. Place in screenshots directory
6. Commit and deploy

**Note:** Fastlane automatically detects and uploads both images and videos from the screenshots directory.

### 7. App Name & Subtitle ✅

**Status:** Fully Automated

**Locations:**
- `ios/App/fastlane/metadata/en-US/name.txt` - App display name
- `ios/App/fastlane/metadata/en-US/subtitle.txt` - App subtitle (appears below the app name)

**Current Values:**
- Name: `Enterprise Support`
- Subtitle: `IT Help & Documentation`

**To Update:** Edit these files and commit your changes. The values will be automatically uploaded to App Store Connect with the next deployment.

### 8. Support & Privacy URLs ✅

**Status:** Fully Automated

**Locations:**
- `ios/App/fastlane/metadata/en-US/support_url.txt` - Support website URL
- `ios/App/fastlane/metadata/en-US/privacy_url.txt` - Privacy policy URL

**Current Values:**
- Support URL: Links to the GitHub repository
- Privacy URL: Links to the GitHub repository

Update these files to change the URLs.

### 9. Description & Keywords ✅

**Status:** Fully Automated

**Locations:**
- `ios/App/fastlane/metadata/en-US/description.txt` - App Store description
- `ios/App/fastlane/metadata/en-US/keywords.txt` - Search keywords (comma-separated)
- `ios/App/fastlane/metadata/en-US/promotional_text.txt` - Top-of-page promotional text

These are automatically uploaded with each deployment.

## How the Automation Works

### Deployment Workflow

When you push a version tag (e.g., `v1.0.0`):

1. **GitHub Actions** triggers the deploy workflow (`.github/workflows/deploy.yml`)
2. **Build Process:**
   - Installs dependencies
   - Builds the web app
   - Syncs to iOS with Capacitor
   - Builds the iOS archive
3. **Metadata Processing:**
   - Fastlane reads all files from `metadata/` directory
   - Updates copyright year automatically
   - Validates screenshot dimensions
   - Packages everything for upload
4. **Upload to App Store Connect:**
   - IPA file is uploaded
   - Metadata is synced
   - Screenshots and previews are uploaded
   - Version info is set

### Fastlane Configuration

The automation is configured in `ios/App/fastlane/Fastfile`:

```ruby
upload_to_app_store(
  api_key: api_key,
  app_identifier: APP_IDENTIFIER,
  skip_metadata: false,        # ← Enables metadata upload
  skip_screenshots: false,     # ← Enables screenshot upload
  submit_for_review: false,
  precheck_include_in_app_purchases: false,
  force: true
)
```

## Metadata Folder Structure

Complete folder structure with all supported files:

```
ios/App/fastlane/metadata/
├── routing_app_coverage.geojson          # Routing coverage area
├── copyright.txt                          # Global copyright (optional, can be overridden by locale-specific)
├── primary_category.txt                   # App Store category
├── secondary_category.txt                 # Secondary category
├── en-US/                                 # Locale-specific metadata
│   ├── description.txt                    # App description
│   ├── keywords.txt                       # Search keywords
│   ├── marketing_url.txt                  # Marketing website
│   ├── promotional_text.txt               # Promotional banner text
│   ├── support_url.txt                    # Support website
│   ├── privacy_url.txt                    # Privacy policy URL
│   ├── copyright.txt                      # Copyright (locale-specific, recommended)
│   ├── name.txt                          # App name override
│   ├── subtitle.txt                       # App subtitle
│   ├── release_notes.txt                  # What's new text
│   └── screenshots/                       # Screenshots & previews
│       ├── 1_1.png                       # iPhone 6.7" - screenshot 1
│       ├── 1_2.png                       # iPhone 6.7" - screenshot 2
│       ├── 1_3.png                       # iPhone 6.7" - screenshot 3
│       ├── 1_1.mov                       # iPhone 6.7" - preview video 1
│       ├── 2_1.png                       # iPhone 6.5" - screenshot 1
│       ├── ...
│       └── README.md
└── review_information/                    # For App Review team
    ├── demo_user.txt                      # Test account username
    ├── demo_password.txt                  # Test account password
    ├── email_address.txt                  # Contact email
    ├── first_name.txt                     # Contact first name
    ├── last_name.txt                      # Contact last name
    ├── phone_number.txt                   # Contact phone
    └── notes.txt                          # Special instructions
```

## Troubleshooting

### Screenshots Not Uploading

**Problem:** Screenshots don't appear in App Store Connect after deployment.

**Solutions:**
1. Check dimensions: `file screenshots/*.png`
2. Verify file naming: `{slot}_{number}.png`
3. Ensure `skip_screenshots: false` in Fastfile
4. Check deployment logs for validation errors

### Version Mismatch

**Problem:** Wrong version appears in App Store Connect.

**Solutions:**
1. Update `MARKETING_VERSION` in Xcode project
2. Update `CURRENT_PROJECT_VERSION` for build number
3. Commit changes before creating version tag
4. Ensure tag matches version (e.g., `v1.0.0` for version 1.0)

### Copyright Not Updating

**Problem:** Copyright year doesn't update automatically.

**Solutions:**
1. Check `metadata/en-US/copyright.txt` exists
2. Verify Fastfile copyright automation code is present
3. Check deployment logs for copyright processing
4. See [Apple Connect Copyright Automation](./APPLE_CONNECT_COPYRIGHT_AUTOMATION.md)

### Routing Coverage File Issues

**Problem:** Routing coverage file not accepted.

**Solutions:**
1. Validate GeoJSON at [geojsonlint.com](https://geojsonlint.com)
2. Ensure type is `MultiPolygon` (not `Polygon`)
3. Check coordinate order: `[longitude, latitude]`
4. Remove any extra properties or comments
5. Simplify polygon (reduce points)

**Note:** Fastlane may not automatically upload routing coverage files. You may need to upload manually via App Store Connect or use the App Store Connect API.

## Manual Metadata Updates

While most metadata is automated, you can still update App Store Connect manually:

1. Visit [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app
3. Edit metadata fields directly
4. Save and submit

**Warning:** Manual changes may be overwritten on the next automated deployment. Always update the metadata files in the repository to ensure consistency.

## Localization

To support multiple languages:

1. Create additional locale directories:
   ```bash
   mkdir -p ios/App/fastlane/metadata/es-ES/screenshots
   mkdir -p ios/App/fastlane/metadata/fr-FR/screenshots
   ```

2. Copy and translate metadata files:
   ```bash
   cp ios/App/fastlane/metadata/en-US/*.txt ios/App/fastlane/metadata/es-ES/
   # Then translate the files
   ```

3. Add locale-specific screenshots

4. Commit and deploy

Fastlane will automatically upload all locales.

## Best Practices

1. **Version Control:** Keep all metadata files in Git
2. **Review Before Deploy:** Check metadata changes in PRs
3. **Test Locally:** Use `fastlane deliver` command locally to test uploads
4. **Consistent Branding:** Use consistent screenshots across device sizes
5. **Regular Updates:** Update screenshots when UI changes
6. **Privacy Compliance:** Ensure privacy URL is current and accurate
7. **Keyword Optimization:** Regularly review and optimize keywords
8. **Monitor Uploads:** Check deployment logs for errors or warnings

## Additional Resources

- [Fastlane deliver Documentation](https://docs.fastlane.tools/actions/deliver/)
- [Apple Screenshot Guidelines](https://developer.apple.com/app-store/product-page/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [GeoJSON Specification](https://geojson.org/)
- [Routing App Coverage Guide](https://developer.apple.com/documentation/appstoreconnectapi/routing-app-coverages)

## Related Documentation

- [Apple Connect Copyright Automation](./APPLE_CONNECT_COPYRIGHT_AUTOMATION.md)
- [iOS Development Guide](./iOS_DEVELOPMENT.md)
- [CI/CD Pipeline](./CI_CD.md)
- [Deployment Workflow](../.github/workflows/deploy.yml)
