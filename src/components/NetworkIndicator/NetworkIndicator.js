import React from 'react'
import { useWallet } from '../../contexts/wallet'
import { Info, ButtonBase, GU } from '@aragon/ui'
import { isMainnet, isTestnet, getNetworkShortName } from '../../util/network'
import PropTypes from 'prop-types'

import styled from 'styled-components'

NetworkIndicator.propTypes = {
  clickHandler: PropTypes.func.isRequired,
}
// TODO try adding Modal from here
export function NetworkIndicator({ clickHandler }) {
  const { networkType, status } = useWallet()
  const networkName = getNetworkShortName(networkType)

  if (status === 'connected') {
    return null
  }

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
  margin-right: -${3 * GU}px;
`

const StyledInfo = styled(Info)`
  height: 40px;
  display: flex;
  align-items: center;
  padding-right: ${3 * GU}px;
`
