import { useState, useEffect, useMemo } from 'react'
import { isEnsDomainAvailable } from '../aragonjs-wrapper'
import { completeDomain } from '../check-domain'
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

    const checkWithProvider = async () => {
      // TODO define active networks as field in network-config
      const networksToCheck = ['main', 'rinkeby']
      try {
        const providers = networksToCheck.map(n => ({
          network: n,
          provider: getWeb3Provider(n),
        }))
        const availabilityPromise = providers.map(p => {
          return isEnsDomainAvailable(
            p.network,
            p.provider,
            completeDomain(domain)
          )
        })

        const availableNetworks = await Promise.all(availabilityPromise)
        const daoExists = availableNetworks.map(a => !a)
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
