import React from 'react'
import { useWallet } from '../../contexts/wallet'
import { Info, ButtonBase } from '@aragon/ui'
import { isOnMainnet, isOnTestnet } from '../../network-config'
import PropTypes from 'prop-types'

import styled from 'styled-components'

NetworkIndicator.propTypes = {
  clickHandler: PropTypes.func.isRequired,
}

export function NetworkIndicator({ clickHandler }) {
  const { networkType } = useWallet()
  const isMainnet = isOnMainnet(networkType)
  const isTestnet = isOnTestnet(networkType)

  return (
    <div>
      <ButtonBase onClick={clickHandler}>
        {isMainnet && <StyledInfo>{networkType}</StyledInfo>}
        {isTestnet && <StyledInfo mode="warning">{networkType}</StyledInfo>}
      </ButtonBase>
    </div>
  )
}

const StyledInfo = styled(Info)`
  height: 40px;
  display: flex;
  align-items: center;
`
