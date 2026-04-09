---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# System API

The System API manages the Revisium platform — projects, branches, revisions, tables, rows, and users. Available as GraphQL and REST.

## GraphQL

The System GraphQL API is served at:

- **Cloud:** `https://cloud.revisium.io/graphql`
- **Standalone:** `http://localhost:9222/graphql`
- **Docker:** `http://localhost:8080/graphql`

### Authentication

**JWT (interactive sessions):**

```graphql
mutation {
  login(data: { username: "admin", password: "admin" }) {
    accessToken
  }
}
```

Use the token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

**API Key (programmatic access):**

```bash
# System GraphQL with API key
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: rev_xxxxxxxxxxxxxxxxxxxx" \
  -d '{"query": "{ me { id username } }"}'

# System REST with API key
curl http://localhost:8080/api/organization/myorg/project/myproject/branch/master \
  -H "X-Api-Key: rev_xxxxxxxxxxxxxxxxxxxx"
```

See [API Keys](../auth-permissions/api-keys) for setup and scoping.

### Tables

<Tabs>
<TabItem value="create" label="Create" default>

```graphql
mutation {
  createTable(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    schema: { ... }
  }) { id }
}
```

</TabItem>
<TabItem value="update" label="Update Schema">

```graphql
mutation {
  updateTable(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    patches: [
      { op: "add", path: "/properties/inStock", value: { type: "boolean", default: false } }
    ]
  }) { id }
}
```

Schema changes use JSON Patch format. See [Schema Evolution](../core-concepts/schema-evolution).

</TabItem>
<TabItem value="rename" label="Rename">

```graphql
mutation {
  renameTable(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    nextTableId: "items"
  }) { id }
}
```

</TabItem>
<TabItem value="delete" label="Delete">

```graphql
mutation {
  deleteTable(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
  }) { id }
}
```

</TabItem>
</Tabs>

### Rows

<Tabs>
<TabItem value="create" label="Create" default>

```graphql
mutation {
  createRow(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rowId: "iphone-16"
    data: { title: "iPhone 16 Pro", price: 999 }
  }) { id }
}
```

</TabItem>
<TabItem value="update" label="Update">

```graphql
mutation {
  updateRow(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rowId: "iphone-16"
    data: { title: "iPhone 16 Pro Max", price: 1199 }
  }) { id }
}
```

Replaces the entire row data.

</TabItem>
<TabItem value="patch" label="Patch">

```graphql
mutation {
  patchRow(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rowId: "iphone-16"
    patches: [
      { op: "replace", path: "price", value: 1199 }
    ]
  }) { id }
}
```

Only `replace` operation is supported. Path uses field name without leading slash.

</TabItem>
<TabItem value="rename" label="Rename">

```graphql
mutation {
  renameRow(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rowId: "iphone-16"
    nextRowId: "iphone-16-pro"
  }) { id }
}
```

All FK values pointing to the old rowId are updated automatically.

</TabItem>
<TabItem value="delete" label="Delete">

```graphql
mutation {
  deleteRow(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rowId: "iphone-16"
  }) { id }
}
```

</TabItem>
</Tabs>

### Bulk Operations

Create, update, patch, or delete multiple rows in a single request:

<Tabs>
<TabItem value="create" label="Create Rows" default>

```graphql
mutation {
  createRows(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rows: [
      { rowId: "iphone-16", data: { title: "iPhone 16 Pro", price: 999 } },
      { rowId: "macbook-m4", data: { title: "MacBook M4", price: 1999 } }
    ]
  }) { tableId }
}
```

</TabItem>
<TabItem value="update" label="Update Rows">

```graphql
mutation {
  updateRows(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rows: [
      { rowId: "iphone-16", data: { title: "iPhone 16 Pro", price: 1099 } },
      { rowId: "macbook-m4", data: { title: "MacBook M4 Pro", price: 2499 } }
    ]
  }) { tableId }
}
```

</TabItem>
<TabItem value="patch" label="Patch Rows">

```graphql
mutation {
  patchRows(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rows: [
      { rowId: "iphone-16", patches: [{ op: "replace", path: "price", value: 1099 }] },
      { rowId: "macbook-m4", patches: [{ op: "replace", path: "price", value: 2499 }] }
    ]
  }) { tableId }
}
```

