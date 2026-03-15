---
sidebar_position: 1
---

# CLI Reference

The [revisium-cli](https://github.com/revisium/revisium-cli) provides commands for schema export, migration generation, and application.

## Environment Variables

Set these to configure the CLI target:

| Variable | Description |
|----------|-------------|
| `REVISIUM_API_URL` | Revisium instance URL (e.g., `http://localhost:8080`) |
| `REVISIUM_USERNAME` | Login username |
| `REVISIUM_PASSWORD` | Login password |
| `REVISIUM_ORGANIZATION` | Organization ID |
| `REVISIUM_PROJECT` | Project name |
| `REVISIUM_BRANCH` | Branch name (default: `master`) |

## Schema Commands

### `schema save`

Export all table schemas to local files:

```bash
npx revisium schema save --folder ./schemas
```

Creates one JSON file per table in the specified folder (e.g., `schemas/Product.json`).

### `schema list`

List all tables in the current project:

```bash
npx revisium schema list
```

### `schema get`

Get a specific table's schema:

```bash
npx revisium schema get Product
```

## Migration Commands

### `migrate create-migrations`

Generate migrations from exported schema files:

```bash
npx revisium migrate create-migrations \
  --schemas-folder ./schemas \
  --file ./migrations/migrations.json
```

- New tables → `init` migration
- Modified tables → `update` migration (JSON Patch)
- Unchanged tables → skipped

### `migrate apply`

Apply migrations to a Revisium instance:

```bash
npx revisium migrate apply \
  --file ./migrations/migrations.json
```

Process:
1. Load and parse migrations file
2. Filter already-applied migrations (checked against `revisium_migration_table` table)
3. Sort by ID (chronological)
4. Validate dependencies (FK references)
5. Apply each migration
6. Record in `revisium_migration_table` table

### `migrate validate`

Validate a migration file without applying:

```bash
npx revisium migrate validate --file ./migrations/migrations.json
```

Checks: JSON syntax, required fields, valid JSON Schema, FK dependencies, hash integrity.

## Revision Commands

### `revision create`

Commit the current draft (create a new revision):

```bash
npx revisium revision create
```

### `revision list`

List all revisions:

```bash
npx revisium revision list
```

## Typical Workflow

```bash
# 1. Make changes via Admin UI

# 2. Export schemas
npx revisium schema save --folder ./schemas

# 3. Generate migrations
npx revisium migrate create-migrations \
  --schemas-folder ./schemas \
  --file ./migrations/migrations.json

# 4. Review changes
git diff migrations/migrations.json

# 5. Commit to Git
git add schemas/ migrations/
git commit -m "Add description field to Product"

# 6. CI/CD applies to staging/production
```
