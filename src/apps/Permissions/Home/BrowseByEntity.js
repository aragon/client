import React from 'react'
import { Table, TableHeader, TableRow } from '@aragon/ui'
import Section from '../Section'
import EmptyBlock from '../EmptyBlock'
import EntityRow from './EntityRow'
import { PermissionsConsumer } from '../../../contexts/PermissionsContext'

class BrowseByEntity extends React.Component {
  render() {
    const { loading, onOpenEntity } = this.props
    return (
      <Section title="Browse by entity">
        <PermissionsConsumer>
          {({ getRolesByEntity }) => {
            if (loading) {
              return <EmptyBlock>Loading permissions…</EmptyBlock>
            }

            const roles = getRolesByEntity()
            if (roles.length === 0) {
              return <EmptyBlock>No roles found.</EmptyBlock>
            }

            return (
              <Table
                header={
                  <TableRow>
                    <TableHeader title="Entity" />
                    <TableHeader title="Type" />
                    <TableHeader title="Roles" />
                    <TableHeader title="" />
                  </TableRow>
                }
              >
                {roles.map(({ entity, entityAddress, roles }) => (
                  <EntityRow
                    key={entityAddress}
                    entity={entity}
                    roles={roles}
                    onOpen={onOpenEntity}
                  />
                ))}
              </Table>
            )
          }}
        </PermissionsConsumer>
      </Section>
    )
  }
}

export default BrowseByEntity
