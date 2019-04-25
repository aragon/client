import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, useViewport, breakpoint } from '@aragon/ui'
import { AppType, EthereumAddressType } from '../../prop-types'
import { shortenAddress } from '../../web3-utils'
import AppIcon from '../../components/AppIcon/AppIcon'

const AppInstanceLabel = ({ app, proxyAddress, showIcon = true }) => {
  const { above } = useViewport()

  return (
    <Main>
      {above('medium') && showIcon && (
        <div
          css={`
            display: flex;
            align-items: center;
            height: 0;
            margin-right: 10px;
            margin-top: -1px;
          `}
        >
          <AppIcon app={app} />
        </div>
      )}
      <AppName>{app ? app.name : 'Unknown'}</AppName>
      <StyledBadge title={proxyAddress}>
        {(app && app.identifier) || shortenAddress(proxyAddress)}
      </StyledBadge>
    </Main>
  )
}

AppInstanceLabel.propTypes = {
  app: AppType.isRequired,
  proxyAddress: EthereumAddressType.isRequired,
  showIcon: PropTypes.bool,
}

const Main = styled.div`
  margin: auto;

  ${breakpoint(
    'medium',
    `
      display: flex;
      align-items: center;
      text-align: left;
      margin: unset;
    `
  )}
`

const StyledBadge = styled(Badge.App)`
  display: inline-block;

  ${breakpoint(
    'medium',
    `
      display: inline;
    `
  )}
`

const AppName = styled.span`
  display: block;

  ${breakpoint(
    'medium',
    `
      display: inline;
      margin-right: 10px;
    `
  )}
`

export default AppInstanceLabel
