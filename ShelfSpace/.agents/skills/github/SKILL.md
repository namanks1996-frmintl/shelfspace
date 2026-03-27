---
name: github
description: Use the GitHub MCP to interact with GitHub repositories — reading files, creating branches, pushing code, and managing pull requests.
---

# GitHub MCP Skill

## Overview
The GitHub MCP provides tools to interact directly with GitHub repositories: reading files, pushing code changes, creating branches, and forking repos.

## Available Tools
- `mcp_github_get_file_contents` – Read a file or directory from a GitHub repo
- `mcp_github_create_branch` – Create a new branch in a repo
- `mcp_github_create_or_update_file` – Create or update a single file (requires SHA when updating)
- `mcp_github_push_files` – Push multiple files in a single commit
- `mcp_github_fork_repository` – Fork a repo to your account
- `mcp_github_list_commits` – List commits on a branch
- `mcp_github_get_pull_request_files` – Get files changed in a PR
- `mcp_github_search_code` – Search for code across GitHub

## Common Patterns

### Read a file from a repo
```
mcp_github_get_file_contents(owner, repo, path, branch?)
```
- `branch` defaults to the repo's default branch if not specified

### Create a new branch
```
mcp_github_create_branch(owner, repo, branch, from_branch?)
```
- `from_branch` defaults to the repo's default branch

### Push multiple files (preferred for code changes)
```
mcp_github_push_files(owner, repo, branch, files, message)
```
- `files` is an array of `{ path, content }` objects
- Use this instead of repeated single-file updates

### Update an existing file
```
mcp_github_create_or_update_file(owner, repo, path, content, message, branch, sha?)
```
- **IMPORTANT**: When updating an existing file, you MUST provide the `sha` of the current file. Get it from `get_file_contents`.
- `content` must be the full file content (not a diff)

### Search code
```
mcp_github_search_code(q, page?, per_page?)
```
- Use GitHub search syntax: `q: "function foo repo:owner/repo language:typescript"`

## Workflow for Making Code Changes

1. **Read** the target file with `get_file_contents` to get current content + SHA
2. **Create a branch** if working on a feature
3. **Push changes** using `push_files` for multiple files or `create_or_update_file` for single files
4. Always include a meaningful commit `message`

## Tips
- Never guess the SHA — always read the file first before updating it
- Use `push_files` for atomic multi-file commits (cleaner history)
- Branch names should be descriptive: `feature/add-auth`, `fix/login-bug`
- `owner` and `repo` are separate parameters — do not combine them
