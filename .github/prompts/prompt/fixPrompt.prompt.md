---
model: GPT-5.1-Codex
tools: [read]
description: Rewrite one referenced prompt draft to strict writePrompt structure and return it in a fenced code block.
agent: agent
argument-hint: "Provide one existing prompt draft (can be incomplete/conflicting) to normalize."
name: fixPrompt
---
Rewrite exactly one referenced prompt so it strictly conforms to the repository's `writePrompt` structure and rules.

Apply shared lifecycle invariants from [prompt-management.instructions.md](../../instructions/prompt-management.instructions.md).

## Task statement

- Produce one corrected, execution-ready prompt from one referenced draft prompt.

## Scope and boundaries

- Rewrite one prompt only.
- This workflow only repairs existing prompt text.

## Inputs and assumptions

- Primary input is one referenced prompt draft (may be incomplete or conflicting).
- Preserve explicit actionable constraints verbatim where possible.
- Resolve ambiguity conservatively with neutral defaults.
- Ensure repaired prompt metadata clearly maps the artifact to one .github/prompts/<subfolder> family when determinable from context.

## Step-by-step execution instructions

1. Extract explicit requirements, constraints, intended outputs, and quality criteria.
2. Prioritize explicit constraints over inferred preferences.
3. Resolve conflicting instructions conservatively; keep dominant intent and move secondary intents into constraints.
4. Rebuild the prompt in this exact order:
   1) Task statement
   2) Scope and boundaries
   3) Inputs and assumptions
   4) Step-by-step execution instructions
   5) Output format requirements
   6) Quality and validation checks
5. Remove vague or non-testable language and make instructions concrete.
6. If missing details, apply defaults:
   - formatting: markdown (unless specified otherwise)

## Output format requirements

- Return only the rewritten prompt.
- Wrap the full response in exactly one fenced markdown code block:

```text
<generated prompt>
```

- Do not include explanations before or after the fenced block.

## Quality and validation checks

- Exactly one prompt is returned.
- Required six-part structure is present and in the correct order.
- Metadata supports saving the prompt under one appropriate .github/prompts/<subfolder>.
- Instructions are unambiguous and testable.
