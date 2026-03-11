---
model: GPT-5.1-Codex
tools: [read]
description: Save one previously written commit message from the current Copilot chat to a file.
agent: agent
argument-hint: "Optional: provide target file path and candidate identifier when multiple commit messages exist."
name: saveCommitMessage
---
Save exactly one commit message to a filesystem file using commit message content that has already been presented in the current Copilot chat.

## Action Boundary

- This is a `save` action: persist one artifact to the filesystem.
- Do not generate or rewrite commit message content.

## Task statement

- Persist one existing commit message (already shown in chat) to a file.

## Scope and boundaries

- In scope: locating previously presented commit message content in the current chat, validating save guards, and writing one file.
- Out of scope: generating, rewriting, improving, or reinterpreting commit message text.
- Do not run the `writeCommitMessage` workflow inside this prompt.

## Inputs and assumptions

- The commit message content must have already been produced earlier in the current chat.
- Optional input may include a target file path. If not provided, use `commit-messages.md` in the current working directory.
- Optional input may include a candidate selector when multiple commit messages are present.

## Step-by-step execution instructions

1. Check chat context for an already-presented commit message.
2. If no previously presented commit message exists in the current chat, return exactly:
   `Use writeCommitMessage in this chat first so there is commit message content to save.`
3. If multiple candidate commit messages exist and the intended one is ambiguous, return exactly:
   `Multiple commit message candidates were found in this chat. Specify which one to save.`
4. Select the single intended commit message content without regenerating or changing meaning.
5. If content is wrapped in a fenced code block, extract only the inner message text.
6. Resolve save path:
   - Use user-provided target path when available.
   - Otherwise use `commit-messages.md`.
7. Persist exactly one file:
   - If target file exists, append as a new entry separated by a blank line.
   - If target file does not exist, create it and write the entry.
8. Confirm success with the final saved path.

## Output format requirements

- Guard failures must return only the exact required guard message.
- On success, return one concise confirmation line with the saved file path.
- Do not output generated alternatives.

## Quality and validation checks

- Verify this prompt performs save-only behavior.
- Verify no commit-message generation logic is introduced.
- Verify exactly one file is written.
- Verify the saved content is exactly one commit message entry.
