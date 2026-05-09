---
sidebar_position: 1
---

# Authentication

## Browser Session Authentication

The Admin UI uses the JWT-based cookie session model. After login, Revisium sets three cookies:

| Cookie | Type | Path | Default lifetime | Purpose |
|--------|------|------|------------------|---------|
| `rev_at` | httpOnly JWT access token | `/` | 30 minutes | Authenticates browser requests to core, generated APIs, and the Admin UI backend |
| `rev_rt` | httpOnly opaque refresh token | `/api/auth/` | 7 days | Rotates the browser session through `/api/auth/refresh` |
| `rev_session` | readable presence flag | `/` | 7 days | Lets the Admin UI know a session may still be alive; it is not a credential |

`rev_session=1` can outlive `rev_at`. That is expected: the access cookie is short-lived, while the refresh cookie and presence flag use the longer session lifetime. The Admin UI can then refresh the session without storing bearer tokens in `localStorage`.

Cookie `Secure` and `SameSite` attributes are controlled by `COOKIE_SECURE` and `COOKIE_SAMESITE`; proxy and credentialed CORS behavior depends on `TRUST_PROXY` and `CORS_ORIGIN`. See [Deployment authentication](../deployment#authentication).

```mermaid
sequenceDiagram
  participant Browser as Admin UI
  participant Core as Revisium Core

  Browser->>Core: login / OAuth callback
  Core-->>Browser: Set-Cookie rev_at, rev_rt, rev_session
  Browser->>Core: authenticated API request with rev_at
  Core-->>Browser: data
  Browser->>Core: POST /api/auth/refresh with rev_rt
  Core-->>Browser: rotated rev_at, rev_rt, rev_session
  Browser->>Core: POST /api/auth/logout
  Core-->>Browser: clear rev_at, rev_rt, rev_session
```

### Login

The `login` GraphQL mutation still returns an `accessToken` for API clients, but browser login also sets the auth cookies on the response.

```graphql
mutation {
  login(data: { username: "admin", password: "admin" }) {
    accessToken
    expiresIn
  }
}
```

### Refresh And Logout

Browser session refresh is cookie-driven:

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Cookie: rev_rt=<refresh-cookie>" \
  -i
```

The refresh endpoint reads only the `rev_rt` cookie; it does not require `rev_at` to be present or valid. This lets the browser recover after the access cookie expires while `rev_session` still exists. On success, Revisium rotates the refresh token and returns new `Set-Cookie` headers for `rev_at`, `rev_rt`, and `rev_session`. Missing, invalid, or expired `rev_rt` clears the browser session cookies and returns unauthorized.

A retry with the same refresh token inside the default 30-second `JWT_REFRESH_GRACE_PERIOD_MS` window is treated as a duplicate refresh attempt. Outside that window, Revisium treats the same token as refresh-token reuse, revokes the refresh-token family, clears the browser session cookies, and rejects the request.

Logout revokes the refresh-token family when possible and clears all three cookies:

```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Cookie: rev_rt=<refresh-cookie>" \
  -i
```

### `/get-token` And `issueAccessToken`

The Admin UI `/get-token` page calls the GraphQL `issueAccessToken` query from the current browser session:

```graphql
query {
  issueAccessToken {
    accessToken
  }
}
```

Use this when you are already logged in through cookies but need a short-lived bearer token for a CLI, script, or manual API call. `issueAccessToken` only works for JWT-authenticated sessions; API-key-authenticated requests cannot mint a user access token.

## Bearer Token Authentication

Bearer tokens remain supported for programmatic access. Include the JWT in the `Authorization` header:

```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"query": "{ me { id username } }"}'
```

For long-lived integrations, prefer API keys over copying a browser-issued access token.

### Default Credentials

| Deployment | Username | Password |
|------------|----------|----------|
| Docker Compose | `admin` | Value of `ADMIN_PASSWORD` env var (default: `admin`) |
| Standalone (with `--auth`) | `admin` | `admin` |
| Cloud | Google/GitHub OAuth |

Do not use default credentials outside local development. Set `ADMIN_PASSWORD` before the first Docker or self-hosted start, replace standalone `admin` / `admin` immediately when `--auth` is used, and use OAuth or a secrets manager for production where possible.

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

## API Keys

For programmatic access without user sessions. See the dedicated [API Keys](./api-keys) page.

Two types: **Personal** (act as you — for local dev/CLI) and **Service** (standalone identity — for CI/CD and integrations).

Quick start:

```bash
# Using X-Api-Key header
curl -H "X-Api-Key: rev_xxxxxxxxxxxxxxxxxxxxxx" \
  http://localhost:8080/api/...

# Using Bearer header
curl -H "Authorization: Bearer rev_xxxxxxxxxxxxxxxxxxxxxx" \
  http://localhost:8080/api/...
```

## Session Security

- `rev_at` is stateless; refresh tokens are stored server-side and rotate on refresh
- `rev_rt` is httpOnly and scoped to `/api/auth/`
- `rev_session` is readable by the Admin UI but carries only the literal value `1`
- MCP sessions are isolated — each connection has its own auth state
- By default, all API endpoints (except login) require authentication. Public projects allow unauthenticated read access to generated endpoints
