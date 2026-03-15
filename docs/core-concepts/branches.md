---
sidebar_position: 7
---

import Screenshot from '@site/src/components/Screenshot';

# Branches

Branches are isolated development lines within a project. Each branch has its own draft, revision history, and HEAD. Work on one branch does not affect others.

## Default Branch

Every project has a root branch (usually `master`). Additional branches can be created from any existing revision.

## Creating a Branch

A new branch is created from a specific revision. It starts with that revision as its HEAD and an empty draft.

```
master: rev-1 → rev-2 → rev-3 (HEAD)
                           ↓
staging:                 rev-3 (HEAD) → draft
```

## Use Cases

| Branch | Purpose |
|--------|---------|
| `master` | Production data |
| `staging` | Pre-release review and testing |
| `dev` | Development and experimentation |
| Feature branch | A/B testing, per-client configs, experimental schemas |

## Branch Isolation

Each branch maintains its own:
- Draft revision (working state)
- HEAD revision (latest committed state)
- Revision history
- API endpoints (bound to that branch's revisions)

Schema changes on one branch don't affect tables on other branches.

## Workflow Example

1. Create a `staging` branch from `master` HEAD
2. Make schema and data changes in `staging` draft
3. Review changes, commit
4. Create an API endpoint bound to `staging` HEAD for testing
5. When satisfied, recreate the changes on `master`

## Admin UI

The Admin UI provides:
- Branch selector in the navigation
- Branch map showing all branches and their revision history
- Branch creation from any revision

<Screenshot alt="Branch Map — visual overview of branches, their revisions, and connected endpoints" />
