import { useMemo } from 'react'
import { useFavoriteDaos } from './contexts/FavoriteDaosContext'
import { getRecommendedOrganizations } from './known-organizations'
import { useWallet } from './contexts/wallet'

export function useSuggestedOrgs(maxSuggestions = 6) {
  const { favoriteDaos } = useFavoriteDaos()
  const { networkType } = useWallet()

  const suggestedOrgs = useMemo(() => {
    const orgs = new Map(
      [...favoriteDaos].map(org => [org.address.toLowerCase(), org])
    )

    const recommendedOrgs = getRecommendedOrganizations(networkType)
    // Keep filling with recommended orgs until we reach the max
    recommendedOrgs.forEach(org => {
      const orgAddress = org.address.toLowerCase()
      if (orgs.size < maxSuggestions && !orgs.has(orgAddress)) {
        orgs.set(orgAddress, org)
      }
    })

    return [...orgs.values()].sort((org, org2) => {
      const { address, name = '' } = org
      const { address: address2, name: name2 = '' } = org2
      return name.localeCompare(name2) || address > address2 ? 1 : -1
    })
  }, [favoriteDaos, maxSuggestions, networkType])

  return suggestedOrgs
}
