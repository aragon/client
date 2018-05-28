# Aragon Core <img align="right" src="https://github.com/aragon/design/blob/master/readme-logo.png" height="80px" />

[![Build Status](https://travis-ci.org/aragon/aragon.svg?branch=master)](https://travis-ci.org/aragon/aragon)

#### 📝 Please report support and feedback related issues at the [Aragon Chat #feedback](https://aragon.chat/channel/feedback) channel.
#### 🔧 For technical stuff, use this project's [issues](http://github.com/aragon/aragon/issues) or join the technical conversation in our [#dev](https://aragon.chat/channel/dev) channel.
#### 🦋 For an overview of what change in every version check the [changelog](https://github.com/aragon/aragon/blob/master/changelog.md)

## Contributing

Please note that all of the code is still undocumented, and no contribution guidelines are in place.

Contributions are welcome, just beware of the dragons. 🐲

## Environment options

The app currently supports setting a few environment settings via environment variables:

- `REACT_APP_DEFAULT_ETH_NODE`: Url of the default Ethereum node to read blockchain data from (must be WebSocket protocol). If you intend to connect to a local ganache instance, by default you should set this to `ws://localhost:8545`.
- `REACT_APP_ENS_REGISTRY_ADDRESS`: Address of the ENS registry that APM repos were registered on. If you've deployed aragonOS to a local network, you can find the ENS registry's address in the migration's console output.
- `REACT_APP_ETH_NETWORK_TYPE`: Expected network to connect to. Either one of `mainnet`, `rinkeby` or `local`.
- `REACT_APP_IPFS_GATEWAY`: Url of the IPFS gateway to load APM repos from. If you intend to connect to a local IPFS daemon, by default you should set this to `http://localhost:8080/ipfs`
- `REACT_APP_IPFS_RPC`: Url of the IPFS API endpoint to fetch blobs from. If you intend to connect to a local IPFS daemon, by default you should set this to `http://localhost:5001`
- `REACT_APP_ASSET_BRIDGE`: Which source to load the app frontend assets from. Can be one of `apm-bridge` (`apm-serve`'s production hosts, e.g. `voting.aragonpm.eth`, `ipfs` (loads through the IPFS gateway configured), or `local` (local servers, running on `localhost:300x`). If you intend to serve from a local IPFS daemon, you should set this to `ipfs`.

Without any settings, the app is configured to connect to our Rinkeby and `apm-serve` deployment.
