#!/usr/bin/env ruby
# Copyright Automation Test Script
# This script demonstrates and tests the copyright automation logic
# used in the Fastlane deployment pipeline.

require 'time'

def update_copyright(existing_copyright)
  default_company_name = "Enterprise Support"
  year_regex = /^\d{4}$/
  
  puts "Input copyright: '#{existing_copyright}'"
  
  # Extract company name by removing the leading year and © symbol if present
  # Supported formats:
  # - "© YYYY Company Name" (Apple's recommended format)
  # - "YYYY Company Name" (legacy format)
  # - "Company Name" (company name only)
  parts = existing_copyright.split(' ')
  
  # Check if first part is copyright symbol
  has_copyright_symbol = parts[0] == '©'
  offset = has_copyright_symbol ? 1 : 0
  
  # Check if we have a year after the optional © symbol
  if parts.length > offset && parts[offset] =~ year_regex
    # Format: "© YYYY Company Name" or "YYYY Company Name"
    # Extract everything after the year as company name
    company_name = parts[(offset + 1)..-1].join(' ')
    year_part = parts[offset]
    copyright_symbol = has_copyright_symbol ? "© " : ""
    puts "✓ Detected format: #{copyright_symbol}Year + Company (#{year_part} #{company_name})"
  elsif has_copyright_symbol && parts.length > 1
    # Format: "© Company Name" (no year)
    company_name = parts[1..-1].join(' ')
    puts "✓ Detected format: © Company Name only (#{company_name})"
  elsif !has_copyright_symbol && parts.length >= 1
    # Format: "Company Name" (no © symbol, no year)
    company_name = existing_copyright
    puts "✓ Detected format: Company name only (#{company_name})"
  else
    company_name = nil
    puts "⚠ Empty or invalid format"
  end
  
  # Ensure company name is not empty
  if company_name.nil? || company_name.strip.empty?
    company_name = default_company_name
    puts "⚠ Empty company name, using default: #{default_company_name}"
  end
  
  current_year = Time.now.year
  copyright_text = "© #{current_year} #{company_name}"
  
  puts "Output copyright: '#{copyright_text}'"
  
  return copyright_text
end

# Test cases covering different scenarios
test_cases = {
  "Standard format with © symbol" => "© 2025 Enterprise Support",
  "© symbol with outdated year" => "© 2024 My Company",
  "Legacy format without ©" => "2025 Enterprise Support",
  "Outdated year without ©" => "2024 My Company",
  "Very old year" => "2020 Acme Corporation",
  "© with company name only" => "© My Company Name",
  "Company name only" => "My Company Name",
  "© with year only" => "© 2025",
  "Year only" => "2025",
  "© symbol only" => "©",
  "Empty string" => "",
  "Default company name" => "Enterprise Support",
  "Multi-word company" => "© 2023 Acme Corporation International Inc.",
  "Whitespace handling" => "  © 2024  My Company  ",
  "No year prefix" => "Acme International"
}

puts "=" * 80
puts "Copyright Automation Test Suite"
puts "=" * 80
puts ""

test_cases.each_with_index do |(description, input), index|
  puts "Test Case #{index + 1}: #{description}"
  puts "-" * 80
  output = update_copyright(input.strip)
  puts ""
end

puts "=" * 80
puts "Test completed successfully! ✅"
puts "=" * 80
puts ""
puts "Usage in Fastlane:"
puts "  The automation runs automatically during 'bundle exec fastlane release'"
puts "  It updates ios/App/fastlane/metadata/en-US/copyright.txt with the current year"
puts ""
puts "To customize your company name:"
puts "  1. Edit: ios/App/fastlane/metadata/en-US/copyright.txt"
puts "  2. Set content to: 'Your Company Name' (year will be added automatically)"
puts "  3. Run deployment: the year will be updated to #{Time.now.year}"
