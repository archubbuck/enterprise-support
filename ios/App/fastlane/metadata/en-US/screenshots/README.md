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

| Device Size | Dimensions | Example Devices |
|-------------|------------|-----------------|
| 6.7-inch iPhone | 1290 x 2796 | iPhone 15 Pro Max, iPhone 14 Pro Max |
| 6.5-inch iPhone | 1284 x 2778 | iPhone 15 Plus, iPhone 14 Plus |
| 6.1-inch iPhone | 1179 x 2556 | iPhone 15 Pro, iPhone 15, iPhone 14 Pro |

## File Naming

Screenshots should be named sequentially:

```
1_1.png  (first screenshot for 6.7-inch)
1_2.png  (second screenshot for 6.7-inch)
1_3.png  (third screenshot for 6.7-inch)
2_1.png  (first screenshot for 6.5-inch)
2_2.png  (second screenshot for 6.5-inch)
...
```

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

## Deployment

Screenshots in this directory are automatically uploaded to App Store Connect when running:

```bash
fastlane release
```

The upload is controlled by the `skip_screenshots` parameter in the Fastfile (currently set to `false` to enable upload).

## Additional Resources

- [iOS Development Guide](../../../../../docs/iOS_DEVELOPMENT.md)
- [Apple's App Store Screenshot Guidelines](https://developer.apple.com/app-store/product-page/)
- [Fastlane Screenshots Documentation](https://docs.fastlane.tools/getting-started/ios/screenshots/)
