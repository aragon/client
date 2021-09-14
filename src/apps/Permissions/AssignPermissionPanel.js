import React from 'react'
import PropTypes from 'prop-types'
import { Button, DropDown, Info, Field, SidePanel, GU } from '@aragon/ui'
import { ANY_ENTITY } from '../../permissions'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { AppType, AragonType } from '../../prop-types'
import { isAddress, isEmptyAddress } from '../../util/web3'
import AppInstanceLabel from '../../components/AppInstanceLabel'
import EntitySelector from './EntitySelector'

const DEFAULT_STATE = {
  assignEntityIndex: -1,
  assignEntityAddress: '',
  appIndex: -1,
  roleIndex: -1,
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
    this.setState({ appIndex: index || -1, roleIndex: -1 })
  }

  handleRoleChange = index => {
    this.setState({ roleIndex: index || -1 })
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

  handleSubmit = event => {
    event.preventDefault()

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
      appAddress: selectedApp.proxyAddress,
      entityAddress: assignEntityAddress,
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
    this.setState({
      assignEntityIndex: index || -1,
      assignEntityAddress: address,
    })
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
        <form
          onSubmit={this.handleSubmit}
          css={`
            margin-top: ${3 * GU}px;
          `}
        >
          <Field label="On app">
            <DropDown
              placeholder="Select an app"
              items={appsItems}
              selected={appIndex}
              onChange={this.handleAppChange}
              wide
            />
          </Field>

          <EntitySelector
            includeAnyEntity
            apps={this.getNamedApps()}
            label="Assign to entity"
            labelCustomAddress="Grant permission to"
            selectedIndex={assignEntityIndex}
            onChange={this.handleEntityChange}
            wrapper={wrapper}
          />

          {selectedApp && (
            <Field label="Action">
              <DropDown
                placeholder="Select an action"
                items={rolesItems}
                selected={roleIndex}
                onChange={this.handleRoleChange}
                wide
              />
            </Field>
          )}

          <Button
            type="submit"
            mode="strong"
            onClick={this.handleSubmit}
            disabled={!this.canSubmit()}
            wide
          >
            {'Add permission'}
          </Button>

          {this.state.assignEntityAddress === ANY_ENTITY && (
            <Info
              mode="warning"
              css={`
                margin-top: ${3 * GU}px;
              `}
            >
              Be aware that assigning the permission to this address will let
              anyone perform this action.
            </Info>
          )}

          <Info
            title="Adding the permission might create a vote"
            css={`
              margin-top: ${3 * GU}px;
            `}
          >
            The Voting app will automatically create a new vote if granting the
            permission requires a vote to pass.
          </Info>
        </form>
      </SidePanel>
    )
  }
}

export default props => (
  <PermissionsConsumer>
    {({ getAppRoles, grantPermission }) => (
      <AssignPermissionPanel
        getAppRoles={getAppRoles}
        grantPermission={grantPermission}
        {...props}
      />
    )}
  </PermissionsConsumer>
)
