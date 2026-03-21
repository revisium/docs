---
sidebar_position: 3
---

# CI/CD

Apply migrations automatically in your deployment pipeline. Two main patterns: migrations at application startup, or as a separate step before deployment.

## Migration File in Git

Store migration files alongside your code:

```
my-project/
├── revisium/
│   ├── migrations.json    # schema migrations
│   └── data/              # seed data (optional)
│       ├── products/
│       │   ├── iphone-16.json
│       │   └── macbook-m4.json
│       └── categories/
│           └── electronics.json
├── src/
└── package.json
```

Add npm scripts for convenience (Node.js example):

```json
{
  "scripts": {
    "revisium:save-migrations": "revisium migrate save --file ./revisium/migrations.json --url $REVISIUM_URL",
    "revisium:apply-migrations": "revisium migrate apply --file ./revisium/migrations.json --commit --url $REVISIUM_URL"
  }
}
```

## Pattern 1: Migrations at Startup

Apply migrations when the application container starts — before the app itself. Common for backend services.

### Dockerfile

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/revisium/ ./revisium/
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

CMD ["npm", "run", "start:prod"]
```

### Startup Command

```json
{
  "scripts": {
    "start:prod": "npm run revisium:apply-migrations && node dist/main"
  }
}
```

Migrations run before the app starts. If migrations fail, the container fails and Kubernetes restarts it.

### Environment Variables

```bash
REVISIUM_URL=revisium://revisium.example.com/myorg/myproject/master
REVISIUM_USERNAME=service-account
REVISIUM_PASSWORD=secret
```

## Pattern 2: Separate Migration Container

Build a dedicated migration image with the CLI + migration files. Run it as an init container or CI step before deploying the app.

### Migration Dockerfile

```dockerfile
FROM revisium/revisium-cli:latest

COPY revisium/migrations.json /app/migrations.json
COPY revisium/data/ /app/data/
```

### Kubernetes Init Container

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      initContainers:
      - name: revisium-migrate
        image: my-registry/my-app-migrations:latest
        command: ["revisium"]
        args:
          - migrate
          - apply
          - --file=/app/migrations.json
          - --commit
        env:
          - name: REVISIUM_URL
            value: "revisium://revisium.example.com/myorg/myproject/master"
          - name: REVISIUM_USERNAME
            valueFrom:
              secretKeyRef:
                name: revisium-credentials
                key: username
          - name: REVISIUM_PASSWORD
            valueFrom:
              secretKeyRef:
                name: revisium-credentials
                key: password
      containers:
      - name: app
        image: my-registry/my-app:latest
```

### CI: Build Two Images

```yaml
# GitHub Actions — build app + migrations images
jobs:
  build:
    strategy:
      matrix:
        include:
          - name: app
            dockerfile: Dockerfile
            context: "."
          - name: migrations
            dockerfile: revisium/Dockerfile
            context: "."
    steps:
      - uses: actions/checkout@v4
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: ${{ matrix.context }}
          file: ${{ matrix.dockerfile }}
          push: true
          tags: my-registry/my-app-${{ matrix.name }}:latest
```

## Data Seeding

Upload seed data alongside migrations — useful for initial setup or test environments.

### Kubernetes Seeding Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: revisium-seed
spec:
  template:
    spec:
      containers:
      - name: revisium-cli
        image: my-registry/my-app-migrations:latest
        command: ["/bin/sh", "-c"]
        args:
          - |
            revisium migrate apply --file /app/migrations.json --commit && \
            revisium rows upload --folder /app/data --commit
        env:
          - name: REVISIUM_URL
            value: "revisium://revisium.example.com/myorg/myproject/master"
          - name: REVISIUM_USERNAME
            valueFrom:
              secretKeyRef:
                name: revisium-credentials
                key: username
          - name: REVISIUM_PASSWORD
            valueFrom:
              secretKeyRef:
                name: revisium-credentials
                key: password
      restartPolicy: OnFailure
