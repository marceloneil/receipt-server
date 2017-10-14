FROM node:boron-alpine
LABEL maintainer "Marcel O'Neil <marcel@marceloneil.com>"

WORKDIR /srv/receipt-server
ADD . .

RUN apk add --no-cache \
      g++ \
      git \
      make \
      python
RUN npm install --production

CMD node index.js
