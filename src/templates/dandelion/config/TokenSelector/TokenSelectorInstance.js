import React from 'react'
import styled from 'styled-components'
import { addressesEqual, GU } from '@aragon/ui'
import { shortenAddress } from '../../../../web3-utils'
import { ETHER_TOKEN_FAKE_ADDRESS } from '../helpers/tokens'

/* eslint-disable react/prop-types */
const TokenSelectorInstance = React.memo(function TokenSelectorInstance({
  address,
  name,
  symbol,
  showIcon = true,
}) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      {showIcon ? (
        <Icon src={`https://chasing-coins.com/coin/logo/${symbol}`} />
      ) : (
        <div
          css={`
            width: ${3 * GU}px;
          `}
        />
      )}
      {symbol && (
        <span
          css={`
            margin-right: ${1 * GU}px;
          `}
        >
          {symbol}
        </span>
      )}
      {name && (
        <span
          css={`
            max-width: 110px;
            margin-right: ${1 * GU}px;
            overflow: hidden;
            text-overflow: ellipsis;
          `}
        >
          ({name})
        </span>
      )}
      {!addressesEqual(address, ETHER_TOKEN_FAKE_ADDRESS) &&
        shortenAddress(address)}
    </div>
  )
})

const Icon = styled.img.attrs({ alt: '', width: '16', height: '16' })`
  margin-right: ${1 * GU}px;
`

export default React.memo(TokenSelectorInstance)
