# System Types

Reference for all system-generated types used across GraphQL schemas, including pagination, filtering, and utility types.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Pagination Types

Types implementing the Relay pagination specification.

<Tabs>
<TabItem value="pageinfo" label="PageInfo Type">

```graphql
type ProjectPageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}
```

**Field descriptions:**
- `hasNextPage` - `true` if more items exist after `endCursor`
- `hasPreviousPage` - `true` if more items exist before `startCursor`  
- `startCursor` - Cursor of the first item in current page
- `endCursor` - Cursor of the last item in current page

</TabItem>
<TabItem value="cursors" label="Cursor Format">

```typescript
// Cursor structure (base64 encoded)
interface Cursor {
  id: string;                    // Entity ID
  createdAt: string;            // ISO timestamp
  [sortField: string]: any;     // Additional sort fields
}

// Example cursor value
const cursor = {
  id: "user-123",
  createdAt: "2025-01-15T10:30:00Z"
};

const encodedCursor = btoa(JSON.stringify(cursor));
// Result: "eyJpZCI6InVzZXItMTIzIiwiY3JlYXRlZEF0IjoiMjAyNS0wMS0xNVQxMDozMDowMFoifQ=="
```

</TabItem>
</Tabs>

## Sorting Types

Types for specifying sort order and direction.

<Tabs>
<TabItem value="sort-order" label="Sort Order Enum">

```graphql
enum ProjectSortOrder {
  asc   # Ascending order (A-Z, 1-9, oldest first)
  desc  # Descending order (Z-A, 9-1, newest first)
}
```

</TabItem>
<TabItem value="order-by" label="OrderBy Input Types">

```graphql
# System field ordering
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

# JSON path ordering
input ProjectJsonOrderInput {
  path: String!                     # JSON path expression
  direction: ProjectSortOrder!      # Sort direction
  type: ProjectJsonValueType!       # Type casting for proper sorting
}

enum ProjectJsonValueType {
  text       # String/text values
  int        # Integer numbers
  float      # Floating point numbers  
  boolean    # Boolean values
  timestamp  # Date/timestamp values
}
```

</TabItem>
</Tabs>

## Filter Types

Comprehensive filtering types for different data types.

<Tabs>
<TabItem value="string-filter" label="String Filter">

```graphql
input ProjectStringFilter {
  contains: String           # Substring search
  endsWith: String          # Suffix match
  equals: String            # Exact match
  gt: String               # Greater than (lexicographic)
  gte: String              # Greater than or equal
  in: [String!]            # Array membership
  lt: String               # Less than (lexicographic)  
  lte: String              # Less than or equal
  mode: ProjectFilterStringMode  # Case sensitivity
  not: String              # Negation
  notIn: [String!]         # Array exclusion
  search: String           # Full-text search
  startsWith: String       # Prefix match
}

enum ProjectFilterStringMode {
  default      # Case-sensitive
  insensitive  # Case-insensitive
}
```

**Usage examples:**
```graphql
# Case-insensitive substring search
{ data: { path: ["name"], string_contains: "john", mode: insensitive } }

# Email domain filtering
{ data: { path: ["email"], string_ends_with: "@company.com" } }

# Full-text search
{ data: { path: ["description"], search: "graphql typescript" } }
```

</TabItem>
<TabItem value="boolean-filter" label="Boolean Filter">

```graphql
input ProjectBoolFilter {
  equals: Boolean    # Exact match
  not: Boolean      # Negation
}
```

**Usage examples:**
```graphql
# Active users only
{ data: { path: ["active"], equals: true } }

# Not suspended users
{ data: { path: ["suspended"], not: true } }
```

</TabItem>
<TabItem value="datetime-filter" label="DateTime Filter">

```graphql
input ProjectDateTimeFilter {
  equals: String     # Exact timestamp match
  gt: String        # After this time
  gte: String       # At or after this time
  in: [String!]     # One of these timestamps
  lt: String        # Before this time
  lte: String       # At or before this time
  notIn: [String!]  # Not one of these timestamps
}
```

**Usage examples:**
```graphql
# Created in the last 30 days
{ createdAt: { gte: "2024-12-15T00:00:00Z" } }

# Date range filtering
{ 
  createdAt: { 
    gte: "2025-01-01T00:00:00Z", 
    lte: "2025-01-31T23:59:59Z" 
  } 
}
```

</TabItem>
<TabItem value="json-filter" label="JSON Filter">

