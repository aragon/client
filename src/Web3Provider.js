import { getWeb3Provider } from './util/web3'

class Web3Provider {
  getProvider(networkType) {
    if (networkType === this.networkType) {
      return this.provider
    }

    if (this.provider && this.provider.connected) {
      this.provider.disconnect()
    }
    this.networkType = networkType
    this.provider = getWeb3Provider(networkType)
    return this.provider
  }
}

export const web3Provider = new Web3Provider()
