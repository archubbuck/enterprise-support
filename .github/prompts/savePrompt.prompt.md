---
model: GPT-5.1-Codex
tools: [read, execute]
description: Save a previously generated prompt from the current Copilot chat into .github/prompts.
agent: agent
argument-hint: "Provide the target prompt name (required when multiple candidates exist)."
name: savePrompt
---
Save exactly one prompt file in `.github/prompts` using prompt content that has already been presented in the current Copilot chat.

Apply shared lifecycle invariants from [prompt-management.instructions.md](../instructions/prompt-management.instructions.md).

## Inputs and assumptions

- The prompt content must have already been produced earlier in the current chat (typically by `writePrompt`) and must include YAML frontmatter.
- Optional input may include a target filename stem. If not provided, derive the filename stem from current chat context.
- Target location is always `.github/prompts`.

## Step-by-step execution instructions

1. Check chat context for an already-presented prompt body to save.
2. If no previously presented prompt content exists in the current chat, return exactly:
   `Use writePrompt in this chat first so there is prompt content to save.`
3. If multiple candidate prompt bodies exist and the intended one is ambiguous, return exactly:
   `Multiple prompt candidates were found in this chat. Specify which one to save.`
4. Select the single intended prompt content without regenerating or modifying its meaning.
5. If content is wrapped in a fenced code block, extract only the inner prompt text and preserve it exactly.
6. Validate extracted prompt content for required frontmatter:
   - It must begin with an opening `---` line.
   - It must contain a closing `---` line before the first markdown section heading.
   - If frontmatter is missing, return exactly:
     `Prompt content is missing required YAML frontmatter. Re-run writePrompt and save the full output.`
   - If frontmatter delimiters are malformed, return exactly:
     `Prompt content contains invalid YAML frontmatter delimiters. Provide a single complete prompt with opening and closing --- lines.`
7. Resolve filename:
   - Use a user-provided valid prompt name when available; otherwise derive `<name>` from current chat context.
   - Save as `.github/prompts/<name>.prompt.md`.
8. Write exactly one file, preserving frontmatter key order, spacing, and delimiter lines exactly as extracted.
9. Confirm success with the final saved path.

## Output format requirements

- Guard failures must return only the exact required guard message.
- On success, return one concise confirmation line with the saved file path.
- Do not output generated alternatives.

## Quality and validation checks

- Verify this prompt performs save-only behavior.
- Verify no prompt-generation logic is introduced.
- Verify exactly one file is written under `.github/prompts`.
- Verify filename ends with `.prompt.md`.
- Verify the saved file preserves YAML frontmatter exactly from extracted prompt content.
- Verify the saved file begins with `---` and contains a closing `---` before the first markdown section heading.

