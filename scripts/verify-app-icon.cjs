#!/usr/bin/env node

/**
 * Verification Script for App Icon Configuration
 * 
 * This script verifies that the app icon is properly configured for iOS App Store upload.
 * It checks:
 * - Icon file exists and is accessible
 * - Icon is PNG format (by file extension and configuration)
 * - Contents.json is properly formatted
 * - app.config.json has required fields
 * - Fastfile includes icon upload configuration
 * 
 * Note: This script does not verify the actual pixel dimensions of the icon image
 * (e.g., 1024x1024). Ensure the source icon meets Apple's size requirements.
 */

// Import required modules with error handling
let fs, path;
try {
  fs = require('fs');
  path = require('path');
} catch (error) {
  console.error('ERROR: Failed to load required Node.js modules. Ensure you are running this with Node.js.');
  process.exit(1);
}

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Paths
const rootDir = path.resolve(__dirname, '..');
const iconDir = path.join(rootDir, 'ios/App/App/Assets.xcassets/AppIcon.appiconset');
const contentsJsonPath = path.join(iconDir, 'Contents.json');
const appConfigPath = path.join(rootDir, 'app.config.json');
const fastfilePath = path.join(rootDir, 'ios/App/fastlane/Fastfile');

let errors = 0;
let warnings = 0;

function error(message) {
  console.error(`${colors.red}✗ ERROR:${colors.reset} ${message}`);
  errors++;
}

function warning(message) {
  console.warn(`${colors.yellow}⚠ WARNING:${colors.reset} ${message}`);
  warnings++;
}

