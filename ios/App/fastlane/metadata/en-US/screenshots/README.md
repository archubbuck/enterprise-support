# App Store Screenshots

This directory contains screenshots that will be uploaded to the App Store during deployment.

## Current Status

⚠️ **The current screenshots are placeholders.** You should replace them with actual screenshots of your app before submitting to the App Store.

## Requirements

Apple requires screenshots for iOS apps:

- **Minimum**: At least 1 screenshot for one device size
- **Recommended**: 3-5 screenshots showing key features of your app
- **Maximum**: Up to 10 screenshots per device size
- **Display**: Only the first 3 screenshots are shown on app installation sheets

## Screenshot Sizes

Screenshots must match specific device dimensions:

### iPhone (Required)

| Device Size | Dimensions (Portrait) | Example Devices | Slot |
|-------------|----------------------|-----------------|------|
| 6.7-inch | 1290 x 2796 | iPhone 15 Pro Max, iPhone 14 Pro Max | 1 |
| 6.5-inch | 1284 x 2778 | iPhone 15 Plus, iPhone 14 Plus | 2 |
| 6.1-inch | 1179 x 2556 | iPhone 15 Pro, iPhone 15, iPhone 14 Pro | 3 |

### iPad (Optional but Recommended)

| Device Size | Dimensions (Portrait) | Example Devices | Slot |
|-------------|----------------------|-----------------|------|
| 12.9-inch iPad Pro | 2048 x 2732 | iPad Pro 12.9" (all generations) | 4 |
| 11-inch iPad Pro | 1668 x 2388 | iPad Pro 11", iPad Air (2020+) | 5 |

### Apple Watch (Optional)

| Device Size | Dimensions | Example Devices | Slot |
|-------------|-----------|-----------------|------|
| 45mm | 396 x 484 | Apple Watch Series 7+, Ultra | 6 |
| 41mm | 324 x 394 | Apple Watch Series 7+ | 7 |

## File Naming

Screenshots should be named using the slot and sequence number:

```
{slot}_{number}.png

Examples:
1_1.png  (iPhone 6.7" - screenshot 1)
1_2.png  (iPhone 6.7" - screenshot 2)
1_3.png  (iPhone 6.7" - screenshot 3)
2_1.png  (iPhone 6.5" - screenshot 1)
2_2.png  (iPhone 6.5" - screenshot 2)
3_1.png  (iPhone 6.1" - screenshot 1)
4_1.png  (iPad 12.9" - screenshot 1)
5_1.png  (iPad 11" - screenshot 1)
6_1.png  (Apple Watch 45mm - screenshot 1)
7_1.png  (Apple Watch 41mm - screenshot 1)
```

**Current Files:**
- Slot 1 (iPhone 6.7"): ✅ 3 screenshots
- Slot 2 (iPhone 6.5"): ✅ 3 screenshots  
- Slot 3 (iPhone 6.1"): ✅ 3 screenshots
- Slot 4 (iPad 12.9"): ❌ Not provided (optional)
- Slot 5 (iPad 11"): ❌ Not provided (optional)
- Slot 6 (Apple Watch 45mm): ❌ Not provided (optional)
- Slot 7 (Apple Watch 41mm): ❌ Not provided (optional)

## How to Create Screenshots

### Method 1: Using iOS Simulator (Recommended)

1. Build and run your app:
   ```bash
   npm run ios:run
   ```

2. Take screenshots in the simulator:
   - Press `Cmd + S` to save a screenshot (saves to Desktop)
   - Or use the simulator menu: Device → Screenshot

3. Verify screenshot dimensions:
   ```bash
   file screenshot.png
   ```

4. Rename and move to this directory:
   ```bash
   mv ~/Desktop/screenshot.png ios/App/fastlane/metadata/en-US/screenshots/1_1.png
   ```

### Method 2: Using Physical Device

1. Run the app on a physical iPhone
2. Take screenshots using the device (Volume Up + Side Button)
3. AirDrop or transfer screenshots to your computer
4. Rename and place in this directory

## Best Practices

1. **Show Key Features**: Highlight the most important features of your app
2. **Use Actual Content**: Show real data and functionality, not just empty screens
3. **Maintain Consistency**: Use consistent styling and formatting across all screenshots
4. **Follow Guidelines**: Review Apple's [App Store Screenshot Guidelines](https://developer.apple.com/app-store/product-page/)
5. **Localize**: For multi-language support, create separate screenshot directories for each locale (e.g., `../es-ES/screenshots/`)

## App Preview Videos (Optional)

You can also add preview videos to showcase your app in action.

### Video Requirements

- **Format**: .mov, .m4v, or .mp4
- **Codec**: H.264 or ProRes 422 HQ
- **Duration**: 15-30 seconds
- **Max File Size**: 500 MB per video
- **Limit**: Up to 3 videos per device size

### Video Dimensions

| Device | Resolution (Portrait) |
|--------|----------------------|
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1284 x 2778 |
| iPhone 6.1" | 1179 x 2556 |
| iPad (all sizes) | 1200 x 1600 |
| Apple Watch | 312 x 390 |

### Video File Naming

Use the same slot-based naming as screenshots, but with video extensions:

```
{slot}_{number}.mov

Examples:
1_1.mov  (iPhone 6.7" - video 1)
1_2.mov  (iPhone 6.7" - video 2)
4_1.mov  (iPad 12.9" - video 1)
```

**Note:** Videos and screenshots share the same directory. Fastlane automatically detects and uploads both.

### How to Create App Preview Videos

1. **Record Gameplay:**
   - Use iOS Simulator: `xcrun simctl io booted recordVideo --type=h264 video.mov`
   - Or use screen recording on physical device

2. **Edit Video:**
   - Trim to 15-30 seconds
   - Export with H.264 codec
   - Ensure correct dimensions

3. **Add to Repository:**
   ```bash
   cp video.mov ios/App/fastlane/metadata/en-US/screenshots/1_1.mov
   ```

4. **Commit and Deploy**

## Deployment

Screenshots and videos in this directory are automatically uploaded to App Store Connect when running:

```bash
fastlane release
```

The upload is controlled by the `skip_screenshots` parameter in the Fastfile (currently set to `false` to enable upload).

## Additional Resources

- [iOS Development Guide](../../../../../docs/iOS_DEVELOPMENT.md)
- [Apple Connect Metadata Automation](../../../../../docs/APPLE_CONNECT_METADATA.md)
- [Apple's App Store Screenshot Guidelines](https://developer.apple.com/app-store/product-page/)
- [Apple's App Preview Specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications)
- [Fastlane Screenshots Documentation](https://docs.fastlane.tools/getting-started/ios/screenshots/)
