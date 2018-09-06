import React from 'react'
import styled from 'styled-components'
import { AppBar, AppView, NavigationBar, Button } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import Screen from './Screen'
import Home from './Home/Home'
import AppPermissions from './AppPermissions'
import EntityPermissions from './EntityPermissions'
import NavigationItem from './NavigationItem'
import AssignPermissionPanel from './AssignPermissionPanel'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'

class Permissions extends React.Component {
  state = {
    // Only animate screens after the component is rendered once
    animateScreens: false,
    showAssignPermissionPanel: false,
  }

  componentDidMount() {
    this.setState({ animateScreens: true })
  }

  componentDidUpdate(prevProps) {
    const prevScreen = this.getLocation(prevProps.params).screen
    const screen = this.getLocation(this.props.params).screen
    if (prevScreen !== screen) {
      this._scrollTopElement.scrollIntoView()
    }
  }

  getLocation(params) {
    const home = { screen: 'home' }

    if (!params) {
      return home
    }

    // Note: `data` can not include the character ".".
    // If it becomes needed, a regex could be used instead of `split()`.
    const [screen, data = null] = params.split('.')

    if (screen === 'app') {
      return {
        screen,
        address: data,
        app: this.getAppByProxyAddress(data),
      }
    }

    if (screen === 'entity') {
      return { screen, address: data }
    }

    return home
  }

  getAppByProxyAddress(proxyAddress) {
    if (!proxyAddress) {
      return null
    }
    return this.props.apps.find(app => app.proxyAddress === proxyAddress)
  }

  goToHome = () => {
    this.props.onParamsRequest(null)
  }

  handleOpenApp = proxyAddress => {
    this.props.onParamsRequest(`app.${proxyAddress}`)
  }

  handleOpenEntity = address => {
    if (this.getAppByProxyAddress(address)) {
      return this.handleOpenApp(address)
    }
    this.props.onParamsRequest(`entity.${address}`)
  }

  createPermission = () => {
    this.setState({ showAssignPermissionPanel: true })
  }

  closePanel = () => {
    this.setState({ showAssignPermissionPanel: false })
  }

  // Assemble the navigation items
  getNavigationItems(location, resolveEntity) {
    const items = ['Permissions']
    const openedApp = location.screen === 'app' ? location.app : null
    const openedEntityAddress =
      location.screen === 'entity' ? location.address : null

    if (location.screen === 'app') {
      return [
        ...items,
        <NavigationItem
          title={openedApp ? openedApp.name || 'Unknown app' : 'Permissions'}
          badge={{
            label:
              (openedApp && openedApp.identifier) ||
              shortenAddress(location.address),
          }}
        />,
      ]
    }

    const entity = resolveEntity && resolveEntity(openedEntityAddress)

    if (entity && entity.type === 'app') {
      return [
        ...items,
        <NavigationItem
          title="Entity permissions"
          badge={{
            label: entity.app.identifier || shortenAddress(location.address),
          }}
        />,
      ]
    }

    if (openedEntityAddress) {
      return [
        ...items,
        <NavigationItem
          title="Entity permissions"
          address={openedEntityAddress}
          entity={entity}
        />,
      ]
    }

    return items
  }

  render() {
    const { apps, appsLoading, permissionsLoading, params } = this.props
    const { showAssignPermissionPanel, animateScreens } = this.state

    const location = this.getLocation(params)

    return (
      <PermissionsConsumer>
        {({ resolveEntity }) => {
          const navigationItems = this.getNavigationItems(
            location,
            resolveEntity
          )

          return (
            <React.Fragment>
              <AppView
                appBar={
                  <AppBar
                    endContent={
                      <Button
                        mode="strong"
                        onClick={this.createPermission}
                        disabled={appsLoading || permissionsLoading}
                      >
                        Add permission
                      </Button>
                    }
                  >
                    <NavigationBar
                      items={navigationItems}
                      onBack={this.goToHome}
                    />
                  </AppBar>
                }
              >
                <ScrollTopElement
                  innerRef={el => {
                    this._scrollTopElement = el
                  }}
                />

                <Screen position={0} animate={animateScreens}>
                  {location.screen === 'home' && (
                    <Home
                      apps={apps}
                      appsLoading={appsLoading}
                      permissionsLoading={permissionsLoading}
                      onOpenApp={this.handleOpenApp}
                      onOpenEntity={this.handleOpenEntity}
                    />
                  )}
                </Screen>

                <Screen position={1} animate={animateScreens}>
                  {['app', 'entity'].includes(location.screen) && (
                    <React.Fragment>
                      {location.screen === 'app' && (
                        <AppPermissions
                          app={location.app}
                          loading={appsLoading}
                          address={location.address}
                        />
                      )}
                      {location.screen === 'entity' && (
                        <EntityPermissions
                          title="Permissions granted"
                          loading={appsLoading || permissionsLoading}
                          address={location.address}
                        />
                      )}
                    </React.Fragment>
                  )}
                </Screen>
              </AppView>

              <AssignPermissionPanel
                apps={apps}
                opened={showAssignPermissionPanel}
                onClose={this.closePanel}
              />
            </React.Fragment>
          )
        }}
      </PermissionsConsumer>
    )
  }
}

// This element is only used to reset the view scroll using scrollIntoView()
const ScrollTopElement = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
`

export default Permissions
