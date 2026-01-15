/**
 * Type definitions for app configuration
 * 
 * These types provide compile-time type safety when working with the app.config.json file.
 * They ensure that all required fields are present and properly typed.
 */

/**
 * Feature flags configuration
 * Controls which application features are enabled or disabled
 */
export interface FeatureConfig {
  /**
   * Enable tag-based filtering in document lists
   */
  tagFiltering: boolean;
  
  /**
   * Enable PDF document viewing
   */
  pdfDocuments: boolean;
  
  /**
   * Enable Word document (.docx) viewing
   */
  wordDocuments: boolean;
  
  /**
   * Enable image document viewing
   */
  imageDocuments: boolean;
}

/**
 * Theme definition for UI customization
 */
export interface Theme {
  /**
   * Unique theme identifier used in CSS class names and storage
   * @example "light"
   * @example "dark"
   * @example "corporate-blue"
   */
  id: string;
  
  /**
   * Human-readable theme name shown in the theme selector
   * @example "Light"
   * @example "Dark Mode"
   */
  name: string;
  
  /**
   * Optional description of the theme
   */
  description?: string;
  
  /**
   * Whether this theme is available for selection
   */
  enabled: boolean;
}

/**
 * Theme configuration for application appearance
 */
export interface ThemeConfig {
  /**
   * Default theme ID applied on first load
   * Must match one of the theme IDs in the themes array
   */
  defaultTheme: string;
  
  /**
   * Show theme selector in the UI
   * Set to false to lock users to the default theme
   */
  enableThemeSwitcher: boolean;
  
  /**
   * Available themes for the application
   */
  themes: Theme[];
}

/**
 * Document configuration entry
 * Specifies a document collection and its location
 */
export interface DocumentConfig {
  /**
   * Friendly name describing the document collection
   * @example "IT Support Documents"
   * @example "Employee Resources"
   */
  name: string;
  
  /**
   * Path to the document manifest.json file, relative to the workspace root
   * @example "public/documents/manifest.json"
   * @example "docs/support/manifest.json"
   */
  path: string;
  
  /**
   * Optional numeric position for ordering documents
   * Lower numbers appear first. Documents without a position value
   * are placed after positioned documents in their natural order.
   * @example 0
   * @example 10
   */
  position?: number;
}

/**
 * Regional office contact information
 */
export interface RegionalContact {
  /**
   * Geographic region name (e.g., Americas, EMEA, Asia Pacific)
   */
  region: string;
  
  /**
   * City and state/country for this office
   * Add '(HQ)' suffix for headquarters location
   * @example "New York, NY (HQ)"
   * @example "London, UK"
   */
  city: string;
  
  /**
   * Phone number with country code in international format
   * @example "+1 (555) 123-4567"
   * @example "+44 20 7946 0958"
   */
  phone: string;
  
  /**
   * Business hours with timezone
   * @example "8:00 AM - 6:00 PM EST"
   * @example "9:00 AM - 5:00 PM GMT"
   * @example "24/7"
   */
  hours: string;
}

/**
 * Contact information for IT support and emergency services
 */
export interface ContactInfo {
  /**
   * Primary IT helpdesk email address
   * This is the main contact point for support requests
   * @example "ithelpdesk@acmecorp.com"
   */
  email: string;
  
  /**
   * Optional emergency or security team email for urgent issues
   * Used for security incidents and critical problems
   * @example "security@acmecorp.com"
   */
  emergencyEmail?: string;
  
  /**
   * Array of regional office contact information
   * Add as many regions as your organization has offices
   * Leave empty if you have only one location
   */
  regions?: RegionalContact[];
}

/**
 * App configuration for the Enterprise Support application
 * 
 * This configuration controls all app-specific settings including
 * branding, contact information, and regional office details.
 */
export interface AppConfig {
  /**
   * Your company's official name
   * Used throughout the application and in document content
   * Keep it concise for better readability
   * @example "Acme Corporation"
   * @example "TechStart Inc"
   */
  companyName: string;
  
