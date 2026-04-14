# Typesense Docs Search

This docs site uses a same-origin proxy:

- browser -> `https://docs.revisium.io/search/...`
- docs nginx -> Typesense upstream

That keeps the real Typesense service private and lets the frontend work the same way in local Docker and Kubernetes.

## Runtime env vars for docs container

- `TYPESENSE_PROXY_PASS`: upstream Typesense base URL, for example `http://typesense:8108`
- `TYPESENSE_SEARCH_ENABLED`: `true` or `false`
- `TYPESENSE_SEARCH_API_KEY`: search-only API key exposed to the browser
- `TYPESENSE_COLLECTION_NAME`: collection alias used by the scraper, default `revisium_docs`
- `TYPESENSE_SEARCH_PATH`: proxy path exposed by nginx, default `/search`

The container renders `/search-config.json` on startup from these env vars.

## Scraper

The scraper is stateless. Recommended order:

1. Deploy docs
2. Run the scraper against the public docs URL
3. Let it update the `revisium_docs` alias in Typesense

Typesense recommends CI for this flow, but a Kubernetes `CronJob` or ad-hoc `Job` also works.

Run locally with Docker:

```bash
docker run --rm \
  --env TYPESENSE_API_KEY=xyz \
  --env TYPESENSE_HOST=127.0.0.1 \
  --env TYPESENSE_PORT=8108 \
  --env TYPESENSE_PROTOCOL=http \
  --volume "$(pwd)/docs/typesense:/tmp/typesense" \
  --env CONFIG=/tmp/typesense/docsearch.config.json \
  typesense/docsearch-scraper:0.11.0
```
