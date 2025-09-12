# Relationships & Foreign Keys

Query related data through automatically generated relationship resolvers based on your JSON schema foreign key definitions.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Foreign Key Relationships

When you define a `foreignKey` field in your JSON schema (as a simple string), Revisium automatically generates GraphQL relationship resolvers. There are no automatic reverse relationships - only the explicitly defined foreign keys become queryable relationships.

<Tabs>
<TabItem value="product-schema" label="Product Schema">

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "foreignKey": "categories"
    },
    "price": {
      "type": "number"
    }
  },
  "required": ["name", "category"]
}
```

</TabItem>
<TabItem value="category-schema" label="Category Schema">

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "slug": {
      "type": "string"
    }
  }
}
```

</TabItem>
<TabItem value="generated-types" label="Generated GraphQL Types">

```graphql
type ProjectProduct {
  name: String!
  description: String
  price: Float

  # Automatically generated relationship
  category: ProjectCategory
}

type ProjectCategory {
  name: String
  slug: String
}

# Node types with relationships
type ProjectProductNode {
  id: String!
  createdAt: DateTime!
  data: ProjectProduct!
}

type ProjectCategoryNode {
  id: String!
  createdAt: DateTime!
  data: ProjectCategory!
}
```

</TabItem>
</Tabs>

## Foreign Key Examples

Examples of different foreign key patterns and their generated GraphQL relationships.

<Tabs>
<TabItem value="single-fk" label="Single Foreign Key">

```graphql
query GetArticleWithCategory($articleId: String!) {
  article(id: $articleId) {
    data {
      title

      # Generated relationship from foreignKey
      category {
        name
        slug
      }
    }
  }
}
```

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "foreignKey": "categories"
    }
  }
}
```

</TabItem>
<TabItem value="array-fk" label="Array Foreign Key">

```graphql
query GetArticleWithTags($articleId: String!) {
  article(id: $articleId) {
    data {
      title

      # Generated relationship from array foreignKey
      tags {
        name
        color
      }
    }
  }
}
```

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "foreignKey": "tags"
      }
    }
  }
}
```

</TabItem>
<TabItem value="object-array-fk" label="Array of Objects with Foreign Key">

```graphql
query GetArticleWithTranslations($articleId: String!) {
  article(id: $articleId) {
    data {
      title
      translations {
        content

        # Generated relationship from nested foreignKey
        language {
          name
          code
        }
      }
    }
  }
}
```

```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "translations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "language": {
            "type": "string",
            "foreignKey": "languages"
          },
          "content": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Querying Relationships

All relationship data is returned when queried - there is no filtering of relationship data.

## Foreign Key Format

Foreign keys are defined as simple strings in your JSON schema:

```json
{
  "category_id": {
    "type": "string",
    "foreignKey": "categories" // Simple string format - references categories table
  }
}
```

**Key points:**

- Foreign keys are always strings, not objects
- They reference the target table name
- Only `id` field references are supported
- No automatic reverse relationships are generated

## Next Steps

- [Basic Queries](./basic) - Learn fundamental query patterns
- [Filtering](./filtering) - Filter related data with WHERE conditions
- [Pagination](./pagination) - Paginate through relationship data efficiently