function success(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function info(message) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${message}`);
}

function checkFileExists(filePath, description, expectedType = null) {
  if (!fs.existsSync(filePath)) {
    error(`${description} not found at: ${filePath}`);
    return false;
  }
  
  // Check type if specified
  if (expectedType) {
    try {
      const stats = fs.statSync(filePath);
      if (expectedType === 'file' && !stats.isFile()) {
        error(`${description} exists but is not a file: ${filePath}`);
        return false;
      }
      if (expectedType === 'directory' && !stats.isDirectory()) {
        error(`${description} exists but is not a directory: ${filePath}`);
        return false;
      }
    } catch (err) {
      error(`Failed to access ${description} at: ${filePath} (${err.message})`);
      return false;
    }
  }
  
  success(`${description} exists`);
  return true;
}

function parseContentsJson() {
  if (!checkFileExists(contentsJsonPath, 'Contents.json', 'file')) {
    return null;
  }
  
  try {
    const contentsData = fs.readFileSync(contentsJsonPath, 'utf8');
    return JSON.parse(contentsData);
  } catch (err) {
    error(`Failed to read or parse Contents.json: ${err.message}`);
    return null;
  }
}

function checkIconFile(contentsJson) {
  console.log(`\n${colors.blue}=== Checking App Icon File ===${colors.reset}`);
  
  // Check if icon directory exists
  if (!checkFileExists(iconDir, 'App icon directory', 'directory')) {
    return;
  }
  
  if (!contentsJson) {
    // Error already reported by parseContentsJson
    // Skip icon file check to avoid double-counting errors
    return;
  }
  
  // Find the universal iOS icon entry
  const universalIcon = contentsJson.images?.find(
    img => img.idiom === 'universal' && img.platform === 'ios' && img.size === '1024x1024'
  );
  
  if (!universalIcon) {
    error('No universal iOS icon (1024x1024) found in Contents.json');
    return;
  }
  
  if (!universalIcon.filename) {
    error('Icon entry in Contents.json has no filename');
    return;
  }
  
  success(`Icon filename in Contents.json: ${universalIcon.filename}`);
  
  // Check if icon file exists
  const iconPath = path.join(iconDir, universalIcon.filename);
  if (!checkFileExists(iconPath, 'App icon file', 'file')) {
    return;
  }
  
  // Check file size
  const stats = fs.statSync(iconPath);
  if (stats.size === 0) {
    error('App icon file is empty (0 bytes)');
    return;
  }
  
  const sizeKB = (stats.size / 1024).toFixed(2);
  success(`Icon file size: ${sizeKB} KB`);
  
  // Check if it's a PNG file by reading the magic bytes
  const buffer = Buffer.alloc(8);
  let fd;
  try {
    fd = fs.openSync(iconPath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
  } catch (err) {
    error(`Failed to read icon file for validation: ${err.message}`);
    return;
  } finally {
    if (fd !== undefined) {
      fs.closeSync(fd);
    }
  }
  
  // PNG magic bytes: 137 80 78 71 13 10 26 10
  const isPNG =
    buffer[0] === 137 &&
    buffer[1] === 80 &&
    buffer[2] === 78 &&
    buffer[3] === 71 &&
    buffer[4] === 13 &&
    buffer[5] === 10 &&
    buffer[6] === 26 &&
    buffer[7] === 10;
  
  if (!isPNG) {
    error('App icon is not a valid PNG file');
    return;
  }
  
  success('Icon is a valid PNG file');
  
  // Note: We can't easily check dimensions without external tools like ImageMagick
  // But we can provide a warning
  info('Note: This script cannot verify icon dimensions. Ensure it is 1024x1024 pixels.');
  info(`      You can verify with: file ${iconPath}`);
}

function checkContentsJson(contentsJson) {
  console.log(`\n${colors.blue}=== Checking Contents.json ===${colors.reset}`);
  
  if (!contentsJson) {
    // Error already reported by parseContentsJson
    return;
  }
  
  // Validate structure
  if (!contentsJson.images || !Array.isArray(contentsJson.images)) {
    error('Contents.json must have an "images" array');
    return;
  }
  
  if (contentsJson.images.length === 0) {
    error('Contents.json images array is empty');
    return;
  }
  
  success(`Contents.json has ${contentsJson.images.length} image(s)`);
  
  // Check for universal iOS icon
  const universalIcon = contentsJson.images.find(
    img => img.idiom === 'universal' && img.platform === 'ios' && img.size === '1024x1024'
  );
  
  if (!universalIcon) {
    error('Contents.json must have a universal iOS icon with size 1024x1024');
    return;
  }
  
  success('Contents.json has universal iOS icon entry (1024x1024)');
  
  // Validate icon entry fields
  if (!universalIcon.filename) {
    error('Icon entry must have a "filename" field');
    return;
  }
  
  if (universalIcon.idiom !== 'universal') {
    warning('Icon idiom should be "universal" for modern iOS apps');
  }
  
  if (universalIcon.platform !== 'ios') {
    warning('Icon platform should be "ios"');
  }
  
  success('Contents.json is properly formatted');
}

function checkAppConfig() {
  console.log(`\n${colors.blue}=== Checking app.config.json ===${colors.reset}`);
  
  if (!checkFileExists(appConfigPath, 'app.config.json', 'file')) {
    return;
  }
  
  let appConfig;
  try {
    const appConfigData = fs.readFileSync(appConfigPath, 'utf8');
    appConfig = JSON.parse(appConfigData);
  } catch (err) {
    error(`Failed to read or parse app.config.json: ${err.message}`);
    return;
  }
  
  // Check fields required by this script (not the full app.config.json schema)
  const requiredFields = ['companyName', 'appName', 'appId'];
  const missingFields = requiredFields.filter(field => !appConfig[field]);
  
  if (missingFields.length > 0) {
    error(`app.config.json is missing fields required for this script: ${missingFields.join(', ')}`);
    return;
  }
  
  success('app.config.json includes required fields for this script (companyName, appName, appId)');
  
  // Display values
  info(`Company Name: ${appConfig.companyName}`);
  info(`App Name: ${appConfig.appName}`);
  info(`App ID: ${appConfig.appId}`);
  
  // Validate appId format (reverse domain notation)
  const appIdPattern = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/;
  if (!appIdPattern.test(appConfig.appId)) {
    error(`Invalid appId format: "${appConfig.appId}". Must use reverse domain notation (e.g., com.company.app)`);
    return;
  }
  
  success('App ID format is valid');
  
  // Check for placeholder values
  if (appConfig.companyName === 'Your Company') {
    warning('companyName is set to placeholder value "Your Company". Update this before deployment.');
  }
  
  if (appConfig.appId === 'com.enterprise.support') {
    warning('appId is set to default value "com.enterprise.support". Update this before deployment.');
  }
}

function checkFastfile() {
  console.log(`\n${colors.blue}=== Checking Fastfile Configuration ===${colors.reset}`);
  
  if (!checkFileExists(fastfilePath, 'Fastfile', 'file')) {
    return;
  }
  
  let fastfileContent;
  try {
    fastfileContent = fs.readFileSync(fastfilePath, 'utf8');
  } catch (err) {
    error(`Failed to read Fastfile: ${err.message}`);
    return;
  }
  
  // Check for upload_to_app_store action
  if (!fastfileContent.includes('upload_to_app_store')) {
    error('Fastfile does not include upload_to_app_store action');
    return;
  }
  
  success('Fastfile includes upload_to_app_store action');
  
  // Check for metadata_path setting
  const metadataPathMatch = fastfileContent.match(/metadata_path:\s*["']([^"']+)["']/);
  if (metadataPathMatch) {
    const metadataPath = metadataPathMatch[1];
    success(`metadata_path is set to: "${metadataPath}"`);
    info('       All App Store metadata should be managed in the metadata folder');
  } else {
    info('metadata_path not explicitly set (uses default metadata folder)');
  }
  
  // Check for skip_metadata setting
  const skipMetadataMatch = fastfileContent.match(/skip_metadata:\s*(true|false)/);
  if (skipMetadataMatch) {
    const skipMetadata = skipMetadataMatch[1] === 'true';
    if (skipMetadata) {
      warning('skip_metadata is set to true. App Store Connect metadata (description, keywords, etc.) will not be uploaded by Fastlane.');
      info('       Note: This does not affect the App Store icon, which is taken from the built IPA, not Fastlane metadata.');
    } else {
      success('skip_metadata is set to false (App Store Connect metadata will be uploaded by Fastlane)');
      info('       Metadata is managed in ios/App/fastlane/metadata/ folder');
    }
  } else {
    info('skip_metadata setting not found (defaults to false, which is correct)');
  }
  
  // Check for skip_screenshots setting
  const skipScreenshotsMatch = fastfileContent.match(/skip_screenshots:\s*(true|false)/);
  if (skipScreenshotsMatch) {
    const skipScreenshots = skipScreenshotsMatch[1] === 'true';
    if (skipScreenshots) {
      info('skip_screenshots is set to true (screenshots will not be uploaded)');
    } else {
      info('skip_screenshots is set to false (screenshots will be uploaded)');
      info('       Screenshots should be placed in ios/App/fastlane/metadata/en-US/screenshots/');
    }
  }
}

function printSummary() {
  console.log(`\n${colors.blue}=== Summary ===${colors.reset}`);
  
  if (errors === 0 && warnings === 0) {
    console.log(`${colors.green}✓ All checks passed!${colors.reset}`);
    console.log('Your app icon is properly configured for App Store upload.');
  } else {
    if (errors > 0) {
      console.log(`${colors.red}✗ Found ${errors} error(s)${colors.reset}`);
    }
    if (warnings > 0) {
      console.log(`${colors.yellow}⚠ Found ${warnings} warning(s)${colors.reset}`);
    }
    
    if (errors > 0) {
      console.log('\nPlease fix the errors above before deploying to the App Store.');
    }
    if (warnings > 0) {
      console.log('\nWarnings indicate potential issues that should be addressed.');
    }
  }
  
  console.log('\nFor more information, see docs/APP_ICON_SETUP.md');
}

// Run all checks
console.log(`${colors.cyan}App Icon Configuration Verification${colors.reset}`);
console.log('====================================\n');

// Parse Contents.json once and reuse it across checks
const contentsJson = parseContentsJson();

checkIconFile(contentsJson);
checkContentsJson(contentsJson);
checkAppConfig();
checkFastfile();
printSummary();

// Exit with error code if there were errors
process.exit(errors > 0 ? 1 : 0);
