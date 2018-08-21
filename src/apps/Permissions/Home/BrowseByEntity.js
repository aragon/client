import React from 'react'
import { Table, TableHeader, TableRow } from '@aragon/ui'
import Section from '../Section'
import EmptyBlock from '../EmptyBlock'
import EntityRow from './EntityRow'
import {
  entityRoles,
  permissionsByEntity as byEntity,
} from '../../../permissions'

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
    const permissionsByEntity = byEntity(permissions)
    return (
      <Section title="Browse by entity">
        {loading ? (
          <EmptyBlock>Loading permissions…</EmptyBlock>
        ) : (
          <>
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
              {Object.entries(permissionsByEntity)
                .map(([entityAddress, apps]) => {
                  const entity = resolveEntity(entityAddress, daoAddress)

                  const roles = entityRoles(
                    entityAddress,
                    permissionsByEntity,
                    (roleBytes, proxyAddress) => ({
                      role: resolveRole(proxyAddress, roleBytes),
                      appEntity: resolveEntity(proxyAddress, daoAddress),
                      proxyAddress,
                      roleBytes,
                    })
                  )

                  return {
                    entity,
                    entityAddress,
                    roles,
                  }
                })
                .sort((a, b) => {
                  if (a.entity && a.entity.type === 'any') {
                    return -1
                  }
                  if (b.entity && b.entity.type === 'any') {
                    return 1
                  }
                  return 0
                })
                .map(({ entity, entityAddress, roles }) => (
                  <EntityRow
                    key={entityAddress}
                    entity={entity}
                    roles={roles}
                    onOpen={onOpenEntity}
                  />
                ))}
            </Table>
          </>
        )}
      </Section>
    )
  }
}

export default BrowseByEntity
