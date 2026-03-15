---
sidebar_position: 1
---

import Screenshot from '@site/src/components/Screenshot';

# Platform Hierarchy

Revisium organizes data in a hierarchy inspired by Git.

```
Organization
  └── Project
        └── Branch (master, staging, dev)
              └── Revision (immutable snapshot) / Draft (WIP)
                    └── Table (JSON Schema)
                          └── Row (id + data)
```

## Analogy with Git

| Revisium | Git | Description |
|----------|-----|-------------|
| Organization | GitHub Org | Top-level container, groups projects |
| Project | Repository | Independent data space with its own schema |
| Branch | Branch | Isolated development line |
| Revision | Commit | Immutable snapshot of all tables and rows |
| Draft | Working directory | Mutable state where changes are made |
| Table | File | Data structure defined by JSON Schema |
| Row | Content | A data record with a unique `id` within a table |

## Organization

The top-level container. Each organization has members with roles (admin, editor, viewer). An organization owns one or more projects.

## Project

A project is an independent data space. It has:
- A **root branch** (usually `master`)
- Its own set of tables and schemas
- API endpoints bound to specific revisions

Projects are isolated — schemas and data don't leak between projects.

## Branch

Each branch has its own revision history and a current draft. Changes on one branch don't affect others.

Use cases for branches:
- `master` — production data
- `staging` — pre-release review
- `dev` — development and experimentation
- Feature branches for A/B testing or per-client configurations

## Revision and Draft

A **revision** is an immutable, point-in-time snapshot of every table and row in a branch. Once committed, a revision cannot be changed.

A **draft** is the mutable working state. All modifications (create, update, delete tables and rows) happen in the draft. When ready, the draft is committed to produce a new revision.

```
Draft (mutable) → commit → Revision (immutable) = new HEAD
```

The **HEAD** revision is the latest committed state of a branch.

## Table

A table is defined by a [JSON Schema](./data-modeling) and contains rows. Tables are created, modified, and deleted in a draft revision. The schema enforces structure on every write.

## Row

A row is a data record identified by a unique string `id` within a table. The row data must conform to the table's JSON Schema.

System fields (`createdAt`, `updatedAt`, `hash`, etc.) are stored separately from user data and can be optionally included in the schema via `$ref`.

<Screenshot alt="Admin UI — project with tables, branch selector, and revision info in the sidebar" />
