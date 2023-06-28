FROM node:18.16

WORKDIR /usr/src/app

COPY ./ .

RUN rm -rf packages/frontend

RUN yarn install
RUN yarn common build
RUN yarn backend build

CMD ["yarn", "backend", "start:prod"]
# CMD ["sleep", "60000"]