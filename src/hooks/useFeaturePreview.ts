import { useState, useEffect } from 'react';

interface RuntimeConfig {
  app: string;
  featurePreviews?: {
    tagFiltering?: boolean;
  };
}

let cachedConfig: RuntimeConfig | null = null;

export function useFeaturePreview(featureName: 'tagFiltering'): boolean {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      if (cachedConfig) {
        setIsEnabled(cachedConfig.featurePreviews?.[featureName] || false);
        return;
      }

      try {
        const response = await fetch('/runtime.config.json');
        if (response.ok) {
          const config: RuntimeConfig = await response.json();
          cachedConfig = config;
          setIsEnabled(config.featurePreviews?.[featureName] || false);
        }
      } catch (error) {
        console.error('Failed to load runtime config:', error);
        setIsEnabled(false);
      }
    };

    loadConfig();
  }, [featureName]);

  return isEnabled;
}
