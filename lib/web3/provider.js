import ProviderEngine from 'web3-provider-engine'
import DefaultFixture from 'web3-provider-engine/subproviders/default-fixture'
import NonceTrackerSubprovider from 'web3-provider-engine/subproviders/nonce-tracker'
import CacheSubprovider from 'web3-provider-engine/subproviders/cache'
import FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import SanitizingSubprovider from 'web3-provider-engine/subproviders/sanitizer'

import { WalletProvider } from './wallet-provider'
import { RpcProvider } from './rpc-provider'

function Provider ({ messenger }) {
  if (!messenger) throw new Error('Configure Provider properly')

  const engine = new ProviderEngine()

  engine.addProvider(new WalletProvider({ messenger }))
  engine.addProvider(new DefaultFixture({
    web3_clientVersion: '/v0.0.1-alpha-1',
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true
  }))
  engine.addProvider(new SanitizingSubprovider())
  engine.addProvider(new CacheSubprovider())
  engine.addProvider(new FilterSubprovider())
  engine.addProvider(new NonceTrackerSubprovider())
  engine.addProvider(new RpcProvider({ messenger }))

  engine._ready.setMaxListeners(30)
  engine.start()
  engine.isConnected = () => true

  return engine
}

export { Provider }
