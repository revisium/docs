---
sidebar_position: 9
---

# Deployment

:::tip Don't want to manage infrastructure?
[Revisium Cloud](https://cloud.revisium.io/signup) — managed platform, zero ops, free to start. Sign up with Google or GitHub.
:::

## Standalone

Single command, embedded PostgreSQL, zero configuration:

```bash
npx @revisium/standalone@latest
```

Open [http://localhost:9222](http://localhost:9222). No auth by default.

| Option | Default | Description |
|--------|---------|-------------|
| `--port` | `9222` | HTTP port |
| `--auth` | `false` | Enable authentication (`admin` / `admin`) |
| `--data` | OS temp dir | Persistent data directory |

```bash
# Custom port with auth
npx @revisium/standalone@latest --port 3000 --auth

# Persistent data
npx @revisium/standalone@latest --data ./revisium-data
```

MCP endpoint available at `/mcp`:

```bash
claude mcp add --transport http revisium http://localhost:9222/mcp
```

Best for: local development, PoC, AI agent integrations, demos.

## Docker Compose

Full stack with PostgreSQL:

```yaml
services:
  db:
    image: postgres:17.4-alpine
    restart: always
    environment:
      POSTGRES_DB: revisium
      POSTGRES_USER: revisium
      POSTGRES_PASSWORD: change-me-to-a-secure-password
    volumes:
      - pgdata:/var/lib/postgresql/data

  revisium:
    image: revisium/revisium:latest
    pull_policy: always
    depends_on:
      - db
    ports:
      - 8080:8080
    environment:
      DATABASE_URL: postgresql://revisium:change-me-to-a-secure-password@db:5432/revisium?schema=public
      ADMIN_PASSWORD: change-me

volumes:
  pgdata:
```

```bash
docker-compose up -d
```

Open [http://localhost:8080](http://localhost:8080). Login: `admin` / value of `ADMIN_PASSWORD`.

### With Redis and S3

```yaml
services:
  db:
    image: postgres:17.4-alpine
    restart: always
    environment:
      POSTGRES_DB: revisium
      POSTGRES_USER: revisium
      POSTGRES_PASSWORD: change-me
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always

  revisium:
    image: revisium/revisium:latest
    pull_policy: always
    depends_on:
      - db
      - redis
    ports:
      - 8080:8080
    environment:
      DATABASE_URL: postgresql://revisium:change-me@db:5432/revisium?schema=public
      CACHE_ENABLED: 1
      CACHE_L2_REDIS_URL: redis://redis:6379
      CACHE_BUS_HOST: redis
      CACHE_BUS_PORT: 6379
      S3_ENDPOINT: https://s3.amazonaws.com
      S3_BUCKET: my-revisium-files
      S3_REGION: us-east-1
      S3_ACCESS_KEY_ID: AKIA...
      S3_SECRET_ACCESS_KEY: ...
      ADMIN_PASSWORD: change-me

volumes:
  pgdata:
```

### Updating

```bash
docker-compose pull
docker-compose up -d
```

Database migrations run automatically on startup.

## Docker (Single Container)

Bring your own PostgreSQL:

```bash
docker run -d \
  -p 8080:8080 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/revisium?schema=public \
  -e ADMIN_PASSWORD=change-me \
  revisium/revisium:latest
```

## Kubernetes

Use the official Docker image with your Helm charts or manifests:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: revisium
spec:
  replicas: 1
  selector:
    matchLabels:
      app: revisium
  template:
    metadata:
      labels:
        app: revisium
    spec:
      containers:
      - name: revisium
        image: revisium/revisium:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: revisium-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: revisium-secrets
              key: jwt-secret
        - name: ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: revisium-secrets
              key: admin-password
```

For multi-pod deployments:
- Set `JWT_SECRET` explicitly — auto-generated per process won't work across pods
- Set `CACHE_ENABLED=1` with `CACHE_L2_REDIS_URL` and `CACHE_BUS_HOST`/`CACHE_BUS_PORT` for cache sync between pods
- Use a managed PostgreSQL service

For schema migrations in K8s, see [CI/CD](../migrations/ci-cd#pattern-2-separate-migration-container).

## Configuration

All configuration is done via environment variables.

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?schema=public` |

### Authentication

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | auto-generated | JWT signing secret. **Set explicitly in production and multi-pod deployments** |
| `ADMIN_PASSWORD` | `admin` | Default admin password |

### Cache

| Variable | Default | Description |
|----------|---------|-------------|
| `CACHE_ENABLED` | `0` | Enable caching (`1` to enable) |
| `CACHE_L1_MAX_SIZE` | — | Max items in L1 (in-memory) cache |
| `CACHE_L2_REDIS_URL` | — | Redis URL for L2 cache |
| `CACHE_BUS_HOST` | — | Redis host for cache bus (multi-pod invalidation) |
| `CACHE_BUS_PORT` | — | Redis port for cache bus |
| `CACHE_DEBUG` | `0` | Enable cache debug logging |

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

### Endpoint Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ENDPOINT_GRAPHQL_SHOW_NODE_TYPE` | `true` | Generate Node types |
| `ENDPOINT_GRAPHQL_SHOW_FLAT_TYPE` | `true` | Generate Flat types |
| `ENDPOINT_GRAPHQL_ADD_PROJECT_PREFIX` | `true` | Prefix types with project name |
| `ENDPOINT_GRAPHQL_FEDERATION` | `false` | Enable Apollo Federation |

See [API Configuration](../apis/configuration) for details.

### Service Communication (Microservice Mode)

| Variable | Description |
|----------|-------------|
| `CORE_API_URL` | URL of revisium-core service |
| `CORE_API_USERNAME` | Service account username |
| `CORE_API_PASSWORD` | Service account password |

In the all-in-one Docker image, these are configured automatically.

## Infrastructure

### PostgreSQL

The only required dependency. PostgreSQL 14 or higher.

- **JSONB columns** for row data and table schemas
- **Copy-on-write** for revisions — commits don't duplicate unchanged data
- **Indexes** on system fields and JSONB paths for query performance
- Recommended: managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.) for production

### Redis (Optional)

Used for L2 cache and multi-pod cache invalidation:

- **L1 cache** — in-memory cache per process (`CACHE_L1_MAX_SIZE`)
- **L2 cache** — Redis shared across pods (`CACHE_L2_REDIS_URL`)
- **Cache bus** — Redis pub/sub for cache invalidation across pods (`CACHE_BUS_HOST`, `CACHE_BUS_PORT`)

Without Redis, Revisium uses in-memory caching with PostgreSQL-based bus (fine for single-instance). Set `CACHE_ENABLED=1` to enable caching.

### S3 (Optional)

Required for file uploads:

- Any S3-compatible storage (AWS S3, MinIO, DigitalOcean Spaces, etc.)
- Files up to 50 MB (not yet configurable)
- Metadata stored in PostgreSQL, binaries in S3

Without S3, file fields are available in schemas but upload is disabled.

### SMTP (Optional)

For email notifications (e.g., user invitations).

## Requirements

| Component | Required | Notes |
|-----------|----------|-------|
| PostgreSQL 14+ | Yes | The only required dependency |
| Node.js 20+ | Standalone/CLI only | Not needed for Docker |
| S3-compatible storage | Optional | For file uploads |
| Redis | Optional | For caching and multi-pod sync |
