#!/bin/bash

# Shared secret validation logic
# This script is sourced by both the GitHub Action and test suite
# to ensure consistent validation rules

# Validates required secrets and sets VALIDATION_PASSED and MISSING_SECRETS variables
# Usage: validate_secrets
# Expects environment variables: MATCH_PASSWORD, MATCH_GIT_URL, GIT_AUTHORIZATION,
#                                APPSTORE_ISSUER_ID, APPSTORE_KEY_ID, APPSTORE_P8, APPLE_TEAM_ID
validate_secrets() {
    VALIDATION_PASSED=true
    MISSING_SECRETS=()

    # Check each required secret
    if [ -z "$MATCH_PASSWORD" ]; then
        MISSING_SECRETS+=("MATCH_PASSWORD")
    fi

    if [ -z "$MATCH_GIT_URL" ]; then
        MISSING_SECRETS+=("MATCH_GIT_URL")
    fi

    if [ -z "$GIT_AUTHORIZATION" ]; then
        MISSING_SECRETS+=("GIT_AUTHORIZATION")
    fi

    if [ -z "$APPSTORE_ISSUER_ID" ]; then
        MISSING_SECRETS+=("APPSTORE_ISSUER_ID")
    fi

    if [ -z "$APPSTORE_KEY_ID" ]; then
        MISSING_SECRETS+=("APPSTORE_KEY_ID")
    fi

    if [ -z "$APPSTORE_P8" ]; then
        MISSING_SECRETS+=("APPSTORE_P8")
    fi

    if [ -z "$APPLE_TEAM_ID" ]; then
        MISSING_SECRETS+=("APPLE_TEAM_ID")
    fi

    # Set validation result
    if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
        VALIDATION_PASSED=false
    fi
}
