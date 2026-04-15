export type SearchConfig = {
  enabled: boolean;
  apiKey: string;
  collectionName: string;
  path: string;
  host?: string;
  port?: number;
  protocol?: "http" | "https";
};

const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);
const SEARCH_ONLY_API_KEY =
  "3fb8239aac050d830941b71b38063fe9a7af3dec16ac4a7a3369e554dd5ab7d9";

function getLocationProtocol(): "http" | "https" {
  return globalThis.location.protocol === "https:" ? "https" : "http";
}

function getLocationPort(protocol: "http" | "https"): number {
  if (globalThis.location.port.length > 0) {
    return Number(globalThis.location.port);
  }

  return protocol === "https" ? 443 : 80;
}

function buildSameOriginFallbackConfig(): SearchConfig {
  const protocol = getLocationProtocol();

  return {
    enabled: true,
    apiKey: SEARCH_ONLY_API_KEY,
    collectionName: "revisium_docs",
    path: "/search",
    host: globalThis.location.hostname,
    port: getLocationPort(protocol),
    protocol,
  };
}

function buildLocalhostFallbackConfig(): SearchConfig {
  return {
    enabled: true,
    apiKey: SEARCH_ONLY_API_KEY,
    collectionName: "revisium_docs",
    path: "/search",
    host: "docs.revisium.io",
    port: 443,
    protocol: "https",
  };
}

function isSearchConfig(value: unknown): value is SearchConfig {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<SearchConfig>;

  return (
    typeof candidate.enabled === "boolean" &&
    typeof candidate.apiKey === "string" &&
    typeof candidate.collectionName === "string" &&
    typeof candidate.path === "string" &&
    (candidate.host === undefined || typeof candidate.host === "string") &&
    (candidate.port === undefined || typeof candidate.port === "number") &&
    (candidate.protocol === undefined ||
      candidate.protocol === "http" ||
      candidate.protocol === "https")
  );
}

async function parseSearchConfig(response: Response): Promise<SearchConfig> {
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    throw new Error(`Failed to load search config: ${response.status}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error("Search config did not return JSON.");
  }

  const payload: unknown = await response.json();

  if (!isSearchConfig(payload)) {
    throw new Error("Search config payload is invalid.");
  }

  return payload;
}

export async function loadSearchConfig(): Promise<SearchConfig> {
  try {
    return await parseSearchConfig(
      await fetch("/search-config.json", { cache: "no-store" }),
    );
  } catch (error) {
    if (LOCALHOST_HOSTNAMES.has(globalThis.location.hostname)) {
      return buildLocalhostFallbackConfig();
    }

    return buildSameOriginFallbackConfig();
  }
}
