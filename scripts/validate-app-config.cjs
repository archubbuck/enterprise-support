#!/usr/bin/env node

/**
 * App Configuration Validation Script
 * 
 * This script validates APP_CONFIG_* environment variables to ensure
 * all required fields are present and properly formatted.
 * 
 * Usage:
 *   npm run validate:app-config
 *   node scripts/validate-app-config.cjs
 */

const path = require('path');
const { config: loadEnv } = require('dotenv');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Common timezone abbreviations pattern
 * Matches 2-4 uppercase letters (most timezone abbreviations) or 24/7
 * Also matches UTC offset formats like UTC+9 or GMT-5
 */
const TIMEZONE_PATTERN = /([A-Z]{2,4}|24\/7|UTC[+-]\d{1,2}|GMT[+-]\d{1,2})/;

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validate domain format
 */
function isValidDomain(domain) {
  const domainPattern = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/;
  return domainPattern.test(domain.toLowerCase());
}

/**
 * Validate app ID format (reverse domain notation)
 */
function isValidAppId(appId) {
  const appIdPattern = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/;
  return appIdPattern.test(appId);
}

/**
 * Validate phone number format
 */
function isValidPhone(phone) {
  const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
  const phonePattern = /^[+]?[0-9\s\(\)\-\.]+$/;
  const digitCount = trimmedPhone.replace(/[^0-9]/g, '').length;
  return phonePattern.test(trimmedPhone) && digitCount >= 10;
}

/**
 * Validate company configuration
 */
function validateConfig(config, filePath) {
  const errors = [];
  const warnings = [];
  
  // Check required fields (including $version and features)
  const requiredFields = ['$version', 'companyName', 'appName', 'appId', 'domain', 'contacts', 'features'];
  requiredFields.forEach(field => {
    if (!config[field]) {
      errors.push(`Missing required field: "${field}"`);
    }
  });
  
  // Validate $version
  if (config.$version) {
    const versionPattern = /^[0-9]+\.[0-9]+$/;
    if (typeof config.$version !== 'string') {
      errors.push('$version must be a string');
    } else if (!versionPattern.test(config.$version)) {
      errors.push(`$version "${config.$version}" must be in semantic versioning format (e.g., 1.0)`);
    }
  }
  
  // Validate companyName
  if (config.companyName) {
    if (typeof config.companyName !== 'string') {
      errors.push('companyName must be a string');
    } else if (config.companyName.length === 0) {
      errors.push('companyName cannot be empty');
    } else if (config.companyName.length > 100) {
      warnings.push('companyName is very long (>100 chars), consider shortening for better display');
    }
  }
  
  // Validate appName
  if (config.appName) {
    if (typeof config.appName !== 'string') {
      errors.push('appName must be a string');
    } else if (config.appName.length === 0) {
      errors.push('appName cannot be empty');
    } else if (config.appName.length > 50) {
      warnings.push('appName is long (>50 chars), may be truncated in some displays');
    }
  }
  
  // Validate appId
  if (config.appId) {
    if (typeof config.appId !== 'string') {
      errors.push('appId must be a string');
    } else if (!isValidAppId(config.appId)) {
      errors.push(
        `appId "${config.appId}" is not in valid reverse domain notation format (e.g., com.company.app). ` +
        'Must use lowercase letters, numbers, hyphens, and dots only.'
      );
    }
  }
  
  // Validate domain
  if (config.domain) {
    if (typeof config.domain !== 'string') {
      errors.push('domain must be a string');
    } else if (!isValidDomain(config.domain)) {
      errors.push(`domain "${config.domain}" is not a valid domain name`);
    } else if (config.domain.includes('@')) {
      errors.push('domain should not include @ symbol');
    }
  }
  
  // Validate optional fields
  if (config.appSubtitle && config.appSubtitle.length > 100) {
    warnings.push('appSubtitle is very long (>100 chars)');
  }
  
  if (config.vpnPortal && typeof config.vpnPortal !== 'string') {
    errors.push('vpnPortal must be a string');
  }
  
  // Validate contacts
  if (config.contacts) {
    if (typeof config.contacts !== 'object') {
      errors.push('contacts must be an object');
    } else {
      // Required email
      if (!config.contacts.email) {
        errors.push('contacts.email is required');
      } else if (!isValidEmail(config.contacts.email)) {
        errors.push(`contacts.email "${config.contacts.email}" is not a valid email address`);
      }
      
      // Optional emergency email
      if (config.contacts.emergencyEmail && !isValidEmail(config.contacts.emergencyEmail)) {
        errors.push(`contacts.emergencyEmail "${config.contacts.emergencyEmail}" is not a valid email address`);
      }
      
      // Validate regions array
      if (config.contacts.regions !== undefined) {
        if (!Array.isArray(config.contacts.regions)) {
          errors.push('contacts.regions must be an array');
        } else {
          config.contacts.regions.forEach((region, index) => {
            const regionPath = `contacts.regions[${index}]`;
            
            // Check required region fields
            const requiredRegionFields = ['region', 'city', 'phone', 'hours'];
            requiredRegionFields.forEach(field => {
              if (!region[field]) {
                errors.push(`${regionPath}.${field} is required`);
              } else if (typeof region[field] !== 'string') {
                errors.push(`${regionPath}.${field} must be a string`);
              }
            });
            
            // Validate phone format
            if (region.phone && !isValidPhone(region.phone)) {
              errors.push(
                `${regionPath}.phone "${region.phone}" appears invalid. ` +
                'Use format: +[country] ([area]) [number]'
              );
            }
            
            // Check for proper phone formatting
            if (region.phone && !region.phone.startsWith('+')) {
              warnings.push(
                `${regionPath}.phone should include country code (start with +)`
              );
            }
            
            // Check if hours includes timezone or 24/7
            // Pattern matches common timezone abbreviations (2-4 uppercase letters) or UTC/GMT offsets
            if (region.hours && !TIMEZONE_PATTERN.test(region.hours)) {
              warnings.push(
                `${regionPath}.hours "${region.hours}" should include timezone (e.g., EST, GMT, JST, UTC+9) or specify 24/7`
              );
            }
          });
        }
      }
    }
  }
  
  // Validate features
  if (config.features) {
    if (typeof config.features !== 'object') {
      errors.push('features must be an object');
    } else {
      const requiredFeatures = ['tagFiltering', 'pdfDocuments', 'wordDocuments', 'imageDocuments'];
      requiredFeatures.forEach(feature => {
        if (typeof config.features[feature] !== 'boolean') {
          errors.push(`features.${feature} must be a boolean`);
        }
      });
    }
  }
  
  return { errors, warnings };
}

