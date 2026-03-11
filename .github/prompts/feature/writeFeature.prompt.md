---
model: GPT-5.3-Codex
tools: []
description: Generate a structured feature definition from arbitrary user input.
agent: agent
argument-hint: Provide any notes, requirements, constraints, examples, or partial specs for the feature.
name: writeFeature
---

Convert the full user argument into exactly one complete feature definition artifact.

Include only details supported by the provided input. In scope: feature intent, user value, behavior, constraints, acceptance criteria, and known dependencies. Out of scope: implementation code, architecture redesign, unrelated roadmap ideas, or multiple alternative feature definitions unless explicitly requested.

Treat the entire user argument as source material. Input may be brief, long, mixed, incomplete, or partially conflicting. Preserve explicit constraints and metadata when present. If key details are missing, make conservative assumptions and label them as assumptions. If no input is provided, return exactly: `No input was provided. Supply requirements or context to generate a feature definition.`

Follow these steps in order:
1. Parse the input and extract explicit goals, users, constraints, exclusions, and success signals.
2. Reconcile conflicts by prioritizing explicit constraints over implied preferences.
3. Normalize the result into one coherent feature definition with clear boundaries.
4. Add only minimal assumptions required to make the feature definition actionable.
5. Ensure every requirement in the output is traceable to input or labeled assumption.
6. Remove speculative, duplicated, or unrelated content.

Return one feature definition in markdown using this section order:
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

Quality checks before finalizing:
- Exactly one feature definition is produced.
- Explicit user constraints are preserved.
- Ambiguities are handled conservatively.
- Acceptance criteria are measurable and unambiguous.
- No extra deliverables, alternatives, or commentary are added.