import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DaoItemType } from '../../../prop-types'
import Identicon from '../../Identicon'

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
    return (
      <Organization {...styleProps}>
        <OrgIdenticon>
          <Identicon address={dao.address} />
        </OrgIdenticon>
        <OrgName>{dao.name || dao.address}</OrgName>
      </Organization>
    )
  }
}

const Organization = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
`

const OrgIdenticon = styled.span`
  flex-shrink: 0;
  flex-grow: 0;
  display: inline-flex;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
`

const OrgName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default OrganizationItem
