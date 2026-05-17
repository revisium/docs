---
sidebar_position: 1
sidebar_label: Revisium
title: Revisium
slug: /
hide_title: true
---

import Screenshot from '@site/src/components/Screenshot';
import { ScreenshotRow } from '@site/src/components/Screenshot';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<h1>Revisium</h1>

<p className="intro-tagline">Model any structured data. Serve it through generated APIs.</p>

<p className="intro-usecases">Revisium helps teams describe data with JSON Schema, edit it safely in the Admin UI, and expose it to apps, services, and agents through REST, GraphQL, CLI, and MCP. Draft, HEAD, branches, and revisions are the workflow layer for reviewing and publishing changes when you need it.</p>

<div className="intro-workflow-line" aria-label="Revisium workflow">
  <span>Model schema</span>
  <span>Edit structured data</span>
  <span>Validate every write</span>
  <span>Use generated APIs</span>
</div>

<div className="intro-route-grid">
  <a className="intro-route intro-route-primary" href="https://cloud.revisium.io">
    <span className="intro-route-kicker">Cloud Early Access</span>
    <strong>Start in the hosted sandbox</strong>
    <span>Try Revisium without local setup. Best for evaluation, demos, and early projects.</span>
  </a>
  <a className="intro-route" href="./quick-start">
    <span className="intro-route-kicker">Start here</span>
    <strong>Run the Draft-to-API workflow</strong>
    <span>Create a project, model a table, add data, and query it through a generated endpoint.</span>
  </a>
  <a className="intro-route" href="./core-concepts/">
    <span className="intro-route-kicker">Learn the model</span>
    <strong>Schemas, tables, APIs, revisions</strong>
    <span>Learn how Revisium organizes structured data, generated interfaces, and safe change workflows.</span>
  </a>
  <a className="intro-route" href="./use-cases/">
    <span className="intro-route-kicker">Map a use case</span>
    <strong>CMS, catalogs, config, AI memory</strong>
    <span>See where Revisium fits in common product and platform workflows.</span>
  </a>
</div>

:::note Cloud status
Revisium Cloud is currently in Early Access: use it as a hosted sandbox for evaluation and early projects. For production workloads that require full operational control, use self-hosted Docker or Kubernetes.
:::

## Common Use Cases

Revisium fits best when structured data needs validation, reviewable changes, revision history, and programmatic access.

<div className="intro-usecase-grid">
  <div className="intro-usecase-card">
    <strong>Content-backed products</strong>
    <span>Model pages, entries, media, and localized content without hard-coding every change.</span>
  </div>
  <div className="intro-usecase-card">
    <strong>Catalogs and reference data</strong>
    <span>Maintain product catalogs, taxonomies, lookup tables, and shared dictionaries with schema validation.</span>
  </div>
  <div className="intro-usecase-card">
    <strong>Operational configuration</strong>
    <span>Review settings changes before they reach apps, services, or environments.</span>
  </div>
  <div className="intro-usecase-card">
    <strong>Agent-accessible data</strong>
    <span>Expose schema-aware storage that agents can read and update through MCP.</span>
  </div>
  <div className="intro-usecase-card">
    <strong>Team-owned data workflows</strong>
    <span>Give non-developers an Admin UI while keeping APIs, revisions, and export paths available for engineers.</span>
  </div>
</div>

## Where Revisium Fits

Revisium acts as a schema-based workspace between data operators and runtime consumers. Teams model structured data once, edit it through visual or programmatic interfaces, and expose it through generated APIs. Draft, HEAD, branches, and revisions add reviewable change management on top of that model.

<div className="intro-architecture-map-core" role="img" aria-label="Revisium core workspace architecture map">
  <div className="intro-core-side">
    <span className="intro-architecture-label">Manage</span>
    <strong>People & Agents</strong>
    <span>Admin UI, CLI, GraphQL, MCP</span>
  </div>

  <div className="intro-core-center">
    <span className="intro-architecture-label">Revisium</span>
    <strong>Structured Data Workspace</strong>
    <div className="intro-core-lane">
      <span>JSON Schema model</span>
      <b aria-hidden="true">→</b>
      <span>Generated APIs</span>
    </div>
    <div className="intro-core-pills">
      <span>Draft & HEAD</span>
      <span>Relations</span>
      <span>Computed fields</span>
      <span>Files</span>
    </div>
    <div className="intro-core-api">Generated APIs: REST, GraphQL, MCP</div>
  </div>

  <div className="intro-core-side">
    <span className="intro-architecture-label">Consume</span>
    <strong>Apps & Services</strong>
    <span>Read stable data from generated interfaces</span>
  </div>

  <div className="intro-core-storage">
    <span className="intro-architecture-label">Storage</span>
    <strong>PostgreSQL</strong>
  </div>
