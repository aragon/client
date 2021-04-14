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

ARG ARAGON_APP_LOCATOR
ARG ARAGON_ENS_REGISTRY_ADDRESS
ARG ARAGON_IPFS_GATEWAY
ARG ARAGON_DEFAULT_ETH_NODE
ARG ARAGON_ETH_NETWORK_TYPE

RUN yarn build

FROM nginx
COPY --from=build /app/public /usr/share/nginx/html
EXPOSE 80
