---
sidebar_position: 2
---

# Sorting

Sort results by system fields, custom data fields, or aggregated array values.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
By default, all queries are sorted by `createdAt: desc` (newest first). Override with explicit `orderBy` parameters.
:::

## System Field Sorting

Sort by built-in fields available on all entities:

```graphql
query GetProductsSorted {
  products(data: {
    orderBy: [
      { field: createdAt, direction: desc }
      { field: id, direction: asc }
    ]
  }) {
    edges {
      node { id createdAt data { name price } }
    }
  }
}
```

Available system fields: `id`, `createdAt`, `updatedAt`, `publishedAt`

## JSON Path Sorting

Sort by any field in your data using dot notation with type casting:

```graphql
query GetProductsByPrice {
  products(data: {
    orderBy: [
      { data: { path: "price", direction: "desc", type: "float" } }
      { data: { path: "name", direction: "asc", type: "text" } }
    ]
  }) {
    edges {
      node { data { name price } }
    }
  }
}
```

### Type Casting

Proper type ensures correct sort order:

| Type | Usage |
|------|-------|
| `text` | Alphabetical (default) |
| `int` | Integer numbers |
| `float` | Decimal numbers |
| `boolean` | true/false |
| `timestamp` | Date/time values |

Without type casting, numbers sort lexicographically (`"9"` > `"10"`). Use `int` or `float` for numeric sorting.

### Nested Paths

Use dot notation for nested fields:

```graphql
{ data: { path: "specs.weight", direction: "asc", type: "float" } }
{ data: { path: "settings.ui.theme.color", direction: "desc", type: "text" } }
```

## Array Aggregation Sorting

Sort by aggregated values from array fields using `[*]` wildcard with an aggregation function:

<Tabs>
<TabItem value="min" label="min">

```graphql
query GetProductsByMinPrice {
  products(data: {
    orderBy: [
      { data: { path: "prices[*]", direction: "asc", type: "float", aggregation: min } }
    ]
  }) {
    edges { node { data { name prices } } }
  }
}
```

Sort by the lowest price in each product's price array.

</TabItem>
<TabItem value="max" label="max">

```graphql
{ data: { path: "ratings[*]", direction: "desc", type: "float", aggregation: max } }
```

Sort by the highest rating.

</TabItem>
<TabItem value="avg" label="avg">

```graphql
{ data: { path: "ratings[*]", direction: "desc", type: "float", aggregation: avg } }
```

Sort by average rating across all reviews.

</TabItem>
<TabItem value="first/last" label="first / last">

```graphql
{ data: { path: "tags[*]", direction: "asc", type: "text", aggregation: first } }
{ data: { path: "tags[*]", direction: "desc", type: "text", aggregation: last } }
```

Sort by the first or last element in an array.

</TabItem>
</Tabs>

## Mixed Sorting

Combine system fields and custom data fields in a single `orderBy`:

```graphql
query GetProductsAdvanced {
  products(data: {
    orderBy: [
      { data: { path: "featured", direction: "desc", type: "boolean" } }
      { data: { path: "price", direction: "asc", type: "float" } }
      { field: createdAt, direction: desc }
    ]
  }) {
    edges {
      node { data { name featured price } createdAt }
    }
  }
}
```
