import { getEthNode } from './environment'
import Web3 from 'web3'

class Web3Provider {
  getProvider(networkType) {
    console.log('========>calling getProvider', networkType)
    if (networkType === this.networkType) {
      return this.provider
    }

    if (this.provider) {
      if (this.provider.connected) {
        console.log(
          '@@@@@@@@@@@@@@disconnect provider ',
          this.networkType,
          'for new network',
          networkType
        )
        this.provider.disconnect()
      }
    }
    this.networkType = networkType
    const host = getEthNode(networkType)
    this.provider = new Web3.providers.WebsocketProvider(host)
    return this.provider
  }
}

export const web3Provider = new Web3Provider()
