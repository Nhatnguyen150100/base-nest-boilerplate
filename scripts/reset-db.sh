#!/bin/bash

read -p "⚠️ Are you sure you want to RESET the database? This action will delete all data. (y/N): " confirm
if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
  pnpm db:drop && \
  pnpm db:create && \
  pnpm migration:run && \
  pnpm seed:run
else
  echo "❌ Cancel reset database."
fi
