# Configuration Guide

This application is designed to be enterprise-agnostic, meaning you can easily rebrand it for any organization.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Configuration (.env)](#environment-configuration-env)
- [Schema and Validation](#schema-and-validation)
- [Configuration Examples](#configuration-examples)
- [Field Reference](#field-reference)
- [Testing Your Configuration](#testing-your-configuration)
- [Advanced Topics](#advanced-topics)

## Quick Start

For the fastest setup, start from the environment template:

```bash
cp .env.example .env.development
```

Then edit the copied file with your organization's information.

## Environment Configuration (.env)

This project uses `.env` files as the source of truth for app configuration.

### How It Works

- `APP_CONFIG_*` values from `.env` files are read directly by the app
- Vite reads env values for build-time settings (like HTML title)
- Capacitor reads env values for native metadata (`appId`, `appName`)
- Validation commands validate env-derived configuration

### File Precedence

Environment files load in this order (later files override earlier files):

1. `.env`
2. `.env.local`
3. `.env.<mode>`
4. `.env.<mode>.local`

Modes used by npm scripts:

- `npm run dev` → `development`
- `npm run build` → `production`
- `npm run validate:app-config` → `development`

### Supported Keys

Use `.env.example` as the source of truth for supported keys. Common keys include:

- `APP_CONFIG_COMPANY_NAME`
- `APP_CONFIG_APP_NAME`
- `APP_CONFIG_APP_ID`
- `APP_CONFIG_DOMAIN`
- `APP_CONFIG_CONTACTS_EMAIL`
- `APP_CONFIG_FEATURES_TAG_FILTERING`
- `APP_CONFIG_CONTACTS_REGIONS_JSON` (JSON array)

### Example

```bash
cp .env.example .env.development
```

```dotenv
APP_CONFIG_COMPANY_NAME=Contoso
APP_CONFIG_APP_NAME=Contoso Support
APP_CONFIG_FEATURES_TAG_FILTERING=true
APP_CONFIG_CONTACTS_REGIONS_JSON=[{"region":"Americas","city":"Charlotte, NC (HQ)","phone":"+1 (704) 805-7200","hours":"7:00 AM - 7:00 PM EST"}]
```

Then run:

```bash
npm run dev
```

### Notes

- Required `APP_CONFIG_*` keys must be present for app startup and validation
- Optional fields can be cleared with an empty value for optional keys
- Never store secrets in `.env` files; all values are client-visible

## Schema and Validation

### Runtime Validation

Configuration is validated against the app's runtime validation rules, which ensure:
- All required fields are present
- Field formats are correct (emails, domains, app IDs)
- Feature flags are valid booleans

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

Use `.env.example` as the primary configuration template.

The following scenarios can guide your values:

### 1. Startup Configuration
**Best for:** Small companies, startups, single-location businesses (< 50 employees)

**Features:**
- Minimal required fields only
- Single point of contact
- Quick setup

### 2. Enterprise Configuration
**Best for:** Large multinational corporations (500+ employees)

**Features:**
- Multiple regional offices across continents
- 24/7 support availability
- Comprehensive contact information

### 3. Regional Configuration
**Best for:** Medium-sized businesses with multiple domestic locations (50-500 employees)

**Features:**
- 2-5 offices in the same country
- Region-specific contacts
- Localized support hours

See [.env.example](../.env.example) for all available keys and defaults.

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

The support documents are in `src/lib/documents.ts`. They automatically use values from environment-driven app config, but you can also:

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
2. Maintain different `.env` files in each branch
3. Use different `appId` values for each deployment
4. Build and deploy separately for each organization

**Option 2: Environment-Based Configuration**
1. Create environment-specific config files:
   - `app.config.dev.json`
   - `app.config.staging.json`
   - `app.config.prod.json`
2. Use environment files (`.env.development`, `.env.production`) per deployment target
3. Set up CI/CD to select the right config per environment

### IDE Integration

For better editing experience, keep `.env.example` updated with all required keys and value examples:

This improves:
- ✓ Team onboarding and consistency
- ✓ Faster environment setup
- ✓ Clear expected keys in one place

### Programmatic Validation

You can validate configurations programmatically in your code:

```typescript
import { validateAppConfig } from '@/types/app-config';
import { getAppConfigFromEnv } from '@/hooks/useAppConfig';

try {
  const appConfig = getAppConfigFromEnv();
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
