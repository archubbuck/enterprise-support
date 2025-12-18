# Contributing to Enterprise Support App

Thank you for your interest in contributing to the Enterprise Support App! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. Please be considerate and professional in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/enterprise-support.git
   cd enterprise-support
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/archubbuck/enterprise-support.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Web Development

For most development work, use the web development server:

```bash
npm run dev
```

This starts a local server at `http://localhost:5173` with hot module reloading.

### iOS Development (Mac Only)

For iOS-specific changes:

```bash
# Build and sync to iOS
npm run ios:build

# Open in Xcode
npm run ios:open
```

See [docs/iOS_DEVELOPMENT.md](./docs/iOS_DEVELOPMENT.md) for detailed iOS development instructions.

### Making Changes

1. **Keep changes focused**: Each pull request should address a single feature or bug fix
2. **Test your changes**: Ensure your changes work in both web and iOS environments (if applicable)
3. **Follow coding standards**: Use the existing code style and conventions
4. **Update documentation**: If your changes affect usage or configuration, update relevant documentation

## Submitting Changes

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run linting**:
   ```bash
   npm run lint
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Test thoroughly**: Test your changes in the development environment

### Creating a Pull Request

1. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a pull request** on GitHub with:
   - Clear, descriptive title
   - Detailed description of changes
   - Reference to related issues (if applicable)
   - Screenshots (for UI changes)
   - Testing steps

3. **Respond to feedback**: Address any review comments promptly

### Pull Request Guidelines

- **Title**: Use clear, descriptive titles (e.g., "Add search functionality to document browser")
- **Description**: Explain what changed and why
- **Size**: Keep PRs reasonably sized for easier review
- **Commits**: Use meaningful commit messages
- **Documentation**: Update documentation for user-facing changes

## Coding Standards

### TypeScript/React

- Use TypeScript for all new code
- Follow React hooks best practices
- Use functional components over class components
- Keep components small and focused
- Use meaningful variable and function names

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (unless template literals)
- Add semicolons at the end of statements
- Use trailing commas in objects and arrays
- Follow existing code patterns in the repository

### Naming Conventions

- **Components**: PascalCase (e.g., `DocumentList.tsx`)
- **Files**: kebab-case for utilities (e.g., `document-utils.ts`)
- **Functions**: camelCase (e.g., `loadDocuments`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_DOCUMENTS`)

## Testing

Currently, this project does not have automated tests. When adding tests in the future:

- Test critical functionality
- Include both positive and negative test cases
- Test edge cases
- Ensure tests are maintainable

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Modify configuration options
- Update dependencies
- Change development workflows

### Documentation Files

- **README.md**: Overview, quick start, and key features
- **docs/QUICK_START.md**: Getting started guide for new developers
- **docs/CONFIGURATION.md**: Configuration options and examples
- **docs/iOS_DEVELOPMENT.md**: iOS-specific development guide
- **docs/DOCUMENTS.md**: Document management system documentation
- **CONTRIBUTING.md**: This file

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Use headings and lists for readability
- Keep examples up-to-date with current code
- Link to related documentation

## Adding Support Documents

To add new IT support documents:

1. Create a new Markdown file in `public/documents/`
2. Use placeholders for company-specific information:
   - `{companyName}` - Company name
   - `{companyName.toUpperCase()}` - Uppercase company name
   - `{emergencyEmail}` - Emergency contact email
   - `{vpnPortal}` - VPN portal URL
3. Add an entry to `public/documents/manifest.json`
4. Test that the document loads correctly

See [docs/DOCUMENTS.md](./docs/DOCUMENTS.md) for detailed instructions.

## Questions?

If you have questions about contributing:

- Check existing documentation
- Look at recent pull requests for examples
- Open an issue for discussion
- Reach out to maintainers

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
