#!/usr/bin/env bash
set -euo pipefail

# AntigravityAnvil (agy-anvil) Linux / macOS Installer
# Installs agy-anvil as a plugin for Google Antigravity (AGY)

PLUGIN_NAME="anvil"
GLOBAL_TARGET="${HOME}/.gemini/config/plugins/${PLUGIN_NAME}"
WORKSPACE_TARGET=".agents/plugins/${PLUGIN_NAME}"

MODE="copy"
TARGET_DIR="${GLOBAL_TARGET}"

usage() {
  echo "Usage: ./install.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  -l, --link       Symlink instead of copying (ideal for active development)"
  echo "  -w, --workspace  Install into current workspace (.agents/plugins/anvil) instead of machine-wide"
  echo "  -h, --help       Show this help message"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -l|--link)
      MODE="link"
      shift
      ;;
    -w|--workspace)
      TARGET_DIR="${WORKSPACE_TARGET}"
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

echo "==> Installing AntigravityAnvil ($PLUGIN_NAME)..."

# Verify Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "WARNING: Node.js was not found in PATH. Lifecycle hooks require Node.js >= 18."
else
  NODE_VER=$(node --version)
  echo "Found Node.js $NODE_VER"
fi

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure parent directory exists
mkdir -p "$(dirname "$TARGET_DIR")"

# Remove existing installation / symlink if present
if [ -L "$TARGET_DIR" ] || [ -d "$TARGET_DIR" ]; then
  echo "Removing existing installation at $TARGET_DIR..."
  rm -rf "$TARGET_DIR"
fi

if [ "$MODE" = "link" ]; then
  echo "Symlinking $SOURCE_DIR -> $TARGET_DIR..."
  ln -s "$SOURCE_DIR" "$TARGET_DIR"
else
  echo "Copying $SOURCE_DIR -> $TARGET_DIR..."
  mkdir -p "$TARGET_DIR"
  cp -R "$SOURCE_DIR"/* "$TARGET_DIR"/
fi

echo ""
echo " AntigravityAnvil installed successfully!"
echo "Location: $TARGET_DIR"
echo ""
echo "To verify discovery, restart AGY or check with:"
echo "  agy plugin enable $PLUGIN_NAME"
