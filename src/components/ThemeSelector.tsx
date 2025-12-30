import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Palette, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getAvailableThemes, isThemeSwitcherEnabled } from '@/lib/theme-config';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const availableThemes = getAvailableThemes();
  const themeSwitcherEnabled = isThemeSwitcherEnabled();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !themeSwitcherEnabled) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Select theme"
        >
          <Palette className="h-5 w-5" weight="fill" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-1">
          <div className="px-2 py-1.5">
            <h4 className="text-sm font-semibold text-foreground">Theme</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose your preferred color theme
            </p>
          </div>
          <div className="space-y-1">
            {availableThemes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id)}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-md text-sm transition-colors ${
                  theme === themeOption.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{themeOption.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {themeOption.description}
                  </span>
                </div>
                {theme === themeOption.id && (
                  <Check className="h-4 w-4 ml-2 shrink-0" weight="bold" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
