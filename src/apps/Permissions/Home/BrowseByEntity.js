import React from 'react'
import PropTypes from 'prop-types'
import { Table, TableHeader, TableRow, BreakPoint } from '@aragon/ui'
import Section from '../Section'
import EmptyBlock from '../EmptyBlock'
import EntityRow from './EntityRow'
import { PermissionsConsumer } from '../../../contexts/PermissionsContext'

class BrowseByEntity extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    onOpenEntity: PropTypes.func.isRequired,
  }

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
                  <BreakPoint from="medium">
                    <TableRow>
                      <TableHeader title="Entity" style={{ width: '20%' }} />
                      <TableHeader title="Type" />
                      <TableHeader title="Actions" />
                      <TableHeader title="" />
                    </TableRow>
                  </BreakPoint>
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
