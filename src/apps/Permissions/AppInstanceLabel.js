import React from 'react'
import styled from 'styled-components'
import { Badge } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'

class AppInstanceLabel extends React.PureComponent {
  render() {
    const { app, proxyAddress } = this.props
    return (
      <Main>
        <AppName>{(app && app.name) || 'Unknown'}</AppName>
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

const AppName = styled.span`
  margin-right: 10px;
`

export default AppInstanceLabel