</TabItem>
<TabItem value="delete" label="Delete Rows">

```graphql
mutation {
  deleteRows(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    rowIds: ["old-product-1", "old-product-2"]
  }) { tableId }
}
```

</TabItem>
</Tabs>

### Querying Rows

```graphql
query {
  rows(data: {
    revisionId: "<revisionId>"
    tableId: "products"
    first: 20
    after: null
    where: { data: { path: ["price"], gte: 100 } }
    orderBy: [{ field: createdAt, direction: desc }]
  }) {
    edges {
      node { id data }
      cursor
    }
    pageInfo { hasNextPage endCursor }
    totalCount
  }
}
```

### Search

Full-text search across all tables and fields:

```graphql
query {
  searchRows(data: {
    revisionId: "<revisionId>"
    query: "iPhone"
    first: 10
  }) {
    edges {
      node { row { id } table { id } matches { value path highlight } }
    }
  }
}
```

### Commits & Changes

```graphql
# Commit draft changes
mutation {
  createRevision(data: {
    organizationId: "admin"
    projectName: "my-project"
    branchName: "master"
    comment: "Add products"
  }) { id }
}

# Get changes before commit
query {
  revisionChanges(data: { revisionId: "<draftRevisionId>" }) {
    tableChanges { tableId type }
    rowChanges { tableId rowId type }
  }
}
```

## REST

The System REST API provides the same operations under `/api`:

- **Cloud:** `https://cloud.revisium.io/api`
- **Standalone:** `http://localhost:9222/api`
- **Docker:** `http://localhost:8080/api`

Swagger UI available at `/api` (e.g., `http://localhost:9222/api`).

### Tables

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/revision/:revisionId/tables` | Create table |
| PATCH | `/api/revision/:revisionId/tables/:tableId` | Update table schema (JSON Patch) |
| PATCH | `/api/revision/:revisionId/tables/:tableId/rename` | Rename table |
| DELETE | `/api/revision/:revisionId/tables/:tableId` | Delete table |

### Rows

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/revision/:revisionId/tables/:tableId/create-row` | Create row |
| POST | `/api/revision/:revisionId/tables/:tableId/create-rows` | Create rows (bulk) |
| PUT | `/api/revision/:revisionId/tables/:tableId/rows/:rowId` | Update (replace) row |
| PUT | `/api/revision/:revisionId/tables/:tableId/update-rows` | Update rows (bulk) |
| PATCH | `/api/revision/:revisionId/tables/:tableId/rows/:rowId` | Patch row |
| PATCH | `/api/revision/:revisionId/tables/:tableId/patch-rows` | Patch rows (bulk) |
| PATCH | `/api/revision/:revisionId/tables/:tableId/rows/:rowId/rename` | Rename row |
| DELETE | `/api/revision/:revisionId/tables/:tableId/rows/:rowId` | Delete row |
| DELETE | `/api/revision/:revisionId/tables/:tableId/rows` | Delete rows (bulk) |

### Querying

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/revision/:revisionId/tables/:tableId/rows` | Query rows (filter, sort, paginate) |
| GET | `/api/revision/:revisionId/tables/:tableId/rows/:rowId` | Get single row |
| GET | `/api/revision/:revisionId/tables/:tableId/count-rows` | Count rows |

### Files

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/revision/:revisionId/tables/:tableId/rows/:rowId/upload/:fileId` | Upload file (multipart/form-data, max 50MB) |

### Branches & Commits

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/organization/:orgId/projects/:name/branches/:branch/create-revision` | Commit |
| POST | `/api/organization/:orgId/projects/:name/branches/:branch/revert-changes` | Revert draft |

## Client Library

The [@revisium/client](https://github.com/revisium/revisium-client) TypeScript library provides a typed client for the System API:

```typescript
import { RevisiumClient } from '@revisium/client';

const client = new RevisiumClient({
  url: 'http://localhost:8080',
  username: 'admin',
  password: 'admin',
});

const project = await client.getProject('my-org', 'my-project');
const tables = await client.getTables(revisionId);
```
