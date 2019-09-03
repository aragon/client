import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonBase,
  GU,
  IconSettings,
  RADIUS,
  useTheme,
} from '@aragon/ui'
import logo from '../../assets/logo.png'

function OnboardingTopBar({ onHome }) {
  const theme = useTheme()
  return (
    <div
      css={`
        position: fixed;
        z-index: 2;
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
          <ButtonBase
            onClick={onHome}
            focusRingRadius={RADIUS}
            title="Back to home"
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: -${1 * GU}px;
              margin-left: -${1 * GU}px;
              padding: ${1 * GU}px;
              border-radius: ${RADIUS}px;
              &:active {
                background: ${theme.surfacePressed};
              }
            `}
          >
            <img src={logo} alt="" width={4.5 * GU} />
          </ButtonBase>
        </div>

        <div>
          <Button
            display="icon"
            icon={<IconSettings />}
            label="Settings"
            size="small"
          />
        </div>
      </div>
    </div>
  )
}

OnboardingTopBar.propTypes = {
  onHome: PropTypes.func.isRequired,
}

export default OnboardingTopBar
