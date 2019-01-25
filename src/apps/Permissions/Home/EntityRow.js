import React from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash.uniqby'
import { TableRow, TableCell, Button, Text, theme } from '@aragon/ui'
import IdentityBadge from '../../../components/IdentityBadge'
import AppInstanceLabel from '../AppInstanceLabel'

class EntityRow extends React.PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    onOpen: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
  }

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
      return <IdentityBadge entity="Any account" />
    }
    if (entity.type === 'app' && entity.app.name) {
      return <AppInstanceLabel app={entity.app} proxyAddress={entity.address} />
    }
    return <IdentityBadge entity={entity.address} />
  }
  roleTitle({ role, roleBytes, appEntity, proxyAddress }) {
    if (!appEntity || !appEntity.app) {
      return `${role ? role.name : 'Unknown'} (from unknown)`
    }
    const { app } = appEntity
    const roleLabel = (role && role.name) || roleBytes
    return `${roleLabel} (from app: ${appEntity.name || app.proxyAddress})`
  }
  renderRoles(roles) {
    roles = uniqBy(roles, ({ roleBytes, proxyAddress }) => {
      return roleBytes + proxyAddress
    })
    if (roles.length === 0) {
      return <Text color={theme.textSecondary}>Unknown roles</Text>
    }
    return roles
      .map(roleData => {
        const { role, roleBytes, proxyAddress } = roleData
        return {
          key: roleBytes + proxyAddress,
          title: this.roleTitle(roleData),
          label: (role && role.name) || 'Unknown',
        }
      })
      .sort(({ label }) => (label === 'Unknown' ? 1 : -1))
      .map(({ key, title, label }, index) => (
        <span key={key}>
          {index > 0 && <span>, </span>}
          <span title={title}>{label}</span>
        </span>
      ))
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
