---
model: GPT-5.1-Codex
tools: [read]
description: Save a previously generated prompt from the current Copilot chat into the appropriate .github/prompts subfolder, creating the subfolder when implied.
agent: agent
argument-hint: "Provide the target prompt name and/or subfolder when needed."
name: savePrompt
---
Save exactly one prompt file under the appropriate subfolder in `.github/prompts` using prompt content that has already been presented in the current Copilot chat.

Apply shared lifecycle invariants from [prompt-management.instructions.md](../../instructions/prompt-management.instructions.md).

## Inputs and assumptions

- The prompt content must have already been produced earlier in the current chat (typically by `writePrompt`) and must include YAML frontmatter.
- Optional input may include a target filename stem and/or target subfolder under `.github/prompts`.
- If target details are not provided, derive `<name>` and `<subfolder>` from current chat context conservatively.
- Saved paths must remain within `.github/prompts/<subfolder>/<name>.prompt.md`.

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
7. Resolve destination folder and filename:
   - If user provides a valid target subfolder under `.github/prompts`, use it.
   - Otherwise derive `<subfolder>` from the selected prompt content:
     - Read frontmatter `name`.
     - If `name` begins with one of `write`, `fix`, `save`, `predict`, `plan`, or `audit`, strip that leading verb and use the remaining token as the family name.
     - Normalize the family name to lowercase kebab-case for `<subfolder>`.
     - Example: `writeFeature` -> `feature`.
   - If `<subfolder>` cannot be determined unambiguously, return exactly:
     `Unable to determine target prompts subfolder. Specify a subfolder under .github/prompts.`
   - Use a user-provided valid prompt name when available; otherwise derive `<name>` from current chat context.
   - Save as `.github/prompts/<subfolder>/<name>.prompt.md`.
8. If the resolved path is outside `.github/prompts`, return exactly:
   `Target path must be within .github/prompts.`
9. Ensure the destination subfolder exists:
   - If `.github/prompts/<subfolder>` does not exist, create it.
10. Write exactly one file, preserving frontmatter key order, spacing, and delimiter lines exactly as extracted.
11. Confirm success with the final saved path.

## Output format requirements

- Guard failures must return only the exact required guard message.
- On success, return one concise confirmation line with the saved file path.
- Do not output generated alternatives.

## Quality and validation checks

- Verify this prompt performs save-only behavior.
- Verify no prompt-generation logic is introduced.
- Verify exactly one file is written under `.github/prompts/<subfolder>`.
- Verify destination subfolder is created when implied and missing.
- Verify filename ends with `.prompt.md`.
- Verify the saved file preserves YAML frontmatter exactly from extracted prompt content.
- Verify the saved file begins with `---` and contains a closing `---` before the first markdown section heading.