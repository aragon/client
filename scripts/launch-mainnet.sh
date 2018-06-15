#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

echo "Running aragon/aragon on mainnet environment settings..."

export REACT_APP_ETH_NETWORK_TYPE=mainnet
export REACT_APP_DEFAULT_ETH_NODE=wss://mainnet.aragon.network/ws

npm start
