# Enterprise Support App

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/archubbuck/enterprise-support/actions/workflows/ci.yml/badge.svg)](https://github.com/archubbuck/enterprise-support/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)

> A mobile-first support document hub for employees to quickly access curated IT support documents and contact information, designed to work offline.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [Platform Support](#platform-support)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application is built as a React web application that is packaged as a native iOS app using Capacitor. This allows the app to be distributed through the App Store while maintaining a single codebase.

**Key Benefits:**
- ✅ Single codebase for web and iOS
- ✅ Enterprise-agnostic and easily customizable
- ✅ Full offline support
- ✅ Easy content management with Markdown files

## Getting Started

### Quick Start

```bash
# Clone the repository
git clone https://github.com/archubbuck/enterprise-support.git
cd enterprise-support

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app running.

📖 **New to this project?** Check out the [Quick Start Guide](./docs/QUICK_START.md) for detailed setup instructions.

## Configuration

This app is designed to be enterprise-agnostic. To customize it for your organization, edit the `company.config.json` file in the root directory:

```json
{
  "companyName": "Your Company",
  "appName": "Your Company Support",
  "appId": "com.yourcompany.support",
  "appSubtitle": "IT Help & Documentation",
  "domain": "yourcompany.com",
  "vpnPortal": "vpn.yourcompany.com",
  "contacts": {
    "email": "ithelpdesk@yourcompany.com",
    "emergencyEmail": "security@yourcompany.com",
    "regions": [
      // Your company's regional contact information
    ]
  }
}
```

📖 **Learn more:** See the [Configuration Guide](./docs/CONFIGURATION.md) for detailed configuration options.

## Features

### Core Features

- 📱 **Native iOS App** - Runs as a native app on iPhone and iPad
- 📄 **Document Browser** - Browse IT support documents by category
- 🔍 **Search** - Quick search across all documents
- 📞 **Contact Directory** - Quick access to IT support contacts
- 🌐 **Offline Support** - All content available offline
- 🎨 **Modern UI** - Clean, iOS-native design

### Developer Features

- ⚡ **Fast Development** - Hot module reloading with Vite
- 🎯 **Type Safety** - Full TypeScript support
- 📝 **Markdown Content** - Easy document management
- 🔧 **Configurable** - Enterprise-agnostic configuration system
- 🧩 **Component Library** - Built with Radix UI primitives

## Development

### Web Development (Windows & Mac)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The development server runs at `http://localhost:5173`

### iOS Development (Mac Only)

**Prerequisites:** macOS, Xcode, CocoaPods

```bash
# Build and sync to iOS
npm run ios:build

# Open in Xcode
npm run ios:open

# Full workflow (build + open)
npm run ios:run
```

📖 **iOS Setup:** See the [iOS Development Guide](./docs/iOS_DEVELOPMENT.md) for complete instructions including Windows development options.

## Documentation

Comprehensive documentation is available to help you get started and work with this project:

- 📚 [Quick Start Guide](./docs/QUICK_START.md) - Get up and running quickly
- ⚙️ [Configuration Guide](./docs/CONFIGURATION.md) - Customize for your organization
- 📱 [iOS Development Guide](./docs/iOS_DEVELOPMENT.md) - iOS-specific development instructions
- 📝 [Document Management](./docs/DOCUMENTS.md) - Managing support documents
- 🚀 [CI/CD Pipeline](./docs/CI_CD.md) - Continuous integration and deployment
- 🔧 [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) - Fix common issues
- 🤝 [Contributing Guide](./CONTRIBUTING.md) - How to contribute to this project
- 📋 [Changelog](./CHANGELOG.md) - Track project changes

## Project Structure

```
enterprise-support/
├── src/                   # React source code
│   ├── components/        # React components
│   ├── lib/              # Utilities and data
│   └── App.tsx           # Main application
├── docs/                 # Documentation files
├── public/               # Static assets
│   └── documents/        # Support document markdown files
├── ios/                  # iOS native project (generated by Capacitor)
├── dist/                 # Built web assets (generated)
├── company.config.json   # Company-specific configuration
├── capacitor.config.ts   # Capacitor configuration
└── package.json          # Dependencies and scripts
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Capacitor** - Native iOS wrapper
- **Framer Motion** - Animations
- **Radix UI** - Component primitives

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run validate:json` - Validate all JSON files
- `npm run check` - Run all validation checks (JSON + lint)
- `npm run ios:build` - Build and sync to iOS
- `npm run ios:open` - Open project in Xcode (Mac only)
- `npm run ios:run` - Build, sync, and open in Xcode (Mac only)

## Platform Support

- ✅ **iOS** - Full native app support
- ✅ **Web** - Progressive Web App
- 🚧 **Android** - Can be added with `@capacitor/android`

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Setting up your development environment
- Coding standards and best practices
- Submitting pull requests
- Reporting issues

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## Support

- 📖 Check the [documentation](./docs/)
- 🐛 [Report bugs](https://github.com/archubbuck/enterprise-support/issues/new?template=bug_report.md)
- 💡 [Request features](https://github.com/archubbuck/enterprise-support/issues/new?template=feature_request.md)
- 📝 [Documentation issues](https://github.com/archubbuck/enterprise-support/issues/new?template=documentation.md)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

The Spark Template files and resources from GitHub are licensed under the terms of the MIT License, Copyright GitHub, Inc.
