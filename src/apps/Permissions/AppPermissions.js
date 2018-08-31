import React from 'react'
import {
  Button,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@aragon/ui'
import Section from './Section'
import EmptyBlock from './EmptyBlock'
import AppInstanceLabel from './AppInstanceLabel'
import IdentityBadge from '../../components/IdentityBadge'
import { appRoles } from '../../permissions'
import EntityPermissions from './EntityPermissions'

class AppPermissions extends React.PureComponent {
  getRoles() {
    const { app, loading, permissions, resolveRole, resolveEntity } = this.props

    if (loading || !permissions || !app) {
      return null
    }

    return appRoles(app, permissions, (entityAddress, role) => ({
      role: resolveRole(app.proxyAddress, role),
      entity: resolveEntity(entityAddress),
    }))
  }
  render() {
    const {
      loading,
      permissions,
      address,
      daoAddress,
      resolveRole,
      resolveEntity,
      onRevoke,
    } = this.props
    const roles = this.getRoles()

    return (
      <React.Fragment>
        <Section title="Permissions set on this app">
          {loading || roles === null || roles.length === 0 ? (
            <EmptyBlock>
              {loading ? 'Loading app permissions…' : 'No permissions set.'}
            </EmptyBlock>
          ) : (
            <Table
              header={
                <TableRow>
                  <TableHeader title="Action" />
                  <TableHeader title="Role identifier" />
                  <TableHeader title="Allowed for" />
                  <TableHeader />
                </TableRow>
              }
            >
              {roles.map(({ role, entity }, i) => (
                <Row
                  key={i}
                  role={role}
                  entity={entity}
                  proxyAddress={address}
                  onRevoke={onRevoke}
                />
              ))}
            </Table>
          )}
        </Section>
        <EntityPermissions
          title="Permissions granted to this app"
          noPermissionsLabel="No permissions granted."
          loading={loading}
          address={address}
          permissions={permissions}
          daoAddress={daoAddress}
          resolveRole={resolveRole}
          resolveEntity={resolveEntity}
          onRevoke={onRevoke}
        />
      </React.Fragment>
    )
  }
}

class Row extends React.Component {
  handleRevoke = () => {
    const { onRevoke, role, entity, proxyAddress } = this.props
    onRevoke({
      proxyAddress,
      roleBytes: role.bytes,
      entityAddress: entity.address,
    })
  }
  renderEntity() {
    const { entity } = this.props
    if (entity.type === 'app') {
      return <AppInstanceLabel app={entity.app} proxyAddress={entity.address} />
    }
    if (entity.type === 'any') {
      return 'Any account'
    }
    return <IdentityBadge entity={entity.address} />
  }
  render() {
    const {
      role: { name, id },
    } = this.props
    return (
      <TableRow>
        <TableCell>
          <Text weight="bold">{name}</Text>
        </TableCell>
        <TableCell>{id}</TableCell>
        <TableCell>{this.renderEntity()}</TableCell>
        <TableCell align="right">
          <Button
            mode="outline"
            emphasis="negative"
            compact
            onClick={this.handleRevoke}
          >
            Revoke
          </Button>
        </TableCell>
      </TableRow>
    )
  }
}

export default AppPermissions
