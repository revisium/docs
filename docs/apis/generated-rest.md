---
sidebar_position: 3
---

# Generated REST

Each endpoint also generates REST APIs with OpenAPI/Swagger documentation.

## Endpoints

For a table `products`, paths are relative to the endpoint base URL (e.g., `/endpoint/rest/<username>/<project>/<branch>/head`):

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tables/products/rows` | Query rows (with pagination, filtering) |
| GET | `/tables/products/row/:rowId` | Get a single row by ID |

## OpenAPI Spec

The OpenAPI specification is available at the endpoint's Swagger URL. It includes:
- Typed request/response schemas generated from your JSON Schema
- Query parameters for filtering and sorting
- Pagination parameters (`first`, `after`)

## Response Format

```json
{
  "data": [
    {
      "id": "iphone-16",
      "data": {
        "title": "iPhone 16 Pro",
        "price": 999,
        "category": "electronics"
      },
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T14:20:00Z"
    }
  ],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "..."
  },
  "totalCount": 156
}
```

## Filtering

REST endpoints support the same filtering operators as GraphQL via query parameters. See the OpenAPI spec for available parameters per table.
