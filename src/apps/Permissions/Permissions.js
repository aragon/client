import React from 'react'
import styled from 'styled-components'
import {
  AppBar,
  AppView,
  NavigationBar,
  SidePanel,
  Button,
  Badge,
  Text,
  Card,
} from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import AppCard from './AppCard'

class Permissions extends React.Component {
  goToHome = () => {
    this.props.onParamsRequest(null)
  }
  handleOpenApp = proxyAddress => {
    this.props.onParamsRequest(`app.${proxyAddress}`)
  }
  getOpenedApp() {
    const { params } = this.props
    if (!params) return null

    const proxyAddress = params.split('app.')[1]
    if (!proxyAddress) return null

    return this.props.apps.find(app => app.proxyAddress === proxyAddress)
  }
  render() {
    const { apps, appsLoading, params } = this.props
    const openedApp = this.getOpenedApp()
    const navigationItems = ['Permissions']

    if (openedApp) {
      navigationItems.push(
        <span>
          <span style={{ marginRight: '20px' }}>{openedApp.name}</span>
          <Badge.App>
            {openedApp.identifier || shortenAddress(openedApp.proxyAddress)}
          </Badge.App>
        </span>
      )
    }

    return (
      <div>
        <AppView
          appBar={
            <AppBar>
              <NavigationBar items={navigationItems} onBack={this.goToHome} />
            </AppBar>
          }
        >
          {openedApp ? null : (
            <div>
              <Category>
                <h1>Browse by App</h1>
                {appsLoading ? (
                  <EmptyState>Loading apps…</EmptyState>
                ) : (
                  <Apps>
                    {apps.map(app => (
                      <AppCard
                        key={app.appId}
                        app={app}
                        onOpen={this.handleOpenApp}
                      />
                    ))}
                  </Apps>
                )}
              </Category>
              <Category>
                <h1>Browse by entity</h1>
                <EmptyState>No entities found.</EmptyState>
              </Category>
            </div>
          )}
        </AppView>
      </div>
    )
  }
}

const Category = styled.section`
  > h1 {
    margin-bottom: 30px;
    font-weight: 600;
  }
  & + & {
    margin-top: 50px;
  }
`

const Apps = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 25px;
  justify-items: start;
  grid-template-columns: repeat(auto-fill, 160px);
`

const EmptyState = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 180px;
`

export default Permissions
