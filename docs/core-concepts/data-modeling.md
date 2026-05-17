---
sidebar_position: 2
---

import Screenshot from '@site/src/components/Screenshot';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Data Modeling

Every table in Revisium is defined by a JSON Schema. You design the schema once — Revisium uses it to render the Admin UI, validate every write, generate APIs, and transform existing data when the schema changes.

Think of a Revisium schema as a product contract for structured data. It describes what editors can change in the UI, what applications can read from generated APIs, and what rules are enforced before data reaches your runtime consumers.

## What Data Modeling Controls

Data modeling is the layer that connects the visual Admin UI with runtime APIs.

| Schema decision | What it changes in the Admin UI | What it changes in APIs |
|---|---|---|
| Field name and type | Table columns, row editor controls, inline editing behavior | Generated GraphQL fields, REST/OpenAPI schema, validation errors |
| Nested object | Grouped/nested fields in the schema and row editors | Nested response objects and selectable GraphQL projections |
| Array | Repeatable controls and list-like JSON values | Array response fields, array filtering/sorting support where available |
| Enum | Constrained values in forms and filters | Enum-like values documented in generated API schemas |
| `contentMediaType` / `format` | Better editing affordances for Markdown, dates, email, and rich text | Stronger validation and clearer API contracts |
| Default value | New rows start with valid values | Schema evolution can add fields to existing rows safely |

The same model powers several product surfaces:

- **Schema Editor** — design table fields and review the resulting JSON Schema.
- **Table Editor** — scan, filter, sort, resize, hide, and edit data in rows.
- **Row Editor** — work with one row as a structured form or JSON document.
- **Generated APIs** — query the same data through GraphQL, REST/OpenAPI, and MCP.
- **Schema Evolution** — add, remove, move, and change fields while Revisium updates existing rows.

<Screenshot alt="Admin UI — table editor with filtering, nested field columns, and inline editing" src="/img/screenshots/admin-ui-table-editor.png" />

## Define a Table

A table has a name, a schema (structure), and rows (data). Here's a `products` table:

<Tabs>
<TabItem value="data" label="Data" default>

```json
{
  "title": "iPhone 16 Pro",
  "price": 999,
  "inStock": true,
  "description": "Latest flagship smartphone"
}
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "price": { "type": "number", "default": 0 },
    "inStock": { "type": "boolean", "default": false },
    "description": { "type": "string", "default": "" }
  },
  "required": ["title", "price", "inStock", "description"],
  "additionalProperties": false
}
```

</TabItem>
</Tabs>

The schema defines what fields exist, their types, and default values. Any data that doesn't match the schema is rejected.

<Screenshot alt="Schema Editor — products table with field type selector (string, number, boolean, object, array, foreign key, schemas, system fields)" src="/img/screenshots/schema-editor-field-types.png" />

## From Schema To UI

After you create a table, Revisium uses the schema to build editing surfaces automatically.

In the **Schema Editor**, each field is explicit: its type, default value, nested structure, enum values, foreign key, file reference, or computed formula. This makes the model reviewable before data entry starts.

In the **Table Editor**, each row is displayed according to the same schema. Primitive fields can be edited inline, nested fields can be shown as columns, and view settings such as column order, widths, filters, and sorts can be saved for the table.

In the **Row Editor**, the same row becomes a detailed form. This is useful when the data is nested, has long text fields, includes files, or needs careful review before saving.

<Screenshot alt="Row Editor — editing a structured row as a form" src="/img/screenshots/row-page.png" />

## From Schema To APIs

The same schema is also the source for generated API contracts. When a table is exposed through a generated endpoint, Revisium can serve typed data through GraphQL and REST/OpenAPI.

For example, a `products` table can be queried as rows with system fields plus typed `data`:

```graphql
query {
  products(data: {
    first: 10
    orderBy: [{ data: { path: "price", direction: "desc", type: "float" } }]
  }) {
    totalCount
    edges {
      node {
        id
        data {
          title
          price
          inStock
        }
      }
    }
  }
}
```

That means a schema is not just documentation. It is the source used by editors, validators, generated APIs, and client applications.

## Example Use Cases

The same modeling primitives work across different domains:

| Use case | Example tables | Modeling features |
|---|---|---|
| Headless CMS | `pages`, `blog_posts`, `authors`, `navigation` | Markdown strings, file fields, publish dates, author foreign keys |
| Product catalog | `products`, `categories`, `prices`, `variants` | Nested specs, arrays of variants, enums, computed labels |
| Game or simulation data | `regions`, `heroes`, `items`, `quests` | Localized strings, foreign keys, embedded arrays, computed fields |
| Configuration store | `feature_flags`, `plans`, `limits`, `experiments` | Root primitives, structured rules, safe defaults, schema evolution |
| User-generated workflow data | `form_submissions`, `comments`, `wishlists` | Structured records that admins can review, filter, and process |

