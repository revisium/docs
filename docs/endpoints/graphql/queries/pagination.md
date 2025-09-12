# Pagination

Efficient handling of large datasets using cursor-based pagination.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Forward Pagination

Revisium uses forward pagination with `first` and `after` parameters for reliable results.

<Tabs>
<TabItem value="basic" label="Basic Pagination">

```graphql
query GetProducts($first: Int, $after: String) {
  products(data: {
    first: $first,
    after: $after
  }) {
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

**Variables for first page:**
```json
{
  "first": 20,
  "after": null
}
```

**Variables for next page:**
```json
{
  "first": 20,
  "after": "eyJpZCI6InByb2R1Y3QtMTIzIn0="
}
```

</TabItem>
<TabItem value="response" label="Response Structure">

```json
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "product-123",
            "data": {
              "name": "Wireless Headphones",
              "price": 199.99
            }
          },
          "cursor": "eyJpZCI6InByb2R1Y3QtMTIzIn0="
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJpZCI6InByb2R1Y3QtNDU2In0="
      },
      "totalCount": 1543
    }
  }
}
```

</TabItem>
</Tabs>

## Pagination with Filtering and Sorting

Combine pagination with filtering and sorting for efficient data access.

<Tabs>
<TabItem value="filtered" label="With Filtering">

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
      node {
        data {
          name
          price
          inStock
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
<TabItem value="search" label="Search Results">

```graphql
query SearchProducts($searchTerm: String!, $after: String) {
  products(data: {
    first: 20,
    after: $after,
    where: {
      data: { 
        path: ["name"], 
        string_contains: $searchTerm, 
        mode: insensitive 
      }
    },
    orderBy: [{ field: updatedAt, direction: desc }]
  }) {
    edges {
      node {
        data {
          name
          price
        }
      }
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
</Tabs>

## Implementation Examples

<Tabs>
<TabItem value="react" label="React Hook">

```typescript
import { useState } from 'react';
import { useQuery } from '@apollo/client';

const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $after: String) {
    products(data: { first: $first, after: $after }) {
      edges {
        node {
          id
          data {
            name
            price
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

function ProductsList() {
  const [cursor, setCursor] = useState<string | null>(null);
  const { data, loading, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: { first: 20, after: cursor },
  });

  const loadMore = () => {
    if (data?.products?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: data.products.pageInfo.endCursor,
        },
      });
    }
  };

  return (
    <div>
      {data?.products?.edges?.map(({ node }) => (
        <div key={node.id}>
          {node.data.name} - ${node.data.price}
        </div>
      ))}
      
      {data?.products?.pageInfo?.hasNextPage && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
}
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
class PaginatedProducts {
  constructor(graphqlClient) {
    this.client = graphqlClient;
    this.products = [];
    this.hasNextPage = true;
    this.endCursor = null;
  }

  async loadProducts(pageSize = 20) {
    const query = `
      query GetProducts($first: Int!, $after: String) {
        products(data: { first: $first, after: $after }) {
          edges {
            node {
              id
              data {
                name
                price
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const response = await this.client.query({
      query,
      variables: {
        first: pageSize,
        after: this.endCursor,
      },
    });

    this.products.push(...response.data.products.edges.map(edge => edge.node));
    this.hasNextPage = response.data.products.pageInfo.hasNextPage;
    this.endCursor = response.data.products.pageInfo.endCursor;
    
    return {
      products: this.products,
      hasMore: this.hasNextPage,
    };
  }
}
```

</TabItem>
</Tabs>

## Best Practices

### Page Size
- **Mobile**: 10-20 items
- **Desktop**: 20-50 items  
- **Maximum**: 500 items

### Stable Sorting
Always include a unique field for consistent pagination:

```graphql
orderBy: [
  { field: createdAt, direction: desc },
  { field: id, direction: asc }  # Ensures stable ordering
]
```

### Field Selection
Only request needed fields:

```graphql
query GetProductsMinimal($after: String) {
  products(data: { first: 50, after: $after }) {
    edges {
      node {
        data {
          name  # Only essential fields
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Next Steps

- [Basic Queries](./basic) - Learn fundamental query patterns
- [Filtering](./filtering) - Add WHERE conditions to paginated queries
- [Sorting](./sorting) - Sort paginated results