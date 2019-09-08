import React from 'react'
import styled from 'styled-components'
import { EthIdenticon, GU, textStyle } from '@aragon/ui'
import { DaoItemType } from '../../../prop-types'
import { getKnownOrganization } from '../../../known-organizations'
import { network } from '../../../environment'

class OrganizationItem extends React.Component {
  static propTypes = {
    dao: DaoItemType.isRequired,
  }
  render() {
    const { dao, ...props } = this.props
    const knownOrg = getKnownOrganization(network.type, dao.address)
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
        <OrgIcon rounded={!knownOrg}>
          {knownOrg ? (
            <img
              src={knownOrg.image}
              width={6 * GU}
              alt=""
              css={`
                object-fit: contain;
                width: 100%;
                height: 100%;
              `}
            />
          ) : (
            <EthIdenticon address={dao.address} radius={1.5 * GU} />
          )}
        </OrgIcon>
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

const OrgIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;
  width: ${3 * GU}px;
  height: ${3 * GU}px;
  border-radius: ${p => (p.rounded ? '50%' : '0')};
  overflow: hidden;
`

export default OrganizationItem
