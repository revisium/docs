---
sidebar_position: 1
---

# Dictionary Service

Use Revisium as a centralized reference data service with schema migrations and multi-environment synchronization.

## When to Use

- Product catalogs, pricing data, inventories
- Reference dictionaries (categories, currencies, countries)
- Configuration data shared across microservices
- Any structured data that needs to be consistent across environments

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Service A  │────▶│  Revisium   │◀────│  Service B  │
│  (backend)  │ REST│  (source of │ GQL │  (backend)  │
└─────────────┘     │   truth)    │     └─────────────┘
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Admin UI   │
                    │  (manage)   │
                    └─────────────┘
```

Services consume data via auto-generated REST or GraphQL APIs. Data is managed in the Admin UI or via the System API. Schema changes are deployed via migrations.

## Key Features

- **Schema Migrations** — export schemas, generate migrations, apply via CI/CD across dev → staging → production
- **Foreign Keys** — referential integrity between related tables (e.g., products → categories)
- **REST + GraphQL** — auto-generated typed APIs from your schema
- **Versioning** — optional commit workflow for audit trail

## Workflow

1. Design schemas in Admin UI on dev instance
2. Export: `npx revisium schema save --folder ./schemas`
3. Generate: `npx revisium migrate create-migrations --schemas-folder ./schemas --file ./migrations/migrations.json`
4. Commit to Git
5. CI/CD applies migrations to staging, then production

## Integration Patterns

### Backend Service (NestJS)

```typescript
import { RevisiumClient } from '@revisium/client';

const revisium = new RevisiumClient({
  url: process.env.REVISIUM_URL,
  username: process.env.REVISIUM_USER,
  password: process.env.REVISIUM_PASS,
});

// Or use the generated GraphQL endpoint directly
const response = await fetch('https://revisium.example.com/endpoint/categories');
```

### Frontend (Apollo Client)

```typescript
const client = new ApolloClient({
  uri: 'https://revisium.example.com/endpoint/graphql',
});

const { data } = await client.query({
  query: gql`
    query {
      categories { edges { node { data { name slug } } } }
    }
  `,
});
```

## Example: E-commerce Product Catalog

**Tables:** `categories`, `products`, `tags`
**Relationships:** products → categories (FK), products → tags (FK array)

See [Core Concepts](../core-concepts/) for schema design, [Migrations](../migrations/) for deployment workflow.

:::tip Full Guide
For a complete step-by-step walkthrough with NestJS integration, typed client generation, seed data, and CI/CD — see the [Dictionary Service with NestJS](../guides/dictionary-service-nestjs) guide.
:::
