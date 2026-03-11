---
model: GPT-5.1-Codex
tools: [execute, read]
description: Write one consistent, copy-ready commit message from repository changes and return it in a fenced code block.
agent: agent
argument-hint: "Optional: provide a brief change description and/or file/folder references (comma-separated, newline-separated, or mixed) to scope the commit to those paths."
name: writeCommitMessage
---
Write exactly one commit message from the repository changes.

## Action Boundary

- This is a `write` action: respond in Copilot chat only.
- Do not write files, save artifacts, or perform filesystem persistence.

## Inputs

- Use the user's description when provided.
- File and folder references are optional.
- When references are provided, treat them as the target list. The list may be:
  - comma-separated paths
  - newline-separated paths
  - mixed file and folder paths
- Normalize referenced paths, then inspect only changes associated with those paths.
- If no references are provided, inspect repository changes normally.
- Inspect both staged and unstaged sources when determining intent and scope.
- Detect renames using rename-aware git output (for example, --name-status -M) rather than assuming add/delete pairs.
- If needed, inspect git diff/log to infer the primary intent of the change. When references are provided, constrain this inference to the referenced paths.

## Change Inspection Rules

- Include `staged` source evidence in analysis (for example, git diff --cached --name-status -M).
- Include `unstaged` source evidence in analysis (for example, git diff --name-status -M).
- Include `history` source evidence only when needed to disambiguate intent; keep rename detection enabled.
- Treat R status as a rename and preserve both source and destination paths for summary generation.
- If file/folder references are provided, consider a rename in-scope when either old path or new path matches the referenced targets.

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

### Scope Resolution Rules

- If file/folder references are provided, derive `scope` from the primary area represented by changes in those referenced paths.
- For rename entries, use the destination path as the primary signal for scope, with source path as secondary context.
- If referenced paths map to multiple unrelated areas, choose the dominant area based on the greatest amount of relevant change among referenced paths.
- If the area cannot be determined confidently, use `repo`.
- If no references are provided, derive `scope` from the primary area changed across repository changes.

### Rename Reporting Rules

- If one or more rename entries (`R`) are present, include at least one body line that explicitly names the rename path transition in `old-path -> new-path` format.
- Prefer concrete rename details over generic wording like "reorganized files" when rename data is available.

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
