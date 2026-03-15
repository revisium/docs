---
sidebar_position: 2
---

import Screenshot from '@site/src/components/Screenshot';

# Table Editor

The Table Editor shows rows in a tabular format with configurable columns, filtering, sorting, and search.

<Screenshot alt="Table Editor — tabular view with configurable columns, including nested field paths" />

## Column Configuration

- Click column headers to sort
- Drag columns to reorder
- Show/hide columns including nested field paths (e.g., `specs.weight`)
- Resize column widths

<Screenshot alt="Column configuration — show/hide columns dropdown with nested paths" />

## Views

Save column/filter/sort configurations as named **views** for quick switching:

1. Configure columns, filters, and sorts
2. Click **Save View** and name it
3. Switch between views from the dropdown

Each table can have multiple views. Views are stored per-user and per-table.

<Screenshot alt="Views dropdown — switching between saved view presets" />

## Filtering

Apply filters from the filter bar:

- Select a field
- Choose an operator (equals, contains, greater than, etc.)
- Enter a value
- Combine multiple filters

Filters match the same operators available in the [query API](../querying-data/filtering).

<Screenshot alt="Filter bar — applying a filter with field selector, operator, and value" />

## Sorting

Click column headers to toggle sort direction. Multi-column sort is supported — click additional columns while holding the sort modifier.

## Search

Full-text search across all visible columns. Type in the search bar to filter rows by content.

## Row Actions

- Click a row to open it in the [Row Editor](./row-editor)
- Create new rows with **New Row**
- Delete rows from the row context menu

## Inline Editing

Some field types support inline editing directly in the table cells without opening the Row Editor.
