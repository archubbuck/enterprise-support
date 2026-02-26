#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { config: loadEnv } = require('dotenv');

const PLACEHOLDER = '<REPLACE>';
const TEMPLATE_DIR = path.join(process.cwd(), 'ios', 'App', 'fastlane', 'metadata');
const OUTPUT_DIR = path.join(process.cwd(), 'ios', 'App', 'fastlane', '.generated-metadata');

const FILE_ENV_MAPPINGS = [
  { file: 'primary_category.txt', envKey: 'APP_STORE_PRIMARY_CATEGORY', allowEmpty: false },
  { file: 'secondary_category.txt', envKey: 'APP_STORE_SECONDARY_CATEGORY', allowEmpty: true },
  { file: path.join('en-US', 'name.txt'), envKey: 'APP_STORE_EN_US_NAME', allowEmpty: false },
  { file: path.join('en-US', 'subtitle.txt'), envKey: 'APP_STORE_EN_US_SUBTITLE', allowEmpty: true },
  { file: path.join('en-US', 'description.txt'), envKey: 'APP_STORE_EN_US_DESCRIPTION', allowEmpty: false },
  { file: path.join('en-US', 'keywords.txt'), envKey: 'APP_STORE_EN_US_KEYWORDS', allowEmpty: false },
  { file: path.join('en-US', 'marketing_url.txt'), envKey: 'APP_STORE_EN_US_MARKETING_URL', allowEmpty: false },
  { file: path.join('en-US', 'privacy_url.txt'), envKey: 'APP_STORE_EN_US_PRIVACY_URL', allowEmpty: false },
  { file: path.join('en-US', 'promotional_text.txt'), envKey: 'APP_STORE_EN_US_PROMOTIONAL_TEXT', allowEmpty: true },
  { file: path.join('en-US', 'release_notes.txt'), envKey: 'APP_STORE_EN_US_RELEASE_NOTES', allowEmpty: true },
  { file: path.join('en-US', 'support_url.txt'), envKey: 'APP_STORE_EN_US_SUPPORT_URL', allowEmpty: false },
  { file: path.join('en-US', 'copyright.txt'), envKey: 'APP_STORE_EN_US_COPYRIGHT', allowEmpty: false },
];

function log(message) {
  console.log(message);
}

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function loadEnvFiles(mode) {
  loadEnv({ path: path.join(process.cwd(), '.env.example'), quiet: true });
  loadEnv({ path: path.join(process.cwd(), '.env'), override: true, quiet: true });
  loadEnv({ path: path.join(process.cwd(), '.env.local'), override: true, quiet: true });
  loadEnv({ path: path.join(process.cwd(), `.env.${mode}`), override: true, quiet: true });
  loadEnv({ path: path.join(process.cwd(), `.env.${mode}.local`), override: true, quiet: true });
}

function normalizeEnvValue(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\\n/g, '\n');
}

function replacePlaceholder(templateContent, value, filePath) {
  if (!templateContent.includes(PLACEHOLDER)) {
    fail(`Template file is missing ${PLACEHOLDER}: ${filePath}`);
  }

  const replaced = templateContent.split(PLACEHOLDER).join(value);
  if (replaced.includes(PLACEHOLDER)) {
    fail(`Unresolved ${PLACEHOLDER} found after replacement in ${filePath}`);
  }

  return replaced;
}

function validateAndBuildReplacements() {
  const replacements = [];

  FILE_ENV_MAPPINGS.forEach(({ file, envKey, allowEmpty }) => {
    const templatePath = path.join(TEMPLATE_DIR, file);
    if (!fs.existsSync(templatePath)) {
      fail(`Template metadata file not found: ${templatePath}`);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');
    if (!templateContent.includes(PLACEHOLDER)) {
      fail(`Template file must contain ${PLACEHOLDER}: ${templatePath}`);
    }

    const rawEnvValue = process.env[envKey];
    if (rawEnvValue === undefined) {
      fail(`Missing required environment variable: ${envKey}`);
    }

    if (rawEnvValue.includes(PLACEHOLDER)) {
      fail(`Environment variable ${envKey} still contains placeholder value ${PLACEHOLDER}`);
    }

    const normalizedValue = normalizeEnvValue(rawEnvValue);
    if (!allowEmpty && normalizedValue.trim() === '') {
      fail(`Environment variable ${envKey} must not be empty`);
    }

    const renderedContent = replacePlaceholder(templateContent, normalizedValue, templatePath);
    replacements.push({ file, renderedContent });
  });

  return replacements;
}

function copyDirectoryRecursive(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  entries.forEach((entry) => {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
      return;
    }

    fs.copyFileSync(sourcePath, targetPath);
  });
}

function writeGeneratedMetadata(replacements) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  copyDirectoryRecursive(TEMPLATE_DIR, OUTPUT_DIR);

  replacements.forEach(({ file, renderedContent }) => {
    const outputPath = path.join(OUTPUT_DIR, file);
    fs.writeFileSync(outputPath, renderedContent);
  });

  const unresolvedFiles = FILE_ENV_MAPPINGS
    .map(({ file }) => path.join(OUTPUT_DIR, file))
    .filter((filePath) => fs.readFileSync(filePath, 'utf8').includes(PLACEHOLDER));

  if (unresolvedFiles.length > 0) {
    fail(`Generated metadata contains unresolved ${PLACEHOLDER} in:\n${unresolvedFiles.join('\n')}`);
  }
}

function main() {
  const mode = process.env.NODE_ENV || 'development';
  const validateOnly = process.argv.includes('--validate-only');

  if (!fs.existsSync(TEMPLATE_DIR)) {
    fail(`Metadata template directory not found: ${TEMPLATE_DIR}`);
  }

  loadEnvFiles(mode);

  log(`🔍 Validating fastlane metadata placeholders (${mode} mode)...`);
  const replacements = validateAndBuildReplacements();
  log(`✅ Placeholder validation passed for ${replacements.length} metadata file(s)`);

  if (validateOnly) {
    log('✅ Validation-only mode complete');
    return;
  }

  writeGeneratedMetadata(replacements);
  log(`✅ Generated metadata at: ${OUTPUT_DIR}`);
}

main();
