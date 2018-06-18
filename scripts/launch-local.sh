#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Flag support
quiet="false"

print_usage() {
    printf "Usage: ./launch-local [-q]\n\n"
}

while getopts 'hq' flag; do
  case "${flag}" in
    h) print_usage
       exit 1 ;;
    q) quiet="true" ;;
  esac
done

DEFAULT_LOCAL_ENS_ADDRESS="0x5f6F7E8cc7346a11ca2dEf8f827b7a0b612c56a1"
DEFAULT_LOCAL_IPFS_GATEWAY="http://localhost:8080/ipfs"
DEFAULT_LOCAL_IPFS_RPC="http://localhost:5001"

if [ "$quiet" = false ]; then
    printf "Running aragon/aragon on local environment settings...\n\n"
fi

# Set up defaults for development environment
export REACT_APP_ETH_NETWORK_TYPE='local'

# Default REACT_APP_ENS_REGISTRY_ADDRESS if not set
if [ -z "$REACT_APP_ENS_REGISTRY_ADDRESS" ]; then
    export REACT_APP_ENS_REGISTRY_ADDRESS="$DEFAULT_LOCAL_ENS_ADDRESS"

    if [ "$quiet" = false ]; then
        echo "ENS Registry address not specified, defaulting to aragen's default deployment ($DEFAULT_LOCAL_ENS_ADDRESS)."
        printf "Warning: if you are not using aragen, restart this command with REACT_APP_ENS_REGISTRY_ADDRESS exported to your locally deployed ENS Registry's address.\n\n"
    fi
fi

# Test if ipfs is running locally and use it if so
if pgrep -x "ipfs" > /dev/null; then
    export REACT_APP_IPFS_GATEWAY="$DEFAULT_LOCAL_IPFS_GATEWAY"
    export REACT_APP_IPFS_RPC="$DEFAULT_LOCAL_IPFS_RPC"

    if [ "$quiet" = false ]; then
        echo "Found a local IPFS daemon running..."
        echo "The app will be configured to connect and serve assets from from the default gateway ($DEFAULT_LOCAL_IPFS_GATEWAY) and rpc ($DEFAULT_LOCAL_IPFS_RPC)."
    fi

    # If no asset bridge is defined, default to using IPFS as the bridge
    if [ -z "$REACT_APP_ASSET_BRIDGE" ]; then
        export REACT_APP_ASSET_BRIDGE='ipfs'

        if [ "$quiet" = false ]; then
            printf "Also defaulting the asset bridge to IPFS.\n\n"
        fi
    fi
else
    export REACT_APP_ASSET_BRIDGE='local'
fi

# Give the user some time to read...
# Hopefully we'll get an env var in react-scripts to not have to do this soon: https://github.com/facebook/create-react-app/issues/2495
if [ "$quiet" = false ]; then
    sleep 5
fi

npm start
