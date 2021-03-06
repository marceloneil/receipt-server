FROM node:boron-alpine
LABEL maintainer "Marcel O'Neil <marcel@marceloneil.com>"

WORKDIR /srv/receipt-server
ADD . .
RUN apk add --no-cache \
      g++ \
      git \
      make \
      python

RUN addgroup -S build && \
    adduser -S build -G build&& \
    chown -R build:build .
USER build
RUN npm install --production

USER root
CMD node index.js
