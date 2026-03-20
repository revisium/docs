---
sidebar_position: 1
---

# Authentication

## JWT Authentication

The primary authentication method for the Admin UI and System API.

### Login

```graphql
mutation {
  login(data: { username: "admin", password: "admin" }) {
    accessToken
  }
}
```

### Using the Token

Include the JWT in the `Authorization` header:

```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"query": "{ me { id username } }"}'
```

### Default Credentials

| Deployment | Username | Password |
|------------|----------|----------|
| Docker Compose | `admin` | Value of `ADMIN_PASSWORD` env var (default: `admin`) |
| Standalone (with `--auth`) | `admin` | `admin` |
| Cloud | Google/GitHub OAuth |

Change the default admin password via the `ADMIN_PASSWORD` environment variable.

## OAuth 2.1

Used for MCP sessions and AI agent integrations. Clients connect via Streamable HTTP transport and authenticate per-session using the `login` tool.

### MCP Authentication Flow

1. Client connects to `/mcp`
2. Session is established with `mcp-session-id` header
3. Client calls `login` tool with username/password
4. All subsequent tool calls are authenticated for that session

```bash
# Manual MCP session (for debugging)
curl -X POST http://localhost:8080/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}'
```

## Session Security

- JWT tokens are stateless — no server-side session storage
- MCP sessions are isolated — each connection has its own auth state
- By default, all API endpoints (except login) require authentication. Public projects allow unauthenticated read access to generated endpoints
