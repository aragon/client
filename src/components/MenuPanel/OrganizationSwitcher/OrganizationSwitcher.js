import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { theme } from '@aragon/ui'
import { FavoriteDaoType, DaoItemType } from '../../../prop-types'
import { FavoriteDaosConsumer } from '../../../contexts/FavoriteDaosContext'
import LoadingRing from '../../LoadingRing'
import Popup from '../../Popup'
import OrganizationItem from './OrganizationItem'
import Favorites from './Favorites'
import FocusVisible from '../../FocusVisible'

class OrganizationSwitcher extends React.PureComponent {
  static propTypes = {
    currentDao: DaoItemType.isRequired,

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
    return (
      <FocusVisible>
        {({ focusVisible, onFocus }) => (
          <Main>
            <OpenButton
              onClick={this.handleToggleMenu}
              onFocus={onFocus}
              focusVisible={focusVisible}
            >
              <OrganizationItem
                dao={currentDao}
                style={{ paddingRight: '5px' }}
              />
            </OpenButton>
            <Popup onRequestClose={this.closeMenu} visible={menuOpened}>
              <Favorites
                favoriteDaos={favoriteDaos}
                currentDao={currentDao}
                onUpdate={this.handleFavoritesUpdate}
              />
            </Popup>
          </Main>
        )}
      </FocusVisible>
    )
  }
}

const Main = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  position: relative;
`

const OpenButton = styled.button.attrs({ type: 'button' })`
  flex-grow: 1;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  width: 100%;
  height: 100%;
  &:active {
    background: rgba(220, 234, 239, 0.3);
  }
  &:focus {
    outline: ${p => (p.focusVisible ? `2px solid ${theme.accent}` : '0')};
  }
  &::-moz-focus-inner {
    border: 0;
  }
`

const Loader = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`

const LoaderLabel = styled.span`
  margin-left: 10px;
  font-size: 15px;
`

const OrganizationSwitcherWithFavorites = props =>
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

OrganizationSwitcherWithFavorites.propTypes = {
  currentDao: DaoItemType.isRequired,
}

export default OrganizationSwitcherWithFavorites
