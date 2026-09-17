#!/usr/bin/env node

/**
 * Anvil Push & Destructive Command Guard (PreToolUse)
 * Intercepts run_command executions that could cause catastrophic state loss.
 */

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

const HIGH_RISK_PATTERNS = [
  { regex: /\bgit\s+push\s+.*(--force|-f)\b/i, label: 'Force push to remote git repository' },
  { regex: /\bgit\s+reset\s+--hard\b/i, label: 'Hard git reset (uncommitted work will be destroyed)' },
  { regex: /\brm\s+(-rf|-fr|-r\s+-f|-f\s+-r)\s+([/~*]|\.\.?([/\\]|$))/i, label: 'Broad recursive deletion' },
  { regex: /\b(drop\s+database|drop\s+table|truncate\s+table)\b/i, label: 'Destructive database mutation' },
  { regex: /\b(mkfs|dd\s+if=)\b/i, label: 'Low-level disk/filesystem command' }
];

async function main() {
  const payload = await readStdin();
  const toolCall = payload.toolCall || {};
  const args = toolCall.args || {};
  const cmd = args.CommandLine || args.commandLine || '';

  if (!cmd) {
    console.log(JSON.stringify({ decision: 'allow' }));
    return;
  }

  for (const { regex, label } of HIGH_RISK_PATTERNS) {
    if (regex.test(cmd)) {
      console.log(JSON.stringify({
        decision: 'force_ask',
        reason: `[Anvil Safety Guard] Intercepted high-risk command (${label}): "${cmd.trim()}". Explicit confirmation required.`
      }));
      return;
    }
  }

  console.log(JSON.stringify({ decision: 'allow' }));
}

main().catch(() => {
  console.log(JSON.stringify({ decision: 'allow' }));
});
