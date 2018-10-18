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
import { PermissionsConsumer } from '../../contexts/PermissionsContext'

class EntityPermissions extends React.PureComponent {
  render() {
    const {
      address,
      loading,
      title = 'Permissions',
      noPermissionsLabel = 'No permissions set.',
      loadPermissionsLabel = 'Loading entity permissions…',
    } = this.props

    return (
      <PermissionsConsumer>
        {({ revokePermission, getEntityRoles }) => {
          const roles = getEntityRoles(address)
          return (
            <Section title={title}>
              {loading || roles === null ? (
                <EmptyBlock>
                  {loading ? loadPermissionsLabel : noPermissionsLabel}
                </EmptyBlock>
              ) : (
                <Table
                  header={
                    <TableRow>
                      <TableHeader title="Action" style={{ width: '20%' }} />
                      <TableHeader title="On app" />
                      <TableHeader />
                    </TableRow>
                  }
                >
                  {roles.map(
                    ({ role, roleBytes, roleFrom, proxyAddress }, i) => (
                      <Row
                        key={i}
                        entityAddress={address}
                        id={(role && role.id) || 'Unknown'}
                        roleBytes={roleBytes}
                        action={(role && role.name) || 'Unknown'}
                        app={roleFrom.app}
                        proxyAddress={proxyAddress}
                        onRevoke={revokePermission}
                      />
                    )
                  )}
                </Table>
              )}
            </Section>
          )
        }}
      </PermissionsConsumer>
    )
  }
}

class Row extends React.Component {
  handleRevoke = () => {
    const { onRevoke, entityAddress, proxyAddress, roleBytes } = this.props
    onRevoke({ entityAddress, proxyAddress, roleBytes })
  }
  render() {
    const { action, app, proxyAddress } = this.props
    return (
      <TableRow>
        <TableCell>
          <Text weight="bold">{action}</Text>
        </TableCell>
        <TableCell>
          <AppInstanceLabel app={app} proxyAddress={proxyAddress} />
        </TableCell>
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
