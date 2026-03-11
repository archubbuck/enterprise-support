---
applyTo: "docs/**"
---

# Documentation Organization Instructions

These instructions define the authoritative strategy for organizing, creating, updating, and validating documentation in this repository. They are fully self-contained and must not depend on or reference any external file for supplementation.

---

## 1. Operating Model

Documentation is split into two lanes based on content stability and intent:

### Domain Documents

Domain documents are **durable, canonical sources of truth**. They define architecture, policy, security posture, or governance standards that change infrequently and only when the system's fundamental shape or policy changes.

Characteristics:
- Describe **what the system is** or **what must be true**.
- Owned by a named area of responsibility (architecture, security, privacy, etc.).
- Written for maintainers who need authoritative context, not step-by-step procedures.
- May delegate operational detail to topic documents via links.

Examples of domain document subjects: technical architecture map, security and data-handling policy, privacy policy entry point.

### Topic Documents

Topic documents are **operational, task-oriented guides**. They describe how to accomplish a specific workflow, recover from a failure, or execute a lifecycle event.

Characteristics:
- Describe **how to do something** or **how to resolve something**.
- Scoped to a single workflow or concern (setup, configuration, content operations, platform build, release execution, incident triage, troubleshooting).
- Written for maintainers who need to act, not understand system philosophy.
- Include prerequisites, step-by-step procedures, commands, and expected outcomes.

Examples of topic document subjects: first-day setup, configuration reference, content management, platform-specific build flow, CI/CD release execution, operational runbook, troubleshooting playbook.

### Decision Rule: Domain vs. Topic

When creating a new document, classify it using this test:

1. **Is the content a standard, policy, or structural truth that rarely changes?** → Domain document.
2. **Is the content an actionable procedure, workflow, or troubleshooting guide?** → Topic document.
3. **If uncertain:** Prefer the **topic** lane. Procedures are easier to promote to domain status later than to demote domain content into a procedure.

---

## 2. Placement and Naming Rules

### Folder Structure

```
docs/
├── README.md              ← Central index (required)
├── domains/               ← Domain documents only
│   └── EXAMPLE.md
└── topics/                ← Topic documents only
    └── example-topic.md
```

### Naming Conventions

| Lane   | Folder          | Filename Casing             | Examples                              |
|--------|-----------------|-----------------------------|---------------------------------------|
| Domain | `docs/domains/` | UPPERCASE with hyphens      | `ARCHITECTURE.md`, `SECURITY.md`      |
| Topic  | `docs/topics/`  | lowercase kebab-case        | `quick-start.md`, `release-operations.md` |
| Index  | `docs/`         | `README.md` (exactly)       | `docs/README.md`                      |

### Prohibited Patterns

- Do not place domain documents in `docs/topics/` or topic documents in `docs/domains/`.
- Do not use camelCase, snake_case, or mixed-case filenames.
- Do not create documentation files at the `docs/` root other than `README.md`.
- Do not create subdirectories inside `docs/domains/` or `docs/topics/` without explicit justification. The taxonomy is intentionally flat within each lane.

---

## 3. Document Blueprints

Every document must follow its lane's blueprint. Sections marked **(required)** must always be present; sections marked **(conditional)** are included when applicable.

### Domain Document Blueprint

```markdown
# {Domain Title}                                          ← (required)

{One-sentence scope statement declaring this document      ← (required)
as the canonical source of truth for its domain.}

## {Primary Sections}                                      ← (required, 1+)

{Authoritative content: system shape, policy decisions,
constraints, standards, or governance rules.}

## Ownership Notes                                         ← (conditional: include for
                                                              architecture or governance docs)
{Who maintains this document, when to update it,
and what downstream documents depend on it.}
```

**Rules for domain documents:**
- The first paragraph after the title must declare the document's canonical authority (e.g., "This document is the technical source of truth for…").
- Must link to topic documents for any operational procedures it references, rather than inlining those procedures.
- Must not contain step-by-step command sequences (delegate to topics).

### Topic Document Blueprint

