#!/bin/sh
# Runs during official nginx /docker-entrypoint.sh — helps verify Portainer passed HOST.
if [ -n "${HOST:-}" ]; then
  echo "catan-randomization: HOST env = ${HOST} (must match browser hostname exactly, no https://)"
else
  echo "catan-randomization: WARNING — HOST env is empty. Set HOST in Portainer stack environment."
fi
