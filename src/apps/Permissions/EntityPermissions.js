import React from 'react'
import {
  // Button,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@aragon/ui'
import Section from './Section'
import EmptyBlock from './EmptyBlock'
import AppInstanceLabel from './AppInstanceLabel'
import {
  entityRoles,
  permissionsByEntity as byEntity,
  getKnownRole,
} from '../../permissions'

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

    return entityRoles(
      entityAddress,
      byEntity(permissions),
      (roleBytes, proxyAddress) => ({
        role: resolveRole(proxyAddress, roleBytes),
        roleFrom: resolveEntity(proxyAddress, daoAddress),
        proxyAddress,
        roleBytes,
      })
    )
  }
  render() {
    const { loading, onRevoke } = this.props
    const roles = this.getRoles()

    return (
      <>
        <Section title="Permissions">
          {roles === null || loading ? (
            <EmptyBlock>Loading entity permissions…</EmptyBlock>
          ) : (
            <Table
              header={
                <TableRow>
                  <TableHeader title="App" />
                  <TableHeader title="Action" />
                  <TableHeader title="Contract Label" align="right" />
                  {/* <TableHeader /> */}
                </TableRow>
              }
            >
              {roles.map(({ role, roleBytes, roleFrom, proxyAddress }, i) => (
                <Row
                  key={i}
                  id={(role && role.id) || 'Unknown'}
                  roleBytes={roleBytes}
                  action={(role && role.name) || 'Unknown'}
                  app={roleFrom.app}
                  proxyAddress={proxyAddress}
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
  render() {
    const { action, id, roleBytes, app, proxyAddress } = this.props
    return (
      <TableRow>
        <TableCell>
          <AppInstanceLabel
            app={app}
            proxyAddress={proxyAddress}
            coreRole={getKnownRole(roleBytes)}
          />
        </TableCell>
        <TableCell>
          <Text weight="bold">{action}</Text>
        </TableCell>
        <TableCell title={roleBytes} align="right">
          {id}
        </TableCell>
        {/* <TableCell align="right">
          <Button
            mode="outline"
            emphasis="negative"
            compact
            onClick={this.handleRevoke}
          >
            Revoke
          </Button>
        </TableCell> */}
      </TableRow>
    )
  }
}

export default EntityPermissions
