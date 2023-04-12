#!/bin/bash

log_info() {
  printf '%s %s\n' "$(date -u +"%Y-%m-%d %H:%M:%S:%3N%z") INFO  MGT: $1"
  return
}

set -m

if [ ! -d ./data/databases ]; then
  log_info "Import database dump"
  ./bin/neo4j-admin database load --from-path=./dumps neo4j --overwrite-destination
  log_info "DONE"
else
  log_info "Databases directory already exists, skipping import"
fi

/startup/docker-entrypoint.sh neo4j
