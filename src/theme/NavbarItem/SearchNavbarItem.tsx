import React, { useEffect, useId, useState } from "react";
import clsx from "clsx";
import "typesense-docsearch-css";
import { loadSearchConfig, type SearchConfig } from "@site/src/components/search/config";

type SearchStatus = "loading" | "ready" | "disabled" | "error";

type SearchNavbarItemProps = {
  mobile?: boolean;
};

type SearchNavbarItemPropsReadonly = Readonly<SearchNavbarItemProps>;
type SearchHit = {
  url?: string;
  url_without_anchor?: string;
  url_without_variables?: string;
  __docsearch_parent?: SearchHit;
};

const DEFAULT_HTTPS_PORT = 443;
const DEFAULT_HTTP_PORT = 80;
const SEARCH_QUERY_BY =
  "hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,hierarchy.lvl6,content";
const SEARCH_QUERY_BY_WEIGHTS = "8,7,6,5,4,3,2,1";
const SEARCH_RESULT_URL_FIELDS = [
  "url",
  "url_without_anchor",
  "url_without_variables",
] as const;

function getWindowProtocol(): "http" | "https" {
  return globalThis.location.protocol === "https:" ? "https" : "http";
}

function getWindowPort(protocol: "http" | "https"): number {
  if (globalThis.location.port.length > 0) {
    return Number(globalThis.location.port);
  }

  if (protocol === "https") {
    return DEFAULT_HTTPS_PORT;
  }

  return DEFAULT_HTTP_PORT;
}

function toServerNode(config: SearchConfig): {
  host: string;
  port: number;
  protocol: "http" | "https";
  path: string;
} {
  const protocol = config.protocol ?? getWindowProtocol();

  return {
    host: config.host ?? globalThis.location.hostname,
    port: config.port ?? getWindowPort(protocol),
    protocol,
    path: config.path,
  };
}

function rewriteToCurrentOrigin(url: string): string {
  const nextUrl = new URL(url);

  nextUrl.protocol = globalThis.location.protocol;
  nextUrl.host = globalThis.location.host;

  return nextUrl.toString();
}

function rewriteSearchHit(item: SearchHit): SearchHit {
  const rewrittenItem = { ...item };

  for (const field of SEARCH_RESULT_URL_FIELDS) {
    if (typeof rewrittenItem[field] === "string") {
      rewrittenItem[field] = rewriteToCurrentOrigin(rewrittenItem[field]);
    }
  }

  if (rewrittenItem.__docsearch_parent) {
    rewrittenItem.__docsearch_parent = rewriteSearchHit(
      rewrittenItem.__docsearch_parent,
    );
  }

  return rewrittenItem;
}

export default function SearchNavbarItem({
  mobile = false,
}: SearchNavbarItemPropsReadonly): React.JSX.Element | null {
  const id = useId().replaceAll(":", "");
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
            query_by: SEARCH_QUERY_BY,
            query_by_weights: SEARCH_QUERY_BY_WEIGHTS,
            drop_tokens_threshold: 3,
            typo_tokens_threshold: 1,
            per_page: 8,
            prioritize_exact_match: true,
          },
          transformItems: (items: SearchHit[]) => items.map(rewriteSearchHit),
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
      className={clsx(
        "navbar__item",
        "navbar-search",
        mobile ? "navbar-search--mobile" : "navbar-search--desktop",
      )}
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
