# iOS Deployment Setup Guide

This guide walks you through setting up the iOS deployment pipeline for the Enterprise Support app. Follow these steps to enable automated App Store deployment via GitHub Actions.

## Overview

The deployment workflow (`.github/workflows/deploy.yml`) automatically builds and uploads your app to App Store Connect when you push a version tag (e.g., `v1.0.0`). Before using it, you need to:

1. ✅ Configure required GitHub repository secrets
2. ✅ Set up Apple certificates (one-time setup)
3. ✅ Verify the copyright file
4. ✅ Create a version tag to trigger deployment

## Prerequisites

- Active Apple Developer Program membership
- App Store Connect account/user with Admin or App Manager role
- GitHub repository with appropriate permissions
- Private repository for storing certificates

## Step 1: Configure Required Secrets

The deployment workflow requires seven secrets to be configured in your GitHub repository. Go to **Settings → Secrets and variables → Actions** and add each of the following:

### Required Secrets

| Secret Name | Description | Where to Find It |
|-------------|-------------|------------------|
| `MATCH_PASSWORD` | Password to encrypt/decrypt certificates | Create a strong passphrase (save it securely!) |
| `MATCH_GIT_URL` | Git URL of your certificates repository | `https://github.com/your-org/your-app-certificates` |
| `GIT_AUTHORIZATION` | GitHub Personal Access Token with `repo` scope | [Create at GitHub Settings](https://github.com/settings/tokens) |
| `APPSTORE_ISSUER_ID` | App Store Connect API Issuer ID | [App Store Connect → Keys](https://appstoreconnect.apple.com/access/api) |
| `APPSTORE_KEY_ID` | App Store Connect API Key ID | [App Store Connect → Keys](https://appstoreconnect.apple.com/access/api) |
| `APPSTORE_P8` | App Store Connect API .p8 key content | Download from App Store Connect (raw text) |
| `APPLE_TEAM_ID` | Your Apple Developer Team ID | [Apple Developer Account](https://developer.apple.com/account) |

### Detailed Setup Instructions

#### 1. Create Certificate Repository

Create a **private** GitHub repository to store your certificates:

```bash
# Example repository name
your-organization/your-app-certificates
```

This repository will be used by Fastlane Match to store and sync iOS signing certificates.

#### 2. Create GitHub Personal Access Token

1. Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name: "iOS Match Certificate Access"
4. Scopes: Select `repo` (Full control of private repositories)
5. Set expiration date (recommended: 90 days, then rotate)
6. Click "Generate token"
7. **Copy the generated token** — you won't see it again!
8. Save the token value as the `GIT_AUTHORIZATION` secret (paste the token string exactly as shown)

#### 3. Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to: **Users and Access → Keys → App Store Connect API**
3. Click the **+** button to create a new key
4. Name: "GitHub Actions Deployment"
5. Access: Select "Admin" or "App Manager"
6. Click "Generate"
7. **Download the .p8 file** - you can only download it once!
8. **Copy the Key ID** (shown in the keys list)
9. **Copy the Issuer ID** (shown at the top of the keys page)

Save these values:
- `APPSTORE_ISSUER_ID`: The Issuer ID (UUID format)
- `APPSTORE_KEY_ID`: The Key ID (10 characters)
- `APPSTORE_P8`: Open the .p8 file in a text editor and copy the entire content

#### 4. Set MATCH_PASSWORD

Create a strong password for encrypting your certificates. This should be:
- At least 12 characters long
- Include letters, numbers, and special characters
- Stored securely (you'll need it if you ever need to access certificates manually)

#### 5. Find Your Apple Team ID

1. Go to [Apple Developer Account](https://developer.apple.com/account)
2. Navigate to **Membership Details**
3. Copy your **Team ID** (10-character alphanumeric code)
4. Save as `APPLE_TEAM_ID` secret

#### 6. Configure MATCH_GIT_URL

Use the HTTPS URL of your certificates repository:

```
https://github.com/your-organization/your-app-certificates
```

**Note:** Use HTTPS format, not SSH format.

## Step 2: Verify Copyright File

The deployment workflow validates that your copyright file exists and is properly formatted.

**File location:** `ios/App/fastlane/metadata/copyright.txt`

**Valid formats:**
- `© 2025 Enterprise Support` (recommended)
- `© Enterprise Support` (year added automatically)
- `2025 Enterprise Support` (© added automatically)
- `Enterprise Support` (both © and year added automatically)

**Requirements:**
- Company name must be at least 2 characters
- Must contain at least one letter
- File must not be empty

**To update:**

```bash
# Edit the copyright file
echo "© 2025 Your Company Name" > ios/App/fastlane/metadata/copyright.txt

# Commit the change
git add ios/App/fastlane/metadata/copyright.txt
git commit -m "Update copyright for deployment"
git push
```

## Step 3: Run One-Time Certificate Setup

After configuring all secrets, run the certificate setup workflow **once**:

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select **"iOS One-Time Match Setup"** from the workflows list
4. Click **"Run workflow"** button
5. Select the branch (usually `main`)
6. Click **"Run workflow"**

This workflow will:
- Generate iOS signing certificates
- Create provisioning profiles
- Store them securely in your certificates repository

**Duration:** ~15-20 minutes

**Important:** You only need to run this once, unless you:
- Add new devices to your provisioning profiles
- Add new app capabilities
- Need to regenerate expired certificates

## Step 4: Deploy to App Store

Once setup is complete, you can deploy to the App Store by creating a version tag:

```bash
# Ensure you're on the main branch and up to date
git checkout main
git pull

# Create a version tag (must start with 'v')
git tag v1.0.0

# Push the tag to trigger deployment
git push origin v1.0.0
```

**Tag format requirements:**
- ✅ Must start with `v`
- ✅ Version must be numeric with at least two dot-separated components, no suffixes (e.g., `v1.0`, `v1.0.0`, `v1.2.3`, `v2.3.4.5`)
- ❌ Invalid: `release/2026.01.26` (wrong prefix/format), `1.0.0` (missing `v`), `v1` (only one numeric component), `v1.0-beta` / `v1.0.0-beta` (suffix not allowed)

The deployment workflow will automatically:
1. Build the web application
2. Sync with Capacitor
3. Build the iOS app with proper code signing
4. Upload to App Store Connect

**Duration:** ~30-45 minutes

## Validation Components

The deployment workflow includes automatic validation steps:

### 1. Secret Validation

**File:** `.github/actions/validate-secrets/action.yml`

**What it does:**
- Checks that all 7 required secrets are configured
- Validates that secrets are not empty
- Provides helpful error messages if secrets are missing

**Script:** `scripts/lib/validate-secrets.sh`

If validation fails, you'll see detailed instructions in the workflow logs explaining which secrets are missing and how to configure them.

### 2. Copyright Validation

**File:** `.github/actions/verify-copyright/action.yml`

**What it does:**
- Verifies copyright file exists at `ios/App/fastlane/metadata/copyright.txt`
- Validates copyright format and content
- Ensures company name meets minimum requirements

**Script:** `scripts/lib/validate-copyright.sh`

If validation fails, the error message will explain the expected format and what's wrong with the current content.

## Troubleshooting

### Validation Errors

#### "Validation script not found"

**Cause:** Required validation script is missing from the repository.

**Solution:** Ensure these files exist:
- `scripts/lib/validate-secrets.sh`
- `scripts/lib/validate-copyright.sh`

These files are version-controlled and should exist in the repository. If missing, they may have been accidentally deleted.

#### "Missing required GitHub Actions secrets"

**Cause:** One or more required secrets are not configured.

**Solution:**
1. Check the error message to see which secrets are missing
2. Go to Settings → Secrets and variables → Actions
3. Add the missing secrets following the table in Step 1
4. Re-run the workflow

#### "Copyright file not found"

**Cause:** The copyright file doesn't exist at the expected location.

**Solution:**

```bash
# Create the file
echo "© 2025 Your Company Name" > ios/App/fastlane/metadata/copyright.txt

# Commit and push
git add ios/App/fastlane/metadata/copyright.txt
git commit -m "Add copyright file for App Store metadata"
git push
```

#### "Copyright format invalid"

**Cause:** The copyright file content doesn't meet format requirements.

**Solution:** Update the file to use one of the valid formats listed in Step 2.

### Deployment Errors

#### "Git tag doesn't match expected format"

**Cause:** You pushed a tag that doesn't start with `v` or used an invalid format.

**Solution:**

```bash
# Delete the invalid tag locally and remotely
git tag -d release/2025.01.26.1
git push origin :refs/tags/release/2025.01.26.1

# Create a proper version tag
git tag v1.0.0
git push origin v1.0.0
```

#### "Authentication failed" during certificate sync

**Cause:** `GIT_AUTHORIZATION` token is invalid, expired, or has insufficient permissions.

**Solution:**
1. Generate a new Personal Access Token with `repo` scope
2. Update the `GIT_AUTHORIZATION` secret
3. Re-run the workflow

#### "Certificate expired"

**Cause:** Your iOS signing certificates have expired.

**Solution:**
1. Run the "iOS One-Time Match Setup" workflow again
2. This will generate new certificates and provisioning profiles

## Testing the Setup

### Test Secret Validation Locally

```bash
# Set dummy values for testing
export MATCH_PASSWORD="test"
export MATCH_GIT_URL="test"
export GIT_AUTHORIZATION="test"
export APPSTORE_ISSUER_ID="test"
export APPSTORE_KEY_ID="test"
export APPSTORE_P8="test"
export APPLE_TEAM_ID="test"

# Run the validation test
bash scripts/test-secret-validation.sh
```

### Test Copyright Validation Locally

```bash
# Run the copyright validation test
bash scripts/test-copyright-validation.sh
```

Both test scripts should pass with all tests showing ✓ PASS.

## Security Best Practices

1. **Never commit secrets to the repository**
   - Always use GitHub Secrets for sensitive values
   - Add `.p8` files to `.gitignore`

2. **Rotate credentials regularly**
   - Set expiration dates on Personal Access Tokens
   - Rotate App Store Connect API keys annually

3. **Use least privilege access**
   - API keys should have minimum required permissions
   - Consider using "App Manager" instead of "Admin" if sufficient

4. **Secure your certificate repository**
   - Keep it private
   - Limit access to essential team members only
   - Enable branch protection rules

5. **Monitor workflow runs**
   - Review deployment workflow logs
   - Set up notifications for failed deployments
   - Audit secret usage regularly

## Next Steps

After completing this setup:

1. ✅ Test deployment with a version tag
2. ✅ Monitor the workflow run in the Actions tab
3. ✅ Check App Store Connect for the uploaded build
4. ✅ Submit for TestFlight or App Store review

## Additional Resources

- [CI/CD Pipeline Documentation](./CI_CD.md) - Overview of all workflows
- [iOS Development Guide](./iOS_DEVELOPMENT.md) - Detailed iOS development instructions
- [Fastlane Match Documentation](https://docs.fastlane.tools/actions/match/) - Certificate management
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi) - API reference

## Support

If you encounter issues not covered in this guide:

1. Check workflow logs in the Actions tab
2. Review error messages carefully - they often include solutions
3. Verify all secrets are correctly configured
4. Ensure the copyright file exists and is valid
5. Create an issue with:
   - Description of the problem
   - Link to failing workflow run
   - Steps you've already tried
   - Relevant error messages (with secrets redacted)
