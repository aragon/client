import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { textStyle, ButtonBase, LoadingRing, Popover } from '@aragon/ui'
import { FavoriteDaoType, DaoItemType } from '../../../prop-types'
import { FavoriteDaosConsumer } from '../../../contexts/FavoriteDaosContext'
// import Popup from '../../Popup'
import OrganizationItem from './OrganizationItem'
import Favorites from './Favorites'
import { GU } from '../../../utils'

const OrganizationSwitcher = React.memo(function OrganizationSwitcher({
  currentDao,
  favoriteDaos,
  updateFavoriteDaos,
}) {
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
        height: ${8 * GU}px;
        align-items: center;
        position: relative;
      `}
    >
      <ButtonBase
        ref={buttonRef}
        onClick={handleToggleMenu}
        css={`
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
        `}
      >
        <OrganizationItem
          dao={currentDao}
          css={`
            padding-left: ${3 * GU}px;
            padding-right: ${3 * GU}px;
            font-size: 18px;
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
          margin-left: ${2 * GU}px;
        `}
      >
        <LoadingRing />
        <span
          css={`
            margin-left: ${1 * GU}px;
            ${textStyle('body2')};
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
