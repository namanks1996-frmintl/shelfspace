---
name: notion
description: Use the Notion MCP to read pages, databases, search content, and update properties in a connected Notion workspace.
---

# Notion MCP Skill

## Overview
The Notion MCP allows reading and writing to a connected Notion workspace — searching pages, reading database contents, retrieving block children, and updating page properties.

## Available Tools
- `mcp_notion_API-post-search` – Search pages/databases by title
- `mcp_notion_API-retrieve-a-page` – Get a specific page and its properties
- `mcp_notion_API-retrieve-a-database` – Get a database schema and metadata
- `mcp_notion_API-get-block-children` – Get child blocks of a page or block
- `mcp_notion_API-retrieve-a-block` – Get a specific block by ID
- `mcp_notion_API-patch-page` – Update page properties, archive, add icon/cover

## ID Format
Notion IDs look like: `73b06a4c-5527-4b4f-87d3-56d174808e81`
They can be found in Notion URLs: `notion.so/<workspace>/<page-id>`

## Common Patterns

### Search for a page or database
```
mcp_notion_API-post-search(query, filter?)
```
- `filter.value` = `"page"` or `"data_source"` (database)
- `filter.property` = `"object"`
- Returns matching pages/databases with their IDs

### Read a database
```
mcp_notion_API-retrieve-a-database(database_id)
```
- Returns the schema — property names, types, options
- Does NOT return rows; use query endpoint for rows (not available directly, use search or blocks)

### Read page content
```
mcp_notion_API-get-block-children(block_id, page_size?)
```
- `block_id` is the page's ID (pages are also blocks)
- Returns the blocks on the page (paragraphs, headings, lists, etc.)
- Paginate with `start_cursor` if needed

### Update a page
```
mcp_notion_API-patch-page(page_id, properties?, icon?, cover?, archived?, in_trash?)
```
- `properties` is a map of property name → property value object
- `icon` takes `{ emoji: "📚" }` format
- `archived: true` to archive a page

## Property Value Formats
When updating properties, match the property type:
```json
// Title
"Name": { "title": [{ "text": { "content": "My Title" } }] }

// Rich text
"Description": { "rich_text": [{ "text": { "content": "Some text" } }] }

// Select
"Status": { "select": { "name": "Reading" } }

// Number
"Rating": { "number": 4.5 }

// Checkbox
"Finished": { "checkbox": true }

// Date
"Published": { "date": { "start": "2024-01-15" } }
```

## Tips
- Always search first to find the correct page/database ID
- Use `API-get-block-children` to read the actual content of pages
- `Notion-Version` defaults to `2025-09-03` — do not override unless needed
- Database rows are pages; their properties contain the cell values
