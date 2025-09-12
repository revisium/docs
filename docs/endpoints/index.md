# Revisium Endpoints

Revisium Endpoints provides dynamic GraphQL and REST APIs automatically generated from your JSON schemas. When you define data structures in Revisium, endpoints are instantly available for querying and mutating your data with powerful filtering, sorting, and pagination capabilities.

## Key Concepts

### Git-like Revision System
- **Draft**: Working state where you modify schemas and data
- **Commit**: Creates immutable revision snapshot
- **Head**: Current production revision
- **Auto-Migration**: Endpoints automatically switch to new head revision after commit

### Multi-API Generation
From a single schema definition, get:
- **GraphQL API**: Full-featured GraphQL endpoint with introspection
- **REST API**: RESTful endpoints following OpenAPI specification *(coming soon)*
- **Type Safety**: Generated TypeScript types for client applications

## Features

### Automatic Schema Generation
- **Type Conversion**: JSON Schema → GraphQL/REST types
- **Relationship Mapping**: Foreign keys become GraphQL relationships
- **Validation**: Input validation based on schema constraints

### Advanced Querying
- **Filtering**: Complex WHERE conditions with AND/OR/NOT logic
- **Sorting**: System fields + custom JSON path ordering
- **Pagination**: Relay-style cursor pagination

### Developer Experience
- **Real-time Updates**: Schema changes immediately available in draft
- **Type Safety**: Generated TypeScript definitions
- **Introspection**: Full GraphQL introspection support
- **Documentation**: Auto-generated API documentation

## Next Steps

- [GraphQL API](./graphql/) - Complete GraphQL proxy documentation
- [REST API](./rest/) - REST proxy documentation *(coming soon)*