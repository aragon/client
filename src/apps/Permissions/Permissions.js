import React from 'react'
import styled from 'styled-components'
import { AppBar, AppView, NavigationBar, Button } from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import Screen from './Screen'
import Home from './Home/Home'
import AppPermissions from './AppPermissions'
import EntityPermissions from './EntityPermissions'
import NavigationItem from './NavigationItem'
import PermissionPanel from './PermissionPanel'

class Permissions extends React.Component {
  state = {
    // Only animate screens after the component is rendered once
    animateScreens: false,

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
    this.setState({ showPermissionPanel: true, editPermission: true })
  }

  editPermission = permissionId => {
    // const { appPermissions } = permissionsDemo
    // const permission = appPermissions.find(p => p.permissionId === permissionId)
    // this.setState({ showPermissionPanel: true, editPermission: permission })
  }

  revokePermission = async ({ entityAddress, proxyAddress, role }) => {
    const { acl, /* walletWeb3, */ account } = this.props

    const contract = acl.contract
    // const contract = new walletWeb3.eth.Contract(
    //   acl.contract.options.jsonInterface,
    //   acl.address
    // )

    // contract.methods
    //   .revokePermission(entityAddress, proxyAddress, role.bytes)
    //   .send({ from: account })

    const { wrapper } = this.props

    const transaction = await wrapper.performACLIntent('revokePermission', [
      entityAddress,
      proxyAddress,
      role.bytes,
    ])

    // console.log(paths, 'revokePermission', [
    //   entityAddress,
    //   proxyAddress,
    //   role.bytes,
    // ])
  }

  closePermissionPanel = () => {
    this.setState({ showPermissionPanel: false })
  }

  // Assemble the navigation items
  getNavigationItems(location) {
    const { resolveEntity, daoAddress } = this.props
    const items = ['Permissions']
    const openedApp = location.screen === 'app' ? location.app : null
    const openedEntityAddress =
      location.screen === 'entity' ? location.address : null

    if (location.screen === 'app') {
      return [
        ...items,
        <NavigationItem
          title={openedApp ? openedApp.name : 'Permissions'}
          badge={{
            label:
              (openedApp && openedApp.identifier) ||
              shortenAddress(location.address),
          }}
        />,
      ]
    }

    const entity =
      resolveEntity && resolveEntity(openedEntityAddress, daoAddress)

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
    const {
      apps,
      appsLoading,
      permissions,
      permissionsLoading,
      params,
      daoAddress,
      resolveEntity,
      resolveRole,
    } = this.props
    const { editPermission, showPermissionPanel, animateScreens } = this.state

    const location = this.getLocation(params)
    const navigationItems = this.getNavigationItems(location)

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
              <NavigationBar items={navigationItems} onBack={this.goToHome} />
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
                permissions={permissions}
                permissionsLoading={permissionsLoading}
                onOpenApp={this.handleOpenApp}
                onOpenEntity={this.handleOpenEntity}
                daoAddress={daoAddress}
                resolveEntity={resolveEntity}
                resolveRole={resolveRole}
              />
            )}
          </Screen>

          <Screen position={1} animate={animateScreens}>
            {['app', 'entity'].includes(location.screen) && (
              <React.Fragment>
                {location.screen === 'app' && (
                  <AppPermissions
                    loading={appsLoading}
                    app={location.app}
                    address={location.address}
                    permissions={permissions}
                    onRevoke={this.revokePermission}
                    daoAddress={daoAddress}
                    resolveRole={resolveRole}
                    resolveEntity={resolveEntity}
                  />
                )}
                {location.screen === 'entity' && (
                  <EntityPermissions
                    loading={appsLoading || permissionsLoading}
                    address={location.address}
                    permissions={permissions}
                    onRevoke={this.revokePermission}
                    daoAddress={daoAddress}
                    resolveRole={resolveRole}
                    resolveEntity={resolveEntity}
                  />
                )}
              </React.Fragment>
            )}
          </Screen>
        </AppView>

        <PermissionPanel
          opened={showPermissionPanel}
          permission={editPermission}
          onClose={this.closePermissionPanel}
        />
      </React.Fragment>
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
