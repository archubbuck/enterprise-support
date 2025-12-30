#!/usr/bin/env node

/**
 * Company Configuration Validation Script
 * 
 * This script validates company.config.json against the JSON schema to ensure
 * all required fields are present and properly formatted.
 * 
 * Usage:
 *   npm run validate:company-config
 *   node scripts/validate-company-config.cjs
 */

const fs = require('fs');
const path = require('path');

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
  const domainPattern = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  return domainPattern.test(domain);
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
  const phonePattern = /^[+]?[0-9\s\(\)\-\.]+$/;
  const digitCount = phone.replace(/[^0-9]/g, '').length;
  return phonePattern.test(phone) && digitCount >= 10;
}

/**
 * Validate company configuration
 */
function validateConfig(config, filePath) {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  const requiredFields = ['companyName', 'appName', 'appId', 'domain', 'contacts'];
  requiredFields.forEach(field => {
    if (!config[field]) {
      errors.push(`Missing required field: "${field}"`);
    }
  });
  
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
            // Use a flexible pattern that catches most common timezone formats
            if (region.hours && !/((GMT|UTC|EST|EDT|PST|PDT|CST|CDT|MST|MDT|BST|CET|CEST|JST|KST|SGT|HKT|AEST|AEDT|IST|AST|NST)|24\/7|\+\d{1,2}:\d{2}|\-\d{1,2}:\d{2})/i.test(region.hours)) {
              warnings.push(
                `${regionPath}.hours "${region.hours}" should include timezone (e.g., EST, GMT, JST, UTC+9) or specify 24/7`
              );
            }
          });
        }
      }
    }
  }
  
  return { errors, warnings };
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║   Company Config Validation Report       ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`);
  
  const configPath = path.join(process.cwd(), 'company.config.json');
  const schemaPath = path.join(process.cwd(), 'company.config.schema.json');
  
  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    console.log(`${colors.red}✗ Error: company.config.json not found${colors.reset}`);
    console.log(`  Expected at: ${configPath}\n`);
    process.exit(1);
  }
  
  // Check if schema file exists
  if (!fs.existsSync(schemaPath)) {
    console.log(`${colors.yellow}⚠ Warning: company.config.schema.json not found${colors.reset}`);
    console.log(`  Expected at: ${schemaPath}`);
    console.log(`  Validation will be limited to basic checks.\n`);
  }
  
  // Load and parse config
  let config;
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configContent);
  } catch (error) {
    console.log(`${colors.red}✗ Error parsing company.config.json:${colors.reset}`);
    console.log(`  ${error.message}\n`);
    process.exit(1);
  }
  
  console.log(`${colors.blue}Validating:${colors.reset} ${configPath}\n`);
  
  // Validate configuration
  const { errors, warnings } = validateConfig(config, configPath);
  
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
      console.log(`  1. Open company.config.json in your editor`);
      console.log(`  2. Fix the errors listed above`);
      console.log(`  3. Run this validation again: npm run validate:company-config`);
      console.log(`  4. See docs/CONFIGURATION.md for detailed guidance`);
      console.log(`  5. Check examples/ directory for sample configurations\n`);
      
      process.exit(1);
    } else if (warnings.length > 0) {
      console.log(`${colors.cyan}Note:${colors.reset} Warnings are suggestions for improvement but won't prevent the app from working.\n`);
    }
  }
  
  console.log(`${colors.green}✓ Validation complete!${colors.reset}\n`);
  process.exit(0);
}

// Run the script
main();
