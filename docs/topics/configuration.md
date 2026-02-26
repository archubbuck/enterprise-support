# Configuration

This app is configured through `APP_CONFIG_*` values in env files.

## Setup

```bash
cp .env.example .env.development
```

Edit `.env.development` with organization values.

## File Precedence

Loaded in order (later overrides earlier):

1. `.env`
2. `.env.local`
3. `.env.<mode>`
4. `.env.<mode>.local`

## Required Keys (minimum)

- `APP_CONFIG_COMPANY_NAME`
- `APP_CONFIG_APP_NAME`
- `APP_CONFIG_APP_ID`
- `APP_CONFIG_DOMAIN`
- `APP_CONFIG_CONTACTS_EMAIL`

See `.env.example` for full supported keys.

## Validation Commands

```bash
npm run validate:app-config
npm run validate:json
npm run validate:all
```

Use `validate:all` as the standard pre-merge and pre-release check.

## Example

```dotenv
APP_CONFIG_COMPANY_NAME=Contoso
APP_CONFIG_APP_NAME=Contoso Support
APP_CONFIG_APP_ID=com.contoso.support
APP_CONFIG_DOMAIN=contoso.com
APP_CONFIG_CONTACTS_EMAIL=ithelpdesk@contoso.com
APP_CONFIG_CONTACTS_REGIONS_JSON=[{"region":"Americas","city":"Charlotte, NC (HQ)","phone":"+1 (704) 805-7200","hours":"7:00 AM - 7:00 PM EST"}]
APP_CONFIG_FEATURES_TAG_FILTERING=true
APP_CONFIG_FEATURES_PDF_DOCUMENTS=true
APP_CONFIG_FEATURES_WORD_DOCUMENTS=true
APP_CONFIG_FEATURES_IMAGE_DOCUMENTS=true
```

## Operational Notes

- Treat `.env*` values as public in client apps; never store secrets.
- `APP_CONFIG_APP_ID` must match iOS signing/provisioning and App Store usage.
- After config changes affecting iOS metadata, run `npm run ios:build` on macOS.

## Scenario Guidance

- Startup: minimal required values and one support contact.
- Regional: add `APP_CONFIG_CONTACTS_REGIONS_JSON` with multiple offices.
- Enterprise: include emergency contact and complete regional coverage.

## Related Docs

- [quick-start.md](./quick-start.md)
- [content-management.md](./content-management.md)
- [release-operations.md](./release-operations.md)
