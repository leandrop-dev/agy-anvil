---
name: anvil-checkpoint
description: >-
  Use this skill when the user asks to checkpoint, commit, snapshot, or safely stash
  work in git.
---

# Safe Git Checkpoint (`anvil-checkpoint`)

Snapshots working progress safely following Anvil git hygiene.

## Procedure

1. **Verify State**:
   - Run `git status -s` to inspect dirty files.
   - Run `git diff` to ensure no accidental mutations to secrets or sensitive files.

2. **Run Quick Linter / Typecheck**:
   - Ensure the repository compiles and has no syntax breakages before snapshotting.

3. **Stage & Commit**:
   - Stage appropriate files (`git add <files>`).
   - Craft a capitalized, imperative single-line commit message ending with a period:
     `git commit -m "Implement task validation for authentication payload."`

4. **Report**:
   - Print the new commit hash and summary.
