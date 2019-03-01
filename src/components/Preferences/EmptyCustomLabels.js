import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { EthIdenticon, IdentityBadge } from '@aragon/ui'
import { getEmptyAddress } from '../../web3-utils'
import Import from './Import'

const EmptyCustomLabels = ({ onImport }) => (
  <Wrap>
    <Title>Start adding labels</Title>
    <Paragraph>
      You can add labels by clicking on the{' '}
      <WrapBadge>
        <EthIdenticon
          address={getEmptyAddress()}
          css={`
            position: relative;
            z-index: 1;
          `}
        />
        <IdentityBadge
          css={`
            position: relative;
            left: -3px;
          `}
          entity="Address badge"
        />
      </WrapBadge>
      anywhere in the app, or importing a .json file with labels by clicking
      "Import" below.
    </Paragraph>
    <WrapImport>
      <Import onImport={onImport} />
    </WrapImport>
  </Wrap>
)

EmptyCustomLabels.propTypes = {
  onImport: PropTypes.func.isRequired,
}

const Wrap = styled.div`
  padding: 0 16px;
`

const WrapImport = styled.div`
  margin: 20px 0;
`

// div cannot appear as descendant of p
const Paragraph = styled.div`
  margin: 16px 0px;
`

const WrapBadge = styled.span`
  display: inline-block;
  align-items: center;
  border-radius: 3px;
  overflow: hidden;
  height: 22px;
  position: relative;
  top: 5px;
`

const Title = styled.h2`
  font-weight: bold;
  margin: 8px 0;
`

export default EmptyCustomLabels
