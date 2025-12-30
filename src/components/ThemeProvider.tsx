import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { getDefaultTheme } from '@/lib/theme-config';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const defaultTheme = getDefaultTheme();
  
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={true}
      storageKey="enterprise-support-theme"
      themes={['light', 'dark', 'blue', 'green', 'purple']}
    >
      {children}
    </NextThemesProvider>
  );
}
