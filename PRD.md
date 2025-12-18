# Barings Support

A mobile-first support document hub for Barings employees to quickly access curated IT support documents and contact information, designed to work offline.

**Experience Qualities**:
1. **Professional** - Clean, corporate aesthetic that reflects Barings' financial services brand identity
2. **Efficient** - Documents are immediately accessible with minimal taps, respecting busy employees' time
3. **Reliable** - All content available offline, ensuring support is always accessible

**Complexity Level**: Light Application (multiple features with basic state)
- Features document browsing, document viewing, and contact information sections with navigation between views

## Essential Features

### Document Grid Browser
- **Functionality**: Displays all support documents in a responsive block/grid layout with icons and titles
- **Purpose**: Quick visual scanning to find relevant support content
- **Trigger**: Default view on app launch
- **Progression**: User sees grid → scans document tiles → taps desired document → transitions to viewer
- **Success criteria**: All documents visible, tappable, and identifiable by title/icon

### Document Viewer
- **Functionality**: Full-screen viewer displaying document content with navigation back to grid
- **Purpose**: Read support documentation without leaving the app
- **Trigger**: Tapping a document tile in the grid
- **Progression**: Document opens → content displays → user reads → taps back to return to grid
- **Success criteria**: Content readable, back navigation works, smooth transitions

### IT Contact Directory
- **Functionality**: Dedicated section showing IT helpdesk contact info for multiple regions
- **Purpose**: Enable employees to quickly reach IT support when documents aren't enough
- **Trigger**: Tapping contact/support tab in navigation
- **Progression**: User taps contact tab → sees regional phone numbers and email → can tap to call/email
- **Success criteria**: All regional contacts displayed, clickable phone/email links

## Edge Case Handling
- **Empty search**: Show "No documents found" message with suggestion to browse all
- **Long document titles**: Truncate with ellipsis, show full title on document viewer
- **Small screens**: Single column grid on very narrow devices

## Design Direction
The design should feel trustworthy and corporate yet modern—like a premium internal tool. Clean lines, generous whitespace, and a sophisticated color palette that echoes Barings' brand (deep navy, warm accents). iOS-native feel with smooth transitions.

## Color Selection
- **Primary Color**: `oklch(0.35 0.08 250)` - Deep navy blue, communicates trust and professionalism
- **Secondary Colors**: `oklch(0.96 0.01 250)` - Light blue-gray for backgrounds, creates depth
- **Accent Color**: `oklch(0.65 0.15 45)` - Warm copper/gold for CTAs and highlights, adds warmth
- **Foreground/Background Pairings**:
  - Background (Light gray `oklch(0.98 0.005 250)`): Navy text `oklch(0.25 0.05 250)` - Ratio 12:1 ✓
  - Primary Navy `oklch(0.35 0.08 250)`: White text `oklch(1 0 0)` - Ratio 8.5:1 ✓
  - Accent Copper `oklch(0.65 0.15 45)`: Dark text `oklch(0.2 0.03 250)` - Ratio 5.2:1 ✓

## Font Selection
Typography should feel clean and professional with excellent readability on mobile screens—SF Pro Display characteristics with a modern sans-serif fallback.

- **Primary Font**: Inter (clean, modern, excellent mobile readability)
- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/24px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/18px/normal
  - Document Titles: Inter Medium/14px/normal
  - Body Text: Inter Regular/15px/1.6 line height
  - Caption/Meta: Inter Regular/12px/muted color

## Animations
Subtle, iOS-native feeling transitions—cards should have gentle lift on hover/tap, page transitions should slide smoothly, and interactive elements should provide immediate tactile feedback without being distracting.

## Component Selection
- **Components**: 
  - Card (document tiles with hover states)
  - Tabs (navigation between Documents and Contacts)
  - ScrollArea (document content)
  - Button (back navigation, contact actions)
  - Separator (visual divisions)
- **Customizations**: 
  - Custom document tile component with icon, title, and category badge
  - Document viewer with header and scrollable content area
- **States**: 
  - Document tiles: default, hover (lift + shadow), active (pressed)
  - Tabs: inactive (muted), active (primary with indicator)
- **Icon Selection**: 
  - FileText for documents
  - Phone for contact
  - Envelope for email
  - ArrowLeft for back navigation
  - Buildings for regional offices
- **Spacing**: 16px base grid, 12px card padding, 24px section margins
- **Mobile**: Full-width cards on small screens, 2-column grid on larger mobile
