import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { AppType } from '../../prop-types'
import { AppBar, AppView, NavigationBar, Viewport, font } from '@aragon/ui'
import { addressesEqual, shortenAddress, isAddress } from '../../web3-utils'
import Screen from './Screen'
import Home from './Home/Home'
import AppPermissions from './AppPermissions'
import EntityPermissions from './EntityPermissions'
import NavigationItem from './NavigationItem'
import AssignPermissionPanel from './AssignPermissionPanel'
import ManageRolePanel from './ManageRolePanel'
import AddPermissionButton from './AddPermissionButton'
import MenuButton from '../../components/MenuPanel/MenuButton'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'

class Permissions extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
    appsLoading: PropTypes.bool.isRequired,
    onMessage: PropTypes.func.isRequired,
    onParamsRequest: PropTypes.func.isRequired,
    params: PropTypes.string,
    permissionsLoading: PropTypes.bool.isRequired,
  }

  state = {
    // Only animate screens after the component is rendered once
    animateScreens: false,
    showAssignPermissionPanel: false,
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ animateScreens: true })
    }, 0)
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

    // Not using "/" as a separator because
    // it would get encoded by encodeURIComponent().
    const [
      screen,
      data = null,
      secondaryScreen = null,
      secondaryData = null,
    ] = params.split('.')

    if (screen === 'app' && isAddress(data)) {
      return {
        screen,
        address: data,
        app: this.getAppByProxyAddress(data),
        secondaryScreen,
        secondaryData,
      }
    }

    if (screen === 'entity' && isAddress(data)) {
      return { screen, address: data }
    }

    return home
  }

  getAppByProxyAddress(proxyAddress) {
    if (!proxyAddress) {
      return null
    }
    return this.props.apps.find(app =>
      addressesEqual(app.proxyAddress, proxyAddress)
    )
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

  handleManageRole = (proxyAddress, roleBytes) => {
    this.props.onParamsRequest(`app.${proxyAddress}.role.${roleBytes}`)
  }

  createPermission = () => {
    this.setState({ showAssignPermissionPanel: true })
  }

  closeAssignPermissionPanel = () => {
    this.setState({ showAssignPermissionPanel: false })
  }

  closeManageRolePanel = () => {
    const { params, onParamsRequest } = this.props
    const location = this.getLocation(params)
    const openedApp = location.screen === 'app' ? location.app : null
    if (openedApp) {
      onParamsRequest(`app.${openedApp.proxyAddress}`)
    }
  }

  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app', name: 'menuPanel', value: true },
    })
  }

  // Assemble the navigation items
  getNavigationItems(location, resolveEntity) {
    const items = [
      <React.Fragment>
        <Viewport>
          {({ below }) =>
            below('medium') && (
              <StyledMenuButton
                onClick={this.handleMenuPanelOpen}
                label="Menu"
              />
            )
          }
        </Viewport>
        <Title>Permissions</Title>
      </React.Fragment>,
    ]
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
        {({ resolveEntity, resolveRole, permissions }) => {
          const navigationItems = this.getNavigationItems(
            location,
            resolveEntity
          )

          const managedRole =
            location.screen === 'app' &&
            location.app &&
            location.secondaryScreen === 'role'
              ? resolveRole(location.app.proxyAddress, location.secondaryData)
              : null

          return (
            <Viewport>
              {({ below }) => (
                <React.Fragment>
                  <AppView
                    appBar={
                      <AppBar
                        padding={below('medium') ? 0 : 10}
                        endContent={
                          <AddPermissionButton
                            label="Add permission"
                            onClick={this.createPermission}
                            disabled={appsLoading || permissionsLoading}
                          />
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
                      ref={el => {
                        this._scrollTopElement = el
                      }}
                    />

                    <Wrap>
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
                                onManageRole={this.handleManageRole}
                              />
                            )}
                            {location.screen === 'entity' && (
                              <EntityPermissions
                                title="Permissions granted to this entity"
                                loading={appsLoading || permissionsLoading}
                                address={location.address}
                              />
                            )}
                          </React.Fragment>
                        )}
                      </Screen>
                    </Wrap>
                  </AppView>

                  <AssignPermissionPanel
                    apps={apps}
                    opened={showAssignPermissionPanel}
                    onClose={this.closeAssignPermissionPanel}
                  />

                  <ManageRolePanel
                    app={location.app}
                    apps={apps}
                    opened={managedRole !== null}
                    onClose={this.closeManageRolePanel}
                    role={managedRole}
                  />
                </React.Fragment>
              )}
            </Viewport>
          )
        }}
      </PermissionsConsumer>
    )
  }
}

const StyledMenuButton = styled(MenuButton)`
  height: 64px;
`

const Wrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflowx: hidden;
  min-width: 320px;
`

const Title = styled.span`
  display: inline-block;
  ${font({ size: 'xxlarge' })};
`

// This element is only used to reset the view scroll using scrollIntoView()
const ScrollTopElement = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
`

export default Permissions
