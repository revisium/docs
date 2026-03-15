---
sidebar_position: 3
---

# Configuration Store

Use Revisium as a versioned configuration store for application settings, feature flags, and pricing rules.

## When to Use

- Application settings that change independently of deployments
- Feature flags with review workflow
- Pricing rules, rate limits, thresholds
- Environment-specific configurations (dev/staging/prod)

## Key Features

- **Draft → Review → Commit** — changes are reviewed before going live
- **Branches** — `dev`, `staging`, `prod` branches for environment-specific config
- **Rollback** — revert to any previous configuration state
- **JSON flexibility** — any structure from flat key-value to deeply nested objects
- **Computed fields** — derive values from other fields (e.g., annual price from monthly)

## Schema Example

**Table `feature-flags`** — each row is a feature flag:

```json
{
  "type": "object",
  "properties": {
    "enabled": { "type": "boolean", "default": false },
    "rollout": { "type": "number", "default": 0 },
    "description": { "type": "string", "default": "" }
  },
  "required": ["enabled", "rollout", "description"]
}
```

Row id: `"dark-mode"`, data: `{ "enabled": true, "rollout": 100, "description": "Dark mode UI" }`
Row id: `"new-checkout"`, data: `{ "enabled": true, "rollout": 25, "description": "New checkout flow (A/B test)" }`

## Integration

Your application queries the auto-generated API on startup or periodically:

```typescript
const response = await fetch('https://revisium.example.com/endpoint/feature-flags/dark-mode');
const { data } = await response.json();

if (data.enabled && Math.random() * 100 < data.rollout) {
  enableDarkMode();
}
```

## Branches for Environments

| Branch | Purpose | Endpoint |
|--------|---------|----------|
| `dev` | Development configuration | Preview endpoint (draft) |
| `staging` | Pre-release testing | Staging endpoint (HEAD) |
| `prod` | Production configuration | Production endpoint (HEAD) |

Change workflow: modify on `dev` → review → commit → promote to `staging` → promote to `prod`.
