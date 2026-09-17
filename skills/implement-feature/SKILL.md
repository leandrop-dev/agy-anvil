---
name: anvil-implement-feature
description: >-
  Use this skill when the user asks to implement, execute, or build tasks from an
  approved feature plan in .anvil/features/.
---

# Feature Implementation Loop (`anvil-implement-feature`)

Executes feature tasks sequentially under a strict verification discipline.

## Procedure

1. **Locate Active Feature**:
   - Inspect `.anvil/features/` to find the directory containing `.active` (or let user specify feature name).
   - Read `.anvil/features/<feature-name>/plan.md` and read all task files under `tasks/`.

2. **Sequential Task Execution**:
   For each task file `tasks/NN-*.md`:
   - Inspect unchecked items: `- [ ]`.
   - Option A (Direct Execution): Use `replace_file_content` to make surgical updates.
   - Option B (Subagent Delegation): If the task is self-contained or complex, define `implementer` (`agents/implementer.md`) and call `invoke_subagent` with `Workspace: "branch"` to isolate worktree edits.
   - Run verification test commands fresh via `run_command`.
   - When tests pass, update task file checkbox to `- [x]`.

3. **Code Review Gate**:
   - Before finishing the feature, define `code-reviewer` (`agents/code-reviewer.md`, `enable_write_tools: false`, `Model: "flash"`).
   - Run `git diff` review against `.anvil/conventions.md`.

4. **Mark Completion**:
   - Once all tasks in `tasks/` are `- [x]`:
   - Remove `.anvil/features/<feature-name>/.active`.
   - Present a concise summary of changes and test evidence.
