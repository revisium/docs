# GraphQL Configuration

Customize your GraphQL API generation with environment variables and configuration options.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Environment Variables

Configure GraphQL schema generation and behavior through environment variables.

<Tabs>
<TabItem value="core-config" label="Core Configuration">

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GRAPHQL_HIDE_NODE_TYPES` | Boolean | false | Hide Node types (with metadata) from schema |
| `GRAPHQL_HIDE_FLAT_TYPES` | Boolean | false | Hide Flat types (without metadata) from schema |
| `GRAPHQL_FLAT_POSTFIX` | String | "Flat" | Postfix for flat types |
| `GRAPHQL_NODE_POSTFIX` | String | "" | Postfix for node types (results in "Node" when empty) |

</TabItem>
<TabItem value="naming-config" label="Naming Configuration">

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GRAPHQL_PREFIX_FOR_TABLES` | String | Project name | Prefix for table-specific types |
| `GRAPHQL_PREFIX_FOR_COMMON` | String | Project name | Prefix for common/system types |

</TabItem>
</Tabs>

## Type Visibility Control

Configure which type variants are generated and exposed in your schema.

<Tabs>
<TabItem value="default-types" label="Default (All Types)">

```bash
# Default configuration - all types generated
GRAPHQL_HIDE_NODE_TYPES=false
GRAPHQL_HIDE_FLAT_TYPES=false
```

**Generated schema includes:**
```graphql
type Query {
  # Node type queries
  product(id: String!): ProjectProductNode
  products(data: ProjectGetProductInput): ProjectProductConnection!
  
  # Flat type queries  
  productFlat(id: String!): ProjectProductFlat
  productsFlat(data: ProjectGetProductInput): ProjectProductFlatConnection!
}

type ProjectProductNode {
  id: String!
  createdAt: DateTime!
  data: ProjectProduct!
}

type ProjectProductFlat {
  name: String!
  price: Float!
}
```

</TabItem>
<TabItem value="node-only" label="Node Types Only">

```bash
# Hide flat types, show only node types
GRAPHQL_HIDE_FLAT_TYPES=true
```

**Generated schema includes:**
```graphql
type Query {
  # Only node type queries
  product(id: String!): ProjectProductNode
  products(data: ProjectGetProductInput): ProjectProductConnection!
  
  # No flat type queries generated
}
```

**Use case:** Admin interfaces, audit systems, full entity management

</TabItem>
<TabItem value="flat-only" label="Flat Types Only">

```bash
# Hide node types, show only flat types
GRAPHQL_HIDE_NODE_TYPES=true
```

**Generated schema includes:**
```graphql
type Query {
  # Only flat type queries
  productFlat(id: String!): ProjectProductFlat
  productsFlat(data: ProjectGetProductInput): ProjectProductFlatConnection!
  
  # No node type queries generated
}
```

**Use case:** Public APIs, mobile backends, performance-critical applications

</TabItem>
</Tabs>

## Custom Naming

Customize type naming conventions to match your organization's standards.

<Tabs>
<TabItem value="default-naming" label="Default Naming">

```bash
# Default naming (using project name)
GRAPHQL_PREFIX_FOR_TABLES=MyProject
GRAPHQL_PREFIX_FOR_COMMON=MyProject
GRAPHQL_FLAT_POSTFIX=Flat
GRAPHQL_NODE_POSTFIX=
```

**Generated type names:**
```graphql
# Table-specific types
type MyProjectProduct { }
type MyProjectProductNode { }
type MyProjectProductFlat { }
type MyProjectProductConnection { }

# Common/system types
type MyProjectPageInfo { }
enum MyProjectSortOrder { }
input MyProjectStringFilter { }
```

</TabItem>
<TabItem value="custom-naming" label="Custom Naming">

```bash
# Custom naming for organization
GRAPHQL_PREFIX_FOR_TABLES=CompanyAPI
GRAPHQL_PREFIX_FOR_COMMON=Sys
GRAPHQL_FLAT_POSTFIX=Simple
GRAPHQL_NODE_POSTFIX=Entity
```

**Generated type names:**
```graphql
# Table-specific types
type CompanyAPIProduct { }
type CompanyAPIProductEntity { }    # Node type with custom postfix
type CompanyAPIProductSimple { }    # Flat type with custom postfix

# Common/system types with different prefix
type SysPageInfo { }
enum SysSortOrder { }
input SysStringFilter { }
```

</TabItem>
<TabItem value="minimal-naming" label="Minimal Naming">

```bash
# Minimal naming without prefixes
GRAPHQL_PREFIX_FOR_TABLES=
GRAPHQL_PREFIX_FOR_COMMON=
GRAPHQL_FLAT_POSTFIX=Data
GRAPHQL_NODE_POSTFIX=Full
```

