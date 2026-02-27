---
name: planSafeDelete
description: Switch to Plan mode and generate a safe, non-destructive deletion plan for user-provided files and folders.
argument-hint: "Provide the file(s) and folder(s) to remove. Accepts comma-separated, newline-separated, or mixed path lists."
model: Auto
agent: Plan
tools: [read, execute]
---
Create a safety-first plan to delete only the files and folders provided in the prompt input.

## Input
Treat the user argument as the deletion target list. The argument may include:
- comma-separated paths
- newline-separated paths
- mixed file and folder paths

If no targets are provided, return:
`No deletion targets were provided. Provide one or more file/folder paths.`

## Objective
Return an execution-ready plan that safely removes the requested targets with minimal risk to the repository.

## Safety Rules
1. Plan only. Do not delete anything.
2. Do not invent additional deletion targets.
3. Preserve user-provided order unless safety dependencies require reordering.
4. Identify blockers before deletion (imports, references, config links, docs links, scripts, tests, build/release impact).
5. Include rollback guidance before destructive actions.
6. If any target path appears ambiguous or unresolved, call it out and require confirmation.

## Required Output Format
Produce the response with these sections in order:

### 1) Target Inventory
- Normalized list of requested paths
- For each target: file/folder classification and confidence (High/Medium/Low)

### 2) Preflight Checks (Read-Only)
- Ordered list of non-destructive checks to run first
- Include safe verification commands (search/list/status only)
- Explain what each check validates

### 3) Deletion Plan
- Step-by-step deletion sequence
- For each step: target(s), reason for order, and risk note
- Explicit hold points where user confirmation is required

### 4) Post-Delete Verification
- Read-only validation steps to confirm no broken references
- Build/test checks to run after deletion

### 5) Rollback Plan
- Immediate recovery options if deletion causes issues
- Git-based restore guidance and validation steps

### 6) Go/No-Go Summary
- Final readiness statement
- Open risks, assumptions, and required confirmations

## Command Policy
You may include command examples only for:
- listing files and folders
- searching references
- checking git working tree status and history
- running validation checks

Do not include direct destructive execution as completed actions. If deletion commands are shown, present them only as **planned** steps under explicit user-confirmation gates.
