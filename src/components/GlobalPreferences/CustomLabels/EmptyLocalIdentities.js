import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, IdentityBadge, breakpoint } from '@aragon/ui'
import { getEmptyAddress } from '../../../web3-utils'
import Import from './Import'

const EmptyLocalIdentities = React.memo(function EmptyLocalIdentities({
  onImport,
}) {
  return (
    <Box heading="Start adding labels">
      <Paragraph>
        You can add labels by clicking on the{' '}
        <span
          css={`
            display: inline-flex;
            margin-right: 2px;
            vertical-align: text-bottom;
            position: relative;
            top: 3px;
          `}
        >
          <IdentityBadge
            entity={getEmptyAddress()}
            customLabel="Address badge"
            compact
            badgeOnly
          />
        </span>
        anywhere in the app, or importing a .json file with labels by clicking
        "Import" below.
      </Paragraph>
      <WrapImport>
        <Import onImport={onImport} />
      </WrapImport>
    </Box>
  )
})

EmptyLocalIdentities.propTypes = {
  onImport: PropTypes.func.isRequired,
}

const WrapImport = styled.div`
  margin-top: 20px;
`

// div cannot appear as descendant of p
const Paragraph = styled.div`
  margin: 16px 0px;
`

export default EmptyLocalIdentities
