---
sidebar_position: 7
---

import Screenshot from '@site/src/components/Screenshot';

# Migrations

The Migrations page shows the full history of schema operations and lets you apply migrations from JSON or another branch.

<Screenshot alt="Migrations page — 15 operations history with Apply dropdown (From JSON, From Branch)" src="/img/screenshots/admin-migrations.png" />

## Operation History

Each operation is listed with:

- Operation description (field added, table created, etc.)
- Target table
- Time since applied

## Apply Migrations

Click **Apply** to import schema changes:

- **From JSON** — paste or upload a `migrations.json` file
- **From Branch** — pull schema changes from another branch in the same project

## See Also

- [Migrations Overview](../migrations/) — workflows and best practices
- [CLI](../apis/cli) — `migrate save`, `migrate apply`, `sync` commands
- [Migration Format](../architecture/specs/migration-format) — specification
- [CI/CD](../migrations/ci-cd) — automated deployment
