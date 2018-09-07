import React from 'react'
import { SidePanel, DropDown, Info, Field, Button } from '@aragon/ui'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { isAddress, isEmptyAddress } from '../../web3-utils'
import AppInstanceLabel from './AppInstanceLabel'
import EntitySelector from './EntitySelector'

const DEFAULT_STATE = {
  assignEntityIndex: 0,
  assignEntityAddress: '',
  appIndex: 0,
  roleIndex: 0,
}

// The permission panel, wrapped in a PermissionsContext (see end of file)
class AssignPermissionPanel extends React.PureComponent {
  state = {
    ...DEFAULT_STATE,
  }

  handleAppChange = index => {
    this.setState({ appIndex: index, roleIndex: 0 })
  }

  handleRoleChange = index => {
    this.setState({ roleIndex: index })
  }

  getNamedApps() {
    const { apps } = this.props
    return apps.filter(app => Boolean(app.name))
  }

  getRoles() {
    const { getAppRoles } = this.props
    const app = this.getSelectedApp()
    const appRoles = app ? getAppRoles(app) : []
    return appRoles.map(({ role }) => role)
  }

  appsLabels() {
    return this.getNamedApps().map(app => (
      <AppInstanceLabel app={app} proxyAddress={app.proxyAddress} />
    ))
  }

  getAppsItems() {
    return ['Select an app', ...this.appsLabels()]
  }

  getRolesItems() {
    const roles = this.getRoles()
    const names = roles.map(
      role =>
        (role && role.name) || `Unknown role (${(role && role.id) || 'no ID'})`
    )
    return ['Select a role', ...names]
  }

  getSelectedApp() {
    // -1 for the “select an app” entry
    return this.getNamedApps()[this.state.appIndex - 1]
  }

  canSubmit() {
    const { assignEntityAddress, roleIndex } = this.state

    if (!isAddress(assignEntityAddress)) {
      return false
    }

    if (isEmptyAddress(assignEntityAddress)) {
      return false
    }

    // No role selected
    if (roleIndex === 0) {
      return false
    }

    return true
  }

  handleSubmit = () => {
    const { roleIndex, assignEntityAddress } = this.state
    const { grantPermission, onClose } = this.props

    if (!this.canSubmit()) {
      return
    }

    const selectedApp = this.getSelectedApp()
    // const rolesItems = this.getRolesItems()

    const role = this.getRoles()[roleIndex - 1]
    if (!role) {
      return
    }

    grantPermission({
      entityAddress: assignEntityAddress,
      proxyAddress: selectedApp.proxyAddress,
      roleBytes: role.bytes,
    })

    onClose()
  }

  handlePanelTransitionEnd = () => {
    if (!this.props.opened) {
      this.setState(DEFAULT_STATE)
    }
  }

  handleEntityChange = ({ index, address }) => {
    this.setState({ assignEntityIndex: index, assignEntityAddress: address })
  }

  render() {
    const { opened, onClose } = this.props
    const { assignEntityIndex, appIndex, roleIndex } = this.state

    const appsItems = this.getAppsItems()
    const selectedApp = this.getSelectedApp()
    const rolesItems = this.getRolesItems()

    return (
      <SidePanel
        title={'Add permission'}
        opened={opened}
        onClose={onClose}
        onTransitionEnd={this.handlePanelTransitionEnd}
      >
        <React.Fragment>
          <EntitySelector
            label="Assign role to"
            labelCustomAddress="Assign role to"
            apps={this.getNamedApps()}
            onChange={this.handleEntityChange}
            activeIndex={assignEntityIndex}
          />

          <Field label="On app">
            <DropDown
              items={appsItems}
              active={appIndex}
              onChange={this.handleAppChange}
              wide
            />
          </Field>

          {selectedApp && (
            <Field label="Role:">
              <DropDown
                items={rolesItems}
                active={roleIndex}
                onChange={this.handleRoleChange}
                wide
              />
            </Field>
          )}

          <Field style={{ paddingTop: '20px' }}>
            <Button
              mode="strong"
              onClick={this.handleSubmit}
              disabled={!this.canSubmit()}
              wide
            >
              {'Add permission'}
            </Button>
          </Field>

          <Info.Action title="Adding the permission might create a vote">
            If the permission is created by the Voting app, it will
            automatically generate a new vote.
          </Info.Action>
        </React.Fragment>
      </SidePanel>
    )
  }
}

export default props => (
  <PermissionsConsumer>
    {({ getAppRoles, createPermission, grantPermission }) => (
      <AssignPermissionPanel
        {...props}
        {...{ getAppRoles, createPermission, grantPermission }}
      />
    )}
  </PermissionsConsumer>
)
