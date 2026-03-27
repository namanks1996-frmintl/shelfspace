---
name: stitch
description: Use the Stitch MCP to generate, edit, and manage UI screen designs and design systems via Google Stitch.
---

# Stitch MCP Skill

## Overview
Stitch is a Google AI-powered UI design tool. The Stitch MCP allows you to create projects, generate screens from text prompts, edit existing screens, manage design systems, and generate design variants.

## Available Tools
- `mcp_StitchMCP_list_projects` – List all Stitch projects
- `mcp_StitchMCP_create_project` – Create a new project
- `mcp_StitchMCP_get_project` – Get project details (screens list, etc.)
- `mcp_StitchMCP_list_screens` – List all screens in a project
- `mcp_StitchMCP_get_screen` – Get details of a specific screen
- `mcp_StitchMCP_generate_screen_from_text` – Generate a UI screen from a text prompt
- `mcp_StitchMCP_edit_screens` – Edit existing screens with a prompt
- `mcp_StitchMCP_generate_variants` – Generate design variants of a screen
- `mcp_StitchMCP_list_design_systems` – List design systems for a project
- `mcp_StitchMCP_create_design_system` – Create a new design system
- `mcp_StitchMCP_update_design_system` – Update an existing design system
- `mcp_StitchMCP_apply_design_system` – Apply a design system to screens

## ID Formats
- **Project ID**: e.g. `4044680601076201931` (no `projects/` prefix in parameters)
- **Screen ID**: e.g. `98b50e2ddc9943efb387052637738f61` (no `screens/` prefix in parameters)
- **Asset ID**: e.g. `15996705518239280238` (no `assets/` prefix in parameters)

## Common Patterns

### Create a new project + generate a screen
```
1. mcp_StitchMCP_create_project(title)
2. mcp_StitchMCP_generate_screen_from_text(projectId, prompt, deviceType?)
```
- `deviceType`: `"MOBILE"`, `"DESKTOP"`, `"TABLET"`, or `"AGNOSTIC"`

### Edit an existing screen
```
mcp_StitchMCP_edit_screens(projectId, selectedScreenIds[], prompt, deviceType?)
```
- `selectedScreenIds` is an array of screen IDs

### Create and apply a design system
```
1. mcp_StitchMCP_create_design_system(designSystem, projectId?)
2. mcp_StitchMCP_update_design_system(name, projectId, designSystem)
   // Call update immediately after create to apply it
```

### Generate variants
```
mcp_StitchMCP_generate_variants(projectId, selectedScreenIds[], prompt, variantOptions)
```
- `variantOptions` includes: number of variants, creative range, focus aspects

## Design System Schema
```json
{
  "colorPalette": {
    "preset": "CUSTOM",
    "primaryColor": "#6366F1",
    "saturation": 0.8
  },
  "typography": {
    "fontFamily": "Inter"
  },
  "shape": {
    "cornerRoundness": "ROUNDED"
  },
  "appearance": {
    "mode": "DARK"
  },
  "designMd": "Use glassmorphism effects with subtle gradients..."
}
```

## Tips
- **Generation takes 1-2 minutes** — DO NOT RETRY if it appears slow
- Always call `update_design_system` immediately after `create_design_system`
- `output_components` in the generate response may contain suggestions — present them to the user
- Use `get_project` to find `selectedScreenInstances` needed for `apply_design_system`
- Strip resource prefixes (`projects/`, `screens/`, `assets/`) from IDs in tool parameters
