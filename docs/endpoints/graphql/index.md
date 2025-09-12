# GraphQL API

Revisium Endpoint automatically generates full-featured GraphQL APIs from your JSON schemas stored in Revisium Core. The service acts as an intelligent proxy that fetches schema definitions and data through Core's REST API.

## How It Works

### Schema-to-GraphQL Pipeline

1. **Schema Fetch**: Endpoint service retrieves JSON schemas from Core API
2. **Type Generation**: JSON schemas are converted to GraphQL types (Node, Flat, Connection, Edge)
3. **Query Generation**: Automatic generation of single/list queries with filtering and pagination
4. **Data Proxying**: GraphQL resolvers proxy requests to Core API endpoints
5. **Response Transformation**: Core API responses are transformed to match GraphQL schema

### Dynamic Schema Generation

The GraphQL schema is dynamically generated based on your JSON schema definitions, providing a complete API that updates automatically when your schemas change.

### Generated Schema Structure

From each JSON schema table, the system generates:

- **Entity Types**: Core data structure
- **Node Types**: Full entity with metadata (createdAt, id, etc.)
- **Flat Types**: Simplified data-only representation
- **Connection Types**: Relay-style pagination
- **Filter Types**: Comprehensive WHERE clause support
- **OrderBy Types**: Sorting by system and custom fields

## Key Features

### Automatic Type Generation

- **JSON Schema → GraphQL**: Seamless conversion with type validation
- **Relationship Mapping**: Foreign keys become GraphQL relationships
- **System Metadata**: Automatic inclusion of creation dates, IDs, versions

### Advanced Querying

- **Complex Filtering**: AND/OR/NOT logic with nested conditions
- **JSON Path Queries**: Filter and sort by any field in your data
- **Cursor Pagination**: Relay-specification compatible pagination

### Developer Experience

- **Live Schema Updates**: Changes in Core immediately reflected in draft endpoints
- **GraphQL Playground**: Interactive query explorer and documentation
- **Type Safety**: Generated TypeScript definitions for client applications
- **Introspection**: Full schema introspection support

## Current Limitations

- **Mutations**: Currently read-only, mutations coming soon

## Quick Examples

### Basic Query

```graphql
query GetProducts {
  products {
    edges {
      node {
        id
        data {
          name
          price
        }
        createdAt
      }
    }
    totalCount
  }
}
```

### Advanced Filtering

```graphql
query GetAvailableFeaturedProducts {
  products(
    data: {
      where: {
        AND: [
          { data: { path: ["category"], equals: "electronics" } }
          { data: { path: ["status"], equals: "available" } }
        ]
      }
      orderBy: [{ field: createdAt, direction: desc }]
    }
  ) {
    edges {
      node {
        data {
          name
          category
          status
          price
        }
      }
    }
  }
}
```

### JSON Path Sorting

```graphql
query GetProductsByName {
  products(
    data: {
      orderBy: [
        {
          data: { path: "specifications.brand", direction: "asc", type: "text" }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          specifications {
            brand
          }
          name
          price
        }
      }
    }
  }
}
```

## Next Steps

- [Quick Start](./quickstart) - Get started with your first GraphQL endpoint
- [Revisions](./revisions) - Understanding revision lifecycle and auto-updates
- [Queries](./queries/) - Comprehensive query documentation
- [Types](./types/) - Generated type system reference
- [Configuration](./configuration) - GraphQL-specific configuration options
