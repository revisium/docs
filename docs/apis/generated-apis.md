---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generated APIs

When you create an endpoint, Revisium auto-generates typed APIs from your table schemas. Both GraphQL and REST are available for each endpoint.

## Creating Endpoints

Endpoints are created in the [Admin UI](../admin-ui/endpoints-mcp) (Management → Endpoints) or via [System API](./system-api) (`createEndpoint` mutation / `POST /api/revision/:revisionId/endpoints`).

## Endpoint URLs

```
GraphQL:  /endpoint/graphql/<username>/<project>/<branch>/head (or /draft)
REST:     /endpoint/rest/<username>/<project>/<branch>/head (or /draft)
```

- **HEAD** — latest committed data, read-only
- **Draft** — current working state, read + write

## Queries

<Tabs>
<TabItem value="graphql" label="GraphQL" default>

```graphql
# Single row
query {
  product(id: "iphone-16") {
    id
    createdAt
    data { title price }
  }
}

# List with filtering, sorting, pagination
query {
  products(data: {
    first: 20
    where: { data: { path: ["price"], gte: 100 } }
    orderBy: [{ data: { path: "price", direction: "desc", type: "float" } }]
  }) {
    edges {
      node { id data { title price } }
      cursor
    }
    pageInfo { hasNextPage endCursor }
    totalCount
  }
}
```

Flat variant (data fields only, no metadata):

```graphql
query {
  productFlat(id: "iphone-16") { title price }
  productsFlat(data: { first: 20 }) {
    edges { node { title price } }
    totalCount
  }
}
```

</TabItem>
<TabItem value="rest" label="REST">

```bash
# Single row
GET /tables/products/row/iphone-16

# List with filtering, sorting, pagination
POST /tables/products/rows
Content-Type: application/json

{
  "first": 20,
  "where": { "data": { "path": ["price"], "gte": 100 } },
  "orderBy": [{ "data": { "path": "price", "direction": "desc", "type": "float" } }]
}
```

</TabItem>
</Tabs>

See [CRUD & Querying](../querying-data/) for full examples, [Filtering](../querying-data/filtering), [Sorting](../querying-data/sorting), [Pagination](../querying-data/pagination).

## Mutations (Draft only)

Draft endpoints generate mutations — create, update, and delete rows. HEAD endpoints are read-only.

<Tabs>
<TabItem value="graphql" label="GraphQL" default>

```graphql
type Mutation {
  createProduct(data: ProjectCreateProductInput!): ProjectProductNode!
  updateProduct(data: ProjectUpdateProductInput!): ProjectProductNode!
  deleteProduct(id: String!): ProjectDeleteResult!
}

input ProjectCreateProductInput {
  id: String!       # row ID
  data: JSON!       # row data matching table schema
}
```

</TabItem>
<TabItem value="rest" label="REST">

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tables/:tableId/row/:rowId` | Create row |
| PUT | `/tables/:tableId/row/:rowId` | Update (replace) row |
| PATCH | `/tables/:tableId/row/:rowId` | Patch row (`replace` only) |
| DELETE | `/tables/:tableId/row/:rowId` | Delete row |

Bulk operations:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tables/:tableId/rows/bulk` | Create rows |
| PUT | `/tables/:tableId/rows/bulk` | Update rows |
| PATCH | `/tables/:tableId/rows/bulk` | Patch rows |
| DELETE | `/tables/:tableId/rows/bulk` | Delete rows |

File upload:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tables/:tableId/row/:rowId/files/:fileId` | Upload file |

</TabItem>
</Tabs>

## Generated Types (GraphQL)

For a table `products` with fields `name` (string) and `price` (number):

```graphql
# Entity type
type ProjectProduct {
  name: String!
  price: Float!
  category: ProjectCategory  # FK auto-resolved
}

# Node type (with metadata)
type ProjectProductNode {
  id: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  data: ProjectProduct!
}

# Flat type (data only)
type ProjectProductFlat {
  name: String!
  price: Float!
}

# Connection type (pagination)
type ProjectProductConnection {
  edges: [ProjectProductEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```

## Response Format (REST)

Single row:

```json
{
  "id": "iphone-16",
  "createdAt": "2026-03-15T10:30:00Z",
  "updatedAt": "2026-03-15T14:20:00Z",
  "readonly": true,
  "data": { "title": "iPhone 16 Pro", "price": 999 }
}
```

Paginated list:

```json
{
  "edges": [
    { "cursor": "...", "node": { "id": "iphone-16", "data": { "title": "iPhone 16 Pro", "price": 999 } } }
  ],
  "pageInfo": { "hasNextPage": true, "endCursor": "..." },
  "totalCount": 156
}
```

## Naming Convention

Type names follow the pattern `{Project}{Table}`:
- Project `blog`, table `posts` → `BlogPost`, `BlogPostNode`, `BlogPostFlat`
- Nested objects: `BlogPostSpecifications`, `BlogPostSpecificationsFlat`

## OpenAPI Spec

REST endpoints include an OpenAPI/Swagger specification with typed request/response schemas generated from your JSON Schema.

## Apollo Federation

GraphQL schemas support Apollo Federation for use in a federated gateway. See [Configuration](./configuration).
