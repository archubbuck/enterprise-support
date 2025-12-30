import runtimeConfig from '../../runtime.config.json';

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  enabled?: boolean;
}

export interface ThemeConfig {
  defaultTheme: string;
  enableThemeSwitcher: boolean;
  themes: ThemeOption[];
}

function isValidThemeConfig(config: unknown): config is ThemeConfig {
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  const cfg = config as Record<string, unknown>;
  
  if (typeof cfg.defaultTheme !== 'string' || !cfg.defaultTheme) {
    return false;
  }
  
  if (typeof cfg.enableThemeSwitcher !== 'boolean') {
    return false;
  }
  
  if (!Array.isArray(cfg.themes)) {
    return false;
  }
  
  return cfg.themes.every((theme: unknown) => {
    if (!theme || typeof theme !== 'object') {
      return false;
    }
    const t = theme as Record<string, unknown>;
    return (
      typeof t.id === 'string' &&
      typeof t.name === 'string' &&
      typeof t.description === 'string' &&
      (t.enabled === undefined || typeof t.enabled === 'boolean')
    );
  });
}

export function getThemeConfig(): ThemeConfig {
  const config = runtimeConfig.themeConfig;
  
  if (!config || !isValidThemeConfig(config)) {
    // Fallback to default configuration if not present or invalid
    console.warn('Invalid or missing theme configuration, using defaults');
    return {
      defaultTheme: 'light',
      enableThemeSwitcher: true,
      themes: [
        { id: 'light', name: 'Light', description: 'Clean light theme', enabled: true },
        { id: 'dark', name: 'Dark', description: 'Dark mode theme', enabled: true },
      ],
    };
  }
  
  return config;
}

export function getDefaultTheme(): string {
  return getThemeConfig().defaultTheme;
}

export function isThemeSwitcherEnabled(): boolean {
  return getThemeConfig().enableThemeSwitcher;
}

export function getAvailableThemes(): ThemeOption[] {
  const config = getThemeConfig();
  // Filter to only return enabled themes (enabled is true or undefined for backward compatibility)
  return config.themes.filter(theme => theme.enabled !== false);
}
