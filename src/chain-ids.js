const CHAIN_IDS = {
  ETHEREUM: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  KOVAN: 42,
  GOERLI: 5,
  XDAI: 100,
}

// Error on invalid accesses to CHAIN_IDS
const PROTECTED_CHAIN_IDS = new Proxy(CHAIN_IDS, {
  get(target, property) {
    if (property in target) {
      return target[property]
    } else {
      throw new Error(`Chain ID '${property}' not supported`)
    }
  },
})

export default PROTECTED_CHAIN_IDS
