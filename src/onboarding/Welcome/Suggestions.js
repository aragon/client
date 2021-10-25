import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@aragon/ui'
import FavoritesMenu from '../../components/FavoritesMenu/FavoritesMenu'
import OrgIcon from '../../components/OrgIcon/OrgIcon'
import { useFavoriteDaos } from '../../contexts/FavoriteDaosContext'
import { getKnownOrganization } from '../../known-organizations'
import { addressesEqual } from '../../util/web3'
import { useWallet } from '../../contexts/wallet'
import { trackEvent, events } from '../../analytics'

function Suggestions({ suggestedOrgs }) {
  const { isAddressFavorited, removeFavorite, addFavorite } = useFavoriteDaos()

  const { networkType } = useWallet()

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
        removeFavorite(org)
      }
    },
    [addFavorite, removeFavorite, suggestedOrgs]
  )

  const openOrg = useCallback(
    address => {
      const org = suggestedOrgs.find(org =>
        addressesEqual(org.address, address)
      )
      window.location.hash = `/${(org && org.name) || address}`

      // analytics
      trackEvent(events.ORGANIZATION_LINK_CLICKED, {
        dao_identifier: org.name || org.address,
        network: networkType,
      })
    },
    [suggestedOrgs, networkType]
  )

  if (suggestedOrgs.length === 0) {
    return null
  }

  return (
    <Box heading="Explore" padding={0}>
      <FavoritesMenu
        items={suggestedOrgs.map(org => {
          const knownOrg = getKnownOrganization(networkType, org.address)
          return {
            favorited: isAddressFavorited(org.address),
            id: org.address,
            image: <OrgIcon orgAddress={org.address} />,
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

Suggestions.propTypes = {
  suggestedOrgs: PropTypes.array.isRequired,
}

export default Suggestions
