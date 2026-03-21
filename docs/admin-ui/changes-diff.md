---
sidebar_position: 4
---

import Screenshot from '@site/src/components/Screenshot';

# Changes & Diff

The Changes view shows all pending modifications in the current draft before committing. Two tabs — **Tables** and **Row Changes** — with search and filters.

<Screenshot alt="Row Changes list — modified and added rows with search, table filter, and type filter" src="/img/screenshots/admin-changes-list.png" />

## What's Tracked

Every modification in the draft is recorded:

| Change type | Details |
|-------------|---------|
| **Tables added** | New tables created in the draft |
| **Tables removed** | Tables deleted in the draft |
| **Schema changes** | Field additions, removals, type changes |
| **Rows added** | New rows with all their data |
| **Rows removed** | Deleted rows |
| **Rows modified** | Field-level diff (old value → new value) |
| **Migrations** | Schema migration records |
| **Views** | Changes to table view configurations |

When multiple tables and rows are affected, the changes list shows everything at a glance:

<Screenshot alt="Changes list with 6 row changes across data, schema, migrations, and views" src="/img/screenshots/admin-changes-full.png" />

## Field-Level Diff

Click any row change to see the exact fields that were modified. Old and new values are displayed side by side with color coding:

<Screenshot alt="Diff dialog — field-level comparison showing old and new values for modified and added fields" src="/img/screenshots/admin-changes-diff.png" />

## Commit

After reviewing changes, click **Commit** to create a new immutable revision. The draft resets to a clean state.

## Revert

Click **Revert** to discard all pending modifications and return the draft to the HEAD state.
