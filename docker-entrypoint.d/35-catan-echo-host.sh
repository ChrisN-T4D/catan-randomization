#!/bin/sh
# Runs during nginx /docker-entrypoint.sh (after 30-tune-worker-processes).
echo "catan-randomization: HOST env = '${HOST:-}' (empty = set stack env HOST=hostname only, no https://)"
