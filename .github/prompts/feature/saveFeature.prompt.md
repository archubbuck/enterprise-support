---
model: GPT-5.1-Codex
tools: [read]
description: Save one previously generated feature definition from the current Copilot chat to a file under .github/prompts/feature.
agent: agent
argument-hint: "Provide the target feature prompt name when multiple candidates exist."
name: saveFeature
---

Save exactly one feature prompt file using feature prompt content that has already been presented in the current Copilot chat.

## Task statement

Persist one existing feature prompt artifact from chat into `.github/prompts/feature`.

## Scope and boundaries

- In scope: locating one previously presented feature prompt, validating frontmatter, resolving filename, creating destination folder if needed, and writing exactly one file.
- Out of scope: generating new feature prompt content, rewriting meaning, or saving multiple files.

## Inputs and assumptions

- Source content already exists earlier in the current chat and includes YAML frontmatter.
- Optional input may include target filename stem.
- If filename is not provided, derive `<name>` from current chat context.
- Default destination is `.github/prompts/feature/<name>.prompt.md`.

## Step-by-step execution instructions

1. Check current chat for a previously presented feature prompt body.
2. If none exists, return exactly:
   `Use writePrompt in this chat first so there is prompt content to save.`
3. If multiple candidates exist and selection is ambiguous, return exactly:
   `Multiple prompt candidates were found in this chat. Specify which one to save.`
4. Select the single intended prompt content without regenerating or changing meaning.
5. If content is fenced, extract only inner prompt text.
6. Validate frontmatter:
   - Must begin with opening `---`.
   - Must include closing `---` before the first markdown section heading.
   - If missing, return exactly:
     `Prompt content is missing required YAML frontmatter. Re-run writePrompt and save the full output.`
   - If delimiters are malformed, return exactly:
     `Prompt content contains invalid YAML frontmatter delimiters. Provide a single complete prompt with opening and closing --- lines.`
7. Resolve filename:
   - Use user-provided valid name when available; otherwise derive `<name>` from context.
   - Save to `.github/prompts/feature/<name>.prompt.md`.
8. Ensure destination folder exists:
   - If `.github/prompts/feature` does not exist, create it.
9. Write exactly one file, preserving extracted content exactly (including frontmatter key order and spacing).
10. Confirm success with the final saved path.

## Output format requirements

- Guard failures must return only the exact required guard message.
- On success, return one concise confirmation line with the saved file path.
- Do not output alternatives or explanations.

## Quality and validation checks

- Exactly one file is written.
- Save-only behavior is preserved.
- No prompt-generation logic is introduced.
- Destination remains within `.github/prompts/feature`.
- Saved filename ends with `.prompt.md`.
- Saved content preserves YAML frontmatter exactly and remains structurally valid.