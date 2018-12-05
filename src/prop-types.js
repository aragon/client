import PropTypes from 'prop-types'

export const FavoriteDaoType = PropTypes.shape({
  name: PropTypes.string,
  address: PropTypes.string,
  favorited: PropTypes.bool,
})
