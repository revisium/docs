import React, { useEffect, useId, useState } from "react";
import "typesense-docsearch-css";
import { loadSearchConfig, type SearchConfig } from "@site/src/components/search/config";

type SearchStatus = "loading" | "ready" | "disabled" | "error";

type SearchNavbarItemProps = {
  mobile?: boolean;
};

function toServerNode(config: SearchConfig): {
  host: string;
  port: number;
  protocol: "http" | "https";
  path: string;
} {
  const protocol =
    config.protocol ||
    (window.location.protocol.replace(":", "") as "http" | "https");

  return {
    host: config.host || window.location.hostname,
    port:
      config.port ||
      (window.location.port.length > 0
        ? Number(window.location.port)
        : protocol === "https"
          ? 443
          : 80),
    protocol,
    path: config.path,
  };
}

export default function SearchNavbarItem({
  mobile = false,
}: SearchNavbarItemProps): React.JSX.Element | null {
  const id = useId().replace(/:/g, "");
  const [status, setStatus] = useState<SearchStatus>("loading");

  useEffect(() => {
    let disposed = false;

    async function initSearch(): Promise<void> {
      try {
        const config = await loadSearchConfig();

        if (!config.enabled || !config.apiKey || !config.collectionName) {
          if (!disposed) {
            setStatus("disabled");
          }
          return;
        }

        const module = await import("typesense-docsearch.js/dist/umd");
        const docsearch = module.default;

        docsearch({
          container: `#${id}`,
          typesenseCollectionName: config.collectionName,
          typesenseServerConfig: {
            nodes: [toServerNode(config)],
            apiKey: config.apiKey,
          },
          typesenseSearchParameters: {
            query_by:
              "hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,hierarchy.lvl6,content",
            query_by_weights: "8,7,6,5,4,3,2,1",
            drop_tokens_threshold: 3,
            typo_tokens_threshold: 1,
            per_page: 8,
            prioritize_exact_match: true,
          },
        });

        if (!disposed) {
          setStatus("ready");
        }
      } catch {
        if (!disposed) {
          setStatus("error");
        }
      }
    }

    void initSearch();

    return () => {
      disposed = true;
    };
  }, [id]);

  if (status === "disabled" || status === "error") {
    return null;
  }

  return (
    <div
      className={[
        "navbar__item",
        "navbar-search",
        mobile ? "navbar-search--mobile" : "navbar-search--desktop",
      ].join(" ")}
    >
      <div id={id} className="navbar-search__mount" />
      {status === "loading" ? (
        <button
          type="button"
          className="DocSearch DocSearch-Button navbar-search__fallback"
          aria-label="Search documentation"
          disabled
        >
          <span className="DocSearch-Button-Container">
            <span className="DocSearch-Search-Icon" />
            <span className="DocSearch-Button-Placeholder">Search</span>
          </span>
        </button>
      ) : null}
    </div>
  );
}
