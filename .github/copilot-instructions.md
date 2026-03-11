# Copilot Instructions

Repository-level instructions for GitHub Copilot.

## Documentation

Documentation organization rules are defined in [organize-documentation.instructions.md](./instructions/organize-documentation.instructions.md) and apply automatically when working with files under `docs/`.

## Prompt Workflows

Prompt management rules are defined in [prompt-management.instructions.md](./instructions/prompt-management.instructions.md) and apply automatically when working with write/fix/save prompt lifecycle files under `.github/prompts/prompt/`.

## Instruction File Naming Policy

- Files under `.github/instructions/` must use action-oriented names so contributors can quickly identify what activity the instructions govern.
- Acceptable naming styles include:
	- Verb-first actions (for example, `validate-config.instructions.md`)
	- Clear activity-oriented names (for example, `prompt-management.instructions.md`)
- Avoid topic-only or ambiguous names that do not indicate an action or activity.
- Existing instruction files are grandfathered; this policy is required for new instruction files and for any intentionally renamed instruction files.