function parseBooleanEnv(value, key) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`${key} must be true or false`);
}

function parseRegionsEnv(value) {
  if (!value || value.trim() === '') {
    return [];
  }

  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error('APP_CONFIG_CONTACTS_REGIONS_JSON must be a JSON array');
  }

  return parsed;
}

function requireEnvValue(value, key) {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function loadEnvFiles(mode) {
  loadEnv({ path: path.join(process.cwd(), '.env.example'), quiet: true });
  loadEnv({ path: path.join(process.cwd(), '.env'), quiet: true });
  loadEnv({ path: path.join(process.cwd(), '.env.local'), override: true, quiet: true });
  loadEnv({ path: path.join(process.cwd(), `.env.${mode}`), override: true, quiet: true });
  loadEnv({ path: path.join(process.cwd(), `.env.${mode}.local`), override: true, quiet: true });
}

function loadAppConfigFromEnv(mode = process.env.NODE_ENV || 'development') {
  loadEnvFiles(mode);

  const config = {
    $version: requireEnvValue(process.env.APP_CONFIG_VERSION, 'APP_CONFIG_VERSION'),
    companyName: requireEnvValue(process.env.APP_CONFIG_COMPANY_NAME, 'APP_CONFIG_COMPANY_NAME'),
    appName: requireEnvValue(process.env.APP_CONFIG_APP_NAME, 'APP_CONFIG_APP_NAME'),
    appId: requireEnvValue(process.env.APP_CONFIG_APP_ID, 'APP_CONFIG_APP_ID'),
    domain: requireEnvValue(process.env.APP_CONFIG_DOMAIN, 'APP_CONFIG_DOMAIN'),
    contacts: {
      email: requireEnvValue(process.env.APP_CONFIG_CONTACTS_EMAIL, 'APP_CONFIG_CONTACTS_EMAIL'),
      regions: parseRegionsEnv(process.env.APP_CONFIG_CONTACTS_REGIONS_JSON),
    },
    features: {
      tagFiltering: parseBooleanEnv(process.env.APP_CONFIG_FEATURES_TAG_FILTERING, 'APP_CONFIG_FEATURES_TAG_FILTERING'),
      pdfDocuments: parseBooleanEnv(process.env.APP_CONFIG_FEATURES_PDF_DOCUMENTS, 'APP_CONFIG_FEATURES_PDF_DOCUMENTS'),
      wordDocuments: parseBooleanEnv(process.env.APP_CONFIG_FEATURES_WORD_DOCUMENTS, 'APP_CONFIG_FEATURES_WORD_DOCUMENTS'),
      imageDocuments: parseBooleanEnv(process.env.APP_CONFIG_FEATURES_IMAGE_DOCUMENTS, 'APP_CONFIG_FEATURES_IMAGE_DOCUMENTS'),
    },
  };

  if (process.env.APP_CONFIG_APP_SUBTITLE && process.env.APP_CONFIG_APP_SUBTITLE.trim() !== '') {
    config.appSubtitle = process.env.APP_CONFIG_APP_SUBTITLE;
  }

  if (process.env.APP_CONFIG_VPN_PORTAL && process.env.APP_CONFIG_VPN_PORTAL.trim() !== '') {
    config.vpnPortal = process.env.APP_CONFIG_VPN_PORTAL;
  }

  if (process.env.APP_CONFIG_CONTACTS_EMERGENCY_EMAIL && process.env.APP_CONFIG_CONTACTS_EMERGENCY_EMAIL.trim() !== '') {
    config.contacts.emergencyEmail = process.env.APP_CONFIG_CONTACTS_EMERGENCY_EMAIL;
  }

  return config;
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     App Config Validation Report         ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`);
  
  const mode = process.env.NODE_ENV || 'development';
  
  // Load and parse config from environment variables
  let config;
  try {
    config = loadAppConfigFromEnv(mode);
  } catch (error) {
    console.log(`${colors.red}✗ Error loading APP_CONFIG_* environment variables:${colors.reset}`);
    console.log(`  ${error.message}\n`);
    process.exit(1);
  }
  
  console.log(`${colors.blue}Validating:${colors.reset} APP_CONFIG_* (mode: ${mode})\n`);
  
  // Validate configuration
  const { errors, warnings } = validateConfig(config, 'environment variables');
  
  // Display results
  if (errors.length === 0 && warnings.length === 0) {
    console.log(`${colors.green}✓ Configuration is valid!${colors.reset}\n`);
    
    // Display summary
    console.log(`${colors.blue}Configuration Summary:${colors.reset}`);
    console.log(`  Company:     ${config.companyName}`);
    console.log(`  App Name:    ${config.appName}`);
    console.log(`  App ID:      ${config.appId}`);
    console.log(`  Domain:      ${config.domain}`);
    console.log(`  IT Email:    ${config.contacts.email}`);
    if (config.contacts.emergencyEmail) {
      console.log(`  Emergency:   ${config.contacts.emergencyEmail}`);
    }
    if (config.contacts.regions && config.contacts.regions.length > 0) {
      console.log(`  Regions:     ${config.contacts.regions.length} office(s)`);
    }
    console.log();
    
  } else {
    // Display errors
    if (errors.length > 0) {
      console.log(`${colors.red}✗ Found ${errors.length} error(s):${colors.reset}\n`);
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${colors.red}${error}${colors.reset}`);
      });
      console.log();
    }
    
    // Display warnings
    if (warnings.length > 0) {
      console.log(`${colors.yellow}⚠ Found ${warnings.length} warning(s):${colors.reset}\n`);
      warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${colors.yellow}${warning}${colors.reset}`);
      });
      console.log();
    }
    
    // Help section
    if (errors.length > 0) {
      console.log(`${colors.cyan}How to fix:${colors.reset}`);
      console.log(`  1. Open your .env file in the project root`);
      console.log(`  2. Fix the APP_CONFIG_* values listed above`);
      console.log(`  3. Run this validation again: npm run validate:app-config`);
      console.log(`  4. See docs/CONFIGURATION.md for detailed guidance`);
      console.log(`  5. Use .env.example as the reference template\n`);
      
      process.exit(1);
    } else if (warnings.length > 0) {
      console.log(`${colors.cyan}Note:${colors.reset} Warnings are suggestions for improvement but won't prevent the app from working.\n`);
    }
  }
  
  console.log(`${colors.green}✓ Validation complete!${colors.reset}\n`);
  process.exit(0);
}

module.exports = {
  validateConfig,
  loadAppConfigFromEnv,
  colors,
};

// Run the script
if (require.main === module) {
  main();
}
