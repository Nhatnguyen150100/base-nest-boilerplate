#!/bin/bash

read -p "⚠️ Are you sure you want to DROP the database? (y/N): " confirm
if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
  npx ts-node -r tsconfig-paths/register ./node_modules/typeorm-extension/bin/cli.cjs db:drop -d src/config/typeorm.config.ts
else
  echo "❌ Cancel drop database."
fi
