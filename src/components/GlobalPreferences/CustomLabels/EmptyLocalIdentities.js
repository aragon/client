import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, GU, IdentityBadge, Info, breakpoint } from '@aragon/ui'
import { getEmptyAddress } from '../../../web3-utils'
import Import from './Import'

function EmptyLocalIdentities({ onImport }) {
  return (
    <Box>
      <div>
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
      </div>
      <div
        css={`
          margin: ${2 * GU}px 0;
        `}
      >
        <Import onImport={onImport} />
      </div>
      <Info>
        Any labels you add or import will only be shown on this device, and not
        stored anywhere else. If you want to share the labels with other devices
        or users, you will need to export them and share the .json file.
      </Info>
    </Box>
  )
}

EmptyLocalIdentities.propTypes = {
  onImport: PropTypes.func.isRequired,
}

export default React.memo(EmptyLocalIdentities)
