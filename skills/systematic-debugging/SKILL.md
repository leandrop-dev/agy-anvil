---
name: anvil-systematic-debugging
description: >-
  Use this skill when the user asks to debug a bug, resolve failing tests, or
  perform root cause analysis on an unexpected error.
---

# Systematic Debugging Protocol (`anvil-systematic-debugging`)

Enforces a 4-phase, hypothesis-driven debugging methodology that prevents random code mutations.

## 4-Phase Protocol

### Phase 1: Observation & Deterministic Reproduction
- Never guess the error cause.
- Run the test suite or reproduction command to observe the exact stack trace, exit code, and error messages.
- If no automated reproduction exists, write a minimal failing test case first.

### Phase 2: Hypothesis Formulation
- Trace the failure from symptom back to origin using `view_file` and `grep_search`.
- Formulate an explicit hypothesis: "The error occurs because component X receives input Y without handling condition Z."

### Phase 3: Variable Isolation & Minimal Fix
- Change only ONE variable at a time.
- Implement the minimal surgical fix using `replace_file_content`.
- Avoid broad refactoring or unrelated code cleanups during bug fixes.

### Phase 4: Regression Verification & Lesson Capture
- Re-run the reproduction test to verify the fix succeeds.
- Re-run the full workspace test suite to ensure zero regressions.
- If the bug was subtle or recurrent, record the anti-pattern in `.anvil/lessons.md`.
