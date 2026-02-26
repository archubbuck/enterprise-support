# Content Management

This guide covers how maintainers manage support documents shown in the app.

## Content Sources

- Documents directory: `public/documents/`
- Manifest: `public/documents/manifest.json`

Each document is declared in the manifest and loaded at runtime.

## Supported Document Types

- `markdown` (default when omitted)
- `pdf`
- `word` (`.doc`, `.docx`)
- `image`
- unknown types fall back to external open

## Placeholders in Markdown

Markdown files can include placeholders resolved from app config, for example:

- `{companyName}`
- `{companyName.toUpperCase()}`
- `{emergencyEmail}`
- `{vpnPortal}`

## Add or Update Content

1. Add or edit files in `public/documents/`.
2. Update `manifest.json` entry (`id`, `title`, `category`, `icon`, `file`, optional `type`).
3. Run validation:

```bash
npm run validate:json
npm run dev
```

4. Verify documents open correctly in web app.
5. If releasing to iOS, run:

```bash
npm run ios:build
```

## Feature Flags

Document visibility can be affected by config feature flags:

- `APP_CONFIG_FEATURES_PDF_DOCUMENTS`
- `APP_CONFIG_FEATURES_WORD_DOCUMENTS`
- `APP_CONFIG_FEATURES_IMAGE_DOCUMENTS`

If disabled, matching document types are hidden.

## Operational Guardrails

- Keep one topic per document.
- Prefer stable file names to avoid broken manifest links.
- Validate every manifest change in CI before release.

## Related Docs

- [configuration.md](./configuration.md)
- [quick-start.md](./quick-start.md)
- [ios-development.md](./ios-development.md)
