import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  SidePanel,
  DropDown,
  Info,
  Field,
  Button,
  breakpoint,
} from '@aragon/ui'
import CustomLabelIdentityBadge from '../../components/CustomLabelIdentityBadge/CustomLabelIdentityBadge'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { isBurnEntity } from '../../permissions'
import { AppType } from '../../prop-types'
import { isAddress, isEmptyAddress } from '../../web3-utils'
import AppInstanceLabel from './AppInstanceLabel'
import EntitySelector from './EntitySelector'

const CREATE_PERMISSION = Symbol('CREATE_PERMISSION')
const VIEW_PERMISSION = Symbol('VIEW_PERMISSION')
const NO_UPDATE_ACTION = Symbol('NO_UPDATE_ACTION')
const SET_PERMISSION_MANAGER = Symbol('SET_PERMISSION_MANAGER')
const REMOVE_PERMISSION_MANAGER = Symbol('REMOVE_PERMISSION_MANAGER')

const UPDATE_ACTIONS = new Map([
  [NO_UPDATE_ACTION, { label: 'Select an action', message: null }],
  [
    SET_PERMISSION_MANAGER,
    {
      label: 'Change the manager',
      message: `
        The new manager will be the only entity allowed to grant or revoke
        the permission, and make further changes to the manager.
      `,
    },
  ],
  [
    REMOVE_PERMISSION_MANAGER,
    {
      label: 'Remove the manager',
      message: `
        After having removed its manager, the permission can only be granted or
        revoked if it is initialized again (requiring the “Create permission”
        action on the ACL app).
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
        As part of the initialization process for a permission, a manager must
        also be set. Be careful with this setting: the manager is the only
        entity afterwards who can grant or revoke this permisison!
      `,
    },
  ],
  [
    VIEW_PERMISSION,
    {
      label: null,
      message: `
        This permission's manager has been discarded to an unrecoverable address.
        No further management actions can be taken on the permission, making it
        effectively frozen.
      `,
    },
  ],
])

const DEFAULT_STATE = {
  assignEntityIndex: 0,
  assignEntityAddress: '',
  updateAction: NO_UPDATE_ACTION,
  assignManagerIndex: 0,
  newRoleManagerValue: '',
}

// The role manager panel, wrapped in a PermissionsContext (see end of file)
class ManageRolePanel extends React.PureComponent {
  static propTypes = {
    app: AppType,
    apps: PropTypes.arrayOf(AppType).isRequired,
    createPermission: PropTypes.func.isRequired,
    getRoleManager: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    opened: PropTypes.bool.isRequired,
    removePermissionManager: PropTypes.func.isRequired,
    role: PropTypes.object,
    setPermissionManager: PropTypes.func.isRequired,
  }

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
    return isEmptyAddress(manager.address)
      ? CREATE_PERMISSION
      : isBurnEntity(manager.address)
      ? VIEW_PERMISSION
      : updateAction
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
      app,
      onClose,
      createPermission,
      removePermissionManager,
      setPermissionManager,
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

  handleRoleManagerChange = ({ index, address }) => {
    this.setState({ assignManagerIndex: index, newRoleManagerValue: address })
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
    return (
      <CustomLabelIdentityBadge
        address={manager.address}
        entity={manager.type === 'burn' ? 'Discarded' : manager.address}
      />
    )
  }

  render() {
    const { opened, onClose, app, role } = this.props
    const { assignManagerIndex, assignEntityIndex } = this.state

    const updateActionsItems = this.getUpdateActionsItems()
    const updateActionIndex = this.getUpdateActionIndex()

    const action = this.getCurrentAction()
    const isUpdateAction = UPDATE_ACTIONS.has(action)
    const message = this.getMessage(action)

    return (
      <SidePanel
        title={
          action === CREATE_PERMISSION
            ? 'Initialize permission'
            : action === VIEW_PERMISSION
            ? 'View permission'
            : 'Manage permission'
        }
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

          <Field label="Action description">{role && role.name}</Field>

          {(action === VIEW_PERMISSION || isUpdateAction) && (
            <Field label="Manager">
              <FlexRow>{this.renderManager()}</FlexRow>
            </Field>
          )}

          {isUpdateAction && (
            <Field label="Action">
              <DropDown
                items={updateActionsItems}
                active={updateActionIndex}
                onChange={this.handleUpdateActionChange}
                wide
              />
            </Field>
          )}

          {action === SET_PERMISSION_MANAGER && (
            <EntitySelector
              label="New manager"
              labelCustomAddress="Address for new manager"
              activeIndex={assignManagerIndex}
              apps={this.getNamedApps()}
              onChange={this.handleRoleManagerChange}
            />
          )}

          {action === CREATE_PERMISSION && (
            <React.Fragment>
              <EntitySelector
                includeAnyEntity
                label="Grant permission to"
                labelCustomAddress="Grant permission to"
                activeIndex={assignEntityIndex}
                apps={this.getNamedApps()}
                onChange={this.handleEntityChange}
              />
              <EntitySelector
                label="Manager"
                labelCustomAddress="Address for manager"
                activeIndex={assignManagerIndex}
                apps={this.getNamedApps()}
                onChange={this.handleRoleManagerChange}
              />
            </React.Fragment>
          )}

          {(isUpdateAction || action === CREATE_PERMISSION) && (
            <Field style={{ paddingTop: '20px' }}>
              <Button
                mode="strong"
                onClick={this.handleSubmit}
                disabled={!this.canSubmit()}
                wide
              >
                {isUpdateAction ? 'Update permission' : 'Initialize permission'}
              </Button>
            </Field>
          )}

          {message && <Info.Action title="Info">{message}</Info.Action>}
        </React.Fragment>
      </SidePanel>
    )
  }
}

const FlexRow = styled.div`
  display: inline-flex;
  align-items: center;

  ${breakpoint(
    'medium',
    `
      display: flex;
    `
  )}
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
