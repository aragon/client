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
import Section from '../Section'
import { entityRoles } from '../../../permissions'
import { shortenAddress } from '../../../web3-utils'

class PermissionsList extends React.PureComponent {
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

    const roles = entityRoles(
      entityAddress,
      permissions,
      (role, proxyAddress) => ({
        role: resolveRole(proxyAddress, role),
        appEntity: resolveEntity(proxyAddress, daoAddress),
      })
    )

    return uniqBy(
      roles.filter(({ role }) => Boolean(role)),
      ({ role, appEntity }) => role.id + appEntity.app.proxyAddress
    )
  }
  render() {
    const { loading, onRevoke } = this.props
    const roles = this.getRoles()

    if (roles === null) {
      return null
    }

    return (
      <div>
        <Section title="Permissions">
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
            {roles.map(({ role, appEntity }, i) => (
              <Row
                key={i}
                id={role.id}
                action={role.name}
                app={appEntity.app}
                onRevoke={onRevoke}
              />
            ))}
          </Table>
        </Section>
      </div>
    )
  }
}

class Row extends React.Component {
  handleRevoke = () => {
    this.props.onRevoke(this.props.id)
  }
  render() {
    const { action, id, app } = this.props
    return (
      <TableRow>
        <TableCell>
          <div>
            <span style={{ marginRight: '10px' }}>{app.name}</span>
            <Badge.App title={app.proxyAddress}>
              {app.identifier || shortenAddress(app.proxyAddress)}
            </Badge.App>
          </div>
        </TableCell>
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

export default PermissionsList
