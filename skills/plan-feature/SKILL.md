---
name: anvil-plan-feature
description: >-
  Use this skill when the user asks to plan a new feature, break down requirements,
  architect a solution, or prepare technical tasks in .anvil/features/.
---

# Feature Planning & Task Decomposition (`anvil-plan-feature`)

Guides the phased planning, adversarial critique, and task decomposition of new features.

## Procedure

1. **Clarify Requirements & Constraints**:
   - Use `ask_question` to resolve any architectural ambiguities, edge-case handling preferences, and test requirements.
   - Establish a clean feature slug: `<feature-name>` (lowercase, hyphenated).

2. **Scaffold Feature State**:
   - Create `.anvil/features/<feature-name>/`:
     ```text
     .anvil/features/<feature-name>/
     ├── .active
     ├── plan.md
     └── tasks/
         ├── 01-setup.md
         ├── 02-core.md
         └── 03-verification.md
     ```
   - Touch `.active` marker so lifecycle hooks can monitor execution progress.

3. **Draft Architectural Specification (`plan.md`)**:
   - Define Problem Statement, Scope Boundaries, File Changes Matrix, and Test Strategy.

4. **Adversarial Subagent Review (`plan-critic`)**:
   - Define subagent `plan-critic` with `define_subagent` using the prompt in `agents/plan-critic.md` (`enable_write_tools: false`).
   - Call `invoke_subagent` with `Model: "pro"` to review the draft plan against edge cases, backward compatibility, and failure modes.
   - Incorporate `plan-critic` findings into `plan.md`.

5. **Generate Granular Tasks (`tasks/*.md`)**:
   - Each task file must contain:
     - Clear acceptance criteria.
     - Checklist items: `- [ ] <specific step>`.
     - Exact verification command to run.

6. **Render Interactive Antigravity Artifact**:
   - Create an artifact document presenting the plan summary and task breakdown to the user with `ArtifactMetadata` (`RequestFeedback: true`, `UserFacing: true`).
   - The user will be presented with a native "Proceed" button to trigger execution.
