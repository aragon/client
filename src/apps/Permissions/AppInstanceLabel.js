import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, BreakPoint, breakpoint } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import AppIcon from './AppIcon'
import { EthereumAddress } from '../../prop-types'

class AppInstanceLabel extends React.PureComponent {
  static propTypes = {
    app: PropTypes.object.isRequired,
    proxyAddress: EthereumAddress.isRequired,
    showIcon: PropTypes.bool,
  }

  render() {
    const { app, proxyAddress, showIcon = true } = this.props
    return (
      <Main>
        <BreakPoint from="medium">
          {showIcon && <AppIconInRow app={app} />}
        </BreakPoint>
        <AppName>{app ? app.name : 'Unknown'}</AppName>
        <StyledBadge title={proxyAddress}>
          {(app && app.identifier) || shortenAddress(proxyAddress)}
        </StyledBadge>
      </Main>
    )
  }
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

const AppIconInRow = styled(AppIcon)`
  height: 0;
  margin-right: 10px;
  margin-top: -1px;
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
