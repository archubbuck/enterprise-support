---
model: GPT-5.1-Codex    
tools: [execute, read]
description: This prompt is used to generate a concise and informative commit message based on the changes made in a code repository. The user can provide a description of the changes or reference specific files to analyze the changes and generate an appropriate commit message.
agent: agent
argument-hint: "Please provide a brief description of the changes made in the code repository or reference specific files that were changed."
name: generateCommitMessage
---
Generate a commit message based on the changes made in the code repository. Please provide a brief description of the changes and any relevant details that should be included in the commit message. If you have specific files that were changed, please reference them so that the prompt can analyze the changes and generate a comprehensive commit message.