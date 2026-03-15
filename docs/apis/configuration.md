---
sidebar_position: 5
---

# API Configuration

Environment variables that control generated API behavior.

## Type Visibility

Control which type variants are generated:

| Variable | Default | Description |
|----------|---------|-------------|
| `ENDPOINT_GRAPHQL_SHOW_NODE_TYPE` | `true` | Generate Node types (with metadata) |
| `ENDPOINT_GRAPHQL_SHOW_FLAT_TYPE` | `true` | Generate Flat types (data only) |

Set to `false` to hide a type variant from the generated schema. Useful for public APIs where you only want Flat types.

## Naming

| Variable | Default | Description |
|----------|---------|-------------|
| `ENDPOINT_GRAPHQL_ADD_PROJECT_PREFIX` | `true` | Prefix type names with project name |

When `true`, types are named `{Project}{Table}` (e.g., `BlogPost`). When `false`, types use only the table name (e.g., `Post`). Disable the prefix when each endpoint serves a single project and you want cleaner type names.

## Federation

| Variable | Default | Description |
|----------|---------|-------------|
| `ENDPOINT_GRAPHQL_FEDERATION` | `false` | Enable Apollo Federation support |

When enabled, generated schemas include Federation directives for use in a federated gateway.

## Performance

| Variable | Default | Description |
|----------|---------|-------------|
| `ENDPOINT_MAX_QUERY_DEPTH` | `10` | Maximum GraphQL query depth |
| `ENDPOINT_MAX_QUERY_COMPLEXITY` | `1000` | Maximum query complexity score |

## Example Configurations

### Public API (simplified types)

```bash
ENDPOINT_GRAPHQL_SHOW_NODE_TYPE=false
ENDPOINT_GRAPHQL_SHOW_FLAT_TYPE=true
ENDPOINT_GRAPHQL_ADD_PROJECT_PREFIX=false
```

Result: clean types like `Post`, `PostFlat`, `Product` without project prefix or Node types.

### Admin Interface (full types)

```bash
ENDPOINT_GRAPHQL_SHOW_NODE_TYPE=true
ENDPOINT_GRAPHQL_SHOW_FLAT_TYPE=true
ENDPOINT_GRAPHQL_ADD_PROJECT_PREFIX=true
```

Result: full type variants with project prefix for disambiguation.

### Microservice (federated)

```bash
ENDPOINT_GRAPHQL_FEDERATION=true
ENDPOINT_GRAPHQL_ADD_PROJECT_PREFIX=true
```

Result: Federation-ready schema that can be composed with other services in an Apollo Gateway.
