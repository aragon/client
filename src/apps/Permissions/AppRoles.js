import React from 'react'
import { Button, Table, TableRow, Text } from '@aragon/ui'
import { TableHeader, TableCell, FirstTableCell, LastTableCell } from './Table'
import IdentityBadge from '../../components/IdentityBadge'
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
      return <IdentityBadge entity={'Discarded'} />
    }
    return <IdentityBadge entity={manager.address} />
  }
  render() {
    const { role, manager } = this.props
    const name = (role && role.name) || 'Unknown action'
    const emptyManager = isEmptyAddress(manager.address)
    const discardedManager = isBurnEntity(manager.address)

    return (
      <TableRow>
        <FirstTableCell>
          <Text weight="bold">{name}</Text>
        </FirstTableCell>
        <TableCell>
          {emptyManager ? 'No manager set' : this.renderManager()}
        </TableCell>
        <LastTableCell align="right">
          <Button
            compact
            mode="outline"
            style={{ minWidth: '80px' }}
            onClick={this.handleManageClick}
          >
            {emptyManager ? 'Initialize' : discardedManager ? 'View' : 'Manage'}
          </Button>
        </LastTableCell>
      </TableRow>
    )
  }
}

export default AppRoles
