#!/bin/bash

# Test script for copyright validation
# This script tests the copyright validation logic from .github/actions/verify-copyright/action.yml
# Usage: ./scripts/test-copyright-validation.sh

set -euo pipefail

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source shared validation logic
source "$SCRIPT_DIR/lib/validate-copyright.sh"

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
    
    # Run shared validation logic
    validate_copyright_content "$test_content"
    
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
test_copyright_validation "Company name only (2+ words)" "Enterprise Support" "true"
test_copyright_validation "Company name only (multi-word)" "Acme Corporation Inc" "true"
test_copyright_validation "Two letter company name" "AB" "true"

# Invalid formats that should fail
test_copyright_validation "Only © and year (missing company)" "© 2025" "false"
test_copyright_validation "Only year (missing company)" "2025" "false"
test_copyright_validation "Only © symbol (missing company)" "©" "false"
test_copyright_validation "Empty string" "" "false"
test_copyright_validation "Single character (no letter)" "1" "false"
test_copyright_validation "Single special character" "@" "false"
test_copyright_validation "Two numbers (no letter)" "12" "false"
test_copyright_validation "Special characters only" "©©" "false"
test_copyright_validation "© with single char company" "© 1" "false"
test_copyright_validation "© year with single char company" "© 2025 1" "false"
test_copyright_validation "Year with single char company" "2025 @" "false"
test_copyright_validation "© year with invalid company" "© 2025 @@" "false"

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

