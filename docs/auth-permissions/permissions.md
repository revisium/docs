---
sidebar_position: 2
---

# Permissions

Revisium uses [CASL](https://casl.js.org/)-based declarative permissions at three access levels.

## Access Levels

### System Level

| Role | Capabilities |
|------|-------------|
| **Superadmin** | Full platform access — manage all organizations, projects, users |

### Organization Level

| Role | Capabilities |
|------|-------------|
| **Admin** | Manage organization settings, members, all projects |
| **Member** | Access projects, limited org management |

### Project Level

| Role | Capabilities |
|------|-------------|
| **Admin** | Full project access — schema, data, branches, endpoints, settings |
| **Editor** | Create/modify tables, rows, branches; commit changes |
| **Viewer** | Read-only access — browse schemas, data, revisions |

## Permission Model

Permissions are attribute-based using CASL abilities:

- Each role defines a set of allowed **actions** (read, create, update, delete) on **subjects** (project, table, row, branch, etc.)
- Permissions are checked on every API call
- The Admin UI adapts its interface based on the current user's permissions (e.g., hiding edit buttons for viewers)

## Multi-Tenancy

Organizations provide complete isolation:
- Users in one organization cannot access another organization's projects
- Project-level roles are scoped within the organization
- A user can have different roles in different projects
