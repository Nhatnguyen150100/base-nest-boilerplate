#!/bin/bash

echo "🚀 Starting Docker for DB_TYPE=$DB_TYPE"

if [ "$DB_TYPE" = "postgres" ]; then
  docker-compose -f docker-compose.yml -f docker-compose.postgres.yml up --build
else
  docker-compose -f docker-compose.yml -f docker-compose.mysql.yml up --build
fi
