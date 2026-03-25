---
sidebar_position: 1
---

# Dictionary Service with NestJS

Build a typed dictionary service that separates reference data (catalogs, FAQs, categories) from your transactional database — with schema migrations, auto-generated clients, and CI/CD deployment.

:::info Stack used in this guide
This guide uses **NestJS** backend, **Kubernetes** deployment, and **GitHub Actions** CI/CD. The pattern itself is stack-agnostic — adapt it to any language, framework (Express, Fastify, Django, Spring), container orchestrator, or even a monolith with `docker-compose`.

**Revisium runs in two modes:**
- **Local development** — `npx @revisium/standalone` with embedded PostgreSQL, zero config
- **Staging / Production** — either a self-hosted Revisium instance (Docker, K8s) or [Revisium Cloud](https://cloud.revisium.io)

The architecture stays the same — only the Revisium URL changes.
:::

## The Problem

Backend services typically store two fundamentally different types of data in the same database:

- **Transactional** — users, orders, sessions. Created by business logic at runtime. Managed via ORM migrations.
- **Reference** — FAQs, categories, catalogs, configurations. Edited by content managers or AI agents. Changes rarely, read often.

Keeping reference data in your main database creates friction:

- Content managers can't edit data without developer involvement
- Reference data migrations clutter your business migration history
- No visual UI for managing entries
- No versioning — can't roll back a bad content change
- No review process for content updates

## The Solution

Use Revisium as a dedicated microservice for reference data. It provides Admin UI, versioning, REST/GraphQL APIs with OpenAPI spec — out of the box. No need to build CRUD, migrations, or admin panels.

Your backend calls Revisium through a **typed REST client** generated from the endpoint's OpenAPI spec.

```mermaid
graph LR
    subgraph "Your Backend (NestJS)"
        A[FaqApiService<br/><i>generated client</i>]
        B[CatalogApiService<br/><i>generated client</i>]
    end

    subgraph "Revisium"
        E1[Endpoint: faq<br/><i>REST + OpenAPI</i>]
        E2[Endpoint: catalog<br/><i>REST + OpenAPI</i>]
        UI[Admin UI]
        DB[(PostgreSQL)]
    end

    A -- REST --> E1
    B -- REST --> E2
    E1 --> DB
    E2 --> DB
    UI --> DB

    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style E1 fill:#f3e5f5
    style E2 fill:#f3e5f5
    style UI fill:#fff3e0
```

## Multi-Project Architecture

Think of each Revisium project as a ready-made microservice for a specific data domain. You define the schema, and Revisium gives you a versioned REST/GraphQL API with OpenAPI spec, Admin UI, and migrations — in minutes, not days.

Each domain gets its own project, endpoint, and generated client. Domains are versioned independently.

| Project | Tables | Relationships |
|---------|--------|---------------|
| `faq` | `FaqCategory`, `FaqItem` | FaqItem → FaqCategory (FK) |
| `catalog` | `Brand`, `ProductCategory`, `Product` | Product → Brand (FK), Product → ProductCategory (FK) |

Need another reference domain? Create a new project, define the schema, generate a client — done.

## Prerequisites

- Node.js 18+
- An existing NestJS project (or create one with `nest new`)
- `npx @revisium/standalone@latest` (no global install needed)

## Step 1: Start Revisium (Local Development)

For local development, use the standalone mode — it bundles everything (API, Admin UI, embedded PostgreSQL) in a single process:

```bash
npx @revisium/standalone@latest
```

Open Admin UI at [http://localhost:9222](http://localhost:9222).

:::note Production environments
On staging and production, you'll point your backend at a **self-hosted Revisium instance** (e.g., deployed via Helm chart to your K8s cluster) or at **[Revisium Cloud](https://cloud.revisium.io)**. The integration code is identical — only the `REVISIUM_URL` environment variable changes. See [Step 6: Deploy](#step-6-deploy) for details.
:::

## Step 2: Design Your Schema

In the [Admin UI](../admin-ui/):

1. Create a project (e.g., `faq`)
2. Create tables (`FaqCategory`, `FaqItem`) — see [Table Editor](../admin-ui/table-editor)
3. Define schemas using [JSON Schema](../core-concepts/data-modeling) in the [Schema Editor](../admin-ui/schema-editor):

**FaqCategory:**
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "default": "" },
    "slug": { "type": "string", "default": "" }
  },
  "required": ["name", "slug"]
}
```

**FaqItem** (with a [foreign key](../core-concepts/foreign-keys) to `FaqCategory`):
```json
{
  "type": "object",
  "properties": {
    "question": { "type": "string", "default": "" },
    "answer": { "type": "string", "default": "", "contentMediaType": "text/markdown" },
    "order": { "type": "number", "default": 0 },
    "categoryId": { "type": "string", "default": "", "foreignKey": "FaqCategory" }
  },
  "required": ["question", "answer", "order", "categoryId"]
}
```

4. [Commit the revision](../core-concepts/versioning)

## Step 3: Create Endpoint and Generate Client

### Create the endpoint

In Admin UI → Project → [Endpoints](../admin-ui/endpoints-mcp), enable the REST API endpoint. Revisium generates an API with OpenAPI spec for each revision of your project.

Two built-in endpoints are available per branch:
- **Head** — last committed revision, immutable and read-only (production-ready)
- **Draft** — current working revision, writable (includes uncommitted changes)

You can also create **custom endpoints** pinned to a specific revision for stable integrations.

Which one to use depends on your project: **Head** is typical for production clients and CI/CD code generation. **Draft** is useful during development or when your app needs to read and write data before committing.

The URL pattern is:
```
/endpoint/openapi/{org}/{project}/{branch}/head/openapi.json     # OpenAPI spec (head)
/endpoint/openapi/{org}/{project}/{branch}/draft/openapi.json    # OpenAPI spec (draft)
/endpoint/swagger/{org}/{project}/{branch}/head                  # Swagger UI (head)
/endpoint/swagger/{org}/{project}/{branch}/draft                 # Swagger UI (draft)
```

### Generate a typed client

Since Revisium provides a standard OpenAPI spec, you can use any OpenAPI code generator for your language:

| Language / Framework | Generator | Link |
|---------------------|-----------|------|
| TypeScript / Node.js | [@hey-api/openapi-ts](https://heyapi.dev) | [docs](https://heyapi.dev/openapi-ts/get-started) |
| TypeScript / Node.js | [openapi-typescript](https://openapi-ts.dev) | [docs](https://openapi-ts.dev/introduction) |
| Python | [openapi-python-client](https://github.com/openapi-generators/openapi-python-client) | [GitHub](https://github.com/openapi-generators/openapi-python-client) |
| Go | [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) | [GitHub](https://github.com/oapi-codegen/oapi-codegen) |
| Java / Kotlin | [OpenAPI Generator](https://openapi-generator.tech) | [docs](https://openapi-generator.tech/docs/generators) |
| Any language | [OpenAPI Generator](https://openapi-generator.tech) | [docs](https://openapi-generator.tech/docs/generators) |

This guide uses [@hey-api/openapi-ts](https://heyapi.dev) for [NestJS](https://docs.nestjs.com):

```bash
npm install -D @hey-api/openapi-ts @hey-api/client-fetch
```

Add an npm script to `package.json`:

```json
{
  "scripts": {
    "generate:faq-api": "npx @hey-api/openapi-ts -i http://localhost:9222/endpoint/openapi/<org>/<project>/<branch>/head/openapi.json -o src/features/faq/generated -c @hey-api/client-fetch"
  }
}
```

Run it:

```bash
npm run generate:faq-api
```

This generates fully typed functions like `getFaqItems()`, `getFaqItemById()`, etc. See [Generated APIs](../apis/generated-apis) for more details on the available API operations.

## Step 4: Integrate in NestJS

The examples below use the [CQRS pattern](https://docs.nestjs.com/recipes/cqrs) with NestJS — a common approach for separating read and write operations. You can use controllers, resolvers, or any other pattern that fits your project.

Create a service that wraps the generated client:

```typescript
import { Injectable } from '@nestjs/common';
import { getFaqItems, getFaqItemById } from './generated';

