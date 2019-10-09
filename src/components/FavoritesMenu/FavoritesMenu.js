import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@aragon/ui'
import FavoritesMenuItem from './FavoritesMenuItem'

function FavoritesMenu({ items, onActivate, onFavoriteUpdate }) {
  const theme = useTheme()

  return (
    <ul
      css={`
        margin: 0;
        padding: 0;
        list-style: none;
      `}
    >
      {items.map(item => (
        <li
          key={item.id}
          css={`
            & + & {
              border-top: 1px solid ${theme.border};
            }
          `}
        >
          <FavoritesMenuItem
            favorited={item.favorited}
            id={item.id}
            image={item.image}
            name={item.name}
            onActivate={onActivate}
            onFavoriteUpdate={onFavoriteUpdate}
            secondary={item.secondary}
          />
        </li>
      ))}
    </ul>
  )
}

FavoritesMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      favorited: PropTypes.bool,
      id: PropTypes.string,
      image: PropTypes.node,
      name: PropTypes.node,
      secondary: PropTypes.node,
    }).isRequired
  ),

  // when the favorited status of an item changes
  onFavoriteUpdate: PropTypes.func.isRequired,

  // when the item itself gets clicked
  onActivate: PropTypes.func.isRequired,
}

export default FavoritesMenu
