import React from 'react'
import uniqBy from 'lodash.uniqby'
import {
  Badge,
  Button,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@aragon/ui'
import Section from './Section'
import EmptyBlock from './EmptyBlock'
import IdentityBadge from '../../components/IdentityBadge'
import { entityRoles } from '../../permissions'
import { shortenAddress } from '../../web3-utils'
import { permissionsByEntity as byEntity, appRoles } from '../../permissions'

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
      <div>
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
      </div>
    )
  }
}

class Row extends React.Component {
  handleRevoke = () => {
    this.props.onRevoke(this.props.id)
  }
  renderApp(app) {
    return (
      <div>
        <span style={{ marginRight: '10px' }}>{app.name}</span>
        <Badge.App title={app.proxyAddress}>
          {app.identifier || shortenAddress(app.proxyAddress)}
        </Badge.App>
      </div>
    )
  }
  renderEntity() {
    const { entity } = this.props
    if (entity.type === 'app') {
      return this.renderApp(entity.app)
    }
    if (entity.type === 'any') {
      return 'Any account'
    }
    return <IdentityBadge entity={entity.address} />
  }
  render() {
    const { action, id, entity } = this.props
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
