---
sidebar_position: 4
---

# MCP (Model Context Protocol)

Revisium includes a built-in MCP server that allows AI assistants to interact with your data. This enables AI-driven content management, schema design, and data workflows.

## What is MCP?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that allows AI models to securely access external data sources and tools. Revisium implements an MCP server with Streamable HTTP transport.

## Setup

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="claude-code" label="Claude Code" default>

```bash
# Add local instance (Docker Compose on port 8080)
claude mcp add --transport http revisium-local http://localhost:8080/mcp

# Add cloud instance
claude mcp add --transport http revisium-cloud https://cloud.revisium.io/mcp

# Add standalone instance (default port 9222)
claude mcp add --transport http revisium-local http://localhost:9222/mcp
```

Manage servers:
```bash
claude mcp list
claude mcp remove revisium-local
```

</TabItem>
<TabItem value="claude-desktop" label="Claude Desktop">

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "revisium-local": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

</TabItem>
</Tabs>

### Auto-approve Tools

To auto-approve all Revisium MCP tools in Claude Code, add to `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": ["mcp__revisium-local"]
  }
}
```

## Available Tools

### Authentication
- `login` — authenticate with username/password
- `me` — get current user info

### Organization & Projects
- `getOrganization`, `getProjects`, `getProject`, `createProject`, `deleteProject`

### Branches & Revisions
- `getBranch`, `getDraftRevision`, `createBranch`, `revertChanges`
- `getRevision`, `commitRevision`

### Changes (Diff)
- `getRevisionChanges` — summary of all changes
- `getTableChanges` — changed tables with schema diffs
- `getRowChanges` — changed rows with field-level diffs

### Tables
- `getTables`, `getTable`, `getTableSchema`
- `createTable`, `updateTable`, `renameTable`, `removeTable`

### Rows
- `getRows`, `getRow`, `createRow`, `updateRow`, `patchRow`, `renameRow`, `removeRow`

### Users
- `getUser`, `searchUsers`

## Key Concepts

### Draft vs HEAD

- **Draft** (`draftRevisionId`) — mutable, where changes are made
- **HEAD** (`headRevisionId`) — latest committed, immutable

All modification tools require `draftRevisionId`. Read-only tools can use either.

:::danger
Never commit without explicit user permission. Draft and HEAD may point to different environments.
:::

### Foreign Key Order

When creating tables and rows with FK relationships:
1. Create referenced tables first
2. Create referenced rows first
3. Then create tables/rows that reference them

### Patching Rows

`patchRow` supports only the `replace` operation:

```json
{"op": "replace", "path": "title", "value": "New Title"}
{"op": "replace", "path": "metadata.description", "value": "..."}
{"op": "replace", "path": "items[0].name", "value": "Updated"}
```

Path uses field name without leading slash. Dot notation for nested, bracket notation for arrays.

### Updating Table Schema

Always call `getTableSchema` first, then use JSON Patch (RFC 6902):

```json
[
  {"op": "add", "path": "/properties/newField", "value": {"type": "string", "default": ""}},
  {"op": "add", "path": "/required/-", "value": "newField"}
]
```

## Resources

- `revisium://specs/schema` — table schema specification with examples and validation rules

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/mcp` | Send MCP requests |
| GET | `/mcp` | SSE stream for notifications |
| DELETE | `/mcp` | Terminate session |
