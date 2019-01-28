import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, TableRow, Text } from '@aragon/ui'
import { TableHeader, TableCell, FirstTableCell, LastTableCell } from './Table'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import Section from './Section'
import EmptyBlock from './EmptyBlock'
import AppInstanceLabel from './AppInstanceLabel'
import IdentityBadge from '../../components/IdentityBadge'
import EntityPermissions from './EntityPermissions'
import AppRoles from './AppRoles'
import { EthereumAddress } from '../../prop-types'

class AppPermissions extends React.PureComponent {
  static propTypes = {
    address: EthereumAddress.isRequired,
    app: PropTypes.object, // may not be available if still loading
    loading: PropTypes.bool.isRequired,
    onManageRole: PropTypes.func.isRequired,
  }

  render() {
    const { app, loading, address, onManageRole } = this.props
    return (
      <PermissionsConsumer>
        {({ revokePermission, getAppPermissions }) => {
          const appPermissions = getAppPermissions(app)
          return (
            <React.Fragment>
              <AppRoles
                app={app}
                loading={loading}
                onManageRole={onManageRole}
              />
              <Section title="Permissions set on this app">
                {loading || appPermissions.length === 0 ? (
                  <EmptyBlock>
                    {loading
                      ? 'Loading app permissions…'
                      : 'No permissions set.'}
                  </EmptyBlock>
                ) : (
                  <Table
                    header={
                      <TableRow>
                        <TableHeader title="Action" style={{ width: '20%' }} />
                        <TableHeader title="Allowed for" />
                        <TableHeader />
                      </TableRow>
                    }
                  >
                    {appPermissions.map(({ role, entity }, i) => (
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
  static propTypes = {
    entity: PropTypes.object.isRequired,
    onRevoke: PropTypes.func.isRequired,
    proxyAddress: EthereumAddress.isRequired,
    role: PropTypes.object.isRequired,
  }

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
    if (!entity) {
      return 'Unknown'
    }
    if (entity.type === 'app') {
      return <AppInstanceLabel app={entity.app} proxyAddress={entity.address} />
    }
    return (
      <IdentityBadge
        entity={entity.type === 'any' ? 'Any account' : entity.address}
      />
    )
  }
  render() {
    const { role } = this.props
    return (
      <TableRow>
        <FirstTableCell>
          <Text weight="bold">{role ? role.name : 'Unknown'}</Text>
        </FirstTableCell>
        <TableCell>{this.renderEntity()}</TableCell>
        <LastTableCell align="right">
          <Button
            mode="outline"
            emphasis="negative"
            compact
            onClick={this.handleRevoke}
          >
            Revoke
          </Button>
        </LastTableCell>
      </TableRow>
    )
  }
}

export default AppPermissions
