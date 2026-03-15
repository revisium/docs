---
sidebar_position: 1
---

# System API

The System API manages the Revisium platform itself — projects, branches, revisions, tables, rows, and users. It is available as GraphQL and REST.

## GraphQL

The System GraphQL API is served at the root endpoint:

```
POST /api/graphql
```

### Key Operations

| Category | Operations |
|----------|-----------|
| **Projects** | Create, list, get, update, delete projects |
| **Branches** | Create, list, get branches; get draft/head revision |
| **Revisions** | Create (commit), list, get revisions; revert changes |
| **Tables** | Create, list, get, update schema, rename, delete tables |
| **Rows** | Create, list, get, update, patch, rename, delete rows |
| **Files** | Upload files to file fields |
| **Changes** | Get revision changes, table changes, row changes (diffs) |
| **Users** | Get, search users; manage roles |

### Authentication

System API requires JWT authentication:

```bash
# Login to get a token
curl -X POST http://localhost:8080/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { login(data: { username: \"admin\", password: \"admin\" }) { accessToken } }"}'

# Use the token
curl -X POST http://localhost:8080/api/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"query": "{ me { id username } }"}'
```

## REST

The System REST API provides the same operations via HTTP endpoints:

```
POST   /api/organization/:orgId/projects
GET    /api/organization/:orgId/projects/:projectName
DELETE /api/organization/:orgId/projects/:projectName
...
```

See the API explorer at `/api/docs` when running Revisium.

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
