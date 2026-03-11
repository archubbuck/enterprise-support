# Configuration Guide

This application is designed to be enterprise-agnostic, meaning you can easily rebrand it for any organization.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration File](#configuration-file)
- [Schema and Validation](#schema-and-validation)
- [Configuration Examples](#configuration-examples)
- [Field Reference](#field-reference)
- [Testing Your Configuration](#testing-your-configuration)
- [Advanced Topics](#advanced-topics)

## Quick Start

For the fastest setup, use one of our pre-configured examples:

```bash
# For startups/small businesses
cp examples/app.config.startup.json app.config.json

# For large enterprises
cp examples/app.config.enterprise.json app.config.json

# For regional organizations
cp examples/app.config.regional.json app.config.json
```

Then edit the copied file with your organization's information.

## Configuration File

All app-specific settings are stored in `app.config.json` at the root of the project. This file controls:

- **Company branding** - Name, app name, and subtitle
- **App identifiers** - Bundle ID for iOS App Store
- **Domain information** - Email domains and VPN portals
- **Contact information** - IT helpdesk and emergency contacts
- **Regional offices** - Multi-location support information
- **Document configuration** - Available documents and their locations
- **Feature flags** - Enable or disable application features
- **Theme settings** - Color themes and customization options

### File Structure

```json
{
  "$schema": "./schemas/app.config.schema.json",
  "companyName": "YourCompany",
  "appName": "YourCompany Support",
  "appId": "com.yourcompany.support",
  "appSubtitle": "IT Help & Documentation",
  "domain": "yourcompany.com",
  "vpnPortal": "vpn.yourcompany.com",
  "contacts": {
    "email": "ithelpdesk@yourcompany.com",
    "emergencyEmail": "security@yourcompany.com",
    "regions": [
      {
        "region": "Americas",
        "city": "New York, NY (HQ)",
        "phone": "+1 (555) 123-4567",
        "hours": "8:00 AM - 6:00 PM EST"
      }
    ]
  },
  "features": {
    "tagFiltering": false,
    "pdfDocuments": true,
    "wordDocuments": true,
    "imageDocuments": true
  },
  "theme": {
    "defaultTheme": "light",
    "enableThemeSwitcher": true,
    "themes": [
      {
        "id": "light",
        "name": "Light",
        "enabled": true
      }
    ]
  },
  "documents": [
    {
      "name": "IT Support Documents",
      "path": "public/documents/manifest.json",
      "position": 0
    }
  ]
}
```

> **Note:** The `$schema` field enables IDE autocomplete and inline validation when editing the config file.

## Schema and Validation

### JSON Schema

The configuration is validated against a JSON Schema (`app.config.schema.json`) that ensures:
- All required fields are present
- Field formats are correct (emails, domains, app IDs)
- No typos or structural errors

### TypeScript Types

TypeScript type definitions are available at `src/types/app-config.ts` for compile-time type safety.

### Validation Commands

```bash
# Validate app configuration
npm run validate:app-config

# Validate all JSON files
npm run validate:json

# Run all checks (JSON, app config, and linting)
npm run check
```

## Configuration Examples

We provide three complete examples for different organization types:

### 1. Startup Configuration
**File:** `examples/app.config.startup.json`

**Best for:** Small companies, startups, single-location businesses (< 50 employees)

**Features:**
- Minimal required fields only
- Single point of contact
- Quick setup

### 2. Enterprise Configuration
**File:** `examples/app.config.enterprise.json`

**Best for:** Large multinational corporations (500+ employees)

**Features:**
- Multiple regional offices across continents
- 24/7 support availability
- Comprehensive contact information

### 3. Regional Configuration
**File:** `examples/app.config.regional.json`

**Best for:** Medium-sized businesses with multiple domestic locations (50-500 employees)

**Features:**
- 2-5 offices in the same country
- Region-specific contacts
- Localized support hours

See the [examples directory](../examples/) for complete configurations and detailed guidance.

## Field Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `companyName` | string | Your company's official name (1-100 chars) | "Acme Corporation" |
| `appName` | string | Full application name (1-50 chars) | "Acme Support" |
| `appId` | string | iOS bundle identifier (reverse domain) | "com.acmecorp.support" |
| `domain` | string | Email domain without @ symbol | "acmecorp.com" |
| `contacts.email` | string | Primary IT helpdesk email | "ithelpdesk@acmecorp.com" |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `appSubtitle` | string | Subtitle shown in app header (max 100 chars) | "IT Help & Documentation" |
| `vpnPortal` | string | VPN portal address | "vpn.acmecorp.com" |
| `contacts.emergencyEmail` | string | Security/emergency contact | "security@acmecorp.com" |
| `contacts.regions` | array | Regional office information | See below |

### Regional Contacts Structure

Each region in the `contacts.regions` array should have:

```json
{
  "region": "Region Name",
  "city": "City, State/Country",
  "phone": "+1 (555) 123-4567",
  "hours": "Business hours with timezone"
}
```

**Field Details:**
- `region`: Geographic region (e.g., "Americas", "EMEA", "Asia Pacific")
- `city`: City and state/country. Add "(HQ)" for headquarters
- `phone`: International format with country code
- `hours`: Business hours with timezone abbreviation

### Documents Configuration

The `documents` array specifies which document collections are available in the application. Each entry has the following structure:

```json
{
  "name": "IT Support Documents",
  "path": "public/documents/manifest.json",
  "position": 0
}
```

**Field Details:**
- `name` (required): Friendly name describing the document collection
- `path` (required): Path to the manifest.json file, relative to workspace root
- `position` (optional): Numeric ordering value (lower numbers appear first)

**Document Ordering:**
- Documents with a `position` value are displayed first, sorted by position (ascending)
- Documents without a `position` value appear after positioned documents
- This allows you to control which documents appear at the top of the list

**Example with Multiple Document Collections:**

```json
"documents": [
  {
    "name": "Quick Start Guides",
    "path": "public/documents/quick-start/manifest.json",
    "position": 0
  },
  {
    "name": "IT Support Documents",
    "path": "public/documents/support/manifest.json",
    "position": 1
  },
  {
    "name": "Security Policies",
    "path": "public/documents/security/manifest.json",
    "position": 2
  },
  {
    "name": "Additional Resources",
    "path": "public/documents/misc/manifest.json"
  }
]
```

In this example, Quick Start Guides appear first, followed by IT Support Documents, then Security Policies. Additional Resources (no position) appear last.

**Search Compatibility:**
The search function works across all configured document collections. When you search for a term, it searches through titles and categories from all documents specified in the configuration.

### Important Field Notes

#### App Bundle ID (`appId`)
- **CRITICAL**: Must be unique in the App Store
- Use reverse domain notation: `com.company.appname`
- Cannot be changed after App Store submission
- Must match your Apple Developer provisioning profile
- Use lowercase letters, numbers, hyphens, and dots only

#### Company Name
- Used throughout document content
- Keep it concise (under 50 characters recommended)
- Should read naturally in sentences
- Example: "Acme" works better than "Acme Corporation" in some contexts

#### Contact Information
- Email addresses should be monitored mailboxes
- Phone numbers should include country codes
- Business hours should specify timezone
- Add as many regions as your organization needs

## Where Configuration is Used

The configuration values are automatically injected into:

1. **App.tsx** - App title and subtitle in the header
2. **documents.ts** - All document content (company name in guides)
3. **capacitor.config.ts** - iOS app bundle ID and display name
4. **index.html** - Page title (via Vite plugin)
5. **iOS Info.plist** - iOS display name (via Capacitor sync)

## Testing Your Configuration

After making changes, follow these steps:

### 1. Validate Configuration

```bash
# Validate app config
npm run validate:app-config

# Run all validations
npm run check
```

### 2. Test in Development

```bash
npm run dev
```

Open http://localhost:5173 and verify:
- ✓ App title in header shows your company name
- ✓ Documents contain your company references
- ✓ Contact page shows your contact information
- ✓ VPN guide references your VPN portal

### 3. Common Validation Errors

**Invalid appId format**
```
Error: appId must use reverse domain notation (e.g., com.company.app)
```
Fix: Use lowercase letters, dots, and hyphens only. Start with `com.`

**Invalid email format**
```
Error: contacts.email is not a valid email address
```
Fix: Ensure email has format: `user@domain.com`

**Missing required field**
```
Error: Missing required field: "domain"
```
Fix: Add the missing field to your configuration

### 4. Troubleshooting

If validation passes but the app doesn't work:
1. Clear your browser cache
2. Restart the development server
3. Check browser console for errors
4. Verify all referenced files exist

## Rebuilding After Configuration Changes

### Web Development
```bash
npm run dev
# Changes will be reflected in the development server
```

### iOS Development
```bash
npm run ios:build
# This rebuilds the web app and syncs changes to iOS
```

Then open in Xcode and rebuild:
```bash
npm run ios:open
# Click Run in Xcode
```

## Customizing Document Content

The support documents are in `src/lib/documents.ts`. They automatically use values from `app.config.json`, but you can also:

1. Add new documents
2. Modify existing document content
3. Change document categories
4. Update icons

All company-specific references use template literals that pull from the configuration:

```typescript
`Connect to ${appConfig.companyName} VPN`
```

This ensures consistency across all documents when you change the company name.

## Advanced Topics

### Multiple Deployments

If you need to maintain apps for multiple enterprises:

**Option 1: Git Branches**
1. Create separate Git branches for each company
2. Maintain different `app.config.json` in each branch
3. Use different `appId` values for each deployment
4. Build and deploy separately for each organization

**Option 2: Environment-Based Configuration**
1. Create environment-specific config files:
   - `app.config.dev.json`
   - `app.config.staging.json`
   - `app.config.prod.json`
2. Use a build script to copy the appropriate file to `app.config.json`
3. Set up CI/CD to select the right config per environment

### IDE Integration

For better editing experience, add the `$schema` field to your `app.config.json`:

```json
{
  "$schema": "./schemas/app.config.schema.json",
  "companyName": "Your Company",
  ...
}
```

This enables:
- ✓ Autocomplete in VS Code and other editors
- ✓ Inline validation while editing
- ✓ Hover documentation for fields
- ✓ Error highlighting

### Programmatic Validation

You can validate configurations programmatically in your code:

```typescript
import { validateAppConfig } from '@/types/app-config';
import appConfig from '../app.config.json';

try {
  validateAppConfig(appConfig);
  console.log('Configuration is valid!');
} catch (error) {
  console.error('Configuration error:', error.message);
}
```

### Configuration Best Practices

1. **Keep It Simple**: Start with minimal configuration and add complexity as needed
2. **Validate Often**: Run `npm run validate:app-config` before every commit
3. **Document Changes**: Keep notes on why you chose specific values
4. **Use Examples**: Reference the examples directory when unsure
5. **Test Thoroughly**: Always test in development before deploying
6. **Review Regularly**: Update contact information as your organization changes
7. **Version Control**: Keep old configs for reference when rolling back

### Security Considerations

- **Never commit secrets**: Don't put API keys, passwords, or tokens in config files
- **Email addresses**: Only use monitored, official company email addresses
- **Phone numbers**: Verify numbers are correct and monitored
- **VPN portals**: Ensure VPN URLs are correct and use HTTPS

### Compliance and Accessibility

For organizations with specific compliance requirements:

- **GDPR/Privacy**: Ensure contact information complies with data protection laws
- **Accessibility**: Keep names and titles clear and descriptive
- **Language**: Use inclusive, professional language in all fields
- **Multi-language**: Consider creating locale-specific configs if needed

## Troubleshooting

### Configuration Not Loading

**Symptom**: Changes to config don't appear in the app

**Solutions**:
1. Clear browser cache and restart dev server
2. Check for JSON syntax errors: `npm run validate:json`
3. Verify the file is saved in the correct location
4. Check browser console for loading errors

### Validation Fails

**Symptom**: `npm run validate:app-config` reports errors

**Solutions**:
1. Read the error messages carefully
2. Check field formats (emails, phone numbers, app ID)
3. Verify all required fields are present
4. Review examples for correct structure

### iOS Build Issues

**Symptom**: App won't build after config changes

**Solutions**:
1. Verify `appId` uses correct format
2. Clean and rebuild: `npm run ios:build`
3. Check Xcode signing settings match `appId`
4. See [iOS Development Guide](./iOS_DEVELOPMENT.md)

## Theme Configuration

The application supports multiple color themes that users can select at runtime. Theme settings are configured in `runtime.config.json`.

For detailed information about configuring and customizing themes, see the [Theme Configuration Guide](./THEME_CONFIGURATION.md).

## Related Documentation

- [Quick Start Guide](./QUICK_START.md) - Getting started with development
- [Theme Configuration Guide](./THEME_CONFIGURATION.md) - Configuring color themes
- [iOS Development Guide](./iOS_DEVELOPMENT.md) - iOS-specific instructions
- [Document Management](./DOCUMENTS.md) - Managing support documents
- [README](../README.md) - Project overview
