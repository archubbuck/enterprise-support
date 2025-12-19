# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation improvements and repository organization
- CONTRIBUTING.md with contribution guidelines
- CODE_OF_CONDUCT.md for community guidelines
- CHANGELOG.md for tracking project changes
- Improved README with better structure and navigation
- GitHub issue templates for bug reports and feature requests
- Pull request template for standardized submissions
- Build performance optimizations documentation in iOS Development Guide

### Changed
- Reorganized documentation files into docs/ directory
- Updated cross-references between documentation files
- Improved LICENSE file with proper attribution

### Performance
- Optimized iOS build performance with CocoaPods caching in GitHub Actions
- Added build optimizations to Fastfile (Swift whole-module compilation)
- Disabled code signing for CocoaPods frameworks during build (speeds up "[CP] Embed Pods Frameworks" step)
- Enhanced Podfile with post_install hook for build optimization settings
- Expected 30-50% reduction in build times for CI/CD deployments

## [0.0.0] - Initial Release

### Added
- React-based mobile-first support document hub
- Native iOS app using Capacitor
- Document browsing with category organization
- Search functionality across all documents
- IT contact directory with regional information
- Offline support for all content
- Enterprise-agnostic configuration system
- Support for dynamic document loading from Markdown files
- Placeholder system for company-specific content

### Features
- 📱 Native iOS App support
- 📄 Document browser with categories
- 🔍 Search across all documents
- 📞 Contact directory
- 🌐 Full offline support
- 🎨 Modern, iOS-native UI design

### Technical Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Capacitor 7
- Framer Motion
- Radix UI components

[Unreleased]: https://github.com/archubbuck/enterprise-support/compare/v0.0.0...HEAD
[0.0.0]: https://github.com/archubbuck/enterprise-support/releases/tag/v0.0.0
