---
sidebar_position: 3
---

# Pagination

Revisium uses cursor-based (Relay-style) forward pagination with `first` and `after` parameters.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Basic Pagination

```graphql
query GetProducts($first: Int!, $after: String) {
  products(data: { first: $first, after: $after }) {
    edges {
      node {
        id
        data { name price }
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

**First page:** `{ "first": 20, "after": null }`
**Next page:** `{ "first": 20, "after": "eyJpZCI6InByb2R1Y3QtMTIzIn0=" }`

Use `pageInfo.endCursor` as the `after` value for the next page. Stop when `hasNextPage` is `false`.

## With Filtering and Sorting

Pagination works with all filtering and sorting options:

```graphql
query GetAvailableProducts($after: String) {
  products(data: {
    first: 20,
    after: $after,
    where: {
      data: { path: ["inStock"], equals: true }
    },
    orderBy: [{ field: createdAt, direction: desc }]
  }) {
    edges {
      node { data { name price } }
      cursor
    }
    pageInfo { hasNextPage endCursor }
    totalCount
  }
}
```

## Implementation Example

<Tabs>
<TabItem value="react" label="React">

```tsx
import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $after: String) {
    products(data: { first: $first, after: $after }) {
      edges {
        node { id data { name price } }
      }
      pageInfo { hasNextPage endCursor }
      totalCount
    }
  }
`;

function ProductsList() {
  const { data, loading, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { first: 20, after: null },
  });

  const loadMore = () => {
    if (data?.products?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { after: data.products.pageInfo.endCursor },
      });
    }
  };

  return (
    <div>
      {data?.products?.edges?.map(({ node }) => (
        <div key={node.id}>{node.data.name} — ${node.data.price}</div>
      ))}
      {data?.products?.pageInfo?.hasNextPage && (
        <button onClick={loadMore} disabled={loading}>Load More</button>
      )}
    </div>
  );
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
async function fetchAllProducts(client, pageSize = 20) {
  let allProducts = [];
  let cursor = null;
  let hasMore = true;

  while (hasMore) {
    const { data } = await client.query({
      query: GET_PRODUCTS,
      variables: { first: pageSize, after: cursor },
    });

    allProducts.push(...data.products.edges.map(e => e.node));
    hasMore = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}
```

</TabItem>
</Tabs>

## Best Practices

- **Page size:** 10-20 for mobile, 20-50 for desktop, max 500
- **Stable sorting:** Always include a unique field (like `id`) in `orderBy` for consistent pagination
- **Field selection:** Only request fields you need to reduce payload size

```graphql
orderBy: [
  { field: createdAt, direction: desc },
  { field: id, direction: asc }  # Ensures stable ordering
]
```
