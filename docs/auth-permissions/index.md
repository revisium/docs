---
sidebar_position: 8
---

# Auth & Permissions

Revisium provides authentication and role-based access control at three levels: system, organization, and project.

## Overview

| Level | Roles | Scope |
|-------|-------|-------|
| System | Superadmin | Full platform access |
| Organization | Admin, Member | All projects in the org |
| Project | Admin, Editor, Viewer | Single project |

## Authentication Methods

| Method | Use case |
|--------|----------|
| [JWT](./authentication) | Admin UI, interactive sessions |
| [API Keys](./api-keys) | Local dev, CLI, CI/CD, integrations, service access |
| [OAuth 2.1](./authentication#oauth-21) | MCP / AI agents |

## Sections

- [Authentication](./authentication) — login methods, token management
- [API Keys](./api-keys) — personal keys, service keys, scoping, usage with all APIs
- [Permissions](./permissions) — roles, access levels, CASL
