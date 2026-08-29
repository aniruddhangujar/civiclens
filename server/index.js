/**
 * CivicLens Production Node.js Server
 * Serves static build files from dist/ and handles POST /api/analyze-image
 * Zero external server dependencies — uses Node.js standard libraries.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAnalyzeImage } from './analyzeHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

// Simple .env parser for standalone Node server execution
function loadLocalEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    } catch (e) {
      console.warn('[Server] Note: Could not read .env file, using process.env');
    }
  }
}

loadLocalEnv();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Server configuration from environment
function getServerConfig() {
  return {
    provider: process.env.AI_PROVIDER || 'auto',
    openRouterKey: process.env.OPENROUTER_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
    openRouterModel: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  };
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 1. Image Analysis API Route
  if (req.url === '/api/analyze-image') {
    await handleAnalyzeImage(req, res, getServerConfig());
    return;
  }

  // 2. Health check route
  if (req.url === '/api/health') {
    const config = getServerConfig();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'CivicLens Production Server',
      provider: config.provider,
      hasOpenRouterKey: Boolean(config.openRouterKey && config.openRouterKey !== 'YOUR_OPENROUTER_API_KEY'),
      hasGeminiKey: Boolean(config.geminiKey && config.geminiKey !== 'YOUR_GEMINI_API_KEY')
    }));
    return;
  }

  // 3. Static File Serving with SPA fallback
  if (req.method === 'GET') {
    let reqPath = req.url.split('?')[0];
    let filePath = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('CivicLens: 404 Not Found. Run npm run build first.');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(content);
      });
    });
    return;
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, HOST, () => {
  const config = getServerConfig();
  console.log(`\n🚀 [CivicLens Production Server] running at http://${HOST}:${PORT}`);
  console.log(`• Static directory: ${DIST_DIR}`);
  console.log(`• AI Endpoint: POST http://${HOST}:${PORT}/api/analyze-image`);
  console.log(`• AI Provider: ${config.provider}`);
});
