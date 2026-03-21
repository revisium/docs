---
sidebar_position: 7
---

# Migrations

Migrations are declarative schema changes that can be version-controlled, applied via CI/CD, and reproduced across environments. They provide an alternative to branching when independent Revisium instances are used (e.g., dev → staging → production).

## Why Migrations?

Without migrations:
1. Update schema in dev via Admin UI
2. Manually replicate in staging
3. Manually replicate in production
4. Risk inconsistencies and human error

With migrations:
1. Design schema in dev via Admin UI
2. Export migrations
3. Apply via CI/CD — guaranteed consistency

## How It Works

```
+-----------------------------------------------------+
|  Dev Instance (source of truth)                     |
|                                                     |
|  1. Design schema in Admin UI                       |
|  2. Add tables, modify fields, test with data       |
|  3. revisium migrate save --file migrations.json    |
+----------------------------+------------------------+
                             |
               migrations.json (Git) or Docker image (registry)
                             |
              +--------------+--------------+
              |                             |
              v                             v
+----------------------+     +----------------------+
|  Staging             |     |  Production          |
|  migrate apply       |     |  migrate apply       |
|  --commit            |     |  --commit            |
|  test and verify     |     |  same schema         |
+----------------------+     +----------------------+
```

Or sync directly without files:

```
Dev ---revisium sync schema---> Staging
Dev ---revisium sync schema---> Production
```

## Migration Types

| Type | Purpose | Key field |
|------|---------|-----------|
| `init` | Create a new table | `schema` (full JSON Schema) |
| `update` | Modify existing schema | `schemaPatch` (JSON Patch operations) |
| `rename` | Rename a table | `newTableId` |
| `remove` | Delete a table | — |

## Quick Start

```bash
# 1. Export migrations from source instance
npx revisium migrate save --file ./migrations.json \
  --url revisium://localhost:9222/admin/my-project/master

# 2. Apply to target instance
npx revisium migrate apply --file ./migrations.json --commit \
  --url revisium://staging.example.com/admin/my-project/master?token=...
```

Or sync directly without files:

```bash
npx revisium sync schema \
  --source revisium://localhost:9222/admin/my-project/master \
  --target revisium://staging.example.com/admin/my-project/master?token=... \
  --commit
```

## Idempotent Application

Applied migrations are tracked in the `revisium_migration_table` system table. Running `migrate apply` multiple times is safe — already-applied migrations are skipped.

## Best Practices

- **Single source of truth** — schema changes should originate from one instance (e.g., dev). Don't create migrations independently in multiple environments — this leads to conflicts.
- **One direction** — migrations flow dev → staging → production, never backwards.
- **Version control** — commit migration files to Git alongside your code. Review schema changes in pull requests.
- **Test first** — always apply to staging before production.

## Sections

- [CLI](../apis/cli) — all commands: schema, migrate, rows, sync
- [Migration Format](../architecture/specs/migration-format) — detailed format specification
- [CI/CD](./ci-cd) — GitHub Actions, GitLab CI, Docker, Kubernetes
- [Admin UI](../admin-ui/migrations) — upload and apply migrations from the browser
