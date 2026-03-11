---
model: GPT-5.1-Codex
tools: [read]
description: Rewrite one referenced feature definition draft into a corrected, complete, and testable feature definition.
agent: agent
argument-hint: "Provide one existing feature definition draft (or partial notes) to normalize and fix."
name: fixFeature
---

Rewrite exactly one referenced feature definition so it is complete, internally consistent, and execution-ready.

## Scope and boundaries

- In scope: repairing one existing feature definition artifact, resolving conflicts, clarifying ambiguous requirements, and preserving explicit constraints.
- Out of scope: implementing code, proposing multiple alternative feature definitions, or introducing unrelated roadmap items.
- Do not create more than one primary artifact.

## Inputs and assumptions

- Primary input is one referenced feature definition draft (can be partial, inconsistent, or low quality).
- Preserve explicit user-provided constraints and metadata where possible.
- If details are missing, apply conservative assumptions and label them clearly.
- If the input is irreparably ambiguous, retain dominant intent and convert unresolved items into open questions.

## Step-by-step execution instructions

1. Parse the draft and extract explicit goals, users, constraints, non-goals, and success criteria.
2. Identify contradictions, omissions, and vague language.
3. Resolve conflicts by prioritizing explicit constraints over inferred preferences.
4. Rebuild the feature definition in one coherent structure with clear boundaries and testable acceptance criteria.
5. Preserve intent while normalizing wording and removing duplication.
6. Add only minimal assumptions required for actionability, and mark them as assumptions.
7. Ensure each requirement is traceable to source input or an explicit assumption.
8. Include unresolved ambiguities as open questions instead of inventing unsupported specifics.

## Output format requirements

- Return exactly one corrected feature definition in markdown.
- Use this section order:
  1. Feature Name
  2. Problem Statement
  3. Target Users
  4. Goals
  5. Non-Goals
  6. Scope (In/Out)
  7. Functional Requirements
  8. Constraints
  9. Assumptions
  10. Acceptance Criteria (testable)
  11. Dependencies
  12. Open Questions
- Do not include explanations outside the artifact.

## Quality and validation checks

- Exactly one feature definition is produced.
- Explicit constraints from input are preserved.
- Conflicts are resolved conservatively and consistently.
- Acceptance criteria are specific, measurable, and testable.
- No implementation code or unrelated deliverables are introduced.