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

export function getThemeConfig(): ThemeConfig {
  const config = runtimeConfig.themeConfig;
  
  if (!config) {
    // Fallback to default configuration if not present
    return {
      defaultTheme: 'light',
      enableThemeSwitcher: true,
      themes: [
        { id: 'light', name: 'Light', description: 'Clean light theme' },
        { id: 'dark', name: 'Dark', description: 'Dark mode theme' },
      ],
    };
  }
  
  return config as ThemeConfig;
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
