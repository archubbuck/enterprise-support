import type { CapacitorConfig } from '@capacitor/cli';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

const mode = process.env.NODE_ENV || 'development';

loadEnv({ path: resolve(process.cwd(), '.env.example'), quiet: true });
loadEnv({ path: resolve(process.cwd(), '.env'), quiet: true });
loadEnv({ path: resolve(process.cwd(), '.env.local'), override: true, quiet: true });
loadEnv({ path: resolve(process.cwd(), `.env.${mode}`), override: true, quiet: true });
loadEnv({ path: resolve(process.cwd(), `.env.${mode}.local`), override: true, quiet: true });

function requireEnvValue(value: string | undefined, key: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable in capacitor.config.ts: ${key}`);
  }

  return value;
}

const isDev = process.env.NODE_ENV === 'development' || false;

const config: CapacitorConfig = {
  appId: requireEnvValue(process.env.APP_CONFIG_APP_ID, 'APP_CONFIG_APP_ID'),
  appName: requireEnvValue(process.env.APP_CONFIG_APP_NAME, 'APP_CONFIG_APP_NAME'),
  webDir: 'dist',
  server: {
    // Allow clear text traffic for local development only
    cleartext: isDev,
  },
  ios: {
    // iOS-specific configurations
    contentInset: 'always',
    // Use WKWebView's native scrolling
    scrollEnabled: true,
    // Allow inline playback
    allowsInlineMediaPlayback: true,
  },
  plugins: {
    // Configure SplashScreen if needed
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
  },
};

export default config;
