import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleAnalyzeImage } from './server/analyzeHandler.js';

export default defineConfig(({ mode }) => {
  // Load server-side environment variables without exposing to client bundle
  const env = loadEnv(mode, process.cwd(), '');
  const serverConfig = {
    provider: env.AI_PROVIDER || process.env.AI_PROVIDER || 'auto',
    openRouterKey: env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '',
    geminiKey: env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
    openRouterModel: env.OPENROUTER_MODEL || process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
    geminiModel: env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  };

  return {
    plugins: [
      react(),
      {
        name: 'civiclens-api-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/analyze-image') {
              await handleAnalyzeImage(req, res, serverConfig);
            } else {
              next();
            }
          });
        }
      }
    ],
    server: {
      port: 5173,
      host: true
    },
    build: {
      // Firebase is intentionally isolated in its own cached vendor chunk (~556 kB minified).
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            firebase: ['firebase/app', 'firebase/firestore'],
            react: ['react', 'react-dom', 'react-dom/client'],
            effects: ['canvas-confetti']
          }
        }
      }
    }
  };
});
