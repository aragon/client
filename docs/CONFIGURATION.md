# Build-time environment options

The app can be configured in a number of ways via environment variables. Without any settings, the app is configured to connect to our Rinkeby deployment fetching assets from IPFS.

## General settings

### `ARAGON_DEFAULT_ETH_NODE`

Url of the default Ethereum node to read blockchain data from (must be WebSocket protocol). If you intend to connect to a local ganache instance, by default you should set this to `ws://localhost:8545`.

### `ARAGON_ENS_REGISTRY_ADDRESS`

Address of the ENS registry that [aragonPM](https://hack.aragon.org/docs/apm-intro) repos were registered on. If you’ve deployed [aragonOS](https://github.com/aragon/aragonOS) to a local network, you can find the ENS registry’s address in the migration’s console output.

### `ARAGON_ETH_NETWORK_TYPE`

Expected network type to connect to. Either one of `main`, `rinkeby` or `local`.

### `ARAGON_ETH_SUBSCRIPTION_EVENT_DELAY`

Time (in ms) delay between receiving an event from `eth_subscribe` to sending it for processing. Useful in cases where a node sends events faster than it can commit state changes from the event. Defaults to 0 (no delay).

### `ARAGON_IPFS_GATEWAY`

Url of the [IPFS](https://ipfs.io) gateway to load APM repos from. If you intend to connect to a local IPFS daemon, by default you should set this to `http://localhost:8080/ipfs`

### `ARAGON_APP_LOCATOR`

Which source to load app frontend assets from. Can be one of `ipfs` (uses the configured IPFS gateway) or `local` (local development servers for each app, running on `localhost:300x`). If you intend to serve assets from a local IPFS daemon, you should set this to `ipfs`.

It is also possible to define how every app is loaded individually using a comma-separated list, which contains a series of locations defined as `<app ID>:<app location>`.

```console
ARAGON_APP_LOCATOR=0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae:http://localhost:1234,0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae:http://localhost:3333 yarn start
```

Individual app locators can also use its “known name” if it exists. Known names are `Agent`, `Finance`, `Fundraising`, `Survey`, `TokenManager`, `Vault`, and `Voting`. When a known name is used without any location, they will be fetched from their [assigned local ports](src/known-app-ids.js), which are used by their respective development servers (see [aragon-apps](https://github.com/aragon/aragon-apps)).

```console
ARAGON_APP_LOCATOR=Agent,Finance yarn start
```

Another option is to use the ENS name of any app:

```console
ARAGON_APP_LOCATOR=voting.aragonpm.eth:1234 yarn start
```

Locations can also be a domain or an IP without the `http://` prefix, in which case it will get added:

```console
ARAGON_APP_LOCATOR=Agent:localhost:1234,Finance:192.168.1.4 yarn start
```

And they can also be a port, in which case `http://localhost` will get used:

```console
ARAGON_APP_LOCATOR=Agent:3333,Finance:4444 yarn start
```

## Ethereum Providers

### `ARAGON_FORTMATIC_API_KEY`

API key from [Formatic](fortmatic.com). Requires separate keys for testnet / mainnet.

### `ARAGON_PORTIS_DAPP_ID`

API key from [Portis](portis.io). Requires separate keys for testnet / mainnet.

## Development settings

### `ARAGON_PORT`

Local server port to start the app on. Defaults to `3000`.
