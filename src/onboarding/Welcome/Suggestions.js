import React, { useCallback, useMemo } from 'react'
import { EthIdenticon, Box, GU } from '@aragon/ui'
import FavoritesMenu from '../../components/FavoritesMenu/FavoritesMenu'
import { useFavoriteDaos } from '../../contexts/FavoriteDaosContext'
import { network } from '../../environment'
import {
  getKnownOrganization,
  getRecommendedOrganizations,
} from '../../known-organizations'
import { addressesEqual } from '../../web3-utils'

const MAX_SUGGESTIONS = 6
const RECOMMENDED_ORGS = getRecommendedOrganizations(network.type)

function Suggestions() {
  const {
    favoriteDaos: favoriteOrgs,
    isAddressFavorited,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteDaos()

  const suggestedOrgs = useMemo(() => {
    const orgs = new Map(
      [...favoriteOrgs].map(org => [org.address.toLowerCase(), org])
    )

    // Keep filling with recommended orgs until we reach the max
    RECOMMENDED_ORGS.forEach(org => {
      const orgAddress = org.address.toLowerCase()
      if (orgs.size < MAX_SUGGESTIONS && !orgs.has(orgAddress)) {
        orgs.set(orgAddress, org)
      }
    })

    return [...orgs.values()].sort((org, org2) => {
      const { address, name = '' } = org
      const { address: address2, name: name2 = '' } = org2
      return name.localeCompare(name2) || address > address2 ? 1 : -1
    })
  }, [favoriteOrgs])

  const updateFavorite = useCallback(
    (address, favorite) => {
      const org = suggestedOrgs.find(org =>
        addressesEqual(org.address, address)
      )

      // Can’t find the org
      if (!org) {
        return
      }

      if (favorite) {
        addFavorite(org)
      } else {
        removeFavoriteByAddress(org.address)
      }
    },
    [addFavorite, removeFavoriteByAddress, suggestedOrgs]
  )

  const openOrg = useCallback(
    address => {
      const org = suggestedOrgs.find(org =>
        addressesEqual(org.address, address)
      )
      window.location.hash = `/${(org && org.name) || address}`
    },
    [suggestedOrgs]
  )

  return (
    <Box heading="Explore" padding={0}>
      <FavoritesMenu
        items={suggestedOrgs.map(org => {
          const knownOrg = getKnownOrganization(network.type, org.address)
          return {
            favorited: isAddressFavorited(org.address),
            id: org.address,
            roundedImage: !knownOrg,
            image: knownOrg ? (
              <img
                src={knownOrg.image}
                width={3 * GU}
                alt=""
                css={`
                  object-fit: contain;
                  width: 100%;
                  height: 100%;
                `}
              />
            ) : (
              <EthIdenticon address={org.address} />
            ),
            name: knownOrg ? knownOrg.name : org.name || org.address,
            secondary: knownOrg ? knownOrg.template : '',
          }
        })}
        onActivate={openOrg}
        onFavoriteUpdate={updateFavorite}
      />
    </Box>
  )
}

export default Suggestions
