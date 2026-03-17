---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Screenshot from '@site/src/components/Screenshot';
import { ScreenshotRow } from '@site/src/components/Screenshot';

# Quick Start

Get Revisium running and create your first project. This guide uses the Admin UI — you can also do everything via [REST API, GraphQL, or MCP](./apis/).

## 1. Start Revisium

<Tabs>
<TabItem value="cloud" label="Cloud" default>

Sign up at [cloud.revisium.io](https://cloud.revisium.io/signup) using Google or GitHub. No setup required.

</TabItem>
<TabItem value="standalone" label="Standalone (npx)">

```bash
npx @revisium/standalone@latest
```

Open [http://localhost:9222](http://localhost:9222). No auth by default — embedded PostgreSQL, zero configuration.

To enable authentication:
```bash
npx @revisium/standalone@latest --auth
```
Login: `admin` / `admin`

</TabItem>
<TabItem value="docker" label="Docker Compose">

Create `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:17.4-alpine
    restart: always
    environment:
      POSTGRES_DB: revisium-dev
      POSTGRES_USER: revisium
      POSTGRES_PASSWORD: change-me
  revisium:
    pull_policy: always
    depends_on:
      - db
    image: revisium/revisium:latest
    ports:
      - 8080:8080
    environment:
      DATABASE_URL: postgresql://revisium:change-me@db:5432/revisium-dev?schema=public
```

```bash
docker-compose up -d
```

Open [http://localhost:8080](http://localhost:8080). Login: `admin` / `admin`

</TabItem>
</Tabs>

## 2. Open the Admin UI

- **Cloud:** [cloud.revisium.io](https://cloud.revisium.io/signup) — sign in with Google or GitHub
- **Standalone:** [http://localhost:9222](http://localhost:9222) — no auth by default, with `--auth`: `admin` / `admin`
- **Docker:** [http://localhost:8080](http://localhost:8080) — login: `admin` / `admin`

<Screenshot alt="Revisium Admin UI — empty project list after first launch" src="/img/screenshots/empty-project-list.png" />

## 3. Create a Project

1. Click **New Project**
2. Enter a name (e.g., `blog`)
3. You'll land on the default `master` branch with an empty draft revision

<Screenshot alt="Create Project — entering project name" src="/img/screenshots/create-project.png" />

## 4. Design a Schema

1. Click **New Table** and name it `posts`
2. In the Schema Editor, add fields:
   - `title` — String
   - `content` — String (format: markdown)
   - `published` — Boolean (default: false)
3. Click **Create Table** — a review dialog will show the schema and data preview
4. Confirm to create the table

<Screenshot alt="Schema Editor — creating posts table with title, content, and published fields" src="/img/screenshots/schema-editor-create-table.png" />

<ScreenshotRow>
  <Screenshot alt="Create Table review — Example data preview" src="/img/screenshots/create-table-example.png" />
  <Screenshot alt="Create Table review — JSON Schema" src="/img/screenshots/create-table-schema.png" />
</ScreenshotRow>

## 5. Add Content

After creating the table, the Table Editor opens automatically (or select the table from the list in **Database**).

<Screenshot alt="Empty posts table — ready to add rows" src="/img/screenshots/table-empty.png" />

1. Click **+** in the header to create a new row
2. Enter a row id (e.g., `posts-1`) — you can rename it later
3. Fill in the fields or leave defaults, then confirm

<Screenshot alt="Creating a new row — filling in title, content, and published fields" src="/img/screenshots/row-editor-create.png" />

The row appears in the table. You can edit values directly in cells by clicking on them.

<Screenshot alt="Table with a row — content cell selected for inline editing" src="/img/screenshots/table-with-row.png" />

To open the full Row Editor page, hover over the row id and click **Open** from the menu (or use the arrow icon).

<ScreenshotRow>
  <Screenshot alt="Row context menu — Open, Select, Duplicate, Delete" src="/img/screenshots/table-row-menu.png" />
  <Screenshot alt="Row Editor page — full view of the record" src="/img/screenshots/row-page.png" />
</ScreenshotRow>

## 6. Commit Changes

Committing is optional — you can keep working in draft without committing. But when you need version history, rollback, or want to serve data via a HEAD endpoint, commit your changes.

You can commit directly from the sidebar — click the **checkmark** next to the branch name, add an optional comment, and click **Commit**.

<Screenshot alt="Commit from sidebar — optional comment and Commit button" src="/img/screenshots/commit-sidebar.png" />

To review changes before committing, go to **Changes** in the sidebar. The **Tables** tab shows added/modified tables, the **Row Changes** tab shows individual row diffs.

<ScreenshotRow>
  <Screenshot alt="Changes — Tables tab showing posts Added, system tables Modified" src="/img/screenshots/changes-tables.png" />
  <Screenshot alt="Changes — Row Changes tab with search and filter" src="/img/screenshots/changes-rows.png" />
</ScreenshotRow>

Click any row change to see the field-level diff. Then click **Commit** in the top right and enter an optional comment.

<ScreenshotRow>
  <Screenshot alt="Row change detail — field-level diff showing added data" src="/img/screenshots/changes-row-detail.png" />
  <Screenshot alt="Commit dialog — entering comment and confirming" src="/img/screenshots/commit-dialog.png" />
</ScreenshotRow>

After committing, the draft resets and a new immutable revision becomes HEAD. Endpoint data availability depends on whether the endpoint is bound to HEAD or Draft (see next step).

## 7. Create an API Endpoint

1. Expand the **Management** section in the sidebar and click **Endpoints**
2. Select the **REST API** tab (or GraphQL)
3. Toggle on **Draft** and/or **Head** endpoints

<Screenshot alt="Endpoints page — REST API tab with Draft and Head toggles off" src="/img/screenshots/endpoints-off.png" />

Once enabled, hover over an endpoint to copy its URL or open the Swagger UI.

- **Head** — serves the latest committed revision (read-only, for production)
- **Draft** — serves the current working state (includes uncommitted changes, for preview)

<Screenshot alt="Endpoints enabled — Draft and Head toggles on, with copy URL and Swagger buttons" src="/img/screenshots/endpoints-on.png" />

Click the **code icon** (`</>`) to open the Swagger UI. Notice how Head shows only committed tables, while Draft includes uncommitted changes (e.g., a new `user` table added after the last commit):

<ScreenshotRow>
  <Screenshot alt="Swagger HEAD — posts table only (committed data)" src="/img/screenshots/swagger-head.png" />
  <Screenshot alt="Swagger Draft — posts + user tables (includes uncommitted changes)" src="/img/screenshots/swagger-draft.png" />
</ScreenshotRow>

## 8. Query Your Data

By default, endpoints require authentication. To make read queries work without a token (convenient for testing), go to **Management → Settings** and set visibility to **Public**.

<Screenshot alt="Settings — switching project visibility to Public for unauthenticated read access" src="/img/screenshots/settings-public.png" />

Now query your data with a simple curl (example for Standalone on port 9222):

```bash
curl -X GET \
  'http://localhost:9222/endpoint/rest/admin/blog/master/draft/tables/posts/row/hello-world' \
  -H 'accept: application/json'
```

Or use the Swagger UI — click **Try it out**, execute, and see the response:

<Screenshot alt="Swagger UI — GET request to posts/row/posts-1 with full JSON response" src="/img/screenshots/swagger-response.png" />

## Result

You now have a working Revisium project with:

- A `posts` table with typed schema (title, content, published)
- Data rows accessible via auto-generated REST and GraphQL APIs
- Version history (if you committed) with rollback capability
- HEAD and Draft endpoints serving different states of your data

## Next Steps

- **[Platform Hierarchy](./core-concepts/platform-hierarchy)** — Organizations, projects, branches, and revisions
- **[Data Modeling](./core-concepts/data-modeling)** — Field types, nesting, and constraints
- **[Foreign Keys](./core-concepts/foreign-keys)** — Relationships between tables
- **[Querying Data](./querying-data/)** — Filtering, sorting, pagination
- **[Deployment](./deployment/)** — Production setup with Docker or Kubernetes
