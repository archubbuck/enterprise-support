# **Enterprise Architecture Definition: Enterprise Support Application**

**Status:** Approved

**Version:** 1.0.0

**Date:** January 28, 2026

**Architect:** Senior Architect

## **Executive Summary**

This document defines the architectural standards for **"Enterprise Support"**, a mobile-first support document hub designed for **Enterprise Organizations**, **IT Departments**, and **Corporate Helpdesks**.

The platform serves as a **Documentation Distribution System** where employees can access curated IT support documents, troubleshooting guides, and contact information in a controlled, offline-capable environment. Organizations deploy a **Single React Application** packaged as both a Progressive Web App and native iOS application, allowing IT teams to configure specific content (documents, contacts, branding) without code changes.

# **Phase 1: Governance & Foundations**

## **ADR-001: Source Control Governance**

### **Context**

To maintain clean history, ensure code quality, and support continuous deployment in a single-repository environment, strict governance over git workflows is required.

### **Decision**

Adopt **Conventional Commits** for commit messages and **Feature Branch Workflow** for the branching strategy.

### **Specification**

- **Commit Message Format:** Must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
  - **Structure:** \<type\>(\<scope\>): \<description\>
  - **Example:** feat(documents): add PDF viewer support
  - **Tooling:** ESLint + TypeScript strict mode ensures code quality.
- **Branching Strategy:** **Feature Branch Workflow**.
  - **main:** The protected, always-deployable branch.
  - **Feature Branches:** Short-lived branches created from main (e.g., feat/add-theme-selector).
  - **Merge Strategy:** **Squash and Merge** via GitHub Pull Requests.
- **Automated Releases:**
  - Date-based versioning: `release/YYYY.MM.DD.BUILD`
  - Triggered automatically on push to main branch
  - Uses GitHub Actions to generate releases and changelogs

## **ADR-002: Configuration-Driven Architecture**

### **Context**

Enterprise customers require the ability to customize branding, content, contacts, and features without modifying source code or rebuilding the application.

### **Decision**

**JSON-Based Configuration with Runtime Loading** and **Feature Flags**.

### **Specification**

- **Configuration File:** `app.config.json` at the root of the deployment.
  - **Location:** Served as static asset alongside web application.
  - **Loading:** Fetched at application startup via HTTP request.
  - **Caching:** Stored in localStorage with 24-hour TTL.
  - **Stale-While-Revalidate:** Uses cached config immediately, fetches fresh copy in background.
- **Schema Validation:**
  - **JSON Schema:** `schemas/app.config.schema.json` defines structure and constraints.
  - **Runtime Validation:** Zod schema validates configuration at load time.
  - **TypeScript Types:** Generated types ensure compile-time safety.
- **Configurable Properties:**
  - **Branding:** Company name, app name, app subtitle, domain.
  - **Contacts:** Email addresses, regional support offices with phone numbers and hours.
  - **Features:** Document types (PDF, Word, images), tag filtering, theme switcher.
  - **Theme System:** Default theme, enabled themes, theme switcher visibility.
  - **Documents:** Manifest locations for loading support content.
- **Example Templates:**
  - `examples/app.config.startup.json` - Small business configuration
  - `examples/app.config.enterprise.json` - Large enterprise configuration
  - `examples/app.config.regional.json` - Multi-regional organization configuration

## **ADR-003: Local Development Strategy**

### **Context**

Developers require a fast, consistent development environment that supports hot module reloading and modern web tooling.

### **Decision**

Use **Vite Development Server** for local development with **Hot Module Replacement (HMR)**.

### **Specification**

- **Strategy:** Developers run the application locally using Vite's built-in dev server.
- **Development Server:** Runs on `http://localhost:5000`
- **Hot Module Replacement:** Code changes are reflected instantly without full page reloads.
- **Environment Setup:**
  ```bash
  # Install dependencies
  npm install
  
  # Start development server
  npm run dev
  ```
- **Configuration:**
  - `vite.config.ts` configures build settings, plugins, and path aliases.
  - `app.config.json` provides runtime configuration during development.
  - No external services required for local development.
- **Type Checking:** TypeScript runs in watch mode during development.
- **Linting:** ESLint provides real-time feedback on code quality.

## **ADR-004: Workspace & Frontend Architecture (Vite, React, Tailwind CSS)**

### **Context**

We require a high-performance, mobile-first interface with fast build times and modern development experience.

### **Decision**

We **must** utilize **Vite** as the build system, managing a **React 19** application with **Tailwind CSS v4**.

### **Specification**

- **Build System:** **Vite 7.3.1** is mandatory.
  - **Lightning Fast:** ESM-based dev server with instant HMR.
  - **Optimized Production:** Tree-shaking, code splitting, asset optimization.
  - **Plugin Ecosystem:** GitHub Spark integration, Tailwind CSS plugin.
- **Frontend Framework:** **React 19.2.3**
  - **Functional Components:** All components use modern React patterns.
  - **Hooks Architecture:** useState, useEffect, useContext, useMemo, custom hooks.
  - **Error Boundaries:** Global error handling with react-error-boundary.
  - **Lazy Loading:** React.lazy for code splitting (PDF viewer).
