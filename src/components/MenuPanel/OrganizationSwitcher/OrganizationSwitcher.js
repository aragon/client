import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonBase,
  LoadingRing,
  Popover,
  GU,
  textStyle,
  useTheme,
} from '@aragon/ui'
import { FavoriteDaoType, DaoItemType } from '../../../prop-types'
import { FavoriteDaosConsumer } from '../../../contexts/FavoriteDaosContext'
import OrganizationItem from './OrganizationItem'
import Favorites from './Favorites'

const OrganizationSwitcher = React.memo(function OrganizationSwitcher({
  currentDao,
  favoriteDaos,
  updateFavoriteDaos,
}) {
  const theme = useTheme()

  const buttonRef = useRef(null)
  const [menuOpened, setMenuOpened] = useState(false)

  const handleToggleMenu = useCallback(() => {
    setMenuOpened(opened => !opened)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpened(false)
  }, [])

  const handleFavoritesUpdate = useCallback(
    favorites => {
      closeMenu()
      updateFavoriteDaos(favorites)
    },
    [closeMenu, updateFavoriteDaos]
  )

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        position: relative;
      `}
    >
      <ButtonBase
        ref={buttonRef}
        onClick={handleToggleMenu}
        css={`
          flex-grow: 1;
          padding: ${2 * GU}px ${2 * GU}px ${2 * GU}px ${3 * GU}px;
          width: 100%;
          height: 100%;
          min-width: ${28 * GU}px;
          border-radius: 0;
          &:active {
            background: ${theme.surfacePressed};
          }
        `}
      >
        <OrganizationItem
          dao={currentDao}
          css={`
            ${textStyle('body1')}
          `}
        />
      </ButtonBase>
      <Popover
        onClose={closeMenu}
        visible={menuOpened}
        opener={buttonRef.current}
      >
        <Favorites
          favoriteDaos={favoriteDaos}
          currentDao={currentDao}
          onUpdate={handleFavoritesUpdate}
        />
      </Popover>
    </div>
  )
})

OrganizationSwitcher.propTypes = {
  currentDao: DaoItemType.isRequired,

  // These are coming from <FavoriteDaosConsumer /> (end of this file).
  favoriteDaos: PropTypes.arrayOf(FavoriteDaoType).isRequired,
  updateFavoriteDaos: PropTypes.func.isRequired,
}

function OrganizationSwitcherWithFavorites({ loading, ...props }) {
  if (loading) {
    return (
      <div
        css={`
          display: flex;
          align-items: center;
          margin: ${2 * GU}px ${3 * GU}px;
        `}
      >
        <LoadingRing />
        <span
          css={`
            margin-left: ${1 * GU}px;
            ${textStyle('body1')}
          `}
        >
          Loading…
        </span>
      </div>
    )
  }
  if (props.currentDao.address) {
    return (
      <FavoriteDaosConsumer>
        {({ favoriteDaos, updateFavoriteDaos }) => (
          <OrganizationSwitcher
            {...props}
            favoriteDaos={favoriteDaos}
            updateFavoriteDaos={updateFavoriteDaos}
          />
        )}
      </FavoriteDaosConsumer>
    )
  }
  return null
}

OrganizationSwitcherWithFavorites.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentDao: DaoItemType.isRequired,
}

export default OrganizationSwitcherWithFavorites
