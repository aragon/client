import PropTypes from 'prop-types'

export const modalProps = PropTypes.shape({
  prevScreen: PropTypes.func,
  nextScreen: PropTypes.func,
  closeModal: PropTypes.func,
})
