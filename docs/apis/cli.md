---
sidebar_position: 1
---

# CLI Reference

The [revisium-cli](https://github.com/revisium/revisium-cli) provides commands for schema management, migrations, data export/import, and synchronization between Revisium instances.

## Connection URL

All commands use the `revisium://` protocol to connect:

```
revisium://host/org/project/branch?token=...
```

| Part | Example | Description |
|------|---------|-------------|
| `host` | `cloud.revisium.io`, `localhost:9222` | Revisium instance |
| `org` | `admin` | Organization (= username) |
| `project` | `my-project` | Project name |
| `branch` | `master` | Branch name |
| `?token=...` | JWT token | Authentication (optional for standalone without auth) |

### Examples

```bash
# Cloud
revisium://cloud.revisium.io/myuser/my-project/master?token=eyJ...

# Standalone (no auth)
revisium://localhost:9222/admin/my-project/master

# Docker
revisium://localhost:8080/admin/my-project/master?token=eyJ...
```

### Authentication

When connecting to a Revisium instance, the CLI supports multiple auth methods:

- **Token** — paste a JWT from the Admin UI (Settings > Get Token)
- **API Key** — paste a personal or service API key (`rev_...`). Sends via `X-Api-Key` header. Recommended for programmatic and repeated local use.
- **Username & Password** — enter credentials directly or set via env vars

```bash
# JWT token
revisium://localhost:9222/admin/my-project/master?token=eyJ...

# API key (via apikey parameter or auto-detected by rev_ prefix in token)
revisium://localhost:9222/admin/my-project/master?apikey=rev_xxxxxxxxxxxxxxxxxxxx
```

### Environment Variables

Instead of `--url`, set these:

| Variable | Description |
|----------|-------------|
| `REVISIUM_URL` | Default connection URL |
| `REVISIUM_TOKEN` | JWT token |
| `REVISIUM_API_KEY` | API key (`rev_...`) — sends via `X-Api-Key` header |
| `REVISIUM_USERNAME` | Username (for auto-login) |
| `REVISIUM_PASSWORD` | Password (for auto-login) |

### Interactive Mode

If `--url` is not provided and no environment variables are set, the CLI prompts interactively for connection details.

---

## schema

### `schema save`

Export all table schemas to local JSON files:

```bash
npx revisium schema save \
  --folder ./schemas \
  --url revisium://localhost:9222/admin/my-project/master
```

Creates one file per table: `./schemas/products.json`, `./schemas/categories.json`, etc.

### `schema create-migrations`

Generate migration file from exported schemas:

```bash
npx revisium schema create-migrations \
  --schemas-folder ./schemas \
  --file ./migrations.json
```

- Analyzes foreign key dependencies between tables
- Sorts tables in dependency order
- Generates `init` migration for each table
- Computes SHA-1 hash for integrity

---

## migrate

### `migrate save`

Export migrations from a Revisium instance to a local file:

```bash
npx revisium migrate save \
  --file ./migrations.json \
  --url revisium://localhost:9222/admin/my-project/master
```

### `migrate apply`

Apply migrations from a local file to a Revisium instance:

```bash
npx revisium migrate apply \
  --file ./migrations.json \
  --url revisium://localhost:9222/admin/my-project/master
```

Options:

| Flag | Default | Description |
|------|---------|-------------|
| `-f, --file` | required | Migration JSON file |
| `-c, --commit` | `false` | Create a revision after applying |

Already-applied migrations are skipped (idempotent).

### Typical Workflow

The most common workflow — export migrations from one instance, apply to another:

```bash
# 1. Export migrations from dev
npx revisium migrate save --file ./migrations.json \
  --url revisium://localhost:9222/admin/my-project/master

# 2. Apply to staging
npx revisium migrate apply --file ./migrations.json --commit \
  --url revisium://staging.example.com/admin/my-project/master?token=...

# 3. Apply to production
npx revisium migrate apply --file ./migrations.json --commit \
  --url revisium://prod.example.com/admin/my-project/master?token=...
```

### Initial Migration Generation

If you don't have a migration file yet (first time), generate one from existing schemas:

```bash
# 1. Export schemas
npx revisium schema save --folder ./schemas \
  --url revisium://localhost:9222/admin/my-project/master

# 2. Generate migrations from schemas
npx revisium schema create-migrations \
  --schemas-folder ./schemas --file ./migrations.json
```

---

## rows

### `rows save`

Export all row data to local JSON files:

```bash
npx revisium rows save \
  --folder ./data \
  --url revisium://localhost:9222/admin/my-project/master
```

Creates directory structure: `./data/products/iphone-16.json`, `./data/products/macbook-m4.json`, etc.

Options:

| Flag | Default | Description |
|------|---------|-------------|
| `-f, --folder` | required | Output folder |
| `-t, --tables` | all | Comma-separated table IDs to export |

```bash
# Export specific tables only
npx revisium rows save --folder ./data --tables products,categories \
  --url revisium://localhost:9222/admin/my-project/master
```

### `rows upload`

Upload row data from local files to a Revisium instance:

```bash
npx revisium rows upload \
  --folder ./data \
  --url revisium://localhost:9222/admin/my-project/master
```

Options:

| Flag | Default | Description |
|------|---------|-------------|
| `-f, --folder` | required | Folder with row files |
| `-t, --tables` | all | Comma-separated table IDs to upload |
| `-c, --commit` | `false` | Create a revision after uploading |
| `--batch-size` | `100` | Rows per batch for bulk operations |

- Validates rows against table schema before upload
- Respects foreign key dependency order
- Creates new rows or updates existing ones
- Reports statistics: created, updated, skipped, errors

```bash
# Upload with commit and custom batch size
npx revisium rows upload --folder ./data --commit --batch-size 50 \
  --url revisium://localhost:9222/admin/my-project/master
```

---

## sync

Synchronize directly between two Revisium instances — no intermediate files needed.

### `sync all`

Sync both schemas (migrations) and data from source to target:

```bash
npx revisium sync all \
  --source revisium://localhost:9222/admin/my-project/master \
  --target revisium://staging.example.com/admin/my-project/master?token=...
```

### `sync schema`

Sync schema migrations only:

```bash
npx revisium sync schema \
  --source revisium://localhost:9222/admin/my-project/master \
  --target revisium://staging.example.com/admin/my-project/master?token=...
```

### `sync data`

Sync row data only:

```bash
npx revisium sync data \
  --source revisium://localhost:9222/admin/my-project/master \
  --target revisium://staging.example.com/admin/my-project/master?token=... \
  --tables products,categories
```

### Sync Options

| Flag | Default | Description |
|------|---------|-------------|
| `-s, --source` | env | Source Revisium URL |
| `-t, --target` | env | Target Revisium URL |
| `-c, --commit` | `false` | Commit changes on target after sync |
| `-d, --dry-run` | `false` | Preview changes without applying |
| `--tables` | all | Comma-separated table IDs (applies to data sync in `sync data` and `sync all`) |
| `--batch-size` | `100` | Rows per batch (applies to data sync in `sync data` and `sync all`) |

### Environment Variables for Sync

| Variable | Description |
|----------|-------------|
| `REVISIUM_SOURCE_URL` | Source connection URL |
| `REVISIUM_SOURCE_TOKEN` | Source JWT token |
| `REVISIUM_SOURCE_USERNAME` | Source username |
| `REVISIUM_SOURCE_PASSWORD` | Source password |
| `REVISIUM_TARGET_URL` | Target connection URL |
| `REVISIUM_TARGET_TOKEN` | Target JWT token |
| `REVISIUM_TARGET_USERNAME` | Target username |
| `REVISIUM_TARGET_PASSWORD` | Target password |

### Dry Run

Preview what would change without applying:

```bash
npx revisium sync all --dry-run \
  --source revisium://localhost:9222/admin/my-project/master \
  --target revisium://staging.example.com/admin/my-project/master?token=...
```

---

## Command Tree

```
revisium
├── schema
│   ├── save              --folder (export schemas)
│   └── create-migrations --schemas-folder --file (generate migrations)
│
├── migrate
│   ├── save              --file (export migrations)
│   └── apply             --file [--commit] (apply migrations)
│
├── rows
│   ├── save              --folder [--tables] (export row data)
│   └── upload            --folder [--tables] [--commit] [--batch-size] (import row data)
│
└── sync
    ├── schema            --source --target [--commit] [--dry-run]
    ├── data              --source --target [--commit] [--dry-run] [--tables] [--batch-size]
    └── all               --source --target [--commit] [--dry-run] [--tables] [--batch-size]
```
