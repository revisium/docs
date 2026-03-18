---
sidebar_position: 3
---

import Screenshot from '@site/src/components/Screenshot';
import { ScreenshotRow } from '@site/src/components/Screenshot';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Foreign Keys

Foreign keys create relationships between tables with referential integrity. A foreign key field stores a `rowId` referencing a row in another table. The platform validates every write — you can't reference a row that doesn't exist.

## Single FK (Many-to-One)

The most common pattern — a field references one row in another table. Example: each product belongs to one category.

<Tabs>
<TabItem value="data" label="Data" default>

Table `categories` — row id: `"electronics"`
```json
{ "name": "Electronics" }
```

Table `products` — row id: `"iphone-16"`
```json
{
  "title": "iPhone 16 Pro",
  "price": 999,
  "category": "electronics"
}
```

`category` contains the `rowId` of a row in the `categories` table.

</TabItem>
<TabItem value="schema" label="Schema">

Table `categories`
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "default": "" }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

Table `products`
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "price": { "type": "number", "default": 0 },
    "category": {
      "type": "string",
      "default": "",
      "foreignKey": "categories"
    }
  },
  "required": ["title", "price", "category"],
  "additionalProperties": false
}
```

</TabItem>
</Tabs>

<Screenshot alt="Schema Editor — foreign key field category pointing to categories table" src="/img/screenshots/fk-schema-editor.png" />

<Screenshot alt="Row Editor — selecting a category from the referenced table with search" src="/img/screenshots/fk-row-editor.png" />

## FK Array (One-to-Many)

An array of FK strings — one row references multiple rows in another table. Example: a product has multiple tags.

<Tabs>
<TabItem value="data" label="Data" default>

Table `tags` — rows: `"5g"`, `"usb-c"`, `"promotion"`
```json
{ "name": "5G" }
```

Table `products` — row id: `"iphone-16"`
```json
{
  "title": "iPhone 16 Pro",
  "tags": ["5g", "usb-c", "promotion"]
}
```

</TabItem>
<TabItem value="schema" label="Schema">

Table `tags`
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "default": "" }
  },
  "required": ["name"],
  "additionalProperties": false
}
```

Table `products`
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "default": "",
        "foreignKey": "tags"
      }
    }
  },
  "required": ["title", "tags"],
  "additionalProperties": false
}
```

</TabItem>
</Tabs>

<Screenshot alt="Schema Editor — tags array with ForeignKey items pointing to tags table" src="/img/screenshots/fk-array-schema.png" />

<Screenshot alt="Row Editor — selecting tags from the referenced table, multiple FK values in array" src="/img/screenshots/fk-array-row-editor.png" />

## FK in Array of Objects

Foreign keys inside objects within an array. Example: an order has line items, each referencing a product.

<Tabs>
<TabItem value="data" label="Data" default>

Table `orders` — row id: `"ord-001"`
```json
{
  "customer": "Acme Corp",
  "items": [
    { "product": "iphone-16", "quantity": 10 },
    { "product": "macbook-m4", "quantity": 5 }
  ]
}
```

Each `items[].product` is a FK pointing to a row in the `products` table.

</TabItem>
<TabItem value="schema" label="Schema">

Table `orders`
```json
{
  "type": "object",
  "properties": {
    "customer": { "type": "string", "default": "" },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "product": {
            "type": "string",
            "default": "",
            "foreignKey": "products"
          },
          "quantity": { "type": "number", "default": 0 }
        },
        "required": ["product", "quantity"]
      }
    }
  },
  "required": ["customer", "items"],
  "additionalProperties": false
}
```

</TabItem>
</Tabs>

## FK in Nested Objects

Foreign keys inside nested objects (not arrays). Example: an article has metadata with author and reviewer references.

<Tabs>
<TabItem value="data" label="Data" default>

Table `articles` — row id: `"getting-started"`
```json
{
  "title": "Getting Started",
  "metadata": {
    "author": "john-doe",
    "reviewer": "jane-smith"
  }
}
```

`metadata.author` and `metadata.reviewer` both reference rows in the `users` table.

</TabItem>
<TabItem value="schema" label="Schema">

Table `articles`
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "metadata": {
      "type": "object",
      "properties": {
        "author": {
          "type": "string",
          "default": "",
          "foreignKey": "users"
        },
        "reviewer": {
          "type": "string",
          "default": "",
          "foreignKey": "users"
        }
      },
      "required": ["author", "reviewer"]
    }
  },
  "required": ["title", "metadata"],
  "additionalProperties": false
}
```

</TabItem>
</Tabs>

## Self-Relations

:::note Coming Soon
Self-referencing foreign keys (a table referencing itself) are currently in development. This will enable patterns like tree structures, parent-child hierarchies, and linked lists within a single table.
:::

## Limitations

Foreign keys are non-nullable — every FK field must reference a valid row. Nullable/optional foreign keys are planned.

When adding a new FK field to a table with existing data, the default empty string will fail validation. Use one of these patterns instead:

- **New FK array** — add a new array field; an empty array is valid (no references needed)
- **New array of objects with FK** — add a new array of objects where one field is a FK; empty array = no references
- **Two-step migration** — add the field as a regular string first, populate valid rowIds in existing rows, then change the field to a foreign key

## Referential Integrity

Revisium enforces referential integrity on every write:

| Operation | Behavior |
|-----------|----------|
| **Create/update row** | FK value must be a valid rowId in the target table |
| **Delete referenced row** | Blocked — cannot delete a row that other rows reference |
| **Delete referenced table** | Blocked — cannot delete a table that other tables reference via FK |
| **Rename row** | All FK values pointing to the old rowId are updated automatically |
| **Rename table** | All FK declarations (`"foreignKey": "old-name"`) in other schemas are updated |

### Cascade rename examples

**Rename row** in `categories`: `electronics` → `electronics-devices`

```
products/iphone-16:  category: "electronics"  →  category: "electronics-devices"
products/macbook-m4: category: "electronics"  →  category: "electronics-devices"
```

**Rename table**: `categories` → `product-categories`

```
products schema:  "foreignKey": "categories"  →  "foreignKey": "product-categories"
```

## API Resolution

When you create an [API endpoint](../apis/), FK fields are automatically resolved in **GraphQL** queries — no configuration needed:

```graphql
query {
  products {
    edges {
      node {
        data {
          title
          category {
            name
          }
          tags {
            name
          }
        }
      }
    }
  }
}
```

:::note
FK auto-resolution is GraphQL only. REST endpoints return raw FK IDs (the `rowId` string). To resolve relationships via REST, make a separate request using the returned ID.
:::

## Table Relations

The Admin UI provides a visual map of all foreign key relationships between tables.

<Screenshot alt="Table Relations — visual map of FK relationships between 14 tables with 22 relations" src="/img/screenshots/table-relations.png" />
