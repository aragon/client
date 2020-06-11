import React from 'react'
import PropTypes from 'prop-types'
import { GU, tokenIconUrl } from '@aragon/ui'
import SubtleLabel from './SubtleLabel'

function TokenAmount({ address, symbol, amount }) {
  const iconSize = 20

  return (
    <div
      css={`
        position: relative;
        padding-left: ${iconSize + GU}px;
      `}
    >
      <span
        css={`
          position: absolute;
          top: 0;
          left: 0;
          width: ${iconSize}px;
          height: ${iconSize}px;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          background-size: contain;
          background-image: url(${tokenIconUrl(address)});
        `}
      />
      <span>
        {amount} {symbol} <SubtleLabel>(per action)</SubtleLabel>
      </span>
    </div>
  )
}

TokenAmount.propTypes = {
  address: PropTypes.string,
  symbol: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default TokenAmount
