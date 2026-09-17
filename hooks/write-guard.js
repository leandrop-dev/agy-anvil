#!/usr/bin/env node

/**
 * Anvil Write Guard (PreToolUse)
 * Intercepts write_to_file and replace_file_content to prevent accidental
 * mutation of sensitive or protected files.
 */

const fs = require('fs');
const path = require('path');

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

const HARD_BLOCK_PATTERNS = [
  /(^|[/\\])\.env($|\..+)/i,           // .env, .env.local, .env.production
  /(^|[/\\])\.git([/\\]|$)/i,          // .git internal files
  /(^|[/\\])id_rsa($|\.)/i,            // SSH private keys
  /(^|[/\\])\.aws([/\\]|$)/i,          // AWS credentials
  /(^|[/\\])\.npmrc$/i                 // npm credentials
];

const CONFIRM_PATTERNS = [
  /(^|[/\\])(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|Cargo\.lock|go\.sum)$/i,
  /(^|[/\\])\.github[/\\]workflows[/\\]/i,
  /(^|[/\\])\.gitlab-ci\.yml$/i
];

async function main() {
  const payload = await readStdin();
  const toolCall = payload.toolCall || {};
  const args = toolCall.args || {};
  const targetPath = args.TargetFile || args.targetFile || '';

  if (!targetPath) {
    console.log(JSON.stringify({ decision: 'allow' }));
    return;
  }

  const normalized = targetPath.replace(/\\/g, '/');

  // Hard blocks
  for (const pattern of HARD_BLOCK_PATTERNS) {
    if (pattern.test(normalized)) {
      console.log(JSON.stringify({
        decision: 'deny',
        reason: `[Anvil Write-Guard] Direct edit to protected sensitive path '${path.basename(normalized)}' is blocked.`
      }));
      return;
    }
  }

  // Ask confirmation
  for (const pattern of CONFIRM_PATTERNS) {
    if (pattern.test(normalized)) {
      console.log(JSON.stringify({
        decision: 'ask',
        reason: `[Anvil Write-Guard] Target '${path.basename(normalized)}' is a lockfile or CI/CD workflow. Please confirm modification.`
      }));
      return;
    }
  }

  console.log(JSON.stringify({ decision: 'allow' }));
}

main().catch(() => {
  console.log(JSON.stringify({ decision: 'allow' }));
});
