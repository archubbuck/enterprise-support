---
applyTo: ".github/prompts/repo-standards/*.prompt.md"
---

# Repo Standards Prompt Instructions

These instructions define governance for repository standards audit prompts.

## Scope

- This folder contains audit-only prompts.
- Prompts must stay analysis-focused and non-destructive by default.

## Shared Invariants

- Produce exactly one primary artifact per run.
- Prioritize explicit user constraints over inferred preferences.
- Resolve ambiguity conservatively and avoid inventing unsupported details.
- Do not add unrelated deliverables, alternatives, or extra outputs.

## File Persistence Policy

- All file creation and editing must use native agent tool calls (such as `create_file` or `replace_string_in_file`). Do not invoke `apply_patch`, `patch`, or other commands in a terminal or shell to write or modify files.
- Terminal execution (`execute` tool) is reserved for read-only data-gathering commands only. It must never be used for file persistence, creation, or editing.
- Terminal-based file patching commands are not portable across operating systems and must not be used regardless of the host environment.

## Output Discipline

- Follow each prompt file's strict output contract exactly.
- Return findings and recommendations only in the format requested by the prompt.
- Avoid implementation actions unless explicitly requested by the user and prompt.
