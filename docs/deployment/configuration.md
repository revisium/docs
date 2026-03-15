---
sidebar_position: 3
---

# Configuration

All Revisium configuration is done via environment variables.

## Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?schema=public` |

## Authentication

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | auto-generated | Secret for JWT token signing. **Set explicitly in production and multi-pod deployments** to ensure tokens are valid across restarts and replicas |
| `ADMIN_PASSWORD` | `admin` | Default admin user password |

## Optional Services

### Redis

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | — | Redis connection URL (enables caching and multi-pod sync) |

### S3 (File Storage)

| Variable | Description |
|----------|-------------|
| `S3_ENDPOINT` | S3-compatible endpoint URL |
| `S3_BUCKET` | Bucket name |
| `S3_REGION` | AWS region |
| `S3_ACCESS_KEY_ID` | Access key |
| `S3_SECRET_ACCESS_KEY` | Secret key |

### SMTP (Email)

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |

## Endpoint Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ENDPOINT_GRAPHQL_SHOW_NODE_TYPE` | `true` | Generate Node types |
| `ENDPOINT_GRAPHQL_SHOW_FLAT_TYPE` | `true` | Generate Flat types |
| `ENDPOINT_GRAPHQL_ADD_PROJECT_PREFIX` | `true` | Prefix types with project name |
| `ENDPOINT_GRAPHQL_FEDERATION` | `false` | Enable Apollo Federation |

See [API Configuration](../apis/configuration) for details.

## Service Communication

For microservice deployment (separate core and endpoint services):

| Variable | Description |
|----------|-------------|
| `CORE_API_URL` | URL of revisium-core service |
| `CORE_API_USERNAME` | Service account username |
| `CORE_API_PASSWORD` | Service account password |

In the all-in-one Docker image, these are configured automatically.
