#!/bin/bash
source "../../.env"
docker run --env-file ../../.env --name database --rm -p $DB_PORT:5432 -d database
