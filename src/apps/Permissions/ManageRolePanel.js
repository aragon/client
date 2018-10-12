import React from 'react'
import styled from 'styled-components'
import { SidePanel, DropDown, Info, Field, Button, TextInput } from '@aragon/ui'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { isAddress, isEmptyAddress } from '../../web3-utils'
import AppInstanceLabel from './AppInstanceLabel'
import IdentityBadge from '../../components/IdentityBadge'
import EntitySelector from './EntitySelector'

const CREATE_PERMISSION = Symbol('CREATE_PERMISSION')
const NO_UPDATE_ACTION = Symbol('NO_UPDATE_ACTION')
const SET_PERMISSION_MANAGER = Symbol('SET_PERMISSION_MANAGER')
const REMOVE_PERMISSION_MANAGER = Symbol('REMOVE_PERMISSION_MANAGER')

const UPDATE_ACTIONS = new Map([
  [NO_UPDATE_ACTION, { label: 'Select an action', message: null }],
  [
    SET_PERMISSION_MANAGER,
    {
      label: 'Change the role manager',
      message: `
        The new permission manager will be the only account allowed to grant
        or revoke a permission, and to edit the permission manager itself.
      `,
    },
  ],
  [
    REMOVE_PERMISSION_MANAGER,
    {
      label: 'Remove the role manager',
      message: `
        After having removed the role manager, the role will have to be
        initialized again, which is only allowed by the “Create permission”
        role of the ACL app.
      `,
    },
  ],
])

const ACTIONS = new Map([
  ...UPDATE_ACTIONS,
  [
    CREATE_PERMISSION,
    {
      label: null,
      message: `
        The role need to be initialized, which requires to define a manager and
        an entity on which to assign the role first.
      `,
    },
  ],
])

const DEFAULT_STATE = {
  assignEntityIndex: 0,
  assignEntityAddress: '',
  updateAction: NO_UPDATE_ACTION,
  newRoleManagerValue: '',
}

// The role manager panel, wrapped in a PermissionsContext (see end of file)
class ManageRolePanel extends React.PureComponent {
  state = {
    ...DEFAULT_STATE,
  }

  handleUpdateActionChange = index => {
    this.setState({
      updateAction: this.getUpdateAction(index) || null,
    })
  }

  getCurrentAction() {
    const { updateAction } = this.state
    const manager = this.getManager()
    return isEmptyAddress(manager.address) ? CREATE_PERMISSION : updateAction
  }

  getUpdateAction(index) {
    return [...UPDATE_ACTIONS.keys()][index]
  }

  getUpdateActionIndex() {
    const { updateAction } = this.state
    return [...UPDATE_ACTIONS.keys()].indexOf(updateAction)
  }

  getUpdateActionsItems() {
    return [...UPDATE_ACTIONS.values()].map(({ label }) => label)
  }

  getManager() {
    const { getRoleManager, app, role } = this.props
    return getRoleManager(app, role && role.bytes)
  }

  getNamedApps() {
    const { apps } = this.props
    return apps.filter(app => Boolean(app.name))
  }

  getMessage(action) {
    const data = ACTIONS.get(action)
    return (data && data.message) || ''
  }

  // Filter and validate the role manager value. Returns false if invalid.
  filterNewRoleManager(value) {
    const address = (value && value.trim()) || ''
    return isAddress(address) ? address : false
  }

  canSubmit() {
    const { newRoleManagerValue, assignEntityAddress } = this.state
    const action = this.getCurrentAction()

    if (action === REMOVE_PERMISSION_MANAGER) {
      return true
    }

    if (action === SET_PERMISSION_MANAGER) {
      return this.filterNewRoleManager(newRoleManagerValue) !== false
    }

    if (action === CREATE_PERMISSION) {
      if (!isAddress(assignEntityAddress)) {
        return false
      }

      if (isEmptyAddress(assignEntityAddress)) {
        return false
      }

      return this.filterNewRoleManager(newRoleManagerValue) !== false
    }

    return false
  }

