#!/bin/bash
source "../../.env"
docker run \
  --env-file ../../.env \
  --name database \
  -p $DB_PORT:5432 \
  --expose $DB_PORT \
  --rm \
  -d \
  database
