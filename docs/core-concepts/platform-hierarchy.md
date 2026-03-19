---
sidebar_position: 1
---

import Screenshot from '@site/src/components/Screenshot';

# Platform Hierarchy

Revisium organizes data in a hierarchy inspired by GitHub:

```
Organization (= username)
  └── Project
        └── Branch (master, staging, dev)
              └── Revision (immutable snapshot) / Draft (WIP)
                    └── Table (JSON Schema)
                          └── Row (id + data)
```

## Analogy with GitHub

| Revisium | GitHub | Description |
|----------|--------|-------------|
| Organization | GitHub Org / User | Top-level namespace |
| Project | Repository | Independent data space with tables, branches, and endpoints |
| Branch | Branch | Isolated development line |
| Revision | Commit | Immutable snapshot of all tables and rows |
| Draft | Working directory | Mutable state where changes are made |
| Table | Folder | Collection of records sharing the same schema |
| Row | File in folder | A data record with a unique `id`, conforming to the table's schema |

## Organization

The top-level namespace. Your username is your organization — they are the same thing. Each organization owns one or more projects and has members with roles (admin, editor, viewer).

:::note Limitation
Currently, you cannot create separate organizations. Your username acts as your single organization. Multi-organization support is planned.
:::

## Project

A project is an independent data space. It has:
- A **root branch** (usually `master`)
- Its own set of tables and schemas
- API endpoints bound to specific revisions

Projects are isolated — schemas and data don't leak between projects.

## Branch

Each branch has its own revision history and a current draft. Changes on one branch don't affect others. See [Versioning & Branches](./versioning#branches) for details.

## Revision and Draft

A **revision** is an immutable, point-in-time snapshot of every table and row in a branch. Once committed, a revision cannot be changed.

A **draft** is the mutable working state. All modifications happen in the draft. When ready, the draft is committed to produce a new revision.

```
Draft (mutable) → commit → Revision (immutable) = new HEAD
```

See [Versioning & Branches](./versioning) for the full commit workflow, diff, and rollback.

## Table

A table is defined by a [JSON Schema](./data-modeling) and contains rows. Tables are created, modified, and deleted in a draft revision. The schema enforces structure on every write.

## Row

A row is a data record identified by a unique string `id` within a table. The row data must conform to the table's JSON Schema.

System fields (`createdAt`, `updatedAt`, `hash`, etc.) are stored separately from user data and can be optionally included in the schema via `$ref`. See [System Fields](./data-modeling#system-fields).
