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
| [JWT](./authentication) | Admin UI, API calls |
| [OAuth 2.1](./authentication) | MCP / AI agents |

## Sections

- [Authentication](./authentication) — login methods, token management
- [Permissions](./permissions) — roles, access levels, CASL
