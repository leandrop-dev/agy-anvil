#!/usr/bin/env node

/**
 * Anvil Auto-Typecheck & Verification Hook (PostInvocation)
 * Fires after tool execution. If code errors or compiler diagnostics are detected,
 * injects the diagnostics and uses terminationBehavior: "force_continue" so the agent
 * fixes the issue before stopping.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function runQuickCheck(workspaceRoot) {
  // Check TypeScript / JavaScript
  if (fs.existsSync(path.join(workspaceRoot, 'tsconfig.json'))) {
    try {
      execSync('npx tsc --noEmit --pretty false', {
        cwd: workspaceRoot,
        timeout: 5000,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      return null;
    } catch (err) {
      const output = (err.stdout ? err.stdout.toString() : '') + (err.stderr ? err.stderr.toString() : '');
      const lines = output.split('\n').filter(l => l.includes('error TS')).slice(0, 5);
      if (lines.length > 0) {
        return `TypeScript diagnostics:\n${lines.join('\n')}`;
      }
    }
  }

  // Check Go
  if (fs.existsSync(path.join(workspaceRoot, 'go.mod'))) {
    try {
      execSync('go vet ./...', {
        cwd: workspaceRoot,
        timeout: 5000,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      return null;
    } catch (err) {
      const output = (err.stderr ? err.stderr.toString() : err.stdout ? err.stdout.toString() : '').trim();
      if (output) {
        return `Go vet diagnostics:\n${output.split('\n').slice(0, 5).join('\n')}`;
      }
    }
  }

  return null;
}

async function main() {
  const payload = await readStdin();
  const workspacePaths = payload.workspacePaths || [];
  const root = workspacePaths[0] || process.cwd();

  const diagnosticError = runQuickCheck(root);

  if (diagnosticError) {
    console.log(JSON.stringify({
      injectSteps: [
        {
          ephemeralMessage: `[Anvil Post-Verification] Detected compiler/linter diagnostics:\n${diagnosticError}\nPlease resolve these errors before concluding your turn.`
        }
      ],
      terminationBehavior: "force_continue"
    }));
  } else {
    console.log(JSON.stringify({ injectSteps: [] }));
  }
}

main().catch(() => {
  console.log(JSON.stringify({ injectSteps: [] }));
});
