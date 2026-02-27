---
applyTo: ".github/prompts/*Prompt.prompt.md"
---

# Prompt Management Instructions

These instructions define shared lifecycle behavior for prompt authoring workflows.

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

## Non-Duplication Rules

- `save` workflows must not run or duplicate `write` behavior.
- `fix` workflows must repair existing content only and must not broaden scope.
- Shared governance should live here; action-specific algorithms and exact guard strings remain in prompt files.
