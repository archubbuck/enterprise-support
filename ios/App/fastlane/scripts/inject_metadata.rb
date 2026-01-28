#!/usr/bin/env ruby
# frozen_string_literal: true

# Script to inject metadata values from environment variables into fastlane metadata files
# This prevents sensitive information (like phone numbers, emails) from being committed to git
#
# Usage: ruby inject_metadata.rb
#
# Environment variables are mapped to metadata files as follows:
# - METADATA_REVIEW_FIRST_NAME -> metadata/review_information/first_name.txt
# - METADATA_REVIEW_LAST_NAME -> metadata/review_information/last_name.txt
# - etc.

require 'fileutils'

# Base directory for metadata files
METADATA_DIR = File.expand_path('../metadata', __dir__)

# Mapping of environment variables to metadata file paths
# Format: { 'ENV_VAR_NAME' => 'relative/path/to/file.txt' }
METADATA_MAPPING = {
  # Review Information (sensitive)
  'METADATA_REVIEW_FIRST_NAME' => 'review_information/first_name.txt',
  'METADATA_REVIEW_LAST_NAME' => 'review_information/last_name.txt',
  'METADATA_REVIEW_PHONE' => 'review_information/phone_number.txt',
  'METADATA_REVIEW_EMAIL' => 'review_information/email_address.txt',
  'METADATA_REVIEW_DEMO_USER' => 'review_information/demo_user.txt',
  'METADATA_REVIEW_DEMO_PASSWORD' => 'review_information/demo_password.txt',
  'METADATA_REVIEW_NOTES' => 'review_information/notes.txt',

  # Trade Representative Contact Information (sensitive)
  'METADATA_TRADE_REP_FIRST_NAME' => 'trade_representative_contact_information/first_name.txt',
  'METADATA_TRADE_REP_LAST_NAME' => 'trade_representative_contact_information/last_name.txt',
  'METADATA_TRADE_REP_ADDRESS_LINE1' => 'trade_representative_contact_information/address_line1.txt',
  'METADATA_TRADE_REP_ADDRESS_LINE2' => 'trade_representative_contact_information/address_line2.txt',
  'METADATA_TRADE_REP_ADDRESS_LINE3' => 'trade_representative_contact_information/address_line3.txt',
  'METADATA_TRADE_REP_CITY' => 'trade_representative_contact_information/city_name.txt',
  'METADATA_TRADE_REP_STATE' => 'trade_representative_contact_information/state.txt',
  'METADATA_TRADE_REP_COUNTRY' => 'trade_representative_contact_information/country.txt',
  'METADATA_TRADE_REP_POSTAL_CODE' => 'trade_representative_contact_information/postal_code.txt',
  'METADATA_TRADE_REP_PHONE' => 'trade_representative_contact_information/phone_number.txt',
  'METADATA_TRADE_REP_EMAIL' => 'trade_representative_contact_information/email_address.txt',
  'METADATA_TRADE_REP_DISPLAY_ON_APP_STORE' => 'trade_representative_contact_information/is_displayed_on_app_store.txt',

  # Subcategories (optional)
  'METADATA_PRIMARY_FIRST_SUB_CATEGORY' => 'primary_first_sub_category.txt',
  'METADATA_PRIMARY_SECOND_SUB_CATEGORY' => 'primary_second_sub_category.txt',
  'METADATA_SECONDARY_FIRST_SUB_CATEGORY' => 'secondary_first_sub_category.txt',
  'METADATA_SECONDARY_SECOND_SUB_CATEGORY' => 'secondary_second_sub_category.txt',

  # Apple TV Privacy Policy (optional)
  'METADATA_APPLE_TV_PRIVACY_POLICY' => 'en-US/apple_tv_privacy_policy.txt'
}.freeze

def inject_metadata
  puts "🔄 Injecting metadata from environment variables..."
  puts "📁 Metadata directory: #{METADATA_DIR}"
  puts

  injected_count = 0
  skipped_count = 0

  METADATA_MAPPING.each do |env_var, file_path|
    value = ENV[env_var]
    
    if value.nil? || value.strip.empty?
      skipped_count += 1
      next
    end

    full_path = File.join(METADATA_DIR, file_path)
    
    # Ensure parent directory exists
    FileUtils.mkdir_p(File.dirname(full_path))
    
    # Write the value to the file
    File.write(full_path, value.strip)
    
    puts "✅ Injected #{env_var} -> #{file_path}"
    injected_count += 1
  end

  puts
  puts "📊 Summary:"
  puts "  ✅ Injected: #{injected_count} file(s)"
  puts "  ⏭️  Skipped: #{skipped_count} file(s) (no value provided)"
  puts

  if injected_count > 0
    puts "✅ Metadata injection complete!"
  else
    puts "ℹ️  No metadata values to inject. All environment variables are empty."
    puts "ℹ️  Fastlane will use existing values in metadata files or skip empty files."
  end
end

# Run the injection
begin
  inject_metadata
rescue StandardError => e
  puts "❌ Error injecting metadata: #{e.message}"
  puts e.backtrace.first(5).join("\n")
  exit 1
end
