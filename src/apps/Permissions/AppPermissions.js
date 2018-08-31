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
import EntityPermissions from './EntityPermissions'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'

class AppPermissions extends React.PureComponent {
  render() {
    const { app, loading, address } = this.props
    return (
      <PermissionsConsumer>
        {({ revokePermission, getAppRoles }) => {
          const roles = getAppRoles(app)
          return (
            <React.Fragment>
              <Section title="Permissions set on this app">
                {loading || roles.length === 0 ? (
                  <EmptyBlock>
                    {loading
                      ? 'Loading app permissions…'
                      : 'No permissions set.'}
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
                        onRevoke={revokePermission}
                      />
                    ))}
                  </Table>
                )}
              </Section>
              <EntityPermissions
                title="Permissions granted to this app"
                noPermissionsLabel="No permissions granted."
                address={address}
                loading={loading}
                onRevoke={revokePermission}
              />
            </React.Fragment>
          )
        }}
      </PermissionsConsumer>
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
