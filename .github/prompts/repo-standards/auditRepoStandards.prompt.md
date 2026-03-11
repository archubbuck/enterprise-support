---
name: auditRepoStandards
description: Analyze a repository for non-standard patterns and recommend alignment with public best practices.
argument-hint: Optional focus area (e.g., "testing", "CI/CD", "configuration") or leave blank for a full audit.
---
Perform a comprehensive audit of this repository to identify abnormal approaches, non-standard patterns, and deviations from widely accepted public best practices. Produce a severity-ranked plan of findings and corrective actions.

## Audit Scope

Analyze the following areas across the entire workspace:

1. **Project & Build Configuration** — Root and per-app/library configs (package.json, tsconfig, build tooling). Look for duplicate dependency management, inconsistent compiler options, fragile custom build scripts, and deviation from the monorepo tool's conventions.
2. **Linting & Code Quality** — ESLint/linting setup, custom rule loading, disabled standard rules (e.g., module boundary enforcement). Identify rules that are off when they should be on, or configs that depend on build artifacts.
3. **Testing Strategy** — Identify coexistence of multiple test frameworks, orphaned config files, incomplete CI test coverage, and thresholds that don't match documented standards.
4. **CI/CD Pipeline** — Check for references to non-existent files/directories, incomplete quality gates, health checks that don't actually verify HTTP responses, and deployment config contradictions.
5. **Path Aliases & Imports** — Find phantom aliases pointing to non-existent code, direct relative imports that bypass alias conventions, and duplicated alias definitions across configs.
6. **Naming Conventions** — Project names, library prefixes, file naming patterns. Flag inconsistencies across the workspace.
7. **Documentation Drift** — Stale references to renamed directories, non-existent scripts, or outdated architectural guidance that conflicts with the actual codebase.
8. **Instruction/Guideline Conflicts** — Compare any developer instruction files, ADRs, or copilot-instructions against actual code patterns. Flag contradictions (e.g., recommending a change detection strategy the project doesn't use).
9. **Security & Hygiene** — Hardcoded secrets, console.log in production code, polyfill workarounds that bypass official packages.

## Output Format

Categorize each finding by severity:

- **Critical** — Blocks correctness, CI reliability, or causes build/compile failures
- **High** — Architectural drift, maintainability risk, or silent misconfiguration
- **Medium** — Standards gap, documentation drift, or tech debt
- **Low** — Minor inconsistencies or style issues

For each finding, provide:
- What the abnormality is, with a file reference
- Which public standard or best practice it violates
- A concrete corrective action

End with a **Verification** section listing commands or checks to confirm the fixes, and a **Decisions** section summarizing key recommendations where multiple valid approaches exist.
