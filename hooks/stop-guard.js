#!/usr/bin/env node

/**
 * Anvil Stop Guard (Stop Hook)
 * Prevents premature agent loop termination if an active feature in .anvil/features/
 * still contains unverified tasks marked with `[ ]`.
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
  
  // If terminated due to error or max steps, let it stop
  if (payload.terminationReason && payload.terminationReason !== 'model_stop') {
    console.log(JSON.stringify({ decision: 'allow' }));
    return;
  }

  const workspacePaths = payload.workspacePaths || [];
  const root = workspacePaths[0] || process.cwd();
  const featuresDir = path.join(root, '.anvil', 'features');

  if (!fs.existsSync(featuresDir)) {
    console.log(JSON.stringify({ decision: 'allow' }));
    return;
  }

  try {
    const features = fs.readdirSync(featuresDir).filter(f => !f.startsWith('.'));
    for (const feature of features) {
      const activeMarker = path.join(featuresDir, feature, '.active');
      const tasksDir = path.join(featuresDir, feature, 'tasks');
      
      // If feature is explicitly marked active and has tasks
      if (fs.existsSync(activeMarker) && fs.existsSync(tasksDir)) {
        const taskFiles = fs.readdirSync(tasksDir).filter(f => f.endsWith('.md'));
        for (const taskFile of taskFiles) {
          const content = fs.readFileSync(path.join(tasksDir, taskFile), 'utf8');
          if (content.includes('- [ ]')) {
            console.log(JSON.stringify({
              decision: 'continue',
              reason: `[Anvil Stop-Guard] Active feature '${feature}' still has incomplete tasks in tasks/${taskFile}. Please finish or document status before exiting.`
            }));
            return;
          }
        }
      }
    }
  } catch (e) {
    // Ignore errors
  }

  console.log(JSON.stringify({ decision: 'allow' }));
}

main().catch(() => {
  console.log(JSON.stringify({ decision: 'allow' }));
});
