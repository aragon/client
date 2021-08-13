#!/bin/bash


ARAGON_IPFS_GATEWAY=https://testnet.lido.fi/ipfs \
ARAGON_DEFAULT_ETH_NODE=wss://goerli-light.eth.linkpool.io/ws \
ARAGON_WALLETCONNECT_RPC_URL=https://goerli-light.eth.linkpool.io \
ARAGON_APP_LOCATOR=ipfs \
ARAGON_ETH_NETWORK_TYPE=goerli \
ARAGON_ENS_REGISTRY_ADDRESS=0x043e6dbc5cad60874727d21ecc2aaebf50a0de80 \
TAG=testnet ./build.sh