The important part is not the domain. The pattern is the same: define the shape once, edit it safely, and serve it through APIs.

## Field Types

### String

Text values. The most common field type.

<Tabs>
<TabItem value="data" label="Data" default>

```json
{ "title": "iPhone 16 Pro" }
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" }
  },
  "required": ["title"]
}
```

</TabItem>
</Tabs>

Strings support optional formats for rendering and validation:

| Format | Declaration | Usage |
|--------|-------------|-------|
| Plain text | `{ "type": "string" }` | Names, IDs, short text |
| Markdown | `{ "type": "string", "contentMediaType": "text/markdown" }` | Rich content, articles |
| HTML | `{ "type": "string", "contentMediaType": "text/html" }` | Raw HTML content |
| Date-time | `{ "type": "string", "format": "date-time" }` | ISO 8601 timestamps |
| Email | `{ "type": "string", "format": "email" }` | Email addresses |

### Number

Integer or decimal values.

<Tabs>
<TabItem value="data" label="Data" default>

```json
{ "price": 999 }
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "price": { "type": "number", "default": 0 }
  },
  "required": ["price"]
}
```

</TabItem>
</Tabs>

### Boolean

True/false values.

<Tabs>
<TabItem value="data" label="Data" default>

```json
{ "inStock": true }
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "inStock": { "type": "boolean", "default": false }
  },
  "required": ["inStock"]
}
```

</TabItem>
</Tabs>

### Object

Nested structure with its own fields. Objects can be nested to any depth.

<Tabs>
<TabItem value="data" label="Data" default>

```json
{
  "weight": 199,
  "color": "Desert Titanium"
}
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "weight": { "type": "number", "default": 0 },
    "color": { "type": "string", "default": "" }
  },
  "required": ["weight", "color"]
}
```

</TabItem>
</Tabs>

### Array

Lists of values. Items can be any type — strings, numbers, objects, or even [files](./files).

**Array of strings:**

<Tabs>
<TabItem value="data" label="Data" default>

```json
["5G", "USB-C", "ProMotion"]
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "array",
  "items": { "type": "string", "default": "" }
}
```

</TabItem>
</Tabs>

**Array of objects:**

<Tabs>
<TabItem value="data" label="Data" default>

```json
[
  { "color": "Desert Titanium", "storage": 256 },
  { "color": "Black Titanium", "storage": 512 }
]
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "color": { "type": "string", "default": "" },
      "storage": { "type": "number", "default": 0 }
    },
    "required": ["color", "storage"]
  }
}
```

</TabItem>
</Tabs>

**Nested arrays** — objects inside arrays can contain their own arrays:

<Tabs>
<TabItem value="data" label="Data" default>

```json
[
  { "product": "iphone-16", "quantity": 2, "addons": ["case", "charger"] },
  { "product": "macbook-m4", "quantity": 1, "addons": [] }
]
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "product": { "type": "string", "default": "" },
      "quantity": { "type": "number", "default": 0 },
      "addons": {
        "type": "array",
        "items": { "type": "string", "default": "" }
      }
    },
    "required": ["product", "quantity", "addons"]
  }
}
```

</TabItem>
</Tabs>

**Multidimensional arrays** — arrays of arrays:

<Tabs>
<TabItem value="data" label="Data" default>

```json
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "array",
  "items": {
    "type": "array",
    "items": { "type": "number", "default": 0 }
  }
}
```

</TabItem>
</Tabs>

## Full Example

A complete table schema with nested objects and arrays:

<Tabs>
<TabItem value="data" label="Data" default>

```json
{
  "title": "iPhone 16 Pro",
  "price": 999,
  "inStock": true,
  "specs": {
    "weight": 199,
    "tags": ["5G", "USB-C", "ProMotion"]
  },
  "variants": [
    { "color": "Desert Titanium", "storage": 256 },
    { "color": "Black Titanium", "storage": 512 }
  ]
}
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "price": { "type": "number", "default": 0 },
    "inStock": { "type": "boolean", "default": false },
    "specs": {
      "type": "object",
      "properties": {
        "weight": { "type": "number", "default": 0 },
        "tags": {
          "type": "array",
          "items": { "type": "string", "default": "" }
        }
      },
      "required": ["weight", "tags"]
    },
    "variants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "color": { "type": "string", "default": "" },
          "storage": { "type": "number", "default": 0 }
        },
        "required": ["color", "storage"]
      }
    }
  },
  "required": ["title", "price", "inStock", "specs", "variants"],
  "additionalProperties": false
}
```

</TabItem>
</Tabs>

<Screenshot alt="Schema Editor — products table with nested specs and variants" src="/img/screenshots/schema-full-example.png" />

## Working With Nested Data In The UI

Nested objects and arrays are useful when a row owns structured details that should stay together.

Examples:

