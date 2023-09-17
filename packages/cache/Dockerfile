FROM redis:7.0.12

WORKDIR /etc/redis

COPY . .

ARG REDIS_USER
ARG REDIS_PASS
ARG REDIS_PORT

RUN touch users.acl
RUN echo "user $REDIS_USER on >$REDIS_PASS allkeys allcommands" >> users.acl

RUN touch redis.conf
RUN echo "bind 0.0.0.0" >> redis.conf
RUN echo "port $REDIS_PORT" >> redis.conf
RUN echo "maxmemory 1gb" >> redis.conf
RUN echo "aclfile /etc/redis/users.acl" >> redis.conf

CMD [ "redis-server", "/etc/redis/redis.conf" ]
