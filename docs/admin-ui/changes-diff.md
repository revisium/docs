---
sidebar_position: 4
---

import Screenshot from '@site/src/components/Screenshot';

# Changes & Diff

The Changes view shows all pending modifications in the current draft before committing. Review what changed, inspect field-level diffs, and commit with confidence.

<Screenshot alt="Changes view — summary of pending changes: tables and rows added, modified, removed" />

## What's Shown

The changes view displays:

| Change type | Details |
|-------------|---------|
| **Tables added** | New tables created in the draft |
| **Tables removed** | Tables deleted in the draft |
| **Schema changes** | Field additions, removals, type changes — shown as schema patches |
| **Rows added** | New rows with all their data |
| **Rows removed** | Deleted rows |
| **Rows modified** | Field-level diff (old value → new value) |

## Schema Diff

Schema changes are displayed as a list of operations:
- Field added (with type and default)
- Field removed
- Field type changed
- Table renamed

<Screenshot alt="Schema diff — review pending schema modifications (rename, add field) before applying" />

## Data Diff

Modified rows show a side-by-side comparison of old and new values for each changed field. Unchanged fields are hidden to focus on what's different.

<Screenshot alt="Data diff — field-level comparison with old/new values side by side" />

## Commit

After reviewing changes:
1. Optionally add a commit comment
2. Click **Commit** to create a new immutable revision
3. The draft resets to a clean state

## Revert

If the changes are not satisfactory, click **Revert** to discard all pending modifications and return the draft to the HEAD state.
