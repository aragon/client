import React from 'react'
import {
  Button,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@aragon/ui'
import IdentityBadge from '../../components/IdentityBadge'
import Section from './Section'
import EmptyBlock from './EmptyBlock'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'
import { isEmptyAddress } from '../../aragonos-utils'

class AppRoles extends React.PureComponent {
  handleManageRole = roleBytes => {
    this.props.onManageRole(this.props.app.proxyAddress, roleBytes)
  }
  render() {
    const {
      app,
      loading,
      loadingLabel = 'Loading roles…',
      emptyLabel = 'No roles found.',
    } = this.props

    return (
      <PermissionsConsumer>
        {({ getAppRoles }) => {
          const roles = getAppRoles(app)

          return (
            <Section title="Roles available on this app">
              {loading || roles.length === 0 ? (
                <EmptyBlock>{loading ? loadingLabel : emptyLabel}</EmptyBlock>
              ) : (
                <Table
                  header={
                    <TableRow>
                      <TableHeader title="Action" />
                      <TableHeader title="Role identifier" />
                      <TableHeader title="Manager" />
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
  render() {
    const { role, manager } = this.props

    const id = (role && role.id) || '?'
    const name = (role && role.name) || 'Unknown role'
    const bytes = role && role.bytes

    return (
      <TableRow>
        <TableCell>
          <Text weight="bold">{name}</Text>
        </TableCell>
        <TableCell title={bytes}>{id}</TableCell>
        <TableCell>
          {isEmptyAddress(manager) ? (
            'No manager set'
          ) : (
            <IdentityBadge entity={manager} />
          )}
        </TableCell>
        <TableCell align="right">
          <Button mode="outline" compact onClick={this.handleManageClick}>
            Manage
          </Button>
        </TableCell>
      </TableRow>
    )
  }
}

export default AppRoles
