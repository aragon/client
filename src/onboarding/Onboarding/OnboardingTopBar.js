import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonBase,
  GU,
  IconSettings,
  RADIUS,
  useTheme,
} from '@aragon/ui'
import AccountModule from '../../components/AccountModule/AccountModule'
import HomeButton from '../../components/HomeButton/HomeButton'

function OnboardingTopBar({ status, solid }) {
  const theme = useTheme()

  const handleSettingsClick = useCallback(() => {
    let path = '/'
    if (status === 'open') {
      path = '/open'
    }
    if (status === 'create') {
      path = '/create'
    }
    window.location.hash = path + '?preferences=/network'
  }, [status])

  return (
    <React.Fragment>
      <div
        css={`
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          right: 0;
          height: ${7.5 * GU}px;
          background: rgba(255, 255, 255, ${solid ? 0.8 : 0});
          transition: background 150ms ease-in-out;
          backdrop-filter: blur(6px);
        `}
      >
        <div
          css={`
            position: absolute;
            top: 0;
            width: 100%;
            border-top: 2px solid ${theme.accent};
          `}
        />

        <HomeButton
          css={`
            position: absolute;
            top: ${1 * GU}px;
            left: ${1 * GU}px;
          `}
        />

        <div
          css={`
            display: flex;
            align-items: center;
            position: absolute;
            top: ${2 * GU}px;
            right: ${2 * GU}px;
          `}
        >
          <div
            css={`
              margin-right: ${1 * GU}px;
            `}
          >
            <AccountModule compact />
          </div>
          <Button
            display="icon"
            icon={<IconSettings />}
            label="Settings"
            size="small"
            onClick={handleSettingsClick}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

OnboardingTopBar.propTypes = {
  onHome: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  solid: PropTypes.bool,
}

export default OnboardingTopBar
