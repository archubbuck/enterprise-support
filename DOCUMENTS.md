# Document Management

This document explains how support documents are managed in the Barings Support app.

## Overview

Support documents are stored as individual Markdown files in the `public/documents/` directory. This allows for easier editing and maintenance compared to hardcoding documents in TypeScript files.

## Document Structure

### Document Files

Each document is a separate `.md` (Markdown) file in `public/documents/`:

- `wifi-network.md` - Wi-Fi connection guide
- `ms-teams-tips.md` - Microsoft Teams tips
- `email-setup.md` - Email setup and best practices
- `security-guidelines.md` - Security guidelines
- `vpn-setup.md` - VPN connection guide
- `printer-setup.md` - Printer setup and troubleshooting
- `softphone-setup.md` - Softphone and phone system
- `laptop-care.md` - Laptop care and maintenance

### Manifest File

The `public/documents/manifest.json` file describes all available documents:

```json
[
  {
    "id": "wifi-network",
    "title": "{companyName} Wi-Fi Network Connections",
    "category": "Network",
    "icon": "wifi",
    "file": "wifi-network.md"
  },
  ...
]
```

## Placeholders

Documents support dynamic placeholders that are replaced at runtime with values from `company.config.json`:

- `{companyName}` - Replaced with the company name
- `{companyName.toUpperCase()}` - Replaced with uppercase company name
- `{emergencyEmail}` - Replaced with the emergency contact email
- `{vpnPortal}` - Replaced with the VPN portal URL

### Example

```markdown
# {companyName} Wi-Fi Network Connections

Connect to {companyName.toUpperCase()}-CORP using your {companyName} credentials.

For emergencies, contact {emergencyEmail}.
```

## How It Works

### Web Environment

1. App loads and calls `loadSupportDocuments()`
2. Function fetches `manifest.json` from `/documents/manifest.json`
3. For each document in the manifest, fetches the corresponding `.md` file
4. Replaces all placeholders with values from `company.config.json`
5. Returns array of document objects with parsed content

### iOS Environment

1. During build (`npm run ios:build`), Capacitor copies `public/` to `ios/App/App/public/`
2. Documents become part of the iOS app bundle
3. At runtime, the same fetch-based loading works because Capacitor serves bundle assets via HTTP
4. Placeholders are replaced just like in web environment

## Adding New Documents

To add a new support document:

1. Create a new `.md` file in `public/documents/` (e.g., `new-doc.md`)
2. Write content using Markdown format
3. Use placeholders where needed (e.g., `{companyName}`)
4. Add an entry to `manifest.json`:
   ```json
   {
     "id": "new-doc",
     "title": "New Document Title",
     "category": "Category",
     "icon": "icon-name",
     "file": "new-doc.md"
   }
   ```
5. Available icons: `wifi`, `teams`, `email`, `security`, `vpn`, `printer`, `phone`, `laptop`
6. Available categories: `Network`, `Collaboration`, `Communication`, `Security`, `Hardware`

## Editing Documents

To edit an existing document:

1. Open the corresponding `.md` file in `public/documents/`
2. Edit the Markdown content
3. Use placeholders for company-specific information
4. Save the file
5. Rebuild: `npm run build` (for web) or `npm run ios:build` (for iOS)

## Fallback Documents

If documents fail to load from the file system (e.g., network error, missing files), the app falls back to hardcoded documents defined in `src/lib/documents.ts`. This ensures the app always has content available.

## Testing

After making changes to documents:

1. **Web**: Run `npm run dev` and verify documents load correctly
2. **iOS**: Run `npm run ios:build && npm run ios:open`, build in Xcode, and test on simulator/device

## Best Practices

- Keep document files focused on a single topic
- Use clear, descriptive headings
- Include troubleshooting sections where appropriate
- Test all placeholder replacements
- Keep Markdown formatting consistent
- Use bullet points and numbered lists for clarity
