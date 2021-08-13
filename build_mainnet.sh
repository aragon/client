#!/bin/bash

ARAGON_ETH_NETWORK_TYPE=main \
ARAGON_IPFS_GATEWAY=https://mainnet.lido.fi/ipfs \
ARAGON_DEFAULT_ETH_NODE=wss://main-light.eth.linkpool.io/ws \
ARAGON_WALLETCONNECT_RPC_URL=https://main-light.eth.linkpool.io/ \
TAG=mainnet-infura ./build.sh
