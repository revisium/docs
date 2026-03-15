---
sidebar_position: 8
---

# Schema Evolution

Changing a table's schema in Revisium automatically transforms existing data. No manual data migration is needed — the platform handles it.

## Supported Operations

| Operation | Effect on existing data |
|-----------|------------------------|
| **Add field** | All existing rows get the field's `default` value |
| **Remove field** | The field is removed from all existing rows |
| **Change type** | Automatic conversion between primitives (string ↔ number ↔ boolean) |
| **Wrap in array** | A primitive field becomes an array containing the old value |
| **Unwrap array** | An array field becomes a primitive using the first element |
| **Rename table** | All FK references in related schemas are updated |
| **Rename row** | All FK values in related rows are updated |

## How It Works

1. Modify the table schema in the draft revision (via Admin UI or API)
2. Existing rows are automatically transformed to match the new schema
3. Review the changes in the diff view (schema diff + data diff)
4. Commit when satisfied

All changes happen in the draft — nothing is finalized until you commit.

## Type Conversion Rules

| From → To | Conversion |
|-----------|-----------|
| String → Number | Parsed as number, `0` if invalid |
| String → Boolean | `"true"` → `true`, everything else → `false` |
| Number → String | Number as string (e.g., `42` → `"42"`) |
| Number → Boolean | `0` → `false`, non-zero → `true` |
| Boolean → String | `true` → `"true"`, `false` → `"false"` |
| Boolean → Number | `true` → `1`, `false` → `0` |

## Nested Schema Changes

Schema evolution works at any nesting depth. Adding a field to a nested object updates that object in all rows. Changing an array item type converts every element in every row.

## Migrations

Schema evolution automatically produces [migrations](../migrations/) (init, update, rename, remove). Migrations can be exported and applied on other instances as an alternative to branching — useful when independent instances are used instead of a single instance with branches (e.g., dev → staging → production).
