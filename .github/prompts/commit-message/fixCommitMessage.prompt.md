---
model: GPT-5.1-Codex
tools: [read]
description: Rewrite one referenced commit message to strict Conventional Commit format and return it in a fenced code block.
agent: agent
argument-hint: "Provide one existing commit message and optional change context (files/diff notes) to normalize."
name: fixCommitMessage
---
Rewrite exactly one referenced commit message so it strictly conforms to the repository's `writeCommitMessage` format and rules.

## Action Boundary

- This is a `write` action: respond in Copilot chat only.
- Do not write files, save artifacts, or perform filesystem persistence.

## Task statement

- Produce one corrected, copy-ready Conventional Commit message from one referenced commit message.

## Scope and boundaries

- Rewrite one existing commit message only.
- Do not generate multiple alternatives.
- Do not infer unrelated changes.

## Inputs and assumptions

- Primary input is one referenced commit message.
- Optional context may include changed files, diff summary, or intent notes.
- Preserve explicit intent; if context is missing, use conservative defaults.

## Step-by-step execution instructions

1. Parse the referenced message into header, body, and footer.
2. Enforce header format: `<type>(<scope>): <subject>`.
3. Restrict `type` to: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
4. Resolve `scope` to a short, specific area; if uncertain, use `repo`.
5. Rewrite `subject` to imperative mood, no trailing period, max 72 characters.
6. Rewrite body to 1-3 concise factual lines describing what changed and why.
7. Include optional footer only when explicitly applicable:
   - `BREAKING CHANGE: <details>`
   - `Refs: #<id>`
8. If rename evidence is provided, include at least one body line in `old-path -> new-path` format.
9. If insufficient details exist, apply defaults:
   - `type`: `chore`
   - `scope`: `repo`
   - `subject`: `update project files`

## Output format requirements

- Return only the final commit message.
- Wrap the full response in exactly one fenced markdown code block:

```text
<commit message>
```

- Do not include commentary before or after the fenced block.

## Quality and validation checks

- Exactly one commit message is returned.
- Header is valid Conventional Commit syntax.
- Subject is imperative and <=72 chars.
- Body is factual and non-speculative.
- No extra explanations or alternatives are included.
