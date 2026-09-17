---
name: anvil-create-pr
description: >-
  Use this skill when the user asks to open, create, or draft a Pull Request (PR)
  with evidence-backed descriptions.
---

# Pull Request Generator (`anvil-create-pr`)

Generates structured, evidence-backed PR descriptions ready for submission.

## Procedure

1. **Diff & Log Inspection**:
   - Run `git log origin/main..HEAD --oneline` (or current base branch).
   - Run `git diff origin/main...HEAD --stat` to review changed files.

2. **Verification Evidence**:
   - Run test suite freshly. Capture passing test counts and runtime output.

3. **Format PR Body**:
   - Title: Imperative, capitalized, under 72 chars.
   - Summary: Bullet points explaining *why* and *what*.
   - Architectural Changes / Decisions (reference ADR if applicable).
   - Verification Evidence: Output snippet of green test runs.
   - Checklist: Breaking changes, migrations, documentation updates.

4. **Output or Submit**:
   - If GitHub CLI (`gh`) is available, ask user via `ask_question` whether to submit directly (`gh pr create`).
   - Otherwise, display the formatted markdown for manual submission.
