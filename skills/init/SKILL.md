---
name: anvil-init
description: >-
  Use this skill when the user asks to initialize, setup, or scaffold AntigravityAnvil
  (.anvil/) in the current project or workspace.
---

# Anvil Project Initialization (`anvil-init`)

This skill sets up the persistent, zero-intrusion `.anvil/` framework directory in the current repository.

## Execution Steps

1. **Verify Workspace Root**:
   - Determine the git repository root via `run_command`: `git rev-parse --show-toplevel`.
   - Ensure the current working directory is inside a valid repository.

2. **Scaffold Directory Hierarchy**:
   Create the following structure under `<repo-root>/.anvil/`:
   ```text
   .anvil/
   ├── conventions.md
   ├── memory.md
   ├── lessons.md
   ├── .gitignore
   └── features/
   ```

3. **Populate Templates**:
   - Read boilerplate templates from the plugin's `templates/` directory (`conventions.md`, `memory.md`, `lessons.md`, `anvil-gitignore`).
   - Write them to `.anvil/conventions.md`, `.anvil/memory.md`, `.anvil/lessons.md`, and `.anvil/.gitignore`.

4. **Fingerprint Project Conventions**:
   - Inspect package manifests (`package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, etc.).
   - Populate initial test/build commands into `.anvil/conventions.md` and `.anvil/memory.md`.

5. **Report Status**:
   - Confirm successful initialization with an overview of created files and suggest running `anvil-discover` or `anvil-plan-feature`.
