# Routing App Coverage File

This GeoJSON file defines the geographic coverage area for routing functionality in your app.

## Overview

Apple requires apps that provide routing or mapping services to specify which geographic regions they support. This is done through a GeoJSON file containing MultiPolygon shapes that outline the coverage areas.

## File Format

The file must be valid GeoJSON with the following requirements:

- **Type**: Must be `MultiPolygon` (not `Polygon`, `LineString`, etc.)
- **Coordinates**: `[longitude, latitude]` format (note: longitude comes first!)
- **Simplicity**: Avoid complex polygons; Apple recommends < 20 points per polygon
- **No Holes**: MultiPolygons should not contain holes
- **No Extra Properties**: Keep the structure minimal

## Current Configuration

The current file defines a small rectangular area in San Francisco as a placeholder:

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [-122.4194, 37.7749],  // West, North (longitude, latitude)
        [-122.4083, 37.7749],  // East, North
        [-122.4083, 37.7849],  // East, South
        [-122.4194, 37.7849],  // West, South
        [-122.4194, 37.7749]   // Close the polygon
      ]
    ]
  ]
}
```

**⚠️ This is a placeholder. Update it to reflect your actual coverage area before submitting to App Store.**

## How to Update

### Method 1: Using geojson.io (Recommended)

1. Visit [geojson.io](https://geojson.io)
2. Draw your coverage area on the map
3. Click on the polygon you created
4. In the JSON panel on the right, ensure it's a `MultiPolygon`
5. Copy the GeoJSON
6. Replace the contents of this file
7. Simplify if needed (reduce points)

### Method 2: Manual Editing

You can manually edit this file to define your coverage area:

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [lon1, lat1],
        [lon2, lat2],
        [lon3, lat3],
        [lon4, lat4],
        [lon1, lat1]  // Must close the polygon
      ]
    ]
  ]
}
```

**Important Notes:**
- Coordinates are `[longitude, latitude]` (not lat/lon!)
- First and last coordinate must be identical (close the polygon)
- For multiple regions, add more polygon arrays

### Method 3: Multiple Coverage Areas

If your app covers multiple non-contiguous regions:

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [lon1, lat1],
        [lon2, lat2],
        [lon3, lat3],
        [lon1, lat1]
      ]
    ],
    [
      [
        [lon4, lat4],
        [lon5, lat5],
        [lon6, lat6],
        [lon4, lat4]
      ]
    ]
  ]
}
```

## Validation

Before deploying, validate your GeoJSON:

1. **Online Validator**: [geojsonlint.com](https://geojsonlint.com)
2. **Command Line**: `cat routing_app_coverage.geojson | jq .`

Common validation errors:
- ❌ Using `Polygon` instead of `MultiPolygon`
- ❌ Wrong coordinate order (latitude, longitude instead of longitude, latitude)
- ❌ Not closing polygons (first and last point must match)
- ❌ Too many points (simplify to < 20 per polygon)

## Upload to App Store Connect

**Note:** As of current Fastlane versions, routing coverage files are not automatically uploaded by the `upload_to_app_store` action. Check [Fastlane deliver documentation](https://docs.fastlane.tools/actions/deliver/) for updates.

You have two options:

### Option 1: Manual Upload (Recommended)

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app
3. Go to the "App Information" section
4. Find "Routing App Coverage File"
5. Click "Choose File" and upload `routing_app_coverage.geojson`
6. Save changes

### Option 2: App Store Connect API

Use the App Store Connect API to upload programmatically:

```bash
# This requires additional setup with API credentials
curl -X POST "https://api.appstoreconnect.apple.com/v1/routingAppCoverages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @routing_app_coverage.geojson
```

See [Apple's Routing App Coverage API Documentation](https://developer.apple.com/documentation/appstoreconnectapi/routing-app-coverages) for details.

## Geographic Coverage Examples

### US State (California)

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [-124.4, 42.0],
        [-120.0, 42.0],
        [-114.1, 32.5],
        [-117.1, 32.5],
        [-124.4, 42.0]
      ]
    ]
  ]
}
```

### City (New York)

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [-74.0, 40.7],
        [-73.9, 40.7],
        [-73.9, 40.8],
        [-74.0, 40.8],
        [-74.0, 40.7]
      ]
    ]
  ]
}
```

### Multiple Cities

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [-122.5, 37.7],
        [-122.3, 37.7],
        [-122.3, 37.8],
        [-122.5, 37.8],
        [-122.5, 37.7]
      ]
    ],
    [
      [
        [-118.3, 34.0],
        [-118.1, 34.0],
        [-118.1, 34.1],
        [-118.3, 34.1],
        [-118.3, 34.0]
      ]
    ]
  ]
}
```

## Best Practices

1. **Be Accurate**: Only include regions where your routing actually works
2. **Keep It Simple**: Use simplified polygons with minimal points
3. **Test Thoroughly**: Ensure your routing works in all covered areas
4. **Update Regularly**: Update coverage as you expand to new regions
5. **Version Control**: Keep this file in Git to track coverage changes

## When to Update

Update this file when:
- Adding support for new geographic regions
- Improving accuracy of existing coverage areas
- Removing support for regions

After updating, you'll need to:
1. Commit the changes to Git
2. Upload manually to App Store Connect (or via API)
3. Submit app update if required

## Troubleshooting

### GeoJSON Not Accepted

**Problem:** Apple rejects your GeoJSON file.

**Solutions:**
- Ensure type is `MultiPolygon` (not `Polygon`)
- Check coordinate order: `[longitude, latitude]`
- Remove any extra properties
- Simplify polygons (< 20 points)
- Validate at [geojsonlint.com](https://geojsonlint.com)

### Coverage Area Not Showing

**Problem:** Coverage area doesn't appear in App Store Connect.

**Solutions:**
- File must be uploaded manually or via API
- Check file name is correct
- Verify JSON is valid
- Ensure you saved changes in App Store Connect

## Additional Resources

- [Apple Routing App Coverage Guide](https://developer.apple.com/documentation/appstoreconnectapi/routing-app-coverages)
- [GeoJSON Specification](https://geojson.org/)
- [geojson.io - Interactive Editor](https://geojson.io)
- [geojsonlint.com - Validator](https://geojsonlint.com)
- [Apple Connect Metadata Documentation](../../../../../docs/APPLE_CONNECT_METADATA.md)

## Related Files

- [Metadata Documentation](../../../../../docs/APPLE_CONNECT_METADATA.md)
- [Fastfile](../Fastfile)
- [Screenshots README](en-US/screenshots/README.md)
