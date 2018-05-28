#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

echo "Running aragon/aragon on local environment settings..."

# Error out if REACT_APP_ENS_REGISTRY_ADDRESS isn't set
: ${REACT_APP_ENS_REGISTRY_ADDRESS:?"You need to export an REACT_APP_ENS_REGISTRY_ADDRESS set to your locally deployed ENS Registry's address before running aragon/aragon locally."}

DEFAULT_IPFS_GATEWAY="http://localhost:8080/ipfs"
DEFAULT_IPFS_RPC="http://localhost:5001"

# Set up defaults for development environment
export REACT_APP_DEFAULT_ETH_NODE='ws://localhost:8545'
export REACT_APP_ETH_NETWORK_TYPE='local'

# Test if ipfs is running locally before using local settings
if pgrep -x "ipfs" > /dev/null; then
    echo "Found a local IPFS daemon running..."
    echo "The app will be configured to connect and serve assets from from the default gateway ($DEFAULT_IPFS_GATEWAY) and rpc ($DEFAULT_IPFS_RPC)."
    export REACT_APP_IPFS_GATEWAY="$DEFAULT_IPFS_GATEWAY"
    export REACT_APP_IPFS_RPC="$DEFAULT_IPFS_RPC"
    if [ -z "$REACT_APP_ASSET_BRIDGE" ]; then
        echo "Defaulting asset bridge to IPFS"
        export REACT_APP_ASSET_BRIDGE='ipfs'
    fi
else
    export REACT_APP_ASSET_BRIDGE='local'
fi

npm start
