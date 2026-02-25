/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';
import { AppConfig, validateAppConfig } from '../types/app-config';

/**
 * App config context state
 */
interface AppConfigState {
  config: AppConfig | null;
  loading: boolean;
  error: Error | null;
}

/**
 * React context for app configuration
 */
const AppConfigContext = createContext<AppConfigState | null>(null);

function parseBooleanEnv(value: string | undefined, key: string): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid ${key}: expected "true" or "false"`);
}

function parseRegionsEnv(value: string | undefined): AppConfig['contacts']['regions'] {
  if (!value || value.trim() === '') {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    throw new Error(
      `Invalid APP_CONFIG_CONTACTS_REGIONS_JSON: ${(error as Error).message}`
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid APP_CONFIG_CONTACTS_REGIONS_JSON: expected a JSON array');
  }

  return parsed as AppConfig['contacts']['regions'];
}

function requireEnvValue(value: string | undefined, key: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getAppConfigFromEnv(): AppConfig {
  const config: AppConfig = {
    $version: requireEnvValue(import.meta.env.APP_CONFIG_VERSION, 'APP_CONFIG_VERSION'),
    companyName: requireEnvValue(import.meta.env.APP_CONFIG_COMPANY_NAME, 'APP_CONFIG_COMPANY_NAME'),
    appName: requireEnvValue(import.meta.env.APP_CONFIG_APP_NAME, 'APP_CONFIG_APP_NAME'),
    appId: requireEnvValue(import.meta.env.APP_CONFIG_APP_ID, 'APP_CONFIG_APP_ID'),
    domain: requireEnvValue(import.meta.env.APP_CONFIG_DOMAIN, 'APP_CONFIG_DOMAIN'),
    contacts: {
      email: requireEnvValue(import.meta.env.APP_CONFIG_CONTACTS_EMAIL, 'APP_CONFIG_CONTACTS_EMAIL'),
      regions: parseRegionsEnv(import.meta.env.APP_CONFIG_CONTACTS_REGIONS_JSON),
    },
    features: {
      tagFiltering: parseBooleanEnv(import.meta.env.APP_CONFIG_FEATURES_TAG_FILTERING, 'APP_CONFIG_FEATURES_TAG_FILTERING'),
      pdfDocuments: parseBooleanEnv(import.meta.env.APP_CONFIG_FEATURES_PDF_DOCUMENTS, 'APP_CONFIG_FEATURES_PDF_DOCUMENTS'),
      wordDocuments: parseBooleanEnv(import.meta.env.APP_CONFIG_FEATURES_WORD_DOCUMENTS, 'APP_CONFIG_FEATURES_WORD_DOCUMENTS'),
      imageDocuments: parseBooleanEnv(import.meta.env.APP_CONFIG_FEATURES_IMAGE_DOCUMENTS, 'APP_CONFIG_FEATURES_IMAGE_DOCUMENTS'),
    },
  };

  const appSubtitle = import.meta.env.APP_CONFIG_APP_SUBTITLE;
  if (appSubtitle && appSubtitle.trim() !== '') {
    config.appSubtitle = appSubtitle;
  }

  const vpnPortal = import.meta.env.APP_CONFIG_VPN_PORTAL;
  if (vpnPortal && vpnPortal.trim() !== '') {
    config.vpnPortal = vpnPortal;
  }

  const emergencyEmail = import.meta.env.APP_CONFIG_CONTACTS_EMERGENCY_EMAIL;
  if (emergencyEmail && emergencyEmail.trim() !== '') {
    config.contacts.emergencyEmail = emergencyEmail;
  }

  validateAppConfig(config);
  return config;
}

/**
 * Props for AppConfigProvider component
 */
interface AppConfigProviderProps {
  children: ReactNode;
}

/**
 * Provider component that loads and validates app configuration
 * Loads configuration from APP_CONFIG_* environment variables
 * and validates it at startup.
 */
export function AppConfigProvider({ children }: AppConfigProviderProps) {
  const [state] = useState<AppConfigState>(() => {
    try {
      return {
        config: getAppConfigFromEnv(),
        loading: false,
        error: null,
      };
    } catch (error) {
      return {
        config: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to load configuration from environment variables'),
      };
    }
  });

  return (
    <AppConfigContext.Provider value={state}>
      {children}
    </AppConfigContext.Provider>
  );
}

/**
 * Hook to access app configuration from context
 * Must be used within a AppConfigProvider
 * 
 * @returns App config state with config, loading, and error
 * @throws Error if used outside of AppConfigProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { config, loading, error } = useAppConfig();
 *   
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!config) return null;
 *   
 *   return <div>{config.companyName}</div>;
 * }
 * ```
 */
export function useAppConfig(): AppConfigState {
  const context = useContext(AppConfigContext);
  
  if (context === null) {
    throw new Error('useAppConfig must be used within a AppConfigProvider');
  }
  
  return context;
}

/**
 * Hook to access a specific feature flag
 * Returns false if feature is not enabled
 * 
 * @param feature - Name of the feature flag to check
 * @returns Whether the feature is enabled
 * 
 * @example
 * ```tsx
 * function DocumentList() {
 *   const isPdfEnabled = useFeatureFlag('pdfDocuments');
 *   
 *   if (!isPdfEnabled) {
 *     return <p>PDF documents are disabled</p>;
 *   }
 *   
 *   return <PdfList />;
 * }
 * ```
 */
export function useFeatureFlag(feature: keyof AppConfig['features']): boolean {
  const { config } = useAppConfig();
  return config?.features[feature] ?? false;
}


