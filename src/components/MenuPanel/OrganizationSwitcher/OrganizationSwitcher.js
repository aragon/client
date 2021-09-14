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
import { DaoItemType } from '../../../prop-types'
import { useFavoriteDaos } from '../../../contexts/FavoriteDaosContext'
import OrganizationItem from './OrganizationItem'
import Favorites from './Favorites'
import { useWallet } from '../../../contexts/wallet'

const OrganizationSwitcher = React.memo(function OrganizationSwitcher({
  currentDao,
  loading,
}) {
  const theme = useTheme()
  const { networkType } = useWallet()

  const { favoriteDaos, updateFavoriteDaos } = useFavoriteDaos()

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

  if (!currentDao.address) {
    return null
  }

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
          networkType={networkType}
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
  loading: PropTypes.bool.isRequired,
}

export default OrganizationSwitcher
