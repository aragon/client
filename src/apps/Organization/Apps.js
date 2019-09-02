import React from 'react'
import PropTypes from 'prop-types'
import { Box, GU, textStyle } from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { AppType } from '../../prop-types'
import Label from './Label'

const Apps = ({ appsLoading, apps, shortAddresses }) => {
  const apmApps = apps.filter(app => !app.isAragonOsInternalApp)

  return appsLoading ? (
    <Box padding={3 * GU} heading="Installed Aragon apps">
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          height: ${22 * GU}px;
          ${textStyle('body2')}
        `}
      >
        Loading apps…
      </div>
    </Box>
  ) : (
    <Box padding={3 * GU} heading="Installed Aragon apps">
      <ul
        css={`
          list-style: none;
          display: grid;
          grid-template-columns: minmax(50%, 1fr) minmax(50%, 1fr);
          grid-column-gap: ${2 * GU}px;
          margin-bottom: -${3 * GU}px;
        `}
      >
        {apmApps.map(({ appId, description, name, proxyAddress, tags }) => (
          <li
            key={proxyAddress}
            css={`
              margin-bottom: ${3 * GU}px;
            `}
          >
            <Label text={name}>
              {tags.length > 0 ? ` (${tags.join(', ')})` : ''}
            </Label>
            <div
              css={`
                margin-top: ${1 * GU}px;
              `}
            >
              <LocalIdentityBadge
                entity={proxyAddress}
                shorten={shortAddresses}
              />
            </div>
          </li>
        ))}
      </ul>
    </Box>
  )
}

Apps.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  shortAddresses: PropTypes.bool.isRequired,
}

export default Apps
