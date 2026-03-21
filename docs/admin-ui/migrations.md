---
sidebar_position: 6
---

import Screenshot from '@site/src/components/Screenshot';

# Migrations

The Migrations page in the Admin UI shows applied migrations history and allows uploading migration files.

<Screenshot alt="Admin UI — Migrations page with applied migrations list" />

## Applied Migrations

View all migrations that have been applied to the current branch:

- Migration ID (ISO timestamp)
- Table affected
- Change type (init, update, rename, remove)
- Applied date

## Upload Migrations

Upload a `migrations.json` file directly from the browser — no CLI needed:

1. Go to **Migrations** in the sidebar
2. Click **Upload**
3. Select your migration file
4. Review and apply

Useful for quick one-off deployments or when CLI is not available.

## See Also

- [Migrations Overview](../migrations/) — workflows and best practices
- [CLI](../apis/cli) — `migrate save`, `migrate apply`, `sync` commands
- [Migration Format](../architecture/specs/migration-format) — specification
- [CI/CD](../migrations/ci-cd) — automated deployment
