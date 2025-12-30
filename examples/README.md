# Company Configuration Examples

This directory contains example configurations for different types of organizations. Use these as templates when setting up your own `company.config.json`.

## Available Examples

### 1. Startup Configuration (`company.config.startup.json`)

**Best for:** Small companies, startups, single-location businesses

**Features:**
- Minimal configuration with just essential fields
- Single point of contact
- Simple setup for quick deployment

**Use this if you:**
- Have a small team (< 50 people)
- Operate from one location
- Need a quick, simple setup
- Don't need regional office contacts

### 2. Enterprise Configuration (`company.config.enterprise.json`)

**Best for:** Large multinational corporations, global enterprises

**Features:**
- Multiple regional offices across continents
- 24/7 support availability in key locations
- Comprehensive contact information
- Regional support teams

**Use this if you:**
- Have offices in multiple countries
- Need to provide region-specific support information
- Have dedicated IT teams in different locations
- Support a large, distributed workforce

### 3. Regional Configuration (`company.config.regional.json`)

**Best for:** Medium-sized businesses with multiple domestic locations

**Features:**
- Multiple locations within a country or region
- Region-specific contact information
- Tailored for organizations with 2-5 offices

**Use this if you:**
- Have multiple offices in the same country
- Need to direct users to their regional IT support
- Want to provide localized support hours
- Have 50-500 employees across locations

## How to Use These Examples

1. **Choose the template** that best matches your organization's size and structure
2. **Copy the example** to the root directory as `company.config.json`:
   ```bash
   cp examples/company.config.startup.json company.config.json
   ```
3. **Edit the values** to match your organization's information
4. **Validate your configuration**:
   ```bash
   npm run validate:json
   ```
5. **Test your configuration**:
   ```bash
   npm run dev
   ```

## Customization Tips

### For Startups
- You can omit `emergencyEmail` if you don't have a separate security team
- You can omit `vpnPortal` if you don't use VPN
- Keep `companyName` short for better display

### For Enterprises
- Add as many regional offices as needed by extending the `regions` array
- Consider 24/7 support designation for critical locations
- Use consistent phone number formatting across regions
- Include timezone abbreviations in `hours` field

### For Regional Organizations
- Group offices by logical regions (e.g., "North", "South", "East", "West")
- Use city names that are recognizable to your employees
- Consider using "(HQ)" designation for headquarters

## Field-by-Field Guidance

### Required Fields
- `companyName`: Official company name (keep under 50 characters)
- `appName`: App name (typically "{Company} Support" or "{Company} Help")
- `appId`: iOS bundle ID (reverse domain notation, e.g., `com.company.app`)
- `domain`: Email domain without @ symbol
- `contacts.email`: Primary IT helpdesk email

### Optional Fields
- `appSubtitle`: Descriptive subtitle shown in the app
- `vpnPortal`: VPN portal address (URL or hostname)
- `contacts.emergencyEmail`: Security/emergency contact email
- `contacts.regions`: Array of regional office information

### Best Practices

1. **Keep it Simple**: Start with minimal configuration and add regions as needed
2. **Test Thoroughly**: Always test after making changes
3. **Use Validation**: Run `npm run validate:json` before deploying
4. **Document Changes**: Keep notes on why you chose specific values
5. **Review Regularly**: Update contact information as your organization changes

## Validation

All example configurations are validated against the JSON schema at `../company.config.schema.json`. This ensures:
- All required fields are present
- Field formats are correct (emails, phone numbers, app IDs)
- No typos or structural errors

## Need Help?

- See the [Configuration Guide](../docs/CONFIGURATION.md) for detailed documentation
- Check the [Quick Start Guide](../docs/QUICK_START.md) for setup instructions
- Review the [JSON Schema](../company.config.schema.json) for all available options

## Contributing

If you have a configuration example that would benefit others, please contribute it! Examples we'd love to see:
- Education sector configuration
- Government agency configuration
- Non-profit organization configuration
- Manufacturing or retail configuration
