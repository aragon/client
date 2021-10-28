import { useState, useEffect, useMemo } from 'react'
import { isEnsDomainAvailable } from '../aragonjs-wrapper'
import { completeDomain } from '../check-domain'
import { getActiveNetworks } from '../util/network'
import { getWeb3Provider } from '../util/web3'

/**
 * This hook checks a list of networks for an ens domain. It returns all
 * network names on which the domain is found.
 *
 * @param {string} domain domain to check
 * @returns {{loading, networks}} object containing a loading state and a list of networks on which
 * the domain was found
 */
export function useDetectDao(domain) {
  const [networks, setNetworks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    let cancelled = false

    const promiseTimeout = function(ms, promise) {
      // Create a promise that rejects in <ms> milliseconds
      const timeout = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
          clearTimeout(id)
          // Ignore for prefer-promise-reject-errors
          // eslint-disable-next-line
          reject({reason: 'timed out'})
        }, ms)
      })

      // Returns a race between our timeout and the passed in promise
      return Promise.race([promise, timeout])
    }

    const checkWithProvider = async () => {
      const networksToCheck = getActiveNetworks()
      try {
        const providers = networksToCheck.map(n => ({
          network: n,
          provider: getWeb3Provider(n),
        }))
        const availabilityPromise = providers.map(p => {
          // Avoid bad web sockets to freeze the application looking forever
          return promiseTimeout(
            3000,
            isEnsDomainAvailable(p.network, p.provider, completeDomain(domain))
          )
        })

        const availableNetworks = await Promise.allSettled(availabilityPromise)

        // get only the ones promises that were fullfilled and ENS were not available (means DAO exists)
        const daoExists = availableNetworks.map(a => !a.value && !a.reason)

        const daoExistsOnNetworks = networksToCheck.filter(
          (_, i) => daoExists[i]
        )

        // NOTE I can't seem to get the hook life cycle right, so I'm tearing
        // the connections down immediately. [VR 22-09-2021]
        providers.forEach(p => {
          if (p.provider.disconnect) {
            p.provider.disconnect()
          } else {
            // Older versions of web3's providers didn't expose a generic interface for disconnecting
            p.provider.connection.close()
          }
        })

        if (!cancelled) {
          setLoading(false)
          setNetworks(daoExistsOnNetworks)
        }
      } catch (err) {
        console.error(err)
      }
    }

    checkWithProvider()
    return () => {
      cancelled = true
    }
  }, [domain])

  const data = useMemo(() => {
    return { loading, networks }
  }, [networks, loading])

  return data
}
