# Theme Configuration Guide

This document explains how to configure and use the color theme feature in the Enterprise Support application.

## Overview

The application supports multiple color themes that can be configured globally and selected by users at runtime. This feature enhances accessibility and allows for brand customization.

## Features

- **Multiple Predefined Themes**: Light, Dark, Ocean Blue, Forest Green, and Royal Purple
- **Runtime Theme Switching**: Users can switch themes without reloading the page
- **Theme Persistence**: Selected theme is saved in browser localStorage
- **System Theme Support**: Automatically respects system dark/light mode preferences
- **Configurable**: Themes can be enabled/disabled via configuration

## Configuration

### Runtime Configuration

Theme settings are configured in `runtime.config.json`:

```json
{
  "themeConfig": {
    "defaultTheme": "light",
    "enableThemeSwitcher": true,
    "themes": [
      {
        "id": "light",
        "name": "Light",
        "description": "Clean light theme",
        "enabled": true
      },
      {
        "id": "dark",
        "name": "Dark",
        "description": "Dark mode theme",
        "enabled": true
      },
      {
        "id": "blue",
        "name": "Ocean Blue",
        "description": "Professional blue theme",
        "enabled": true
      },
      {
        "id": "green",
        "name": "Forest Green",
        "description": "Natural green theme",
        "enabled": true
      },
      {
        "id": "purple",
        "name": "Royal Purple",
        "description": "Elegant purple theme",
        "enabled": true
      }
    ]
  }
}
```

### Configuration Options

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `defaultTheme` | string | The default theme to use when user visits for the first time | `"light"` |
| `enableThemeSwitcher` | boolean | Whether to show the theme selector button in the UI | `true` |
| `themes` | array | Array of available theme options | See above |

### Theme Object Structure

Each theme in the `themes` array should have:

```json
{
  "id": "unique-theme-id",
  "name": "Display Name",
  "description": "Brief description",
  "enabled": true
}
```

- **id**: Unique identifier matching CSS class name (e.g., "light", "dark", "blue")
- **name**: User-friendly display name shown in the theme selector
- **description**: Short description shown below the theme name
- **enabled**: Optional boolean flag to enable/disable a theme (default: `true`). Disabled themes won't appear in the theme selector.

## Usage

### User Interface

Users can change the theme by:

1. Click the palette icon in the top-right corner of the header
2. Select a theme from the dropdown menu
3. The theme is applied immediately and saved to localStorage

### Theme Persistence

The selected theme is automatically saved to browser localStorage with the key `enterprise-support-theme`. The theme persists across:
- Page reloads
- Browser restarts
- Different sessions

### System Theme Integration

If a user hasn't selected a theme, the application will:
1. Check for a saved theme in localStorage
2. Fall back to the `defaultTheme` from configuration
3. Respect the system's dark/light mode preference when `enableSystem` is true

## Adding Custom Themes

To add a new custom theme:

### 1. Add Theme Configuration

Add a new theme object to `runtime.config.json`:

```json
{
  "id": "custom",
  "name": "Custom Theme",
  "description": "My custom color theme",
  "enabled": true
}
```

### 2. Define CSS Variables

Add CSS variables in `src/main.css`:

```css
.custom {
  --background: oklch(0.97 0.01 180);
  --foreground: oklch(0.15 0.02 180);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0.02 180);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0.02 180);
  --primary: oklch(0.5 0.18 180);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.92 0.02 180);
  --secondary-foreground: oklch(0.2 0.02 180);
  --muted: oklch(0.94 0.01 180);
  --muted-foreground: oklch(0.5 0.02 180);
  --accent: oklch(0.6 0.15 180);
  --accent-foreground: oklch(1 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.88 0.01 180);
  --input: oklch(0.88 0.01 180);
  --ring: oklch(0.6 0.15 180);
  /* Add chart colors as needed */
}
```

### 3. Test the Theme

The theme will be automatically available in the theme selector once you:

1. Restart the development server
2. Open the theme selector
3. Select your custom theme
4. Verify all UI elements render correctly

**Note**: You don't need to manually register the theme in code - it's automatically loaded from the configuration.

## Available Themes

