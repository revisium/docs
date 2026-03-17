---
sidebar_position: 4
---

# Relationships

When you define [foreign keys](../core-concepts/foreign-keys) in your schema, Revisium auto-generates relationship resolvers in the GraphQL API. Related data is resolved automatically in queries.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Single Foreign Key

A field with `"foreignKey": "table-name"` becomes a nested object in GraphQL:

<Tabs>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "category": {
      "type": "string",
      "default": "",
      "foreignKey": "categories"
    }
  },
  "required": ["title", "category"]
}
```

</TabItem>
<TabItem value="query" label="Query">

```graphql
query GetProduct($id: String!) {
  product(id: $id) {
    data {
      title
      category {
        name
        slug
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Array Foreign Key

An array of FK strings resolves to an array of objects:

<Tabs>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "default": "",
        "foreignKey": "tags"
      }
    }
  },
  "required": ["title", "tags"]
}
```

</TabItem>
<TabItem value="query" label="Query">

```graphql
query GetArticle($id: String!) {
  article(id: $id) {
    data {
      title
      tags {
        name
        color
      }
    }
  }
}
```

</TabItem>
</Tabs>

## FK in Array of Objects

Foreign keys inside nested array objects are also resolved:

<Tabs>
<TabItem value="schema" label="Schema">

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "translations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "language": {
            "type": "string",
            "default": "",
            "foreignKey": "languages"
          },
          "content": { "type": "string", "default": "" }
        },
        "required": ["language", "content"]
      }
    }
  },
  "required": ["title", "translations"]
}
```

</TabItem>
<TabItem value="query" label="Query">

```graphql
query GetArticle($id: String!) {
  article(id: $id) {
    data {
      title
      translations {
        content
        language {
          name
          code
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Key Points

- Foreign keys are always declared as `"type": "string"` with `"foreignKey": "table-name"` in the JSON Schema
- Relationship resolvers are generated automatically — no additional configuration
- FK values must be valid `rowId` values in the referenced table
- There are no automatic reverse relationships — only explicitly declared foreign keys become queryable
- Relationship data is fully resolved when queried (no sub-filtering on related data)
