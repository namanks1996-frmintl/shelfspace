---
name: tavily
description: Use the Tavily MCP to search the web for current information and extract content from URLs, providing AI-optimized search results and page content.
---

# Tavily MCP Skill

## Overview
Tavily provides web search and URL content extraction optimized for AI use cases. Use it to find current information, news, and to read web page content.

## Available Tools
- `mcp_tavily_tavily_search` – Search the web and return AI-optimized results with snippets and URLs
- `mcp_tavily_tavily_extract` – Extract content from specific URLs in markdown or text format

## Common Patterns

### Web search
```
mcp_tavily_tavily_search(query, options?)
```
Key options:
- `search_depth`: `"basic"` (default), `"advanced"` (thorough), `"fast"`, `"ultra-fast"`
- `max_results`: 5–20 (default: 5)
- `time_range`: `"day"`, `"week"`, `"month"`, `"year"`
- `include_domains`: restrict to specific domains
- `exclude_domains`: exclude specific domains
- `country`: boost results from a country (full name, e.g. `"United States"`)
- `include_raw_content: true` to get full page content with results
- `include_images: true` to include related images

### Extract URL content
```
mcp_tavily_tavily_extract(urls[], options?)
```
Key options:
- `format`: `"markdown"` (default) or `"text"`
- `extract_depth`: `"basic"` (default) or `"advanced"` (for LinkedIn, tables, protected sites)
- `query`: optional query to rank content chunks by relevance
- `include_images: true` to include images from pages

## When to Use Each

| Use Case | Tool |
|----------|------|
| Finding current news/facts | `tavily_search` |
| Researching a topic | `tavily_search` with `search_depth: "advanced"` |
| Reading a specific web page | `tavily_extract` |
| Getting full article content | `tavily_extract` with the article URL |
| LinkedIn/protected sites | `tavily_extract` with `extract_depth: "advanced"` |
| Multiple URLs at once | `tavily_extract` with array of URLs |

## Tips
- Use `tavily_search` for general research before reaching for browser tools
- `"advanced"` search depth gives more thorough results but is slower
- `"fast"` and `"ultra-fast"` modes prioritize speed while maintaining relevance
- Pass multiple URLs to `tavily_extract` to batch-process content efficiently
- Use the `query` parameter in `tavily_extract` to get the most relevant content chunks
- This is ideal for reading docs, blog posts, news articles, and public pages without a browser
