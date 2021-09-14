import React from 'react'
import PropTypes from 'prop-types'
import { Box, GU, IdentityBadge, Info, useTheme } from '@aragon/ui'
import { getEmptyAddress } from '../../../util/web3'
import Import from './Import'

function EmptyIdentities({ onImport }) {
  const theme = useTheme()

  return (
    <Box>
      <div>
        You can add labels by clicking on an{' '}
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
            css={`
              color: ${theme.content};
            `}
            entity={getEmptyAddress()}
            label="Address badge"
            compact
            badgeOnly
          />
        </span>
        anywhere in the app, or importing a{' '}
        <span
          css={`
            color: ${theme.help};
          `}
        >
          JSON file
        </span>{' '}
        with labels by clicking the button below.
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

EmptyIdentities.propTypes = {
  onImport: PropTypes.func.isRequired,
}

export default React.memo(EmptyIdentities)
