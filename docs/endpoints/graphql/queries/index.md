# GraphQL Queries

Complete guide to querying your dynamically generated GraphQL API with filtering, sorting, pagination, and relationships.

## Query Capabilities

Revisium Endpoint generates comprehensive GraphQL APIs from your JSON schemas with advanced querying capabilities:

- **Basic Queries** - Single entities and list queries
- **Complex Filtering** - AND/OR/NOT logic with JSON path support
- **Advanced Sorting** - System fields and custom JSON path ordering
- **Cursor Pagination** - Relay-specification compatible pagination
- **Relationships** - Foreign key resolution with nested querying

## Query Structure

All list queries follow a consistent structure:

```graphql
query ExampleQuery {
  users(data: {
    # Pagination
    first: 20
    after: "cursor"
    
    # Filtering
    where: {
      AND: [
        { data: { path: ["status"], equals: "active" } },
        { data: { path: ["verified"], equals: true } },
        { createdAt: { gte: "2025-01-01T00:00:00Z" } }
      ]
    }
    
    # Sorting
    orderBy: [
      { field: createdAt, direction: desc }
      { data: { path: "name", direction: "asc", type: "text" } }
    ]
  }) {
    edges {
      node {
        id
        data {
          name
          email
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

## Query Types

### Node vs Flat Queries

**Node Queries** (with metadata):
```graphql
query GetUsers {
  users(data: { first: 20 }) {
    edges {
      node {
        id                 # System metadata
        createdAt         # System metadata
        data {            # Your schema data
          name
          email
        }
        # Relationships
        profile {
          data {
            bio
            avatar
          }
        }
      }
    }
  }
}
```

**Flat Queries** (data only):
```graphql
query GetUsersFlat {
  usersFlat(data: { first: 20 }) {
    edges {
      node {
        name             # Direct access to schema fields
        email
      }
    }
  }
}
```

## Performance Considerations

- **Query Complexity**: Keep queries under complexity limit (1000)
- **Page Sizes**: Use reasonable page sizes (20-50 items)
- **Field Selection**: Only request needed fields
- **Relationship Depth**: Limit nested relationship queries

## Next Steps

- [Basic Queries](./basic) - Single entities and list queries
- [Filtering](./filtering) - Complex WHERE conditions
- [Sorting](./sorting) - System and custom field ordering
- [Pagination](./pagination) - Cursor-based pagination
- [Relationships](./relationships) - Foreign key relationships