- **Styling System:** **Tailwind CSS 4.1.18**
  - **Utility-First CSS:** Rapid UI development with utility classes.
  - **PostCSS Processing:** Lightning CSS transformer for optimization.
  - **Custom Theme:** Extended color palette via CSS variables.
  - **Dark Mode:** Automatic dark mode support via next-themes.
- **UI Component Library:** **Radix UI**
  - **Accessible Primitives:** 30+ accessible, unstyled components.
  - **Composable:** Build custom components with guaranteed accessibility.
  - **Components Used:** Accordion, Dialog, Popover, Select, Tabs, Tooltip, ScrollArea.
- **Project Structure:**
  - `src/App.tsx` - Main application component (documents + contacts tabs)
  - `src/main.tsx` - Application entry point with providers
  - `src/components/` - React components (DocumentTile, DocumentViewer, ContactsView, ThemeSelector)
  - `src/components/ui/` - Reusable UI component library (Radix UI wrappers)
  - `src/lib/` - Utilities and data management (documents.ts, theme-config.ts, utils.ts)
  - `src/hooks/` - Custom React hooks (useAppConfig, useFeatureFlag, useMobile)
  - `src/types/` - TypeScript type definitions (app-config.ts)
  - `src/styles/` - Global CSS and theme variables

## **ADR-005: Testing Strategy & Quality Gates**

### **Context**

To maintain high velocity without regressions, we must enforce quality checks at multiple stages.

### **Decision**

**Validation-First Approach** with multiple validation layers.

### **Specification**

- **JSON Validation:**
  - **Scope:** All JSON files (app.config.json, manifest.json, package.json).
  - **Tool:** Custom validation script (`scripts/validate-json.cjs`).
  - **Gate:** Required for merge via CI workflow.
- **App Configuration Validation:**
  - **Scope:** app.config.json structure, types, and business rules.
  - **Tool:** Zod schema validation (`scripts/validate-app-config.cjs`).
  - **Checks:** Email format, domain format, appId format (reverse domain notation).
  - **Gate:** Required for merge via CI workflow.
- **App Icon Validation:**
  - **Scope:** Verifies app icon files exist and are properly configured.
  - **Tool:** Custom validation script (`scripts/verify-app-icon.cjs`).
  - **Gate:** Required for merge via CI workflow.
- **Metadata Validation:**
  - **Scope:** Document metadata structure and completeness.
  - **Tool:** Custom validation script (`scripts/validate-metadata.cjs`).
  - **Gate:** Required for merge via CI workflow.
- **Linting:**
  - **Tool:** ESLint 9 with React hooks plugin and TypeScript ESLint.
  - **Configuration:** `eslint.config.js` with strict rules.
  - **Gate:** Required for merge via CI workflow.
- **Type Checking:**
  - **Tool:** TypeScript 5.9.3 with strict mode enabled.
  - **Check:** Build process includes type checking (`tsc -b --noCheck`).
- **Build Verification:**
  - **Tool:** Vite production build.
  - **Check:** Application must build successfully in CI before merge.
- **Testing Pyramid:** Currently focused on validation and build verification. Unit and E2E tests can be added as the application grows.

## **ADR-006: Development Tooling**

### **Context**

Accelerating development with modern tooling and type safety.

### **Decision**

**TypeScript-First Development** with comprehensive tooling support.

### **Specification**

- **Language:** TypeScript 5.9.3 with strict mode.
- **Path Aliases:** `@/` maps to `src/` for clean imports.
- **IDE Support:**
  - VSCode recommended with TypeScript, ESLint, Tailwind CSS IntelliSense extensions.
  - JSON Schema validation in IDE for app.config.json.
  - TypeScript IntelliSense for all imports.
- **Code Quality:**
  - ESLint for JavaScript/TypeScript linting.
  - TypeScript for type checking.
  - Prettier formatting (recommended but not enforced).
- **Development Scripts:**
  - `npm run dev` - Start development server
  - `npm run build` - Production build
  - `npm run lint` - Run ESLint
  - `npm run check` - Run all validations (JSON, config, lint, metadata, icon)
  - `npm run validate:json` - Validate JSON files
  - `npm run validate:app-config` - Validate app configuration
  - `npm run validate:app-icon` - Verify app icon setup
  - `npm run validate:metadata` - Validate document metadata

# **Phase 2: Core Architecture**

## **ADR-007: Single Page Application (SPA) Architecture**

### **Context**

The application must be fast, work offline, and support both web and native platforms.

### **Decision**

Use **Single Page Application (SPA)** architecture with **Client-Side Routing**.

### **Specification**

- **Application Type:** Single Page Application (SPA).
- **Routing:** Client-side routing managed by React state (no router library).
- **Navigation:** Tab-based interface (Documents tab, Contacts tab).
- **State Management:**
  - **React Context API:** AppConfigContext for global configuration.
  - **React State:** Local component state with useState, useEffect hooks.
  - **Custom Hooks:** useAppConfig() for configuration access, useFeatureFlag() for feature flags.
