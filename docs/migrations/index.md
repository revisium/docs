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
2. Export and generate migrations automatically
3. Apply via CI/CD — guaranteed consistency

## How It Works

```
1. Modify schema in Admin UI
   ↓
2. Export: npx revisium schema save --folder ./schemas
   ↓
3. Generate: npx revisium migrate create-migrations --schemas-folder ./schemas --file ./migrations/migrations.json
   ↓
4. Commit to Git
   ↓
5. CI/CD applies to staging → production
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
# 1. Export schemas from your Revisium instance
npx revisium schema save --folder ./schemas

# 2. Generate migrations
npx revisium migrate create-migrations \
  --schemas-folder ./schemas \
  --file ./migrations/migrations.json

# 3. Apply to target environment
npx revisium migrate apply \
  --file ./migrations/migrations.json

# 4. Commit the new revision
npx revisium revision create
```

## Idempotent Application

Applied migrations are tracked in the `revisium_migration_table` system table. Running `migrate apply` multiple times is safe — already-applied migrations are skipped.

## Sections

- [CLI Reference](./cli-reference) — all schema and migration commands
- [Migration Format](./migration-format) — detailed format specification
- [CI/CD](./ci-cd) — GitHub Actions, GitLab CI, Docker, Kubernetes
