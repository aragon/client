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

class AppPermissions extends React.PureComponent {
  getRoles() {
    const {
      app,
      daoAddress,
      loading,
      permissions,
      resolveRole,
      resolveEntity,
    } = this.props

    if (loading || !permissions || !app) {
      return null
    }

    return appRoles(app, permissions, (entity, role) => ({
      role: resolveRole(app.proxyAddress, role),
      entity: resolveEntity(entity, daoAddress),
    }))
  }
  render() {
    const { loading, onRevoke } = this.props
    const roles = this.getRoles()

    return (
      <>
        <Section title="Permissions">
          {roles === null || loading ? (
            <EmptyBlock>Loading app permissions…</EmptyBlock>
          ) : (
            <Table
              header={
                <TableRow>
                  <TableHeader title="Action" />
                  <TableHeader title="Contract Label" />
                  <TableHeader title="Allowed for" />
                  <TableHeader />
                </TableRow>
              }
            >
              {roles.map(({ role, entity }, i) => (
                <Row
                  key={i}
                  id={role.id}
                  action={role.name}
                  entity={entity}
                  onRevoke={onRevoke}
                />
              ))}
            </Table>
          )}
        </Section>
      </>
    )
  }
}

class Row extends React.Component {
  handleRevoke = () => {
    this.props.onRevoke(this.props.id)
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
    const { action, id } = this.props
    return (
      <TableRow>
        <TableCell>
          <Text weight="bold">{action}</Text>
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
