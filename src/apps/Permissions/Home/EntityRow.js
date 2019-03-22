import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import uniqBy from 'lodash.uniqby'
import {
  TableCell,
  TableRow,
  Text,
  Viewport,
  breakpoint,
  theme,
} from '@aragon/ui'
import LocalIdentityBadge from '../../../components/LocalIdentityBadge/LocalIdentityBadge'
import AppInstanceLabel from '../AppInstanceLabel'
import ViewDetailsButton from './ViewDetailsButton'
import { FirstTableCell, LastTableCell } from '../Table'

class EntityRow extends React.PureComponent {
  static propTypes = {
    smallView: PropTypes.bool,
    entity: PropTypes.object.isRequired,
    onOpen: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
  }
  static defaultProps = {
    smallView: false,
  }

  open() {
    const { onOpen, entity } = this.props
    onOpen(entity.address)
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
      return <LocalIdentityBadge entity="Any account" />
    }
    if (entity.type === 'app' && entity.app.name) {
      return <AppInstanceLabel app={entity.app} proxyAddress={entity.address} />
    }
    return (
      <LocalIdentityBadge address={entity.address} entity={entity.address} />
    )
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
  handleDetailsClick = () => {
    this.open()
  }
  handleRowClick = () => {
    if (this.props.smallView) {
      this.open()
    }
  }
  render() {
    const { entity, roles, smallView } = this.props
    if (!entity) {
      return null
    }

    return (
      <StyledTableRow onClick={this.handleRowClick}>
        <FirstTableCell
          css={`
            > div {
              display: inline-block;
            }
          `}
        >
          {this.renderEntity(entity)}
        </FirstTableCell>
        {!smallView && (
          <React.Fragment>
            <TableCell>{this.renderType(entity.type)}</TableCell>
            <TableCell>
              <div>{this.renderRoles(roles)}</div>
            </TableCell>
          </React.Fragment>
        )}
        <LastTableCell
          align="right"
          css={`
            > div {
              max-width: unset;
            }
          `}
        >
          <ViewDetailsButton
            label="View details"
            onClick={this.handleDetailsClick}
          />
        </LastTableCell>
      </StyledTableRow>
    )
  }
}

const StyledTableRow = styled(TableRow)`
  cursor: pointer;

  ${breakpoint(
    'medium',
    `
      cursor: initial;
    `
  )}
`

export default props => (
  <Viewport>
    {({ below }) => <EntityRow {...props} smallView={below('medium')} />}
  </Viewport>
)
