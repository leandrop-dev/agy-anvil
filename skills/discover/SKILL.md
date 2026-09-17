---
name: anvil-discover
description: >-
  Use this skill when the user asks to analyze, explore, fingerprint, or map a new
  codebase, architectural topology, or repository structure.
---

# Codebase Discovery & Topology Analysis (`anvil-discover`)

Conducts a structured, read-only architectural reconnaissance of the repository.

## Execution Procedure

1. **Manifest & Stack Fingerprinting**:
   - Search for build manifests: `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, `pom.xml`, `build.gradle`.
   - Identify language versions, primary frameworks, package managers, and test runners.

2. **Top-Level Layout Mapping**:
   - Use `find_by_name` with `MaxDepth: 2` to identify entry points (`src/`, `cmd/`, `app/`, `internal/`, `tests/`).

3. **Subagent Delegation (Optional for Large Repos)**:
   - For repositories with >100 files, define the `code-analyst` subagent using `define_subagent` and prompt from `agents/code-analyst.md` (`enable_write_tools: false`, `Model: "flash"`).
   - Invoke `code-analyst` to map module dependencies and data flows without cluttering the main conversation context.

4. **Identify Coupling & God Nodes**:
   - Locate high-churn or disproportionately large files (>500 lines) that may act as central bottlenecks.

5. **Generate Reconnaissance Summary**:
   - Format results as a Markdown table:
     | Dimension | Identified Stack | Notes / Location |
     | :--- | :--- | :--- |
   - Provide a Mermaid flowchart showing major layer interactions.
   - Propose next steps (e.g. creating an ADR, planning features).
