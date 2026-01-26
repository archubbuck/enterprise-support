# CI/CD Pipeline Documentation

## Overview

This repository uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline ensures code quality and reliability by automatically validating every change.

## Workflows

### 1. Continuous Integration (CI)

**File:** `.github/workflows/ci.yml`

**Triggers:**
- Pull requests to `main` branch
- Pushes to `main` branch

**What it does:**
1. Checks out the repository code
2. Sets up Node.js 22 (as specified in `.nvmrc`)
3. Installs dependencies with npm
4. Validates all JSON files for syntax errors
5. Runs ESLint to check code quality
6. Builds the application to ensure no build errors

**Duration:** ~5-10 minutes

**Purpose:** Prevents broken code from being merged into the main branch

### 2. Automated Release

**File:** `.github/workflows/release.yml`

**Triggers:**
- Pushes to `main` branch (automatic)

**What it does:**
1. Builds the web application to validate it's production-ready
2. Syncs with Capacitor to ensure iOS compatibility
3. Generates a date-based semantic version tag (format: `release/YYYY.MM.DD.BUILD`)
4. Creates and pushes the version tag
5. Generates release notes from commit messages since the last release
6. Creates a GitHub release with the generated notes

**Duration:** ~5-8 minutes

**Runner:** macOS (for full iOS validation including CocoaPods integration)

**Purpose:** Automatically creates a release for every change merged to main, eliminating manual release tag creation and ensuring all changes are properly versioned, built, and released. The build and sync steps validate that the code is deployment-ready. Runs on macOS to ensure complete iOS validation including native dependencies.

**Version Format:** The workflow uses date-based semantic versioning with `release/` prefix:
- `release/2025.12.30.1` - First release on December 30, 2025
- `release/2025.12.30.2` - Second release on the same day
- Build number increments for multiple releases on the same day

**Important:** Automated releases use the `release/*` tag pattern and **do not** trigger App Store deployment. To deploy to the App Store, manually create a tag with the `v*` pattern (see App Store Deployment section below).

### 3. Deploy to App Store

**File:** `.github/workflows/deploy.yml`

**Triggers:**
- When a version tag is pushed (e.g., `v1.0.0`)

**What it does:**
1. Builds the web application
2. Syncs with Capacitor
3. Builds the iOS app
4. Uploads to App Store Connect

**Duration:** ~30-45 minutes

**Requirements:**
- Repository secrets must be configured (see iOS deployment docs)
- Certificate setup must be completed first

**Note:** This workflow has been optimized by removing redundant verification steps that added unnecessary time to the deployment process.

### 4. iOS One-Time Match Setup

**File:** `.github/workflows/setup_match.yml`

**Triggers:**
- Manual workflow dispatch only

**What it does:**
1. Generates iOS signing certificates
2. Creates provisioning profiles
3. Stores them in a private certificates repository

**Duration:** ~15-20 minutes

**Note:** This should only be run once during initial setup

## Local Development

### Running CI Checks Locally

Before pushing code, you can run the same checks locally:

```bash
# Validate JSON files
npm run validate:json

# Run linting
npm run lint

# Build the application
npm run build

# Run all checks at once
npm run check
```

### Node.js Version

This project requires Node.js 22 or higher. The version is specified in:
- `.nvmrc` file
- `package.json` engines field
- All GitHub Actions workflows

To use the correct version locally with nvm:

```bash
nvm use
```

## Understanding CI Failures

### JSON Validation Failures

**Common causes:**
- Trailing commas in JSON files
- Comments in JSON files (not allowed)
- Missing quotes around keys or values
- Mismatched brackets/braces

**How to fix:**
1. Check the error message for the file and line number
2. Open the file and navigate to the problematic line
3. Fix the JSON syntax error
4. Run `npm run validate:json` to verify
5. Commit and push the fix

### Linting Failures

**Common causes:**
- Unused variables
- Missing semicolons (if required by config)
- Incorrect indentation
- Code style violations

**How to fix:**
1. Review the ESLint error messages
2. Many issues can be auto-fixed: `npm run lint -- --fix`
3. For warnings, evaluate if they should be fixed or suppressed
4. Commit the fixes

### Build Failures

**Common causes:**
- TypeScript type errors
- Missing dependencies
- Import errors
- Configuration issues

**How to fix:**
1. Check the build error messages carefully
2. Ensure all dependencies are installed: `npm ci`
3. Fix TypeScript errors or import issues
4. Test locally: `npm run build`
5. Commit the fixes

## Deployment Process

### Automated GitHub Releases

**Every merge to `main` automatically creates a release:**

1. Make changes on a feature branch
2. Create a pull request to `main`
3. CI runs automatically and must pass
4. After review and approval, merge to `main`
5. **Automatic:** The release workflow runs and creates a GitHub release with a date-based version tag
6. **Automatic:** Release notes are generated from commit messages

**No manual tagging required!** The system automatically:
- Creates version tags with `release/` prefix (e.g., `release/2025.12.30.1`)
- Generates release notes from commits
- Publishes the release on GitHub

**Important:** Automated releases are for tracking changes on GitHub only and **do not** trigger App Store deployment.

### App Store Deployment

**Automated releases do NOT deploy to the App Store.** To deploy to the App Store, you must manually create a version tag:

**Manual tagging for App Store deployment:**

When you're ready to deploy a specific commit to the App Store:
   ```bash
   git checkout main
   git pull
   git tag v1.0.0
   git push origin v1.0.0
   ```
The deploy workflow will run automatically and upload the app to App Store Connect.

**Tag Patterns:**
- `release/*` - Automated GitHub releases only (no App Store deployment)
- `v*` - Manual tags that trigger App Store deployment