**Generated type names:**
```graphql
# Clean type names without prefixes
type Product { }
type ProductFull { }        # Node type
type ProductData { }        # Flat type
type ProductConnection { }

# System types without prefixes
type PageInfo { }
enum SortOrder { }
input StringFilter { }
```

</TabItem>
</Tabs>

## Federation-Friendly Configuration

Configure naming for Apollo Federation compatibility.

<Tabs>
<TabItem value="federation-config" label="Federation Configuration">

```bash
# Federation-friendly naming
GRAPHQL_PREFIX_FOR_TABLES=
GRAPHQL_PREFIX_FOR_COMMON=
GRAPHQL_NODE_POSTFIX=Entity
GRAPHQL_FLAT_POSTFIX=Data
GRAPHQL_HIDE_FLAT_TYPES=true  # Only expose entity types for federation
```

**Generated schema:**
```graphql
# Clean names for federation
type Product @key(fields: "id") {
  id: String!
  name: String!
  price: Float!
}

type ProductEntity @key(fields: "id") {
  id: String!
  createdAt: DateTime!
  data: Product!
}

# No conflicting prefixes across services
type PageInfo { }
enum SortOrder { }
```

</TabItem>
</Tabs>

## Configuration Examples

Real-world configuration scenarios for different use cases.

<Tabs>
<TabItem value="public-api" label="Public API Configuration">

```bash
# Optimized for public-facing APIs
GRAPHQL_HIDE_NODE_TYPES=true      # Hide metadata
GRAPHQL_HIDE_FLAT_TYPES=false     # Show simplified data
GRAPHQL_PREFIX_FOR_TABLES=        # Clean type names
GRAPHQL_PREFIX_FOR_COMMON=Common  # Prefixed system types
GRAPHQL_FLAT_POSTFIX=             # No postfix for main types
```

**Result:**
- Clean, simple type names (`Product`, `Category`, `Article`)
- No system metadata exposed
- Consistent system type naming (`CommonPageInfo`)

</TabItem>
<TabItem value="admin-interface" label="Admin Interface Configuration">

```bash
# Full-featured admin interface
GRAPHQL_HIDE_NODE_TYPES=false     # Show full metadata
GRAPHQL_HIDE_FLAT_TYPES=false     # Show both variants
GRAPHQL_PREFIX_FOR_TABLES=Admin   # Clear admin context
GRAPHQL_PREFIX_FOR_COMMON=Admin   # Consistent prefixing
GRAPHQL_FLAT_POSTFIX=Summary      # Clear distinction
GRAPHQL_NODE_POSTFIX=Details      # Clear distinction
```

**Result:**
- Full metadata access for admin features
- Clear type distinctions (`AdminProductDetails`, `AdminProductSummary`)
- Consistent admin branding

</TabItem>
<TabItem value="microservice" label="Microservice Configuration">

```bash
# Service-specific configuration
GRAPHQL_PREFIX_FOR_TABLES=ProductService
GRAPHQL_PREFIX_FOR_COMMON=ProductService
GRAPHQL_HIDE_FLAT_TYPES=false
GRAPHQL_FLAT_POSTFIX=Lite
GRAPHQL_NODE_POSTFIX=Full
```

**Result:**
- Clear service boundaries (`ProductServiceProduct`, `ProductServiceProductFull`)
- Prevents type conflicts in federated schemas
- Service-specific system types

</TabItem>
</Tabs>

## Validation Rules

Configuration validation prevents invalid naming combinations.

<Tabs>
<TabItem value="postfix-rules" label="Postfix Validation">

```bash
# ❌ Invalid - both postfixes empty
GRAPHQL_FLAT_POSTFIX=
GRAPHQL_NODE_POSTFIX=
# Error: Cannot have both postfixes empty when both type variants are enabled
```

```bash
# ✅ Valid - at least one postfix specified
GRAPHQL_FLAT_POSTFIX=Simple
GRAPHQL_NODE_POSTFIX=
```

```bash
# ✅ Valid - hide one type variant
GRAPHQL_FLAT_POSTFIX=
GRAPHQL_NODE_POSTFIX=
GRAPHQL_HIDE_FLAT_TYPES=true
```

</TabItem>
<TabItem value="naming-rules" label="Naming Validation">

```bash
# ✅ Valid GraphQL identifiers
GRAPHQL_PREFIX_FOR_TABLES=MyAPI
GRAPHQL_FLAT_POSTFIX=Simple

# ❌ Invalid - contains special characters
GRAPHQL_PREFIX_FOR_TABLES=My-API
GRAPHQL_FLAT_POSTFIX=Simple!

# ❌ Invalid - starts with number
GRAPHQL_PREFIX_FOR_TABLES=2024API
```

**Valid identifier rules:**
- Start with letter or underscore
- Contain only letters, digits, underscores
- Follow GraphQL naming conventions

