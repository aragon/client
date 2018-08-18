import React from 'react'
import uniqBy from 'lodash.uniqby'
import { TableRow, TableCell, Button, Text, theme } from '@aragon/ui'
import IdentityBadge from '../../../components/IdentityBadge'
import AppInstanceLabel from '../AppInstanceLabel'

class EntityRow extends React.PureComponent {
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
      return <AppInstanceLabel app={entity.app} proxyAddress={entity.address} />
    }
    return <IdentityBadge entity={entity.address} />
  }
  roleTitle({ role, appEntity, proxyAddress }) {
    if (!appEntity || !appEntity.app) {
      return `${role.name} (from unknown)`
    }
    const { app } = appEntity
    return `${role.name} (from app: ${appEntity.name || app.proxyAddress})`
  }
  renderRoles(roles) {
    roles = uniqBy(roles, ({ role, proxyAddress }) => {
      return role.id + proxyAddress
    })
    if (roles.length === 0) {
      return <Text color={theme.textSecondary}>Unknown roles</Text>
    }
    return roles.map((roleData, index) => {
      const { role, proxyAddress } = roleData
      return (
        <span key={role.id + proxyAddress}>
          {index > 0 && <span>, </span>}
          <span title={this.roleTitle(roleData)}>{role.name}</span>
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
        <TableCell align="right">
          <Button mode="outline" onClick={this.handleClick} compact>
            View details
          </Button>
        </TableCell>
      </TableRow>
    )
  }
}

export default EntityRow
