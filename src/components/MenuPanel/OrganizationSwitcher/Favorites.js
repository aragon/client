import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FavoriteDaoType } from '../../../prop-types'
import FavoriteRow from './FavoriteRow'

class Favorites extends React.Component {
  static propTypes = {
    favoriteDaos: PropTypes.arrayOf(FavoriteDaoType),
    currentDao: FavoriteDaoType,
    onRequestClose: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
  }

  state = { localDaos: [] }

  componentDidMount() {
    this.setState({ localDaos: this.getLocalDaos() })
  }

  componentWillUnmount() {
    const { onDone } = this.props
    const { localDaos } = this.state
    onDone(
      localDaos.filter(dao => dao.favorited).map(dao => ({
        name: dao.name,
        address: dao.address,
      }))
    )
  }

  // Build the local DAO list based on the favorites. The favorite state is not
  // directly reflected in the popup, to let users favorite / unfavorite items
  // without seeing them being immediatly removed. For this reason, we need to
  // maintain a separate state.
  getLocalDaos() {
    const { currentDao, favoriteDaos } = this.props

    const localDaos = [
      ...favoriteDaos
        .map(dao => ({ ...dao, favorited: true }))
        .sort(dao => (dao.address === currentDao.address ? -1 : 1)),
    ]

    // Do not add the current DAO if it is already in the favorites list
    if (this.isDaoFavorited(currentDao)) {
      return localDaos
    }

    return [
      { ...currentDao, favorited: this.isDaoFavorited(currentDao) },
      ...localDaos,
    ]
  }

  isDaoFavorited({ address }) {
    const { favoriteDaos } = this.props
    return favoriteDaos.findIndex(dao => dao.address === address) > -1
  }

  currentDaoWithFavoriteState() {
    const { currentDao } = this.props
    const { localDaos } = this.state
    const daoItem = localDaos.find(dao => currentDao.address === dao.address)
    return {
      ...currentDao,
      favorited: daoItem ? daoItem.favorited : false,
    }
  }

  handleDaoOpened = dao => {
    window.location.hash = `/${dao.name || dao.address}`
    this.props.onDone()
  }

  handleFavoriteUpdate = ({ address }, favorited) => {
    const { localDaos } = this.state

    this.setState({
      localDaos: localDaos.map(
        dao => (dao.address === address ? { ...dao, favorited } : dao)
      ),
    })
  }

  handleFocusout = e => {
    const popupElement = this._popupRef.current
    const focusedElement = e.relatedTarget
    if (!popupElement.contains(focusedElement)) {
      this.props.onRequestClose()
    }
  }

  render() {
    const { localDaos } = this.state
    const currentDao = this.currentDaoWithFavoriteState()
    const daosListWithoutCurrent = localDaos.filter(
      dao => dao.address !== currentDao.address
    )
    return (
      <section>
        <Title>Organizations</Title>
        <SectionTitle>Current</SectionTitle>
        <FavoriteRow
          dao={currentDao}
          onOpen={this.handleDaoOpened}
          onUpdate={this.handleFavoriteUpdate}
        />
        {daosListWithoutCurrent.length > 0 && (
          <React.Fragment>
            <SectionTitle>Favorites</SectionTitle>
            <List>
              {daosListWithoutCurrent.map(dao => (
                <li key={dao.address}>
                  <FavoriteRow
                    dao={dao}
                    onOpen={this.handleDaoOpened}
                    onUpdate={this.handleFavoriteUpdate}
                  />
                </li>
              ))}
            </List>
          </React.Fragment>
        )}
      </section>
    )
  }
}

const Title = styled.h1`
  padding: 10px 20px;
`

const SectionTitle = styled.h2`
  margin: 10px 20px;
  color: #707070;
  text-transform: lowercase;
  font-variant: small-caps;
  font-weight: 600;
`

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

export default Favorites
