---
name: anvil-next-steps
description: >-
  Use this skill when the user asks what to work on next, requests current status,
  or asks about blockers across features in .anvil/.
---

# Next Steps & Status Reporter (`anvil-next-steps`)

Inspects workspace state and active feature plans to report concrete next actions.

## Procedure

1. **State Audit**:
   - Check git status (`git status -s`, `git branch --show-current`).
   - Inspect `.anvil/features/` for any active features (`.active` file present).

2. **Progress Analysis**:
   - Count completed `- [x]` vs remaining `- [ ]` checklist items across task files.
   - Check if uncommitted changes or unstaged modifications exist.

3. **Status Report**:
   - Present a Markdown table summarizing:
     | Feature | Current Branch | Progress | Next Action | Blockers |
     | :--- | :--- | :--- | :--- | :--- |
   - Recommend the exact next task command or skill to run.