@Injectable()
export class FaqApiService {
  async getAll() {
    const { data } = await getFaqItems();
    return data;
  }

  async getById(id: string) {
    const { data } = await getFaqItemById({ path: { id } });
    return data;
  }
}
```

Use it in a CQRS query handler:

```typescript
@QueryHandler(GetFaqQuery)
export class GetFaqHandler implements IQueryHandler<GetFaqQuery> {
  constructor(private readonly faqApi: FaqApiService) {}

  async execute(query: GetFaqQuery) {
    return this.faqApi.getAll();
  }
}
```

## Step 5: Save Migrations and Seed Data

The CLI commands below use the [Revisium CLI](../apis/cli). Install it as a dev dependency:

```bash
npm install -D @revisium/cli
```

### Migrations

Save your schema as a migration file — this is what gets deployed to other environments:

```bash
npm run revisium:save-migrations
# → npx revisium migrate save \
#     --url revisium://admin:admin@localhost:9222/admin/faq/master/draft \
#     --file ./revisium/migrations.json
```

The [Revisium URL](../apis/cli) encodes everything: credentials, host, organization, project, branch, and revision. On localhost, auth defaults to `admin:admin`.

### Seed Data (Optional)

If your app needs baseline data on every environment (default categories, initial FAQ entries), export it:

```bash
npm run revisium:save-data
# → npx revisium rows save \
#     --url revisium://admin:admin@localhost:9222/admin/faq/master/head \
#     --folder ./revisium/data
```

Seed data is stored as JSON files — folders are tables, files are rows:

```
revisium/data/
├── FaqCategory/
│   ├── payment.json       # rowId = "payment"
│   └── delivery.json
└── FaqItem/
    ├── faq-1.json          # rowId = "faq-1"
    └── faq-2.json
