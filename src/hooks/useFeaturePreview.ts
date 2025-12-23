import { useState, useEffect } from 'react';

interface RuntimeConfig {
  app: string;
  featurePreviews?: {
    [key: string]: boolean;
  };
}

export function useFeaturePreview(featureName: string): boolean {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadConfig = async () => {
      try {
        const response = await fetch('/runtime.config.json');
        if (!response.ok) {
          if (isMounted) {
            setIsEnabled(false);
          }
          return;
        }

        const config: RuntimeConfig = await response.json();

        if (isMounted) {
          setIsEnabled(config.featurePreviews?.[featureName] ?? false);
        }
      } catch (error) {
        console.error('Failed to load runtime config:', error);
        if (isMounted) {
          setIsEnabled(false);
        }
      }
    };

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [featureName]);

  return isEnabled;
}
