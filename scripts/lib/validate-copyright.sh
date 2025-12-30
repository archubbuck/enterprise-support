#!/bin/bash

# Shared copyright validation logic
# This script is sourced by both the GitHub Action and test suite
# to ensure consistent validation rules

# Helper function to validate a company name
# Returns 0 if valid, 1 if invalid
is_valid_company_name() {
    local name="$1"
    # Require at least 2 characters and at least one letter
    if [ ${#name} -lt 2 ] || [[ ! "$name" =~ [A-Za-z] ]]; then
        return 1
    fi
    return 0
}

# Validates copyright content and sets VALIDATION_PASSED and ERROR_MSG variables
# Usage: validate_copyright_content "$content"
validate_copyright_content() {
    local content="$1"

    VALIDATION_PASSED=true
    ERROR_MSG=""

    # Empty content is considered invalid
    if [ -z "$content" ]; then
        VALIDATION_PASSED=false
        ERROR_MSG="Content is empty"
        return
    fi

    # Split content into words for parsing
    read -ra WORDS <<< "$content"
    local word_count=${#WORDS[@]}

    # Extract the first word to check for copyright symbol
    local first_word="${WORDS[0]}"

    if [[ "$first_word" == "©" ]]; then
        # Has copyright symbol - need at least one more word
        if [ "$word_count" -lt 2 ]; then
            VALIDATION_PASSED=false
            ERROR_MSG="Company name missing after © symbol"
            return
        fi
        
        local second_word="${WORDS[1]}"

        # Check if second word is a year (4 digits)
        if [[ "$second_word" =~ ^[0-9]{4}$ ]]; then
            # Format: "© YYYY Company Name" - need at least 3 words
            if [ "$word_count" -lt 3 ]; then
                VALIDATION_PASSED=false
                ERROR_MSG="Company name missing after year"
                return
            fi
            # Extract and validate company name (everything after © and year)
            local company_name="${WORDS[@]:2}"
            if ! is_valid_company_name "$company_name"; then
                VALIDATION_PASSED=false
                ERROR_MSG="Company name must be at least 2 characters and contain at least one letter"
                return
            fi
        else
            # Format: "© Company Name" (no year) - validate company name
            local company_name="${WORDS[@]:1}"
            if ! is_valid_company_name "$company_name"; then
                VALIDATION_PASSED=false
                ERROR_MSG="Company name must be at least 2 characters and contain at least one letter"
                return
            fi
        fi
    elif [[ "$first_word" =~ ^[0-9]{4}$ ]]; then
        # Format: "YYYY Company Name" (legacy, no © symbol) - need at least 2 words
        if [ "$word_count" -lt 2 ]; then
            VALIDATION_PASSED=false
            ERROR_MSG="Company name missing after year"
            return
        fi
        # Extract and validate company name (everything after year)
        local company_name="${WORDS[@]:1}"
        if ! is_valid_company_name "$company_name"; then
            VALIDATION_PASSED=false
            ERROR_MSG="Company name must be at least 2 characters and contain at least one letter"
            return
        fi
    else
        # Format: "Company Name" (no © symbol, no year)
        # Basic validation: require at least 2 characters and at least one letter
        if ! is_valid_company_name "$content"; then
            VALIDATION_PASSED=false
            ERROR_MSG="Company name must be at least 2 characters and contain at least one letter"
            return
        fi
    fi
}
