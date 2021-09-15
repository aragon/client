import React from 'react'
import { useWallet } from '../../contexts/wallet'
import { Info } from '@aragon/ui'
import { isOnMainnet, isOnTestnet } from '../../network-config'

import styled from 'styled-components'

export function NetworkIndicator() {
  const { networkType } = useWallet()
  const isMainnet = isOnMainnet(networkType)
  const isTestnet = isOnTestnet(networkType)

  return (
    <div>
      {isMainnet && <StyledInfo>{networkType}</StyledInfo>}
      {isTestnet && <StyledInfo mode="warning">{networkType}</StyledInfo>}
    </div>
  )
}

const StyledInfo = styled(Info)`
  height: 40px;
  display: flex;
  align-items: center;
`
