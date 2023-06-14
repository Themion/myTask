#!/bin/bash
source ".env"
docker run --env-file ./.env -p $DB_PORT:5432 -d database