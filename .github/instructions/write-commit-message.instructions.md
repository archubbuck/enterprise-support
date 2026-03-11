---
applyTo: ".github/prompts/commit-message/*.prompt.md"
---

# Commit Message Prompt Instructions

These instructions define shared lifecycle behavior for commit-message prompt workflows.

## Lifecycle Model

- `write` workflows generate one new artifact in chat only and do not persist files.
- `fix` workflows normalize one existing artifact in chat only and do not persist files.
- `save` workflows persist one existing artifact from current chat context and do not generate or reinterpret content.

## Shared Invariants

- Produce exactly one primary artifact per run.
- Prioritize explicit user constraints over inferred preferences.
- Resolve ambiguity conservatively and avoid inventing unsupported details.
- Do not add unrelated deliverables, alternatives, or extra outputs.

## Output Discipline

- Follow each prompt file's strict output contract exactly.
- For content-producing `write`/`fix` flows, return only the requested artifact payload.
- For `save` flows, return deterministic guard failures or a single concise success confirmation.

## File Persistence Policy

- All file creation and editing must use native agent tool calls (such as `create_file` or `replace_string_in_file`). Do not invoke `apply_patch`, `patch`, or other commands in a terminal or shell to write or modify files.
- Terminal execution (`execute` tool) is reserved for read-only data-gathering commands (such as `git` queries) only. It must never be used for file persistence, creation, or editing.
- Terminal-based file patching commands are not portable across operating systems and must not be used regardless of the host environment.

## Non-Duplication Rules

- `save` workflows must not run or duplicate `write` behavior.
- `fix` workflows must repair existing content only and must not broaden scope.
- Shared governance should live here; action-specific algorithms and exact guard strings remain in prompt files.
