/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, validateAppConfig } from '../types/app-config';

/**
 * Cache configuration constants
 */
const CONFIG_CACHE_KEY = 'enterprise-support-app-config-cache';
const CONFIG_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Cached configuration structure stored in localStorage
 */
interface CachedConfig {
  data: AppConfig;
  timestamp: number;
  version: string;
}

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

/**
 * Reads cached configuration from localStorage
 * Returns null if cache is missing, expired, or invalid
 */
function getCachedConfig(): AppConfig | null {
  try {
    const cached = localStorage.getItem(CONFIG_CACHE_KEY);
    if (!cached) return null;
    
    const parsed: CachedConfig = JSON.parse(cached);
    const isExpired = Date.now() - parsed.timestamp > CONFIG_CACHE_TTL;
    
    if (isExpired) {
      localStorage.removeItem(CONFIG_CACHE_KEY);
      return null;
    }
    
    // Validate cached config still matches current schema
    validateAppConfig(parsed.data);
    return parsed.data;
  } catch {
    // Invalid cache, remove it
    localStorage.removeItem(CONFIG_CACHE_KEY);
    return null;
  }
}

/**
 * Saves configuration to localStorage cache
 */
function setCachedConfig(config: AppConfig): void {
  try {
    const cached: CachedConfig = {
      data: config,
      timestamp: Date.now(),
      version: config.$version,
    };
    localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(cached));
  } catch {
    // localStorage may be full or disabled, fail silently
    console.warn('Failed to cache app configuration');
  }
}

/**
 * Fetches configuration from the server
 * Uses stale-while-revalidate pattern for offline resilience
 */
async function fetchConfig(): Promise<AppConfig> {
  const response = await fetch('/app.config.json');
  
  if (!response.ok) {
    throw new Error(`Failed to load configuration: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  validateAppConfig(data);
  return data;
}

/**
 * Props for AppConfigProvider component
 */
interface AppConfigProviderProps {
  children: ReactNode;
}

/**
 * Provider component that fetches and caches app configuration
 * Uses stale-while-revalidate pattern for offline resilience:
 * 1. Immediately returns cached config if available (stale)
 * 2. Fetches fresh config in background
 * 3. Updates cache and state when fresh config arrives
 * 4. Falls back to cache if network fails
 */
export function AppConfigProvider({ children }: AppConfigProviderProps) {
  const [state, setState] = useState<AppConfigState>(() => {
    // Try to get cached config immediately for faster initial render
    const cached = getCachedConfig();
    return {
      config: cached,
      loading: !cached, // Only show loading if no cache
      error: null,
    };
  });

  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      try {
        const freshConfig = await fetchConfig();
        
        if (!mounted) return;
        
        // Update cache with fresh data
        setCachedConfig(freshConfig);
        
        setState({
          config: freshConfig,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!mounted) return;
        
        const error = err instanceof Error ? err : new Error('Failed to load configuration');
        
        // If we have cached config, use it despite the error
        const cached = getCachedConfig();
        if (cached) {
          setState({
            config: cached,
            loading: false,
            error: null, // Don't show error if we have valid cache
          });
        } else {
          setState({
            config: null,
            loading: false,
            error,
          });
        }
      }
    }

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

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
 * Returns false while config is loading or if feature is not enabled
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

/**
 * Hook to access theme configuration
 * Returns null while config is loading
 * 
 * @returns Theme configuration or null if loading
 */
export function useThemeConfig(): AppConfig['theme'] | null {
  const { config } = useAppConfig();
  return config?.theme ?? null;
}
