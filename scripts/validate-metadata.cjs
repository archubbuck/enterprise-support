#!/usr/bin/env node

/**
 * Metadata Folder Validation Script
 * 
 * This script validates that the Fastlane metadata folder structure is properly configured
 * for App Store Connect metadata uploads. It checks:
 * - Required metadata files exist
 * - Character limits are respected
 * - Screenshots directory exists and contains properly named files
 * - Metadata folder structure follows Fastlane conventions
 * - Required non-localized metadata files are present
 * 
 * Usage:
 *   node scripts/validate-metadata.cjs
 *   npm run validate:metadata
 * 
 * Exit codes:
 *   0 - All validations passed
 *   1 - Validation errors found
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
const metadataDir = path.join(rootDir, 'ios/App/fastlane/metadata');
const enUSDir = path.join(metadataDir, 'en-US');
const screenshotsDir = path.join(enUSDir, 'screenshots');

// Character limits for metadata fields (per Apple's requirements)
const LIMITS = {
  name: 30,
  subtitle: 30,
  promotional_text: 170,
  description: 4000,
  keywords: 100,
  release_notes: 4000,
  marketing_url: 2048,
  support_url: 2048,
  privacy_url: 2048,
};

// Required non-localized metadata files
const REQUIRED_NON_LOCALIZED = [
  'primary_category.txt',
  'copyright.txt',
];

// Required localized metadata files for en-US
const REQUIRED_LOCALIZED = [
  'description.txt',
  'keywords.txt',
  'support_url.txt',
  'privacy_url.txt',
  'name.txt',
];

// Optional but recommended localized files
const RECOMMENDED_LOCALIZED = [
  'subtitle.txt',
  'promotional_text.txt',
  'marketing_url.txt',
  'release_notes.txt',
];

// Valid Apple App Store categories (all caps, as required by Apple)
const VALID_CATEGORIES = [
  'BUSINESS',
  'PRODUCTIVITY',
  'UTILITIES',
  'EDUCATION',
  'FINANCE',
  'HEALTH_AND_FITNESS',
  'LIFESTYLE',
  'MEDICAL',
  'REFERENCE',
  'SHOPPING',
  'SOCIAL_NETWORKING',
  'SPORTS',
  'TRAVEL',
  'ENTERTAINMENT',
  'FOOD_AND_DRINK',
  'NEWS',
  'PHOTO_AND_VIDEO',
  'BOOKS',
  'WEATHER',
  'NAVIGATION',
  'MUSIC',
  'GAMES',
  'CATALOGS',
  'MAGAZINES',
  'DEVELOPER_TOOLS',
  'GRAPHICS_AND_DESIGN',
];

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
  
  const stats = fs.lstatSync(filePath);
  
  // Security: Reject symlinks to prevent path traversal attacks
  if (stats.isSymbolicLink()) {
    error(`${description} is a symbolic link, which is not allowed for security reasons: ${filePath}`);
    return false;
  }
  
  if (!stats.isFile()) {
    error(`${description} is not a file: ${filePath}`);
    return false;
  }
  
  // Security: Verify file is within the expected metadata directory
  const realFilePath = fs.realpathSync(filePath);
  const realMetadataDir = fs.realpathSync(metadataDir);
  if (!realFilePath.startsWith(realMetadataDir)) {
    error(`${description} is outside the metadata directory: ${filePath}`);
    return false;
  }
  
  return true;
}

function checkNonMetadataFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    error(`${description} not found at: ${filePath}`);
    return false;
  }
  
  const stats = fs.lstatSync(filePath);
  
  // Security: Reject symlinks to prevent path traversal attacks
  if (stats.isSymbolicLink()) {
    error(`${description} is a symbolic link, which is not allowed for security reasons: ${filePath}`);
    return false;
  }
  
  if (!stats.isFile()) {
    error(`${description} is not a file: ${filePath}`);
    return false;
  }
  
  return true;
}

function checkDirectoryExists(dirPath, description) {
  if (!fs.existsSync(dirPath)) {
    error(`${description} not found at: ${dirPath}`);
    return false;
  }
  
  const stats = fs.statSync(dirPath);
  if (!stats.isDirectory()) {
    error(`${description} is not a directory: ${dirPath}`);
    return false;
  }
  
  return true;
}

function validateCharacterLimit(filePath, limit, fieldName) {
  if (!checkFileExists(filePath, fieldName)) {
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8').trim();
  const length = content.length;
  
  if (length === 0) {
    warning(`${fieldName} is empty`);
    return;
  }
  
  if (length > limit) {
    error(`${fieldName} exceeds character limit: ${length}/${limit} characters`);
  } else {
    success(`${fieldName}: ${length}/${limit} characters`);
  }
}

function validateURL(filePath, fieldName) {
  if (!checkFileExists(filePath, fieldName)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8').trim();
  
  if (content.length === 0) {
    warning(`${fieldName} is empty`);
    return false;
  }
  
  // Security: Limit content length to prevent logging excessively large data
  const maxUrlLength = 2048;
  if (content.length > maxUrlLength) {
    error(`${fieldName} exceeds maximum URL length of ${maxUrlLength} characters`);
    return false;
  }
  
  // Basic URL validation with HTTPS scheme check
  try {
    const url = new URL(content);
    if (url.protocol !== 'https:') {
      // Security: Only log sanitized URL (hostname only, no path/query)
      warning(`${fieldName} should use HTTPS (currently using ${url.protocol}//${url.hostname})`);
    } else {
      success(`${fieldName} is a valid URL`);
    }
    return true;
  } catch (e) {
    // Security: Don't log the invalid URL content to prevent data leakage
    error(`${fieldName} contains an invalid URL format`);
    return false;
  }
}

function validateCategory(filePath, fieldName) {
  if (!checkFileExists(filePath, fieldName)) {
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8').trim().toUpperCase();
  
  if (content.length === 0) {
    error(`${fieldName} is empty`);
    return;
  }
  
  // Security: Validate content is a known category before logging
  if (!VALID_CATEGORIES.includes(content)) {
    // Security: Only log if it's a valid category format (alphanumeric/underscore only)
    if (/^[A-Z_]+$/.test(content) && content.length < 50) {
      error(`${fieldName} contains invalid category: ${content}`);
    } else {
      error(`${fieldName} contains invalid category format`);
    }
    info(`Valid categories: ${VALID_CATEGORIES.join(', ')}`);
  } else {
    success(`${fieldName}: ${content}`);
  }
}

function validateCopyright(filePath) {
  if (!checkFileExists(filePath, 'Copyright')) {
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8').trim();
  
  if (content.length === 0) {
    error('Copyright is empty');
    return;
  }
  
  // Security: Limit content length
  if (content.length > 200) {
    error('Copyright text is too long (max 200 characters)');
    return;
  }
  
  // Copyright should include a year (4 digits)
  const yearMatch = content.match(/\b(?:19|20)\d{2}\b/);
  if (!yearMatch) {
    warning('Copyright does not contain a recognizable year (e.g., ' + new Date().getFullYear() + ')');
  }
  
  // Copyright should include © symbol or "Copyright"
  if (!content.includes('©') && !content.toLowerCase().includes('copyright')) {
    warning('Copyright does not contain © symbol or "Copyright" text');
  }
  
  // Security: Only log if content looks like a valid copyright (contains year and reasonable chars)
  if (/^[©\w\s\d\-,\.]+$/.test(content) && yearMatch) {
    success(`Copyright: ${content}`);
  } else {
    success('Copyright format validated');
  }
}

function validateScreenshots() {
  console.log(`\n${colors.blue}=== Validating Screenshots ===${colors.reset}`);
  
  if (!checkDirectoryExists(screenshotsDir, 'Screenshots directory')) {
    return;
  }
  
  // Find all image files
  const files = fs.readdirSync(screenshotsDir);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  const videoFiles = files.filter(f => /\.(mov|m4v|mp4)$/i.test(f));
  
  if (imageFiles.length === 0 && videoFiles.length === 0) {
    warning('Screenshots directory is empty. Add at least one screenshot for App Store submission.');
    return;
  }
  
  success(`Found ${imageFiles.length} screenshot(s) and ${videoFiles.length} video(s)`);
  
  // Validate naming convention: {slot}_{number}.{ext}
  const validPattern = /^\d+_\d+\.(?:png|jpg|jpeg|mov|m4v|mp4)$/i;
  const allMediaFiles = [...imageFiles, ...videoFiles];
  
  allMediaFiles.forEach(file => {
    if (!validPattern.test(file)) {
      warning(`Screenshot/video does not follow naming convention ({slot}_{number}.ext): ${file}`);
    }
  });
  
  // List first few files for verification
  info('Sample files:');
  allMediaFiles.slice(0, 5).forEach(f => info(`  - ${f}`));
  if (allMediaFiles.length > 5) {
    info(`  ... and ${allMediaFiles.length - 5} more`);
  }
}

function validateMetadataStructure() {
  console.log(`\n${colors.blue}=== Validating Metadata Folder Structure ===${colors.reset}`);
  
  if (!checkDirectoryExists(metadataDir, 'Metadata directory')) {
    error('Metadata directory does not exist. Cannot proceed with validation.');
    return false;
  }
  
  success('Metadata directory exists');
  
  if (!checkDirectoryExists(enUSDir, 'en-US locale directory')) {
    error('en-US locale directory is required for App Store submissions.');
    return false;
  }
  
  success('en-US locale directory exists');
  
  return true;
}

function validateNonLocalizedMetadata() {
  console.log(`\n${colors.blue}=== Validating Non-Localized Metadata ===${colors.reset}`);
  
  REQUIRED_NON_LOCALIZED.forEach(file => {
    const filePath = path.join(metadataDir, file);
    
    if (file === 'primary_category.txt') {
      validateCategory(filePath, 'Primary category');
    } else if (file === 'copyright.txt') {
      validateCopyright(filePath);
    } else {
      checkFileExists(filePath, file);
    }
  });
  
  // Check optional secondary category
  const secondaryCategoryPath = path.join(metadataDir, 'secondary_category.txt');
  if (fs.existsSync(secondaryCategoryPath)) {
    validateCategory(secondaryCategoryPath, 'Secondary category (optional)');
  } else {
    info('Secondary category not provided (optional)');
  }
}

function validateLocalizedMetadata() {
  console.log(`\n${colors.blue}=== Validating Localized Metadata (en-US) ===${colors.reset}`);
  
  // Check required files
  REQUIRED_LOCALIZED.forEach(file => {
    const filePath = path.join(enUSDir, file);
    const fieldName = file.replace('.txt', '').replace(/_/g, ' ');
    
    if (file.includes('url')) {
      validateURL(filePath, fieldName);
    } else if (LIMITS[file.replace('.txt', '')]) {
      const limit = LIMITS[file.replace('.txt', '')];
      validateCharacterLimit(filePath, limit, fieldName);
    } else {
      checkFileExists(filePath, fieldName);
    }
  });
  
  // Check recommended files
  console.log(`\n${colors.cyan}Recommended (optional) files:${colors.reset}`);
  RECOMMENDED_LOCALIZED.forEach(file => {
    const filePath = path.join(enUSDir, file);
    const fieldName = file.replace('.txt', '').replace(/_/g, ' ');
    
    if (!fs.existsSync(filePath)) {
      info(`${fieldName} not provided (optional)`);
      return;
    }
    
    // Check if it's a symlink before proceeding
    const stats = fs.lstatSync(filePath);
    if (stats.isSymbolicLink()) {
      error(`${fieldName} is a symbolic link, which is not allowed for security reasons`);
      return;
    }
    
    if (file.includes('url')) {
      // Validate URL using shared helper
      validateURL(filePath, fieldName);
    } else {
      const content = fs.readFileSync(filePath, 'utf8').trim();
      
      if (content.length === 0) {
        info(`${fieldName} provided but empty`);
        return;
      }
      
      if (LIMITS[file.replace('.txt', '')]) {
        // Validate character limit
        const limit = LIMITS[file.replace('.txt', '')];
        const length = content.length;
        
        if (length > limit) {
          error(`${fieldName} exceeds character limit: ${length}/${limit} characters`);
        } else {
          success(`${fieldName}: ${length}/${limit} characters`);
        }
      } else {
        success(`${fieldName} provided`);
      }
    }
  });
}

function validateFastfileConfiguration() {
  console.log(`\n${colors.blue}=== Validating Fastfile Configuration ===${colors.reset}`);
  
  const fastfilePath = path.join(rootDir, 'ios/App/fastlane/Fastfile');
  
  if (!checkNonMetadataFileExists(fastfilePath, 'Fastfile')) {
    return;
  }
  
  const fastfileContent = fs.readFileSync(fastfilePath, 'utf8');
  
  // Check for upload_to_app_store action
  if (!fastfileContent.includes('upload_to_app_store')) {
    error('Fastfile does not include upload_to_app_store action');
    return;
  }
  
  success('Fastfile includes upload_to_app_store action');
  
  // Check metadata_path is set
  const metadataPathMatch = fastfileContent.match(/metadata_path:\s*["']([^"']+)["']/);
  if (metadataPathMatch) {
    const metadataPath = metadataPathMatch[1];
    if (metadataPath === './metadata') {
      success(`metadata_path is set correctly: "${metadataPath}"`);
    } else {
      warning(`metadata_path is set to "${metadataPath}", expected "./metadata"`);
    }
  } else {
    warning('metadata_path not explicitly set (will use default)');
  }
  
  // Check skip_metadata is false
  const skipMetadataMatch = fastfileContent.match(/skip_metadata:\s*(true|false)/);
  if (skipMetadataMatch) {
    const skipMetadata = skipMetadataMatch[1] === 'true';
    if (skipMetadata) {
      error('skip_metadata is set to true. Metadata will not be uploaded!');
    } else {
      success('skip_metadata is set to false (metadata will be uploaded)');
    }
  } else {
    info('skip_metadata not explicitly set (defaults to false, which is correct)');
  }
  
  // Check skip_screenshots is false
  const skipScreenshotsMatch = fastfileContent.match(/skip_screenshots:\s*(true|false)/);
  if (skipScreenshotsMatch) {
    const skipScreenshots = skipScreenshotsMatch[1] === 'true';
    if (skipScreenshots) {
      warning('skip_screenshots is set to true. Screenshots will not be uploaded.');
    } else {
      success('skip_screenshots is set to false (screenshots will be uploaded)');
    }
  } else {
    info('skip_screenshots not explicitly set (defaults to false, which is correct)');
  }
}

function printSummary() {
  console.log(`\n${colors.blue}=== Validation Summary ===${colors.reset}`);
  
  if (errors === 0 && warnings === 0) {
    console.log(`${colors.green}✓ All metadata validations passed!${colors.reset}`);
    console.log('Your metadata folder is properly configured for App Store submission.');
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
      console.log('\nWarnings indicate potential issues that should be addressed for best results.');
    }
  }
  
  console.log('\nFor more information, see:');
  console.log('  - docs/APPLE_CONNECT_METADATA.md');
  console.log('  - docs/iOS_DEVELOPMENT.md');
  console.log('  - https://docs.fastlane.tools/actions/upload_to_app_store/');
}

// Run all validations
console.log(`${colors.cyan}Fastlane Metadata Folder Validation${colors.reset}`);
console.log('=====================================\n');

if (validateMetadataStructure()) {
  validateNonLocalizedMetadata();
  validateLocalizedMetadata();
  validateScreenshots();
}

validateFastfileConfiguration();
printSummary();

// Exit with error code if there were errors
process.exit(errors > 0 ? 1 : 0);
