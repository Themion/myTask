FROM node:18.14

WORKDIR /usr/src/app

COPY ./ .

RUN rm -rf packages/frontend

RUN yarn install
RUN yarn common build

CMD ["yarn", "backend", "start"]