- **Data Flow:**
  1. Application starts → AppConfigProvider fetches app.config.json
  2. Configuration validated → Cached in localStorage
  3. Documents loaded from manifest.json
  4. UI renders with configuration-driven content
  5. User interactions update local state
- **Performance Optimizations:**
  - Code splitting for PDF viewer (React.lazy)
  - Memoization with useMemo for filtered document lists
  - Virtualized scrolling for long lists (ScrollArea component)
- **Progressive Enhancement:**
  - Works without JavaScript for static content
  - Graceful degradation for unsupported features
  - Offline support via cached configuration and documents

## **ADR-008: Document Management & Content Architecture**

### **Context**

Organizations need to distribute various types of support documents (markdown, PDF, Word, images) with flexible organization and search capabilities.

### **Decision**

Use **Manifest-Based Document System** with **Multi-Format Support**.

### **Specification**

- **Document Storage:** Static files in `public/documents/` directory.
- **Manifest System:**
  - **File:** `manifest.json` defines available documents.
  - **Format:**
    ```json
    [
      {
        "id": "unique-id",
        "title": "Document Title",
        "category": "Category Name",
        "icon": "icon-identifier",
        "file": "filename.md",
        "tags": ["tag1", "tag2"],
        "type": "markdown",
        "position": 1
      }
    ]
    ```
- **Supported Document Types:**
  - **Markdown (.md):** Primary format for text-based guides.
  - **PDF (.pdf):** For formatted documents and official guides.
  - **Word (.docx):** For editable templates and forms.
  - **Images (.png, .jpg):** For visual guides and diagrams.
- **Document Loading Pipeline:**
  1. Fetch manifest.json from configured path in app.config.json
  2. Parse document definitions
  3. For markdown files: fetch content and parse with marked.js
  4. For binary files (PDF, Word, images): store file URL for viewer
  5. Apply placeholder replacement (company name, emails, etc.)
  6. Cache parsed content in memory
- **Placeholder System:**
  - `{companyName}` → Replaced with app.config.json companyName
  - `{emergencyEmail}` → Replaced with app.config.json emergencyEmail
  - `{vpnPortal}` → Replaced with app.config.json vpnPortal
  - `{domain}` → Replaced with app.config.json domain
  - Allows generic documents to be personalized at runtime
- **Search & Filtering:**
  - **Search:** Real-time search across document titles and categories.
  - **Tag Filtering:** Optional tag-based filtering (controlled by feature flag).
  - **Category Grouping:** Documents organized by category.
- **Feature Flags:**
  - `pdfDocuments` - Enable/disable PDF viewing
  - `wordDocuments` - Enable/disable Word document viewing
  - `imageDocuments` - Enable/disable image viewing
  - `tagFiltering` - Enable/disable tag filtering UI
- **Fallback Behavior:**
  - If manifest fetch fails, loads hardcoded sample documents
  - Ensures application always has content to display
  - Sample documents demonstrate document types and formatting

## **ADR-009: Theme System Architecture**

### **Context**

Organizations require branded experiences with multiple color themes and user-selectable preferences.

### **Decision**

**CSS Variable-Based Theme System** with **Runtime Theme Switching**.

### **Specification**

- **Theme Provider:** next-themes library manages theme state.
- **Theme Storage:** localStorage persists user's theme selection.
- **Theme Definition:**
  - Themes defined in app.config.json theme section.
  - Each theme has: id, name, description, enabled flag.
  - Default theme specified in configuration.
- **Built-in Themes:**
  - **light:** Clean light theme (default)
  - **dark:** Dark mode theme
  - **blue:** Ocean Blue - Professional blue theme
  - **green:** Forest Green - Natural green theme
  - **purple:** Royal Purple - Elegant purple theme
- **CSS Implementation:**
  - Base CSS variables defined in `src/styles/theme.css`
  - Theme-specific overrides in `:root[data-theme="theme-id"]` selectors
  - Tailwind CSS uses theme variables for consistent styling
- **Theme Configuration:**
  ```json
  {
    "theme": {
      "defaultTheme": "light",
      "enableThemeSwitcher": true,
      "themes": [
        {
          "id": "light",
          "name": "Light",
          "description": "Clean light theme",
          "enabled": true
        }
      ]
    }
  }
  ```
- **Theme Selector Component:**
  - Displays only enabled themes from configuration
  - Can be hidden via `enableThemeSwitcher: false`
  - Accessible dropdown menu with theme previews
  - Instant theme switching without page reload
- **Accessibility:**
  - Respects system preference if no theme selected
  - High contrast ratios for WCAG AA compliance
  - Focus indicators visible in all themes

## **ADR-010: Contact Directory Architecture**

### **Context**

Employees need quick access to regional IT support contacts with phone numbers and business hours.

### **Decision**

**Multi-Regional Contact System** with **Configuration-Driven Contact Lists**.

### **Specification**

- **Contact Storage:** Defined in app.config.json contacts section.
- **Structure:**
  ```json
  {
    "contacts": {
      "email": "ithelpdesk@example.com",
      "emergencyEmail": "security@example.com",
      "regions": [
        {
          "region": "Americas",
          "city": "Charlotte, NC (HQ)",
          "phone": "+1 (704) 805-7200",
          "hours": "7:00 AM - 7:00 PM EST"
        }
      ]
    }
  }
  ```
