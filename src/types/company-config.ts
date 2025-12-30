/**
 * Type definitions for company configuration
 * 
 * These types provide compile-time type safety when working with the company.config.json file.
 * They ensure that all required fields are present and properly typed.
 */

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
 * Company configuration for the Enterprise Support application
 * 
 * This configuration controls all company-specific settings including
 * branding, contact information, and regional office details.
 */
export interface CompanyConfig {
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
}

/**
 * Type guard to check if an object is a valid CompanyConfig
 * 
 * @param obj - Object to check
 * @returns true if the object is a valid CompanyConfig
 */
export function isCompanyConfig(obj: unknown): obj is CompanyConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  const config = obj as Partial<CompanyConfig>;
  
  return (
    typeof config.companyName === 'string' &&
    typeof config.appName === 'string' &&
    typeof config.appId === 'string' &&
    typeof config.domain === 'string' &&
    typeof config.contacts === 'object' &&
    config.contacts !== null &&
    typeof config.contacts.email === 'string'
  );
}

/**
 * Validates the company configuration structure
 * Throws detailed error if validation fails
 * 
 * @param config - Configuration to validate
 * @throws Error if configuration is invalid
 */
export function validateCompanyConfig(config: unknown): asserts config is CompanyConfig {
  if (!isCompanyConfig(config)) {
    throw new Error('Invalid company configuration: Missing required fields');
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
  if (!domainPattern.test(config.domain)) {
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
}
