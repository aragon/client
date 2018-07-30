import React from 'react'
import Section from '../Section'
import EmptyBlock from '../EmptyBlock'
import { Table, TableHeader, TableRow, TableCell, Button } from '@aragon/ui'
import IdentityBadge from '../../../components/IdentityBadge'

class BrowseByEntity extends React.Component {
  render() {
    const { appsLoading, permissions, onOpenEntity } = this.props
    return (
      <Section title="Browse by entity">
        {appsLoading ? (
          <EmptyBlock>Loading permissions…</EmptyBlock>
        ) : (
          <div>
            <Table
              header={
                <TableRow>
                  <TableHeader title="Entity" />
                  <TableHeader title="Type" />
                  <TableHeader title="Permissions" />
                  <TableHeader title="" />
                </TableRow>
              }
            >
              {permissions.map((entityPermissions, i) => (
                <EntityPermissionsRow
                  key={i}
                  {...entityPermissions}
                  onOpen={onOpenEntity}
                />
              ))}
            </Table>
          </div>
        )}
      </Section>
    )
  }
}

class EntityPermissionsRow extends React.PureComponent {
  handleClick = () => {
    this.props.onOpen(this.props.entity)
  }
  render() {
    const { entity, type, permissions } = this.props
    return (
      <TableRow>
        <TableCell>
          <IdentityBadge entity={entity} />
        </TableCell>
        <TableCell>{type}</TableCell>
        <TableCell>{permissions}</TableCell>
        <TableCell>
          <Button mode="outline" onClick={this.handleClick} compact>
            View details
          </Button>
        </TableCell>
      </TableRow>
    )
  }
}

export default BrowseByEntity
