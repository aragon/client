# Aragon Core <img align="right" src="https://github.com/aragon/design/blob/master/readme-logo.png" height="80px" />

[![Build Status](https://travis-ci.org/aragon/aragon.svg?branch=master)](https://travis-ci.org/aragon/aragon)

#### 📝 Please report support and feedback related issues at the [Aragon Chat #feedback](https://aragon.chat/channel/feedback) channel.
#### 🔧 For technical stuff, use this project's [issues](http://github.com/aragon/aragon/issues) or join the technical conversation in our [#dev](https://aragon.chat/channel/dev) channel.
#### 🦋 For an overview of what changed in every version check the [changelog](https://github.com/aragon/aragon/blob/master/changelog.md)

## Contributing

Please note that all of the code is still undocumented, and no contribution guidelines are in place.

Contributions are welcome, just beware of the dragons. 🐲

## Quick start

`npm start` will launch the app, configured to connect to our Rinkeby deployment.

For connecting to other chains / deployments, a few useful npm scripts are provided:

- Mainnet: `npm run start:mainnet` will launch the app, configured to connect to our mainnet deployment
- Local development: `npm run start:local` will launch the app, configured to connect to our [aragen](https://github.com/aragon/aragen) local development environment. It will also use the local IPFS daemon, if it detects one exists.

## Environment options

The app can be configured in a number of ways via environment variables:

- `REACT_APP_DEFAULT_ETH_NODE`: Url of the default Ethereum node to read blockchain data from (must be WebSocket protocol). If you intend to connect to a local ganache instance, by default you should set this to `ws://localhost:8545`.
- `REACT_APP_ENS_REGISTRY_ADDRESS`: Address of the ENS registry that APM repos were registered on. If you've deployed aragonOS to a local network, you can find the ENS registry's address in the migration's console output.
- `REACT_APP_ETH_NETWORK_TYPE`: Expected network to connect to. Either one of `mainnet`, `rinkeby` or `local`.
- `REACT_APP_IPFS_GATEWAY`: Url of the IPFS gateway to load APM repos from. If you intend to connect to a local IPFS daemon, by default you should set this to `http://localhost:8080/ipfs`
- `REACT_APP_ASSET_BRIDGE`: Which source to load the app frontend assets from. Can be one of `apm-bridge` (`apm-serve`'s production hosts, e.g. `voting.aragonpm.eth`, `ipfs` (loads through the IPFS gateway configured), or `local` (local servers, running on `localhost:300x`). If you intend to serve from a local IPFS daemon, you should set this to `ipfs`.

Without any settings, the app is configured to connect to our Rinkeby deployment using the `apm-serve` bridge.
