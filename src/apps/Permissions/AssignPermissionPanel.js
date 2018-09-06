import React from 'react'
import { SidePanel, DropDown, Info, Field, Button, TextInput } from '@aragon/ui'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { getAnyAddress } from '../../aragonos-utils'
import { isAddress } from '../../web3-utils'
import AppInstanceLabel from './AppInstanceLabel'

const DEFAULT_STATE = {
  assignEntityIndex: 0,
  assignAddressValue: '',
  appIndex: 0,
  roleIndex: 0,
}

// The permission panel, wrapped in a PermissionsContext (see end of file)
class AssignPermissionPanel extends React.PureComponent {
  state = {
    ...DEFAULT_STATE,
  }

  handleAssignEntityChange = index => {
    this.setState({ assignEntityIndex: index, assignAddressValue: '' })
  }

  handleAssignAddressChange = event => {
    this.setState({ assignAddressValue: event.target.value })
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

  getAssignEntityItems() {
    return [
      'Select an entity',
      ...this.appsLabels(),
      'Any account',
      'Custom address…',
    ]
  }

  getAppsItems() {
    return ['Select an app', ...this.appsLabels()]
  }

  getRolesItems() {
    const roles = this.getRoles()
    const names = roles.map(role => role.name || '?')
    return ['Select a role', ...names]
  }

  getSelectedApp() {
    // -1 for the “select an app” entry
    return this.getNamedApps()[this.state.appIndex - 1]
  }

  // Get the address of the selected entity
  getEntityAddress() {
    const { assignEntityIndex, assignAddressValue } = this.state
    const items = this.getAssignEntityItems()

    // custom address
    if (assignEntityIndex === items.length - 1) {
      return assignAddressValue.trim()
    }

    // any account
    if (assignEntityIndex === items.length - 2) {
      return getAnyAddress()
    }

    // app proxy address (in the menu, apps have two entries above them)
    const app = this.getNamedApps()[assignEntityIndex - 1]

    const address = app ? app.proxyAddress : null
    return address && address.trim()
  }

  canSubmit(assignEntityItems, rolesItems) {
    const { assignEntityIndex, assignAddressValue, roleIndex } = this.state

    // No entity selected
    if (assignEntityIndex === 0) {
      return false
    }

    // No custom address set
    if (
      assignEntityIndex === assignEntityItems.length - 1 &&
      !isAddress(assignAddressValue.trim())
    ) {
      return false
    }

    // No role selected
    if (roleIndex === 0) {
      return false
    }

    return true
  }

  handleSubmit = () => {
    const { roleIndex } = this.state

    const {
      // createPermission,
      grantPermission,
      onClose,
    } = this.props

    const assignEntityItems = this.getAssignEntityItems()
    const appsItems = this.getAppsItems()

    if (!this.canSubmit(assignEntityItems, appsItems)) {
      return
    }

    const selectedApp = this.getSelectedApp()
    // const rolesItems = this.getRolesItems()

    const entityAddress = this.getEntityAddress()
    if (!entityAddress) {
      return
    }

    // if (roleIndex === rolesItems.length - 1) {
    //   console.log('CREATE', {
    //     entityAddress,
    //     proxyAddress: selectedApp.proxyAddress,
    //     roleId: newRoleValue.trim(),
    //     manager: newRoleManagerValue.trim(),
    //   })
    //   createPermission({
    //     entityAddress,
    //     proxyAddress: selectedApp.proxyAddress,
    //     roleId: newRoleValue.trim(),
    //     manager: newRoleManagerValue.trim(),
    //   })
    //   onClose()
    //   return
    // }

    const role = this.getRoles()[roleIndex - 1]
    if (!role) {
      return
    }

    console.log(
      `grantPermission(${{
        entityAddress,
        proxyAddress: selectedApp.proxyAddress,
        roleBytes: role.bytes,
      }})`
    )
    grantPermission({
      entityAddress,
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

  close = () => {
    this.props.onClose()
  }

  render() {
    const { opened, onClose } = this.props

    const {
      assignEntityIndex,
      assignAddressValue,
      appIndex,
      roleIndex,
    } = this.state

    const assignEntityItems = this.getAssignEntityItems()
    const appsItems = this.getAppsItems()
    const selectedApp = this.getSelectedApp()
    const rolesItems = this.getRolesItems()

    const showAssignAddress = assignEntityIndex === assignEntityItems.length - 1

    return (
      <SidePanel
        title={'Add permission'}
        opened={opened}
        onClose={onClose}
        onTransitionEnd={this.handlePanelTransitionEnd}
      >
        <React.Fragment>
          <Field label="Assign role to">
            <DropDown
              items={assignEntityItems}
              active={assignEntityIndex}
              onChange={this.handleAssignEntityChange}
              wide
            />
          </Field>

          {showAssignAddress && (
            <Field label="Assign role to address">
              <TextInput
                placeholder="0xcafe"
                value={assignAddressValue}
                onChange={this.handleAssignAddressChange}
                wide
              />
            </Field>
          )}

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
              disabled={!this.canSubmit(assignEntityItems, rolesItems)}
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