### Light Theme
- **ID**: `light`
- **Description**: Clean, bright theme optimized for daylight viewing
- **Use Case**: Default theme for most users

### Dark Theme
- **ID**: `dark`
- **Description**: Dark mode with reduced brightness
- **Use Case**: Low-light environments, reduced eye strain

### Ocean Blue Theme
- **ID**: `blue`
- **Description**: Professional blue color palette
- **Use Case**: Corporate branding, technology companies

### Forest Green Theme
- **ID**: `green`
- **Description**: Natural green color palette
- **Use Case**: Environmental organizations, wellness companies

### Royal Purple Theme
- **ID**: `purple`
- **Description**: Elegant purple color palette
- **Use Case**: Creative industries, premium branding

## Accessibility Considerations

When designing custom themes:

1. **Contrast Ratios**: Ensure text meets WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
2. **Color Blindness**: Test themes with color blindness simulators
3. **Focus Indicators**: Ensure focus rings are visible on all themes
4. **Semantic Colors**: Maintain consistent meaning for colors (red for errors, green for success)

## Enabling/Disabling Themes

You can enable or disable individual themes by setting the `enabled` property in the configuration:

### Disable a Specific Theme

To hide a theme from the theme selector without removing its CSS:

```json
{
  "themes": [
    {
      "id": "light",
      "name": "Light",
      "description": "Clean light theme",
      "enabled": true
    },
    {
      "id": "purple",
      "name": "Royal Purple",
      "description": "Elegant purple theme",
      "enabled": false
    }
  ]
}
```

In this example, the Purple theme won't appear in the theme selector, even though the CSS is still available. This is useful for:
- Temporarily disabling themes during testing
- Limiting theme choices for specific deployments
- Gradually rolling out new themes

### Re-enable a Theme

Simply set `enabled` to `true` or remove the property (defaults to `true`):

```json
{
  "id": "purple",
  "name": "Royal Purple",
  "description": "Elegant purple theme",
  "enabled": true
}
```

## Disabling Theme Switching

To disable theme switching:

Set `enableThemeSwitcher` to `false` in `runtime.config.json`:

```json
{
  "themeConfig": {
    "enableThemeSwitcher": false,
    "defaultTheme": "light"
  }
}
```

The theme selector button will be hidden, and users will see the default theme only.

## Troubleshooting

### Theme Not Applying

1. Check that the theme ID in configuration matches the CSS class name
2. Clear browser localStorage and cache
3. Verify CSS variables are properly defined
4. Check browser console for errors

### Theme Selector Not Showing

1. Verify `enableThemeSwitcher` is `true` in configuration
2. Check that runtime.config.json is valid JSON
3. Ensure ThemeProvider is wrapping the App component

### Theme Not Persisting

1. Check browser localStorage is enabled
2. Verify the storage key `enterprise-support-theme` is being set
3. Clear browser data and try again

## Technical Details

### Implementation

The theme system uses:
- **next-themes**: For theme state management and persistence
- **CSS Custom Properties**: For dynamic color values
- **OKLCH Color Space**: For perceptually uniform colors
- **Tailwind CSS**: For utility-based styling

### File Structure

```
src/
├── components/
│   ├── ThemeProvider.tsx      # Theme context provider
│   └── ThemeSelector.tsx      # Theme selection UI
├── lib/
│   └── theme-config.ts        # Theme configuration loader
├── main.css                   # Theme CSS variables
└── main.tsx                   # App initialization with provider
```

## Best Practices

1. **Test All Themes**: Verify UI components work with all themes
2. **Document Custom Themes**: Keep a record of custom color values
3. **Use Semantic Variables**: Reference CSS variables instead of hard-coded colors
4. **Provide Fallbacks**: Always define fallback values for custom properties
5. **Consider Brand Guidelines**: Align theme colors with company branding

## Related Documentation

- [Configuration Guide](./CONFIGURATION.md) - General app configuration
- [Quick Start Guide](./QUICK_START.md) - Getting started
- [README](../README.md) - Project overview

## Support

For issues or questions about theme configuration:
1. Check the troubleshooting section above
2. Review the example themes in `runtime.config.json`
3. Consult the [Tailwind CSS documentation](https://tailwindcss.com/docs)
4. Open an issue on GitHub
