import React from 'react'
import { useWallet } from '../../contexts/wallet'
import { Info, ButtonBase } from '@aragon/ui'
import { isOnMainnet, isOnTestnet, networkConfigs } from '../../network-config'
import PropTypes from 'prop-types'

import styled from 'styled-components'

NetworkIndicator.propTypes = {
  clickHandler: PropTypes.func.isRequired,
}
// TODO try adding Modal from here
export function NetworkIndicator({ clickHandler }) {
  const { networkType } = useWallet()
  const networkName = getNetworkName(networkType)

  const isMainnet = isOnMainnet(networkType)
  const isTestnet = isOnTestnet(networkType)

  return (
    <div>
      <ButtonBase onClick={clickHandler}>
        {isMainnet && <StyledInfo>{networkName}</StyledInfo>}
        {isTestnet && <StyledInfo mode="warning">{networkName}</StyledInfo>}
      </ButtonBase>
    </div>
  )
}

const StyledInfo = styled(Info)`
  height: 40px;
  display: flex;
  align-items: center;
`
