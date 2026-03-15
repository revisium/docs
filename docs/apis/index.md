---
sidebar_position: 6
---

# APIs

Revisium provides two categories of APIs:

| Category | Purpose | Authentication |
|----------|---------|----------------|
| **System API** | Manage projects, branches, tables, rows, users | JWT / OAuth 2.1 |
| **Generated APIs** | Query and consume data via typed endpoints | Optional (per endpoint) |

## System API

The System API is used for administration — creating projects, designing schemas, managing branches and revisions, CRUD on rows. Available as GraphQL, REST, and MCP.

See [System API](./system-api) for details.

## Generated APIs

When you create an [endpoint](../admin-ui/endpoints-mcp), Revisium auto-generates typed GraphQL and REST APIs from your table schemas. These APIs provide:

- Typed queries matching your schema structure
- [Filtering](../querying-data/filtering), [sorting](../querying-data/sorting), [pagination](../querying-data/pagination)
- [Foreign key resolution](../querying-data/relationships)
- Node and Flat type variants

| Protocol | Description |
|----------|-------------|
| [Generated GraphQL](./generated-graphql) | Typed schema with Relay pagination, Apollo Federation support |
| [Generated REST](./generated-rest) | OpenAPI/Swagger CRUD endpoints |
| [MCP](./mcp) | Model Context Protocol for AI assistants |

## Configuration

Environment variables control type generation, naming, and performance. See [Configuration](./configuration).
