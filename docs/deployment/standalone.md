---
sidebar_position: 1
---

# Standalone

The standalone package runs Revisium with embedded PostgreSQL in a single command. No external dependencies required.

## Quick Start

```bash
npx @revisium/standalone@latest
```

Open [http://localhost:9222](http://localhost:9222). No authentication by default.

## CLI Options

| Option | Default | Description |
|--------|---------|-------------|
| `--port` | `9222` | HTTP port |
| `--auth` | `false` | Enable authentication (login: `admin` / `admin`) |
| `--data-dir` | OS temp dir | Directory for embedded PostgreSQL data |

```bash
# Custom port with auth
npx @revisium/standalone@latest --port 3000 --auth

# Persistent data directory
npx @revisium/standalone@latest --data-dir ./revisium-data
```

## MCP Setup

The standalone server includes an MCP endpoint at `/mcp`:

```bash
# Start standalone
npx @revisium/standalone@latest --auth

# Add to Claude Code
claude mcp add --transport http revisium http://localhost:9222/mcp
```

## When to Use

- Local development and prototyping
- AI agent integrations (Claude Code, Cursor)
- Quick demos and PoCs
- Testing schema designs

## When to Use Docker Instead

- Production deployments
- Multi-user environments
- When you need Redis (caching) or S3 (files)
- Horizontal scaling
