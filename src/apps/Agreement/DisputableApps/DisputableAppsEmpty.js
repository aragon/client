import React from 'react'
import { useTheme, GU, useLayout, Box, textStyle } from '@aragon/ui'
import noRegisteredApps from './../assets/no-registered-apps.png'

function DisputableAppsEmpty() {
  const theme = useTheme()
  const { layoutName } = useLayout()

  return (
    <Box heading="Apps registered to this agreement">
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={noRegisteredApps}
          css={`
            height: ${layoutName === 'small' ? 12 * GU : 16 * GU}px;
          `}
        />

        <div
          css={`
            text-align: center;
            max-width: ${60 * GU}px;
          `}
        >
          <h2
            css={`
              ${textStyle('body1')}
              color: ${theme.surfaceContent};
              margin-top: ${3 * GU}px;
              margin-bottom: ${1 * GU}px;
            `}
          >
            There’re no registered apps yet.
          </h2>
          <p
            css={`
                ${textStyle('body2')}
                color: ${theme.surfaceContentSecondary};
              `}
          >
            You can configure any of the available apps, upgrade or install new
            ones, to make their actions bound by the Agreement.
          </p>
        </div>
      </div>
    </Box>
  )
}

export default DisputableAppsEmpty
