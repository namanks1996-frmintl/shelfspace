---
name: figma
description: Use the Figma MCP to read Figma design files, extract design tokens, download assets, and implement pixel-perfect UI from Figma specs.
---

# Figma MCP Skill

## Overview
The Figma MCP provides access to Figma design files, allowing you to read design data, extract layout/style information, and download image assets.

## Available Tools
- `mcp_figma_get_figma_data` – Fetch comprehensive Figma file data including layout, content, visuals, and component info.
- `mcp_figma_download_figma_images` – Download SVG/PNG images from Figma nodes to a local path.

## How to Get the File Key
The **fileKey** is found in the Figma URL:
```
https://www.figma.com/file/<fileKey>/...
https://www.figma.com/design/<fileKey>/...
```

## How to Get a Node ID
The **nodeId** is found as a URL parameter: `?node-id=1234:5678`
Always use format `1234:5678` (colon-separated), not `1234-5678`.

## Workflow

### 1. Fetch Design Data
```
mcp_figma_get_figma_data(fileKey, nodeId?)
```
- Start with the top-level file to understand the structure
- Use `nodeId` to drill into specific frames or components
- Use `depth` only when explicitly needed

### 2. Understand the Layout
- Parse the returned JSON for `absoluteBoundingBox`, `fills`, `strokes`, `effects`, `typography`
- Note padding, gap, and alignment values from `paddingLeft`, `paddingRight`, `paddingTop`, `paddingBottom`, `itemSpacing`
- Check `cornerRadius` for border radius values

### 3. Download Assets
```
mcp_figma_download_figma_images(fileKey, nodes, localPath)
```
- Use `imageRef` for raster images (photos, backgrounds)
- Use no imageRef for vector SVG exports
- Use `gifRef` for animated GIFs
- Set `pngScale: 2` (default) for retina-quality PNGs
- Save to `public/images` or `assets/icons` relative to project root

### 4. Implement the UI
- Translate Figma measurements (px) directly to CSS pixels
- Use `font-family`, `font-size`, `font-weight`, `line-height` from typography nodes
- Map Figma color fills (RGBA 0-1 range) to CSS `rgba()` (multiply by 255)
- Use `box-shadow` for Figma `effects` of type `DROP_SHADOW`

## Color Conversion
Figma uses 0–1 range for RGBA. Convert to CSS:
```
r: 0.2 → rgba(51, ...) // 0.2 * 255 ≈ 51
```

## Tips
- Always check `constraints` for responsive behavior hints
- `AUTO` layout mode in Figma = CSS Flexbox
- `GRID` layout mode in Figma = CSS Grid
- Figma components with `variants` map to component props/states
- When a nodeId is provided in a URL, always pass it to `get_figma_data`
