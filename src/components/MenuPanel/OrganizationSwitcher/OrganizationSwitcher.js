import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { theme } from '@aragon/ui'
import { FavoriteDaoType } from '../../../prop-types'
import { FavoriteDaosConsumer } from '../../../contexts/FavoriteDaosContext'
import LoadingRing from '../../LoadingRing'
import Popup from '../../Popup'
import OrganizationItem from './OrganizationItem'
import Favorites from './Favorites'

class OrganizationSwitcher extends React.PureComponent {
  static propTypes = {
    currentDao: FavoriteDaoType.isRequired,

    // These are coming from <FavoriteDaosConsumer /> (end of this file).
    favoriteDaos: PropTypes.arrayOf(FavoriteDaoType).isRequired,
    updateFavoriteDaos: PropTypes.func.isRequired,
  }
  state = {
    menuOpened: false,
  }
  handleToggleMenu = () => {
    this.setState(({ menuOpened }) => ({ menuOpened: !menuOpened }))
  }
  closeMenu = () => {
    this.setState({ menuOpened: false })
  }
  handleFavoritesUpdate = favorites => {
    this.closeMenu()
    this.props.updateFavoriteDaos(favorites)
  }
  render() {
    const { menuOpened } = this.state
    const { currentDao, favoriteDaos } = this.props
    if (!currentDao.address) {
      return null
    }
    return (
      <Main>
        <OpenButton onClick={this.handleToggleMenu}>
          <OrganizationItem dao={currentDao} style={{ paddingRight: '5px' }} />
        </OpenButton>
        <Popup onRequestClose={this.closeMenu} visible={menuOpened}>
          <Favorites
            favoriteDaos={favoriteDaos}
            currentDao={currentDao}
            onDone={this.handleFavoritesUpdate}
          />
        </Popup>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  height: 100%;
  position: relative;
`

const OpenButton = styled.button.attrs({ type: 'button' })`
  flex-grow: 1;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  margin-left: -20px;
  width: 180px;
  &:active {
    background: rgba(220, 234, 239, 0.3);
  }
  &:focus {
    outline: 2px solid ${theme.accent};
  }
  &:focus:not(:focus-visible) {
    outline: 0;
  }
  &:focus-visible {
    outline: 2px solid ${theme.accent};
  }
  &::-moz-focus-inner {
    border: 0;
  }
`

const Loader = styled.div`
  display: flex;
  align-items: center;
`

const LoaderLabel = styled.span`
  margin-left: 10px;
  font-size: 15px;
`

export default props =>
  props.currentDao.address ? (
    <FavoriteDaosConsumer>
      {({ favoriteDaos, updateFavoriteDaos }) => (
        <OrganizationSwitcher
          {...props}
          favoriteDaos={favoriteDaos}
          updateFavoriteDaos={updateFavoriteDaos}
        />
      )}
    </FavoriteDaosConsumer>
  ) : (
    <Loader>
      <LoadingRing spin />
      <LoaderLabel>Loading…</LoaderLabel>
    </Loader>
  )
