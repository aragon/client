import ENS from 'ethereum-ens'
import { contractAddresses, web3Providers } from './environment'

/**
 * Resolves an ENS name to its address.
 * @param {string} name Name to resolve
 * @return {Promise} Resolves with the resolved address.
 *   Resolves with an empty string if the name could not be resolved.
 */
export async function resolveEnsDomain(name) {
  const ens = new ENS(web3Providers.default, contractAddresses.ensRegistry)

  try {
    return await ens.resolver(name).addr()
  } catch (err) {
    if (err.message === 'ENS name not found') {
      return ''
    }
    // Don't know what happened; rethrow
    throw err
  }
}

/**
 * Checks if a name is available on ENS.
 * @param {string} name Name to check
 * @return {Promise} Resolves with true or false
 */
export async function isEnsDomainAvailable(name) {
  return !(await resolveEnsDomain(name))
}
