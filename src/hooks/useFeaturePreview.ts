import { useFeatureFlag } from './useAppConfig';
import type { FeatureConfig } from '../types/app-config';

/**
 * Hook to check if a feature preview is enabled
 * 
 * @deprecated Use useFeatureFlag from useAppConfig instead
 * @param featureName - Name of the feature to check
 * @returns Whether the feature is enabled
 */
export function useFeaturePreview(featureName: keyof FeatureConfig): boolean {
  return useFeatureFlag(featureName);
}
