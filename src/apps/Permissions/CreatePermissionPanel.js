import React from 'react'
import { SidePanel, DropDown, Info, Field, Button, TextInput } from '@aragon/ui'
import uniqby from 'lodash.uniqby'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { isAddress } from '../../web3-utils'

const DEFAULT_STATE = {
  assignEntityIndex: 0,
  assignAddressValue: '',
  appIndex: 0,
  roleIndex: 0,
  newRoleValue: '',
  newRoleManagerValue: '',
}

// The permission panel, wrapped in a PermissionsContext (see end of file)
class PermissionPanel extends React.PureComponent {
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
    this.setState({
      roleIndex: index,
      newRoleValue: '',
      newRoleManagerValue: '',
    })
  }

  handleNewRoleChange = event => {
    this.setState({ newRoleValue: event.target.value })
  }

  handleNewRoleManagerChange = event => {
    this.setState({ newRoleManagerValue: event.target.value })
  }

  getNamedApps() {
    const { apps } = this.props
    return apps.filter(app => Boolean(app.name))
  }

  getRoles() {
    const { getAppRoles } = this.props
    const app = this.getSelectedApp()
    const appRoles = app ? getAppRoles(app) : []
    return uniqby(
      appRoles
        .filter(roleData =>
          Boolean(roleData && roleData.role && roleData.role.bytes)
        )
        .map(({ role }) => role),
      role => role.bytes
    )
  }

  appsLabels() {
    return this.getNamedApps().map(app => app.name)
  }

  getAssignEntityItems() {
    return ['Select an entity', ...this.appsLabels(), 'Custom address…']
  }

  getAppsItems() {
    return ['Select an app', ...this.appsLabels()]
  }

  getAppsItems() {
    return ['Select an app', ...this.appsLabels()]
  }

  getRolesItems() {
    const roles = this.getRoles()
    const names = roles.map(role => role.name || '?')
    return ['Select a role', ...names, 'Create a new role (advanced)…']
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

    // -1 for the “select an entity” entry
    const app = this.getNamedApps()[assignEntityIndex - 1]

    const address = app ? app.proxyAddress : null
    return address && address.trim()
  }

  canSubmit(assignEntityItems, rolesItems) {
    const {
      assignEntityIndex,
      assignAddressValue,
      roleIndex,
      newRoleValue,
      newRoleManagerValue,
    } = this.state

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

    // No custom role / role manager set
    if (
      roleIndex === rolesItems.length - 1 &&
      (!newRoleValue.trim() || !isAddress(newRoleManagerValue.trim()))
    ) {
      return false
    }

    return true
  }

  handleSubmit = () => {
    const {
      assignEntityIndex,
      assignAddressValue,
      roleIndex,
      newRoleValue,
      newRoleManagerValue,
    } = this.state

    const { createPermission, grantPermission, onClose } = this.props

    const assignEntityItems = this.getAssignEntityItems()
    const appsItems = this.getAppsItems()

    if (!this.canSubmit(assignEntityItems, appsItems)) {
      return
    }

    const selectedApp = this.getSelectedApp()
    const rolesItems = this.getRolesItems()

    const entityAddress = this.getEntityAddress()
    if (!entityAddress) {
      return
    }

    if (roleIndex === rolesItems.length - 1) {
      console.log('CREATE', {
        entityAddress,
        proxyAddress: selectedApp.proxyAddress,
        roleId: newRoleValue.trim(),
        manager: newRoleManagerValue.trim(),
      })
      createPermission({
        entityAddress,
        proxyAddress: selectedApp.proxyAddress,
        roleId: newRoleValue.trim(),
        manager: newRoleManagerValue.trim(),
      })
      onClose()
      return
    }

    const role = this.getRoles()[roleIndex]
    if (!role) {
      return
    }

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
    const { opened, apps, onClose } = this.props

    const {
      assignEntityIndex,
      assignAddressValue,
      appIndex,
      roleIndex,
      newRoleValue,
      newRoleManagerValue,
    } = this.state

    const assignEntityItems = this.getAssignEntityItems()
    const appsItems = this.getAppsItems()
    const selectedApp = this.getSelectedApp()
    const rolesItems = this.getRolesItems()

    const showAssignAddress = assignEntityIndex === assignEntityItems.length - 1
    const showNewRole = roleIndex === rolesItems.length - 1

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

          {showNewRole && (
            <Field label="New role identifier:">
              <TextInput
                placeholder="ALLOW_SOMETHING_ROLE"
                value={newRoleValue}
                onChange={this.handleNewRoleChange}
                wide
              />
            </Field>
          )}

          {showNewRole && (
            <Field label="New role manager:">
              <TextInput
                placeholder="0xcafe"
                value={newRoleManagerValue}
                onChange={this.handleNewRoleManagerChange}
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

          <AddPermissionInfo />
        </React.Fragment>
      </SidePanel>
    )
  }
}

const AddPermissionInfo = () => (
  <Info.Action title="Adding the permission might create a vote">
    If the permission is created by the Voting app, it will automatically
    generate a new vote.
  </Info.Action>
)

export default props => (
  <PermissionsConsumer>
    {({ getAppRoles, createPermission, grantPermission }) => (
      <PermissionPanel
        {...props}
        {...{ getAppRoles, createPermission, grantPermission }}
      />
    )}
  </PermissionsConsumer>
)
