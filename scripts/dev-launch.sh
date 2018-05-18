#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

echo "Running aragon/aragon on local environment settings..."

# Error out if REACT_APP_ENS_REGISTRY_ADDRESS isn't set
: ${REACT_APP_ENS_REGISTRY_ADDRESS:?"You need to export an REACT_APP_ENS_REGISTRY_ADDRESS set to your locally deployed ENS Registry's address before running aragon/aragon locally."}

# Set up defaults for development environment
export REACT_APP_DEFAULT_ETH_NODE='ws://localhost:8545'
export REACT_APP_ETH_NETWORK_TYPE='local'

# Test if ipfs is running locally before using local settings
if pgrep -x "ipfs" > /dev/null
then
    echo "Found a local IPFS daemon running, so the app will be configured to connect to default gateway and rpc ports."
    export REACT_APP_IPFS_GATEWAY='http://localhost:8080'
    export REACT_APP_IPFS_RPC='http://localhost:5001'
fi

npm start
