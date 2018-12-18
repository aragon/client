import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Identicon from './Identicon'
import { isAddress, shortenAddress } from '../web3-utils'

class IdentityBadge extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    entity: PropTypes.string.isRequired,
    shorten: PropTypes.bool,
  }
  static defaultProps = {
    shorten: true,
  }

  render() {
    const { className, entity, shorten } = this.props
    const address = isAddress(entity) ? entity : null
    return (
      <Main title={address} onClick={this.handleClick} className={className}>
        {address && <Identicon address={address} />}
        <Label>{address && shorten ? shortenAddress(address) : entity}</Label>
      </Main>
    )
  }
}

const Main = styled.div`
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  height: 100%;
  background: #daeaef;
  border-radius: 3px;
  cursor: default;
`

const Label = styled.span`
  padding: 0 8px;
  white-space: nowrap;
  font-size: 15px;
  :not(:first-child) {
    padding: 0 8px 0 5px;
  }
`

export default IdentityBadge
