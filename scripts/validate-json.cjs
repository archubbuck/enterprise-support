#!/usr/bin/env node

/**
 * JSON Validation Script
 * 
 * This script validates all JSON files in the project to ensure they are
 * syntactically correct and prevent build issues caused by malformed JSON.
 * 
 * Usage:
 *   npm run validate:json
 *   node scripts/validate-json.js
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

// Directories and files to exclude from validation
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'ios/App/Pods',
  'ios/App/Build',
];

// Files that allow comments (JSONC format)
const JSONC_FILES = [
  'tsconfig.json',
  'jsconfig.json',
  '.vscode/settings.json',
  '.vscode/launch.json',
  '.vscode/tasks.json',
];

// File extensions to validate
const JSON_EXTENSIONS = ['.json'];

let totalFiles = 0;
let validFiles = 0;
let invalidFiles = 0;
const errors = [];

/**
 * Check if a path should be excluded from validation
 */
function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern));
}

/**
 * Check if a file is a JSONC file (allows comments)
 */
function isJsoncFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  return JSONC_FILES.some(pattern => relativePath.endsWith(pattern));
}

/**
 * Strip comments from JSONC content
 */
function stripJsonComments(content) {
  // Remove single-line comments
  content = content.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove trailing commas before closing brackets (JSONC allows these)
  content = content.replace(/,(\s*[}\]])/g, '$1');
  return content;
}

/**
 * Validate a single JSON file
 */
function validateJsonFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const isJsonc = isJsoncFile(filePath);
    
    // Strip comments if this is a JSONC file
    const contentForParsing = isJsonc ? stripJsonComments(content) : content;
    
    // Try to parse the JSON
    JSON.parse(contentForParsing);
    
    // Additional checks for common issues (only for non-JSONC files)
    const issues = [];
    
    // Check for BOM (Byte Order Mark)
    if (content.charCodeAt(0) === 0xFEFF) {
      issues.push('File contains BOM (Byte Order Mark)');
    }
    
    if (!isJsonc) {
      // Check for trailing commas (common JSON error)
      if (content.match(/,\s*[}\]]/)) {
        issues.push('File may contain trailing commas');
      }
      
      // Check for comments (not allowed in standard JSON)
      if (content.match(/\/\//) || content.match(/\/\*/)) {
        issues.push('File may contain comments (not allowed in JSON)');
      }
    }
    
    if (issues.length > 0) {
      console.log(`  ${colors.yellow}⚠${colors.reset}  ${path.relative(process.cwd(), filePath)}`);
      issues.forEach(issue => {
        console.log(`     ${colors.yellow}→ ${issue}${colors.reset}`);
      });
      validFiles++;
    } else {
      console.log(`  ${colors.green}✓${colors.reset}  ${path.relative(process.cwd(), filePath)}`);
      validFiles++;
    }
  } catch (error) {
    console.log(`  ${colors.red}✗${colors.reset}  ${path.relative(process.cwd(), filePath)}`);
    console.log(`     ${colors.red}→ ${error.message}${colors.reset}`);
    
    // Try to provide helpful context
    if (error instanceof SyntaxError) {
      const lines = fs.readFileSync(filePath, 'utf8').split('\n');
      const match = error.message.match(/position (\d+)/);
      
      if (match) {
        const position = parseInt(match[1]);
        let currentPos = 0;
        let lineNum = 0;
        
        for (let i = 0; i < lines.length; i++) {
          currentPos += lines[i].length + 1; // +1 for newline
          if (currentPos >= position) {
            lineNum = i + 1;
            break;
          }
        }
        
        if (lineNum > 0) {
          console.log(`     ${colors.cyan}Line ${lineNum}: ${lines[lineNum - 1].trim()}${colors.reset}`);
        }
      }
    }
    
    invalidFiles++;
    errors.push({
      file: filePath,
      error: error.message,
    });
  }
}

/**
 * Recursively find and validate all JSON files in a directory
 */
function validateDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (shouldExclude(fullPath)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      validateDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (JSON_EXTENSIONS.includes(ext)) {
        totalFiles++;
        validateJsonFile(fullPath);
      }
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     JSON Validation Report               ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`);
  
  const rootDir = process.cwd();
  console.log(`Scanning directory: ${rootDir}\n`);
  
  validateDirectory(rootDir);
  
  console.log(`\n${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Summary:${colors.reset}`);
  console.log(`  Total files:   ${totalFiles}`);
  console.log(`  Valid:         ${colors.green}${validFiles}${colors.reset}`);
  console.log(`  Invalid:       ${invalidFiles > 0 ? colors.red : colors.green}${invalidFiles}${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
  
  if (invalidFiles > 0) {
    console.log(`${colors.red}✗ Validation failed!${colors.reset}`);
    console.log(`  Found ${invalidFiles} invalid JSON file(s)\n`);
    
    console.log(`${colors.yellow}How to fix:${colors.reset}`);
    console.log(`  1. Review the error messages above`);
    console.log(`  2. Fix syntax errors in the indicated files`);
    console.log(`  3. Common issues:`);
    console.log(`     - Trailing commas: "key": "value",}`);
    console.log(`     - Missing quotes: {key: "value"}`);
    console.log(`     - Comments: // or /* */`);
    console.log(`     - Unbalanced brackets: { [ ]`);
    console.log(`  4. Run this script again to verify fixes\n`);
    
    console.log(`${colors.blue}See docs/TROUBLESHOOTING.md for more help${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✓ All JSON files are valid!${colors.reset}\n`);
    process.exit(0);
  }
}

// Run the script
main();
