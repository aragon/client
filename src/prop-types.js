import PropTypes from 'prop-types'

export const FavoriteDaoType = PropTypes.shape({
  name: PropTypes.string,
  address: PropTypes.string,
  favorited: PropTypes.bool,
})

export const DaoItemType = PropTypes.shape({
  name: PropTypes.string,
  address: PropTypes.string,
})

export const DaoAddressType = PropTypes.shape({
  address: PropTypes.string,
  domain: PropTypes.string,
})
