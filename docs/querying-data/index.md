---
sidebar_position: 4
---

# CRUD & Querying

This section covers CRUD and querying via [Generated APIs](../apis/generated-apis) — typed endpoints auto-generated from your table schemas.

| API | Endpoint | Best for |
|-----|----------|----------|
| **Generated GraphQL** | `/endpoint/graphql/.../head`, `/draft`, or specific revision | Frontend apps, typed queries |
| **Generated REST** | `/endpoint/rest/.../head`, `/draft`, or specific revision | Backend services, REST consumers, typed OpenAPI |

For full platform management (create/delete tables, rename, schema changes, search, commits), see [System API](../apis/system-api). For AI agents, see [MCP](../apis/mcp).

## Operations

### [CRUD](./crud)

Create, read, update, patch, and delete rows — single and bulk operations.

## Querying

| Feature | Description |
|---------|-------------|
| [Filtering](./filtering) | WHERE conditions — string, numeric, boolean, array, logical operators |
| [Sorting](./sorting) | Order by system or data fields with type casting |
| [Pagination](./pagination) | Cursor-based (Relay-style) forward pagination |
| [Relationships](./relationships) | Auto-resolved FK fields in GraphQL queries |
