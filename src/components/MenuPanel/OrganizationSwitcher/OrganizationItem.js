import React from 'react'
import { GU, textStyle } from '@aragon/ui'
import { DaoItemType } from '../../../prop-types'
import { getKnownOrganization } from '../../../known-organizations'
import OrgIcon from '../../OrgIcon/OrgIcon'
import PropTypes from 'prop-types'

class OrganizationItem extends React.Component {
  static propTypes = {
    dao: DaoItemType.isRequired,
    networkType: PropTypes.string.isRequired,
  }
  render() {
    const { dao, networkType, ...props } = this.props
    const knownOrg = getKnownOrganization(networkType, dao.address)
    return (
      <div
        css={`
          flex-grow: 1;
          display: flex;
          align-items: center;
          ${textStyle('body2')}
        `}
        {...props}
      >
        <OrgIcon orgAddress={dao.address} />
        <span
          css={`
            padding-left: ${1 * GU}px;
            overflow: hidden;
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
          `}
        >
          {knownOrg ? knownOrg.name : dao.name || dao.address}
        </span>
      </div>
    )
  }
}

export default OrganizationItem
