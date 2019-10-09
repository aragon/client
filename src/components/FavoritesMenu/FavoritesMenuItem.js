import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { GU, IconStar, IconStarFilled, textStyle, useTheme } from '@aragon/ui'
import FavoritesMenuItemButton from './FavoritesMenuItemButton'

function FavoritesMenuItem({
  favorited,
  id,
  image,
  name,
  secondary,
  onActivate,
  onFavoriteUpdate,
}) {
  const theme = useTheme()

  const handleActivationClick = useCallback(() => {
    onActivate(id)
  }, [id, onActivate])

  const handleFavoriteClick = useCallback(() => {
    onFavoriteUpdate(id, !favorited)
  }, [onFavoriteUpdate, id, favorited])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <FavoritesMenuItemButton
        css={`
          display: flex;
          flex-grow: 1;
          padding: 0 ${2 * GU}px;
          min-width: 0;
        `}
        onClick={handleActivationClick}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            min-width: 0;
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              margin-right: ${1 * GU}px;
            `}
          >
            {image}
          </div>
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              min-width: 0;
              text-align: left;
            `}
          >
            <div
              css={`
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                color: ${theme.surfaceContent};
              `}
            >
              {name}
            </div>
            {secondary && (
              <div
                css={`
                  color: ${theme.surfaceContentSecondary};
                  ${textStyle('label2')}
                `}
              >
                {secondary}
              </div>
            )}
          </div>
        </div>
      </FavoritesMenuItemButton>
      <FavoritesMenuItemButton
        css={`
          padding: 0 ${1.5 * GU}px;
          color: ${theme.yellow};
        `}
        onClick={handleFavoriteClick}
      >
        {favorited ? <IconStarFilled /> : <IconStar />}
      </FavoritesMenuItemButton>
    </div>
  )
}

FavoritesMenuItem.propTypes = {
  favorited: PropTypes.bool,
  id: PropTypes.string.isRequired,
  image: PropTypes.node,
  name: PropTypes.string.isRequired,
  onActivate: PropTypes.func.isRequired,
  onFavoriteUpdate: PropTypes.func.isRequired,
  secondary: PropTypes.string,
}

export default FavoritesMenuItem
