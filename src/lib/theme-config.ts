import { ThemeConfig, Theme } from '../types/app-config';

/**
 * Re-export types for convenience
 */
export type { ThemeConfig, Theme };
export type ThemeOption = Theme;

/**
 * Default theme configuration used as fallback
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  defaultTheme: 'light',
  enableThemeSwitcher: true,
  themes: [
    { id: 'light', name: 'Light', description: 'Clean light theme', enabled: true },
    { id: 'dark', name: 'Dark', description: 'Dark mode theme', enabled: true },
  ],
};

/**
 * Gets the default theme ID from config
 * @param config - Theme configuration (uses fallback if null)
 */
export function getDefaultTheme(config: ThemeConfig | null): string {
  return config?.defaultTheme ?? DEFAULT_THEME_CONFIG.defaultTheme;
}

/**
 * Checks if theme switcher is enabled
 * @param config - Theme configuration (uses fallback if null)
 */
export function isThemeSwitcherEnabled(config: ThemeConfig | null): boolean {
  return config?.enableThemeSwitcher ?? DEFAULT_THEME_CONFIG.enableThemeSwitcher;
}

/**
 * Gets available (enabled) themes from config
 * @param config - Theme configuration (uses fallback if null)
 */
export function getAvailableThemes(config: ThemeConfig | null): Theme[] {
  const themes = config?.themes ?? DEFAULT_THEME_CONFIG.themes;
  // Filter to only return enabled themes (enabled is true or undefined for backward compatibility)
  return themes.filter(theme => theme.enabled !== false);
}
