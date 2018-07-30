import React from 'react'
import styled from 'styled-components'
import { AppBar, AppView, NavigationBar, Button, springs } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import debounce from 'lodash.debounce'
import { shortenAddress } from '../../web3-utils'
import { permissions } from '../../demo-state'
import Screen from './Screen'
import Home from './Home/Home'
import PermissionsList from './PermissionsList/PermissionsList'
import NavigationItem from './NavigationItem'
import PermissionPanel from './PermissionPanel'

class Permissions extends React.Component {
  state = {
    permissions,

    // editPermission can be set to:
    //
    //   - `null` (no edition)
    //   - `true` (new)
    //   - a permission object (edit)
    //
    editPermission: null,

    // We use a separate property than `editPermission` to display the panel,
    // in order to keep displaying the content during the close animation.
    showPermissionPanel: false,
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

    if (params.startsWith('app.')) {
      return {
        screen: 'app',
        app: this.getAppByProxyAddress(params.split('app.')[1]),
      }
    }
    if (params.startsWith('entity.')) {
      return {
        screen: 'entity',
        address: params.split('entity.')[1] || null,
      }
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
    this.props.onParamsRequest(`entity.${address}`)
  }

  createPermission = () => {
    this.setState({ showPermissionPanel: true, editPermission: true })
  }

  editPermission = permissionId => {
    const { appPermissions } = this.state.permissions
    const permission = appPermissions.find(p => p.permissionId === permissionId)
    this.setState({ showPermissionPanel: true, editPermission: permission })
  }

  closePermissionPanel = () => {
    this.setState({ showPermissionPanel: false })
  }

  render() {
    const { apps, appsLoading, params } = this.props
    const { permissions, editPermission, showPermissionPanel } = this.state

    const location = this.getLocation(params)

    const openedApp = location.screen === 'app' ? location.app : null
    const openedEntityAddress =
      location.screen === 'entity' ? location.address : null

    // Assemble the navigation items
    const navigationItems = [
      'Permissions',

      // Opened app
      openedApp && (
        <NavigationItem
          title={openedApp.name}
          badge={{
            label:
              openedApp.identifier || shortenAddress(openedApp.proxyAddress),
          }}
        />
      ),

      // Opened entity
      openedEntityAddress && (
        <NavigationItem
          title="Entity permissions"
          badge={{
            label: shortenAddress(openedEntityAddress),
            title: openedEntityAddress,
          }}
        />
      ),
    ].filter(Boolean) // remove the `undefined` entries

    return (
      <div>
        <AppView
          appBar={
            <AppBar
              endContent={
                <Button mode="strong" onClick={this.createPermission}>
                  Add permission
                </Button>
              }
            >
              <NavigationBar items={navigationItems} onBack={this.goToHome} />
            </AppBar>
          }
        >
          <ScrollTopElement
            innerRef={el => {
              this._scrollTopElement = el
            }}
          />

          <Screen position={0}>
            {location.screen === 'home' && (
              <Home
                apps={apps}
                appsLoading={appsLoading}
                onOpenApp={this.handleOpenApp}
                onOpenEntity={this.handleOpenEntity}
                permissions={permissions}
              />
            )}
          </Screen>

          <Screen position={1}>
            {['entity', 'app'].includes(location.screen) && (
              <PermissionsList
                appsLoading={appsLoading}
                permissions={permissions.appPermissions}
                onEdit={this.editPermission}
              />
            )}
          </Screen>
        </AppView>

        <PermissionPanel
          opened={showPermissionPanel}
          permission={editPermission}
          onClose={this.closePermissionPanel}
        />
      </div>
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