  /**
   * Full application name shown in the app header and iOS app
   * Typically includes your company name and 'Support' or similar
   * @example "Acme Support"
   * @example "TechStart Help Center"
   */
  appName: string;
  
  /**
   * iOS bundle identifier using reverse domain notation
   * 
   * CRITICAL: This identifier must be:
   * - Unique in the App Store
   * - Cannot be changed after App Store submission
   * - Must match your Apple Developer provisioning profile
   * - Use lowercase letters, numbers, hyphens, and dots only
   * 
   * @example "com.acmecorp.support"
   * @example "com.techstart.helpdesk"
   */
  appId: string;
  
  /**
   * Optional subtitle displayed in the app header
   * Provides context about the app's purpose
   * @example "IT Help & Documentation"
   * @example "Employee Support Portal"
   */
  appSubtitle?: string;
  
  /**
   * Your company's primary email domain (without @ symbol)
   * Used in documentation and email references
   * @example "acmecorp.com"
   * @example "techstart.io"
   */
  domain: string;
  
  /**
   * Optional VPN portal address
   * If provided, used in VPN setup documentation
   * Can be a full URL or hostname
   * @example "vpn.acmecorp.com"
   * @example "https://vpn.techstart.io"
   */
  vpnPortal?: string;
  
  /**
   * Contact information for IT support and emergency services
   * All email addresses should be monitored mailboxes
   */
  contacts: ContactInfo;
  
  /**
   * Schema version for enterprise stability and migration support
   * Semantic versioning format (major.minor)
   * @example "1.0"
   */
  $version: string;
  
  /**
   * Feature flags to enable or disable application features
   */
  features: FeatureConfig;
  
  /**
   * Theme configuration for application appearance
   */
  theme: ThemeConfig;
  
  /**
   * Available documents configuration
   * Each entry specifies a document collection and its location
   */
  documents: DocumentConfig[];
}

/**
 * Type guard to check if an object is a valid AppConfig
 * 
 * @param obj - Object to check
 * @returns true if the object is a valid AppConfig
 */
export function isAppConfig(obj: unknown): obj is AppConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  const config = obj as Partial<AppConfig>;
  
  // Check base required fields
  const hasBaseFields = (
    typeof config.$version === 'string' &&
    typeof config.companyName === 'string' &&
    typeof config.appName === 'string' &&
    typeof config.appId === 'string' &&
    typeof config.domain === 'string' &&
    typeof config.contacts === 'object' &&
    config.contacts !== null &&
    typeof config.contacts.email === 'string'
  );
  
  if (!hasBaseFields) return false;
  
  // Check features object
  const hasFeatures = (
    typeof config.features === 'object' &&
    config.features !== null &&
    typeof config.features.tagFiltering === 'boolean' &&
    typeof config.features.pdfDocuments === 'boolean' &&
    typeof config.features.wordDocuments === 'boolean' &&
    typeof config.features.imageDocuments === 'boolean'
  );
  
  if (!hasFeatures) return false;
  
  // Check theme object
  const hasTheme = (
    typeof config.theme === 'object' &&
    config.theme !== null &&
    typeof config.theme.defaultTheme === 'string' &&
    typeof config.theme.enableThemeSwitcher === 'boolean' &&
    Array.isArray(config.theme.themes) &&
    config.theme.themes.length > 0
  );
  
  if (!hasTheme) return false;
  
  // Check documents array
  const hasDocuments = (
    Array.isArray(config.documents) &&
    config.documents.length > 0
  );
  
  return hasDocuments;
}

/**
 * Validates the app configuration structure
 * Throws detailed error if validation fails
 * 
 * @param config - Configuration to validate
 * @throws Error if configuration is invalid
 */
