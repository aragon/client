import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import uniqBy from 'lodash.uniqby'
import {
  TableRow,
  TableCell,
  Text,
  theme,
  BreakPoint,
  breakpoint,
} from '@aragon/ui'
import IdentityBadge from '../../../components/IdentityBadge'
import AppInstanceLabel from '../AppInstanceLabel'
import ViewDetailsButton from './ViewDetailsButton'

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
        <FirstTableCell>{this.renderEntity(entity)}</FirstTableCell>
        <BreakPoint from="medium">
          <TableCell>{this.renderType(entity.type)}</TableCell>
          <TableCell>
            <div>{this.renderRoles(roles)}</div>
          </TableCell>
        </BreakPoint>
        <LastTableCell align="right">
          <ViewDetailsButton title="View details" onClick={this.handleClick} />
        </LastTableCell>
      </TableRow>
    )
  }
}

const FirstTableCell = styled(TableCell)`
  &&& {
    border-left-width: 0;
    border-right-width: 0;
    :first-child {
      border-radius: 0;
    }
  }

  > div {
    display: inline-block;
    text-align: left;
  }

  ${breakpoint(
    'medium',
    `
      &&& {
        border-left-width: 1px;
        border-right-width: 1px;
         :first-child {
          border-radius: 3px;
        }
      }
    `
  )};
`

const LastTableCell = styled(TableCell)`
  &&& {
    border-left-width: 0;
    border-right-width: 0;
    :last-child {
      border-radius: 0;
    }
  }

  > div {
    text-align: right;
  }

  ${breakpoint(
    'medium',
    `
      &&& {
        border-left-width: 1px;
        border-right-width: 1px;
         :last-child {
          border-radius: 3px;
        }
      }
    `
  )};
`

export default EntityRow
