import React from 'react'
import { useWallet } from '../../contexts/wallet'
import { Info, ButtonBase } from '@aragon/ui'
import { isMainnet, isTestnet, getNetworkFullName } from '../../util/network'
import PropTypes from 'prop-types'

import styled from 'styled-components'

NetworkIndicator.propTypes = {
  clickHandler: PropTypes.func.isRequired,
}
// TODO try adding Modal from here
export function NetworkIndicator({ clickHandler }) {
  const { networkType } = useWallet()
  const networkName = getNetworkFullName(networkType)

  return (
    <DisplacedDiv>
      <ButtonBase onClick={clickHandler}>
        {isMainnet(networkType) && <StyledInfo>{networkName}</StyledInfo>}
        {isTestnet(networkType) && (
          <StyledInfo mode="warning">{networkName}</StyledInfo>
        )}
      </ButtonBase>
    </DisplacedDiv>
  )
}

const DisplacedDiv = styled.div`
  margin-right: -24px;
`

const StyledInfo = styled(Info)`
  height: 40px;
  display: flex;
  align-items: center;
`
