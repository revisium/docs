---
sidebar_position: 2
---

# Generated GraphQL

When you create an endpoint, Revisium generates a typed GraphQL schema from your table schemas. HEAD endpoints update when a new revision is committed. Draft endpoints reflect uncommitted changes.

## Schema Pipeline

```
JSON Schema → Type Generator → GraphQL Schema → Apollo Server
```

Each table produces:
- **Entity type** — your data fields as GraphQL types
- **Node type** — entity + system metadata (id, timestamps)
- **Flat type** — entity fields directly (no wrapper)
- **Connection type** — Relay-style paginated list
- **Input types** — for filtering and sorting

## Generated Types

For a table `products` with fields `name` (string) and `price` (number):

```graphql
# Entity type
type ProjectProduct {
  name: String!
  price: Float!
  category: ProjectCategory  # Auto-resolved FK
}

# Node type (with metadata)
type ProjectProductNode {
  id: String!
  versionId: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  json: JSON!
  data: ProjectProduct!
}

# Flat type (data only)
type ProjectProductFlat {
  name: String!
  price: Float!
}

# Connection type (pagination)
type ProjectProductConnection {
  edges: [ProjectProductEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```

## Query Types

```graphql
type Query {
  # Single entity by ID
  product(id: String!): ProjectProductNode
  productFlat(id: String!): ProjectProductFlat

  # List with pagination, filtering, sorting
  products(data: ProjectProductInput): ProjectProductConnection
  productsFlat(data: ProjectProductInput): ProjectProductFlatConnection
}
```

## Naming Convention

Type names follow the pattern `{Project}{Table}`:
- Project `blog`, table `posts` → `BlogPost`, `BlogPostNode`, `BlogPostFlat`
- Nested objects: `BlogPostSpecifications`, `BlogPostSpecificationsFlat`

## Apollo Federation

Generated GraphQL schemas support Apollo Federation for use in a federated gateway. Configure via environment variables (see [Configuration](./configuration)).

## Querying

See [Querying Data](../querying-data/) for filtering, sorting, pagination, and relationship resolution.
