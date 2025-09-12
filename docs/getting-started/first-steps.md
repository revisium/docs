# First Steps

Now that you have Revisium running, let's create your first data model and build APIs. This guide will walk you through creating a simple blog project.

## Access the Admin Interface

**For Self-hosted:** Open your browser and navigate to [http://localhost:8080](http://localhost:8080)
**For Cloud:** Visit your project dashboard at [cloud.revisium.io](https://cloud.revisium.io)

You'll see the Revisium Admin interface where you can manage your data models and content.

## Create Your First Organization

```bash
# Using the API
curl -X POST http://localhost:8080/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "description": "My first organization"
  }'
```

## Create Your First Project

```bash
# Create a blog project
curl -X POST http://localhost:8080/api/organizations/my-company/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "blog",
    "description": "My blog project"
  }'
```

## Design Your Data Model

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

## Add Some Content

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

## Query Your Content

### REST API

```bash
# Get all posts
curl http://localhost:8080/api/organizations/my-company/projects/blog/branches/main/revisions/head/tables/Post/rows

# Get published posts only
curl "http://localhost:8080/api/organizations/my-company/projects/blog/branches/main/revisions/head/tables/Post/rows?filter[status]=published"
```

### GraphQL API

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

For complete environment variable documentation, see the configuration section.

## What's Next?

Now that you have your first project running:

1. **Explore Endpoints**: Learn about [GraphQL API](../endpoints/graphql/) for dynamic API generation
2. **Try Advanced Features**: Understand filtering, sorting, and relationships
4. **Build Applications**: Create powerful APIs from your schemas
5. **Deploy to Production**: Set up your production environment

## Need Help?

- **Documentation**: Browse these docs for detailed guides
- **GitHub Issues**: [Report issues or ask questions](https://github.com/revisium/revisium/issues)
- **Examples**: Check the [examples directory](https://github.com/revisium/revisium/tree/main/examples)

Ready to build something amazing? Let's explore [GraphQL API](../endpoints/graphql/) next! 🚀