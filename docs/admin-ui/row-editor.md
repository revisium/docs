---
sidebar_position: 3
---

import Screenshot from '@site/src/components/Screenshot';

# Row Editor

The Row Editor provides form-based and JSON editing for individual records.

<Screenshot alt="Row Editor — structured form view with nested objects, arrays, FK navigation, and file preview" />

## Form View

Fields are rendered as form controls based on their schema type:

| Schema type | Form control |
|-------------|-------------|
| String | Text input (or textarea for long text) |
| String (markdown) | Markdown editor |
| Number | Number input |
| Boolean | Toggle switch |
| Object | Expandable nested form |
| Array | List with add/remove/reorder |
| File | File upload with preview |
| FK (string) | Dropdown/search referencing the target table |

## JSON View

Toggle to JSON view to see and edit the raw JSON data with syntax highlighting. Useful for bulk edits or when the form view is too constrained.

<Screenshot alt="Row Editor JSON view — raw data editing with syntax highlighting" />

## Foreign Key Navigation

FK fields show the referenced row's data inline. Click the FK value to navigate directly to the referenced row in its table.

<Screenshot alt="Foreign key field — showing referenced row data with click-to-navigate" />

## File Upload

File fields provide:
- Drag-and-drop upload area
- Image preview for supported formats
- File size and type display
- Replace/remove file actions

<Screenshot alt="File upload field — drag-and-drop area with image preview" />

## Row ID

Each row has a unique string `id` within its table. The id is set on creation and can be renamed (all FK references are updated automatically).

## Validation

The form validates data against the JSON Schema in real time. Invalid values are highlighted with error messages. The row cannot be saved until all validation errors are resolved.
