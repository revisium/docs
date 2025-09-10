# Filtering & Where Conditions

Comprehensive filtering capabilities for all data types in your schemas using JSON path-based queries.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## JSON Path Filtering

Filter records by any field in your data using path-based expressions.

> **Note:** Currently, filtering by objects inside arrays is not supported - you can only filter by the arrays themselves using operators like `array_contains`.

<Tabs>
<TabItem value="query" label="GraphQL Query">

```graphql
query GetAvailableProducts {
  products(data: {
    where: {
      AND: [
        { data: { path: ["status"], equals: "available" } },
        { data: { path: ["specifications", "certified"], equals: true } },
        { data: { path: ["price"], gte: 50 } }
      ]
    }
  }) {
    edges {
      node {
        id
        data {
          name
          status
          specifications {
            certified
            weight
          }
          price
        }
      }
    }
    totalCount
  }
}
```

</TabItem>
<TabItem value="schema" label="Source JSON Schema">

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "status": {
      "type": "string"
    },
    "specifications": {
      "type": "object",
      "properties": {
        "certified": {
          "type": "boolean"
        },
        "weight": {
          "type": "number",
          "minimum": 0
        },
        "features": {
          "type": "object",
          "properties": {
            "waterproof": {
              "type": "boolean"
            },
            "wireless": {
              "type": "boolean"
            }
          }
        }
      }
    },
    "price": {
      "type": "number"
    }
  }
}
```

</TabItem>
<TabItem value="explanation" label="Path Explanation">

```typescript
// JSON path structure for filtering
{
  path: ["status"]                    // → data.status
  path: ["specifications", "certified"] // → data.specifications.certified  
  path: ["price"]                     // → data.price
  path: ["specifications", "features", "waterproof"] // → data.specifications.features.waterproof
}

