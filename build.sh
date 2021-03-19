#!/bin/bash
source ./.env
set -e +u
set -o pipefail

: ${TAG:=rinkeby}
IMG="lidofinance/aragon-client"
export DOCKER_CONFIG=$HOME/.lidofinance

# : ${ARAGON_APP_LOCATOR:=ipfs}
# : ${ARAGON_ETH_NETWORK_TYPE:=main}
# : ${ARAGON_ENS_REGISTRY_ADDRESS:=0x314159265dd8dbb310642f98f50c066173c1259b}
# : ${ARAGON_IPFS_GATEWAY:=https://ipfs.eth.aragon.network/ipfs}
# : ${ARAGON_DEFAULT_ETH_NODE:=wss://mainnet.eth.aragon.network/ws}
# : ${ARAGON_WALLETCONNECT_RPC_URL:=https://mainnet.eth.aragon.network}
# : ${ARAGON_PORTIS_DAPP_ID:=}
# : ${ARAGON_FORTMATIC_API_KEY:=}
# : ${ARAGON_SENTRY_DSN:=}

echo "Building $IMG:$TAG Docker image..."
docker build \
    --build-arg ARAGON_APP_LOCATOR=$ARAGON_APP_LOCATOR \
    --build-arg ARAGON_ETH_NETWORK_TYPE=$ARAGON_ETH_NETWORK_TYPE \
    --build-arg ARAGON_ENS_REGISTRY_ADDRESS=$ARAGON_ENS_REGISTRY_ADDRESS \
    --build-arg ARAGON_DEFAULT_ETH_NODE=$ARAGON_DEFAULT_ETH_NODE \
    --build-arg ARAGON_IPFS_GATEWAY=$ARAGON_IPFS_GATEWAY \
    --build-arg ARAGON_WALLETCONNECT_RPC_URL=$ARAGON_WALLETCONNECT_RPC_URL \
    --build-arg ARAGON_PORTIS_DAPP_ID=$ARAGON_PORTIS_DAPP_ID \
    --build-arg ARAGON_FORTMATIC_API_KEY=$ARAGON_FORTMATIC_API_KEY \
    --build-arg ARAGON_SENTRY_DSN=$ARAGON_SENTRY_DSN \
    -t $IMG:$TAG .

echo "Pushing $IMG:$TAG to the Docker Hub"
docker push $IMG:$TAG
