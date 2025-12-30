import runtimeConfig from '../../runtime.config.json';

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
}

export interface ThemeConfig {
  defaultTheme: string;
  enableThemeSwitcher: boolean;
  themes: ThemeOption[];
}

function isValidThemeConfig(config: any): config is ThemeConfig {
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  if (typeof config.defaultTheme !== 'string' || !config.defaultTheme) {
    return false;
  }
  
  if (typeof config.enableThemeSwitcher !== 'boolean') {
    return false;
  }
  
  if (!Array.isArray(config.themes)) {
    return false;
  }
  
  return config.themes.every((theme: any) => 
    theme &&
    typeof theme === 'object' &&
    typeof theme.id === 'string' &&
    typeof theme.name === 'string' &&
    typeof theme.description === 'string'
  );
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
        { id: 'light', name: 'Light', description: 'Clean light theme' },
        { id: 'dark', name: 'Dark', description: 'Dark mode theme' },
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
  return getThemeConfig().themes;
}
