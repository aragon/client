import { useState, useEffect, useMemo } from 'react'
import { isEnsDomainAvailable } from '../aragonjs-wrapper'
import { useClientWeb3 } from '../contexts/ClientWeb3Context'
import { completeDomain } from '../check-domain'

/**
 * This hook checks a list of networks for an ens domain. It returns all
 * network names on which the domain is found.
 *
 * @param {string} domain domain to check
 * @returns {{loading, networks}} object containing a loading state and a list of networks on which
 * the domain was found
 */
export function useDetectDao(domain) {
  const [networks, setNetowrks] = useState([])
  const [loading, setLoading] = useState(true)
  const { web3 } = useClientWeb3()

  useEffect(() => {
    setNetowrks(false)
    setLoading(true)

    let cancelled = false

    const check = async () => {
      // TODO define active networks as field in network-config
      const networksToCheck = ['main', 'matic', 'rinkeby', 'mumbai']
      const awalabilityPromise = networksToCheck.map(n =>
        isEnsDomainAvailable(n, web3, completeDomain(domain))
      )

      try {
        const availableNetworks = await Promise.all(awalabilityPromise)
        networksToCheck.filter((_, i) => availableNetworks[i])
        if (!cancelled) {
          setLoading(false)
          setNetowrks(availableNetworks)
        }
      } catch (err) {
        // retry every second
        setTimeout(check, 1000)
      }
    }

    // Only start checking after 300ms
    setTimeout(() => {
      if (!cancelled) {
        check(networks)
      }
    }, 300)

    return () => {
      cancelled = true
    }
  }, [domain, web3, networks])

  const data = useMemo(() => {
    return { loading, networks }
  }, [networks, loading])

  return data
}
