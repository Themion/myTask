FROM node:18.14

WORKDIR /usr/src/app

COPY ./ .
RUN rm -rf packages/backend

RUN yarn install

EXPOSE 5173

# vite은 build 시 정적 파일을 생성하므로
# 실제 배포 시 다른 방법을 고려해야 함
CMD ["yarn", "frontend", "start:dev"]
