# Configuration Guide

This application is designed to be enterprise-agnostic, meaning you can easily rebrand it for any organization.

## Configuration File

All company-specific settings are stored in `company.config.json` at the root of the project. This file controls:

- Company branding (name, app name)
- App identifiers (bundle ID for iOS)
- Domain information
- VPN portal addresses
- IT contact information
- Regional office contacts

## How to Configure

### 1. Edit company.config.json

```json
{
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
      },
      // Add more regions as needed
    ]
  }
}
```

### 2. Configuration Fields Explained

| Field | Description | Example |
|-------|-------------|---------|
| `companyName` | Your company's name | "Acme Corp" |
| `appName` | Full application name | "Acme Corp Support" |
| `appId` | iOS bundle identifier (reverse domain) | "com.acmecorp.support" |
| `appSubtitle` | Subtitle shown in the app | "IT Help & Documentation" |
| `domain` | Your company's email domain | "acmecorp.com" |
| `vpnPortal` | VPN portal address | "vpn.acmecorp.com" |
| `contacts.email` | IT help desk email | "ithelpdesk@acmecorp.com" |
| `contacts.emergencyEmail` | Security team email | "security@acmecorp.com" |
| `contacts.regions` | Array of regional contact info | See below |

### 3. Regional Contacts Structure

Each region in the `contacts.regions` array should have:

```json
{
  "region": "Region Name",
  "city": "City, State/Country",
  "phone": "+1 (555) 123-4567",
  "hours": "Business hours with timezone"
}
```

## Where Configuration is Used

The configuration values are automatically injected into:

1. **App.tsx** - App title and subtitle in the header
2. **documents.ts** - All document content (company name in guides)
3. **capacitor.config.ts** - iOS app bundle ID and display name
4. **index.html** - Page title (via Vite plugin)
5. **iOS Info.plist** - iOS display name (via Capacitor sync)

## Rebuilding After Configuration Changes

After editing `company.config.json`, you need to rebuild:

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

## Important Notes

### App Bundle ID (appId)
- Must be unique in the App Store
- Use reverse domain notation: `com.company.appname`
- Cannot be changed after App Store submission
- Must match your Apple Developer provisioning profile

### Company Name
- Used throughout document content
- Make sure it reads naturally in sentences
- Example: "Acme" works better than "Acme Corp" in some contexts

### Contact Information
- Email addresses should be monitored mailboxes
- Phone numbers should include country codes
- Business hours should specify timezone
- Add regions as needed for your organization

## Testing Your Configuration

After making changes:

1. Run the dev server: `npm run dev`
2. Open http://localhost:5173
3. Check:
   - App title in header shows your company name
   - Documents contain your company references
   - Contact page shows your contact information
   - VPN guide references your VPN portal

## Customizing Document Content

The support documents are in `src/lib/documents.ts`. They automatically use values from `company.config.json`, but you can also:

1. Add new documents
2. Modify existing document content
3. Change document categories
4. Update icons

All company-specific references use template literals that pull from the configuration:

```typescript
`Connect to ${companyConfig.companyName} VPN`
```

This ensures consistency across all documents when you change the company name.

## Advanced: Multiple Deployments

If you need to maintain apps for multiple enterprises:

1. Create separate Git branches for each company
2. Maintain different `company.config.json` in each branch
3. Use different `appId` values for each deployment
4. Build and deploy separately for each organization

Alternatively, use environment-specific config files and a build script to select the appropriate configuration at build time.

## Related Documentation

- [Quick Start Guide](./QUICK_START.md) - Getting started with development
- [iOS Development Guide](./iOS_DEVELOPMENT.md) - iOS-specific instructions
- [Document Management](./DOCUMENTS.md) - Managing support documents
- [README](../README.md) - Project overview