</div>

## Core Capabilities

### One Platform, Many Interfaces

Work with Revisium however fits your workflow — all interfaces access the same data.

- Admin UI — visual schema design, data editing, change review — no code needed
- GraphQL — system API for management + auto-generated typed queries from your schema
- REST — system API + auto-generated OpenAPI endpoints
- MCP — AI agents create schemas, manage data, and commit via Model Context Protocol
- CLI — export schemas and data, generate migrations, seed instances, apply across environments in CI/CD

### Admin UI

Visual schema editor, table views with filters/sorts, row editor, diff viewer, change review, branch management, and more.

<Screenshot alt="Admin UI — table editor with filtering, nested field columns, and inline editing" src="/img/screenshots/admin-ui-table-editor.png" />

[Learn more →](./admin-ui/)

### Data Modeling

Model any data structure based on JSON Schema — strings, numbers, booleans, nested objects, arrays of objects. Schema is enforced on every write.

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
        "tags": { "type": "array", "items": { "type": "string", "default": "" } }
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
  "required": ["title", "price", "inStock", "specs", "variants"]
}
```

</TabItem>
</Tabs>

[Learn more →](./core-concepts/data-modeling)

### Foreign Keys

Referential integrity between tables — validation on write, cascade rename, delete protection. FK fields are auto-resolved in generated APIs.

<Tabs>
<TabItem value="data" label="Data" default>

```json
{
  "title": "iPhone 16 Pro",
  "category": "electronics",
  "relatedProducts": ["macbook-m4", "airpods-pro"]
}
```

`category` → row in `categories` table, `relatedProducts` → array of rows in `products` table.

</TabItem>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "category": {
      "type": "string",
      "default": "",
      "foreignKey": "categories"
    },
    "relatedProducts": {
      "type": "array",
      "items": { "type": "string", "default": "", "foreignKey": "products" }
    }
  },
  "required": ["title", "category", "relatedProducts"]
}
```

</TabItem>
</Tabs>

[Learn more →](./core-concepts/foreign-keys)

### Computed Fields

Read-only fields with `x-formula` expressions — 40+ built-in functions, aggregations over arrays.

<Tabs>
<TabItem value="data" label="Data" default>

```json
{
  "title": "iPhone 16 Pro",
  "price": 999,
  "quantity": 50,
  "total": 49950,
  "inStock": true,
  "label": "iPhone 16 Pro — $999"
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
    "quantity": { "type": "number", "default": 0 },
    "total": {
      "type": "number", "default": 0, "readOnly": true,
      "x-formula": { "version": 1, "expression": "price * quantity" }
    },
    "inStock": {
      "type": "boolean", "default": false, "readOnly": true,
      "x-formula": { "version": 1, "expression": "quantity > 0" }
    },
    "label": {
      "type": "string", "default": "", "readOnly": true,
      "x-formula": { "version": 1, "expression": "title + \" — $\" + price" }
    }
  },
  "required": ["title", "price", "quantity", "total", "inStock", "label"],
  "additionalProperties": false
}
```

</TabItem>
</Tabs>

<Screenshot alt="Computed fields in table — label, inStock, total calculated automatically" src="/img/screenshots/computed-table.png" />

<Screenshot alt="Computed fields in row editor — formula icon on computed values" src="/img/screenshots/computed-row.png" />

`total`, `inStock`, `label` are computed automatically from `title`, `price`, `quantity`.

[Learn more →](./core-concepts/computed-fields)

### Files

File attachments at any schema level — images, documents, galleries. Use local storage for standalone and simple single-node deployments, or S3-compatible storage for production and multi-node deployments. Embed file fields directly in your tables, or create a dedicated assets table for reuse.

The `fileId` identifies the upload slot; the public `url` is generated from the stored file hash.