  handleSubmit = () => {
    const { newRoleManagerValue, assignEntityAddress } = this.state
    const {
      onClose,
      removePermissionManager,
      setPermissionManager,
      createPermission,
      app,
      role,
    } = this.props

    const action = this.getCurrentAction()

    if (!this.canSubmit()) {
      return
    }

    if (action === REMOVE_PERMISSION_MANAGER) {
      removePermissionManager({
        proxyAddress: app.proxyAddress,
        roleBytes: role.bytes,
      })
    }

    if (action === SET_PERMISSION_MANAGER) {
      setPermissionManager({
        entityAddress: this.filterNewRoleManager(newRoleManagerValue),
        proxyAddress: app.proxyAddress,
        roleBytes: role.bytes,
      })
    }

    if (action === CREATE_PERMISSION) {
      createPermission({
        entityAddress: assignEntityAddress,
        proxyAddress: app.proxyAddress,
        roleBytes: role.bytes,
        manager: this.filterNewRoleManager(newRoleManagerValue),
      })
    }

    onClose()
  }

  handlePanelTransitionEnd = () => {
    if (!this.props.opened) {
      this.setState(DEFAULT_STATE)
    }
  }

  handleNewRoleManagerChange = event => {
    this.setState({ newRoleManagerValue: event.target.value })
  }

  handleEntityChange = ({ index, address }) => {
    this.setState({ assignEntityIndex: index, assignEntityAddress: address })
  }

  renderManager = () => {
    const manager = this.getManager()
    const emptyManager = isEmptyAddress(manager.address)
    if (emptyManager) {
      return 'No manager'
    }
    if (manager.type === 'app') {
      return (
        <AppInstanceLabel app={manager.app} proxyAddress={manager.address} />
      )
    }
    return <IdentityBadge entity={manager.address} />
  }

  render() {
    const { opened, onClose, app, role } = this.props
    const { newRoleManagerValue, assignEntityIndex } = this.state

    const updateActionsItems = this.getUpdateActionsItems()
    const updateActionIndex = this.getUpdateActionIndex()

    const action = this.getCurrentAction()
    const message = this.getMessage(action)

    return (
      <SidePanel
        title={action === CREATE_PERMISSION ? 'Initialize role' : 'Manage role'}
        opened={opened}
        onClose={onClose}
        onTransitionEnd={this.handlePanelTransitionEnd}
      >
        <React.Fragment>
          <Field label="App">
            {app && (
              <AppInstanceLabel
                app={app}
                proxyAddress={app.proxyAddress}
                showIcon={false}
              />
            )}
          </Field>

          <Field label="Role description">{role && role.name}</Field>
          <Field label="Role identifier">{role && role.id}</Field>

          {UPDATE_ACTIONS.has(action) && (
            <React.Fragment>
              <Field label="Role manager">
                <FlexRow>{this.renderManager()}</FlexRow>
              </Field>
              <Field label="Action">
                <DropDown
                  items={updateActionsItems}
                  active={updateActionIndex}
                  onChange={this.handleUpdateActionChange}
                  wide
                />
              </Field>
              {action === SET_PERMISSION_MANAGER && (
                <Field label="New role manager">
                  <TextInput
                    wide
                    placeholder="0xcafe…"
                    onChange={this.handleNewRoleManagerChange}
                    value={newRoleManagerValue}
                  />
                </Field>
              )}
            </React.Fragment>
          )}

          {action === CREATE_PERMISSION && (
            <React.Fragment>
              <Field label="Role manager">
                <TextInput
                  wide
                  placeholder="0xcafe…"
                  onChange={this.handleNewRoleManagerChange}
                  value={newRoleManagerValue}
                />
              </Field>
              <EntitySelector
                label="Assign role to"
                labelCustomAddress="Assign role to"
                apps={this.getNamedApps()}
                onChange={this.handleEntityChange}
                activeIndex={assignEntityIndex}
              />
            </React.Fragment>
          )}

          <Field style={{ paddingTop: '20px' }}>
            <Button
              mode="strong"
              onClick={this.handleSubmit}
              disabled={!this.canSubmit()}
              wide
            >
              {UPDATE_ACTIONS.has(action) ? 'Update role' : 'Initialize role'}
            </Button>
          </Field>

          {message && <Info.Action title="Info">{message}</Info.Action>}
        </React.Fragment>
      </SidePanel>
    )
  }
}

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`

export default props => (
  <PermissionsConsumer>
    {({
      createPermission,
      getRoleManager,
      removePermissionManager,
      setPermissionManager,
    }) => (
      <ManageRolePanel
        {...props}
        {...{
          createPermission,
          getRoleManager,
          removePermissionManager,
          setPermissionManager,
        }}
      />
    )}
  </PermissionsConsumer>
)
