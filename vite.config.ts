import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path';

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '');
  const appName = env.APP_CONFIG_APP_NAME?.trim() || 'Enterprise Support';

  return {
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
          `<title>${escapeHtml(appName)}</title>`
        );
      },
    } as PluginOption,
  ],
  envPrefix: ['VITE_', 'APP_CONFIG_'],
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
};
});
