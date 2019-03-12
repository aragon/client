# Aragon <img align="right" src="https://github.com/aragon/design/blob/master/readme-logo.png" height="80px" />

[![Build Status](https://travis-ci.org/aragon/aragon.svg?branch=master)](https://travis-ci.org/aragon/aragon)
[![All Contributors](https://img.shields.io/badge/all_contributors-14-orange.svg?style=flat-square)](#contributors)

#### 📝 Please report support and feedback related issues at the [Aragon Chat #feedback](https://aragon.chat/channel/feedback) channel.
#### 🔧 For technical stuff, use this project's [issues](http://github.com/aragon/aragon/issues) or join the technical conversation in our [#dev](https://aragon.chat/channel/dev) channel.
#### 🦋 For an overview of what changed in every version check the [changelog](https://github.com/aragon/aragon/blob/master/changelog.md).

## Contributing

Please note that all of the code is still undocumented, and no contribution guidelines are in place.

Contributions are welcome, just beware of the dragons. 🐲

## Quick start

`npm start` will launch the app, configured to connect to our Rinkeby deployment.

For connecting to other chains / deployments, a few useful npm scripts are provided:

- Mainnet: `npm run start:mainnet` will launch the app, configured to connect to our mainnet deployment
- Local development: `npm run start:local` will launch the app, configured to connect to our [aragen](https://github.com/aragon/aragen) local development environment. It will also use the local IPFS daemon, if it detects one exists.

**Note**: Windows users may need to install the [windows-build-tools](https://www.npmjs.com/package/windows-build-tools) before installing this project's dependencies.

## Environment options

The app can be configured in a number of ways via environment variables:

- `ARAGON_DEMO_DAO`: Address of the demo organization suggested to users during onboarding
- `REACT_APP_DEFAULT_ETH_NODE`: Url of the default Ethereum node to read blockchain data from (must be WebSocket protocol). If you intend to connect to a local ganache instance, by default you should set this to `ws://localhost:8545`.
- `REACT_APP_ENS_REGISTRY_ADDRESS`: Address of the ENS registry that [APM](https://hack.aragon.org/docs/apm.html) repos were registered on. If you've deployed [aragonOS](https://github.com/aragon/aragonOS) to a local network, you can find the ENS registry's address in the migration's console output.
- `REACT_APP_ETH_NETWORK_TYPE`: Expected network type to connect to. Either one of `main`, `rinkeby` or `local`.
- `REACT_APP_IPFS_GATEWAY`: Url of the [IPFS](https://ipfs.io) gateway to load APM repos from. If you intend to connect to a local IPFS daemon, by default you should set this to `http://localhost:8080/ipfs`
- `REACT_APP_ASSET_BRIDGE`: Which source to load app frontend assets from. Can be one of `ipfs` (uses the configured IPFS gateway) or `local` (local development servers, running on `localhost:300x`). If you intend to serve assets from a local IPFS daemon, you should set this to `ipfs`.

Without any settings, the app is configured to connect to our Rinkeby deployment fetching assets from IPFS.

## Issues

If you come across an issue with Aragon, do a search in the [Issues](https://github.com/aragon/aragon/issues?utf8=%E2%9C%93&q=is%3Aissue) tab of this repo and the [Aragon Apps Issues](https://github.com/aragon/aragon-apps/issues?utf8=%E2%9C%93&q=is%3Aissue) to make sure it hasn't been reported before. Follow these steps to help us prevent duplicate issues and unnecessary notifications going to the many people watching this repo:

- If the issue you found has been reported and is still open, and the details match your issue, give a "thumbs up" to the relevant posts in the issue thread to signal that you have the same issue. No further action is required on your part.
- If the issue you found has been reported and is still open, but the issue is missing some details, you can add a comment to the issue thread describing the additional details.
- If the issue you found has been reported but has been closed, you can comment on the closed issue thread and ask to have the issue reopened because you are still experiencing the issue. Alternatively, you can open a new issue, reference the closed issue by number or link, and state that you are still experiencing the issue. Provide any additional details in your post so we can better understand the issue and how to fix it.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://pierre.world/"><img src="https://avatars2.githubusercontent.com/u/36158?v=4" width="75px;" alt="Pierre Bertet"/><br /><sub><b>Pierre Bertet</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=bpierre" title="Code">💻</a></td><td align="center"><a href="http://キタ.moe"><img src="https://avatars2.githubusercontent.com/u/4166642?v=4" width="75px;" alt="Brett Sun"/><br /><sub><b>Brett Sun</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=sohkai" title="Code">💻</a></td><td align="center"><a href="http://AquiGorka.com"><img src="https://avatars3.githubusercontent.com/u/3072458?v=4" width="75px;" alt="Gorka Ludlow"/><br /><sub><b>Gorka Ludlow</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=AquiGorka" title="Code">💻</a></td><td align="center"><a href="http://izqui.me"><img src="https://avatars3.githubusercontent.com/u/447328?v=4" width="75px;" alt="Jorge Izquierdo"/><br /><sub><b>Jorge Izquierdo</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=izqui" title="Code">💻</a></td><td align="center"><a href="http://aragon.org"><img src="https://avatars0.githubusercontent.com/u/718208?v=4" width="75px;" alt="Luis Iván Cuende"/><br /><sub><b>Luis Iván Cuende</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=luisivan" title="Code">💻</a> <a href="#design-luisivan" title="Design">🎨</a> <a href="#ideas-luisivan" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="http://notbjerg.me"><img src="https://avatars0.githubusercontent.com/u/8862627?v=4" width="75px;" alt="Oliver"/><br /><sub><b>Oliver</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=onbjerg" title="Code">💻</a></td><td align="center"><a href="https://github.com/bingen"><img src="https://avatars0.githubusercontent.com/u/701095?v=4" width="75px;" alt="ßingen"/><br /><sub><b>ßingen</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=bingen" title="Code">💻</a></td></tr><tr><td align="center"><a href="https://www.lightco.in"><img src="https://avatars1.githubusercontent.com/u/9424721?v=4" width="75px;" alt="John Light"/><br /><sub><b>John Light</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=john-light" title="Documentation">📖</a> <a href="https://github.com/aragon/aragon/issues?q=author%3Ajohn-light" title="Bug reports">🐛</a></td><td align="center"><a href="https://twitter.com/0xca0a"><img src="https://avatars0.githubusercontent.com/u/2223602?v=4" width="75px;" alt="Paul Henschel"/><br /><sub><b>Paul Henschel</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=drcmda" title="Code">💻</a></td><td align="center"><a href="https://github.com/rperez89"><img src="https://avatars2.githubusercontent.com/u/11763623?v=4" width="75px;" alt="Rodrigo Perez"/><br /><sub><b>Rodrigo Perez</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=rperez89" title="Code">💻</a></td><td align="center"><a href="http://www.gasolin.idv.tw"><img src="https://avatars1.githubusercontent.com/u/748808?v=4" width="75px;" alt="gasolin"/><br /><sub><b>gasolin</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=gasolin" title="Code">💻</a></td><td align="center"><a href="http://adamsoltys.com/"><img src="https://avatars0.githubusercontent.com/u/7641?v=4" width="75px;" alt="Adam Soltys"/><br /><sub><b>Adam Soltys</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=asoltys" title="Code">💻</a></td><td align="center"><a href="https://github.com/arku"><img src="https://avatars2.githubusercontent.com/u/7039523?v=4" width="75px;" alt="Arun Kumar"/><br /><sub><b>Arun Kumar</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=arku" title="Code">💻</a></td><td align="center"><a href="https://github.com/bvanderdrift"><img src="https://avatars1.githubusercontent.com/u/6398452?v=4" width="75px;" alt="Beer van der Drift"/><br /><sub><b>Beer van der Drift</b></sub></a><br /><a href="https://github.com/aragon/aragon/commits?author=bvanderdrift" title="Code">💻</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
