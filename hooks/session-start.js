#!/usr/bin/env node

/**
 * Anvil Session Start Hook (PreInvocation)
 * Fires before the model is invoked. On turn 1, checks environment state,
 * presence of .anvil/ directory, and injects session orientation context.
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

async function main() {
  const payload = await readStdin();
  const invocationNum = payload.invocationNum || 1;

  // Only run greeting / status check on the first invocation
  if (invocationNum > 1) {
    console.log(JSON.stringify({}));
    return;
  }

  const workspacePaths = payload.workspacePaths || [];
  const root = workspacePaths[0] || process.cwd();
  const anvilDir = path.join(root, '.anvil');

  const messages = [];

  if (!fs.existsSync(anvilDir)) {
    messages.push("Anvil active: No '.anvil/' folder detected in workspace. Recommend using the '/init' skill if user requests feature planning or project setup.");
  } else {
    // Check if there are active features
    const featuresDir = path.join(anvilDir, 'features');
    if (fs.existsSync(featuresDir)) {
      try {
        const features = fs.readdirSync(featuresDir).filter(f => !f.startsWith('.'));
        if (features.length > 0) {
          messages.push(`Anvil active: Found ${features.length} existing feature(s) in .anvil/features/: ${features.join(', ')}.`);
        }
      } catch (e) {
        // Ignore read errors
      }
    }
  }

  if (messages.length > 0) {
    console.log(JSON.stringify({
      injectSteps: [
        {
          ephemeralMessage: messages.join('\n')
        }
      ]
    }));
  } else {
    console.log(JSON.stringify({}));
  }
}

main().catch(() => {
  console.log(JSON.stringify({}));
});
