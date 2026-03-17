---
sidebar_position: 2
---

# Data Modeling

Every table in Revisium is defined by a [JSON Schema (Draft 2020-12)](https://json-schema.org/). The schema defines field types, nesting, constraints, and relationships. The platform enforces schema compliance on every write — invalid data is rejected.

## Supported Types

| Type | JSON Schema | Example value |
|------|-------------|---------------|
| String | `{ "type": "string" }` | `"Hello"` |
| Number | `{ "type": "number" }` | `42`, `3.14` |
| Boolean | `{ "type": "boolean" }` | `true` |
| Object | `{ "type": "object", "properties": {...} }` | `{ "name": "..." }` |
| Array | `{ "type": "array", "items": {...} }` | `[1, 2, 3]` |

### String Formats

Strings support optional formats for UI rendering and validation:

| Format | Usage |
|--------|-------|
| `date-time` | ISO 8601 timestamps |
| `email` | Email addresses |
| `text/markdown` | Markdown content (via `contentMediaType`) |
| `text/html` | HTML content (via `contentMediaType`) |

## Nesting

Objects and arrays can be nested to any depth:

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "specs": {
      "type": "object",
      "properties": {
        "weight": { "type": "number", "default": 0 },
        "tags": {
          "type": "array",
          "items": { "type": "string", "default": "" }
        }
      },
      "required": ["weight", "tags"],
      "default": {}
    }
  },
  "required": ["title", "specs"]
}
```

## Root Types

A row is not limited to objects. The root type can be:

- **Object** — the most common case, a record with named fields
- **Array** — e.g., a pricing table as an array of tiers
- **Primitive** — a single string, number, or boolean (e.g., a feature flag)

```json title="Root array example"
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "from": { "type": "number", "default": 0 },
      "to": { "type": "number", "default": 0 },
      "pricePerUnit": { "type": "number", "default": 0 }
    },
    "required": ["from", "to", "pricePerUnit"]
  }
}
```

## Default Values

Every field must have a `default` value. This ensures new rows always have valid data and supports [schema evolution](./schema-evolution) — when a field is added to an existing table, all existing rows get the default value.

## System Fields

System fields (`id`, `createdAt`, `updatedAt`, `hash`, etc.) are stored at the database level, outside the JSON body. They can be optionally included in the schema via `$ref`:

```json
{
  "type": "object",
  "properties": {
    "id": { "$ref": "urn:jsonschema:io:revisium:row-id-schema:1.0.0" },
    "createdAt": { "$ref": "urn:jsonschema:io:revisium:row-created-at-schema:1.0.0" },
    "updatedAt": { "$ref": "urn:jsonschema:io:revisium:row-updated-at-schema:1.0.0" },
    "title": { "type": "string", "default": "" }
  },
  "required": ["id", "createdAt", "updatedAt", "title"]
}
```

Available system field refs: `urn:jsonschema:io:revisium:row-id-schema:1.0.0`, `urn:jsonschema:io:revisium:row-created-at-schema:1.0.0`, `urn:jsonschema:io:revisium:row-updated-at-schema:1.0.0`, `urn:jsonschema:io:revisium:row-hash-schema:1.0.0`.

System fields can appear at any level in the schema — root, nested objects, or array items — with any field name.

## Required Fields

All fields listed in `required` are enforced on write. For tables with `type: "object"`, every property should typically be in `required` with a `default` value.
