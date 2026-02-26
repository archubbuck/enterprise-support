---
model: GPT-5.1-Codex    
tools: [execute, read]
description: Generate one consistent, copy-ready commit message from repository changes and return it in a fenced code block.
agent: agent
argument-hint: "Please provide a brief description of the changes made in the code repository or reference specific files that were changed."
name: generateCommitMessage
---
Generate exactly one commit message from the repository changes.

## Inputs

- Use the user's description when provided.
- If files are referenced, inspect them.
- If needed, inspect git diff/log to infer the primary intent of the change.

## Required Commit Structure

Produce a Conventional Commit with this structure and order:

1. Header: `<type>(<scope>): <subject>`
2. Blank line
3. Body: 1-3 short lines summarizing what changed and why
4. Optional footer lines (only when applicable), such as:
	 - `BREAKING CHANGE: <details>`
	 - `Refs: #<id>`

### Header Rules

- Allowed `type` values: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- `scope` must be short and specific to the main area changed (for example: `api`, `ui`, `auth`, `repo`, `docs`).
- `subject` must be imperative, concise, no trailing period, and max 72 characters.

### Consistency Defaults

- If details are incomplete, use conservative defaults:
	- `type`: `chore`
	- `scope`: `repo`
	- `subject`: `update project files`
- Keep body lines factual and avoid speculation.

## Output Format (Strict)

- Return only the commit message in one fenced markdown code block.
- Do not include explanations before or after the code block.
- Use this exact wrapping pattern:

```text
<commit message here>
```