import React from 'react'
import styled from 'styled-components'
import { Badge } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import AppIcon from './AppIcon'
import AppIconKernel from './AppIconKernel'

class AppInstanceLabel extends React.PureComponent {
  renderIcon() {
    const { app, coreRole } = this.props
    if (coreRole) {
      return (
        <Icon>
          <AppIconKernel />
        </Icon>
      )
    }
    if (app && app.baseUrl) {
      return (
        <Icon>
          <AppIcon app={app} />
        </Icon>
      )
    }
    return null
  }
  render() {
    const { app, proxyAddress, coreRole } = this.props
    return (
      <Main>
        {this.renderIcon()}
        <AppName>
          {coreRole ? coreRole.appName : (app && app.name) || 'Unknown'}
        </AppName>
        <Badge.App title={proxyAddress}>
          {(app && app.identifier) || shortenAddress(proxyAddress)}
        </Badge.App>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const AppName = styled.span`
  margin-right: 10px;
`

const Icon = styled.span`
  margin-right: 10px;
`

export default AppInstanceLabel
