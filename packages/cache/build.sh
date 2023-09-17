#!/bin/bash
source "../../.env"

docker build . \
  --build-arg REDIS_USER=$REDIS_USER \
  --build-arg REDIS_PASS=$REDIS_PASS \
  --build-arg REDIS_PORT=$REDIS_PORT \
  -t cache

