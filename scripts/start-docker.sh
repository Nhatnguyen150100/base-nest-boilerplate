#!/bin/bash
set -a
source .env
set +a

echo "🚀 Starting Docker for DB_TYPE=$DB_TYPE"
echo "🚀 Starting Docker for DB_USERNAME=$DB_USERNAME"
echo "🚀 Starting Docker for DB_PASSWORD=$DB_PASSWORD"
docker-compose up --build -d
