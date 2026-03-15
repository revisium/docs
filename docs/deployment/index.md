---
sidebar_position: 9
---

# Deployment

Revisium can be deployed in several ways, from zero-config local development to production Kubernetes clusters.

| Option | Best for | Dependencies |
|--------|----------|-------------|
| [Standalone](./standalone) | Local dev, PoC, AI agent integrations | None (embedded PostgreSQL) |
| [Docker Compose](./docker-compose) | Self-hosted production | Docker |
| Cloud | Managed, zero ops | None |

## Requirements

| Component | Required | Notes |
|-----------|----------|-------|
| PostgreSQL 14+ | Yes | The only required dependency |
| Node.js 20+ | Standalone/CLI only | Not needed for Docker |
| S3-compatible storage | Optional | For file uploads |
| Redis | Optional | For caching and multi-pod sync |

## Sections

- [Standalone](./standalone) — `npx @revisium/standalone@latest`
- [Docker Compose](./docker-compose) — full stack setup
- [Configuration](./configuration) — all environment variables
- [Infrastructure](./infrastructure) — PostgreSQL, Redis, S3
