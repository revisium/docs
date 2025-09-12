# Basic Queries

Learn the fundamentals of querying your dynamically generated GraphQL API.

## Single Entity Queries

Retrieve individual records by their unique ID.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="query" label="GraphQL Query">

```graphql
query GetProduct($productId: String!) {
  product(id: $productId) {
    id
    createdAt
    updatedAt
    data {
      name
      description
      specifications {
        weight
        dimensions
      }
      price
    }
  }
}
```

**Variables:**

```json
{
  "productId": "product-123"
}
```

</TabItem>
<TabItem value="schema" label="Source JSON Schema">

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Product name"
    },
    "description": {
      "type": "string"
    },
    "specifications": {
      "type": "object",
      "properties": {
        "weight": {
          "type": "number"
        },
        "dimensions": {
          "type": "string"
        }
      }
    },
    "price": {
      "type": "number"
    }
  },
  "required": ["name", "price"]
}
```

</TabItem>
<TabItem value="response" label="Response">

```json
{
  "data": {
    "product": {
      "id": "product-123",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T14:20:00Z",
      "data": {
        "name": "Wireless Headphones",
        "description": "High-quality noise-canceling wireless headphones",
        "specifications": {
          "weight": 250,
          "dimensions": "20cm x 15cm x 8cm"
        },
        "price": 199.99
      }
    }
  }
}
```

</TabItem>
</Tabs>

## List Queries

Retrieve collections of records with pagination support.

<Tabs>
<TabItem value="query" label="GraphQL Query">

```graphql
query GetProducts {
  products {
    edges {
      node {
        id
        data {
          name
          description
          specifications {
            weight
          }
          price
        }
        createdAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
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
              "description": "High-quality noise-canceling wireless headphones",
              "specifications": {
                "weight": 250
              },
              "price": 199.99
            },
            "createdAt": "2025-01-15T10:30:00Z"
          },
          "cursor": "eyJpZCI6InByb2R1Y3QtMTIzIn0="
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "eyJpZCI6InByb2R1Y3QtMTIzIn0=",
        "endCursor": "eyJpZCI6InByb2R1Y3QtNDU2In0="
      },
      "totalCount": 156
    }
  }
}
```

</TabItem>
</Tabs>

## Node vs Flat Types

Choose between full metadata access or simplified data-only queries.

<Tabs>
<TabItem value="comparison" label="Type Comparison">

```graphql
# Node type (with metadata)
type ProjectProductNode {
  id: String! # ← System metadata
  versionId: String! # ← System metadata
  createdId: String! # ← System metadata
  createdAt: DateTime! # ← System metadata
  updatedAt: DateTime! # ← System metadata
  publishedAt: DateTime! # ← System metadata
  json: JSON! # ← System metadata (complete data as JSON)
  data: ProjectProduct! # ← Your data
}

# Flat type (data only)
type ProjectProductFlat {
  name: String! # ← Direct field access
  description: String! # ← Direct field access
  specifications: ProjectProductSpecificationsFlat
  price: Float!
}
```

**When to use:**

- **Node types**: Admin interfaces, audit trails, full entity management
- **Flat types**: Public APIs, mobile apps, simplified data access

</TabItem>
<TabItem value="node-query" label="Node Query Example">

```graphql
query GetProduct($productId: String!) {
    product(id: $productId) {
    id
    createdAt
    updatedAt
    data {
      name
      email
      specifications {
        weight
        dimensions
      }
      price
    }
  }
}
```

</TabItem>
<TabItem value="flat-query" label="Flat Query Example">

```graphql
query GetProductFlat($productId: String!) {
  productFlat(id: $productId) {
    name
    description
    specifications {
      weight
      dimensions
    }
    price
  }
}
```

</TabItem>
</Tabs>

## Flat Type Queries

Use flat types for simplified data access without metadata fields.

<Tabs>
<TabItem value="single" label="Single Flat Query">

```graphql
query GetProductFlat($productId: String!) {
  productFlat(id: $productId) {
    name
    description
    specifications {
      weight
      dimensions
    }
    price
  }
}
```

</TabItem>
<TabItem value="list" label="List Flat Query">

```graphql
query GetProductsFlat {
  productsFlat {
    edges {
      node {
        name
        description
        specifications {
          weight
        }
        price
      }
    }
    totalCount
  }
}
```

</TabItem>
</Tabs>

## System Field: `json`

The `json` field in node queries provides convenient access to complete record data as JSON, useful for debugging and flexible data access.

<Tabs>
<TabItem value="json-field" label="Using json Field">

```graphql
query GetProductWithJson($productId: String!) {
  product(id: $productId) {
    id
    createdAt
    json # ← Complete data as JSON
    data {
      name # ← Structured data access
    }
  }
}
```

**Response:**

```json
{
  "product": {
    "id": "product-123",
    "createdAt": "2025-01-15T10:30:00Z",
    "json": {
      "name": "Wireless Headphones",
      "description": "High-quality noise-canceling wireless headphones",
      "price": 199.99,
      "inStock": true
    },
    "data": {
      "name": "Wireless Headphones"
    }
  }
}
```

</TabItem>
<TabItem value="json-use-cases" label="Use Cases">

**When to use `json` field:**

- **Debugging**: See complete record data structure
- **Dynamic UIs**: Build forms from complete data without knowing schema
- **Data inspection**: Understand what fields are available
- **Logging**: Capture complete record state for audit trails

**Performance note:**
The `json` field returns the same data as the `data` object, just in raw JSON format. Use `data` for structured access in production applications.

</TabItem>
</Tabs>

## Field Selection

Request only the fields you need to optimize performance.

<Tabs>
<TabItem value="minimal" label="Minimal Fields">

```graphql
query GetProductsMinimal {
  products {
    edges {
      node {
        data {
          name # Only fetch name
        }
      }
    }
    totalCount
  }
}
```

</TabItem>
<TabItem value="specific" label="Specific Nested Fields">

```graphql
query GetProductSpecifications {
  products {
    edges {
      node {
        data {
          name
          specifications {
            weight # Only weight from specifications
            # dimensions field not requested
          }
          # description field not requested
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="system" label="System Fields Only">

```graphql
query GetProductTimestamps {
  products {
    edges {
      node {
        id
        createdAt
        updatedAt
        # No data field requested
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Performance Tips

### 1. Request Specific Fields

Only request the fields you actually need:

```graphql
# ❌ Don't fetch all fields if you don't need them
query GetProductsInefficient {
  products {
    edges {
      node {
        id
        createdAt
        updatedAt
        publishedAt
        versionId
        json
        data {
          name
          description
          specifications {
            weight
            dimensions
            material
          }
          features {
            wireless
            waterproof
            batteryLife
          }
        }
      }
    }
  }
}

# ✅ Fetch only what you need
query GetProductsEfficient {
  products {
    edges {
      node {
        data {
          name
          price
        }
      }
    }
    totalCount
  }
}
```

### 2. Use Flat Types When Possible

If you don't need system metadata, use flat types:

```graphql
# ✅ More efficient for simple data access
query GetProductsFlat {
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

### 3. Limit Result Sets

Always use pagination parameters:

```graphql
# ✅ Limit results to reasonable amounts
query GetProductsLimited {
  products(data: { first: 20 }) {
    edges {
      node {
        data {
          name
        }
      }
    }
  }
}
```

## Next Steps

- [Filtering](./filtering) - Learn to filter records with complex conditions
- [Sorting](./sorting) - Sort by system and custom fields
- [Pagination](./pagination) - Implement cursor-based pagination
- [Relationships](./relationships) - Query related data through foreign keys
