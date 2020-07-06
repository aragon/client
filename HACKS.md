Hacks
=====

We've had to do some not so nice things to make things work, or work better :cry:.

- Cloned the `window.ethereum` object to another place before the app loads so [web3 can't mutate it](https://github.com/aragon/aragon/pull/1463/files): [web3 has side-effects](https://github.com/ethereum/web3.js/issues/3374)
