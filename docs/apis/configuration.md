---
sidebar_position: 5
---

# API Configuration

Environment variables that control generated API behavior.

## Type Visibility

Control which type variants are generated:

| Variable | Default | Description |
|----------|---------|-------------|
| `GRAPHQL_HIDE_NODE_TYPES` | `false` | Hide generated node types from GraphQL query fields |
| `GRAPHQL_HIDE_FLAT_TYPES` | `false` | Hide generated flat data types from GraphQL query fields |

Set a flag to `true` or `1` to hide that type variant from the generated query schema. This is useful for public APIs where you only want flat data types, or internal APIs where you want the node shape with full metadata.

When using draft endpoints, singular mutations can still return node types even if `GRAPHQL_HIDE_NODE_TYPES=true`, because mutations need a stable return type. The hide flags primarily control query-field visibility.

## Naming

| Variable | Default | Description |
|----------|---------|-------------|
| `GRAPHQL_PREFIX_FOR_TABLES` | project name | Prefix for table-specific GraphQL types. Set to an empty string to remove the project prefix |
| `GRAPHQL_PREFIX_FOR_COMMON` | project name | Prefix for shared GraphQL types such as filters and pagination types. Set to an empty string to remove the project prefix |
| `GRAPHQL_FLAT_POSTFIX` | `Flat` | Postfix for flat GraphQL types |
| `GRAPHQL_NODE_POSTFIX` | empty | Postfix inserted before node type suffixes |

By default, generated table types are named from the project and table, for example `BlogPost`, `BlogPostNode`, and `BlogPostFlat`. Use empty prefixes when each endpoint serves a single project and you want shorter names.

Do not set both `GRAPHQL_FLAT_POSTFIX` and `GRAPHQL_NODE_POSTFIX` to empty strings when `GRAPHQL_HIDE_NODE_TYPES=false` and `GRAPHQL_HIDE_FLAT_TYPES=false`. Hide one type variant first, or keep at least one postfix non-empty.

## Federation

Generated GraphQL node types include Apollo Federation metadata with the `@key` directive. There is no separate federation feature flag; use the naming variables above when you need stable type names for gateway composition.

## Mutations

| Variable | Default | Description |
|----------|---------|-------------|
| `GRAPHQL_HIDE_MUTATIONS` | `false` | Hide generated GraphQL mutations from draft revision schemas |

Generated GraphQL mutations are only exposed for draft revisions. Head revisions are read-only regardless of this setting. Set `GRAPHQL_HIDE_MUTATIONS=true` when you need a kill switch for generated GraphQL mutations while keeping generated GraphQL query schemas available. REST endpoints are unchanged by this flag.

## Example Configurations

### Public API (simplified types)

```bash
GRAPHQL_HIDE_NODE_TYPES=true
GRAPHQL_HIDE_FLAT_TYPES=false
GRAPHQL_PREFIX_FOR_TABLES=
GRAPHQL_PREFIX_FOR_COMMON=
```

Result: clean types like `Post`, `PostFlat`, `Product` without project prefix or Node types.

### Admin Interface (full types)

```bash
GRAPHQL_HIDE_NODE_TYPES=false
GRAPHQL_HIDE_FLAT_TYPES=false
GRAPHQL_HIDE_MUTATIONS=false
```

Result: full query type variants with project prefixes for disambiguation, plus draft mutations.

### Read-only generated GraphQL

```bash
GRAPHQL_HIDE_MUTATIONS=true
```

Result: generated queries remain available, but draft-revision mutations are omitted from the schema.
