---
sidebar_position: 3
---

# Foreign Keys

Foreign keys create relationships between tables with referential integrity. A foreign key field contains the `rowId` of a row in the referenced table.

## Declaration

Add `"foreignKey": "table-name"` to any string field:

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "category": {
      "type": "string",
      "default": "",
      "foreignKey": "categories"
    }
  },
  "required": ["title", "category"]
}
```

The value of `category` must be a valid `rowId` from the `categories` table, or an empty string.

## Relationship Types

### One-to-One / Many-to-One

A single FK field — each row references one row in the target table:

```json
"author": {
  "type": "string",
  "default": "",
  "foreignKey": "users"
}
```

### One-to-Many (FK Array)

An array of FK strings — each row references multiple rows:

```json
"tags": {
  "type": "array",
  "items": {
    "type": "string",
    "default": "",
    "foreignKey": "tags"
  }
}
```

### FK in Nested Objects

Foreign keys can be placed inside nested objects:

```json
"translations": {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "language": {
        "type": "string",
        "default": "",
        "foreignKey": "languages"
      },
      "content": { "type": "string", "default": "" }
    },
    "required": ["language", "content"]
  }
}
```

## Referential Integrity

Revisium enforces referential integrity at write time:

| Operation | Behavior |
|-----------|----------|
| **Create/update row** | FK value must be a valid rowId in the target table (or empty string) |
| **Delete referenced row** | Blocked — cannot delete a row that other rows reference |
| **Delete referenced table** | Blocked — cannot delete a table that other tables reference via FK |
| **Rename row** | All FK values pointing to the old rowId are updated automatically |
| **Rename table** | All FK declarations (`"foreignKey": "old-name"`) in other schemas are updated |

## Auto-Generated API Resolution

When you create an [API endpoint](../apis/), FK fields are automatically resolved in **GraphQL** queries:

```graphql
query {
  products {
    edges {
      node {
        data {
          title
          category {
            name  # Auto-resolved from categories table
          }
          tags {
            name  # Each FK in array resolved
          }
        }
      }
    }
  }
}
```

No configuration needed — the relationship resolvers are generated from the schema.

:::note
FK auto-resolution is GraphQL only. REST endpoints return raw FK IDs (the `rowId` string). To resolve relationships via REST, make a separate request using the returned ID.
:::