export function validateAppConfig(config: unknown): asserts config is AppConfig {
  if (!isAppConfig(config)) {
    throw new Error('Invalid app configuration: Missing required fields ($version, companyName, appName, appId, domain, contacts, features, theme, documents)');
  }
  
  // Validate version format
  const versionPattern = /^[0-9]+\.[0-9]+$/;
  if (!versionPattern.test(config.$version)) {
    throw new Error(
      `Invalid $version format: "${config.$version}". Must be semantic versioning (e.g., 1.0)`
    );
  }
  
  // Validate appId format (reverse domain notation)
  const appIdPattern = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/;
  if (!appIdPattern.test(config.appId)) {
    throw new Error(
      `Invalid appId format: "${config.appId}". Must use reverse domain notation (e.g., com.company.app)`
    );
  }
  
  // Validate domain format
  const domainPattern = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/;
  if (!domainPattern.test(config.domain.toLowerCase())) {
    throw new Error(
      `Invalid domain format: "${config.domain}". Must be a valid domain name without @ symbol`
    );
  }
  
  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(config.contacts.email)) {
    throw new Error(`Invalid email format: "${config.contacts.email}"`);
  }
  
  if (config.contacts.emergencyEmail && !emailPattern.test(config.contacts.emergencyEmail)) {
    throw new Error(`Invalid emergency email format: "${config.contacts.emergencyEmail}"`);
  }
  
  // Validate regional contacts if present
  if (config.contacts.regions) {
    if (!Array.isArray(config.contacts.regions)) {
      throw new Error('contacts.regions must be an array');
    }
    
    config.contacts.regions.forEach((region, index) => {
      if (!region.region || !region.city || !region.phone || !region.hours) {
        throw new Error(
          `Invalid regional contact at index ${index}: Missing required fields (region, city, phone, hours)`
        );
      }
      
      if (typeof region.region !== 'string' || typeof region.city !== 'string' ||
          typeof region.phone !== 'string' || typeof region.hours !== 'string') {
        throw new Error(
          `Invalid regional contact at index ${index}: All fields must be strings`
        );
      }
    });
  }
  
  // Validate theme configuration
  const themeIdPattern = /^[a-z][a-z0-9-]*$/;
  config.theme.themes.forEach((theme, index) => {
    if (!theme.id || !theme.name || typeof theme.enabled !== 'boolean') {
      throw new Error(
        `Invalid theme at index ${index}: Missing required fields (id, name, enabled)`
      );
    }
    
    if (!themeIdPattern.test(theme.id)) {
      throw new Error(
        `Invalid theme id at index ${index}: "${theme.id}". Must be lowercase alphanumeric with hyphens`
      );
    }
  });
  
  // Validate defaultTheme references a valid theme
  const validThemeIds = config.theme.themes.map(t => t.id);
  if (!validThemeIds.includes(config.theme.defaultTheme)) {
    throw new Error(
      `Invalid defaultTheme: "${config.theme.defaultTheme}". Must match one of: ${validThemeIds.join(', ')}`
    );
  }
  
  // Ensure at least one theme is enabled
  const enabledThemes = config.theme.themes.filter(t => t.enabled);
  if (enabledThemes.length === 0) {
    throw new Error('At least one theme must be enabled');
  }
  
  // Validate documents array
  if (!Array.isArray(config.documents)) {
    throw new Error('documents must be an array');
  }
  
  if (config.documents.length === 0) {
    throw new Error('At least one document configuration must be provided');
  }
  
  config.documents.forEach((doc, index) => {
    if (!doc.name || !doc.path) {
      throw new Error(
        `Invalid document at index ${index}: Missing required fields (name, path)`
      );
    }
    
    if (typeof doc.name !== 'string' || typeof doc.path !== 'string') {
      throw new Error(
        `Invalid document at index ${index}: name and path must be strings`
      );
    }
    
    if (doc.position !== undefined && (typeof doc.position !== 'number' || !Number.isInteger(doc.position) || doc.position < 0)) {
      throw new Error(
        `Invalid document at index ${index}: position must be a non-negative integer`
      );
    }
  });
}