- **Display:**
  - Contacts grouped by region
  - Each contact shows: city, phone number, business hours
  - Click-to-call links for mobile devices
  - Primary and emergency email addresses displayed prominently
- **Regional Support:**
  - Supports multiple regions (Americas, EMEA, Asia Pacific, etc.)
  - Multiple cities per region
  - Region-specific phone numbers and hours
  - Timezone-aware hour display
- **Validation:**
  - Email addresses validated at runtime
  - Phone numbers support international formats
  - Required fields enforced by schema

# **Phase 3: Infrastructure Implementation**

## **ADR-011: Native iOS Application (Capacitor)**

### **Context**

Organizations require native iOS distribution through the App Store while maintaining a single codebase.

### **Decision**

Use **Capacitor 8** to wrap the React web application as a **Native iOS Application**.

### **Specification**

- **Technology:** Capacitor 8.0.0-8.0.1
- **Bridge:** WKWebView hosts the React application on iOS 12+
- **Configuration File:** `capacitor.config.ts`
  ```typescript
  {
    appId: 'com.enterprise.support',      // From app.config.json
    appName: 'Enterprise Support',        // From app.config.json
    webDir: 'dist',                       // Vite build output
    server: {
      cleartext: isDev                    // Allow localhost in dev
    },
    ios: {
      contentInset: 'always',             // Respect safe areas
      scrollEnabled: true,                // Native scrolling
      allowsInlineMediaPlayback: true     // Inline video
    }
  }
  ```
- **Build Pipeline:**
  ```bash
  npm run ios:build    # Build web app → sync to Xcode
  npm run ios:open     # Open Xcode IDE
  npm run ios:run      # Build + open Xcode
  ```
- **iOS Project:**
  - **Location:** `ios/App/App.xcworkspace`
  - **Structure:** Xcode workspace with WKWebView wrapper
  - **Assets:** App icon, splash screen, native resources
  - **Capabilities:** Network access, local storage, camera (optional)
- **Native Features:**
  - Offline support via localStorage and cached assets
  - Native navigation bar
  - iOS safe area support
  - Native scrolling performance
  - App lifecycle hooks
- **Development Workflow:**
  1. Develop in web browser with Vite dev server
  2. Build web application: `npm run build`
  3. Sync to iOS: `npx cap sync ios`
  4. Open Xcode: `npm run ios:open`
  5. Build and run on simulator or device from Xcode
- **Distribution:**
  - **TestFlight:** Beta testing distribution
  - **App Store:** Production distribution
  - **Enterprise Distribution:** Internal distribution (optional)

## **ADR-012: Build & Deployment Pipeline**

### **Context**

Automated build and deployment process ensures consistent, reliable releases to web and iOS platforms.

### **Decision**

**GitHub Actions-Based CI/CD** with **Automated Releases**.

### **Specification**

- **Source Control:** GitHub repository
- **CI/CD Platform:** GitHub Actions
- **Pipeline Files:**
  - `.github/workflows/ci.yml` - Continuous integration
  - `.github/workflows/release.yml` - Automated releases
  - `.github/workflows/deploy.yml` - App Store deployment
  - `.github/workflows/setup_match.yml` - Fastlane setup

### **CI Pipeline (ci.yml)**

**Triggers:** Pull requests and pushes to main branch

**Steps:**
1. Checkout code
2. Setup Node.js 22 with npm cache
3. Install dependencies (`npm ci`)
4. Validate JSON files
5. Validate metadata structure
6. Run ESLint
7. Build application

**Timeout:** 15 minutes

**Purpose:** Catch issues before merge, ensure code quality

### **Release Pipeline (release.yml)**

**Triggers:** Push to main branch

**Version Strategy:** Date-based semantic versioning
- Format: `release/YYYY.MM.DD.BUILD`
- Example: `release/2026.01.28.1`

**Steps:**
1. Checkout full git history
2. Setup Node.js 22
3. Build web application (`npm run build`)
4. Sync to iOS (`npx cap sync ios`)
5. Generate version tag with date/build number
6. Create GitHub release with auto-generated changelog
7. Upload build artifacts

**Features:**
- Automatic changelog generation from commits
- Artifact preservation for debugging
- Release notes from commit messages
- Tag-based version control

### **Deployment Pipeline (deploy.yml)**

**Triggers:** 
- Manual workflow dispatch
- Version tags matching `v*` pattern

**Purpose:** Deploy to App Store and web hosting

**Requirements:**
- Apple Developer account credentials
- Provisioning profiles and signing certificates
- App Store Connect API key

**Steps:**
1. Build production web application
2. Build iOS application in Xcode
3. Sign with distribution certificate
4. Upload to App Store Connect
5. Submit for TestFlight or App Store review

### **Build Artifacts:**
- **Web:** `dist/` directory with optimized static files
- **iOS:** Xcode archive (.xcarchive) and IPA file
- **Source Maps:** For debugging production issues
- **Asset Manifest:** For cache busting and CDN