```graphql
input ProjectJsonFilter {
  # Path specification
  path: [String!]!              # JSON path array
  
  # Value matching
  equals: JSON                  # Exact value match
  not: JSON                    # Value negation
  in: [JSON!]                  # Array membership (extension)
  notIn: [JSON!]               # Array exclusion (extension)
  
  # String operations
  string_contains: String       # Substring search
  string_ends_with: String     # Suffix match
  string_starts_with: String   # Prefix match
  
  # Numeric comparisons
  gt: Float                    # Greater than
  gte: Float                   # Greater than or equal
  lt: Float                    # Less than
  lte: Float                   # Less than or equal
  
  # Array operations
  array_contains: JSON         # JSONB containment (@>)
  array_ends_with: JSON       # Array suffix
  array_starts_with: JSON     # Array prefix
  
  # Options
  mode: ProjectFilterJsonMode  # Case sensitivity
}

enum ProjectFilterJsonMode {
  default      # Case-sensitive
  insensitive  # Case-insensitive
}
```

**Usage examples:**
```graphql
# Simple path filtering
{ data: { path: ["status"], equals: "active" } }

# Nested path filtering  
{ data: { path: ["profile", "age"], gte: 18 } }

# Array containment
{ data: { path: ["tags"], array_contains: "developer" } }

# Case-insensitive string search
{ 
  data: { 
    path: ["description"], 
    string_contains: "GraphQL", 
    mode: insensitive 
  } 
}
```

</TabItem>
</Tabs>

## Where Input Types

Composite input types for complex filtering with logical operators.

<Tabs>
<TabItem value="where-structure" label="Where Input Structure">

```graphql
input ProjectUserWhereInput {
  # Logical operators
  AND: [ProjectUserWhereInput!]
  NOT: [ProjectUserWhereInput!]  
  OR: [ProjectUserWhereInput!]
  
  # System field filters
  createdAt: ProjectDateTimeFilter
  createdId: ProjectStringFilter
  id: ProjectStringFilter
  publishedAt: ProjectDateTimeFilter
  readonly: ProjectBoolFilter
  updatedAt: ProjectDateTimeFilter
  versionId: ProjectStringFilter
  
  # JSON field filters
  data: ProjectJsonFilter
  meta: ProjectJsonFilter
}
```

</TabItem>
<TabItem value="logical-examples" label="Logical Operator Examples">

```graphql
# AND logic - all conditions must be true
{
  AND: [
    { data: { path: ["status"], equals: "active" } },
    { data: { path: ["verified"], equals: true } },
    { createdAt: { gte: "2025-01-01T00:00:00Z" } }
  ]
}

# OR logic - any condition can be true
{
  OR: [
    { data: { path: ["role"], equals: "admin" } },
    { data: { path: ["role"], equals: "moderator" } }
  ]
}

# NOT logic - condition must be false
{
  NOT: {
    data: { path: ["status"], equals: "deleted" }
  }
}

# Complex nested logic
{
  AND: [
    {
      OR: [
        { data: { path: ["tier"], equals: "premium" } },
        { data: { path: ["tier"], equals: "enterprise" } }
      ]
    },
    {
      NOT: {
        data: { path: ["suspended"], equals: true }
      }
    }
  ]
}
```

</TabItem>
</Tabs>

## Scalar Types

Custom scalar types used throughout the schema.

<Tabs>
<TabItem value="datetime" label="DateTime Scalar">

```graphql
scalar DateTime
```

**Format:** ISO 8601 date-time strings
**Examples:**
- `"2025-01-15T10:30:00Z"` - UTC timestamp
- `"2025-01-15T10:30:00-05:00"` - With timezone offset
- `"2025-01-15T10:30:00.123Z"` - With milliseconds

**Usage in filters:**
```graphql
{ createdAt: { gte: "2025-01-15T10:30:00Z" } }
```

</TabItem>
<TabItem value="json" label="JSON Scalar">

```graphql
scalar JSON
```

**Purpose:** Represents arbitrary JSON values  
**Examples:**
- `"string value"`
- `42`
- `true`
- `["array", "of", "values"]`
- `{"object": {"with": "nested", "data": true}}`

**Usage:**
```graphql
# Raw JSON field in Node types
type ProjectUserNode {
  json: JSON!  # Complete entity as JSON
}

# JSON filtering
{ data: { path: ["metadata"], equals: {"version": 2} } }
```

</TabItem>
</Tabs>

## Query Input Types

Main input types for list queries.

<Tabs>
<TabItem value="get-input" label="Get Input Type">

```graphql
input ProjectGetUserInput {
  # Pagination
  after: String                          # Forward pagination cursor
  first: Int                            # Number of items forward
  before: String                        # Backward pagination cursor  
  last: Int                             # Number of items backward
  
  # Sorting
  orderBy: [ProjectGetUserOrderByInput!] # Sort specification
  
  # Filtering  
  where: ProjectUserWhereInput          # Filter conditions
}
```

**Validation rules:**
- `first` and `last` cannot be used together
- `after` requires `first`
- `before` requires `last`
- Maximum page size: 500
- Default page size: 50

</TabItem>
<TabItem value="input-examples" label="Input Examples">

