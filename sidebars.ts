import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    "intro",
    {
      type: "category",
      label: "Getting Started",
      link: {
        type: "doc",
        id: "getting-started/index",
      },
      items: ["getting-started/installation", "getting-started/first-steps"],
    },
    {
      type: "category",
      label: "Endpoints",
      link: {
        type: "doc",
        id: "endpoints/index",
      },
      items: [
        {
          type: "category",
          label: "GraphQL API",
          link: {
            type: "doc",
            id: "endpoints/graphql/index",
          },
          items: [
            "endpoints/graphql/quickstart",
            // "endpoints/graphql/revisions",
            {
              type: "category",
              label: "Queries",
              link: {
                type: "doc",
                id: "endpoints/graphql/queries/index",
              },
              items: [
                "endpoints/graphql/queries/basic",
                "endpoints/graphql/queries/filtering",
                "endpoints/graphql/queries/sorting",
                "endpoints/graphql/queries/pagination",
                "endpoints/graphql/queries/relationships",
              ],
            },
            {
              type: "category",
              label: "Types",
              link: {
                type: "doc",
                id: "endpoints/graphql/types/index",
              },
              items: [
                "endpoints/graphql/types/generated",
                "endpoints/graphql/types/system",
              ],
            },
            "endpoints/graphql/configuration",
          ],
        },
        {
          type: "category",
          label: "REST API",
          link: {
            type: "doc",
            id: "endpoints/rest/index",
          },
          items: [
            // REST API documentation will be added here when implemented
          ],
        },
        // {
        //   type: "category",
        //   label: "Advanced Topics",
        //   items: ["endpoints/advanced/performance"],
        // },
      ],
    },
    // {
    //   type: "category",
    //   label: "Architecture",
    //   link: {
    //     type: "doc",
    //     id: "architecture/index",
    //   },
    //   items: [
    //     // Architecture sub-sections will be added here
    //   ],
    // },
  ],
};

export default sidebars;
