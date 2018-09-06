import React from 'react'
import styled from 'styled-components'
import { Badge } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import AppIcon from './AppIcon'

class AppInstanceLabel extends React.PureComponent {
  render() {
    const { app, proxyAddress } = this.props
    return (
      <Main>
        <AppIconInRow app={app} />
        <AppName>{app ? app.name : 'Unknown'}</AppName>
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
`

const AppIconInRow = styled(AppIcon)`
  height: 0;
  margin-right: 10px;
  margin-top: -1px;
`

const AppName = styled.span`
  margin-right: 10px;
`

export default AppInstanceLabel
