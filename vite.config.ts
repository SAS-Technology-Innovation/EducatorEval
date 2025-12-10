import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // IMPORTANT: Load ONLY from .env files, ignore process.env to prevent shell variable override
  const envFile = `.env.${mode}`;
  const envPath = path.resolve(process.cwd(), envFile);

  // Load environment variables from the mode-specific file
  let env: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    env = dotenv.parse(fs.readFileSync(envPath));
    console.log(`\n🔍 Vite Environment Check - Loading from ${envFile}:`);
  } else {
    console.log(`\n⚠️  Warning: ${envFile} not found, falling back to loadEnv`);
    env = loadEnv(mode, process.cwd(), '');
  }

  console.log('Mode:', mode);
  console.log('VITE_FIREBASE_API_KEY:', env.VITE_FIREBASE_API_KEY || '(not set)');
  console.log('VITE_FIREBASE_PROJECT_ID:', env.VITE_FIREBASE_PROJECT_ID || '(not set)');
  console.log('VITE_ENVIRONMENT:', env.VITE_ENVIRONMENT || '(not set)');
  console.log('');

  // Set the loaded env vars back into process.env so Vite can use them
  Object.keys(env).forEach(key => {
    if (key.startsWith('VITE_')) {
      process.env[key] = env[key];
    }
  });

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './app'),
      },
    },
    server: {
      port: 4321,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };
});