## **ADR-013: Static Hosting & Distribution**

### **Context**

The web application requires fast, globally distributed hosting with HTTPS and CDN support.

### **Decision**

**Static Site Hosting** with **Content Delivery Network (CDN)**.

### **Specification**

- **Hosting Options:**
  - GitHub Pages (recommended for simple deployments)
  - AWS S3 + CloudFront
  - Azure Static Web Apps
  - Netlify or Vercel
- **Build Output:** `dist/` directory from Vite build
- **Configuration Files:**
  - `app.config.json` - Copied to dist/ during build
  - `manifest.json` - Document manifest
  - `public/documents/` - Document assets
- **Deployment Process:**
  1. Run production build: `npm run build`
  2. Upload dist/ directory to hosting provider
  3. Configure CDN for static assets
  4. Set up HTTPS with valid certificate
  5. Configure caching headers for optimal performance
- **Cache Strategy:**
  - HTML files: No cache (always fetch latest)
  - JS/CSS files: Cache with fingerprint in filename (1 year)
  - Images/documents: Cache (1 year)
  - app.config.json: Cache (24 hours)
- **Performance:**
  - Gzip/Brotli compression enabled
  - CDN edge caching for global distribution
  - HTTP/2 or HTTP/3 support
  - Preload critical resources

# **Phase 4: Backend Implementation**

## **ADR-014: Serverless Backend Architecture**

### **Context**

The application is primarily client-side, with no traditional backend server required for basic functionality.

### **Decision**

**Serverless Static Architecture** with **No Backend Server**.

### **Specification**

- **Architecture Pattern:** JAMstack (JavaScript, APIs, Markup)
- **Data Sources:**
  - Static JSON files (app.config.json, manifest.json)
  - Static document files (markdown, PDF, Word, images)
  - No database required
- **API Requirements:**
  - No API server required for core functionality
  - All data loaded from static files
  - Future: Optional serverless functions for analytics or contact form submission
- **Rationale:**
  - Reduces operational complexity
  - Improves reliability (no server to fail)
  - Scales automatically (CDN-based)
  - Lower costs (no server hosting)
  - Better performance (no network round-trips)
- **Optional Extensions:**
  - **Analytics:** Client-side analytics (Google Analytics, Plausible)
  - **Search:** Client-side search with in-memory index
  - **Forms:** Serverless form handlers (AWS Lambda, Netlify Functions)
  - **Authentication:** Static Web Apps authentication (Azure AD, etc.)

## **ADR-015: Data Persistence & Caching**

### **Context**

Application must work offline and provide fast access to frequently used data.

### **Decision**

**Browser LocalStorage** for caching with **Stale-While-Revalidate** pattern.

### **Specification**

- **Storage Mechanism:** Browser localStorage API
- **Cached Data:**
  - `app.config.json` - Application configuration (24-hour TTL)
  - Document content - Parsed markdown and document metadata
  - Theme preference - User's selected theme
- **Cache Strategy: Stale-While-Revalidate**
  1. Check localStorage for cached config
  2. If found and not expired (< 24 hours), use immediately
  3. Fetch fresh config in background
  4. Update cache when fresh data arrives
  5. If cache expired or missing, fetch before rendering
- **Benefits:**
  - Instant app startup with cached config
  - Offline support for previously loaded content
  - Automatic updates when online
  - Graceful degradation when offline
- **Cache Invalidation:**
  - TTL-based expiration (24 hours for config)
  - Manual cache clear option (future enhancement)
  - Version-based invalidation (future enhancement)
- **Storage Limits:**
  - localStorage limit: ~5-10 MB per origin
  - Sufficient for app config and document metadata
  - Large documents (PDF, images) not cached in localStorage
- **Fallback Behavior:**
  - If localStorage unavailable (private browsing), fetch data on every load
  - If fetch fails and no cache, show error message with fallback content
  - Graceful error handling for storage quota exceeded

# **Phase 5: Frontend Implementation**

## **ADR-016: Component Architecture**

### **Context**

Building a maintainable, reusable component system with consistent patterns.

### **Decision**

**Functional Component Architecture** with **Composition Pattern**.

### **Specification**

- **Component Style:** Functional components only (no class components)
- **Composition:** Components composed from smaller, reusable pieces
- **Props Pattern:** Explicit props with TypeScript interfaces
- **Component Categories:**

### **Core Application Components:**
```
App.tsx
  ├── Header (branding, theme selector)
  ├── Navigation (tabs: Documents, Contacts)
  ├── ScrollArea (container)
  │   ├── DocumentsTab
  │   │   ├── SearchInput
  │   │   ├── TagFilter (conditional)
  │   │   └── DocumentTile[] (list)
  │   └── ContactsTab
  │       └── ContactsView (regional groups)
  └── DocumentViewer (modal overlay)
      ├── MarkdownContent
      ├── PdfViewer (lazy loaded)
      ├── WordViewer
      └── ImageViewer
```

