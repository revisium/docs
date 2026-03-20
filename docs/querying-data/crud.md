---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# CRUD

Write operations (create, update, patch, delete) require Draft endpoints. Read operations work on any endpoint — HEAD, Draft, or specific revision. For table management (create/delete tables, rename, schema changes), see [System API](../apis/system-api).

<details>
<summary>All examples use this schema</summary>

Table `products`:
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "price": { "type": "number", "default": 0 },
    "inStock": { "type": "boolean", "default": false }
  },
  "required": ["title", "price", "inStock"],
  "additionalProperties": false
}
```

</details>

## Create Row

<Tabs>
<TabItem value="gen-graphql" label="Generated GraphQL" default>

```graphql
# Draft endpoint only
mutation {
  createProduct(data: {
    id: "iphone-16"
    data: { title: "iPhone 16 Pro", price: 999 }
  }) {
    id
    data { title price }
  }
}
```

</TabItem>
<TabItem value="gen-rest" label="Generated REST">

```bash
# Draft endpoint only
POST /endpoint/rest/<org>/<project>/<branch>/draft/tables/products/row/iphone-16
Content-Type: application/json

{ "data": { "title": "iPhone 16 Pro", "price": 999 } }
```

</TabItem>
</Tabs>

## Create Rows (Bulk)

Not yet available in Generated GraphQL.

<Tabs>
<TabItem value="gen-rest" label="Generated REST" default>

```bash
# Draft endpoint only
POST /endpoint/rest/<org>/<project>/<branch>/draft/tables/products/rows/bulk
Content-Type: application/json

{
  "rows": [
    { "rowId": "iphone-16", "data": { "title": "iPhone 16 Pro", "price": 999 } },
    { "rowId": "macbook-m4", "data": { "title": "MacBook M4", "price": 1999 } }
  ]
}
```

</TabItem>
</Tabs>

## Get Single Row

<Tabs>
<TabItem value="gen-graphql" label="Generated GraphQL" default>

```graphql
query {
  product(id: "iphone-16") {
    id
    createdAt
    data { title price }
  }
}
```

Flat variant (data fields only):

```graphql
query {
  productFlat(id: "iphone-16") {
    title
    price
  }
}
```

</TabItem>
<TabItem value="gen-rest" label="Generated REST">

```bash
GET /endpoint/rest/<org>/<project>/<branch>/head/tables/products/row/iphone-16
```

</TabItem>
</Tabs>

## List Rows

<Tabs>
<TabItem value="gen-graphql" label="Generated GraphQL" default>

```graphql
query {
  products(data: {
    first: 20
    where: { data: { path: ["price"], gte: 100 } }
    orderBy: [{ data: { path: "price", direction: "desc", type: "float" } }]
  }) {
    edges {
      node { id data { title price } }
      cursor
    }
    pageInfo { hasNextPage endCursor }
    totalCount
  }
}
```

Flat variant (data fields only, no metadata):

```graphql
query {
  productsFlat(data: { first: 20 }) {
    edges {
      node { title price inStock }
    }
    totalCount
  }
}
```

</TabItem>
<TabItem value="gen-rest" label="Generated REST">

```bash
POST /endpoint/rest/<org>/<project>/<branch>/head/tables/products/rows
Content-Type: application/json

{
  "first": 20,
  "where": { "data": { "path": ["price"], "gte": 100 } },
  "orderBy": [{ "data": { "path": "price", "direction": "desc", "type": "float" } }]
}
```

</TabItem>
</Tabs>

See [Filtering](./filtering), [Sorting](./sorting), and [Pagination](./pagination) for full query syntax.

## Update Row

Update replaces the entire row data. For partial updates, see [Patch Row](#patch-row).

<Tabs>
<TabItem value="gen-graphql" label="Generated GraphQL" default>

```graphql
# Draft endpoint only
mutation {
  updateProduct(data: {
    id: "iphone-16"
    data: { title: "iPhone 16 Pro Max", price: 1199 }
  }) {
    id
    data { title price }
  }
}
```

</TabItem>
<TabItem value="gen-rest" label="Generated REST">

```bash
# Draft endpoint only
PUT /endpoint/rest/<org>/<project>/<branch>/draft/tables/products/row/iphone-16
Content-Type: application/json

