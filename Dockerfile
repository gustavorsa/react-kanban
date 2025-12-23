FROM node:20-alpine

WORKDIR /app

RUN chown -R node:node /app
USER node

EXPOSE 3000
