import companyConfig from '../../company.config.json';

export type DocumentType = 'markdown' | 'pdf' | 'image' | 'word';

export interface SupportDocument {
  id: string;
  title: string;
  category: string;
  icon: 'wifi' | 'teams' | 'email' | 'security' | 'vpn' | 'printer' | 'phone' | 'laptop' | 'file' | 'image';
  content: string;
  tags?: string[];
  type: DocumentType;
  fileUrl?: string; // For non-markdown documents
}

interface DocumentManifestItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  file: string;
  tags?: string[];
  type?: DocumentType; // Optional for backward compatibility
}

// Function to detect document type from file extension
function detectDocumentType(filename: string): DocumentType {
  const extension = filename.toLowerCase().split('.').pop() || '';
  
  switch (extension) {
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'pdf':
      return 'pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return 'image';
    case 'doc':
    case 'docx':
      return 'word';
    default:
      return 'markdown'; // Default to markdown for backward compatibility
  }
}

// Function to replace placeholders in document content
function replacePlaceholders(content: string): string {
  return content
    .replace(/\{companyName\}/g, companyConfig.companyName)
    .replace(/\{companyName\.toUpperCase\(\)\}/g, companyConfig.companyName.toUpperCase())
    .replace(/\{emergencyEmail\}/g, companyConfig.contacts.emergencyEmail)
    .replace(/\{vpnPortal\}/g, companyConfig.vpnPortal);
}

// Function to load documents from local storage (app bundle assets)
async function loadDocumentsFromAssets(): Promise<SupportDocument[]> {
  try {
    // Read the manifest file from assets
    const manifestResponse = await fetch('/documents/manifest.json');
    if (!manifestResponse.ok) {
      throw new Error('Failed to fetch manifest');
    }
    
    const manifestData = await manifestResponse.json() as DocumentManifestItem[];
    
    // Load each document file
    const documents = await Promise.all(
      manifestData.map(async (item) => {
        try {
          const documentType = item.type || detectDocumentType(item.file);
          const fileUrl = `/documents/${item.file}`;
          
          let content = '';
          
          // For markdown, load and process the content
          if (documentType === 'markdown') {
            const fileResponse = await fetch(fileUrl);
            if (!fileResponse.ok) {
              throw new Error(`Failed to fetch ${item.file}`);
            }
            content = replacePlaceholders(await fileResponse.text());
          } else {
            // For other file types (PDF, Word, images), we'll just store the URL
            // Content can be a simple message or empty
            content = `This is a ${documentType} file. View below.`;
          }
          
          const title = replacePlaceholders(item.title);
          
          return {
            id: item.id,
            title,
            category: item.category,
            icon: item.icon as SupportDocument['icon'],
            content,
            tags: item.tags,
            type: documentType,
            fileUrl,
          };
        } catch (error) {
          console.error(`Failed to load document ${item.file}:`, error);
          return null;
        }
      })
    );
    
    return documents.filter((doc): doc is SupportDocument => doc !== null);
  } catch (error) {
    console.error('Failed to load documents from assets:', error);
    return [];
  }
}

