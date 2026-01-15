import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { useThemeConfig } from '@/hooks/useCompanyConfig';
import { getDefaultTheme, getAvailableThemes, DEFAULT_THEME_CONFIG } from '@/lib/theme-config';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeConfig = useThemeConfig();
  
  // Use config or defaults while loading
  const defaultTheme = getDefaultTheme(themeConfig);
  const availableThemes = getAvailableThemes(themeConfig ?? DEFAULT_THEME_CONFIG);
  const themeIds = availableThemes.map(theme => theme.id);
  
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={true}
      storageKey="enterprise-support-theme"
      themes={themeIds}
    >
      {children}
    </NextThemesProvider>
  );
}
