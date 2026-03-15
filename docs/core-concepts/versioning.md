---
sidebar_position: 6
---

import Screenshot from '@site/src/components/Screenshot';

# Versioning

Revisium provides Git-like versioning for data and schemas. Every committed change creates an immutable revision — a full snapshot of all tables and rows at that point in time.

## Draft and HEAD

All changes happen in a **draft** revision (mutable). When ready, the draft is committed to create a new **HEAD** revision (immutable).

```
Make changes in Draft → Review changes → Commit → New HEAD revision
                                                      ↓
                                        Draft resets (empty diff)
```

Versioning is optional — you can work in draft indefinitely without committing. When version history is needed, use the commit workflow.

## Commit

A commit creates a new immutable revision and advances HEAD:

```
HEAD (rev-3) ← current production state
Draft        ← working changes

After commit:
HEAD (rev-4) ← new production state (includes draft changes)
Draft        ← clean (no pending changes)
```

Commits can include an optional comment describing the changes.

## Revision History

Every branch maintains a linear history of revisions. You can:

- **Browse** any past revision to see its tables and data
- **Diff** any two revisions to see what changed (tables added/removed, rows modified, schema changes)
- **Rollback** to a previous revision

## Diff

The diff system compares two revisions and shows:

| Change type | What it shows |
|-------------|---------------|
| Table changes | Tables added, removed, or modified |
| Schema changes | Field-level schema diff (old vs new) |
| Row changes | Rows added, removed, or modified with field-level data diff |

The diff is available in the Admin UI (Changes tab) and via the System API (`getRevisionChanges`, `getTableChanges`, `getRowChanges`).

<Screenshot alt="Diff view — schema changes and data changes side by side before commit" />

## Copy-on-Write

Commits do not duplicate unchanged data. The platform uses copy-on-write at the PostgreSQL level — only modified tables and rows are stored in the new revision. Unchanged data is shared across revisions.

## API Endpoints and Revisions

API endpoints can be bound to:

- **HEAD** — always serves the latest committed data (production)
- **Draft** — serves the working state, including uncommitted changes (preview)
- **Specific revision** — serves data from a pinned point in time
