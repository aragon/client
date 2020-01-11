import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, IconConnect, useViewport } from '@aragon/ui'
import { enableWallet } from '../../wallet'

function NotConnected({ compact }) {
  const { below } = useViewport()

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        text-align: left;
        padding: 0 ${(compact ? 1 : 2) * GU}px;
      `}
    >
      <Button
        display={below('medium') ? 'icon' : 'all'}
        size={compact ? 'small' : 'medium'}
        icon={<IconConnect />}
        label="Enable account"
        onClick={enableWallet}
        wide
      />
    </div>
  )
}

NotConnected.propTypes = {
  compact: PropTypes.bool,
}

export default NotConnected
