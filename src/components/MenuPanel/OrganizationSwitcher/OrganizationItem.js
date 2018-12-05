import React from 'react'
import styled from 'styled-components'
import Identicon from '../../Identicon'

class OrganizationItem extends React.Component {
  render() {
    const { dao } = this.props
    return (
      <Organization>
        <OrgIdenticon>
          <Identicon address={dao.address} />
        </OrgIdenticon>
        {dao.name || dao.address}
      </Organization>
    )
  }
}

const Organization = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  &:active {
    background: ${props =>
      props.onclick ? 'rgba(220, 234, 239, 0.3)' : 'none'};
  }
`

const OrgIdenticon = styled.span`
  display: inline-flex;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
`

export default OrganizationItem
