---
sidebar_position: 2
---

# Migration Format

Migrations are stored as a JSON array of migration objects. See [Migrations](../../migrations/) for overview and workflows.

## Common Fields

Every migration has:

| Field | Type | Description |
|-------|------|-------------|
| `changeType` | `init` \| `update` \| `rename` \| `remove` | Migration type |
| `id` | string | ISO 8601 timestamp — unique identifier and sort key |
| `tableId` | string | Target table name |
| `hash` | string | SHA-1 hash of the resulting schema (integrity check) |

## Init Migration

Creates a new table with the full schema:

```json
{
  "changeType": "init",
  "id": "2025-01-20T10:00:00.000Z",
  "tableId": "Product",
  "hash": "a1b2c3...",
  "schema": {
    "type": "object",
    "required": ["name", "price"],
    "properties": {
      "name": { "type": "string", "default": "" },
      "price": { "type": "number", "default": 0 }
    }
  }
}
```

## Update Migration

Modifies an existing schema using [JSON Patch (RFC 6902)](https://datatracker.ietf.org/doc/html/rfc6902) operations:

```json
{
  "changeType": "update",
  "id": "2025-01-21T14:00:00.000Z",
  "tableId": "Product",
  "hash": "d4e5f6...",
  "schemaPatch": [
    {
      "op": "add",
      "path": "/properties/description",
      "value": { "type": "string", "default": "" }
    }
  ]
}
```

Supported JSON Patch operations: `add`, `remove`, `replace`, `move`, `copy`, `test`.

## Rename Migration

Renames a table and automatically updates all FK references in other schemas:

```json
{
  "changeType": "rename",
  "id": "2025-01-22T09:00:00.000Z",
  "tableId": "Product",
  "hash": "g7h8i9...",
  "newTableId": "Item"
}
```

## Remove Migration

Deletes a table. Validated that no FK dependencies exist before application:

```json
{
  "changeType": "remove",
  "id": "2025-01-23T16:00:00.000Z",
  "tableId": "OldTable",
  "hash": "j0k1l2..."
}
```

## Example: Complete Migration File

```json
[
  {
    "changeType": "init",
    "id": "2025-01-20T10:00:00.000Z",
    "tableId": "Category",
    "hash": "...",
    "schema": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "name": { "type": "string", "default": "" }
      }
    }
  },
  {
    "changeType": "init",
    "id": "2025-01-20T10:00:01.000Z",
    "tableId": "Product",
    "hash": "...",
    "schema": {
      "type": "object",
      "required": ["name", "category"],
      "properties": {
        "name": { "type": "string", "default": "" },
        "category": { "type": "string", "default": "", "foreignKey": "Category" }
      }
    }
  },
  {
    "changeType": "update",
    "id": "2025-01-21T14:00:00.000Z",
    "tableId": "Product",
    "hash": "...",
    "schemaPatch": [
      { "op": "add", "path": "/properties/price", "value": { "type": "number", "default": 0 } }
    ]
  }
]
```

## Validation

Before application, each migration is validated:

- **Format** — valid JSON, required fields present
- **Schema** — valid JSON Schema Draft 2020-12 (for `init`)
- **Dependencies** — FK references point to existing tables
- **Hash** — SHA-1 matches to detect manual modifications
- **Ordering** — migrations sorted chronologically by `id`

## Hash Calculation

The `hash` field is a SHA-1 of the resulting schema content. It serves two purposes:

1. **Integrity check** — detects manual modifications to the migration file
2. **Deduplication** — prevents applying the same logical change twice

If you get a hash mismatch error, re-export schemas and regenerate migrations.
