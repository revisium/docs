---
sidebar_position: 4
---

# AI Agent Memory

Use Revisium as a structured memory layer for AI agents with typed schemas, version control, and human review.

## When to Use

- AI agents that need persistent, structured memory (Claude Code, Cursor, custom)
- Agent-generated data that needs human review before going to production
- Multi-agent systems sharing state
- Any scenario where agent-written data needs audit trail and rollback

## Key Features

- **MCP Protocol** — built-in MCP server for direct agent access
- **Typed Schemas** — agents work with structured data, not raw text
- **Version Control** — rollback on corruption, audit trail of all agent changes
- **Human Review** — Admin UI for reviewing what agents wrote before committing
- **Branching** — isolate agent work per task or per agent

## Setup

```bash
# Start Revisium
npx @revisium/standalone@latest --auth

# Add to Claude Code
claude mcp add --transport http revisium http://localhost:9222/mcp
```

## How Agents Use It

The agent designs schemas, creates tables, and manages data through MCP tools:

```
Agent: "I need to store research findings"
→ login
→ createTable("findings", schema with title, source, content, tags)
→ createRow("findings", "finding-1", { title: "...", content: "...", ... })
→ commitRevision (with user permission)
```

## Schema Design by Agents

Agents can design their own schemas based on the task. For example, a research agent might create:

| Table | Fields |
|-------|--------|
| `topics` | name, description |
| `findings` | title, source, content, topic (FK → topics), relevance |
| `decisions` | title, rationale, status, related_findings (FK array → findings) |

The schema resource (`revisium://specs/schema`) is available to agents for understanding valid schema formats.

## Human Review Workflow

1. Agent makes changes in the Draft revision
2. Human opens Admin UI → Changes tab
3. Reviews schema changes and data modifications
4. Approves (commit) or rejects (revert)

This is a differentiator — no other AI memory solution provides visual review of agent-written data.

## Branching for Agents

| Branch | Purpose |
|--------|---------|
| `master` | Reviewed, committed agent data |
| `agent-research` | Agent's working branch — human reviews before merging |
| `agent-code-analysis` | Another agent's isolated workspace |

## See Also

- [MCP Setup](../apis/mcp) — full MCP configuration guide
- [@revisium/mcp-memory](https://github.com/revisium/mcp-memory) — standalone MCP memory server