```

Commit both `migrations.json` and `data/` to Git.

## Step 6: Deploy

### Where Revisium Runs

| Environment | Revisium Mode | Description |
|-------------|---------------|-------------|
| **Local dev** | `npx @revisium/standalone` | Embedded PostgreSQL, zero config. Each developer runs their own instance |
| **Staging / Production** | **Self-hosted** (Docker, K8s) | Revisium as a microservice in your cluster, own PostgreSQL |
| **Staging / Production** | **[Revisium Cloud](https://cloud.revisium.io)** | Managed instance, no infrastructure to maintain |

Your backend code doesn't change between modes — only the `REVISIUM_URL` environment variable:

```bash
# Local
REVISIUM_URL=http://localhost:9222

# Self-hosted (K8s internal service)
REVISIUM_URL=http://revisium.revisium.svc.cluster.local:8080

# Revisium Cloud
REVISIUM_URL=https://your-org.cloud.revisium.io
```

### Developer Onboarding

A new developer clones the repo and gets a working Revisium with all schemas and data:

```bash
git clone <repo> && cd <repo> && npm install

# Start Revisium (empty DB on first run)
npx @revisium/standalone@latest

# Apply migrations + load seed data
npm run revisium:seed
# → npx revisium migrate apply --url revisium://admin:admin@localhost:9222/admin/faq/master --file ./revisium/migrations.json --commit
# → npx revisium rows upload --url revisium://admin:admin@localhost:9222/admin/faq/master/draft --folder ./revisium/data --commit

# Start backend
npm run start:dev
```

### CI/CD: Applying Migrations on Deploy

Migrations are baked into the Docker image and applied idempotently at startup — same pattern as Prisma:

```mermaid
graph LR
    A[git push] --> B[Docker build<br/><i>migrations.json in image</i>]
    B --> C[Deploy]
    C --> D[Container starts]
    D --> E[Apply migrations]
    E --> F[Start app]

    style A fill:#e8f5e9
    style B fill:#e3f2fd
    style C fill:#e3f2fd
    style D fill:#fff3e0
    style E fill:#fff3e0
    style F fill:#e8f5e9
