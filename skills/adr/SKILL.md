---
name: anvil-adr
description: >-
  Use this skill when the user asks to create, record, document, or evaluate an
  Architectural Decision Record (ADR) using the Nygard format.
---

# Architecture Decision Record Generator (`anvil-adr`)

Creates, maintains, and numbers structured ADRs in `docs/adr/`.

## Procedure

1. **Locate or Create ADR Directory**:
   - Check if `docs/adr/` exists. If not, create it.
   - Scan existing records (`docs/adr/NNNN-*.md`) to determine the next sequential index (e.g. `0001`, `0002`).

2. **Clarify Decision Context**:
   - If options or consequences are ambiguous, use `ask_question` to gather decider rationale, rejected alternatives, and trade-offs.

3. **Draft the ADR**:
   - Use the template in `resources/template.md`.
   - Name the file `docs/adr/NNNN-<slug-title>.md`.
   - Provide concrete decision drivers and balanced trade-offs.

4. **Synchronize Project Memory**:
   - Append a 1-line reference and link in `.anvil/memory.md` under `Key Architectural Decisions`.
