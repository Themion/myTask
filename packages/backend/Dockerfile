FROM node:18.14

WORKDIR /usr/src/app

COPY ./ .

RUN rm -rf packages/frontend

RUN yarn install
RUN yarn common build

EXPOSE 3000

CMD ["yarn", "backend", "start"]