// Fallback hardcoded documents for web development
const fallbackDocuments: SupportDocument[] = [
  {
    id: 'wifi-network',
    title: `${companyConfig.companyName} Wi-Fi Network Connections`,
    category: 'Network',
    icon: 'wifi',
    tags: ['network', 'wifi', 'connection', 'setup'],
    type: 'markdown',
    content: `# ${companyConfig.companyName} Wi-Fi Network Connections

## Overview
This guide explains how to connect to the ${companyConfig.companyName} corporate Wi-Fi network from your devices.

## Available Networks

### ${companyConfig.companyName.toUpperCase()}-CORP
Primary corporate network for ${companyConfig.companyName}-issued devices.
- **Security**: WPA2-Enterprise
- **Authentication**: Use your ${companyConfig.companyName} credentials

### ${companyConfig.companyName.toUpperCase()}-GUEST
For visitors and personal devices.
- **Security**: WPA2-PSK
- **Password**: Available from reception or IT Help Desk

## Connection Steps

### Windows Devices
1. Click the Wi-Fi icon in the system tray
2. Select "${companyConfig.companyName.toUpperCase()}-CORP" from the list
3. Enter your ${companyConfig.companyName} email and password
4. Check "Connect automatically" for convenience
5. Click Connect

### macOS Devices
1. Click the Wi-Fi icon in the menu bar
2. Select "${companyConfig.companyName.toUpperCase()}-CORP"
3. Enter your ${companyConfig.companyName} credentials when prompted
4. Click Join

### iOS/Android Devices
1. Go to Settings > Wi-Fi
2. Tap "${companyConfig.companyName.toUpperCase()}-CORP"
3. Enter your credentials
4. Accept the security certificate if prompted

## Troubleshooting

**Cannot connect?**
- Verify your password hasn't expired
- Ensure you're within range of an access point
- Try forgetting the network and reconnecting

**Slow connection?**
- Move closer to an access point
- Disconnect other devices if possible
- Contact IT if the issue persists

## Support
For assistance, contact the IT Help Desk.`
  },
  {
    id: 'ms-teams-tips',
    title: 'Tips on Using MS Teams',
    category: 'Collaboration',
    icon: 'teams',
    tags: ['collaboration', 'teams', 'chat', 'meetings'],
    type: 'markdown',
    content: `# Tips on Using Microsoft Teams

## Getting Started
Microsoft Teams is ${companyConfig.companyName}' primary collaboration platform for chat, meetings, and file sharing.

## Essential Features

### Chat & Messaging
- **@mentions**: Use @name to get someone's attention
- **Format messages**: Use the toolbar for bold, bullets, and code blocks
- **Priority notifications**: Mark messages as important or urgent
- **Schedule messages**: Right-click Send to schedule delivery

### Meetings
- **Join before host**: You can join meetings up to 5 minutes early
- **Background blur**: Settings > Background effects
- **Meeting notes**: Use the Notes tab for collaborative note-taking
- **Recording**: Click "..." > Start recording (with permission)

### Keyboard Shortcuts
| Action | Windows | Mac |
|--------|---------|-----|
| New chat | Ctrl+N | Cmd+N |
| Search | Ctrl+E | Cmd+E |
| Mute | Ctrl+Shift+M | Cmd+Shift+M |
| Video toggle | Ctrl+Shift+O | Cmd+Shift+O |

## Best Practices

### Status Management
- Set your status to reflect availability
- Use "Do Not Disturb" during focused work
- Schedule status changes in advance

### File Collaboration
- Share files in channels, not chat (better discoverability)
- Use co-authoring for real-time collaboration
- Pin important files to the Files tab

### Meeting Etiquette
- Mute when not speaking
- Use video when possible for engagement
- Join from a quiet location
- Test audio/video before important meetings

## Mobile App
Download Teams on iOS/Android for on-the-go access. Features include:
- Push notifications
- Quick replies
- Join meetings from anywhere
- Share location and photos

## Support
For Teams support, contact the IT Help Desk or visit the Teams Help channel.`
  },
  {
    id: 'email-setup',
    title: 'Email Setup & Best Practices',
    category: 'Communication',
    icon: 'email',
    tags: ['email', 'outlook', 'setup', 'communication'],
    type: 'markdown',
    content: `# Email Setup & Best Practices

## Outlook Configuration

### Desktop Setup (Windows/Mac)
1. Open Microsoft Outlook
2. Go to File > Add Account
3. Enter your ${companyConfig.companyName} email address
4. Follow the autodiscover prompts
5. Enter your password when prompted

### Mobile Setup
**iOS Mail App:**
1. Settings > Mail > Accounts > Add Account
2. Select Microsoft Exchange
3. Enter your ${companyConfig.companyName} email
4. Accept ${companyConfig.companyName} MDM policy

**Outlook Mobile (Recommended):**
1. Download Outlook from App Store/Play Store
2. Tap Add Account
3. Enter your ${companyConfig.companyName} email
4. Authenticate with your credentials

## Email Best Practices

### Writing Effective Emails
- **Subject lines**: Be specific and actionable
- **Recipients**: Use CC sparingly, BCC for large groups
- **Length**: Keep emails concise; use bullets for clarity
- **Signature**: Use the standard ${companyConfig.companyName} signature template

### Managing Your Inbox
- **Folders**: Create folders for projects and clients
- **Rules**: Automate sorting with inbox rules
- **Focused Inbox**: Let Outlook prioritize important messages
- **Archive**: Archive old emails instead of deleting

### Security Guidelines
- Never share passwords via email
- Report suspicious emails to ${companyConfig.contacts.emergencyEmail}
- Verify sender addresses on financial requests
- Don't click links in unexpected emails

## Calendar Integration
- Share your calendar with your team
- Set working hours in Outlook settings
- Use scheduling assistant for meetings
- Book meeting rooms through the Room Finder

## Out of Office
1. File > Automatic Replies
2. Set date range
3. Compose internal and external messages
4. Enable and save

## Support
Contact IT Help Desk for email issues.`
  },
  {
    id: 'security-guidelines',
    title: 'Security Guidelines',
    category: 'Security',
    icon: 'security',
    tags: ['security', 'password', 'mfa', 'phishing'],
    type: 'markdown',
    content: `# Security Guidelines

## Password Policy

### Requirements
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Cannot reuse last 12 passwords
- Must change every 90 days

### Best Practices
- Use a passphrase (e.g., "Coffee@Morning2024!")
- Never share passwords
- Use unique passwords for each system
- Enable MFA wherever available

## Multi-Factor Authentication (MFA)

### Setting Up MFA
1. Download Microsoft Authenticator app
2. Go to mysignins.microsoft.com
3. Click "Security info" > Add method
4. Select "Authenticator app"
5. Scan the QR code with your phone

### Using MFA
- Approve push notifications when prompted
- Use the 6-digit code if push fails
- Keep backup codes in a secure location

## Device Security

### Laptops
- Lock your screen when away (Win+L or Cmd+Ctrl+Q)
- Enable full disk encryption
- Keep software updated
- Use approved antivirus software

### Mobile Devices
- Enable screen lock with PIN/biometrics
- Keep devices updated
- Only install approved apps
- Report lost/stolen devices immediately

## Phishing Awareness

### Red Flags
- Urgent or threatening language
- Suspicious sender addresses
- Requests for credentials or money
- Unexpected attachments

### If You Suspect Phishing
1. Don't click any links
2. Don't download attachments
3. Forward to ${companyConfig.contacts.emergencyEmail}
4. Delete the email

## Data Protection
- Classify documents appropriately
- Don't store sensitive data on personal devices
- Use approved cloud storage only
- Encrypt sensitive email attachments

## Incident Reporting
Report security incidents immediately to:
- Email: ${companyConfig.contacts.emergencyEmail}
- Phone: IT Security Hotline (see Contacts)

## Support
Contact the Security team for questions.`
  },
  {
    id: 'vpn-setup',
    title: 'VPN Connection Guide',
    category: 'Network',
    icon: 'vpn',
    tags: ['vpn', 'network', 'remote', 'setup'],
    type: 'markdown',
    content: `# VPN Connection Guide

## Overview
The ${companyConfig.companyName} VPN provides secure access to internal resources when working remotely.

## Before You Start
- Ensure you have the GlobalProtect client installed
- Have your ${companyConfig.companyName} credentials ready
- Verify MFA is set up on your account

## Installation

### Windows
1. Download GlobalProtect from the IT portal
2. Run the installer as Administrator
3. Follow the installation wizard
4. Restart your computer when prompted

### macOS
1. Download GlobalProtect from the IT portal
2. Open the .pkg file
3. Follow the installation prompts
4. Grant required permissions in System Preferences

## Connecting to VPN

### First Time Setup
1. Open GlobalProtect
2. Enter portal address: ${companyConfig.vpnPortal}
3. Click Connect
4. Enter your ${companyConfig.companyName} username and password
5. Approve the MFA prompt on your phone
6. Wait for connection to establish

### Daily Connection
1. Click the GlobalProtect icon in your system tray/menu bar
2. Click Connect
3. Approve the MFA prompt
4. Wait for "Connected" status

## Disconnecting
1. Click the GlobalProtect icon
2. Click Disconnect
3. Confirm if prompted

## Troubleshooting

**Connection fails?**
- Check your internet connection
- Verify your password hasn't expired
- Ensure MFA app is working
- Try restarting GlobalProtect

**Slow connection?**
- Close unnecessary applications
- Check your home internet speed
- Try connecting to a different server region

**Cannot access internal resources?**
- Verify VPN shows "Connected"
- Try disconnecting and reconnecting
- Clear your DNS cache
- Contact IT if the issue persists

## Best Practices
- Only connect when needed
- Disconnect when not in use
- Keep GlobalProtect updated
- Report any unusual behavior

## Support
Contact IT Help Desk for VPN assistance.`
  },
  {
    id: 'printer-setup',
    title: 'Printer Setup & Troubleshooting',
    category: 'Hardware',
    icon: 'printer',
    tags: ['printer', 'hardware', 'setup', 'troubleshooting'],
    type: 'markdown',
    content: `# Printer Setup & Troubleshooting

## Finding Printers

### Office Printers
Printers are named by location:
- Format: CITY-FLOOR-AREA (e.g., CLT-4-EAST)
- Check signs near printers for exact names

### Adding a Printer

**Windows:**
1. Open Settings > Devices > Printers & scanners
2. Click "Add a printer or scanner"
3. Wait for available printers to appear
4. Select your printer and click "Add device"

**macOS:**
1. System Preferences > Printers & Scanners
2. Click the + button
3. Select your printer from the list
4. Click Add

## Secure Print (Follow-Me Printing)

### How It Works
Documents are held in a secure queue until you release them at any printer.

### Sending a Secure Print Job
1. Print your document normally
2. Select "${companyConfig.companyName} Secure Print" as the printer
3. Click Print
4. Go to any printer to release

### Releasing Your Print Job
1. Tap your badge on the printer card reader
2. Select your document(s) from the list
3. Tap Print or Print All
4. Collect your documents

## Troubleshooting

### Paper Jams
1. Open the indicated door/tray
2. Gently remove jammed paper
3. Check for torn pieces
4. Close all doors firmly
5. Press Continue on the display

### Print Quality Issues
- Run cleaning cycle from printer menu
- Check toner levels
- Try a different paper tray
- Report persistent issues to IT

### Job Not Appearing
- Verify correct printer selected
- Check your print queue on computer
- Ensure you're connected to the network
- Re-send the print job

### Scanner Not Working
- Check the scanner glass is clean
- Verify destination email/folder
- Ensure proper document placement
- Try restarting the scanner module

## Supplies
- Report low toner/paper to Facilities
- Don't attempt to replace parts yourself
- Special paper requests: contact Office Services

## Support
For printer issues, contact IT Help Desk.`
  },
  {
    id: 'softphone-setup',
    title: 'Softphone & Phone System',
    category: 'Communication',
    icon: 'phone',
    tags: ['phone', 'softphone', 'communication', 'setup'],
    type: 'markdown',
    content: `# Softphone & Phone System

## Overview
${companyConfig.companyName} uses a unified communications system for voice calls, accessible via desk phones, softphone, and mobile.

## Softphone Setup

### Desktop Client
1. Download the softphone client from IT portal
2. Install and launch the application
3. Sign in with your ${companyConfig.companyName} credentials
4. Allow microphone and speaker permissions
5. Test audio in Settings

### Mobile App
1. Download Webex or Teams (per your region)
2. Sign in with your ${companyConfig.companyName} account
3. Enable notifications
4. Test incoming and outgoing calls

## Making Calls

### Internal Calls
- Dial the 4-digit extension directly
- Or dial the full 10-digit number

### External Calls
- Dial 9 + area code + number
- International: 9 + 011 + country code + number

### Conference Calls
1. Dial the first participant
2. Click "Add call" or press Conference
3. Dial the next participant
4. Click "Merge" to join calls

## Features

### Voicemail
- Access: Dial *86 or click Voicemail in app
- Default PIN: Last 4 of your employee ID
- Change PIN in voicemail settings

### Call Forwarding
- Enable: *72 + destination number
- Disable: *73
- Or configure in softphone settings

### Do Not Disturb
- Enable in softphone app settings
- Calls go directly to voicemail
- Remember to disable when available

### Call Transfer
1. Press Transfer or click transfer button
2. Dial the destination
3. Announce the caller (warm transfer)
4. Complete the transfer

## Headset Recommendations
- Jabra Evolve series (certified)
- Poly Voyager series (certified)
- Any USB headset with microphone

## Troubleshooting

**No audio?**
- Check headset/speaker selection in settings
- Verify device isn't muted
- Test with a different headset
- Restart the softphone application

**Calls dropping?**
- Check network connection
- Try wired ethernet if on Wi-Fi
- Close bandwidth-heavy applications

**Echo or feedback?**
- Use headset instead of speakers
- Mute when not speaking
- Reduce speaker volume

## Support
Contact IT Help Desk for phone system issues.`
  },
  {
    id: 'laptop-care',
    title: 'Laptop Care & Maintenance',
    category: 'Hardware',
    icon: 'laptop',
    tags: ['laptop', 'hardware', 'maintenance', 'care'],
    type: 'markdown',
    content: `# Laptop Care & Maintenance

## Daily Care

### Power Management
- Plug in when at desk to preserve battery health
- Keep charge between 20-80% when possible
- Use the provided ${companyConfig.companyName} charger only
- Don't leave plugged in at 100% for extended periods

### Physical Care
- Clean screen with microfiber cloth only
- Keep liquids away from keyboard
- Don't place heavy objects on closed laptop
- Use a protective sleeve when traveling

## Software Maintenance

### Windows Updates
Updates are deployed automatically. When prompted:
1. Save your work
2. Click "Update and Restart"
3. Allow 15-30 minutes for completion
4. Don't interrupt the update process

### Application Updates
- Most apps update automatically
- Check for updates weekly in Company Portal
- Report apps that won't update to IT

### Antivirus
- CrowdStrike runs automatically
- Don't disable or uninstall
- Report any security alerts to IT

## Storage Management

### Best Practices
- Store files in OneDrive, not local drive
- Empty Recycle Bin regularly
- Uninstall unused applications
- Use Disk Cleanup monthly

### Low Storage Warning
1. Open Settings > System > Storage
2. Review large files and apps
3. Move files to OneDrive
4. Run Storage Sense cleanup

## Performance Tips

### Speed Up Your Laptop
- Restart weekly (not just sleep)
- Close unused browser tabs
- Limit startup applications
- Keep desktop clean

### Overheating Prevention
- Don't block ventilation ports
- Use on hard, flat surfaces
- Clean vents with compressed air monthly
- Report fans running constantly

## Hardware Issues

### Screen Problems
- Adjust brightness: Fn + brightness keys
- Check display settings for resolution
- Connect external monitor to test
- Report cracks or dead pixels

### Keyboard Issues
- Restart laptop first
- Check for debris under keys
- Try external keyboard to test
- Report stuck or missing keys

### Battery Issues
- Check Battery Health in settings
- Report significantly reduced life
- Batteries are replaced by IT

## Getting Repairs
1. Back up important local files
2. Submit IT ticket with issue details
3. Bring laptop to IT during scheduled time
4. Receive loaner if repair takes time

## Support
Contact IT Help Desk for hardware issues.`
  }
];

// Main function to load documents - loads from app assets (works on both web and iOS)
export async function loadSupportDocuments(): Promise<SupportDocument[]> {
  const documents = await loadDocumentsFromAssets();
  // If loading from assets fails, use fallback
  return documents.length > 0 ? documents : fallbackDocuments;
}

export interface ContactRegion {
  region: string;
  city: string;
  phone: string;
  hours: string;
}

export const contactInfo = {
  email: companyConfig.contacts.email,
  emergencyEmail: companyConfig.contacts.emergencyEmail,
  regions: companyConfig.contacts.regions as ContactRegion[]
};
