# Architecture

This document is the technical source of truth for maintainers taking ownership of the app.

## System Overview

The repository is a React + TypeScript app built with Vite and wrapped as a native iOS app with Capacitor.

- Web app source: `src/`
- Static support content: `public/documents/`
- iOS native project: `ios/App/`
- Configuration source: `.env*` via `APP_CONFIG_*`

## Runtime Flow

1. `src/main.tsx` boots the app and mounts `src/app.tsx`.
2. `src/hooks/use-app-config.tsx` reads and validates environment-driven configuration.
3. Document metadata is loaded from `public/documents/manifest.json`.
4. Document content is loaded on demand from `public/documents/*`.
5. File-type viewers are selected by document type (markdown/pdf/word/image/unknown fallback).

## Content Pipeline

Content is file-based and shipped with the app bundle.

- Manifest defines document metadata (`id`, `title`, `category`, `icon`, `file`, optional `type`).
- Markdown placeholders are resolved at runtime from app configuration.
- Non-markdown files use file URLs directly.
- During iOS builds, Capacitor copies `public/` into the iOS bundle.

For document operations, see [content-management.md](../topics/content-management.md).

## Configuration Model

App behavior and branding are controlled by `APP_CONFIG_*` values in env files.

- Required fields (company/app/contact/domain) are validated.
- Feature flags gate optional capabilities (for example tag filtering and document type support).
- Native metadata (`appId`, app display values) is derived from the same config path.

For full key reference and validation commands, see [configuration.md](../topics/configuration.md).

## Platform Boundaries

- Web development runs fully on Windows/macOS via Vite.
- iOS binary build/signing requires macOS + Xcode.
- Windows teams can complete almost all feature/content work and hand off iOS release execution.

For platform workflows, see [quick-start.md](../topics/quick-start.md), [ios-development.md](../topics/ios-development.md), and [release-operations.md](../topics/release-operations.md).

## CI/CD and Release Architecture

- `.github/workflows/ci.yml`: validation/build checks.
- `.github/workflows/release.yml`: automated GitHub release tagging (`release/*`).
- `.github/workflows/deploy.yml`: App Store deployment for manual `v*` tags.
- `.github/workflows/setup-match.yml`: one-time signing bootstrap.

Release operations are documented in [release-operations.md](../topics/release-operations.md).

## Ownership Notes

When transferring ownership:

- Treat this file as the technical map and keep it updated for structural changes.
- Keep operational procedures in [runbook.md](../topics/runbook.md).
- Keep user-facing setup short in [quick-start.md](../topics/quick-start.md).
