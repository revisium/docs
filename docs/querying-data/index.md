---
sidebar_position: 4
---

# Querying Data

Revisium auto-generates typed APIs from your schema with advanced querying capabilities. This section covers the query patterns available on generated GraphQL and REST endpoints.

## Query Types

### Single Entity

Retrieve a record by its unique `id`:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="graphql" label="GraphQL">

```graphql
query GetProduct($productId: String!) {
  product(id: $productId) {
    id
    createdAt
    data {
      name
      price
    }
  }
}
```

</TabItem>
<TabItem value="rest" label="REST">

```bash
# Relative to endpoint base URL
GET /tables/products/row/product-123
```

</TabItem>
</Tabs>

### List Query

Retrieve collections with pagination:

<Tabs>
<TabItem value="graphql" label="GraphQL">

```graphql
query GetProducts {
  products(data: { first: 20 }) {
    edges {
      node {
        id
        data {
          name
          price
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

</TabItem>
<TabItem value="rest" label="REST">

```bash
# Relative to endpoint base URL
POST /tables/products/rows
```

</TabItem>
</Tabs>

## Node vs Flat Types

GraphQL endpoints provide two type styles:

| Type | Usage | Example query |
|------|-------|---------------|
| **Node** | Full metadata (id, timestamps, data) | `product(id: "x") { id, createdAt, data { name } }` |
| **Flat** | Data fields only, no metadata | `productFlat(id: "x") { name }` |

- **Node types** — admin interfaces, audit trails, full entity management
- **Flat types** — public APIs, mobile apps, simplified data access

```graphql
# Flat type query — direct field access
query {
  productsFlat {
    edges {
      node {
        name
        price
      }
    }
  }
}
```

## Capabilities

| Feature | Description |
|---------|-------------|
| [Filtering](./filtering) | WHERE conditions with AND/OR/NOT logic, string/numeric/boolean/array operators |
| [Sorting](./sorting) | Order by system fields or custom data fields with type casting |
| [Pagination](./pagination) | Cursor-based (Relay-style) forward pagination |
| [Relationships](./relationships) | Auto-resolved FK fields in nested queries |
