---
sidebar_position: 3
---

# CI/CD Integration

Apply migrations automatically in your deployment pipeline.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## General Principles

1. Store credentials in secrets management (not in code)
2. Apply migrations **before** deploying the application
3. Test on staging before production
4. Migrations are idempotent — safe to retry on failure

<Tabs>
<TabItem value="github" label="GitHub Actions" default>

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Apply Migrations
        run: |
          npx revisium migrate apply \
            --file ./migrations/migrations.json
        env:
          REVISIUM_API_URL: ${{ secrets.REVISIUM_API_URL }}
          REVISIUM_USERNAME: ${{ secrets.REVISIUM_USERNAME }}
          REVISIUM_PASSWORD: ${{ secrets.REVISIUM_PASSWORD }}
          REVISIUM_ORGANIZATION: ${{ secrets.REVISIUM_ORGANIZATION }}
          REVISIUM_PROJECT: ${{ secrets.REVISIUM_PROJECT }}
          REVISIUM_BRANCH: master

      - name: Create Revision
        run: npx revisium revision create
        env:
          REVISIUM_API_URL: ${{ secrets.REVISIUM_API_URL }}
          REVISIUM_USERNAME: ${{ secrets.REVISIUM_USERNAME }}
          REVISIUM_PASSWORD: ${{ secrets.REVISIUM_PASSWORD }}
          REVISIUM_ORGANIZATION: ${{ secrets.REVISIUM_ORGANIZATION }}
          REVISIUM_PROJECT: ${{ secrets.REVISIUM_PROJECT }}
          REVISIUM_BRANCH: master

      - name: Deploy Application
        run: # your deployment step
```

</TabItem>
<TabItem value="gitlab" label="GitLab CI">

```yaml
stages:
  - migrate
  - deploy

migrate:
  stage: migrate
  image: node:20
  script:
    - npx revisium migrate apply --file ./migrations/migrations.json
    - npx revisium revision create
  variables:
    REVISIUM_API_URL: $REVISIUM_API_URL
    REVISIUM_USERNAME: $REVISIUM_USERNAME
    REVISIUM_PASSWORD: $REVISIUM_PASSWORD
    REVISIUM_ORGANIZATION: $REVISIUM_ORGANIZATION
    REVISIUM_PROJECT: $REVISIUM_PROJECT
    REVISIUM_BRANCH: master
  only:
    - main

deploy:
  stage: deploy
  script: # your deployment step
  only:
    - main
```

</TabItem>
<TabItem value="kubernetes" label="Kubernetes (ArgoCD)">

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: revisium-migrations
  annotations:
    argocd.argoproj.io/hook: PreSync
    argocd.argoproj.io/sync-wave: "-1"
spec:
  template:
    spec:
      containers:
        - name: migrations
          image: node:20
          command:
            - sh
            - -c
            - |
              set -e
              npx revisium migrate apply --file /migrations/migrations.json
              npx revisium revision create
          env:
            - name: REVISIUM_API_URL
              valueFrom:
                secretKeyRef:
                  name: revisium-secrets
                  key: api-url
            - name: REVISIUM_USERNAME
              valueFrom:
                secretKeyRef:
                  name: revisium-secrets
                  key: username
            - name: REVISIUM_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: revisium-secrets
                  key: password
            - name: REVISIUM_ORGANIZATION
              valueFrom:
                secretKeyRef:
                  name: revisium-secrets
                  key: organization
            - name: REVISIUM_PROJECT
              valueFrom:
                secretKeyRef:
                  name: revisium-secrets
                  key: project
          volumeMounts:
            - name: migrations
              mountPath: /migrations
      volumes:
        - name: migrations
          configMap:
            name: revisium-migrations
      restartPolicy: Never
  backoffLimit: 3
```

</TabItem>
<TabItem value="docker" label="Docker">

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY migrations/ ./migrations/
CMD ["sh", "-c", "npx revisium migrate apply --file ./migrations/migrations.json && npx revisium revision create"]
```

```bash
docker build -t revisium-migrate .
docker run --rm \
  -e REVISIUM_API_URL=https://revisium.example.com \
  -e REVISIUM_USERNAME=admin \
  -e REVISIUM_PASSWORD=secret \
  -e REVISIUM_ORGANIZATION=myorg \
  -e REVISIUM_PROJECT=myproject \
  -e REVISIUM_BRANCH=master \
  revisium-migrate
```

</TabItem>
</Tabs>

## Multi-Environment Setup

```
Local Dev → Git → Staging (CI/CD) → Production (CI/CD)
```

Use environment-specific secrets and separate CI/CD stages:

```yaml
# GitHub Actions with environments
jobs:
  staging:
    environment: staging
    steps:
      - name: Apply to Staging
        env:
          REVISIUM_API_URL: ${{ secrets.STAGING_URL }}
        run: npx revisium migrate apply --file ./migrations/migrations.json

  production:
    needs: staging
    environment: production
    steps:
      - name: Apply to Production
        env:
          REVISIUM_API_URL: ${{ secrets.PRODUCTION_URL }}
        run: npx revisium migrate apply --file ./migrations/migrations.json
```

## Best Practices

1. **Migrations before app deployment** — ensures schema is ready when the app starts
2. **Staging first** — always test migrations on staging before production
3. **Never apply manually** — use CI/CD for production
4. **Keep migration history** — don't delete old migrations (they provide audit trail)
5. **Commit schemas and migrations together** — `git add schemas/ migrations/`
6. **Use PreSync hooks** in Kubernetes to ensure migrations run before pods start
