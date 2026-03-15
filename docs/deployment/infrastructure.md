---
sidebar_position: 4
---

# Infrastructure

## PostgreSQL

The only required dependency. Revisium uses PostgreSQL JSONB columns for data and schemas, with copy-on-write for versioning.

### Requirements

- PostgreSQL 14 or higher
- Recommended: managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.) for production

### Data Storage

- **JSONB columns** for row data and table schemas
- **Copy-on-write** for revisions — commits don't duplicate unchanged data
- **Indexes** on system fields and JSONB paths for query performance

## Redis (Optional)

Provides caching and multi-pod synchronization:

- **L1 cache** — in-memory cache per process
- **L2 cache** — Redis shared across pods
- **Multi-pod sync** — cache invalidation across instances

Without Redis, Revisium works with in-memory caching only (fine for single-instance deployments).

## S3 (Optional)

Required for file uploads (`$ref: File` in schemas):

- Any S3-compatible storage works (AWS S3, MinIO, DigitalOcean Spaces, etc.)
- Files up to 50 MB
- Metadata (URL, size, mimeType) stored in PostgreSQL
- File binaries stored in S3

Without S3, file fields are available in schemas but upload functionality is disabled.

## SMTP (Optional)

For email notifications (e.g., user invitations).
