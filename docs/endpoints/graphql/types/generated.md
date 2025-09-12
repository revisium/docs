# Generated Types

Understanding the comprehensive type system automatically generated from your JSON schemas.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Type Generation Overview

For each table in your project, Revisium generates a complete set of GraphQL types that follow GraphQL and Relay conventions.

<Tabs>
<TabItem value="schema-input" label="JSON Schema Input">

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "User's full name"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "number",
      "minimum": 0,
      "maximum": 150
    },
    "active": {
      "type": "boolean",
      "default": true
    },
    "preferences": {
      "type": "object",
      "properties": {
        "theme": {
          "type": "string",
          "enum": ["light", "dark", "auto"]
        },
        "notifications": {
          "type": "boolean",
          "default": true
        }
      }
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": ["name", "email"]
}
```

</TabItem>
<TabItem value="generated-types" label="Generated GraphQL Types">

```graphql
# Entity type (core data structure)
type ProjectUser {
  name: String!
  email: String!
  age: Int
  active: Boolean!
  preferences: ProjectUserPreferences
  tags: [String!]!
}

# Nested object types
type ProjectUserPreferences {
  theme: ProjectUserPreferencesThemeEnum
  notifications: Boolean!
}

# Enum types
enum ProjectUserPreferencesThemeEnum {
  light
  dark
  auto
}

# Node type (with metadata)
type ProjectUserNode {
  id: String!
  createdAt: DateTime!
  createdId: String!
  updatedAt: DateTime!
  publishedAt: DateTime!
  readonly: Boolean!
  versionId: String!
  json: JSON!
  data: ProjectUser!
}

# Flat type (simplified)
type ProjectUserFlat {
  name: String!
  email: String!
  age: Int
  active: Boolean!
  preferences: ProjectUserPreferences
  tags: [String!]!
}

# Connection type (pagination)
type ProjectUserConnection {
  edges: [ProjectUserEdge!]!
  pageInfo: ProjectPageInfo!
  totalCount: Int!
}

# Edge type
type ProjectUserEdge {
  node: ProjectUserNode!
  cursor: String!
}

# Flat connection type
type ProjectUserFlatConnection {
  edges: [ProjectUserFlatEdge!]!
  pageInfo: ProjectPageInfo!
  totalCount: Int!
}

# Flat edge type
type ProjectUserFlatEdge {
  node: ProjectUserFlat!
  cursor: String!
}
```

</TabItem>
</Tabs>

## Entity Types

Core data types representing your JSON schema structure.

<Tabs>
<TabItem value="simple-entity" label="Simple Entity">

```graphql
# Basic entity with primitive fields
type ProjectProduct {
  name: String!
  price: Float!
  inStock: Boolean!
  category: String
  tags: [String!]!
}
```

</TabItem>
<TabItem value="nested-entity" label="Nested Entity">

```graphql
# Entity with nested objects
type ProjectOrder {
  orderNumber: String!
  total: Float!
  status: ProjectOrderStatusEnum!
  customer: ProjectOrderCustomer!
  items: [ProjectOrderItem!]!
  shipping: ProjectOrderShipping
}

type ProjectOrderCustomer {
  name: String!
  email: String!
  phone: String
}

type ProjectOrderItem {
  productId: String!
  quantity: Int!
  price: Float!
}

type ProjectOrderShipping {
  address: ProjectOrderShippingAddress!
  method: String!
  trackingNumber: String
}

type ProjectOrderShippingAddress {
  street: String!
  city: String!
  country: String!
  postalCode: String!
}

enum ProjectOrderStatusEnum {
  pending
  processing
  shipped
  delivered
  cancelled
}
```

</TabItem>
</Tabs>

## Node Types

Full entity types with system metadata fields.

<Tabs>
<TabItem value="node-structure" label="Node Type Structure">

```graphql
type ProjectUserNode {
  # System metadata fields
  id: String!              # Unique identifier
  createdAt: DateTime!     # Creation timestamp
  createdId: String!       # Creator user ID
  updatedAt: DateTime!     # Last update timestamp
  publishedAt: DateTime!   # Publication timestamp
  readonly: Boolean!       # Read-only flag
  versionId: String!       # Version identifier
  json: JSON!             # Raw JSON representation
  
  # Your data
  data: ProjectUser!      # Entity data from your schema
}
```

</TabItem>
<TabItem value="system-fields" label="System Fields Reference">

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String!` | Unique identifier for the entity |
| `createdAt` | `DateTime!` | Timestamp when the entity was created |
| `createdId` | `String!` | ID of the user who created the entity |
| `updatedAt` | `DateTime!` | Timestamp when the entity was last updated |
| `publishedAt` | `DateTime!` | Timestamp when the entity was published |
| `readonly` | `Boolean!` | Whether the entity is read-only |
| `versionId` | `String!` | Version identifier for the entity |
| `json` | `JSON!` | Raw JSON representation of the entity data |
| `data` | `EntityType!` | The actual entity data |

