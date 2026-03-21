---
sidebar_position: 2
---

import Screenshot from '@site/src/components/Screenshot';

# Table Editor

The Table Editor shows rows in a tabular format with configurable columns, filtering, sorting, and search.

## Column Configuration

Add, reorder, and configure columns — including nested field paths (e.g., `rewards.currency.silver`):

<Screenshot alt="Column configuration — add columns dropdown with data fields, nested paths, and system fields" src="/img/screenshots/admin-table-columns.png" />

Right-click a column header for sort, filter, pin, move, hide, and copy path:

<Screenshot alt="Column context menu — sort, filter, pin, move, hide, copy path options" src="/img/screenshots/admin-table-column-menu.png" />

## Views

Save column order, widths, and sort settings to the default view — shared with everyone:

<Screenshot alt="Unsaved view settings — save column order, widths, and sort to Default view" src="/img/screenshots/admin-table-views.png" />

## Filtering

Apply filters from the filter bar — select a field, choose an operator, enter a value. Combine multiple conditions with AND/OR logic.

Filters match the same operators available in the [query API](../querying-data/filtering).

<Screenshot alt="Filter bar — rewards.currency >= 100 with Add condition and Add group" src="/img/screenshots/admin-table-filter.png" />

## Sorting

Sort by any column — including nested data fields. Add multiple sort levels.

<Screenshot alt="Sort dialog — sorting by rewards.currency ascending with Add sort option" src="/img/screenshots/admin-table-sort.png" />

## Search

Full-text search across all visible columns. Type in the search bar to filter rows by content.

## Row Actions

- Click a row to open it in the [Row Editor](./row-editor)
- Create new rows with **+** button
- Delete rows from the row context menu

## Inline Editing

Some field types support inline editing directly in the table cells without opening the Row Editor.
