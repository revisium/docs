---
sidebar_position: 6
---

# APIs

Revisium provides two categories of APIs:

| Category | Purpose | Endpoint |
|----------|---------|----------|
| **System API** | Manage projects, branches, tables, rows, users | `/graphql` (GraphQL), `/api/*` (REST) |
| **Generated APIs** | Query and consume data via typed endpoints | `/endpoint/graphql/*`, `/endpoint/rest/*` |

Plus [MCP](./mcp) (Model Context Protocol) for AI agents.

## System API

Full CRUD for the platform — create/update/delete tables and rows, commit revisions, manage branches, upload files. Available as GraphQL (`POST /graphql`) and REST (`/api/*`).

Includes bulk operations: `createRows`, `updateRows`, `patchRows`, `deleteRows`.

See [System API](./system-api) for all operations with examples.

## Generated APIs

When you create an [endpoint](../admin-ui/endpoints-mcp), Revisium auto-generates typed APIs from your table schemas:

See [Generated APIs](./generated-apis) — typed GraphQL and REST with Relay pagination, FK resolution, OpenAPI/Swagger, and CRUD mutations on Draft endpoints.

Generated APIs support [filtering](../querying-data/filtering), [sorting](../querying-data/sorting), [pagination](../querying-data/pagination), and [relationship resolution](../querying-data/relationships).

## MCP

[MCP](./mcp) — Model Context Protocol for AI assistants (Claude Code, Claude Desktop, etc.). Full CRUD, schema design, commits.

## Configuration

Environment variables control type generation, naming, and performance. See [Configuration](./configuration).
