import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path';
import { readFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

// Load company config for HTML transformation with error handling
let companyConfig: { appName: string };
try {
  const configPath = resolve(projectRoot, 'company.config.json');
  companyConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
  if (!companyConfig.appName) {
    throw new Error('company.config.json must contain an "appName" field');
  }
} catch (error) {
  console.error('Error loading company.config.json:', error);
  throw new Error(
    'Failed to load company.config.json. Please ensure the file exists and contains valid JSON with an "appName" field.'
  );
}

// HTML escape function to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>.*?<\/title>/,
          `<title>${escapeHtml(companyConfig.appName)}</title>`
        );
      },
    } as PluginOption,
    {
      name: 'copy-runtime-config',
      closeBundle() {
        try {
          const srcPath = resolve(projectRoot, 'runtime.config.json');
          const destDir = resolve(projectRoot, 'dist');
          const destPath = resolve(destDir, 'runtime.config.json');
          if (existsSync(srcPath)) {
            if (!existsSync(destDir)) {
              mkdirSync(destDir, { recursive: true });
            }
            copyFileSync(srcPath, destPath);
          }
        } catch (error) {
          console.warn('Warning: Failed to copy runtime.config.json during closeBundle:', error);
        }
      },
    } as PluginOption,
  ],
  // Use Lightning CSS transformer for better CSS optimization and error recovery
  // errorRecovery allows the build to continue even if there are non-critical CSS parsing issues
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      errorRecovery: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
