#!/bin/bash
basedir=$(dirname $0)
envdir="${basedir}/../../.env"

source $envdir

docker run -p $DB_PORT:5432 database