<Tabs>
<TabItem value="data" label="Data" default>

```json
{
  "title": "iPhone 16 Pro",
  "cover": {
    "status": "uploaded",
    "fileId": "abc123",
    "url": "http://localhost:9222/files/a1b2c3d4e5f6",
    "fileName": "cover.jpg",
    "hash": "a1b2c3d4e5f6...",
    "extension": "jpg",
    "mimeType": "image/jpeg",
    "size": 340000,
    "width": 1200,
    "height": 800
  },
  "gallery": [
    {
      "status": "uploaded",
      "fileId": "def456",
      "url": "http://localhost:9222/files/f6e5d4c3b2a1",
      "fileName": "front.jpg",
      "hash": "f6e5d4c3b2a1...",
      "extension": "jpg",
      "mimeType": "image/jpeg",
      "size": 280000,
      "width": 1200,
      "height": 800
    },
    {
      "status": "uploaded",
      "fileId": "ghi789",
      "url": "http://localhost:9222/files/0a1b2c3d4e5f",
      "fileName": "back.jpg",
      "hash": "0a1b2c3d4e5f...",
      "extension": "jpg",
      "mimeType": "image/jpeg",
      "size": 310000,
      "width": 1200,
      "height": 800
    }
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
    "cover": { "$ref": "urn:jsonschema:io:revisium:file-schema:1.0.0" },
    "gallery": {
      "type": "array",
      "items": { "$ref": "urn:jsonschema:io:revisium:file-schema:1.0.0" }
    }
  },
  "required": ["title", "cover", "gallery"]
}
```

</TabItem>
</Tabs>

[Learn more →](./core-concepts/files)

### Versioning & Branches

Not row-level versioning. Not table-level versioning. **Project-level versioning** — one commit captures a full snapshot of all tables, schemas, and data.

```
Revision #3 (immutable snapshot)
├── Table: products    — schema + 150 rows
├── Table: categories  — schema + 12 rows
├── Table: settings    — schema + 1 row
└── Table: users       — schema + 45 rows
```

Like `git commit` — but for your entire database. Branches, drafts, full history, diff between any two revisions, rollback to any point.

Versioning is optional — you can work in draft indefinitely without ever committing, just like any other database.

<Screenshot alt="Branch Map — branches, revisions, and API endpoints" src="/img/screenshots/branch-map.png" />

<Screenshot alt="Row diff — field-level changes with old and new values" src="/img/screenshots/row-diff.png" />

[Learn more →](./core-concepts/versioning)

### Schema Evolution

Change types, add/remove/move fields — existing data transforms automatically. No manual data migration needed.

- **Add field** — existing rows get the default value
- **Remove field** — data cleaned from all rows
- **Change type** — automatic conversion (string ↔ number ↔ boolean)
- **Move field** — field relocated, data preserved

<Screenshot alt="Schema Evolution — review changes before applying (field added, field removed)" src="/img/screenshots/schema-evolution.png" />

[Learn more →](./core-concepts/schema-evolution)

### Migrations CLI

Auto-generated migrations, portable across environments via CI/CD.

```bash
# Export migrations from source instance
npx revisium migrate save --file ./migrations.json

# Apply to target instance
npx revisium migrate apply --file ./migrations.json
```

[Learn more →](./migrations/)

### Data Portability

Download your schemas and data at any time. Upload to seed a new instance or restore from backup. You own your data — export it, version it in Git, move it between environments.

```bash
# Download all schemas
npx revisium schema save --folder ./schemas

# Download all data
npx revisium data save --folder ./data

# Upload to another instance
npx revisium data apply --folder ./data
```

[Learn more →](./migrations/)

### APIs

Two layers: system API for management + auto-generated typed APIs from your schema.

<Tabs>
<TabItem value="gen-graphql" label="Generated GraphQL" default>

Auto-generated typed schema from your tables. Filtering, sorting, pagination, FK resolution.

```graphql
query {
  products(data: {
    where: { data: { path: ["category"], equals: "electronics" } }
    orderBy: [{ data: { path: "price", direction: "desc", type: "float" } }]
    first: 10
  }) {
    edges {
      node { data { title, price, category { name } } }
    }
  }
}
```

Response:

