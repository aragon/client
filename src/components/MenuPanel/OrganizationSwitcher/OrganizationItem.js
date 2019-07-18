import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { EthIdenticon } from '@aragon/ui'
import { DaoItemType } from '../../../prop-types'
import { getKnownOrganization } from '../../../known-organizations'
import { network } from '../../../environment'

class OrganizationItem extends React.Component {
  static propTypes = {
    dao: DaoItemType.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
  }
  render() {
    const { dao, style, className } = this.props
    const styleProps = {}
    if (style) styleProps.style = style
    if (className) styleProps.className = className
    const knownOrg = getKnownOrganization(network.type, dao.address)
    return (
      <Organization {...styleProps}>
        <OrgIcon rounded={!knownOrg}>
          {knownOrg ? (
            <img
              src={knownOrg.image}
              width="48"
              alt=""
              css={`
                object-fit: contain;
                width: 100%;
                height: 100%;
              `}
            />
          ) : (
            <EthIdenticon address={dao.address} />
          )}
        </OrgIcon>
        <OrgName>{knownOrg ? knownOrg.name : dao.name || dao.address}</OrgName>
      </Organization>
    )
  }
}

const Organization = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 10px 20px;
`

const OrgIcon = styled.div`
  overflow: hidden;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  flex-grow: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  border-radius: ${p => (p.rounded ? '50%' : '0')};
`

const OrgName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default OrganizationItem
