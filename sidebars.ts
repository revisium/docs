import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    "intro",
    "quick-start",
    {
      type: "html",
      value: "<div style='height: 0.75rem'></div>",
      defaultStyle: false,
    },
    {
      type: "category",
      label: "Core Concepts",
      link: {
        type: "doc",
        id: "core-concepts/index",
      },
      items: [
        "core-concepts/data-modeling",
        "core-concepts/foreign-keys",
        "core-concepts/computed-fields",
        "core-concepts/files",
        "core-concepts/versioning",
        "core-concepts/schema-evolution",
        "core-concepts/platform-hierarchy",
      ],
    },
    {
      type: "category",
      label: "Admin UI",
      link: {
        type: "doc",
        id: "admin-ui/index",
      },
      items: [
        "admin-ui/schema-editor",
        "admin-ui/table-editor",
        "admin-ui/row-editor",
        "admin-ui/changes-diff",
        "admin-ui/assets",
        "admin-ui/branches-history",
        "admin-ui/migrations",
        "admin-ui/endpoints-mcp",
      ],
    },
    {
      type: "category",
      label: "CRUD & Querying",
      link: {
        type: "doc",
        id: "querying-data/index",
      },
      items: [
        "querying-data/crud",
        "querying-data/filtering",
        "querying-data/sorting",
        "querying-data/pagination",
        "querying-data/relationships",
      ],
    },
    {
      type: "category",
      label: "APIs",
      link: {
        type: "doc",
        id: "apis/index",
      },
      items: [
        "apis/system-api",
        "apis/generated-apis",
        "apis/mcp",
        "apis/cli",
        "apis/configuration",
      ],
    },
    {
      type: "category",
      label: "Auth & Permissions",
      link: {
        type: "doc",
        id: "auth-permissions/index",
      },
      items: [
        "auth-permissions/authentication",
        "auth-permissions/permissions",
      ],
    },
    {
      type: "category",
      label: "Migrations",
      link: {
        type: "doc",
        id: "migrations/index",
      },
      items: [
        "migrations/ci-cd",
      ],
    },
    "deployment/index",
    {
      type: "category",
      label: "Use Cases",
      link: {
        type: "doc",
        id: "use-cases/index",
      },
      items: [
        "use-cases/dictionary-service",
        "use-cases/headless-cms",
        "use-cases/configuration-store",
        "use-cases/ai-agent-memory",
      ],
    },
    {
      type: "category",
      label: "Architecture",
      link: {
        type: "doc",
        id: "architecture/index",
      },
      items: [
        "architecture/specs/migration-format",
      ],
    },
  ],
};

export default sidebars;