// These paths correspond to your JSON schema structure
```

</TabItem>
</Tabs>

## String Filtering

Comprehensive string operations with case sensitivity control.

<Tabs>
<TabItem value="operations" label="All String Operations">

```graphql
query StringFilterExamples {
  products(data: {
    where: {
      OR: [
        # Exact match
        { data: { path: ["name"], equals: "Wireless Headphones" } },
        
        # Substring search (case-insensitive)
        { data: { path: ["name"], string_contains: "wireless", mode: insensitive } },
        
        # Prefix match
        { data: { path: ["sku"], string_starts_with: "ELEC-" } },
        
        # Suffix match  
        { data: { path: ["model"], string_ends_with: "-PRO" } },
        
        # Array membership
        { data: { path: ["category"], in: ["electronics", "accessories"] } },
        
        # Array exclusion
        { data: { path: ["status"], notIn: ["discontinued", "recalled"] } },
        
        # Negation
        { data: { path: ["brand"], not: "generic" } }
      ]
    }
  }) {
    edges {
      node {
        data {
          name
          sku
          model
          category
          status
          brand
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="case-sensitivity" label="Case Sensitivity">

```graphql
query CaseSensitiveFiltering {
  products(data: {
    where: {
      OR: [
        # Case-sensitive (default)
        { data: { path: ["name"], string_contains: "Pro" } },
        
        # Case-insensitive  
        { data: { path: ["name"], string_contains: "pro", mode: insensitive } }
      ]
    }
  }) {
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

**Results:**
- Case-sensitive: Matches "MacBook Pro", "Surface Pro" but not "macbook pro"
- Case-insensitive: Matches "MacBook Pro", "macbook pro", "MACBOOK PRO"

</TabItem>
</Tabs>

## Numeric Filtering

Filter by numeric values with range and comparison operators.

<Tabs>
<TabItem value="comparisons" label="Numeric Comparisons">

```graphql
query GetProductsByPrice {
  products(data: {
    where: {
      AND: [
        # Affordable range
        { data: { path: ["price"], gte: 50 } },
        
        # Premium range
        { data: { path: ["price"], lt: 500 } },
        
        # Specific ratings
        { data: { path: ["rating"], in: [4.5, 5.0] } },
        
        # In stock
        { data: { path: ["stock_quantity"], gt: 0 } }
      ]
    }
  }) {
    edges {
      node {
        data {
          name
          price
          rating
          stock_quantity
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="ranges" label="Range Filtering">

```graphql
query GetProductsByPriceRange {
  products(data: {
    where: {
      AND: [
        # Price range: $50 - $300
        { data: { path: ["price"], gte: 50.00 } },
        { data: { path: ["price"], lte: 300.00 } },
        
        # Discount range: 10% - 50%
        { data: { path: ["discount_percent"], gte: 10 } },
        { data: { path: ["discount_percent"], lte: 50 } }
      ]
    }
  }) {
    edges {
      node {
        data {
          name
          price
          discount_percent
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="schema" label="Numeric Schema Example">

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "price": {
      "type": "number",
      "minimum": 0
    },
    "discount_percent": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5
    },
    "stock_quantity": {
      "type": "number",
      "minimum": 0
    }
  }
}
```

</TabItem>
</Tabs>

## Boolean Filtering

Filter by boolean values with simple equality checks.

<Tabs>
<TabItem value="boolean-ops" label="Boolean Operations">

```graphql
query GetCertifiedAvailableProducts {
  products(data: {
    where: {
      AND: [
        # Is available
        { data: { path: ["available"], equals: true } },
        
        # Is certified
        { data: { path: ["specifications", "certified"], equals: true } },
        
        # Not recalled
        { data: { path: ["recalled"], equals: false } },
        
        # Has warranty
        { data: { path: ["warranty", "enabled"], not: false } }
      ]
    }
  }) {
    edges {
      node {
        data {
          name
          available
          specifications {
            certified
          }
          recalled
          warranty {
            enabled
          }
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="boolean-schema" label="Boolean Schema">

```json
{
  "type": "object", 
  "properties": {
    "active": {
      "type": "boolean",
      "default": true
    },
    "suspended": {
      "type": "boolean",
      "default": false
    },
    "profile": {
      "type": "object",
      "properties": {
        "verified": {
          "type": "boolean"
        }
      }
    },
    "preferences": {
      "type": "object",
      "properties": {
        "notifications": {
          "type": "boolean",
          "default": true
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Array Filtering

Filter by array contents using containment operators.

<Tabs>
<TabItem value="array-ops" label="Array Operations">

```graphql
query GetProductsByFeatures {
  products(data: {
    where: {
      AND: [
        # Has "wireless" feature
        { data: { path: ["features"], array_contains: "wireless" } },
        
        # Starts with specific categories
        { data: { path: ["categories"], array_starts_with: "electronics" } },
        
        # Has any of these colors
        { data: { path: ["colors"], array_contains: "black" } }
      ]
    }
  }) {
    edges {
      node {
        data {
          name
          features
          categories
          colors
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="array-schema" label="Array Schema">

```json
{
  "type": "object",
  "properties": {
    "features": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "categories": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "colors": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "certifications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "year": {"type": "number"}
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="complex-arrays" label="Complex Array Filtering">

```graphql
# Filter by nested array objects
query GetProductsByCertification {
  products(data: {
    where: {
      # Products with CE certification
      data: { 
        path: ["certifications"], 
        array_contains: {
          "name": "CE Certified"
        }
      }
    }
  }) {
    edges {
      node {
        data {
          name
          certifications
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Complex Logical Operators

Combine multiple conditions with AND, OR, and NOT logic.

<Tabs>
<TabItem value="complex-and-or" label="Complex AND/OR">

```graphql
query GetTargetedUsers {
  users(data: {
    where: {
      AND: [
        # Must be active
        { data: { path: ["status"], equals: "active" } },
        
        # Must be either admin OR (developer AND senior)
        {
          OR: [
            { data: { path: ["role"], equals: "admin" } },
            {
              AND: [
                { data: { path: ["role"], equals: "developer" } },
                { data: { path: ["level"], equals: "senior" } }
              ]
            }
          ]
        },
        
        # Must not be in these departments
        {
          NOT: {
            data: { path: ["department"], in: ["temp", "contractor"] }
          }
        }
      ]
    }
  }) {
    edges {
      node {
        data {
          name
          status
          role
          level
          department
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="nested-logic" label="Deeply Nested Logic">

```graphql
query GetAdvancedFiltered {
  users(data: {
    where: {
      OR: [
        # Premium users with special conditions
        {
          AND: [
            { data: { path: ["tier"], equals: "premium" } },
            {
              OR: [
                { data: { path: ["verified"], equals: true } },
                { data: { path: ["age"], gte: 21 } }
              ]
            }
          ]
        },
        
        # Staff users (different criteria)  
        {
          AND: [
            { data: { path: ["role"], in: ["admin", "moderator", "staff"] } },
            {
              NOT: {
                data: { path: ["status"], equals: "suspended" }
              }
            }
          ]
        }
      ]
    }
  }) {
    edges {
      node {
        data {
          name
          tier
          role
          status
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

## System Field Filtering

Filter by system metadata fields like creation dates and IDs.

<Tabs>
<TabItem value="system-fields" label="System Field Filtering">

```graphql
query GetRecentUsers {
  users(data: {
    where: {
      AND: [
        # Created in the last 30 days
        { createdAt: { gte: "2025-01-01T00:00:00Z" } },
        
        # Updated recently
        { updatedAt: { gte: "2025-01-10T00:00:00Z" } },
        
        # Not read-only
        { readonly: { equals: false } },
        
        # Specific ID patterns
        { id: { startsWith: "user-" } },
        
        # Exclude test users  
        { id: { notIn: ["user-test-1", "user-test-2"] } }
      ]
    }
  }) {
    edges {
      node {
        id
        createdAt
        updatedAt
        readonly
        data {
          name
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="date-ranges" label="Date Range Filtering">

```graphql
query GetUsersByDateRange {
  users(data: {
    where: {
      AND: [
        # Created between two dates
        { createdAt: { gte: "2024-01-01T00:00:00Z" } },
        { createdAt: { lte: "2024-12-31T23:59:59Z" } },
        
        # Published this year
        { publishedAt: { gte: "2025-01-01T00:00:00Z" } }
      ]
    }
  }) {
    edges {
      node {
        createdAt
        publishedAt
        data {
          name
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="system-types" label="Available System Fields">

```typescript
// System fields available for filtering
interface SystemFields {
  // String fields
  id: string;              // Unique identifier
  versionId: string;       // Version identifier  
  createdId: string;       // Creator user ID
  hash: string;            // Content hash
  schemaHash: string;      // Schema hash
  
  // Boolean fields
  readonly: boolean;       // Read-only flag
  
  // Date fields
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
  publishedAt: Date;       // Publication timestamp
  
  // JSON fields  
  data: object;            // Your schema data
  meta: object;            // Metadata
}
```

</TabItem>
</Tabs>

## Mixing JSON Path and System Field Filtering

Combine JSON path filters with system field filters for powerful queries:

```graphql
query GetRecentActiveUsers {
  users(data: {
    where: {
      AND: [
        # System field filters
        { createdAt: { gte: "2025-01-01T00:00:00Z" } },
        { updatedAt: { gte: "2025-01-10T00:00:00Z" } },
        
        # JSON path filters
        { data: { path: ["status"], equals: "active" } },
        { data: { path: ["verified"], equals: true } }
      ]
    }
  }) {
    edges {
      node {
        id
        createdAt
        updatedAt
        data {
          name
          status
          verified
        }
      }
    }
  }
}
```

This approach allows you to filter by both system metadata (like creation dates) and your custom data fields simultaneously.

## Next Steps

- [Sorting](./sorting) - Sort results by system and custom fields
- [Pagination](./pagination) - Handle large result sets efficiently  
- [Relationships](./relationships) - Filter related data through foreign keys