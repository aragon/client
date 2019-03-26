import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { EthIdenticon, IdentityBadge, breakpoint } from '@aragon/ui'
import { getEmptyAddress } from '../../web3-utils'
import Import from './Import'

const EmptyLocalIdentities = ({ onImport }) => (
  <Wrap>
    <Title>Start adding labels</Title>
    <Paragraph>
      You can add labels by clicking on the{' '}
      <span
        css={`
          display: inline-flex;
          margin-right: 2px;
          vertical-align: text-bottom;
        `}
      >
        <EthIdenticon
          address={getEmptyAddress()}
          css={`
            position: relative;
            z-index: 1;
            height: 22px;
            overflow: hidden;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            left: 2px;
          `}
        />
        <IdentityBadge entity="Address badge" />
      </span>
      anywhere in the app, or importing a .json file with labels by clicking
      "Import" below.
    </Paragraph>
    <WrapImport>
      <Import onImport={onImport} />
    </WrapImport>
  </Wrap>
)

EmptyLocalIdentities.propTypes = {
  onImport: PropTypes.func.isRequired,
}

const Wrap = styled.div`
  padding: 0 16px;

  ${breakpoint(
    'medium',
    `
      padding: 0;
    `
  )}
`

const WrapImport = styled.div`
  margin: 20px 0;
`

// div cannot appear as descendant of p
const Paragraph = styled.div`
  margin: 16px 0px;
`

const Title = styled.h2`
  font-weight: bold;
  margin: 8px 0;
`

export default EmptyLocalIdentities
