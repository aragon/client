import React from 'react'
import PropTypes from 'prop-types'
import { SidePanel, DropDown, Info, Field, Button } from '@aragon/ui'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { AppType, AragonType } from '../../prop-types'
import { isAddress, isEmptyAddress } from '../../web3-utils'
import AppInstanceLabel from '../../components/AppInstanceLabel'
import EntitySelector from './EntitySelector'

const DEFAULT_STATE = {
  assignEntityIndex: 0,
  assignEntityAddress: '',
  appIndex: 0,
  roleIndex: 0,
}

// The permission panel, wrapped in a PermissionsContext (see end of file)
class AssignPermissionPanel extends React.PureComponent {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
    grantPermission: PropTypes.func.isRequired,
    getAppRoles: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    opened: PropTypes.bool.isRequired,
    wrapper: AragonType,
  }

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
        (role && role.name) ||
        `Unknown action (${(role && role.id) || 'no ID'})`
    )
    return ['Select an action', ...names]
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
    const { opened, onClose, wrapper } = this.props
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
          <Field label="On app">
            <DropDown
              items={appsItems}
              active={appIndex}
              onChange={this.handleAppChange}
              wide
            />
          </Field>

          <EntitySelector
            includeAnyEntity
            label="Grant permission to"
            labelCustomAddress="Grant permission to"
            activeIndex={assignEntityIndex}
            apps={this.getNamedApps()}
            onChange={this.handleEntityChange}
            wrapper={wrapper}
          />

          {selectedApp && (
            <Field label="To perform action">
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
            The Voting app will automatically create a new vote if granting the
            permission requires a vote to pass.
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