This separation ensures that:
- Every commit to main is tracked as a release on GitHub
- Only explicitly tagged versions are deployed to the App Store
- You have full control over which versions go to production

#### Version and Build Number Management

**How versioning works for App Store deployment:**

When you push a version tag (e.g., `v1.2.3`), the deployment workflow automatically:

1. **Extracts the version** from the git tag:
   - Tag `v1.2.3` → Version `1.2.3`
   - The `v` prefix is required and automatically removed

2. **Sets the Marketing Version** (CFBundleShortVersionString):
   - This is the user-facing version shown in the App Store
   - Set directly from the git tag (e.g., `1.2.3`)

3. **Sets the Build Number** (CFBundleVersion):
   - Format: `{version}.{commit_count}` (e.g., `1.2.3.42`)
   - Combines the version with the git commit count for uniqueness
   - Ensures each build is unique and monotonically increasing

**Version Format Requirements:**

Your git tags must follow these rules:
- ✅ **Valid formats**: `v1.0.0`, `v1.2.3`, `v2.0.0.1`
- ✅ Must start with `v` followed by numeric version
- ✅ Must use period-separated integers only
- ❌ **Invalid formats**: `v1.0-beta`, `v1.0.0-rc1`, `1.0.0` (missing `v`)

**Example:**

```bash
# Create and push a version tag
git tag v1.2.3
git push origin v1.2.3

# Result in App Store Connect:
# - Marketing Version: 1.2.3
# - Build Number: 1.2.3.42 (where 42 is the git commit count)
```

**Why this approach?**

- **Consistency**: Version and build always reflect the git tag
- **Traceability**: You can trace any App Store build back to its git tag
- **Uniqueness**: Each build has a unique build number (version + commit count)
- **No manual updates**: No need to manually update version in Xcode
- **No mismatches**: Impossible to deploy with version different from git tag

**Important Notes:**

- The deployment workflow **requires** a valid `v*` tag to run
- If the tag format is invalid, deployment will fail with a clear error message
- The commit count ensures each build is unique, even for the same version
- You cannot deploy without a properly formatted version tag

### Emergency Fixes

If the main branch is broken:

1. Create a hotfix branch
2. Make the minimal fix required
3. Create PR and wait for CI to pass
4. Fast-track review if needed
5. Merge and deploy following normal process

## Monitoring Workflows

### Viewing Workflow Runs

1. Go to the repository on GitHub
2. Click the "Actions" tab
3. Select a workflow from the left sidebar
4. View recent runs and their status

### Understanding Status Badges

In pull requests, you'll see status checks:
- ✅ Green checkmark: All checks passed
- ❌ Red X: One or more checks failed
- 🟡 Yellow dot: Checks are running
- ⚪ Gray circle: Checks haven't started

### Getting Notifications

Configure notification settings in GitHub:
- Settings → Notifications → Actions
- Choose when to receive alerts about workflow failures

## Best Practices

### Before Committing

1. Run `npm run check` locally
2. Fix any issues found
3. Commit only when checks pass

### Pull Request Guidelines

1. Keep PRs focused and small
2. Ensure CI passes before requesting review
3. Fix CI failures promptly
4. Don't merge PRs with failing checks

### Working with Node.js

1. Always use the correct Node version (22)
2. Run `npm ci` instead of `npm install` for reproducible builds
3. Don't commit `node_modules` or `dist` folders
4. Keep `package-lock.json` in sync

### Handling Warnings

CI may show warnings that don't fail the build:
- Review warnings and fix them when possible
- Don't ignore security warnings
- Document any warnings that can't be fixed

## Troubleshooting

### CI is slower than usual

**Possible causes:**
- GitHub Actions runner availability
- Large dependency installation
- Complex build process

**Solutions:**
- Be patient, especially during peak hours
- Dependency caching is enabled to speed up runs
- Consider optimizing build if consistently slow

### CI passes locally but fails in GitHub

**Possible causes:**
- Different Node.js versions
- Platform-specific issues (Windows vs Linux)
- Missing environment variables

**Solutions:**
- Verify Node.js 22 is being used: `node --version`
- Check that all files are committed
- Review workflow logs for specific errors

### Deployment workflow fails

See `docs/iOS_DEVELOPMENT.md` for iOS-specific troubleshooting.

Common issues:
- Missing or expired certificates
- Incorrect secret configuration
- App Store Connect API issues

## Security Considerations

### Secrets Management

Never commit secrets to the repository. All sensitive values are stored as GitHub Secrets:
- `MATCH_PASSWORD`
- `MATCH_GIT_URL`
- `GIT_AUTHORIZATION`
- `APPSTORE_ISSUER_ID`
- `APPSTORE_KEY_ID`
- `APPSTORE_P8`
- `APPLE_TEAM_ID`

### Workflow Permissions

Workflows run with minimal required permissions:
- `contents: read` for most workflows
- `contents: write` for automated release workflow (to create tags and releases)
- `contents: write` only when needed for certificate setup

### Dependency Security

- Dependabot monitors for vulnerable dependencies
- Review and merge Dependabot PRs promptly
- Run `npm audit` periodically

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [iOS Development Guide](./iOS_DEVELOPMENT.md)
- [Quick Start Guide](./QUICK_START.md)

## Support

If you encounter issues with the CI/CD pipeline:

1. Check this documentation
2. Review recent workflow runs in the Actions tab
3. Check troubleshooting documentation
4. Create an issue with:
   - Description of the problem
   - Link to failing workflow run
   - Steps you've already tried
   - Relevant error messages
