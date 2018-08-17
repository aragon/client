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
import { entityRoles } from '../../permissions'
import { shortenAddress } from '../../web3-utils'
import { permissionsByEntity as byEntity } from '../../permissions'

class EntityPermissions extends React.PureComponent {
  getRoles() {
    const {
      daoAddress,
      entityAddress,
      permissions,
      resolveEntity,
      resolveRole,
    } = this.props

    if (!permissions || !resolveEntity) {
      return null
    }

    const permissionsByEntity = byEntity(permissions)

    const roles = entityRoles(
      entityAddress,
      permissionsByEntity,
      (role, proxyAddress) => ({
        role: resolveRole(proxyAddress, role),
        appEntity: resolveEntity(proxyAddress, daoAddress),
        proxyAddress,
      })
    )

    return uniqBy(
      roles.filter(({ role }) => Boolean(role)),
      ({ role, proxyAddress }) => role.id + proxyAddress
    )
  }
  render() {
    const { loading, onRevoke } = this.props
    const roles = this.getRoles()

    return (
      <div>
        <Section title="Permissions">
          {roles === null || loading ? (
            <EmptyBlock>Loading entity permissions…</EmptyBlock>
          ) : (
            <Table
              header={
                <TableRow>
                  <TableHeader title="App" />
                  <TableHeader title="Action" />
                  <TableHeader title="Contract Label" />
                  <TableHeader />
                </TableRow>
              }
            >
              {roles.map(({ role, appEntity, proxyAddress }, i) => (
                <Row
                  key={i}
                  id={role.id}
                  action={role.name}
                  app={appEntity.app}
                  proxyAddress={proxyAddress}
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
  renderApp() {
    const { app, proxyAddress } = this.props
    return (
      <div>
        <span style={{ marginRight: '10px' }}>
          {app ? app.name : 'Unknown'}
        </span>
        <Badge.App title={proxyAddress}>
          {(app && app.identifier) || shortenAddress(proxyAddress)}
        </Badge.App>
      </div>
    )
  }
  render() {
    const { action, id } = this.props
    return (
      <TableRow>
        <TableCell>{this.renderApp()}</TableCell>
        <TableCell>
          <Text weight="bold">{action}</Text>
        </TableCell>
        <TableCell>{id}</TableCell>
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

export default EntityPermissions
