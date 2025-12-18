### Summary
The `iOS One-Time Match Setup` workflow is failing due to two main issues:

1. **Fastlane Installation Method**:
   The step currently uses Homebrew to install Fastlane:
   ```yaml
   - name: Install Fastlane
     run: brew install fastlane
   ```
   However, this is causing conflicts, as Fastlane suggests installation via RubyGems.

2. **Invalid Option `--git_url`**:
   The command `fastlane match init --git_url` is producing the error `invalid option: --git_url` during execution.

---

### Proposed Fixes:

1. **Update Fastlane Installation**:
   Replace the Homebrew-based Fastlane installation step with RubyGems installation:
   ```yaml
   - name: Install Fastlane
     run: gem install fastlane
   ```

2. **Fix Match Command**:
   Remove the `--git_url` flag entirely from the `fastlane match init` step. Additionally, verify that the required certificates repository is set correctly in the environment or initialized through interactive means:
   ```yaml
   - name: Run Match Init
     run: |
       fastlane match init
       fastlane match appstore --app_identifier "your.bundle.id"
     env:
       MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
       APPSTORE_ISSUER_ID: ${{ secrets.APPSTORE_ISSUER_ID }}
       APPSTORE_KEY_ID: ${{ secrets.APPSTORE_KEY_ID }}
       APPSTORE_P8: ${{ secrets.APPSTORE_P8 }}
   ```

---

### Request:
Please make the above changes to the workflow located at:
[.github/workflows/setup_match.yml@6c259ae57b6b4c6ea5737669268593e97218e204](https://github.com/archubbuck/enterprise-support/blob/6c259ae57b6b4c6ea5737669268593e97218e204/.github/workflows/setup_match.yml)

---

### Metadata
- **Logged in User**: archubbuck
- **Date of Submission**: 2025-12-18 21:53:04