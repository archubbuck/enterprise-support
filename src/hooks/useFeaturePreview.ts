import { useFeatureFlag } from './useCompanyConfig';
import type { FeatureConfig } from '../types/company-config';

/**
 * Hook to check if a feature preview is enabled
 * 
 * @deprecated Use useFeatureFlag from useCompanyConfig instead
 * @param featureName - Name of the feature to check
 * @returns Whether the feature is enabled
 */
export function useFeaturePreview(featureName: keyof FeatureConfig): boolean {
  return useFeatureFlag(featureName);
}