### **Feature Components:**
- **DocumentTile.tsx** - Individual document card with icon, title, category
- **DocumentViewer.tsx** - Full-screen document display with navigation
- **PdfViewer.tsx** - PDF rendering with react-pdf
- **PdfViewerLazy.tsx** - Lazy-loaded wrapper for PDF viewer
- **ContactsView.tsx** - Regional contact directory
- **TagFilter.tsx** - Tag-based document filtering UI
- **ThemeSelector.tsx** - Theme selection dropdown
- **ThemeProvider.tsx** - Theme context provider wrapper

### **UI Component Library (components/ui/):**
- Accordion, AlertDialog, AspectRatio, Avatar
- Checkbox, Collapsible, ContextMenu, Dialog
- DropdownMenu, HoverCard, Label, Menubar
- NavigationMenu, Popover, Progress, RadioGroup
- ScrollArea, Select, Separator, Slider
- Switch, Tabs, Toggle, ToggleGroup, Tooltip

**All UI components are:**
- Based on Radix UI primitives
- Styled with Tailwind CSS
- Fully accessible (ARIA compliant)
- Keyboard navigable
- Customizable via props

### **Custom Hooks:**
- **useAppConfig()** - Access application configuration
- **useFeatureFlag(flag)** - Check if feature is enabled
- **useMobile()** - Detect mobile viewport
- **useThemeConfig()** - Access theme configuration

### **Component Best Practices:**
- Single responsibility principle
- Props interface for all components
- TypeScript for type safety
- Memoization for expensive computations (useMemo)
- Lazy loading for large dependencies (React.lazy)
- Error boundaries for error handling
- Accessible by default (Radix UI)

## **ADR-017: State Management Pattern**

### **Context**

Application needs to share configuration and theme state across components without prop drilling.

### **Decision**

**React Context API** with **Custom Hook Access Pattern**.

### **Specification**

- **Context Providers:**
  - **AppConfigProvider** - Provides app.config.json to all components
  - **ThemeProvider** - Manages theme state and persistence
  - **ErrorBoundary** - Catches and handles React errors
- **Context Structure:**
  ```typescript
  AppConfigContext = {
    config: AppConfig | null,
    loading: boolean,
    error: Error | null,
    isFeatureEnabled: (flag: string) => boolean
  }
  ```
- **Access Pattern:**
  ```typescript
  // In component:
  const { config, isFeatureEnabled } = useAppConfig();
  
  if (isFeatureEnabled('pdfDocuments')) {
    // Show PDF viewer
  }
  ```
- **Provider Hierarchy:**
  ```typescript
  <ErrorBoundary>
    <AppConfigProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AppConfigProvider>
  </ErrorBoundary>
  ```
- **State Updates:**
  - Configuration loaded once at app startup
  - Theme updates trigger re-render of all components
  - Local component state for UI interactions
- **Performance:**
  - Context values memoized to prevent unnecessary re-renders
  - Selective re-rendering with React.memo where needed
  - Lazy loading of heavy components (PDF viewer)

## **ADR-018: Form Handling & Validation**

### **Context**

Currently, the application has no forms. This section defines patterns for future form implementation.

### **Decision**

**React Hook Form** with **Zod Validation** (when needed).

### **Specification**

- **Form Library:** react-hook-form (already in dependencies)
- **Validation:** Zod schemas for runtime validation
- **Pattern:** Controlled components with validation
- **Future Use Cases:**
  - Contact form submission
  - Feedback form
  - Search preferences
  - User settings

## **ADR-019: Error Handling Strategy**

### **Context**

Application must gracefully handle errors and provide helpful feedback to users.

### **Decision**

**Layered Error Handling** with **User-Friendly Messages**.

### **Specification**

- **Error Boundary (React):**
  - Catches React component errors
  - Displays fallback UI (ErrorFallback.tsx)
  - Logs error details for debugging
  - Provides "Reload" button to recover
- **Try-Catch Blocks:**
  - Async operations wrapped in try-catch
  - Configuration loading errors caught and handled
  - Document loading errors caught with fallback content
- **Error Types:**
  - **Network Errors:** Show offline message, use cached data
  - **Validation Errors:** Show specific validation failure message
  - **Render Errors:** Caught by Error Boundary
  - **Loading Errors:** Show error state with retry button
- **User Feedback:**
  - Error messages displayed in UI (not just console)
  - Specific error descriptions when possible
  - Recovery actions provided (retry, reload, use cached)
  - No technical jargon in user-facing messages
- **Logging:**
  - Console.error for development debugging
  - Future: Send errors to logging service for production
- **Graceful Degradation:**
  - If manifest fails, show fallback documents
  - If config fails, show error with contact information
  - If PDF fails, show download link
  - Application never shows white screen of death

# **Phase 6: Operations & Lifecycle**

## **ADR-020: Monitoring & Analytics**

### **Context**

Understanding application usage and identifying issues in production.

### **Decision**

**Client-Side Analytics** with **Privacy-First Approach**.

### **Specification**