```

In `package.json`:

```json
{
  "scripts": {
    "start:prod": "npm run revisium:seed && node dist/src/main"
  }
}
```

Migrations are idempotent — safe to run on every container restart.

### Production Architecture (Self-Hosted, K8s Example)

This is one possible deployment topology. You can adapt it to `docker-compose`, ECS, or any container runtime.

```mermaid
graph TB
    subgraph "Kubernetes Cluster"
        subgraph "Your App"
            BE[NestJS Backend<br/><i>Deployment</i>]
        end

        subgraph "Revisium"
            RC[revisium-core<br/>+ revisium-endpoint]
            RUI[Admin UI<br/><i>Ingress</i>]
            RPG[(PostgreSQL<br/><i>StatefulSet</i>)]
        end

        BE -- "REST (typed)" --> RC
        RC --> RPG
        RUI --> RC
    end

    CM[Content Manager] --> RUI

    style BE fill:#e1f5fe
    style RC fill:#f3e5f5
    style RUI fill:#fff3e0
    style RPG fill:#fce4ec
    style CM fill:#e8f5e9
```

:::tip Using Revisium Cloud instead?
Skip the Revisium infrastructure entirely. Point your backend at your Cloud URL, and content managers use the hosted Admin UI. Migrations are applied via CLI against the Cloud API — same `revisium:seed` command, different URL.
:::

## What Lives in Git

```
your-project/
├── revisium/
│   ├── migrations.json        ← schemas + structure
│   └── data/                  ← seed data (optional)
│       ├── FaqCategory/
│       │   └── payment.json
│       └── FaqItem/
│           └── faq-1.json
├── .revisium/                 ← .gitignore (local embedded DB)
└── src/features/
    ├── faq/
    │   ├── generated/         ← typed client from endpoint
    │   └── faq-api.service.ts
    └── catalog/
        ├── generated/
        └── catalog-api.service.ts
```

## Workflow: Changing the Schema

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant UI as Admin UI
    participant CLI as CLI
    participant Git as Git

    Dev->>UI: Modify schema (add field/table)
    Dev->>UI: Verify in draft revision
    Dev->>UI: Commit revision
    Dev->>UI: Recreate endpoint (if new tables)
    Dev->>CLI: npm run generate:faq-api
    Dev->>CLI: npm run revisium:save-migrations
    Dev->>CLI: npm run revisium:save-data (if seed changed)
    Dev->>Git: commit migrations.json + generated/ + data/
```

See also: [Schema Editor](../admin-ui/schema-editor) for editing schemas, [Changes & Diff](../admin-ui/changes-diff) for reviewing changes before commit, [Migrations](../migrations/) for the full migration workflow.

## Revisium vs Alternatives

| Aspect | Prisma (same DB) | Hardcoded JSON | Headless CMS (Strapi) | Revisium |
|--------|-------------------|----------------|----------------------|----------|
| **Purpose** | Transactional data | Static config | Content management | Reference data |
| **Schema** | `.prisma` file | Manual types | Admin panel | JSON Schema in Admin UI |
| **Migrations** | SQL files | N/A | Plugin-dependent | JSON snapshot |
| **Typed Client** | `PrismaClient` | Manual | SDK / REST | Generated from OpenAPI |
| **Versioning** | Migrations only | Git | None | Branches, revisions, rollback |
| **UI** | Prisma Studio (dev) | None | Built-in | Admin UI (production-ready) |
| **Who edits** | Developer | Developer | Content team | Content team / AI agent |
| **Content review** | No | PR review | Workflow plugins | Built-in draft → commit |
| **Rollback** | Manual SQL | `git revert` | No | One-click revert |

## Key Takeaways

- **Prisma for business domain, Revisium for reference data** — clear separation of concerns
- **Content managers work autonomously** through Admin UI — no PRs for content changes
- **Full type safety** via OpenAPI code generation — same DX as Prisma
- **Git-like workflow** for content: draft → review → commit → rollback
- **Same migration pattern** as Prisma: save to file → commit to Git → apply on deploy
