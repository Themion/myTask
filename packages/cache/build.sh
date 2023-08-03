#!/bin/bash
source "../../.env"

touch users.acl
echo "user $REDIS_USER on >$REDIS_PASS allkeys allcommands" >> users.acl

touch redis.conf
echo "bind 0.0.0.0" >> redis.conf
echo "port $REDIS_PORT" >> redis.conf
echo "maxmemory 1gb" >> redis.conf
echo "aclfile /etc/redis/users.acl" >> redis.conf

docker build . -t cache

rm users.acl
rm redis.conf