```markdown
# {Topic Title}                                            ← (required)

{One-sentence statement of what the reader will be able     ← (required)
to accomplish after following this guide. If this topic
delegates to or is scoped by another doc, state that here.}

## Prerequisites                                           ← (conditional: include if
                                                              setup or tooling is needed)
{Tools, versions, access, or prior steps required.}

## {Procedure Sections}                                    ← (required, 1+)

{Step-by-step instructions, commands, expected outcomes.
Use code blocks for all commands.
Use numbered lists for sequential procedures.
Use checklists for verification steps.}

## {Failure Handling / Troubleshooting}                    ← (conditional: include if
                                                              common failures exist)
{Symptoms, fix commands, and escalation pointers.}

## Related Docs                                            ← (required)

- [{related-doc-name.md}](./{relative-path})
```

**Rules for topic documents:**
- The opening line must state the task outcome or workflow scope.
- If the topic is scoped away from another concern, the opening must declare the boundary (e.g., "Release operations and App Store deployment are documented in [release-operations.md](./release-operations.md).").
- Must end with a **Related Docs** section containing relative Markdown links to at least one other document.
- Must include runnable commands in fenced code blocks wherever the reader is expected to execute something.

---

## 4. Central Index (`docs/README.md`)

The index is the single entry point for all documentation. It must be maintained whenever documents are added, removed, or renamed.

### Required Sections in the Index

1. **Domains** — lists every domain document with a one-line description.
2. **Topics** — lists every topic document with a one-line description.
3. **Suggested Reading Paths** — role-based ordered reading sequences.

### Index Rules

- Every document in `docs/domains/` and `docs/topics/` must appear in the index.
- No document may exist in those folders without an index entry.
- Descriptions must be a single phrase or sentence (no paragraphs).
- Reading paths must reference only documents that exist in the Domains or Topics lists.
- Reading paths are organized by persona/role (e.g., "New Maintainer", "Release Owner", "Incident Responder") and ordered from foundational to advanced.

### Index Template

```markdown
# Documentation Index

This documentation set is organized for {audience description}.

## Domains

High-level entry points for each area of ownership:

- [{DOMAIN-NAME.md}](./domains/{DOMAIN-NAME.md}): {one-line description}

## Topics

Hands-on guides for specific workflows (in `docs/topics/`):

- [{topic-name.md}](./topics/{topic-name.md}): {one-line description}

## Suggested Reading Paths

### {Role Name}

1. [{doc-name}](./path/to/doc)
2. [{doc-name}](./path/to/doc)
```

---

## 5. Linking and Navigation Contract

### Cross-Linking Rules

- All internal links must be **relative Markdown links** (e.g., `[runbook.md](./runbook.md)` or `[ARCHITECTURE.md](../domains/ARCHITECTURE.md)`).
- Links from domain docs to topic docs use `../topics/{name}.md`.
- Links from topic docs to domain docs use `../domains/{NAME}.md`.
- Links between topic docs in the same folder use `./{name}.md`.

### Bidirectional Linking

- If document A links to document B as a downstream reference, document B should link back to document A in its Related Docs section or opening scope statement.
- Exception: the index (`docs/README.md`) links to all documents but does not need reciprocal links.

### Escalation Chains

Topic documents that handle failures or incidents must link to the next escalation document:
- Troubleshooting → Runbook
- Runbook → Release Operations (for release-specific incidents)
- Platform-specific docs → Troubleshooting (for common failures)

### Entry-Point Documents

A domain document may serve as a discovery **entry point** that delegates its maintained content to another document. In this case:
- The entry-point document must clearly state which document holds the maintained source.
- The entry-point document must link directly to the maintained source.
- Updates must be applied to the maintained source first, then the entry point synced if needed.

---

## 6. Change-Trigger Matrix

When a change occurs in the repository, the following documentation updates are required:

