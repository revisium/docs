# Sorting & Ordering

GraphQL endpoints support comprehensive sorting by both system fields and custom data fields from your schemas using JSON path-based ordering.

> **Note:** By default, all queries are sorted by `createdAt: desc` to show newest records first. You can override this with explicit `orderBy` parameters.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## System Field Sorting

Sort by built-in system fields that are automatically available for all entities.

<Tabs>
<TabItem value="query" label="GraphQL Query">

```graphql
query GetProductsSorted {
  products(
    data: {
      orderBy: [
        { field: createdAt, direction: desc }
        { field: id, direction: asc }
      ]
    }
  ) {
    edges {
      node {
        id
        createdAt
        updatedAt
        data {
          name
          price
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="fields" label="Available System Fields">

```graphql
enum OrderByInput {
  id # Unique identifier
  createdAt # Creation timestamp
  updatedAt # Last update timestamp
  publishedAt # Publication timestamp
}

enum SortOrder {
  asc # Ascending order
  desc # Descending order
}
```

</TabItem>
<TabItem value="multiple" label="Multiple Field Sorting">

```graphql
query GetProductsMultiSorted {
  products(
    data: {
      orderBy: [
        # Primary sort: newest first
        { field: createdAt, direction: desc }
        # Secondary sort: alphabetical by ID
        { field: id, direction: asc }
        # Tertiary sort: by update time
        { field: updatedAt, direction: desc }
      ]
    }
  ) {
    edges {
      node {
        id
        createdAt
        updatedAt
        data {
          name
          price
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

## JSON Path Sorting

Sort by any field from your JSON schema using path-based ordering with type casting.

<Tabs>
<TabItem value="query" label="GraphQL Query">

```graphql
query GetProductsByNameAndPrice {
  products(
    data: {
      orderBy: [
        { data: { path: "name", direction: "asc", type: "text" } }
        { data: { path: "price", direction: "desc", type: "float" } }
      ]
    }
  ) {
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

</TabItem>
<TabItem value="types" label="JSON Path Types">

```typescript
// Type casting for proper SQL ordering
type JsonValueType =
  | "text" // String values
  | "int" // Integer numbers
  | "float" // Floating point numbers
  | "boolean" // Boolean values
  | "timestamp"; // Date/timestamp values

interface JsonOrderInput {
  path: string; // JSON path
  direction?: "asc" | "desc"; // Sort direction (default: "asc")
  type?: JsonValueType; // SQL type casting (default: "text")
}
```

</TabItem>
</Tabs>

## Advanced JSON Path Examples

<Tabs>
<TabItem value="nested" label="Deep Nested Paths">

```graphql
# Sort by deeply nested object values
query GetUsersBySettingsTheme {
  users(
    data: {
      orderBy: [
        {
          data: {
            path: "settings.ui.theme.primaryColor"
            direction: "desc"
            type: "text"
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          settings {
            ui {
              theme {
                primaryColor
              }
            }
          }
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="mixed" label="Mixed System + Custom Sorting">

```graphql
# Combine system and custom field sorting
query GetProductsAdvanced {
  products(
    data: {
      orderBy: [
        # Featured products first (boolean)
        { data: { path: "featured", direction: "desc", type: "boolean" } }
        # Then by price (ascending, float)
        { data: { path: "price", direction: "asc", type: "float" } }
        # Then by rating (descending, float)
        { data: { path: "rating", direction: "desc", type: "float" } }
        # Finally by creation date (system field)
        { field: createdAt, direction: desc }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          featured
          price
          rating
        }
        createdAt
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Array Aggregation Sorting

Sort by aggregated values from array fields using bracket notation with aggregation functions.

```json
// Example data structure
{
  "name": "iPhone 15",
  "prices": [999.00, 1099.00, 1199.00],
  "ratings": [4.2, 4.8, 4.5, 4.9],
  "tags": ["electronics", "apple", "smartphone"]
}

{
  "name": "MacBook Pro",
  "prices": [1299.00, 1599.00, 2099.00],
  "ratings": [4.5, 4.9, 4.7],
  "tags": ["computer", "apple", "laptop"]
}
```

<Tabs>
<TabItem value="min" label="min">

```graphql
query GetProductsByMinPrice {
  products(
    data: {
      orderBy: [
        {
          data: {
            path: "prices[*]"
            direction: "asc"
            type: "float"
            aggregation: min # Sort by lowest price in array
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          prices
        }
      }
    }
  }
}
```

**Use case:** Sort products by their cheapest variant price.

</TabItem>
<TabItem value="max" label="max">

```graphql
query GetProductsByMaxPrice {
  products(
    data: {
      orderBy: [
        {
          data: {
            path: "ratings[*]"
            direction: "desc"
            type: "float"
            aggregation: max # Sort by highest rating in array
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          ratings
        }
      }
    }
  }
}
```

**Use case:** Sort products by their best rating.

</TabItem>
<TabItem value="avg" label="avg">

```graphql
query GetProductsByAvgRating {
  products(
    data: {
      orderBy: [
        {
          data: {
            path: "ratings[*]"
            direction: "desc"
            type: "float"
            aggregation: avg # Sort by average rating
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          ratings
        }
      }
    }
  }
}
```

**Use case:** Sort products by their average rating across all reviews.

</TabItem>
<TabItem value="first" label="first">

```graphql
query GetPostsByFirstTag {
  posts(
    data: {
      orderBy: [
        {
          data: {
            path: "tags[*]"
            direction: "asc"
            type: "float"
            aggregation: first # Sort by first element in array
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          title
          tags
        }
      }
    }
  }
}
```

**Use case:** Sort posts alphabetically by their first tag.

</TabItem>
<TabItem value="last" label="last">

```graphql
query GetPostsByLastTag {
  posts(
    data: {
      orderBy: [
        {
          data: {
            path: "tags[*]"
            direction: "desc"
            type: "float"
            aggregation: last # Sort by last element in array
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          title
          tags
        }
      }
    }
  }
}
```

**Use case:** Sort posts by their last tag in reverse order.

</TabItem>
</Tabs>

## JSON Path Formats

Use dot notation to specify paths to your data fields.

```graphql
# Simple field
{
  data: {
    path: "name"                    # → data.name
    direction: "asc"
    type: "text"
  }
}

# Nested object field
{
  data: {
    path: "profile.age"             # → data.profile.age
    direction: "desc"
    type: "int"
  }
}

# Deep nested field
{
  data: {
    path: "settings.theme.color"    # → data.settings.theme.color
    direction: "asc"
    type: "text"
  }
}

# Array element by index
{
  data: {
    path: "tags[0]"                 # → data.tags[0] (first element)
    direction: "asc"
    type: "text"
  }
}

# All array elements (flattened)
{
  data: {
    path: "tags[*]"                 # → all elements in data.tags
    direction: "asc"
    type: "text"
  }
}
```

## Type-Specific Sorting

Proper type casting ensures correct sort order for different data types.

<Tabs>
<TabItem value="text-sort" label="Text Sorting">

```graphql
# Text sorting (alphabetical)
query GetProductsByName {
  products(
    data: {
      orderBy: [
        {
          data: {
            path: "name"
            direction: "asc"
            type: "text" # Alphabetical sort: A-Z
          }
        }
      ]
    }
  ) {
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

**Result order:** "Bluetooth Speaker", "Headphones", "Smartphone", "Tablet"

</TabItem>
<TabItem value="numeric-sort" label="Numeric Sorting">

```graphql
# Numeric sorting (mathematical order)
query GetProductsByPrice {
  products(
    data: {
      orderBy: [
        {
          data: {
            path: "price"
            direction: "desc"
            type: "float" # Numeric sort: 299.99, 199.99, 99.99, 49.99
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          price
        }
      }
    }
  }
}
```

**Without type casting:** "199.99", "299.99", "49.99", "99.99" (string sort)  
**With type casting:** 299.99, 199.99, 99.99, 49.99 (numeric sort)

</TabItem>
<TabItem value="date-sort" label="Date Sorting">

```graphql
# Date sorting (chronological order)
query GetProductsByLastUpdated {
  products(
    data: {
      orderBy: [
        {
          data: {
            path: "lastUpdated"
            direction: "desc"
            type: "timestamp" # Most recent first
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          lastUpdated
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="boolean-sort" label="Boolean Sorting">

```graphql
# Boolean sorting (true values first)
query GetProductsByAvailability {
  products(
    data: {
      orderBy: [
        {
          data: {
            path: "inStock"
            direction: "desc"
            type: "boolean" # true values first, then false
          }
        }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          inStock
        }
      }
    }
  }
}
```

**Result order:** inStock: true products first, then inStock: false products

</TabItem>
</Tabs>

## Complex Sorting Scenarios

Real-world examples combining multiple sorting criteria.

<Tabs>
<TabItem value="ecommerce" label="E-commerce Product Sorting">

```graphql
query GetProductsOptimized {
  products(
    data: {
      orderBy: [
        # 1. Featured products first
        { data: { path: "featured", direction: "desc", type: "boolean" } }
        # 2. In-stock products next
        { data: { path: "inStock", direction: "desc", type: "boolean" } }
        # 3. Highest rated products
        { data: { path: "rating", direction: "desc", type: "float" } }
        # 4. Lowest price within same rating
        { data: { path: "price", direction: "asc", type: "float" } }
        # 5. Newest products last
        { field: createdAt, direction: desc }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          featured
          inStock
          rating
          price
        }
        createdAt
      }
    }
  }
}
```

</TabItem>
<TabItem value="user-management" label="User Management Sorting">

```graphql
query GetUsersForAdmin {
  users(
    data: {
      orderBy: [
        # 1. Admins first
        { data: { path: "role", direction: "asc", type: "text" } }
        # 2. Most recently active
        { data: { path: "lastActive", direction: "desc", type: "timestamp" } }
        # 3. Alphabetical by name
        { data: { path: "name", direction: "asc", type: "text" } }
        # 4. Creation date as tiebreaker
        { field: createdAt, direction: asc }
      ]
    }
  ) {
    edges {
      node {
        data {
          name
          role
          lastActive
        }
        createdAt
      }
    }
  }
}
```

</TabItem>
<TabItem value="content" label="Content Management Sorting">

```graphql
query GetContentOptimized {
  posts(
    data: {
      orderBy: [
        # 1. Published content first
        {
          data: {
            path: "status"
            direction: "desc"
            type: "text" # "published" comes before "draft"
          }
        }
        # 2. Priority order
        { data: { path: "priority", direction: "desc", type: "int" } }
        # 3. Most viewed content
        { data: { path: "stats.views", direction: "desc", type: "int" } }
        # 4. Recent updates first
        { field: updatedAt, direction: desc }
      ]
    }
  ) {
    edges {
      node {
        data {
          title
          status
          priority
          stats {
            views
          }
        }
        updatedAt
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Next Steps

- [Pagination](./pagination) - Combine sorting with cursor-based pagination
- [Filtering](./filtering) - Add WHERE conditions to sorted queries
- [Relationships](./relationships) - Sort related data through foreign keys
