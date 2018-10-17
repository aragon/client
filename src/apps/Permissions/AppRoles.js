import React from 'react'
import {
  Button,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@aragon/ui'
import IdentityBadge from '../../components/IdentityBadge'
import Section from './Section'
import EmptyBlock from './EmptyBlock'
import AppInstanceLabel from './AppInstanceLabel'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { isEmptyAddress } from '../../web3-utils'

class AppRoles extends React.PureComponent {
  handleManageRole = roleBytes => {
    this.props.onManageRole(this.props.app.proxyAddress, roleBytes)
  }
  render() {
    const {
      app,
      loading,
      loadingLabel = 'Loading roles…',
      emptyLabel = 'No roles found.',
    } = this.props

    return (
      <PermissionsConsumer>
        {({ getRoleManager }) => {
          const roles = ((app && app.roles) || []).map(role => ({
            role,
            manager: getRoleManager(app, role.bytes),
          }))

          return (
            <Section title="Roles available on this app">
              {loading || roles.length === 0 ? (
                <EmptyBlock>{loading ? loadingLabel : emptyLabel}</EmptyBlock>
              ) : (
                <Table
                  header={
                    <TableRow>
                      <TableHeader title="Action" />
                      <TableHeader title="Role identifier" />
                      <TableHeader title="Manager" />
                      <TableHeader />
                    </TableRow>
                  }
                >
                  {roles.map(({ role, manager }, i) => (
                    <RoleRow
                      key={i}
                      role={role}
                      manager={manager}
                      onManage={this.handleManageRole}
                    />
                  ))}
                </Table>
              )}
            </Section>
          )
        }}
      </PermissionsConsumer>
    )
  }
}

class RoleRow extends React.Component {
  handleManageClick = () => {
    this.props.onManage(this.props.role.bytes)
  }
  renderManager() {
    const { manager } = this.props
    if (manager.type === 'app') {
      return (
        <AppInstanceLabel app={manager.app} proxyAddress={manager.address} />
      )
    }
    return <IdentityBadge entity={manager.address} />
  }
  render() {
    const { role, manager } = this.props

    const id = (role && role.id) || '?'
    const name = (role && role.name) || 'Unknown role'
    const bytes = role && role.bytes

    const emptyManager = isEmptyAddress(manager.address)

    return (
      <TableRow>
        <TableCell>
          <Text weight="bold">{name}</Text>
        </TableCell>
        <TableCell title={bytes}>{id}</TableCell>
        <TableCell>
          {emptyManager ? 'No manager set' : this.renderManager()}
        </TableCell>
        <TableCell align="right">
          <Button mode="outline" compact onClick={this.handleManageClick}>
            {emptyManager ? 'Initialize' : 'Manage'}
          </Button>
        </TableCell>
      </TableRow>
    )
  }
}

export default AppRoles