```json
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "data": {
              "title": "iPhone 16 Pro",
              "price": 999,
              "category": { "name": "Electronics" }
            }
          }
        }
      ]
    }
  }
}
```

Generated schema (excerpt):

```graphql
type ProjectProduct {
  title: String!
  price: Float!
  category: ProjectCategory  # FK auto-resolved
}

type ProjectProductNode {
  id: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  data: ProjectProduct!
}

type Query {
  product(id: String!): ProjectProductNode
  products(data: ProjectGetProductsInput): ProjectProductConnection
}
```

</TabItem>
<TabItem value="gen-rest" label="Generated REST">

Auto-generated OpenAPI endpoints for each table.

```bash
GET /endpoint/rest/<org>/<project>/<branch>/head/tables/products/row/iphone-16
```

Response:

```json
{
  "id": "iphone-16",
  "versionId": "R0OIlByTNIo...",
  "createdId": "UowRo8yO_AD...",
  "createdAt": "2026-03-15T10:30:00Z",
  "updatedAt": "2026-03-15T14:20:00Z",
  "publishedAt": "2026-03-15T10:30:00Z",
  "readonly": true,
  "data": {
    "title": "iPhone 16 Pro",
    "price": 999,
    "category": "electronics"
  }
}
```

Generated OpenAPI spec (excerpt):

```yaml
paths:
  /tables/products/row/{rowId}:
    get:
      operationId: get_products
      summary: Get products by ID
  /tables/products/rows:
    post:
      operationId: query_products
      summary: Query products rows
components:
  schemas:
    Products:
      type: object
      properties:
        title: { type: string }
        price: { type: number }
        category: { type: string }
```

</TabItem>
<TabItem value="sys-graphql" label="System GraphQL">

Full platform management — projects, branches, tables, rows, revisions.

```graphql
# POST /graphql
mutation {
  createTable(data: {
    revisionId: "<draftRevisionId>"
    tableId: "products"
    schema: { ... }
  }) { id }
}
```

Response:

```json
{
  "data": {
    "createTable": {
      "id": "products"
    }
  }
}
```

</TabItem>
<TabItem value="sys-rest" label="System REST">

Same operations via REST endpoints.

```bash
POST /api/revision/<draftRevisionId>/tables/products/create-row
Content-Type: application/json

{ "rowId": "iphone-16", "data": { "title": "iPhone 16 Pro", "price": 999 } }
```

Response:

```json
{
  "id": "iphone-16",
  "versionId": "SN37liH-kBe...",
  "createdAt": "2026-03-15T10:30:00Z",
  "updatedAt": "2026-03-15T10:30:00Z",
  "readonly": false,
  "data": {
    "title": "iPhone 16 Pro",
    "price": 999
  }
}
```

</TabItem>
<TabItem value="mcp" label="MCP">

AI agents interact via Model Context Protocol — full CRUD, schema design, commits.

```bash
claude mcp add --transport http revisium http://localhost:9222/mcp
```

```
You: Create a "products" table with title, price, and category fields
Claude: [Uses createTable tool] Created table "products" with 3 fields.

You: Add row "iphone-16" with title "iPhone 16 Pro" and price 999
Claude: [Uses createRow tool] Created row "iphone-16" in products.
```

</TabItem>
</Tabs>

[Learn more →](./apis/)

### Platform Hierarchy

Separate teams, projects, and environments. Each with its own branches, version history, and API endpoints.

[Learn more →](./core-concepts/platform-hierarchy)

### Self-Hosted

Apache 2.0, your infrastructure, no vendor lock-in. Or use [Revisium Cloud Early Access](https://cloud.revisium.io) as the hosted evaluation sandbox.

- **Standalone** — `npx @revisium/standalone@latest` (embedded PostgreSQL, zero config)
- **Docker Compose** — full stack with PostgreSQL, recommended for production
- **Kubernetes** — Helm chart, horizontal scaling

[Learn more →](./deployment/)

## Next Steps

- **[Quick Start](./quick-start)** — Create a project and explore generated APIs
- **[Core Concepts](./core-concepts/)** — Data model, schemas, versioning
- **[Admin UI](./admin-ui/)** — Visual schema design and data management
- **[APIs](./apis/)** — System API, generated APIs, MCP
- **[Use Cases](./use-cases/)** — Headless CMS, Dictionary, Config Store, AI Memory
