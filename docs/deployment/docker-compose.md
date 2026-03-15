---
sidebar_position: 2
---

# Docker Compose

Full-stack deployment with PostgreSQL.

## Basic Setup

Create `docker-compose.yml`:

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

## With Redis and S3

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
      REDIS_URL: redis://redis:6379
      S3_ENDPOINT: https://s3.amazonaws.com
      S3_BUCKET: my-revisium-files
      S3_REGION: us-east-1
      S3_ACCESS_KEY_ID: AKIA...
      S3_SECRET_ACCESS_KEY: ...
      ADMIN_PASSWORD: change-me

volumes:
  pgdata:
```

## Updating

```bash
docker-compose pull
docker-compose up -d
```

The Revisium container handles database migrations automatically on startup.

## Production Considerations

- Use a managed PostgreSQL service for better reliability
- Set strong passwords via environment variables
- Configure Redis for caching in multi-user scenarios
- Set up S3 for file uploads
- See [Configuration](./configuration) for all environment variables
