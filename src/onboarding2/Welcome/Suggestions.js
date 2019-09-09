import React, { useCallback, useMemo } from 'react'
import { EthIdenticon, Box, GU } from '@aragon/ui'
import FavoritesMenu from '../../components/FavoritesMenu/FavoritesMenu'
import {
  getKnownOrganization,
  getRecommendedOrganizations,
} from '../../known-organizations'
import { network } from '../../environment'
import { useFavoriteDaos } from '../../contexts/FavoriteDaosContext'

const MAX_SUGGESTIONS = 6
const RECOMMENDED_ORGS = getRecommendedOrganizations(network.type)

function Suggestions() {
  const {
    favoriteDaos: favoriteOrgs,
    isAddressFavorited,
    removeFavoriteByAddress,
    addFavorite,
  } = useFavoriteDaos()

  const updateFavorite = useCallback(
    (address, favorite) => {
      const org =
        favoriteOrgs.find(org => org.address === address) ||
        RECOMMENDED_ORGS.find(org => org.address === address)

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
    [addFavorite, removeFavoriteByAddress, favoriteOrgs]
  )

  const suggestedOrgs = useMemo(() => {
    const orgs = [...favoriteOrgs]

    // Keep filling with recommended orgs until we reach the max
    let i = 0
    while (i < RECOMMENDED_ORGS.length && orgs.length < MAX_SUGGESTIONS) {
      if (
        orgs.findIndex(org => org.address === RECOMMENDED_ORGS[i].address) ===
        -1
      ) {
        orgs.push(RECOMMENDED_ORGS[i])
      }
      i++
    }
    return orgs.sort((a, b) => (a.address > b.address ? 1 : -1))
  }, [favoriteOrgs])

  const openDao = useCallback(
    address => {
      const dao = suggestedOrgs.find(org => org.address === address)
      if (dao) {
        window.location.hash = `/${dao.name || dao.address}`
      }
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
        onActivate={openDao}
        onFavoriteUpdate={updateFavorite}
      />
    </Box>
  )
}

export default Suggestions
