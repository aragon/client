import React from 'react'
import styled from 'styled-components'
import { addressesEqual, GU, tokenIconUrl } from '@aragon/ui'
import { shortenAddress } from '../../../../web3-utils'
import { ETHER_TOKEN_FAKE_ADDRESS } from '../../config/helpers/tokens'

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
      {/* TODO: Set network type when available  */}
      {showIcon ? (
        <Icon src={tokenIconUrl(address)} />
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
      <div>
        (
        {name && (
          <span
            css={`
              max-width: 110px;
              overflow: hidden;
              text-overflow: ellipsis;
            `}
          >
            {name}
          </span>
        )}
        {!addressesEqual(address, ETHER_TOKEN_FAKE_ADDRESS) && (
          <span
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            {shortenAddress(address)}
          </span>
        )}
        )
      </div>
    </div>
  )
})

const Icon = styled.img.attrs({ alt: '', width: '16', height: '16' })`
  margin-right: ${1 * GU}px;
`

export default TokenSelectorInstance
