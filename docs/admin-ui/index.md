---
sidebar_position: 5
---

import Screenshot from '@site/src/components/Screenshot';

# Admin UI

Revisium includes a full-featured web interface for managing schemas, data, versions, and API endpoints. No code required — design schemas visually, edit data in tabular or form views, review changes before committing, and create API endpoints.

<Screenshot alt="Admin UI — table editor with filtering, nested field columns, and inline editing" src="/img/screenshots/admin-ui-table-editor.png" />

## Navigation

The Admin UI is organized around the current project and branch:

- **Project selector** — switch between projects
- **Branch selector** — switch between branches
- **Sidebar** — tables list, endpoints, assets, branch map

## Key Screens

| Screen | Purpose |
|--------|---------|
| [Schema Editor](./schema-editor) | Visual schema design — field types, nesting, FK, formulas, files |
| [Table Editor](./table-editor) | Tabular data view — columns, filters, sorts, search, views |
| [Row Editor](./row-editor) | Form and JSON views for editing individual records |
| [Changes & Diff](./changes-diff) | Review schema and data changes before commit |
| [Assets](./assets) | File gallery with filtering by table, type, and status |
| [Branches & History](./branches-history) | Branch map, revision timeline, navigation |
| [Endpoints & MCP](./endpoints-mcp) | API endpoint creation and MCP server configuration |

## Access

- **Standalone:** [http://localhost:9222](http://localhost:9222)
- **Docker:** [http://localhost:8080](http://localhost:8080)
- **Cloud:** [cloud.revisium.io](https://cloud.revisium.io/signup)