```

## GitHub Actions

### Token Authentication (recommended)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Apply Migrations
        run: npx revisium migrate apply --file ./revisium/migrations.json --commit
        env:
          REVISIUM_URL: revisium://cloud.revisium.io/${{ vars.ORG }}/${{ vars.PROJECT }}/master
          REVISIUM_TOKEN: ${{ secrets.REVISIUM_TOKEN }}
```

### Username/Password Authentication

```yaml
      - name: Apply Migrations
        run: npx revisium migrate apply --file ./revisium/migrations.json --commit
        env:
          REVISIUM_URL: revisium://cloud.revisium.io/${{ vars.ORG }}/${{ vars.PROJECT }}/master
          REVISIUM_USERNAME: ${{ secrets.REVISIUM_USERNAME }}
          REVISIUM_PASSWORD: ${{ secrets.REVISIUM_PASSWORD }}
```

### Docker Image Approach

```yaml
      - name: Apply Migrations
        run: |
          docker run --rm \
            -e REVISIUM_URL=revisium://cloud.revisium.io/${{ vars.ORG }}/${{ vars.PROJECT }}/master \
            -e REVISIUM_TOKEN=${{ secrets.REVISIUM_TOKEN }} \
            -v ${{ github.workspace }}/revisium/migrations.json:/app/migrations.json \
            revisium/revisium-cli \
            revisium migrate apply --file /app/migrations.json --commit
```

### Full Pipeline with Migrations and Seed Data

```yaml
name: Full Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Apply Schema Migrations
        run: npx revisium migrate apply --file ./revisium/migrations.json --commit
        env:
          REVISIUM_URL: revisium://cloud.revisium.io/${{ vars.ORG }}/${{ vars.PROJECT }}/master
          REVISIUM_TOKEN: ${{ secrets.REVISIUM_TOKEN }}
      - name: Upload Seed Data
        if: github.ref == 'refs/heads/main'
        run: npx revisium rows upload --folder ./revisium/data --commit
        env:
          REVISIUM_URL: revisium://cloud.revisium.io/${{ vars.ORG }}/${{ vars.PROJECT }}/master
          REVISIUM_TOKEN: ${{ secrets.REVISIUM_TOKEN }}
      - name: Deploy Application
        run: # your deployment step
```

## GitLab CI

```yaml
stages:
  - migrate
  - deploy

migrate:
  stage: migrate
  image: revisium/revisium-cli:latest
  script:
    - revisium migrate apply --file ./revisium/migrations.json --commit
  variables:
    REVISIUM_URL: revisium://revisium.example.com/$REVISIUM_ORG/$REVISIUM_PROJECT/master
    REVISIUM_TOKEN: $REVISIUM_TOKEN
  only:
    - main

deploy:
  stage: deploy
  script: # your deployment step
  only:
    - main
```

## Docker Run (Manual)

```bash
# Apply migrations
docker run --rm \
  -e REVISIUM_URL=revisium://cloud.revisium.io/myorg/myproject/master \
  -e REVISIUM_TOKEN=$TOKEN \
  -v ./revisium/migrations.json:/app/migrations.json \
  revisium/revisium-cli \
  revisium migrate apply --file /app/migrations.json --commit

# Upload seed data
docker run --rm \
  -e REVISIUM_URL=revisium://cloud.revisium.io/myorg/myproject/master \
  -e REVISIUM_TOKEN=$TOKEN \
  -v ./revisium/data:/app/data \
  revisium/revisium-cli \
  revisium rows upload --folder /app/data --commit
```

## Best Practices

```
Dev (source of truth)
  │
  │  migrate save / sync schema
  ↓
Staging (test)
  │
  │  migrate apply / sync schema
  ↓
Production
```

1. **Migrations before app** — apply migrations before the application starts or deploys
2. **One direction** — schema changes originate from dev, flow to staging, then production. Never backwards
3. **Token auth for CI** — use `REVISIUM_TOKEN` instead of username/password in pipelines
4. **Idempotent** — safe to retry on failure, already-applied migrations are skipped
5. **Commit after apply** — use `--commit` to create a revision after migrations
6. **Test on staging** — always apply to staging before production
7. **Version control** — commit migration files to Git, review schema changes in PRs
