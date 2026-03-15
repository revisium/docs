---
sidebar_position: 3
---

# Core Concepts

Revisium is built on a set of foundational concepts that work together: a hierarchical data model, JSON Schema for structure, foreign keys for relationships, computed fields for derived values, file attachments, and Git-like versioning.

## Overview

| Concept | What it does |
|---------|-------------|
| [Platform Hierarchy](./platform-hierarchy) | Organization → Project → Branch → Revision → Table → Row |
| [Data Modeling](./data-modeling) | Define field types, nesting, constraints for every table |
| [Foreign Keys](./foreign-keys) | Referential integrity between tables with cascade operations |
| [Computed Fields](./computed-fields) | Formula expressions (`x-formula`) with 40+ built-in functions |
| [Files](./files) | S3 file attachments at any schema level |
| [Versioning](./versioning) | Draft → commit → HEAD workflow with full history and diff |
| [Branches](./branches) | Isolated development lines within a project |
| [Schema Evolution](./schema-evolution) | Change types, add/remove fields — data transforms automatically |

These concepts combine to provide a platform where schema defines structure, foreign keys enforce relationships, versioning tracks history, and APIs are generated automatically from whatever you build.
