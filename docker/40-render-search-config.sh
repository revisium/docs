#!/bin/sh
set -eu

: "${TYPESENSE_SEARCH_ENABLED:=false}"
: "${TYPESENSE_SEARCH_API_KEY:=}"
: "${TYPESENSE_COLLECTION_NAME:=revisium_docs}"
: "${TYPESENSE_SEARCH_PATH:=/search}"

export TYPESENSE_SEARCH_ENABLED
export TYPESENSE_SEARCH_API_KEY
export TYPESENSE_COLLECTION_NAME
export TYPESENSE_SEARCH_PATH

envsubst \
  '${TYPESENSE_SEARCH_ENABLED} ${TYPESENSE_SEARCH_API_KEY} ${TYPESENSE_COLLECTION_NAME} ${TYPESENSE_SEARCH_PATH}' \
  < /etc/revisium/search-config.json.template \
  > /usr/share/nginx/html/search-config.json
