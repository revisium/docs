---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Screenshot from '@site/src/components/Screenshot';
import { ScreenshotRow } from '@site/src/components/Screenshot';

# Quick Start

Create a `blog` project, model a typed `posts` table, edit data in the Admin UI, and query it through generated REST and GraphQL APIs.

In this guide, you will:

- start Revisium in Cloud Early Access, Standalone, or Docker
- model structured data as a table schema
- add rows in the Admin UI draft workspace
- enable generated Draft REST and GraphQL endpoints
- query a row and a list of rows with curl or Swagger UI
- optionally review and commit the project state to HEAD

## 1. Start Revisium

Choose one environment for the walkthrough. Cloud requires no local setup; Standalone is the fastest local option.

:::note Cloud Early Access
Revisium Cloud is currently in Early Access. Use it as a hosted sandbox for evaluation, demos, and early projects. For production workloads that require full operational control, use self-hosted Docker or Kubernetes.
:::

<Tabs>
<TabItem value="cloud" label="Cloud Early Access" default>

Open [cloud.revisium.io](https://cloud.revisium.io) and sign in with Google or GitHub. No local setup required.

This is the hosted Early Access sandbox. It is the easiest way to try the workflow, but it should not be treated as a production SLA commitment yet.

</TabItem>
<TabItem value="standalone" label="Standalone (npx)">

```bash
npx @revisium/standalone@latest
```

Open [http://localhost:9222](http://localhost:9222). No auth by default - embedded PostgreSQL, zero configuration.

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

- **Cloud Early Access:** [cloud.revisium.io](https://cloud.revisium.io) - hosted sandbox; sign in with Google or GitHub
- **Standalone:** [http://localhost:9222](http://localhost:9222) - no auth by default, with `--auth`: `admin` / `admin`
- **Docker:** [http://localhost:8080](http://localhost:8080) - login: `admin` / `admin`

<Screenshot alt="Revisium Admin UI - empty project list after first launch" src="/img/screenshots/empty-project-list.png" />

## 3. Create a Project

1. Click **New Project**
2. Enter a name (e.g., `blog`)
3. You'll land on the default `master` branch with an empty draft revision

<Screenshot alt="Create Project - entering project name" src="/img/screenshots/create-project.png" />

## 4. Design a Schema

In Revisium, the schema is the contract behind both the table editor and the generated API. Field names, types, defaults, and formats define what editors see in the Admin UI and what clients can query later.

1. Click **New Table** and name it `posts`
2. In the Schema Editor, add fields:
   - `title` - String
   - `content` - String (format: Markdown)
   - `published` - Boolean (default: false)
3. Click **Create Table** - a review dialog will show the schema and data preview
4. Confirm to create the table

<Screenshot alt="Schema Editor - creating posts table with title, content, and published fields" src="/img/screenshots/schema-editor-create-table.png" />

<ScreenshotRow>
  <Screenshot alt="Create Table review - Example data preview" src="/img/screenshots/create-table-example.png" />
  <Screenshot alt="Create Table review - JSON Schema" src="/img/screenshots/create-table-schema.png" />
</ScreenshotRow>

## 5. Add Content

After creating the table, the Table Editor opens automatically (or select the table from the list in **Database**).

<Screenshot alt="Empty posts table - ready to add rows" src="/img/screenshots/table-empty.png" />

1. Click **+** in the header to create a new row
2. Enter a row id (e.g., `posts-1`) - you can rename it later
3. Fill in the fields, then confirm:
   - `title`: `Example post`
   - `content`: `Hello from Revisium`
   - `published`: `false`

<Screenshot alt="Creating a new row - filling in title, content, and published fields" src="/img/screenshots/row-editor-create.png" />

The row appears in the table. The same schema that defined the API contract now drives editable columns in the Admin UI. You can edit values directly in cells by clicking on them.

<Screenshot alt="Table with a row - content cell selected for inline editing" src="/img/screenshots/table-with-row.png" />

To open the full Row Editor page, hover over the row id and click **Open** from the menu (or use the arrow icon).

<ScreenshotRow>
  <Screenshot alt="Row context menu - Open, Select, Duplicate, Delete" src="/img/screenshots/table-row-menu.png" />
  <Screenshot alt="Row Editor page - full view of the record" src="/img/screenshots/row-page.png" />
</ScreenshotRow>

## 6. Create API Endpoints

1. Expand the **Management** section in the sidebar and click **Endpoints**
2. Select the **REST API** tab and toggle on **Draft**
3. Select the **GraphQL** tab and toggle on **Draft** if you also want to inspect the generated GraphQL schema
4. You can enable **Head** later if you want to compare Draft with the committed revision

<Screenshot alt="Endpoints page - REST API tab with Draft and Head toggles off" src="/img/screenshots/endpoints-off.png" />

Endpoints are configured at the project level. The URL still includes the organization, project, branch, and target revision, for example `admin/blog/master/draft`.

Once REST is enabled, hover over an endpoint to copy its URL or open the Swagger UI.

- **Draft** - serves the current working state, including uncommitted changes, for preview
- **Head** - serves the latest committed revision, for stable read access

<Screenshot alt="Endpoints enabled - Draft and Head toggles on, with copy URL and Swagger buttons" src="/img/screenshots/endpoints-on.png" />

Click the **code icon** (`</>`) to open the Swagger UI. If both Draft and Head are enabled, you can compare the current draft with the latest committed state:

<ScreenshotRow>
  <Screenshot alt="Swagger HEAD - posts table only (committed data)" src="/img/screenshots/swagger-head.png" />
  <Screenshot alt="Swagger Draft - endpoint documentation showing uncommitted draft changes" src="/img/screenshots/swagger-draft.png" />
</ScreenshotRow>

## 7. Query Your Data

By default, endpoints require authentication. To make read queries work without a token (convenient for testing), go to **Management -> Settings** and change visibility from **Private** to **Public**.

:::warning
Use public visibility only for local testing, public content, or controlled preview scenarios. For private or production data, keep the project private and use API keys or another supported authentication method.
:::

<Screenshot alt="Project Settings - visibility control before switching the project to Public" src="/img/screenshots/settings-public.png" />

Now query a single row with curl. This example uses the Standalone endpoint on port `9222`; for Cloud or Docker, copy the endpoint URL from the Admin UI.

```bash
curl -X GET \
  'http://localhost:9222/endpoint/rest/admin/blog/master/draft/tables/posts/row/posts-1' \
  -H 'accept: application/json'
```

Expected response shape (ids, timestamps, and metadata will vary):

```json
{
  "id": "posts-1",
  "createdAt": "2026-03-15T10:30:00Z",
  "updatedAt": "2026-03-15T10:30:00Z",
  "readonly": false,
  "data": {
    "title": "Example post",
    "content": "Hello from Revisium",
    "published": false
  }
}
```

To query a list of rows, use the generated REST list operation. OpenAPI describes this as `POST /tables/{tableId}/rows` with filtering, sorting, and pagination in the request body.

```bash
curl -X POST \
  'http://localhost:9222/endpoint/rest/admin/blog/master/draft/tables/posts/rows' \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  -d '{ "first": 10 }'
```

Expected response shape:

```json
{
  "pageInfo": {
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "totalCount": 1,
  "edges": [
    {
      "node": {
        "id": "posts-1",
        "data": {
          "title": "Example post",
          "content": "Hello from Revisium",
          "published": false
        }
      }
    }
  ]
}
```

If you enabled GraphQL Draft as well, query the same row through the generated GraphQL API:

```bash
curl -X POST \
  'http://localhost:9222/endpoint/graphql/admin/blog/master/draft' \
  -H 'content-type: application/json' \
  -d '{ "query": "{ posts(id: \"posts-1\") { id data { title content published } } }" }'
```

Expected GraphQL response shape:

```json
{
  "data": {
    "posts": {
      "id": "posts-1",
      "data": {
        "title": "Example post",
        "content": "Hello from Revisium",
        "published": false
      }
    }
  }
}
```

Or use the Swagger UI - click **Try it out**, execute, and see the response:

<Screenshot alt="Swagger UI - GET request to posts/row/posts-1 with full JSON response" src="/img/screenshots/swagger-response.png" />

## 8. Optional: Review, Commit, and Use HEAD

Draft endpoints update as you edit data. Commit when you want the current project state to become an immutable HEAD revision for stable, read-only access.

You can commit directly from the sidebar - click the **checkmark** next to the branch name, add an optional comment, and click **Commit**.

<Screenshot alt="Commit from sidebar - optional comment and Commit button" src="/img/screenshots/commit-sidebar.png" />

To review changes before committing, go to **Changes** in the sidebar. The **Tables** tab shows added/modified tables, the **Row Changes** tab shows individual row diffs.

<ScreenshotRow>
  <Screenshot alt="Changes - Tables tab showing posts Added, system tables Modified" src="/img/screenshots/changes-tables.png" />
  <Screenshot alt="Changes - Row Changes tab with search and filter" src="/img/screenshots/changes-rows.png" />
</ScreenshotRow>

Click any row change to see the field-level diff. Then click **Commit** in the top right and enter an optional comment.

<ScreenshotRow>
  <Screenshot alt="Row change detail - field-level diff showing added data" src="/img/screenshots/changes-row-detail.png" />
  <Screenshot alt="Commit dialog - entering comment and confirming" src="/img/screenshots/commit-dialog.png" />
</ScreenshotRow>

After committing, the draft resets and a new immutable revision becomes HEAD. HEAD endpoints serve the latest committed revision; Draft endpoints continue to serve the current working state.

## Result

You now have a working Revisium project with:

- a `posts` table with typed schema (`title`, `content`, `published`)
- rows editable through the Admin UI
- data accessible through auto-generated REST and GraphQL APIs
- optional review and commit workflow for publishing a stable HEAD revision
- HEAD and Draft endpoints for different states of your data

## Next Steps

- **[Platform Hierarchy](./core-concepts/platform-hierarchy)** - Organizations, projects, branches, and revisions
- **[Data Modeling](./core-concepts/data-modeling)** - Field types, nesting, and constraints
- **[Foreign Keys](./core-concepts/foreign-keys)** - Relationships between tables
- **[Querying Data](./querying-data/)** - Filtering, sorting, pagination
- **[Deployment](./deployment/)** - Production setup with Docker or Kubernetes