</TabItem>
</Tabs>

## Performance Impact

Different configurations have varying performance characteristics.

<Tabs>
<TabItem value="performance-comparison" label="Performance Comparison">

| Configuration | Schema Size | Memory Usage | Query Performance |
|---------------|-------------|--------------|-------------------|
| All types | Large | High | Standard |
| Node only | Medium | Medium | Standard |
| Flat only | Small | Low | Faster (no metadata) |
| Minimal naming | Same | Same | Slightly faster introspection |

</TabItem>
<TabItem value="optimization-tips" label="Optimization Tips">

**For Performance:**
```bash
# Minimal schema for performance
GRAPHQL_HIDE_NODE_TYPES=true    # Reduce schema size
GRAPHQL_PREFIX_FOR_TABLES=      # Faster introspection
GRAPHQL_PREFIX_FOR_COMMON=      # Smaller type names
```

**For Development:**
```bash
# Full schema for development
GRAPHQL_HIDE_NODE_TYPES=false  # Access to all metadata
GRAPHQL_HIDE_FLAT_TYPES=false  # Multiple data access patterns
GRAPHQL_PREFIX_FOR_TABLES=Dev  # Clear development context
```

**For Production:**
```bash
# Production-optimized
GRAPHQL_HIDE_NODE_TYPES=true   # Hide internal metadata
GRAPHQL_PREFIX_FOR_TABLES=API  # Professional naming
GRAPHQL_PREFIX_FOR_COMMON=API  # Consistent branding
```

</TabItem>
</Tabs>

## Dynamic Configuration

Configuration changes require service restart to take effect.

<Tabs>
<TabItem value="config-reload" label="Configuration Updates">

**Process:**
1. Update environment variables
2. Restart `revisium-endpoint` service
3. GraphQL schema regenerated automatically
4. New schema available immediately

```bash
# Update configuration
export GRAPHQL_HIDE_FLAT_TYPES=true
export GRAPHQL_PREFIX_FOR_TABLES=NewAPI

# Restart service
pm2 restart revisium-endpoint

# Schema updated automatically
curl -X POST http://localhost:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'
```

</TabItem>
<TabItem value="config-validation" label="Configuration Validation">

The service validates configuration on startup:

```bash
# Invalid configuration example
export GRAPHQL_FLAT_POSTFIX=""
export GRAPHQL_NODE_POSTFIX=""
export GRAPHQL_HIDE_FLAT_TYPES=false
export GRAPHQL_HIDE_NODE_TYPES=false

npm run start:dev
# Error: Invalid configuration - both postfixes cannot be empty when both type variants are enabled
```

**Validation checks:**
- Postfix mutual exclusivity
- GraphQL identifier validation  
- Type variant consistency
- Prefix/postfix combination validity

</TabItem>
</Tabs>

## Configuration Best Practices

### 1. Choose Configuration Based on Use Case
- **Public APIs**: Hide node types, minimal naming
- **Admin interfaces**: Show all types, descriptive naming
- **Federation**: Clean names, entity-focused types

### 2. Maintain Consistency
- Use consistent prefixes across related services
- Establish organization-wide naming conventions
- Document configuration decisions

### 3. Consider Schema Evolution
- Plan for future type additions
- Choose naming that scales with growth
- Test configuration changes in development first

### 4. Monitor Performance Impact
- Measure schema size and query performance
- Optimize based on actual usage patterns
- Consider client-specific configurations

## Troubleshooting

<Tabs>
<TabItem value="common-issues" label="Common Issues">

**Issue: Type name conflicts**
```bash
# Problem: Same type names generated
GRAPHQL_FLAT_POSTFIX=""
GRAPHQL_NODE_POSTFIX=""
```

**Solution: Add distinguishing postfixes**
```bash
GRAPHQL_FLAT_POSTFIX="Data"
GRAPHQL_NODE_POSTFIX="Entity"
```

---

**Issue: Invalid GraphQL identifiers**
```bash
# Problem: Special characters in names
GRAPHQL_PREFIX_FOR_TABLES="My-API"
```

**Solution: Use valid identifiers**
```bash
GRAPHQL_PREFIX_FOR_TABLES="MyAPI"
```

</TabItem>
<TabItem value="debugging" label="Debug Configuration">

```bash
# Enable debug logging
DEBUG=revisium:graphql:*
LOG_LEVEL=debug

# Start with debug output
npm run start:dev

# Check generated type names
curl -X POST http://localhost:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name kind } } }"}'
```

</TabItem>
</Tabs>

## Next Steps

- [Generated Types](./types/generated) - Understand the types created by your configuration
- [System Types](./types/system) - Learn about system types affected by naming configuration
- [Queries](./queries/) - Use your configured types in GraphQL queries