{ "data": { "title": "iPhone 16 Pro Max", "price": 1199 } }
```

</TabItem>
</Tabs>

## Update Rows (Bulk)

Not yet available in Generated GraphQL.

<Tabs>
<TabItem value="gen-rest" label="Generated REST" default>

```bash
# Draft endpoint only
PUT /endpoint/rest/<org>/<project>/<branch>/draft/tables/products/rows/bulk
Content-Type: application/json

{
  "rows": [
    { "rowId": "iphone-16", "data": { "title": "iPhone 16 Pro", "price": 1099 } },
    { "rowId": "macbook-m4", "data": { "title": "MacBook M4 Pro", "price": 2499 } }
  ]
}
```

</TabItem>
</Tabs>

## Patch Row

Partial update using JSON Patch. Only the `replace` operation is supported.

<Tabs>
<TabItem value="gen-rest" label="Generated REST" default>

```bash
# Draft endpoint only
PATCH /endpoint/rest/<org>/<project>/<branch>/draft/tables/products/row/iphone-16
Content-Type: application/json

{
  "patches": [
    { "op": "replace", "path": "price", "value": 1099 }
  ]
}
```

</TabItem>
</Tabs>

### Path Syntax

Path points to the field you want to change — **without** leading slash:

| Path | Target |
|------|--------|
| `"price"` | Top-level field |
| `"specs.weight"` | Nested object field |
| `"items[0].name"` | First array element's field |
| `"items[2].price"` | Third array element's field |

### Examples

```json
// Update a top-level field
{ "op": "replace", "path": "title", "value": "iPhone 16 Pro Max" }

// Update a nested field
{ "op": "replace", "path": "specs.weight", "value": 227 }

// Update a field inside an array item
{ "op": "replace", "path": "items[0].quantity", "value": 20 }

// Update multiple fields at once
[
  { "op": "replace", "path": "price", "value": 1099 },
  { "op": "replace", "path": "inStock", "value": true }
]
```

## Patch Rows (Bulk)

Not yet available in Generated GraphQL.

<Tabs>
<TabItem value="gen-rest" label="Generated REST" default>

```bash
# Draft endpoint only
PATCH /endpoint/rest/<org>/<project>/<branch>/draft/tables/products/rows/bulk
Content-Type: application/json

{
  "rows": [
    { "rowId": "iphone-16", "patches": [{ "op": "replace", "path": "price", "value": 1099 }] },
    { "rowId": "macbook-m4", "patches": [{ "op": "replace", "path": "price", "value": 2499 }] }
  ]
}
```

</TabItem>
</Tabs>

### Patch Limitations

- Only the `replace` operation is supported — no `add`, `remove`, or `move`
- Path uses dot notation and bracket notation, not JSON Pointer (`/`) syntax
- The field must exist in the schema

## Delete Row

<Tabs>
<TabItem value="gen-graphql" label="Generated GraphQL" default>

```graphql
# Draft endpoint only
mutation {
  deleteProduct(id: "iphone-16") {
    id
    success
  }
}
```

</TabItem>
<TabItem value="gen-rest" label="Generated REST">

```bash
# Draft endpoint only
DELETE /endpoint/rest/<org>/<project>/<branch>/draft/tables/products/row/iphone-16
```

</TabItem>
</Tabs>

:::note
Cannot delete a row that is referenced by foreign keys in other rows. Remove the FK references first.
:::

## Delete Rows (Bulk)

Not yet available in Generated GraphQL.

<Tabs>
<TabItem value="gen-rest" label="Generated REST" default>

```bash
# Draft endpoint only
DELETE /endpoint/rest/<org>/<project>/<branch>/draft/tables/products/rows/bulk
Content-Type: application/json

{ "rowIds": ["old-product-1", "old-product-2", "old-product-3"] }
```

</TabItem>
</Tabs>
