---
name: anvil-session-review
description: >-
  Use this skill when concluding a session, conducting a retrospective, or
  updating lessons learned and project memory in .anvil/.
---

# Session Retrospective & Memory Consolidation (`anvil-session-review`)

Synthesizes progress, captures learnings, and consolidates persistent project memory at the end of a session.

## Procedure

1. **Review Session History**:
   - Inspect files modified during the conversation.
   - Note any difficult bugs, false assumptions, or tricky edge cases encountered.

2. **Update Lessons Learned (`.anvil/lessons.md`)**:
   - If an anti-pattern or debugging insight emerged, append it under `Anti-Patterns to Avoid` or `Known Gotchas`.

3. **Consolidate Project Memory (`.anvil/memory.md`)**:
   - If new libraries, environment variables, or commands were introduced, record them.

4. **Summarize Session Output**:
   - Output a concise markdown summary:
     - Completed tasks & commits created.
     - New lessons recorded.
     - Recommended starting point for the next session.
