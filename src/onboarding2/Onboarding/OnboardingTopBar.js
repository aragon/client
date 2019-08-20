import React from 'react'
import { IconSettings, useTheme, Button, GU } from '@aragon/ui'
import logo from '../../assets/logo.png'

function OnboardingTopBar() {
  const theme = useTheme()
  return (
    <div
      css={`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        border-top: 2px solid ${theme.accent};
        padding: ${2 * GU}px ${2 * GU}px 0;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: space-between;
          width: 100%;
        `}
      >
        <div>
          <img
            src={logo}
            alt=""
            width={4.5 * GU}
            css={`
              margin-top: -1px;
              margin-left: -2px;
            `}
          />
        </div>

        <div>
          <Button display="icon" icon={<IconSettings />} size="small" />
        </div>
      </div>
    </div>
  )
}

export default OnboardingTopBar
