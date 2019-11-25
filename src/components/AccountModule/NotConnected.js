import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, IconConnect } from '@aragon/ui'
import { enableWallet } from '../../wallet-utils'

function NotConnected({ compact }) {
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
