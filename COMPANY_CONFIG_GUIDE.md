# Company Configuration Guide

This guide provides comprehensive information about configuring the Enterprise Support application for your organization.

## Overview

The `company.config.json` file is the central configuration file that controls all company-specific settings in the Enterprise Support application. It enables you to customize the app for your organization without modifying any code.

## Features

- ✅ **JSON Schema Validation** - Automatic validation with detailed error messages
- ✅ **TypeScript Type Safety** - Compile-time type checking for developers
- ✅ **IDE Integration** - Autocomplete and inline documentation in modern editors
- ✅ **Example Configurations** - Pre-configured templates for different organization sizes
- ✅ **Comprehensive Documentation** - Detailed field descriptions and best practices

## Quick Start

### 1. Choose a Template

Select the template that best matches your organization:

```bash
# Small business/startup (< 50 employees)
cp examples/company.config.startup.json company.config.json

# Large enterprise (500+ employees)
cp examples/company.config.enterprise.json company.config.json

# Regional organization (50-500 employees, multiple locations)
cp examples/company.config.regional.json company.config.json
```

### 2. Edit Your Configuration

Open `company.config.json` and update with your organization's information:

```json
{
  "$schema": "./company.config.schema.json",
  "companyName": "Your Company Name",
  "appName": "Your Company Support",
  "appId": "com.yourcompany.support",
  "appSubtitle": "IT Help & Documentation",
  "domain": "yourcompany.com",
  "vpnPortal": "vpn.yourcompany.com",
  "contacts": {
    "email": "it@yourcompany.com",
    "emergencyEmail": "security@yourcompany.com",
    "regions": []
  }
}
```

### 3. Validate Your Configuration

```bash
# Validate company configuration
npm run validate:company-config

# Validate all JSON files and run checks
npm run check
```

### 4. Test Your Configuration

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## Configuration Fields

### Required Fields

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| `companyName` | Official company name | String (1-100 chars) | "Acme Corporation" |
| `appName` | Application name | String (1-50 chars) | "Acme Support" |
| `appId` | iOS bundle identifier | Reverse domain notation | "com.acme.support" |
| `domain` | Email domain | Domain without @ | "acme.com" |
| `contacts.email` | IT helpdesk email | Valid email address | "it@acme.com" |

### Optional Fields

| Field | Description | Format | Example |
|-------|-------------|--------|---------|
| `appSubtitle` | App subtitle | String (max 100 chars) | "IT Help Center" |
| `vpnPortal` | VPN portal address | URL or hostname | "vpn.acme.com" |
| `contacts.emergencyEmail` | Security contact | Valid email address | "security@acme.com" |
| `contacts.regions` | Regional offices | Array of objects | See below |

### Regional Contact Object

```json
{
  "region": "Americas",
  "city": "New York, NY (HQ)",
  "phone": "+1 (555) 123-4567",
  "hours": "8:00 AM - 6:00 PM EST"
}
```

## Schema Validation

### Automatic Validation

The configuration is validated against `company.config.schema.json` which ensures:

- All required fields are present
- Field formats are correct (emails, domains, app IDs)
- Field lengths are within limits
- No typos or structural errors

### IDE Integration

The `$schema` field enables automatic validation and autocomplete in modern IDEs:

```json
{
  "$schema": "./company.config.schema.json",
  ...
}
```

**Supported IDEs:**
- Visual Studio Code
- JetBrains IDEs (WebStorm, IntelliJ)
- Sublime Text (with LSP)
- Atom (with appropriate plugins)

### Manual Validation

Run validation at any time:

```bash
npm run validate:company-config
```

**Example Output:**
```
✓ Configuration is valid!

Configuration Summary:
  Company:     Acme Corporation
  App Name:    Acme Support
  App ID:      com.acme.support
  Domain:      acme.com
  IT Email:    it@acme.com
  Regions:     3 office(s)
```

## Examples and Templates

### Startup Configuration

**Use case:** Small company, single location, minimal setup

**File:** `examples/company.config.startup.json`

**Features:**
- Essential fields only
- No regional offices
- Quick deployment

### Enterprise Configuration

**Use case:** Large multinational corporation

**File:** `examples/company.config.enterprise.json`

**Features:**
- Multiple regional offices
- 24/7 support designation
- Comprehensive contact info

### Regional Configuration

**Use case:** Medium business with multiple domestic offices

**File:** `examples/company.config.regional.json`

**Features:**
- 2-5 regional offices
- Localized support hours
- Regional grouping

## TypeScript Integration

