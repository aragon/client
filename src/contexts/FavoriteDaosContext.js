import React, { useContext } from 'react'
import uniqby from 'lodash.uniqby'
import PropTypes from 'prop-types'
import { network } from '../environment'
import StoredList from '../StoredList'
import { addressesEqual } from '../web3-utils'

const FavoriteDaosContext = React.createContext()

const storedList = new StoredList(`favorite-daos:${network.type}`)

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

class FavoriteDaosProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    favoriteDaos: filterFavoritesDaos(storedList.loadItems()),
  }

  add = dao => {
    this.setState({
      favoriteDaos: storedList.add(dao),
    })
  }

  remove = index => {
    this.setState({
      favoriteDaos: storedList.remove(index),
    })
  }

  isAddressFavorited = address => {
    return (
      this.state.favoriteDaos.findIndex(dao =>
        addressesEqual(dao.address, address)
      ) > -1
    )
  }

  addFavorite = dao => {
    const daoIndex = this.state.favoriteDaos.findIndex(({ address }) =>
      addressesEqual(address, dao.address)
    )
    if (daoIndex === -1) {
      this.setState({
        favoriteDaos: storedList.add({ name: dao.name, address: dao.address }),
      })
    }
  }

  removeFavoriteByAddress = address => {
    const daoIndex = this.state.favoriteDaos.findIndex(({ address }) =>
      addressesEqual(address, address)
    )
    if (daoIndex > -1) {
      const favs = storedList.remove(daoIndex)
      this.setState({
        favoriteDaos: favs,
      })
    }
  }

  updateFavoriteDaos = favoriteDaos => {
    this.setState({
      favoriteDaos: storedList.update(favoriteDaos),
    })
  }

  render() {
    const { children } = this.props
    const { favoriteDaos } = this.state
    return (
      <FavoriteDaosContext.Provider
        value={{
          favoriteDaos,
          addFavorite: this.addFavorite,
          isAddressFavorited: this.isAddressFavorited,
          removeFavoriteByAddress: this.removeFavoriteByAddress,
          updateFavoriteDaos: this.updateFavoriteDaos,
        }}
      >
        {children}
      </FavoriteDaosContext.Provider>
    )
  }
}

function useFavoriteDaos() {
  return useContext(FavoriteDaosContext)
}

const FavoriteDaosConsumer = FavoriteDaosContext.Consumer

export { FavoriteDaosProvider, FavoriteDaosConsumer, useFavoriteDaos }
