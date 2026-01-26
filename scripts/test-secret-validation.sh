#!/bin/bash

# Test script for secret validation action
# This script tests the secret validation logic from the shared validation script

set -euo pipefail

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source shared validation logic
source "$SCRIPT_DIR/lib/validate-secrets.sh"

echo "=========================================="
echo "Secret Validation Test Suite"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Counter for test results
TESTS_PASSED=0
TESTS_FAILED=0

# Test function to exercise the shared validation logic
test_secret_validation() {
    local test_name="$1"
    shift

    echo "----------------------------------------"
    echo "Test: $test_name"

    # Map positional arguments to the expected secret environment variables
    export MATCH_PASSWORD="${1-}"
    export MATCH_GIT_URL="${2-}"
    export GIT_AUTHORIZATION="${3-}"
    export APPSTORE_ISSUER_ID="${4-}"
    export APPSTORE_KEY_ID="${5-}"
    export APPSTORE_P8="${6-}"
    export APPLE_TEAM_ID="${7-}"

    # Determine expected outcome from test name
    local expected_result="FAIL"
    if [[ "$test_name" == *"should pass"* ]]; then
        expected_result="PASS"
    fi

    # Run the shared validation logic
    validate_secrets

    # Check actual result
    local actual_result="FAIL"
    if [ "$VALIDATION_PASSED" = "true" ]; then
        actual_result="PASS"
    fi

    echo "Expected result: $expected_result"
    echo "Actual result:   $actual_result"

    if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
        echo "Missing secrets: ${MISSING_SECRETS[*]}"
    fi

    if [ "$expected_result" = "$actual_result" ]; then
        echo -e "${GREEN}✓ TEST PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ TEST FAIL${NC} - Expected $expected_result but got $actual_result"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    echo ""
}

# Run test cases
echo "Running test cases..."
echo ""

# Test 1: All secrets present (should pass)
test_secret_validation "All secrets present (should pass)" \
    "password123" \
    "git@github.com:user/certs.git" \
    "ghp_1234567890" \
    "issuer-id-123" \
    "key-id-456" \
    "-----BEGIN PRIVATE KEY-----" \
    "TEAM123"

# Test 2: Missing APPLE_TEAM_ID (should fail)
test_secret_validation "Missing APPLE_TEAM_ID (should fail)" \
    "password123" \
    "git@github.com:user/certs.git" \
    "ghp_1234567890" \
    "issuer-id-123" \
    "key-id-456" \
    "-----BEGIN PRIVATE KEY-----" \
    ""

# Test 3: Missing multiple secrets (should fail)
test_secret_validation "Missing MATCH_PASSWORD and APPLE_TEAM_ID (should fail)" \
    "" \
    "git@github.com:user/certs.git" \
    "ghp_1234567890" \
    "issuer-id-123" \
    "key-id-456" \
    "-----BEGIN PRIVATE KEY-----" \
    ""

# Test 4: Missing all secrets (should fail)
test_secret_validation "All secrets missing (should fail)" \
    "" "" "" "" "" "" ""

# Test 5: Only one secret present (should fail)
test_secret_validation "Only MATCH_PASSWORD present (should fail)" \
    "password123" "" "" "" "" "" ""

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
