#!/bin/bash

ARAGON_ETH_NETWORK_TYPE=main \
ARAGON_DEFAULT_ETH_NODE=wss://mainnet.infura.io/ws/v3/e03b2755aaf24488aa013b9aed8c4170 \
ARAGON_WALLETCONNECT_RPC_URL=https://mainnet.infura.io/v3/e03b2755aaf24488aa013b9aed8c4170 \
TAG=mainnet-infura ./build.sh
