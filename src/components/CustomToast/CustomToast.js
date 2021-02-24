import React from 'react'
import PropTypes from 'prop-types'
import { GU, ToastHub, useViewport } from '@aragon/ui'
import { useHelpScout } from '../HelpScoutBeacon/useHelpScout'

const TIMEOUT_TOAST = 4000

function CustomToast({ children }) {
  const { below } = useViewport()
  const { optedOut } = useHelpScout()
  return (
    <ToastHub
      shift={optedOut ? 0 : below('medium') ? 5.5 * GU : 6.5 * GU}
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
