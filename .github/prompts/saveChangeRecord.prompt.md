---
model: GPT-5.1-Codex
tools: [read, execute]
description: Save one previously written change record from the current Copilot chat to a file.
agent: agent
argument-hint: "Optional: provide target file path and candidate identifier when multiple change records exist."
name: saveChangeRecord
---
Save exactly one change record to a filesystem file using change record content that has already been presented in the current Copilot chat.

## Action Boundary

- This is a `save` action: persist one artifact to the filesystem.
- Do not generate or rewrite change record content.

## Task statement

- Persist one existing change record (already shown in chat) to a file.

## Scope and boundaries

- In scope: locating previously presented change record content in the current chat, validating save guards, and writing one file.
- Out of scope: generating, rewriting, improving, or reinterpreting change record text.
- Do not run the `writeChangeRecord` workflow inside this prompt.

## Inputs and assumptions

- The change record content must have already been produced earlier in the current chat.
- Optional input may include a target file path. If not provided, use `change-records.md` in the current working directory.
- Optional input may include a candidate selector when multiple change records are present.

## Step-by-step execution instructions

1. Check chat context for an already-presented change record.
2. If no previously presented change record exists in the current chat, return exactly:
   `Use writeChangeRecord in this chat first so there is change record content to save.`
3. If multiple candidate change records exist and the intended one is ambiguous, return exactly:
   `Multiple change record candidates were found in this chat. Specify which one to save.`
4. Select the single intended change record content without regenerating or changing meaning.
5. If content is wrapped in a fenced code block, extract only the inner record text.
6. Resolve save path:
   - Use user-provided target path when available.
   - Otherwise use `change-records.md`.
7. Persist exactly one file:
   - If target file exists, append as a new section separated by a blank line.
   - If target file does not exist, create it and write the record.
8. Confirm success with the final saved path.

## Output format requirements

- Guard failures must return only the exact required guard message.
- On success, return one concise confirmation line with the saved file path.
- Do not output generated alternatives.

## Quality and validation checks

- Verify this prompt performs save-only behavior.
- Verify no change-record generation logic is introduced.
- Verify exactly one file is written.
- Verify the saved content is exactly one change record entry.
