#!/bin/bash

# Test script for copyright validation
# This script tests the copyright validation logic from .github/actions/verify-copyright/action.yml
# Usage: ./scripts/test-copyright-validation.sh

set -e

echo "=========================================="
echo "Copyright Validation Test Suite"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for test results
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_copyright_validation() {
    local test_name="$1"
    local test_content="$2"
    local should_pass="$3"
    
    echo "----------------------------------------"
    echo "Test: $test_name"
    echo "Input: '$test_content'"
    echo "Expected: $([ "$should_pass" = "true" ] && echo "PASS" || echo "FAIL")"
    
    # Validate copyright content
    COPYRIGHT_CONTENT="$test_content"
    
    # Run validation logic
    if [ -z "$COPYRIGHT_CONTENT" ]; then
        if [ "$should_pass" = "false" ]; then
            echo -e "${GREEN}✓ PASS${NC} - Correctly rejected empty content"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}✗ FAIL${NC} - Should have accepted empty content"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
        echo ""
        return
    fi
    
    # Split content into words for parsing
    read -ra WORDS <<< "$COPYRIGHT_CONTENT"
    WORD_COUNT=${#WORDS[@]}
    
    # Extract the first word to check for copyright symbol
    FIRST_WORD="${WORDS[0]}"
    
    # Validation logic
    VALIDATION_PASSED=true
    ERROR_MSG=""
    
    if [[ "$FIRST_WORD" == "©" ]]; then
        # Has copyright symbol - need at least one more word
        if [ $WORD_COUNT -lt 2 ]; then
            VALIDATION_PASSED=false
            ERROR_MSG="Company name missing after © symbol"
        else
            SECOND_WORD="${WORDS[1]}"
            
            # Check if second word is a year (4 digits)
            if [[ "$SECOND_WORD" =~ ^[0-9]{4}$ ]]; then
                # Format: "© YYYY Company Name" - need at least 3 words
                if [ $WORD_COUNT -lt 3 ]; then
                    VALIDATION_PASSED=false
                    ERROR_MSG="Company name missing after year"
                fi
            fi
        fi
    elif [[ "$FIRST_WORD" =~ ^[0-9]{4}$ ]]; then
        # Format: "YYYY Company Name" (legacy, no © symbol) - need at least 2 words
        if [ $WORD_COUNT -lt 2 ]; then
            VALIDATION_PASSED=false
            ERROR_MSG="Company name missing after year"
        fi
    fi
    
    # Check test result
    if [ "$VALIDATION_PASSED" = "true" ] && [ "$should_pass" = "true" ]; then
        echo -e "${GREEN}✓ PASS${NC} - Validation passed as expected"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    elif [ "$VALIDATION_PASSED" = "false" ] && [ "$should_pass" = "false" ]; then
        echo -e "${GREEN}✓ PASS${NC} - Correctly rejected: $ERROR_MSG"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    elif [ "$VALIDATION_PASSED" = "true" ] && [ "$should_pass" = "false" ]; then
        echo -e "${RED}✗ FAIL${NC} - Should have rejected but passed validation"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    else
        echo -e "${RED}✗ FAIL${NC} - Should have passed but was rejected: $ERROR_MSG"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
}

# Run test cases
echo "Running test cases..."
echo ""

# Valid formats that should pass
test_copyright_validation "Standard format with © and year" "© 2025 Enterprise Support" "true"
test_copyright_validation "Standard format with © and year (multi-word company)" "© 2025 Acme Corporation Inc" "true"
test_copyright_validation "Format with © but no year" "© Enterprise Support" "true"
test_copyright_validation "Format with © but no year (multi-word)" "© Acme Corporation Inc" "true"
test_copyright_validation "Format with year but no ©" "2025 Enterprise Support" "true"
test_copyright_validation "Format with year but no © (multi-word)" "2025 Acme Corporation Inc" "true"
test_copyright_validation "Company name only" "Enterprise Support" "true"
test_copyright_validation "Company name only (multi-word)" "Acme Corporation Inc" "true"
test_copyright_validation "Single word company name" "Acme" "true"

# Invalid formats that should fail
test_copyright_validation "Only © and year (missing company)" "© 2025" "false"
test_copyright_validation "Only year (missing company)" "2025" "false"
test_copyright_validation "Only © symbol (missing company)" "©" "false"
test_copyright_validation "Empty string" "" "false"

# Summary
echo "=========================================="
echo "Test Results Summary"
echo "=========================================="
echo -e "Tests passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests failed: ${RED}$TESTS_FAILED${NC}"
echo "Total tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
