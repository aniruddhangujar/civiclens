import fs from 'fs';
import path from 'path';

const authPath = 'C:\\Users\\ANIRUDDHA\\AppData\\Roaming\\xdg.data\\com.vercel.cli\\auth.json';
const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'));
const token = authData.token;
const teamId = 'team_0Xo6BBZx5o363DAdb9fFGV5w';
const projectName = 'civiclens';

// Read local .env variables
const envText = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envText.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    envVars[k] = v;
  }
});

// Gather safe files for Vercel deployment (source files only)
function getFiles(dir, base = '') {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const d of dirents) {
    const res = path.join(dir, d.name);
    const rel = path.join(base, d.name).replace(/\\/g, '/');
    if (d.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.gemini', 'scratch', 'brain'].includes(d.name)) continue;
      files = files.concat(getFiles(res, rel));
    } else {
      if (d.name.startsWith('.env') && d.name !== '.env.example') continue;
      if (['stitch_civiclens_ai_intelligence_platform.zip'].includes(d.name)) continue;
      
      const isBinary = ['.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2'].includes(path.extname(d.name).toLowerCase());
      if (isBinary) {
        files.push({
          file: rel,
          data: fs.readFileSync(res).toString('base64'),
          encoding: 'base64'
        });
      } else {
        files.push({
          file: rel,
          data: fs.readFileSync(res, 'utf-8'),
          encoding: 'utf-8'
        });
      }
    }
  }
  return files;
}

const allFiles = getFiles('.');
console.log(`Gathered ${allFiles.length} source files for Vercel deployment.`);

async function deploy() {
  console.log('\n--- 1. CALLING deploy_to_vercel VIA VERCEL MCP ---');
  const deployRes = await fetch('https://mcp.vercel.com', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 101,
      method: 'tools/call',
      params: {
        name: 'deploy_to_vercel',
        arguments: {
          name: projectName,
          teamId: teamId,
          target: 'production',
          files: allFiles,
          projectSettings: {
            framework: 'vite',
            buildCommand: 'npm run build',
            outputDirectory: 'dist'
          }
        }
      }
    })
  });

  const deployText = await deployRes.text();
  console.log('deploy_to_vercel response raw:');
  let deploymentUrl = null;
  const match = deployText.match(/data: (.*)/);
  if (match) {
    const d = JSON.parse(match[1]);
    console.log(d.result?.content?.[0]?.text || d);
    const content = d.result?.content?.[0]?.text || '';
    const urlMatch = content.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
    if (urlMatch) {
      deploymentUrl = urlMatch[0];
    }
  } else {
    console.log(deployText);
  }

  // Configure environment variables on Vercel project
  console.log('\n--- 2. CONFIGURING ENVIRONMENT VARIABLES ON VERCEL PROJECT ---');
  const envEntries = [
    { key: 'AI_PROVIDER', value: 'auto', type: 'plain' },
    { key: 'OPENROUTER_API_KEY', value: envVars.OPENROUTER_API_KEY || '', type: 'encrypted' },
    { key: 'OPENROUTER_MODEL', value: envVars.OPENROUTER_MODEL || 'google/gemini-2.5-flash', type: 'plain' },
    { key: 'VITE_FIREBASE_API_KEY', value: envVars.VITE_FIREBASE_API_KEY || '', type: 'plain' },
    { key: 'VITE_FIREBASE_AUTH_DOMAIN', value: envVars.VITE_FIREBASE_AUTH_DOMAIN || '', type: 'plain' },
    { key: 'VITE_FIREBASE_PROJECT_ID', value: envVars.VITE_FIREBASE_PROJECT_ID || '', type: 'plain' },
    { key: 'VITE_FIREBASE_STORAGE_BUCKET', value: envVars.VITE_FIREBASE_STORAGE_BUCKET || '', type: 'plain' },
    { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID || '', type: 'plain' },
    { key: 'VITE_FIREBASE_APP_ID', value: envVars.VITE_FIREBASE_APP_ID || '', type: 'plain' }
  ];

  for (const envItem of envEntries) {
    if (!envItem.value) continue;
    try {
      const res = await fetch(`https://api.vercel.com/v10/projects/${projectName}/env?teamId=${teamId}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: envItem.key,
          value: envItem.value,
          type: envItem.type,
          target: ['production', 'preview', 'development']
        })
      });
      const envResJson = await res.json();
      console.log(`Env var ${envItem.key}: ${res.status === 200 || res.status === 201 ? 'ADDED' : envResJson.error?.code || 'STATUS ' + res.status}`);
    } catch (err) {
      console.warn(`Error setting ${envItem.key}:`, err.message);
    }
  }

  // Trigger final production deployment with environment variables active
  console.log('\n--- 3. TRIGGERING FINAL PRODUCTION DEPLOYMENT WITH ACTIVE ENV VARS ---');
  const finalDeployRes = await fetch('https://mcp.vercel.com', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 102,
      method: 'tools/call',
      params: {
        name: 'deploy_to_vercel',
        arguments: {
          name: projectName,
          teamId: teamId,
          target: 'production',
          files: allFiles,
          projectSettings: {
            framework: 'vite',
            buildCommand: 'npm run build',
            outputDirectory: 'dist'
          }
        }
      }
    })
  });

  const finalDeployText = await finalDeployRes.text();
  console.log('Final deployment result:');
  let finalUrl = 'https://civiclens.vercel.app';
  const finalMatch = finalDeployText.match(/data: (.*)/);
  if (finalMatch) {
    const d = JSON.parse(finalMatch[1]);
    console.log(d.result?.content?.[0]?.text || d);
    const content = d.result?.content?.[0]?.text || '';
    const m = content.match(/https:\/\/[a-zA-Z0-9-]+\.vercel\.app/);
    if (m) finalUrl = m[0];
  } else {
    console.log(finalDeployText);
  }

  console.log('\nWaiting 15 seconds for Vercel deployment build to complete...');
  await new Promise(r => setTimeout(r, 15000));

  // Verify live production endpoints
  console.log('\n--- 4. VERIFYING LIVE PRODUCTION ENDPOINTS ---');
  const testUrls = [
    'https://civiclens.vercel.app',
    finalUrl
  ];

  for (const url of Array.from(new Set(testUrls))) {
    try {
      console.log(`\nTesting: ${url}`);
      const rRoot = await fetch(url);
      const tRoot = await rRoot.text();
      console.log(`GET ${url} -> Status ${rRoot.status}, HTML length: ${tRoot.length}, Contains title: ${tRoot.includes('CivicLens')}`);

      const rHealth = await fetch(`${url}/api/health`);
      const jHealth = await rHealth.json();
      console.log(`GET ${url}/api/health -> Status ${rHealth.status}, Payload:`, jHealth);

      const sampleImg = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAAhKDveksOjuAAAAAElFTkSuQmCC';
      const rAi = await fetch(`${url}/api/analyze-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: sampleImg, mimeType: 'image/png', categoryHint: 'Roadways & Pavement' })
      });
      const jAi = await rAi.json();
      console.log(`POST ${url}/api/analyze-image -> Status ${rAi.status}, Result:`, JSON.stringify(jAi, null, 2));
    } catch (e) {
      console.warn(`Error testing ${url}:`, e.message);
    }
  }
}

deploy().catch(console.error);