For developers, TypeScript types are available:

```typescript
import type { CompanyConfig } from '@/types/company-config';
import { validateCompanyConfig } from '@/types/company-config';
import companyConfig from '../company.config.json';

// Type checking
const config: CompanyConfig = companyConfig;

// Runtime validation
try {
  validateCompanyConfig(config);
} catch (error) {
  console.error('Invalid configuration:', error.message);
}
```

## Best Practices

### 1. Field Guidelines

**Company Name:**
- Keep under 50 characters for better display
- Use official company name
- Avoid abbreviations unless they're part of your brand

**App ID:**
- Use lowercase only
- Format: `com.company.appname`
- Cannot be changed after App Store submission
- Must match Apple Developer account

**Email Addresses:**
- Use monitored mailboxes only
- Avoid personal email addresses
- Consider distribution lists
- Set up auto-responders for emergency contacts

**Phone Numbers:**
- Always include country code
- Use consistent formatting
- Format: `+[country] ([area]) [number]`
- Verify numbers are correct

**Business Hours:**
- Always include timezone
- Use standard abbreviations (EST, GMT, JST)
- Consider 24/7 designation for critical locations
- Be specific (e.g., "Mon-Fri 9:00-17:00 EST")

### 2. Validation Workflow

```bash
# 1. Make changes to company.config.json
# 2. Validate immediately
npm run validate:company-config

# 3. Test in development
npm run dev

# 4. Run full checks before commit
npm run check

# 5. Test in production-like environment
npm run build
```

### 3. Security Considerations

- ✅ Never commit API keys or secrets
- ✅ Use official company email addresses only
- ✅ Verify all contact information is public
- ✅ Review changes before committing
- ✅ Use HTTPS for VPN portal URLs

### 4. Maintenance

- Review configuration quarterly
- Update contact information when it changes
- Test after any changes
- Document reasons for specific values
- Keep old configs in version control

## Common Issues and Solutions

### Invalid App ID Format

**Problem:**
```
Error: appId must use reverse domain notation (e.g., com.company.app)
```

**Solution:**
- Use lowercase only
- Start with `com.`
- Use dots to separate segments
- Valid: `com.acme.support`
- Invalid: `Acme.Support`, `acme.com.support`

### Missing Required Field

**Problem:**
```
Error: Missing required field: "domain"
```

**Solution:**
Add the missing field to your configuration:
```json
{
  "domain": "yourcompany.com",
  ...
}
```

### Invalid Email Format

**Problem:**
```
Error: contacts.email is not a valid email address
```

**Solution:**
Ensure email follows format `user@domain.com`:
```json
{
  "contacts": {
    "email": "it@acme.com"
  }
}
```

### Configuration Not Loading

**Problem:** Changes don't appear in the app

**Solutions:**
1. Clear browser cache
2. Restart development server
3. Verify JSON syntax: `npm run validate:json`
4. Check browser console for errors

## Advanced Usage

### Multiple Environments

Create environment-specific configurations:

```bash
# Development
company.config.dev.json

# Staging
company.config.staging.json

# Production
company.config.prod.json
```

Use build scripts to select the appropriate config:

```bash
#!/bin/bash
ENV=${1:-dev}
cp company.config.$ENV.json company.config.json
npm run build
```

### Multiple Organizations

Maintain separate Git branches for each organization:

```bash
# Create branch for Company A
git checkout -b company-a
# Edit company.config.json
# Commit and deploy

# Create branch for Company B
git checkout -b company-b
# Edit company.config.json
# Commit and deploy
```

### Programmatic Access

Access configuration in your code:

```typescript
import companyConfig from '../company.config.json';

console.log(`Welcome to ${companyConfig.companyName}`);
console.log(`Contact: ${companyConfig.contacts.email}`);
```

## Related Documentation

- [Configuration Guide](./docs/CONFIGURATION.md) - Detailed configuration instructions
- [Quick Start Guide](./docs/QUICK_START.md) - Getting started
- [Examples](./examples/README.md) - Example configurations
- [JSON Schema](./company.config.schema.json) - Schema definition
- [TypeScript Types](./src/types/company-config.ts) - Type definitions

## Support

If you encounter issues:

1. Check this guide for common solutions
2. Validate your configuration: `npm run validate:company-config`
3. Review example configurations in `examples/`
4. Check [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
5. Open an issue on GitHub

## Contributing

We welcome contributions to improve the configuration system:

- Additional example configurations
- Enhanced validation rules
- Better error messages
- Documentation improvements

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
