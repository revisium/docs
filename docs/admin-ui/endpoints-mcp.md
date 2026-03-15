---
sidebar_position: 7
---

import Screenshot from '@site/src/components/Screenshot';

# Endpoints & MCP

## API Endpoints

Create auto-generated GraphQL and REST endpoints bound to specific revisions.

<Screenshot alt="Endpoints page — list of GraphQL and REST endpoints with bound revision info" />

### Creating an Endpoint

1. Go to **Endpoints** in the sidebar
2. Click **New Endpoint**
3. Select the revision to bind:
   - **HEAD** — always serves the latest committed data
   - **Draft** — serves the current working state (preview)
   - **Specific revision** — pinned to a point in time

<Screenshot alt="New Endpoint dialog — selecting revision to bind (HEAD, Draft, or specific)" />

### Endpoint Types

Each endpoint provides both GraphQL and REST APIs auto-generated from the table schemas at the bound revision:

- **GraphQL** — typed queries with filtering, sorting, pagination, and relationship resolution
- **REST** — OpenAPI/Swagger-compatible CRUD endpoints

### Managing Endpoints

- View all endpoints and their bound revisions
- Delete endpoints you no longer need
- Multiple endpoints can be bound to different revisions (e.g., one for production HEAD, one for staging draft)

## MCP Server

Revisium includes a built-in [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that allows AI assistants to interact with your data.

### Configuration

See [MCP](../apis/mcp) in the APIs section for setup instructions with Claude Code, Claude Desktop, and other MCP clients.