```graphql
# Forward pagination with filtering
{
  first: 20,
  after: "eyJpZCI6InVzZXItMTIzIn0=",
  where: {
    data: { path: ["active"], equals: true }
  },
  orderBy: [
    { field: createdAt, direction: desc }
  ]
}

# Backward pagination
{
  last: 15,
  before: "eyJpZCI6InVzZXItNDU2In0=",
  orderBy: [
    { field: updatedAt, direction: asc }
  ]
}

# Complex filtering and JSON path sorting
{
  first: 25,
  where: {
    AND: [
      { data: { path: ["status"], equals: "published" } },
      { data: { path: ["category"], in: ["tech", "science"] } }
    ]
  },
  orderBy: [
    { data: { path: "priority", direction: "desc", type: "int" } },
    { field: createdAt, direction: desc }
  ]
}
```

</TabItem>
</Tabs>

## Error Types

While not explicitly defined in schema, these error patterns are returned by the system.

<Tabs>
<TabItem value="validation-errors" label="Validation Errors">

```json
{
  "errors": [
    {
      "message": "Variable '$first' expected value of type 'Int' but got String.",
      "locations": [{"line": 2, "column": 9}],
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      }
    }
  ]
}
```

</TabItem>
<TabItem value="data-errors" label="Data Errors">

```json
{
  "data": {
    "user": null
  },
  "errors": [
    {
      "message": "Record not found",
      "locations": [{"line": 2, "column": 3}],
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

</TabItem>
<TabItem value="permission-errors" label="Permission Errors">

```json
{
  "errors": [
    {
      "message": "You are not allowed to read on Project",
      "locations": [{"line": 2, "column": 3}],
      "path": ["products"],
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

</TabItem>
</Tabs>

## Type Introspection

Query the schema to understand available types and their structure.

<Tabs>
<TabItem value="introspection" label="Schema Introspection">

```graphql
# Get all type names
query GetAllTypes {
  __schema {
    types {
      name
      kind
    }
  }
}

# Get specific type details
query GetUserType {
  __type(name: "ProjectUser") {
    name
    kind
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}

# Get query root fields
query GetQueries {
  __schema {
    queryType {
      fields {
        name
        args {
          name
          type {
            name
          }
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="type-info" label="Type Information">

```graphql
# Check if field exists
query CheckFieldExists {
  __type(name: "ProjectUserNode") {
    fields(includeDeprecated: true) {
      name
      isDeprecated
      deprecationReason
    }
  }
}

# Get enum values
query GetEnumValues {
  __type(name: "ProjectSortOrder") {
    enumValues {
      name
      description
      isDeprecated
    }
  }
}
```

</TabItem>
</Tabs>

## Configuration Impact

How environment variables affect system type generation.

<Tabs>
<TabItem value="prefix-config" label="Prefix Configuration">

```bash
# Default configuration
GRAPHQL_PREFIX_FOR_COMMON=MyProject

# Generated types
MyProjectPageInfo
MyProjectSortOrder
MyProjectStringFilter
MyProjectBoolFilter
MyProjectDateTimeFilter
MyProjectJsonFilter
```

```bash
# Custom configuration
GRAPHQL_PREFIX_FOR_COMMON=Sys

# Generated types  
SysPageInfo
SysSortOrder
SysStringFilter
SysBoolFilter
SysDateTimeFilter
SysJsonFilter
```

</TabItem>
<TabItem value="minimal-config" label="Minimal Configuration">

```bash
# Remove prefixes for cleaner schema
GRAPHQL_PREFIX_FOR_COMMON=

# Generated types (no prefix)
PageInfo
SortOrder  
StringFilter
BoolFilter
DateTimeFilter
JsonFilter
```

</TabItem>
</Tabs>

## Performance Considerations

### 1. Filter Complexity
```graphql
# ✅ Simple filters are fast
{ data: { path: ["status"], equals: "active" } }

# ⚠️ Complex nested filters are slower
{
  AND: [
    {
      OR: [
        { data: { path: ["tags"], array_contains: "urgent" } },
        { data: { path: ["priority"], gte: 8 } }
      ]
    },
    {
      NOT: {
        data: { path: ["archived"], equals: true }
      }
    }
  ]
}
```

### 2. JSON Path Depth
```graphql
# ✅ Shallow paths are efficient
{ data: { path: ["status"], equals: "active" } }

# ⚠️ Deep paths require more processing
{ data: { path: ["config", "ui", "theme", "colors", "primary"], equals: "#blue" } }
```

### 3. Page Size Limits
- Maximum `first`/`last`: 500
- Recommended: 50 for web, 20 for mobile
- Use pagination for large datasets

## Next Steps

- [Generated Types](./generated) - Learn about entity and connection types
- [Filtering](../queries/filtering) - Use filter types in practice
- [Configuration](../configuration) - Customize system type generation