#!/bin/bash
source "../../.env"

docker run \
  --name cache \
  -p $REDIS_PORT:6379 \
  --expose $REDIS_PORT \
  --rm \
  -d \
  cache

