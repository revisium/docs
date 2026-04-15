#!/bin/sh
set -eu

: "${TYPESENSE_SEARCH_ENABLED:=false}"
: "${TYPESENSE_SEARCH_API_KEY:=}"
: "${TYPESENSE_COLLECTION_NAME:=revisium_docs}"
: "${TYPESENSE_SEARCH_PATH:=/search}"

json_escape() {
  printf '%s' "$1" | sed \
    -e 's/\\/\\\\/g' \
    -e 's/"/\\"/g' \
    -e ':a' \
    -e 'N' \
    -e '$!ba' \
    -e 's/\n/\\n/g' \
    -e 's/\r/\\r/g' \
    -e 's/\t/\\t/g'
}

cat > /usr/share/nginx/html/search-config.json <<EOF
{
  "enabled": ${TYPESENSE_SEARCH_ENABLED},
  "apiKey": "$(json_escape "${TYPESENSE_SEARCH_API_KEY}")",
  "collectionName": "$(json_escape "${TYPESENSE_COLLECTION_NAME}")",
  "path": "$(json_escape "${TYPESENSE_SEARCH_PATH}")"
}
EOF
