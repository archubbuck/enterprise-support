# Troubleshooting Guide

This guide helps you resolve common issues encountered during development and build processes.

## Table of Contents

- [JSON Parse Errors](#json-parse-errors)
- [Build Failures](#build-failures)
- [Terminal Command Execution Issues](#terminal-command-execution-issues)
- [Dependency Installation Problems](#dependency-installation-problems)
- [Package Manager Issues](#package-manager-issues)
- [Codespace-Specific Issues](#codespace-specific-issues)

## JSON Parse Errors

### Problem: "JSON parse error in package.json"

**Symptoms:**
- Error messages mentioning JSON syntax errors
- Build processes failing to read package.json
- npm/pnpm commands failing with parse errors

**Common Causes:**
1. Trailing commas in JSON files
2. Comments in JSON files (JSON doesn't support comments)
3. Invalid escape sequences
4. Missing or extra quotes
5. Corrupted file encoding

**Solutions:**

1. **Validate your JSON files:**
   ```bash
   # Validate package.json
   npm run validate:json
   
   # Or manually validate
   cat package.json | python3 -m json.tool
   ```

2. **Check for common syntax issues:**
   - Remove trailing commas: `"key": "value",}` → `"key": "value"}`
   - Remove comments: `// comment` or `/* comment */`
   - Ensure all strings are properly quoted
   - Check that all braces and brackets are balanced

3. **Use an IDE with JSON validation:**
   - VS Code with JSON language support
   - Enable "JSON: Schema Validation" in your editor

4. **Re-save the file with UTF-8 encoding:**
   ```bash
   # If file encoding is corrupted
   iconv -f UTF-8 -t UTF-8 package.json > package.json.new
   mv package.json.new package.json
   ```

### Problem: "Old errors showing after fixing JSON"

**Symptoms:**
- JSON file appears valid but errors persist
- Terminal output shows old error messages

**Causes:**
- Cached error messages in terminal/IDE
- Build cache not cleared
- File system synchronization delay

**Solutions:**

1. **Clear the terminal and retry:**
   ```bash
   clear
   npm run build
   ```

2. **Clear build caches:**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Clear npm cache
   npm cache clean --force
   
   # Clear build artifacts
   rm -rf dist
   ```

3. **Restart your development environment:**
   - Close and reopen your IDE/editor
   - Restart your terminal session
   - In Codespaces: Rebuild the container

## Build Failures

### Problem: "Build fails with 'command not found'"

**Symptoms:**
- `vite: not found`
- `tsc: not found`
- Build script fails immediately

**Cause:** Dependencies not installed

**Solution:**
```bash
# Install all dependencies
npm install

# Verify installation
npm list vite typescript

# Try building again
npm run build
```

### Problem: "Build fails with warnings about CSS"

**Symptoms:**
- Warnings about "Unexpected token ParenthesisBlock" in CSS
- Build completes but with warnings

**Cause:** Advanced CSS features in Tailwind configuration

**Solution:**
This is a known issue with certain Tailwind CSS features and can be safely ignored. The build will still succeed and produce working output. To suppress warnings, you can:

```bash
# Build and redirect warnings
npm run build 2>/dev/null
```

## Terminal Command Execution Issues

### Problem: "Unable to run terminal commands in Codespace"

**Symptoms:**
- Terminal commands fail to execute
- "Permission denied" or "cannot execute" errors
- File system appears read-only

**Causes:**
1. Codespace container issues
2. File permissions problems
3. File system synchronization issues
4. Resource constraints

**Solutions:**

1. **Rebuild the Codespace:**
   - In GitHub Codespaces: `Cmd/Ctrl + Shift + P` → "Codespaces: Rebuild Container"
   - This creates a fresh environment

2. **Check file permissions:**
   ```bash
   # Make scripts executable
   chmod +x script.sh
   
   # Check current directory permissions
   ls -la
   ```

3. **Try a different shell:**
   ```bash
   # Switch to bash if using another shell
   bash
   ```

4. **Check resource usage:**
   ```bash
   # Check disk space
   df -h
   
   # Check memory
   free -h
   
   # Check CPU
   top
   ```

5. **Create a new Codespace:**
   - If issues persist, create a fresh Codespace
   - This resolves most environment-related issues

## Dependency Installation Problems

### Problem: "npm install fails or hangs"

**Symptoms:**
- Installation process hangs indefinitely
- Network timeout errors
- Checksum validation failures

**Solutions:**

1. **Clear npm cache and retry:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use a different registry:**
   ```bash
   # Use a different npm registry
   npm install --registry=https://registry.npmjs.org/
   ```

3. **Increase timeout:**
   ```bash
   # Increase network timeout
   npm install --fetch-timeout=60000
   ```

4. **Install with legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

### Problem: "Engine version mismatch warnings"

**Symptoms:**
- Warnings about unsupported Node.js version
- Example: `EBADENGINE Unsupported engine`

**Cause:** Project requires specific Node.js versions

**Solution:**

1. **Check required Node.js version:**
   ```bash
   # View package.json engines field
   cat package.json | grep -A 5 "engines"
   ```

2. **Use the correct Node.js version:**
   ```bash
   # Using nvm (recommended)
   nvm install 22
   nvm use 22
   
   # Verify version
   node --version
   ```

3. **If you can't upgrade Node.js:**
   - The warnings can often be ignored if the build succeeds
   - Use `--force` flag: `npm install --force`

## Package Manager Issues

### Problem: "Project uses pnpm but it's not installed"

**Symptoms:**
- Documentation mentions `pnpm` commands
- Workspace configuration references pnpm
- `pnpm: command not found`

**Cause:** This project uses npm, not pnpm

**Solution:**

The project is configured to use **npm**, not pnpm. Always use npm commands:

```bash
# Use npm, not pnpm
npm install      # NOT: pnpm install
npm run build    # NOT: pnpm build
npm run dev      # NOT: pnpm dev
```

If you see references to pnpm in documentation or error messages, they are likely:
1. From a different project
2. From outdated documentation
3. From another developer's environment

**Verify which package manager to use:**
```bash
# This project has package-lock.json (npm)
ls -la package-lock.json

# No pnpm-lock.yaml
ls -la pnpm-lock.yaml  # Should not exist
```

## Codespace-Specific Issues

### Problem: "File system synchronization issues"

**Symptoms:**
- Files appear to not save
- Changes not reflected immediately
- Conflicting file states

**Solutions:**

1. **Force save files:**
   - In VS Code: `Cmd/Ctrl + K, S` (Save All)
   - Close and reopen files

2. **Wait for sync indicator:**
   - Check the bottom status bar for sync indicators
   - Wait for "Syncing" to complete

3. **Reload the Codespace window:**
   - `Cmd/Ctrl + R` to reload

### Problem: "Codespace performance issues"

**Symptoms:**
- Slow terminal response
- Commands taking longer than expected
- IDE lag

**Solutions:**

1. **Check Codespace machine type:**
   - Upgrade to a larger machine if available
   - 4-core machines work better for builds

2. **Close unused processes:**
   ```bash
   # Check running processes
   ps aux
   
   # Kill unnecessary processes
   kill <PID>
   ```

3. **Reduce resource usage:**
   - Close unused browser tabs
   - Close unused terminal sessions
   - Disable unnecessary VS Code extensions

## Validation and Prevention

### Automated Validation

Run validation checks before committing:

```bash
# Validate all JSON files
npm run validate:json

# Run linting
npm run lint

# Test build
npm run build
```

### Pre-commit Checks

Consider adding these checks to your workflow:

1. **JSON validation before commit:**
   ```bash
   # Add to your pre-commit routine
   find . -name "*.json" -not -path "./node_modules/*" -exec python3 -m json.tool {} \; > /dev/null
   ```

2. **Build verification:**
   ```bash
   # Ensure build works before pushing
   npm run build
   ```

## Getting Help

If you're still experiencing issues:

1. **Check the documentation:**
   - [Quick Start Guide](./QUICK_START.md)
   - [Configuration Guide](./CONFIGURATION.md)
   - [Contributing Guide](../.github/CONTRIBUTING.md)

2. **Search existing issues:**
   - Check [GitHub Issues](https://github.com/archubbuck/enterprise-support/issues)

3. **Report a new issue:**
   - Use the appropriate issue template
   - Include error messages and logs
   - Describe steps to reproduce

4. **Common commands for debugging:**
   ```bash
   # Check Node.js version
   node --version
   
   # Check npm version
   npm --version
   
   # Check installed packages
   npm list --depth=0
   
   # View build logs
   npm run build --verbose
   
   # Check git status
   git status
   
   # View recent changes
   git --no-pager log -5
   ```

## Summary of Key Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build project
npm run build

# Validate JSON files
npm run validate:json

# Run linting
npm run lint

# Clear caches and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```
