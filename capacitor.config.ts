import type { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.NODE_ENV === 'development' || false;

const config: CapacitorConfig = {
  appId: 'com.barings.support',
  appName: 'Barings Support',
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
