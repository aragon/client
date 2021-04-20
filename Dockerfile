FROM node:12.22 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY .babelrc manifest.json now.json ./
COPY images ./images
COPY scripts ./scripts
COPY manifest.json ./
COPY src ./src
COPY arapp.json ./

ARG ARAGON_APP_LOCATOR=ipfs
ARG ARAGON_ENS_REGISTRY_ADDRESS=0x7a052317065eb047d0e5fc587aa3eb6aaa6c317f
ARG ARAGON_IPFS_GATEWAY=https://ipfs.easyswap.finance/ipfs
ARG ARAGON_DEFAULT_ETH_NODE=wss://bsc.easyswap.finance/ws
ARG ARAGON_ETH_NETWORK_TYPE=bsc

RUN yarn build

FROM nginx
COPY --from=build /app/public /usr/share/nginx/html
EXPOSE 80
