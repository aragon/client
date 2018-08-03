import React from 'react'
import uniqBy from 'lodash.uniqby'
import { TableRow, TableCell, Button, Text, theme } from '@aragon/ui'
import IdentityBadge from '../../../components/IdentityBadge'

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
      return entity.app.name
    }
    return <IdentityBadge entity={entity.address} />
  }
  renderRoles(roles) {
    roles = uniqBy(
      roles,
      ({ role, appEntity }) => role.id + appEntity.app.proxyAddress
    )
    if (roles.length === 0) {
      return (
        <Text color={theme.textSecondary}>
          The role names couldn’t be resolved
        </Text>
      )
    }
    return roles.map(({ role, appEntity }, index) => {
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

export default EntityRow
