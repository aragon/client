import React from 'react'
import { Table, TableHeader, TableRow } from '@aragon/ui'
import Section from '../Section'
import EmptyBlock from '../EmptyBlock'
import EntityRow from './EntityRow'

class BrowseByEntity extends React.Component {
  render() {
    const {
      loading,
      permissions,
      onOpenEntity,
      daoAddress,
      resolveEntity,
      resolveRole,
    } = this.props
    return (
      <Section title="Browse by entity">
        {loading ? (
          <EmptyBlock>Loading permissions…</EmptyBlock>
        ) : (
          <div>
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
              {Object.entries(permissions).map(([entityAddress, apps]) => {
                const entity = resolveEntity(entityAddress, daoAddress)
                const roles = Object.entries(apps)
                  .reduce(
                    (roles, [proxyAddress, appRoles]) =>
                      roles.concat(
                        appRoles.map(role => ({
                          role: resolveRole(proxyAddress, role),
                          appEntity: resolveEntity(proxyAddress, daoAddress),
                        }))
                      ),
                    []
                  )
                  .filter(({ role }) => Boolean(role))

                return (
                  <EntityRow
                    key={entityAddress}
                    entity={entity}
                    roles={roles}
                    onOpen={onOpenEntity}
                  />
                )
              })}
            </Table>
          </div>
        )}
      </Section>
    )
  }
}

export default BrowseByEntity
