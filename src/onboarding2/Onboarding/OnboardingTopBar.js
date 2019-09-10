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
import logo from '../../assets/logo.png'

function OnboardingTopBar({ onHome, status }) {
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
          position: fixed;
          z-index: 2;
          top: 0;
          left: 0;
          right: 0;
          height: 0;
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
        <ButtonBase
          onClick={onHome}
          focusRingRadius={RADIUS}
          title="Back to home"
          css={`
            position: absolute;
            top: ${1 * GU}px;
            left: ${1 * GU}px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: ${1 * GU}px;
            border-radius: ${RADIUS}px;
            &:active {
              background: ${theme.surfacePressed};
            }
          `}
        >
          <img src={logo} width={4.5 * GU} alt="" />
        </ButtonBase>

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
}

export default OnboardingTopBar
