import React from 'react'
import PropTypes from 'prop-types'
import { ToastHub as TH } from '@aragon/ui'

const TIMEOUT_TOAST = 4000

function CustomToast({ children }) {
  return (
    <TH timeout={TIMEOUT_TOAST}>{children}</TH>
  )
}

CustomToast.propTypes = {
  children: PropTypes.node.isRequired,
}

export { TIMEOUT_TOAST }
export default CustomToast
