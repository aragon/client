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

class AppRoles extends React.PureComponent {
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
            .map(({ role }) => role)
            .filter(Boolean)

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
                  {roles.map((role, i) => (
                    <Row key={i} role={role} />
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

class Row extends React.Component {
  render() {
    const { role } = this.props
    const { id, name, bytes } = role
    return (
      <TableRow>
        <TableCell>
          <Text weight="bold">{name}</Text>
        </TableCell>
        <TableCell title={bytes}>{id}</TableCell>
        <TableCell>
          <IdentityBadge entity="0xb4124ceb3451635dacedd11767f004d8a28c6ee7" />
        </TableCell>
        <TableCell align="right">
          <Button mode="outline" compact onClick={this.handleRevoke}>
            Manage
          </Button>
        </TableCell>
      </TableRow>
    )
  }
}

export default AppRoles