- **Current State:** No analytics implemented
- **Future Recommendations:**
  - **Privacy-Friendly Analytics:** Plausible, Simple Analytics, or Fathom
  - **Metrics to Track:**
    - Page views and popular documents
    - Search queries (anonymized)
    - Theme selection distribution
    - Document type usage (PDF vs markdown)
    - Load time and performance metrics
    - Error rates and types
  - **Privacy Considerations:**
    - No personal data collection
    - No cookies required
    - GDPR compliant
    - Aggregated data only
- **Error Tracking:**
  - Currently: Console logging only
  - Future: Sentry or similar for production error tracking
  - Automatic error reporting with stack traces
  - User context (browser, OS, viewport size)

## **ADR-021: Performance Optimization**

### **Context**

Fast load times and smooth interactions are critical for user experience.

### **Decision**

**Multi-Layer Performance Optimization**.

### **Specification**

- **Build Optimizations (Vite):**
  - Tree shaking removes unused code
  - Code splitting for PDF viewer (React.lazy)
  - Asset fingerprinting for cache busting
  - Minification of JS/CSS
  - Lightning CSS for optimal CSS output
  - Bundle size analysis available
- **Runtime Optimizations:**
  - useMemo for filtered document lists
  - React.lazy for PDF viewer (loaded on demand)
  - Virtualized scrolling for long lists (ScrollArea)
  - Debounced search input
  - Lazy loading of images
- **Network Optimizations:**
  - CDN for static assets
  - Gzip/Brotli compression
  - HTTP/2 multiplexing
  - Preload critical resources
  - Stale-while-revalidate for config
- **Caching Strategy:**
  - Aggressive caching for JS/CSS (1 year with fingerprint)
  - Short cache for HTML (no-cache)
  - Medium cache for documents (24 hours)
  - localStorage for app config (24 hours)
- **Mobile Performance:**
  - Native scrolling on iOS via Capacitor
  - Touch-optimized UI components
  - Reduced motion for accessibility
  - Optimized for 3G networks
- **Metrics:**
  - First Contentful Paint (FCP): Target < 1.5s
  - Time to Interactive (TTI): Target < 3s
  - Cumulative Layout Shift (CLS): Target < 0.1
  - Lighthouse score: Target 90+

## **ADR-022: Security Practices**

### **Context**

Application must protect user data and prevent common web vulnerabilities.

### **Decision**

**Defense in Depth** with **Secure by Default**.

### **Specification**

- **XSS Prevention:**
  - React automatic XSS protection (JSX escaping)
  - DOMPurify for markdown HTML sanitization (via marked)
  - No dangerouslySetInnerHTML except for markdown content (sanitized)
  - Content Security Policy (CSP) headers recommended
- **Input Validation:**
  - All configuration validated with Zod schemas
  - Email format validation
  - URL format validation
  - AppId format validation (reverse domain notation)
  - No user input accepted (read-only application)
- **HTTPS Enforcement:**
  - All production deployments must use HTTPS
  - HSTS headers recommended
  - Secure cookies for future authentication
- **Dependency Security:**
  - Dependabot enabled for automated security updates
  - Regular npm audit runs in CI
  - Pin major versions, allow minor/patch updates
  - Review dependencies before adding
- **Data Privacy:**
  - No personal data collected or stored
  - No tracking without user consent
  - localStorage only for app preferences
  - No external API calls except for static assets
- **iOS Security:**
  - App Transport Security (ATS) enforced
  - Secure enclave for sensitive data (future)
  - Keychain for credential storage (future)
  - Code signing with valid certificate

## **ADR-023: Versioning Strategy**

### **Context**

Clear versioning helps track releases and communicate changes.

### **Decision**

**Date-Based Semantic Versioning** with **Automated Releases**.

### **Specification**

- **Version Format:** `release/YYYY.MM.DD.BUILD`
  - **YYYY:** Four-digit year
  - **MM:** Two-digit month (zero-padded)
  - **DD:** Two-digit day (zero-padded)
  - **BUILD:** Sequential build number for the day (1, 2, 3, ...)
- **Examples:**
  - `release/2026.01.28.1` - First build on January 28, 2026
  - `release/2026.01.28.2` - Second build on January 28, 2026
- **Git Tags:**
  - Each release creates a git tag
  - Tag format matches version format
  - Tags trigger deployment pipeline (for `v*` tags)
- **Changelog:**
  - Auto-generated from commit messages
  - Uses Conventional Commits format
  - Included in GitHub release notes
- **Breaking Changes:**
  - Documented in CHANGELOG.md
  - Highlighted in release notes
  - Migration guide provided when needed
- **iOS Versioning:**
  - Separate version number for App Store
  - Format: `MAJOR.MINOR.PATCH` (e.g., 1.0.0)
  - Build number auto-incremented
  - Synchronized with release tags

## **ADR-024: Documentation Standards**

### **Context**

Comprehensive documentation is essential for adoption and maintenance.

### **Decision**

**Living Documentation** with **Multiple Audiences**.

### **Specification**

