---
model: GPT-5.1-Codex
tools: [read, execute]
description: Generate one complete prompt file from arbitrary user input, including YAML frontmatter, and return it in a fenced code block.
agent: agent
argument-hint: "Provide any combination of goal, constraints, style notes, examples, inputs, outputs, tooling, or audience details; free-form text is accepted."
name: writePrompt
---
Write exactly one prompt from the user-provided arbitrary input.

Apply shared lifecycle invariants from [prompt-management.instructions.md](../instructions/prompt-management.instructions.md).

## Input

Treat the entire user argument as source material. Input may be:
- a short request
- a long mixed specification
- bullet points, prose, examples, or constraints
- partially conflicting or incomplete notes

If no input is provided, return:
`No input was provided. Supply requirements or context to generate a prompt.`

## Prompt Construction Rules

Build exactly one prompt using this structure and order:

1. YAML frontmatter delimited by opening and closing `---` lines
2. Task statement (what to produce)
3. Scope and boundaries (what is in/out)
4. Inputs and assumptions
5. Step-by-step execution instructions
6. Output format requirements
7. Quality and validation checks

Frontmatter requirements:
- Frontmatter must be the first content in the generated prompt.
- Frontmatter must include all of these keys: `model`, `tools`, `description`, `agent`, `argument-hint`, `name`.
- Preserve explicit user-provided metadata values when supplied; otherwise choose neutral defaults consistent with the prompt intent.

## Consistency Defaults

If specific details are not provided, use:
- formatting: markdown unless user input specifies otherwise

## Quick Usage Examples

Example input shapes this prompt accepts:

1. `Create a prompt that generates release notes from git commits.`
2. `Goal: Build a migration checklist\nConstraints: no downtime, PostgreSQL\nOutput: markdown table`
3. `Need a prompt for evaluating API responses. Audience: QA. Include pass/fail criteria and edge cases.`

Expected behavior:
- Produces one complete prompt only.
- Includes YAML frontmatter in the generated prompt.
- Preserves explicit constraints from the input.
- Returns output in one fenced `text` code block.

## Output Format (Strict)

- Return only the generated prompt.
- Wrap the full response in exactly one fenced markdown code block.
- The fenced block must contain the complete prompt file content, including frontmatter and both `---` delimiters.
- Use this exact wrapper:

```text
<generated prompt>
```

- Do not include explanations before or after the fenced block.
