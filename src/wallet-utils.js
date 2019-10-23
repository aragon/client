import { web3Providers } from './environment'

// Enable the web3 provider. There is no way to reliably know the enabled
// state of a provider, so we assume that if there is a provider but no
// account, the provider is locked and / or not enabled.
export function enableWallet() {
  const provider = web3Providers.wallet

  if (!provider) {
    return
  }

  // For providers supporting .enable() (EIP 1102 draft).
  if (typeof provider.enable === 'function') {
    provider.enable()
    return
  }

  // For providers supporting EIP 1102 (final).
  if (typeof provider.send === 'function') {
    // Some providers (Metamask) don’t return a promise as defined in EIP
    // 1102, so we can’t rely on it to know the connected accounts.
    provider.send('eth_requestAccounts')
  }
}
