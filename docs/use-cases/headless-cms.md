---
sidebar_position: 2
---

# Headless CMS

Use Revisium as a headless content management system with versioning, branching, and auto-generated APIs.

## When to Use

- Corporate websites and landing pages
- Blog and article management
- Multi-language content
- Marketing campaigns with editorial workflow
- Any content that needs preview before publishing

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│  Revisium   │◀────│  Admin UI   │
│  (web/app)  │ GQL │  Endpoint   │     │  (editors)  │
└─────────────┘     │  (HEAD)     │     └─────────────┘
                    └─────────────┘
                    ┌─────────────┐
                    │  Preview    │
                    │  (Draft)    │
                    └─────────────┘
```

Content editors manage content in the Admin UI. Frontends consume data via auto-generated GraphQL/REST APIs. Two endpoints: HEAD for production, Draft for preview.

## Key Features

- **Versioning** — draft → review → commit workflow
- **Branches** — staging branch for pre-release content
- **Diff** — review all changes before committing
- **Rollback** — revert to any previous revision
- **Auto-generated APIs** — typed GraphQL and REST from your content schema

## Workflow

1. Editors create/modify content in the Admin UI (working in Draft)
2. Review changes in the Changes tab (schema diff + data diff)
3. Commit to create a new immutable revision
4. Production frontend automatically serves the new HEAD
5. Preview frontend shows Draft for editorial review

## Content Schema Example

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "slug": { "type": "string", "default": "" },
    "content": { "type": "string", "default": "", "contentMediaType": "text/markdown" },
    "author": { "type": "string", "default": "", "foreignKey": "authors" },
    "cover": { "$ref": "urn:jsonschema:io:revisium:file-schema:1.0.0" },
    "published": { "type": "boolean", "default": false },
    "tags": {
      "type": "array",
      "items": { "type": "string", "default": "", "foreignKey": "tags" }
    }
  },
  "required": ["title", "slug", "content", "author", "cover", "published", "tags"]
}
```

## Frontend Integration

### Next.js (App Router)

```typescript
async function getArticles() {
  const res = await fetch('https://revisium.example.com/endpoint/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
        articles(data: { first: 20, where: { data: { path: ["published"], equals: true } } }) {
          edges { node { data { title slug content author { name } } } }
        }
      }`
    }),
    next: { revalidate: 60 },
  });
  return res.json();
}
```

## Branching for Staging

1. Create a `staging` branch from `master` HEAD
2. Editors make content changes on `staging`
3. Create a preview endpoint bound to `staging` HEAD
4. After review, recreate changes on `master`
