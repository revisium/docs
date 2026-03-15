---
sidebar_position: 1
---

# Filtering

Filter records by any field in your data using JSON path-based expressions. Combine multiple conditions with AND, OR, and NOT logic.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## JSON Path Filtering

Filter by any field using `path` to specify the location in your JSON data:

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
          price
        }
      }
    }
    totalCount
  }
}
```

Path examples:
- `["status"]` — top-level field
- `["specifications", "certified"]` — nested object field
- `["settings", "ui", "theme"]` — deeply nested

:::note
Filtering by objects inside arrays is not currently supported — you can filter by arrays themselves using `array_contains`.
:::

## String Operators

| Operator | Description |
|----------|-------------|
| `equals` | Exact match |
| `not` | Not equal |
| `in` | Value is one of the listed values |
| `notIn` | Value is not any of the listed values |
| `string_contains` | Substring match |
| `string_starts_with` | Prefix match |
| `string_ends_with` | Suffix match |
| `mode: insensitive` | Case-insensitive (combine with any string operator) |

```graphql
query StringFilterExamples {
  products(data: {
    where: {
      OR: [
        { data: { path: ["name"], string_contains: "wireless", mode: insensitive } },
        { data: { path: ["sku"], string_starts_with: "ELEC-" } },
        { data: { path: ["category"], in: ["electronics", "accessories"] } }
      ]
    }
  }) {
    edges { node { data { name sku category } } }
  }
}
```

## Numeric Operators

| Operator | Description |
|----------|-------------|
| `equals` | Equal to |
| `not` | Not equal to |
| `gt` | Greater than |
| `gte` | Greater than or equal |
| `lt` | Less than |
| `lte` | Less than or equal |
| `in` | Value is one of the listed values |

```graphql
query GetProductsByPrice {
  products(data: {
    where: {
      AND: [
        { data: { path: ["price"], gte: 50 } },
        { data: { path: ["price"], lt: 500 } },
        { data: { path: ["stock_quantity"], gt: 0 } }
      ]
    }
  }) {
    edges { node { data { name price stock_quantity } } }
  }
}
```

## Boolean Operators

```graphql
query GetActiveProducts {
  products(data: {
    where: {
      AND: [
        { data: { path: ["available"], equals: true } },
        { data: { path: ["recalled"], equals: false } }
      ]
    }
  }) {
    edges { node { data { name available } } }
  }
}
```

## Array Operators

| Operator | Description |
|----------|-------------|
| `array_contains` | Array includes the value |
| `array_starts_with` | First element matches |

```graphql
query GetProductsByFeatures {
  products(data: {
    where: {
      data: { path: ["features"], array_contains: "wireless" }
    }
  }) {
    edges { node { data { name features } } }
  }
}
```

## Logical Operators

Combine conditions with `AND`, `OR`, and `NOT`:

```graphql
query GetTargetedUsers {
  users(data: {
    where: {
      AND: [
        { data: { path: ["status"], equals: "active" } },
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
        {
          NOT: {
            data: { path: ["department"], in: ["temp", "contractor"] }
          }
        }
      ]
    }
  }) {
    edges { node { data { name role level department } } }
  }
}
```

## System Field Filtering

Filter by built-in system metadata:

| Field | Type | Example |
|-------|------|---------|
| `id` | String | `{ id: { startsWith: "user-" } }` |
| `createdAt` | DateTime | `{ createdAt: { gte: "2025-01-01T00:00:00Z" } }` |
| `updatedAt` | DateTime | `{ updatedAt: { gte: "2025-01-10T00:00:00Z" } }` |
| `readonly` | Boolean | `{ readonly: { equals: false } }` |

System field filters and JSON path filters can be combined in the same `AND`/`OR` clause:

```graphql
query GetRecentActiveUsers {
  users(data: {
    where: {
      AND: [
        { createdAt: { gte: "2025-01-01T00:00:00Z" } },
        { data: { path: ["status"], equals: "active" } }
      ]
    }
  }) {
    edges { node { id createdAt data { name status } } }
  }
}
```