</TabItem>
<TabItem value="node-usage" label="When to Use Node Types">

**Use Node types when you need:**
- **Audit trails** - tracking who created/modified records
- **Version history** - understanding data evolution
- **Admin interfaces** - full entity management
- **Debugging** - accessing raw JSON data
- **Metadata** - creation dates, read-only flags

**Example use cases:**
- Content management systems
- Admin dashboards
- Data auditing tools
- API debugging tools

</TabItem>
</Tabs>

## Flat Types

Simplified types containing only your data fields without metadata.

<Tabs>
<TabItem value="flat-structure" label="Flat Type Structure">

```graphql
# Flat type (no metadata)
type ProjectUserFlat {
  name: String!
  email: String!
  age: Int
  active: Boolean!
  preferences: ProjectUserPreferences
  tags: [String!]!
}

# Same nested types as entity
type ProjectUserPreferences {
  theme: ProjectUserPreferencesThemeEnum
  notifications: Boolean!
}
```

</TabItem>
<TabItem value="flat-usage" label="When to Use Flat Types">

**Use Flat types when you need:**
- **Public APIs** - clean data without system metadata
- **Mobile applications** - minimal data transfer
- **Client applications** - simplified data structures
- **Performance** - smaller response payloads

**Example use cases:**
- Public REST APIs
- Mobile app backends
- E-commerce product listings
- Client-facing data feeds

</TabItem>
<TabItem value="flat-comparison" label="Node vs Flat Comparison">

```graphql
# Node query (with metadata)
query GetUserNode($id: String!) {
  user(id: $id) {
    id
    createdAt
    updatedAt
    data {
      name
      email
    }
  }
}

# Flat query (data only)
query GetUserFlat($id: String!) {
  userFlat(id: $id) {
    name
    email
  }
}
```

**Response sizes:**
- Node response: ~300 bytes (includes metadata)
- Flat response: ~50 bytes (data only)

</TabItem>
</Tabs>

## Connection Types

Relay-specification pagination types for list queries.

<Tabs>
<TabItem value="connection-structure" label="Connection Structure">

```graphql
# Connection type
type ProjectUserConnection {
  edges: [ProjectUserEdge!]!
  pageInfo: ProjectPageInfo!
  totalCount: Int!
}

# Edge type
type ProjectUserEdge {
  node: ProjectUserNode!
  cursor: String!
}

# Flat connection type
type ProjectUserFlatConnection {
  edges: [ProjectUserFlatEdge!]!
  pageInfo: ProjectPageInfo!
  totalCount: Int!
}

# Flat edge type
type ProjectUserFlatEdge {
  node: ProjectUserFlat!
  cursor: String!
}
```

</TabItem>
<TabItem value="connection-usage" label="Connection Usage">

```graphql
query GetUsersConnection {
  users(data: { first: 20 }) {
    edges {
      node {          # ProjectUserNode
        id
        data {
          name
        }
      }
      cursor          # Pagination cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount        # Total items available
  }
}
```

</TabItem>
</Tabs>

## Input Types

Types for filtering, sorting, and querying data.

<Tabs>
<TabItem value="query-input" label="Query Input Types">

```graphql
# Main query input type
input ProjectGetUserInput {
  after: String                          # Pagination cursor
  first: Int                            # Page size
  orderBy: [ProjectGetUserOrderByInput!] # Sorting
  where: ProjectUserWhereInput          # Filtering
}

# OrderBy input
input ProjectGetUserOrderByInput {
  direction: ProjectSortOrder!
  field: ProjectGetUserOrderByField!
}

enum ProjectGetUserOrderByField {
  createdAt
  id
  publishedAt
  updatedAt
}

enum ProjectSortOrder {
  asc
  desc
}
```

</TabItem>
<TabItem value="where-input" label="Where Input Types">

```graphql
# Where input type
input ProjectUserWhereInput {
  AND: [ProjectUserWhereInput!]
  NOT: [ProjectUserWhereInput!]
  OR: [ProjectUserWhereInput!]
  
  # System fields
  createdAt: ProjectDateTimeFilter
  createdId: ProjectStringFilter
  id: ProjectStringFilter
  publishedAt: ProjectDateTimeFilter
  readonly: ProjectBoolFilter
  updatedAt: ProjectDateTimeFilter
  versionId: ProjectStringFilter
  
  # Data fields
  data: ProjectJsonFilter
  meta: ProjectJsonFilter
}
```

</TabItem>
<TabItem value="json-order-input" label="JSON Path OrderBy">

```graphql
# Extended OrderBy with JSON path support
input ProjectGetUserOrderByInput {
  # System field ordering
  direction: ProjectSortOrder!
  field: ProjectGetUserOrderByField!
  
  # JSON path ordering
  data: ProjectJsonOrderInput
}

input ProjectJsonOrderInput {
  path: String!                    # JSON path (e.g., "name" or "profile.age")
  direction: ProjectSortOrder!     # Sort direction
  type: ProjectJsonValueType!      # Type casting
}

enum ProjectJsonValueType {
  text
  int
  float
  boolean
  timestamp
}
```