- **Documentation Types:**
  - **README.md** - Quick start and overview
  - **ARCHITECTURE.md** - This document (architectural decisions)
  - **docs/** - Detailed guides for specific topics
  - **CHANGELOG.md** - Version history and changes
  - **CODE_OF_CONDUCT.md** - Community guidelines
  - **CONTRIBUTING.md** - Contribution guidelines
- **Documentation Files:**
  - `docs/QUICK_START.md` - Getting started guide
  - `docs/CONFIGURATION.md` - Configuration reference
  - `docs/THEME_CONFIGURATION.md` - Theme system guide
  - `docs/iOS_DEVELOPMENT.md` - iOS-specific development
  - `docs/DEPLOY_SETUP.md` - Deployment configuration
  - `docs/APP_ICON_SETUP.md` - App icon configuration
  - `docs/DOCUMENTS.md` - Document management
  - `docs/CI_CD.md` - CI/CD pipeline details
  - `docs/TROUBLESHOOTING.md` - Common issues and solutions
- **Code Documentation:**
  - JSDoc comments for complex functions
  - TypeScript interfaces document data structures
  - Inline comments for non-obvious logic
  - README files in major directories
- **Examples:**
  - `examples/app.config.startup.json` - Small business config
  - `examples/app.config.enterprise.json` - Enterprise config
  - `examples/app.config.regional.json` - Multi-regional config
- **Maintenance:**
  - Documentation updated with code changes
  - Reviewed during code review process
  - Version-specific documentation when needed
  - Feedback loop from user questions

# **Phase 7: Data Flow Architecture**

## **ADR-025: Application Startup Flow**

### **Context**

Understanding the complete application initialization sequence.

### **Specification**

```
┌─────────────────────────────────────────────────────────────┐
│                   Application Startup                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │  main.tsx Entry Point      │
        │  - Initialize React         │
        │  - Mount to DOM             │
        └────────┬───────────────────┘
                 │
                 ↓
        ┌────────────────────────────┐
        │  AppConfigProvider         │
        │  - Fetch app.config.json   │
        │  - Check localStorage       │
        │  - Validate with Zod       │
        │  - Cache for 24 hours      │
        └────────┬───────────────────┘
                 │
         ┌───────┴───────┐
         ↓               ↓
    ✓ Cached       Fresh from Server
    (< 24hr)       (stale-while-revalidate)
         │               │
         └───────┬───────┘
                 ↓
        ┌────────────────────────┐
        │  Configuration Valid   │
        │  - Parse theme config  │
        │  - Parse features      │
        │  - Parse contacts      │
        │  - Parse documents     │
        └────────┬───────────────┘
                 │
                 ↓
        ┌────────────────────────┐
        │  ThemeProvider         │
        │  (next-themes)         │
        │  - Load theme pref     │
        │  - Apply CSS vars      │
        │  - Set data-theme      │
        └────────┬───────────────┘
                 │
                 ↓
        ┌────────────────────────┐
        │  Load Documents        │
        │  - Fetch manifest.json │
        │  - Parse document list │
        │  - Load markdown files │
        │  - Replace placeholders│
        └────────┬───────────────┘
                 │
                 ↓
        ┌────────────────────────┐
        │      Render App        │
        │  - Display documents   │
        │  - Display contacts    │
        │  - Enable search       │
        │  - Enable filtering    │
        └────────┬───────────────┘
                 │
        ┌────────┴────────┐
        ↓                 ↓
   Documents Tab    Contacts Tab
   - Search active  - Regional list
   - Filters ready  - Click-to-call
   - View document  - Business hours
```

## **ADR-026: Document Viewing Flow**

### **Context**

Understanding how users interact with documents.

### **Specification**

```
User clicks DocumentTile
         ↓
┌────────────────────────┐
│  Determine Type        │
│  - Check document.type │
└────────┬───────────────┘
         │
    ┌────┴────┐
    ↓         ↓
Markdown   Binary (PDF/Word/Image)
    │         │
    ↓         ↓
Parse with   Load viewer
marked.js    component
    │         │
    ↓         ↓
Apply       Display
placeholders in viewer
    │         │
    └────┬────┘
         ↓
┌────────────────────────┐
│  DocumentViewer Modal  │
│  - Full screen         │
│  - Navigation buttons  │
│  - Close button        │
└────────────────────────┘
```

# **Summary**

**Enterprise Support** is a **React + Capacitor web-to-native application** designed for deploying interactive IT support documentation across desktop web and iOS platforms. Its architecture emphasizes:

- **Configuration-Driven:** Deploy different content/branding without code changes
- **Offline-First:** Cached configuration and documents for offline usage
- **Mobile-Optimized:** Native iOS experience via Capacitor
- **Type-Safe:** Full TypeScript with runtime validation (Zod)
- **Modern Tooling:** Vite, Tailwind CSS v4, React 19, TypeScript 5.9
- **Accessible:** WCAG AA compliant via Radix UI components
- **Themeable:** Five built-in themes with runtime switching
- **Serverless:** Static hosting, no backend required
- **CI/CD Automated:** GitHub Actions handle testing, building, and releases
- **Scalable:** JAMstack architecture scales with CDN

The application serves as a **reference implementation** for enterprise organizations seeking to deploy customizable, mobile-first support applications with minimal operational overhead.

---

**Document Version:** 1.0.0  
**Last Updated:** January 28, 2026  
**Status:** Approved for Implementation
