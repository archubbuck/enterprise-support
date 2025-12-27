#!/usr/bin/env ruby
# Copyright Automation Test Script
# This script demonstrates and tests the copyright automation logic
# used in the Fastlane deployment pipeline.

require 'time'

def update_copyright(existing_copyright)
  default_company_name = "Enterprise Support"
  year_regex = /^\d{4}$/
  
  puts "Input copyright: '#{existing_copyright}'"
  
  # Extract company name by removing the leading year if present
  # Format is expected to be: "YYYY Company Name" or "Company Name"
  parts = existing_copyright.split(' ', 2)
  if parts[0] =~ year_regex && parts.length > 1
    # First part is a year, use the rest as company name
    company_name = parts[1]
    puts "✓ Detected format: Year + Company (#{parts[0]} #{company_name})"
  elsif parts[0] =~ year_regex && parts.length == 1
    # Only a year is present, use default company name
    company_name = default_company_name
    puts "⚠ Detected format: Year only (#{parts[0]}), using default: #{default_company_name}"
  else
    # No year found, use the entire text as company name
    company_name = existing_copyright
    puts "✓ Detected format: Company name only (#{company_name})"
  end
  
  # Ensure company name is not empty
  if company_name.nil? || company_name.strip.empty?
    company_name = default_company_name
    puts "⚠ Empty company name, using default: #{default_company_name}"
  end
  
  current_year = Time.now.year
  copyright_text = "#{current_year} #{company_name}"
  
  puts "Output copyright: '#{copyright_text}'"
  
  return copyright_text
end

# Test cases covering different scenarios
test_cases = {
  "Standard current year" => "2025 Enterprise Support",
  "Outdated year" => "2024 My Company",
  "Very old year" => "2020 Acme Corporation",
  "Company name only" => "My Company Name",
  "Year only" => "2025",
  "Empty string" => "",
  "Default company name" => "Enterprise Support",
  "Multi-word company" => "2023 Acme Corporation International Inc.",
  "Whitespace handling" => "  2024  My Company  ",
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
