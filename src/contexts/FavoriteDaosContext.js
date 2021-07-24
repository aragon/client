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
import { addressesEqual } from '../web3-utils'
import { useWallet } from '../wallet'

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
    return new StoredList(`favorite-daos:${networkType}`)
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
      }
    },
    [favoriteDaos, setFavoriteDaos, storedList]
  )

  const removeFavoriteByAddress = useCallback(
    removeAddress => {
      const daoIndex = favoriteDaos.findIndex(({ address }) =>
        addressesEqual(removeAddress, address)
      )
      if (daoIndex > -1) {
        setFavoriteDaos(() => {
          return storedList.remove(daoIndex)
        })
      }
    },
    [favoriteDaos, setFavoriteDaos, storedList]
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
        removeFavoriteByAddress,
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

export { FavoriteDaosProvider, FavoriteDaosConsumer, useFavoriteDaos }