| Change Type                        | Documents to Update                                         |
|------------------------------------|-------------------------------------------------------------|
| App structure or runtime flow      | Domain: architecture doc. Topic: affected workflow docs.     |
| Security or privacy posture        | Domain: security doc. Sync: privacy entry-point.            |
| New or changed `APP_CONFIG_*` keys | Topic: configuration doc. Topic: content management (if flag-related). |
| New/removed support documents      | Topic: content management doc. Validate: manifest.          |
| CI/CD workflow changes             | Topic: release operations doc. Topic: runbook (if checklist affected). |
| iOS build/signing changes          | Topic: iOS development doc. Topic: release operations (if deploy affected). |
| New troubleshooting pattern        | Topic: troubleshooting doc.                                 |
| Ownership or handoff event         | Topic: runbook doc. Domain: architecture ownership notes.   |
| New document added                 | Index: add entry + update reading paths if applicable.      |
| Document removed or renamed        | Index: remove/update entry. All docs: fix broken links.     |

---

## 7. Quality Gate Checklist

Before completing any documentation task, verify all of the following:

- [ ] **Lane placement**: Document is in the correct folder (`docs/domains/` or `docs/topics/`).
- [ ] **Naming convention**: Filename matches its lane's casing rule (UPPERCASE for domains, kebab-case for topics).
- [ ] **Blueprint compliance**: Document contains all required sections for its lane's blueprint.
- [ ] **Scope statement**: First paragraph declares canonical authority (domain) or task outcome (topic).
- [ ] **Related Docs present**: Topic documents end with a Related Docs section containing at least one relative link.
- [ ] **Index updated**: `docs/README.md` lists the document with a one-line description in the correct section.
- [ ] **Reading paths reviewed**: If the document serves a specific role workflow, it is included in the appropriate Suggested Reading Path.
- [ ] **Cross-links valid**: All relative links in the new/updated document resolve to existing files.
- [ ] **Bidirectional links**: Documents referenced by the new doc link back to it where appropriate.
- [ ] **No orphan documents**: No file exists in `docs/domains/` or `docs/topics/` without an index entry.
- [ ] **Change triggers honored**: If the change that prompted this doc update affects other documents (per the Change-Trigger Matrix), those documents are also updated.

---

## 8. Validation Examples

These examples demonstrate correct classification and placement decisions.

### Example A: Architecture Change

**Scenario:** The app's runtime flow is restructured to load configuration from a remote source instead of env files.

**Classification:** This changes the system's fundamental shape → update the **domain** architecture document's "Runtime Flow" and "Configuration Model" sections. Then update the **topic** configuration document's setup procedure and validation commands. Update the index descriptions if scope changed.

### Example B: New Release Workflow Step

**Scenario:** A new pre-release validation step is added that requires running a metadata check before tagging.

**Classification:** This is an operational procedure change → update the **topic** release operations document's command sequence and the **topic** runbook's release checklist. No domain document changes needed unless the CI/CD architecture section is outdated.

### Example C: New Troubleshooting Entry

**Scenario:** A recurring CocoaPods cache issue is identified during iOS builds.

**Classification:** This is a failure-resolution procedure → add an entry to the **topic** troubleshooting document under "Common Problems". Add a cross-link from the **topic** iOS development document if one doesn't exist. No domain document changes needed.

---

## 9. Anti-Patterns

Avoid these documentation mistakes:

- **Inlining procedures in domain docs**: Domain documents must link to topic docs for step-by-step instructions, not contain them.
- **Creating domain docs for transient concerns**: If the content will change frequently with each release cycle, it belongs in a topic document.
- **Orphan documents**: Never add a file to `docs/domains/` or `docs/topics/` without updating the index.
- **Broken escalation chains**: Troubleshooting and runbook documents must always link to each other; never leave a dead end.
- **External dependencies in instructions**: These instructions must remain self-contained. Do not add "see file X for rules" clauses that would create hidden dependencies.
- **Deep nesting**: Do not create subdirectories inside `docs/domains/` or `docs/topics/`. The flat structure is intentional and aids discoverability.
- **Screenshot-dependent documentation**: Documentation must be textually complete. Screenshots are supplementary artifacts, not structural components of the documentation taxonomy.
