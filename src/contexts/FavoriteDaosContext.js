import React, {
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import uniqby from 'lodash.uniqby'
import PropTypes from 'prop-types'
import StoredList from '../StoredList'
import { addressesEqual } from '../util/web3'
import { useWallet } from '../contexts/wallet'
import { getLocalStorageKey } from '../util/utils'
import { trackEvent, events } from '../analytics'

const FavoriteDaosContext = React.createContext()

const filterFavoritesDaos = daos =>
  uniqby(
    daos
      .filter(dao => dao && dao.address)
      .map(dao => ({
        name: dao.name || '',
        address: dao.address,
      })),
    dao => dao.address.toLowerCase()
  )

function FavoriteDaosProvider({ children }) {
  const { networkType } = useWallet()
  const [favoriteDaos, setFavoriteDaos] = useState([])

  const storedList = useMemo(() => {
    return new StoredList(getLocalStorageKey(`favorite-daos`, networkType))
  }, [networkType])

  useEffect(() => {
    let cancel = false

    if (!cancel) {
      setFavoriteDaos(() => {
        const favs = storedList.loadItems()
        return filterFavoritesDaos(favs)
      })
    }

    return () => {
      cancel = true
    }
  }, [networkType, storedList])

  const isAddressFavorited = useCallback(
    address => {
      return (
        favoriteDaos.findIndex(dao => addressesEqual(dao.address, address)) > -1
      )
    },
    [favoriteDaos]
  )

  const addFavorite = useCallback(
    dao => {
      const daoIndex = favoriteDaos.findIndex(({ address }) =>
        addressesEqual(address, dao.address)
      )
      if (daoIndex === -1) {
        setFavoriteDaos(
          storedList.add({ name: dao.name, address: dao.address })
        )

        // analytics
        favoriteToggleEvent(dao.name || dao.address, true, networkType)
      }
    },
    [favoriteDaos, setFavoriteDaos, storedList, networkType]
  )

  const removeFavorite = useCallback(
    dao => {
      const daoIndex = favoriteDaos.findIndex(({ address }) =>
        addressesEqual(dao.address, address)
      )
      if (daoIndex > -1) {
        setFavoriteDaos(() => {
          return storedList.remove(daoIndex)
        })

        // analytics
        favoriteToggleEvent(dao.name || dao.address, false, networkType)
      }
    },
    [favoriteDaos, setFavoriteDaos, storedList, networkType]
  )

  const updateFavoriteDaos = useCallback(
    daos => {
      setFavoriteDaos(storedList.update(daos))
    },
    [setFavoriteDaos, storedList]
  )

  return (
    <FavoriteDaosContext.Provider
      value={{
        favoriteDaos,
        addFavorite,
        isAddressFavorited,
        removeFavorite,
        updateFavoriteDaos,
      }}
    >
      {children}
    </FavoriteDaosContext.Provider>
  )
}

FavoriteDaosProvider.propTypes = {
  children: PropTypes.node,
}

function useFavoriteDaos() {
  return useContext(FavoriteDaosContext)
}

const FavoriteDaosConsumer = FavoriteDaosContext.Consumer

const favoriteToggleEvent = (daoIdentifier, toggle, networkType) => {
  // analytics
  trackEvent(events.FAVORITE_ORGANIZATION_TOGGLED, {
    network: networkType,
    dao_identifier: daoIdentifier,
    favorited: toggle,
  })
}

export {
  FavoriteDaosProvider,
  FavoriteDaosConsumer,
  useFavoriteDaos,
  favoriteToggleEvent,
}
