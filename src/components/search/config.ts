export type SearchConfig = {
  enabled: boolean;
  apiKey: string;
  collectionName: string;
  path: string;
  host?: string;
  port?: number;
  protocol?: "http" | "https";
};

const LOCALHOST_FALLBACK_CONFIG: SearchConfig = {
  enabled: true,
  apiKey: "3fb8239aac050d830941b71b38063fe9a7af3dec16ac4a7a3369e554dd5ab7d9",
  collectionName: "revisium_docs",
  path: "/search",
  host: "docs.revisium.io",
  port: 443,
  protocol: "https",
};

async function parseSearchConfig(response: Response): Promise<SearchConfig> {
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    throw new Error(`Failed to load search config: ${response.status}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error("Search config did not return JSON.");
  }

  return response.json() as Promise<SearchConfig>;
}

export async function loadSearchConfig(): Promise<SearchConfig> {
  try {
    return await parseSearchConfig(
      await fetch("/search-config.json", { cache: "no-store" }),
    );
  } catch (error) {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return LOCALHOST_FALLBACK_CONFIG;
    }

    throw error;
  }
}
