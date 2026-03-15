---
sidebar_position: 10
---

# Use Cases

Revisium fits where data needs structure, evolution, API access, or version control. Here are the most common patterns.

| Use Case | Key Features Used |
|----------|-------------------|
| [Dictionary Service](./dictionary-service) | Schema migrations, REST/GraphQL, FK integrity, multi-env sync |
| [Headless CMS](./headless-cms) | Versioning, branches, Admin UI, auto-generated APIs |
| [Configuration Store](./configuration-store) | Draft → commit workflow, branches for environments, JSON flexibility |
| [AI Agent Memory](./ai-agent-memory) | MCP, typed schemas, version control, human review via Admin UI |

## Choosing a Pattern

**Need migrations across environments?** → Dictionary Service pattern
**Need editorial workflow with preview?** → Headless CMS pattern
**Need versioned JSON settings?** → Configuration Store pattern
**Need AI agent integration?** → AI Agent Memory pattern

All patterns can be combined in a single Revisium instance — each project can follow its own pattern independently.
