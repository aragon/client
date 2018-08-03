import React from 'react'
import styled from 'styled-components'
import Blockies from 'react-blockies'
import { isAddress, shortenAddress } from '../web3-utils'

const IDENTICON_SQUARES = 8
const IDENTICON_SCALE = 3
const IDENTICON_WIDTH = IDENTICON_SQUARES * IDENTICON_SCALE

class IdentityBadge extends React.PureComponent {
  render() {
    const { entity } = this.props
    const address = isAddress(entity) ? entity : null
    return (
      <Main title={address} onClick={this.handleClick}>
        {address && (
          <Identicon>
            <Blockies
              seed={address}
              size={IDENTICON_SQUARES}
              scale={IDENTICON_SCALE}
            />
          </Identicon>
        )}
        <Label>{address ? shortenAddress(address) : entity}</Label>
      </Main>
    )
  }
}

const Main = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${IDENTICON_WIDTH}px;
  background: #daeaef;
  border-radius: 3px;
  cursor: default;
`

const Identicon = styled.div`
  position: relative;
  width: ${IDENTICON_WIDTH}px;
  height: ${IDENTICON_WIDTH}px;
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    opacity: 0.3;
  }
`

const Label = styled.span`
  padding: 0 10px 0 5px;
`

export default IdentityBadge
