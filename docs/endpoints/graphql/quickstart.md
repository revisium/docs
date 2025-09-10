# Quick Start

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## First Steps

### 1. Explore Your Schema
Use GraphQL Playground's schema explorer to see all available types and queries generated from your JSON schemas.

### 2. Try Basic Queries
Start with simple list queries to understand the connection structure:

```graphql
query GetAllProducts {
  products {
    totalCount
    edges {
      node {
        id
        data {
          name
          price
        }
      }
    }
  }
}
```

### 3. Add Filtering
Experiment with filtering by your data fields:

```graphql
query GetFilteredProducts {
  products(data: {
    where: {
      data: { path: ["inStock"], equals: true }
    }
  }) {
    edges {
      node {
        data {
          name
          inStock
          price
        }
      }
    }
  }
}
```

### 4. Try Sorting
Sort by system fields or custom data fields:

```graphql
query GetSortedProducts {
  products(data: {
    orderBy: [
      { field: createdAt, direction: desc },
      { data: { path: "name", direction: "asc", type: "text" } }
    ]
  }) {
    edges {
      node {
        data {
          name
          price
        }
        createdAt
      }
    }
  }
}
```

### 5. Implement Pagination
Use cursor-based pagination for large datasets:

```graphql
query GetProductsPaginated($after: String) {
  products(data: {
    first: 20,
    after: $after
  }) {
    edges {
      node {
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
  }
}
```

## Next Steps

- [Revisions](./revisions) - Learn about draft vs head endpoints
- [Filtering](./queries/filtering) - Comprehensive filtering documentation
- [Sorting](./queries/sorting) - System and JSON path sorting
- [Relationships](./queries/relationships) - Foreign key relationships