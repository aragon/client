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
      <PermissionsConsumer>
        {({ getRolesByEntity }) => (
          <Section title="Browse by entity">
            {loading ? (
              <EmptyBlock>Loading permissions…</EmptyBlock>
            ) : (
              <React.Fragment>
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
                  {getRolesByEntity().map(
                    ({ entity, entityAddress, roles }) => (
                      <EntityRow
                        key={entityAddress}
                        entity={entity}
                        roles={roles}
                        onOpen={onOpenEntity}
                      />
                    )
                  )}
                </Table>
              </React.Fragment>
            )}
          </Section>
        )}
      </PermissionsConsumer>
    )
  }
}

export default BrowseByEntity
