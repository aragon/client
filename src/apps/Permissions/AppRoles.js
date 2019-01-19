import React from 'react'
import {
  Button,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@aragon/ui'
import IdentityBadgeWrapper from '../../components/IdentityBadgeWrapper'
import Section from './Section'
import EmptyBlock from './EmptyBlock'
import AppInstanceLabel from './AppInstanceLabel'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { isBurnEntity } from '../../permissions'
import { isEmptyAddress } from '../../web3-utils'

class AppRoles extends React.PureComponent {
  handleManageRole = roleBytes => {
    this.props.onManageRole(this.props.app.proxyAddress, roleBytes)
  }
  render() {
    const {
      app,
      loading,
      loadingLabel = 'Loading actions…',
      emptyLabel = 'No actions found.',
    } = this.props

    return (
      <PermissionsConsumer>
        {({ getRoleManager }) => {
          const roles = ((app && app.roles) || []).map(role => ({
            role,
            manager: getRoleManager(app, role.bytes),
          }))

          return (
            <Section title="Actions available on this app">
              {loading || roles.length === 0 ? (
                <EmptyBlock>{loading ? loadingLabel : emptyLabel}</EmptyBlock>
              ) : (
                <Table
                  header={
                    <TableRow>
                      <TableHeader title="Action" style={{ width: '20%' }} />
                      <TableHeader title="Managed by" />
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
    if (manager.type === 'burn') {
      return <IdentityBadgeWrapper entity={'Discarded'} />
    }
    return <IdentityBadgeWrapper entity={manager.address} />
  }
  render() {
    const { role, manager } = this.props
    const name = (role && role.name) || 'Unknown action'
    const emptyManager = isEmptyAddress(manager.address)
    const discardedManager = isBurnEntity(manager.address)

    return (
      <TableRow>
        <TableCell>
          <Text weight="bold">{name}</Text>
        </TableCell>
        <TableCell>
          {emptyManager ? 'No manager set' : this.renderManager()}
        </TableCell>
        <TableCell align="right">
          <Button
            compact
            mode="outline"
            style={{ minWidth: '80px' }}
            onClick={this.handleManageClick}
          >
            {emptyManager ? 'Initialize' : discardedManager ? 'View' : 'Manage'}
          </Button>
        </TableCell>
      </TableRow>
    )
  }
}

export default AppRoles
