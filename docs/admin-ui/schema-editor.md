---
sidebar_position: 1
---

import Screenshot from '@site/src/components/Screenshot';

# Schema Editor

The Schema Editor provides a visual interface for designing table schemas. Add fields, configure types, set up foreign keys, define computed fields, and attach files — all without writing JSON manually.

<Screenshot alt="Schema Editor — visual schema design with nested objects, FK references, and field types" />

## Creating a Table

1. Click **New Table** in the sidebar
2. Enter a table name (used as the table identifier)
3. The Schema Editor opens with an empty object schema

## Adding Fields

Click **Add Field** to add a new field. Configure:

- **Name** — field identifier (used in API queries)
- **Type** — String, Number, Boolean, Object, Array
- **Default value** — required for all fields
- **Description** — optional documentation

<Screenshot alt="Adding a new field — type selector with String, Number, Boolean, Object, Array options" />

### Field Types

| Type | Options |
|------|---------|
| String | Format (plain, markdown, HTML, date-time, email) |
| Number | Minimum, maximum |
| Boolean | Default true/false |
| Object | Nested fields (recursive) |
| Array | Item type (string, number, boolean, object, file, FK) |

## Foreign Keys

To create a relationship:

1. Add a String field
2. Enable **Foreign Key**
3. Select the target table

For array relationships, create an Array field with String items and enable Foreign Key on the items.

<Screenshot alt="Foreign Key configuration — selecting the target table for a category field" />

## Computed Fields

To add a computed field:

1. Add a field of the desired output type
2. Enter a formula in the **x-formula** field
3. The field becomes read-only — its value is calculated from other fields

See [Computed Fields](../core-concepts/computed-fields) for formula syntax and available functions.

## File Fields

To add a file attachment:

1. Add a **File** field (uses the File system schema internally)
2. For galleries, use an Array of File items

## Nested Objects

Click into an Object field to edit its sub-fields. The breadcrumb trail shows your current depth. Objects can be nested to any level.

<Screenshot alt="Nested object editing — breadcrumb trail showing depth, sub-fields inside specs object" />

## JSON View

Toggle between visual and JSON view to see or edit the raw JSON Schema directly. Changes in either view are synchronized.

<Screenshot alt="JSON view — raw JSON Schema with syntax highlighting" />