- product `specs` with `weight`, `dimensions`, and `tags`;
- article `seo` metadata with title, description, and Open Graph image;
- quest `steps[]` where each step has text, rewards, and completion rules;
- form submission `answers[]` where each answer stores a field id and value.

In the Admin UI, nested data can be edited in the row form and selected as table columns when the value is useful for scanning. In APIs, the same nested shape is available as JSON/GraphQL fields, so clients can request only the parts they need.

## Default Values

Primitive fields (string, number, boolean) must have a `default` value. Defaults serve two purposes:

1. **New rows** start with valid data — no null fields
2. **Schema evolution** — when you add a field to an existing table, all existing rows get the default value automatically

```json
{ "type": "string", "default": "" }
{ "type": "number", "default": 0 }
{ "type": "boolean", "default": false }
```

Object and array fields don't require a `default` — they are initialized from their structure.

See [Schema Evolution](./schema-evolution) for more on how data transforms when schemas change.

## Root Types

Most tables use `type: "object"` as the root — a record with named fields. But a row can also be:

**Root array** — e.g., a pricing table:

<Tabs>
<TabItem value="data" label="Data" default>

```json
[
  { "from": 0, "to": 100, "pricePerUnit": 10.00 },
  { "from": 101, "to": 500, "pricePerUnit": 8.50 },
  { "from": 501, "to": 999999, "pricePerUnit": 6.00 }
]
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
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

</TabItem>
</Tabs>

**Root primitive** — e.g., a feature flag:

<Tabs>
<TabItem value="data" label="Data" default>

```json
true
```

</TabItem>
<TabItem value="schema" label="Schema">

```json
{ "type": "boolean", "default": false }
```

</TabItem>
</Tabs>

<Screenshot alt="Root primitive — feature flags table with boolean values per row" src="/img/screenshots/root-primitive-flags.png" />

## System Fields

System fields (`id`, `createdAt`, `updatedAt`, etc.) are stored at the database level, outside your JSON data. APIs return system fields alongside your data automatically — you don't need to add them to the schema.

You can optionally inject system fields into your JSON data via `$ref` if you want them inside the row body — at any nesting level and with any field name. This is purely for convenience; the platform doesn't force system fields into your schema.

<Screenshot alt="Schema Editor — System fields submenu with id, versionId, createdId, createdAt, publishedAt, updatedAt, hash, schemaHash" src="/img/screenshots/schema-editor-system-fields.png" />

<Tabs>
<TabItem value="data" label="Data" default>

```json
{
  "myId": "iphone-16",
  "createdAt": "2026-03-15T10:30:00Z",
  "title": "iPhone 16 Pro",
  "meta": {
    "created": "2026-03-15T10:30:00Z"
  }
}
```

`myId`, `createdAt`, and `meta.created` are populated automatically by the platform.

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "myId": { "$ref": "urn:jsonschema:io:revisium:row-id-schema:1.0.0" },
    "createdAt": { "$ref": "urn:jsonschema:io:revisium:row-created-at-schema:1.0.0" },
    "title": { "type": "string", "default": "" },
    "meta": {
      "type": "object",
      "properties": {
        "created": { "$ref": "urn:jsonschema:io:revisium:row-created-at-schema:1.0.0" }
      },
      "required": ["created"]
    }
  },
  "required": ["myId", "createdAt", "title", "meta"],
  "additionalProperties": false
}
```

</TabItem>
</Tabs>

Available system refs:

| Ref | Value |
|-----|-------|
| `urn:jsonschema:io:revisium:row-id-schema:1.0.0` | Row ID (string) |
| `urn:jsonschema:io:revisium:row-created-id-schema:1.0.0` | Original creation ID |
| `urn:jsonschema:io:revisium:row-version-id-schema:1.0.0` | Version ID |
| `urn:jsonschema:io:revisium:row-created-at-schema:1.0.0` | Creation timestamp |
| `urn:jsonschema:io:revisium:row-published-at-schema:1.0.0` | Publication timestamp |
| `urn:jsonschema:io:revisium:row-updated-at-schema:1.0.0` | Last update timestamp |
| `urn:jsonschema:io:revisium:row-hash-schema:1.0.0` | Content hash |
| `urn:jsonschema:io:revisium:row-schema-hash-schema:1.0.0` | Schema hash |

## What's Next

Data modeling defines the structure. On top of it, you can add:

- **[Foreign Keys](./foreign-keys)** — relationships between tables with referential integrity
- **[Computed Fields](./computed-fields)** — formula-based read-only fields (`x-formula`)
- **[Files](./files)** — file attachments at any schema level, backed by local or S3-compatible storage
- **[Schema Evolution](./schema-evolution)** — change types, add/remove fields with automatic data transforms
- **[Table Editor](../admin-ui/table-editor)** — how modeled data appears as columns, filters, sorts, and saved views
- **[Generated APIs](../apis/)** — how schemas become GraphQL, REST/OpenAPI, and MCP surfaces
