import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { getDefaultTheme, getAvailableThemes } from '@/lib/theme-config';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const defaultTheme = getDefaultTheme();
  const availableThemes = getAvailableThemes();
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
