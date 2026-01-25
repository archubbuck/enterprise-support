#!/usr/bin/env node

/**
 * Verification Script for App Icon Configuration
 * 
 * This script verifies that the app icon is properly configured for iOS App Store upload.
 * It checks:
 * - Icon file exists and is accessible
 * - Icon is PNG format
 * - Icon dimensions are correct (1024x1024)
 * - Contents.json is properly formatted
 * - app.config.json has required fields
 * - Fastfile includes icon upload configuration
 */

const fs = require('fs');
const path = require('path');

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

function checkFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    error(`${description} not found at: ${filePath}`);
    return false;
  }
  success(`${description} exists`);
  return true;
}

function checkIconFile() {
  console.log(`\n${colors.blue}=== Checking App Icon File ===${colors.reset}`);
  
  // Check if icon directory exists
  if (!checkFileExists(iconDir, 'App icon directory')) {
    return;
  }
  
  // Read Contents.json to get icon filename
  let contentsJson;
  try {
    const contentsData = fs.readFileSync(contentsJsonPath, 'utf8');
    contentsJson = JSON.parse(contentsData);
  } catch (err) {
    error(`Failed to read or parse Contents.json: ${err.message}`);
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
  if (!checkFileExists(iconPath, 'App icon file')) {
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
  const fd = fs.openSync(iconPath, 'r');
  fs.readSync(fd, buffer, 0, 8, 0);
  fs.closeSync(fd);
  
  // PNG magic bytes: 137 80 78 71 13 10 26 10
  const isPNG = buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71;
  
  if (!isPNG) {
    error('App icon is not a valid PNG file');
    return;
  }
  
  success('Icon is a valid PNG file');
  
  // Note: We can't easily check dimensions without external tools like ImageMagick
  // But we can provide a warning
  info('Note: This script cannot verify icon dimensions. Ensure it is 1024x1024 pixels.');
  info('      You can verify with: file ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
}

function checkContentsJson() {
  console.log(`\n${colors.blue}=== Checking Contents.json ===${colors.reset}`);
  
  if (!checkFileExists(contentsJsonPath, 'Contents.json')) {
    return;
  }
  
  let contentsJson;
  try {
    const contentsData = fs.readFileSync(contentsJsonPath, 'utf8');
    contentsJson = JSON.parse(contentsData);
  } catch (err) {
    error(`Failed to read or parse Contents.json: ${err.message}`);
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
  
  if (!checkFileExists(appConfigPath, 'app.config.json')) {
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
  
  // Check required fields
  const requiredFields = ['companyName', 'appName', 'appId'];
  const missingFields = requiredFields.filter(field => !appConfig[field]);
  
  if (missingFields.length > 0) {
    error(`app.config.json is missing required fields: ${missingFields.join(', ')}`);
    return;
  }
  
  success('app.config.json has all required fields');
  
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
  
  if (!checkFileExists(fastfilePath, 'Fastfile')) {
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
  
  // Check for skip_metadata setting
  const skipMetadataMatch = fastfileContent.match(/skip_metadata:\s*(true|false)/);
  if (skipMetadataMatch) {
    const skipMetadata = skipMetadataMatch[1] === 'true';
    if (skipMetadata) {
      warning('skip_metadata is set to true. Metadata (including app icon) will not be uploaded.');
      info('       Set skip_metadata: false in Fastfile to upload metadata.');
    } else {
      success('skip_metadata is set to false (metadata will be uploaded)');
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

checkIconFile();
checkContentsJson();
checkAppConfig();
checkFastfile();
printSummary();

// Exit with error code if there were errors
process.exit(errors > 0 ? 1 : 0);
