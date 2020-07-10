import PropTypes from 'prop-types'

export const ModalProps = PropTypes.shape({
  prevScreen: PropTypes.func,
  nextScreen: PropTypes.func,
  closeModal: PropTypes.func,
})
