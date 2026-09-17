<#
.SYNOPSIS
    AntigravityAnvil (agy-anvil) Windows Installer
.DESCRIPTION
    Installs agy-anvil as a plugin for Google Antigravity (AGY) on Windows.
#>

param(
    [switch]$Link,
    [switch]$Workspace,
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage: .\install.ps1 [-Link] [-Workspace] [-Help]"
    Write-Host "  -Link      Create a directory junction instead of copying (for active development)"
    Write-Host "  -Workspace Install into current workspace (.agents/plugins/anvil) instead of machine-wide"
    exit 0
}

$PluginName = "anvil"
$GlobalTarget = Join-Path $env:USERPROFILE ".gemini\config\plugins\$PluginName"
$WorkspaceTarget = Join-Path (Get-Location) ".agents\plugins\$PluginName"

$TargetDir = if ($Workspace) { $WorkspaceTarget } else { $GlobalTarget }
$SourceDir = $PSScriptRoot

Write-Host "==> Installing AntigravityAnvil ($PluginName)..." -ForegroundColor Cyan

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVer = node --version
    Write-Host "Found Node.js: $nodeVer" -ForegroundColor Green
} else {
    Write-Warning "Node.js was not found in PATH. Lifecycle hooks require Node.js >= 18."
}

# Ensure parent directory exists
$parentDir = Split-Path -Parent $TargetDir
if (-not (Test-Path $parentDir)) {
    New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
}

# Remove existing install/junction
if (Test-Path $TargetDir) {
    Write-Host "Removing existing installation at $TargetDir..."
    Remove-Item -Recurse -Force $TargetDir
}

if ($Link) {
    Write-Host "Creating junction: $TargetDir -> $SourceDir..."
    New-Item -ItemType Junction -Path $TargetDir -Target $SourceDir | Out-Null
} else {
    Write-Host "Copying files: $SourceDir -> $TargetDir..."
    Copy-Item -Path $SourceDir -Destination $TargetDir -Recurse -Force
}

Write-Host ""
Write-Host " AntigravityAnvil installed successfully!" -ForegroundColor Green
Write-Host "Location: $TargetDir"
Write-Host ""
Write-Host "To verify discovery, restart AGY or check with:"
Write-Host "  agy plugin enable $PluginName"
