import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting Started

Get up and running with Revisium in just a few minutes. This guide will walk you through installing Revisium, creating your first data model, and building APIs through both the visual interface and programmatic APIs.

## Installation Options

<Tabs defaultValue="cloud">
<TabItem value="cloud" label="Cloud (Sandbox)" default>

The fastest way to get started is with our hosted service:

1. **Sign up** at [https://cloud.revisium.io/](https://cloud.revisium.io/signup)
2. **Create your organization** and first project
3. **Start building** immediately - no setup required!

Perfect for testing, prototyping, and small projects.

</TabItem>
<TabItem value="docker-compose" label="Self-hosted (Docker)">

Perfect for local development and self-hosting. Copy the following code to `docker-compose.yml` file

```bash
services:
  db:
    image: postgres:17.4-alpine
    restart: always
    environment:
      POSTGRES_DB: revisium-dev
      POSTGRES_USER: revisium
      POSTGRES_PASSWORD: <password>
  revisium:
    pull_policy: always
    depends_on:
      - db
    image: revisium/revisium:v2.0.0
    ports:
      - 8080:8080
    environment:
      DATABASE_URL: postgresql://revisium:<password>@db:5432/revisium-dev?schema=public
```

and then run in bash

```shell
docker-compose up -d
```

Access your instance at [http://localhost:8080](http://localhost:8080)

</TabItem>
</Tabs>

## First Steps

### 1. Access the Admin Interface

Open your browser and navigate to [http://localhost:3000](http://localhost:3000). You'll see the Revisium Admin interface.

### 2. Create Your First Organization

```bash
# Using the API
curl -X POST http://localhost:8080/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "description": "My first organization"
  }'
```

### 3. Create Your First Project

```bash
# Create a blog project
curl -X POST http://localhost:8080/api/organizations/my-company/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "blog",
    "description": "My blog project"
  }'
```

### 4. Design Your Data Model

Create a schema for blog posts using the API (or use the visual designer in the admin panel):

```bash
curl -X PUT http://localhost:8080/api/organizations/my-company/projects/blog/branches/main/revisions/head/schemas/Post \
  -H "Content-Type: application/json" \
  -d '{
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "maxLength": 200
      },
      "content": {
        "type": "string"
      },
      "author": {
        "type": "string"
      },
      "publishedAt": {
        "type": "string",
        "format": "date-time"
      },
      "status": {
        "type": "string",
        "enum": ["draft", "published"]
      }
    },
    "required": ["title", "content", "author"]
  }'
```

### 5. Add Some Content

Create your first blog post:

```bash
curl -X POST http://localhost:8080/api/organizations/my-company/projects/blog/branches/main/revisions/head/tables/Post/rows \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Welcome to my blog! This is my first post using Revisium.",
    "author": "John Doe",
    "publishedAt": "2024-01-15T10:00:00Z",
    "status": "published"
  }'
```

### 6. Query Your Content

#### REST API

```bash
# Get all posts
curl http://localhost:8080/api/organizations/my-company/projects/blog/branches/main/revisions/head/tables/Post/rows

# Get published posts only
curl "http://localhost:8080/api/organizations/my-company/projects/blog/branches/main/revisions/head/tables/Post/rows?filter[status]=published"
```

#### GraphQL API

```bash
curl -X POST http://localhost:8080/api/organizations/my-company/projects/blog/branches/main/revisions/head/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { posts(filter: { status: PUBLISHED }) { edges { node { title content author publishedAt } } } }"
  }'
```

## Environment Variables

Revisium uses environment variables for configuration. Here are the essential ones:

### Quick Setup

```bash
# Required: Database connection
DATABASE_URL=postgresql://user:password@localhost:5432/revisium

# Required: Service communication
ENDPOINT_HOST=localhost
ENDPOINT_PORT=6379

# Optional: Security
JWT_SECRET=your-secure-secret-key
ADMIN_PASSWORD=secure-admin-password
```

For complete environment variable documentation, see [Environment Variables](./deployment/environment-variables).

## Verification

Verify your installation is working:

```bash
# Check Core service health
curl http://localhost:8080/health

# Check database connection
curl http://localhost:8080/health/db

# Check Redis connection
curl http://localhost:8080/health/redis
```

## Common Issues

### Port Conflicts

If ports 8080 or 3000 are already in use:

```bash
# Change ports in docker-compose.yml
services:
  core:
    ports:
      - "8081:8080"  # Changed from 8080:8080
  admin:
    ports:
      - "3001:3000"  # Changed from 3000:3000
```

### Database Connection Issues

Make sure PostgreSQL is running and accessible:

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection
docker exec revisium-core pg_isready -h db -p 5432
```

### Permission Errors

If you encounter permission errors:

```bash
# Fix Docker permissions (Linux/macOS)
sudo chown -R $USER:$USER ./data
```

## Next Steps

Now that you have Revisium running:

1. **Explore the Platform**: Learn about [Data Platform capabilities](./use-cases/data-platform)
2. **Master Core Concepts**: Understand [Schema and Data](./concepts/schema-and-data)
3. **Build Applications**: Try [Headless CMS](./use-cases/headless-cms) or [API Versioning](./use-cases/api-versioning)
4. **API Documentation**: Check out the [API Reference](./api/overview)
5. **Deploy to Production**: See [Deployment guides](./deployment/docker)

## Need Help?

- **Documentation**: Browse these docs for detailed guides
- **GitHub Issues**: [Report issues or ask questions](https://github.com/revisium/revisium/issues)
- **Examples**: Check the [examples directory](https://github.com/revisium/revisium/tree/main/examples)

Ready to build something amazing? Let's explore [Core Concepts](./concepts/schema-and-data) next! 🚀
