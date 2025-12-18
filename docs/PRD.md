# Enterprise Support App

A mobile-first support document hub for enterprise employees to quickly access curated IT support documents and contact information, designed to work offline.

> **Note**: This application is enterprise-agnostic and can be configured for any organization by editing the `company.config.json` file.

**Experience Qualities**:
1. **Clean** - Flat, minimal design with clear visual hierarchy and no unnecessary decoration
2. **Efficient** - List-based layout enables fast scanning and one-tap access to content
3. **Reliable** - All content available offline, ensuring support is always accessible

**Complexity Level**: Light Application (multiple features with basic state)
- Features document browsing, document viewing, and contact information sections with navigation between views

## Essential Features

### Document List Browser
- **Functionality**: Displays all support documents in a clean list layout with category icons
- **Purpose**: Quick visual scanning to find relevant support content
- **Trigger**: Default view on app launch
- **Progression**: User sees list → scans document rows → taps desired document → transitions to viewer
- **Success criteria**: All documents visible, tappable, and identifiable by title/category

### Document Viewer
- **Functionality**: Full-screen viewer displaying document content with navigation back to list
- **Purpose**: Read support documentation without leaving the app
- **Trigger**: Tapping a document row in the list
- **Progression**: Document opens → content displays → user reads → taps back to return to list
- **Success criteria**: Content readable, back navigation works, smooth transitions

### IT Contact Directory
- **Functionality**: Dedicated section showing IT helpdesk contact info for multiple regions
- **Purpose**: Enable employees to quickly reach IT support when documents aren't enough
- **Trigger**: Tapping contact tab in navigation
- **Progression**: User taps contact tab → sees regional phone numbers and email → can tap to call/email
- **Success criteria**: All regional contacts displayed, clickable phone/email links

## Edge Case Handling
- **Empty search**: Show "No documents found" message with clear search button
- **Long document titles**: Truncate with ellipsis, show full title on document viewer
- **Small screens**: Full-width list items adapt to all screen sizes

## Design Direction
Modern, flat design with clean typography and minimal chrome. Emphasis on content with subtle color accents for categorization. iOS-native feel with smooth slide transitions.

## Color Selection
- **Primary Color**: `oklch(0.25 0 0)` - Pure dark gray for text and headers, maximum readability
- **Secondary Colors**: `oklch(0.965 0 0)` - Near-white for subtle backgrounds
- **Accent Color**: `oklch(0.55 0.18 250)` - Blue accent for interactive highlights
- **Category Colors**: 
  - Network: Blue-50/Blue-600
  - Collaboration: Violet-50/Violet-600
  - Communication: Emerald-50/Emerald-600
  - Security: Rose-50/Rose-600
  - Hardware: Amber-50/Amber-600
- **Foreground/Background Pairings**:
  - Background `oklch(0.985 0 0)`: Dark text `oklch(0.15 0 0)` - Ratio 15:1 ✓
  - Card `oklch(1 0 0)`: Dark text `oklch(0.15 0 0)` - Ratio 16:1 ✓
  - Accent `oklch(0.55 0.18 250)`: White text `oklch(1 0 0)` - Ratio 4.8:1 ✓

## Font Selection
Clean, modern sans-serif with excellent mobile readability. Inter provides neutral professionalism.

- **Primary Font**: Inter
- **Typographic Hierarchy**:
  - H1 (App Title): Inter SemiBold/20px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/18px/normal
  - Document Titles: Inter Medium/14px/normal
  - Body Text: Inter Regular/14px/1.6 line height
  - Caption/Meta: Inter Regular/12px/muted color
  - Section Labels: Inter SemiBold/11px/uppercase/tracking-wider

## Animations
Minimal, purposeful animations. List items scale subtly on tap. Document viewer slides in from right. No hover effects that distract from content.

## Component Selection
- **Components**: 
  - ScrollArea (content scrolling)
  - Button (back navigation, ghost variant)
  - Input (search field with icon)
- **Customizations**: 
  - Flat segmented control for tab navigation (custom, not Tabs component)
  - List-style document tiles with icon, title, category, and chevron
  - Flat contact cards with tap-to-call/email
- **States**: 
  - Document rows: default, hover (muted background), active (scale down)
  - Tabs: inactive (muted text), active (filled background with shadow)
- **Icon Selection**: 
  - FileText for documents section
  - Phone for contacts section
  - MagnifyingGlass for search
  - CaretRight for list chevrons
  - ArrowLeft for back navigation
  - MapPin for regional offices
  - EnvelopeSimple for email
  - Clock for hours
- **Spacing**: 20px horizontal padding, 16px between items, 24px section margins
- **Mobile**: Full-width list items, consistent across all breakpoints
