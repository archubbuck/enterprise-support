# Quick Start

## Prerequisites

- Node.js `22+` and npm `10+`
- For iOS work: macOS, Xcode, CocoaPods

## Initial Setup

```bash
npm install
cp .env.example .env.development
```

Edit `.env.development` and set your `APP_CONFIG_*` values.

## Daily Development (All Platforms)

```bash
npm run dev
```

Open `http://localhost:5173`.

Validation/build:

```bash
npm run validate:all
npm run build
```

## iOS Workflow (macOS only)

```bash
npm run ios:build
npm run ios:open
```

In Xcode, run on a simulator or connected device.

## Windows Maintainers

Windows maintainers can complete feature, configuration, and content work in web mode. iOS binary/signing/release steps must be executed by a macOS release owner.

## Next Docs

- [configuration.md](./configuration.md)
- [content-management.md](./content-management.md)
- [ios-development.md](./ios-development.md)
- [release-operations.md](./release-operations.md)

