import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, IconConnect, useViewport } from '@aragon/ui'
import { enableWallet } from '../../wallet'

function WalletNotConnected({ compact }) {
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
        css={`
          min-width: ${5 * GU}px;
        `}
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

WalletNotConnected.propTypes = {
  compact: PropTypes.bool,
}

export default WalletNotConnected
