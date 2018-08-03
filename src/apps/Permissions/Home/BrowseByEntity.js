import React from 'react'
import uniqBy from 'lodash.uniqby'
import Section from '../Section'
import EmptyBlock from '../EmptyBlock'
import { Table, TableHeader, TableRow, TableCell, Button } from '@aragon/ui'
import IdentityBadge from '../../../components/IdentityBadge'

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
                  <EntityPermissionsRow
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

class EntityPermissionsRow extends React.PureComponent {
  handleClick = () => {
    this.props.onOpen(this.props.entity.address)
  }
  renderType(type) {
    switch (type) {
      case 'app':
        return 'App'
      case 'dao':
        return 'DAO'
      default:
        return 'Account'
    }
  }
  renderEntity(entity) {
    if (entity.type === 'any') {
      return 'Any account'
    }
    if (entity.type === 'app' && entity.app.name) {
      return entity.app.name
    }
    return <IdentityBadge entity={entity.address} />
  }
  renderRoles(roles) {
    return uniqBy(
      roles,
      ({ role, appEntity }) => role.id + appEntity.app.proxyAddress
    ).map(({ role, appEntity }, index) => {
      const { proxyAddress } = appEntity.app
      return (
        <span key={role.id + proxyAddress}>
          {index > 0 && <span>, </span>}
          <span title={`${role.name} (app: ${appEntity.name || proxyAddress})`}>
            {role.name}
          </span>
        </span>
      )
    })
  }
  render() {
    const { entity, roles } = this.props
    if (!entity) {
      return null
    }

    return (
      <TableRow>
        <TableCell>{this.renderEntity(entity)}</TableCell>
        <TableCell>{this.renderType(entity.type)}</TableCell>
        <TableCell>
          <div>{this.renderRoles(roles)}</div>
        </TableCell>
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
