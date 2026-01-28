# Fastlane Scripts

This directory contains utility scripts used by fastlane lanes.

## inject_metadata.rb

Injects metadata values from environment variables into fastlane metadata files.

### Purpose

This script prevents sensitive information (phone numbers, emails, demo credentials) from being committed to the repository by allowing these values to be defined as environment variables instead.

### Usage

The script is automatically called by the `release` lane before uploading to App Store Connect:

```ruby
# In Fastfile
lane :release do
  sh("ruby scripts/inject_metadata.rb")
  # ... rest of release process
end
```

### Manual Testing

You can test the script manually:

```bash
cd ios/App/fastlane

# Set environment variables
export METADATA_REVIEW_FIRST_NAME="John Doe"
export METADATA_REVIEW_EMAIL="john@example.com"

# Run the script
ruby scripts/inject_metadata.rb

# Verify the output
cat metadata/review_information/first_name.txt
```

### Environment Variables

See `.env.example` for a complete list of supported environment variables.

### Behavior

- Only non-empty environment variables are injected
- Empty or missing variables are skipped
- The script creates parent directories if they don't exist
- Existing file contents are overwritten with environment variable values
- The script exits with status 1 on errors

### Integration with CI/CD

In GitHub Actions or other CI environments, set these as repository secrets:

```yaml
- name: Deploy to App Store
  env:
    METADATA_REVIEW_FIRST_NAME: ${{ secrets.METADATA_REVIEW_FIRST_NAME }}
    METADATA_REVIEW_EMAIL: ${{ secrets.METADATA_REVIEW_EMAIL }}
    # ... other metadata variables
  run: |
    cd ios/App
    bundle exec fastlane release
```
