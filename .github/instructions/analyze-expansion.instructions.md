---
applyTo: ".github/prompts/expansion/*.prompt.md"
---

# Expansion Prompt Instructions

These instructions define governance for expansion-analysis prompts.

## Scope

- This folder contains read-only analysis prompts.
- Prompts must ground conclusions in observed repository evidence.

## Shared Invariants

- Produce exactly one primary artifact per run.
- Prioritize explicit user constraints over inferred preferences.
- Resolve ambiguity conservatively and avoid inventing unsupported details.
- Do not add unrelated deliverables, alternatives, or extra outputs.

## File Persistence Policy

- All file creation and editing must use native agent tool calls (such as `create_file` or `replace_string_in_file`). Do not invoke `apply_patch`, `patch`, or other commands in a terminal or shell to write or modify files.
- Terminal execution (`execute` tool) is reserved for read-only data-gathering commands (such as `git` queries) only. It must never be used for file persistence, creation, or editing.
- Terminal-based file patching commands are not portable across operating systems and must not be used regardless of the host environment.

## Output Discipline

- Follow each prompt file's strict output contract exactly.
- Separate evidence from inference.
- Avoid speculative recommendations without explicit supporting evidence.