</TabItem>
</Tabs>

## Naming Conventions

Understanding how types are named based on your configuration.

<Tabs>
<TabItem value="naming-pattern" label="Naming Patterns">

```typescript
// For a table named "user" in project "MyProject"
const tableId = "user";
const projectName = "MyProject";

// Generated type names
const entityType = `${projectName}User`;              // MyProjectUser
const nodeType = `${projectName}UserNode`;            // MyProjectUserNode
const flatType = `${projectName}UserFlat`;            // MyProjectUserFlat
const connectionType = `${projectName}UserConnection`; // MyProjectUserConnection
const edgeType = `${projectName}UserEdge`;            // MyProjectUserEdge
```

</TabItem>
<TabItem value="custom-naming" label="Custom Naming Configuration">

```bash
# Environment variables for custom naming
GRAPHQL_PREFIX_FOR_TABLES=MyAPI
GRAPHQL_PREFIX_FOR_COMMON=Sys
GRAPHQL_FLAT_POSTFIX=Simple
GRAPHQL_NODE_POSTFIX=Full

# Results in:
# MyAPIUserSimple (flat type)
# MyAPIUserFull (node type)  
# SysPageInfo (system type)
```

</TabItem>
</Tabs>

## Scalar and Custom Types

<Tabs>
<TabItem value="scalars" label="Built-in Scalars">

```graphql
# Standard GraphQL scalars
scalar String
scalar Int
scalar Float
scalar Boolean
scalar ID

# Additional scalars
scalar DateTime    # ISO 8601 date-time strings
scalar JSON        # Arbitrary JSON values
```

</TabItem>
<TabItem value="enums" label="Generated Enums">

```json
// JSON Schema enum
{
  "status": {
    "type": "string",
    "enum": ["active", "inactive", "pending"]
  }
}
```

```graphql
# Generated GraphQL enum
enum ProjectUserStatusEnum {
  active
  inactive
  pending
}

type ProjectUser {
  status: ProjectUserStatusEnum
}
```

</TabItem>
<TabItem value="arrays" label="Array Types">

```json
// JSON Schema arrays
{
  "tags": {
    "type": "array",
    "items": {
      "type": "string"
    }
  },
  "scores": {
    "type": "array",
    "items": {
      "type": "number"
    }
  }
}
```

```graphql
# Generated GraphQL arrays
type ProjectUser {
  tags: [String!]!      # Non-null array of non-null strings
  scores: [Float!]!     # Non-null array of non-null floats
}
```

</TabItem>
</Tabs>

## Type Visibility Configuration

Control which types are generated and exposed.

<Tabs>
<TabItem value="hide-types" label="Hide Type Variants">

```bash
# Hide node types (show only flat types)
GRAPHQL_HIDE_NODE_TYPES=true

# Hide flat types (show only node types)
GRAPHQL_HIDE_FLAT_TYPES=true
```

**Result when hiding node types:**
```graphql
# Only flat types generated
type Query {
  userFlat(id: String!): ProjectUserFlat
  usersFlat(data: ProjectGetUserInput): ProjectUserFlatConnection!
  
  # No node type queries generated
}
```

</TabItem>
<TabItem value="minimal-schema" label="Minimal Schema Configuration">

```bash
# Generate only essential types
GRAPHQL_HIDE_NODE_TYPES=true
GRAPHQL_HIDE_FLAT_TYPES=false
GRAPHQL_PREFIX_FOR_TABLES=
GRAPHQL_PREFIX_FOR_COMMON=Common
```

**Results in cleaner schema:**
```graphql
type User {           # No prefix
  name: String!
  email: String!
}

type CommonPageInfo {  # Common prefix
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
```

</TabItem>
</Tabs>

## Federation Support

Generated types support Apollo Federation for distributed GraphQL architectures.

<Tabs>
<TabItem value="federation" label="Federation Directives">

```graphql
# Node types implement federation entity interface
type ProjectUserNode @key(fields: "id") {
  id: String!
  createdAt: DateTime!
  data: ProjectUser!
}

# Extend types from other services
extend type ProjectUser @key(fields: "id") {
  id: String! @external
  orders: [Order!]!
}
```

</TabItem>
</Tabs>

## Best Practices

### 1. Choose Appropriate Type Variants
- **Node types**: Admin interfaces, audit trails, debugging
- **Flat types**: Public APIs, mobile apps, performance-critical apps

### 2. Configure Naming Consistently  
- Use consistent prefixes across your organization
- Consider federation requirements when naming
- Keep names concise but descriptive

### 3. Leverage Type Safety
- Use generated TypeScript types for client applications
- Configure GraphQL code generation tools
- Enable strict type checking in development

## Next Steps

- [System Types](./system) - Learn about filter types and system scalars
- [Configuration](../configuration) - Customize type generation
- [Queries](../queries/) - Use generated types in queries