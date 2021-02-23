import React from 'react'
import PropTypes from 'prop-types'
import { GU, ToastHub, useViewport } from '@aragon/ui'

const TIMEOUT_TOAST = 4000

function CustomToast({ children }) {
  const { below } = useViewport()
  return (
    <ToastHub
      timeout={TIMEOUT_TOAST}
    >
      {children}
    </ToastHub>
  )
}

CustomToast.propTypes = {
  children: PropTypes.node.isRequired,
}

export { TIMEOUT_TOAST }
export default CustomToast
