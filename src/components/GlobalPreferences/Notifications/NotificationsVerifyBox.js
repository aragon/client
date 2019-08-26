import React from 'react'
import PropTypes from 'prop-types'
import { Box, IconCheck, GU, RADIUS, useTheme, textStyle } from '@aragon/ui'
import notificationSvg from './notifications.svg'

export default function NotificationsVerifyBox({ header, children, success }) {
  const theme = useTheme()
  return (
    <Box heading="Email notifications">
      <NotificationImage />
      <div
        css={`
          height: ${GU * 20}px;
          background: ${theme.feedbackSurface};
          display: grid;
          border-radius: ${RADIUS}px;
          padding: ${3.5 * GU}px ${10 * GU}px;
          grid-gap: ${2 * GU}px;
          grid-template-columns: ${success ? 'auto 1fr' : '1fr'};
          align-items: center;
        `}
      >
        {success && <Checkmark />}
        <div>
          <div
            css={`
              margin-bottom: ${2 * GU}px;
              ${textStyle('body1')};
            `}
          >
            <div>{header}</div>
          </div>
          <div
            css={`
              ${textStyle('body2')};
              color: ${theme.feedbackSurfaceContentSecondary};
            `}
          >
            {children}
          </div>
        </div>
      </div>
    </Box>
  )
}

export const NotificationImage = () => (
  <img
    src={notificationSvg}
    alt="Notifications"
    css={`
      display: block;
      margin: ${4 * GU}px auto;
      height: 193px;
    `}
  />
)

export const Checkmark = () => {
  const theme = useTheme()
  return (
    <div
      css={`
        border: 2px solid ${theme.accent};
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.accent};
      `}
    >
      <IconCheck />
    </div>
  )
}

NotificationsVerifyBox.propTypes = {
  header: PropTypes.string,
  success: PropTypes.bool,
  children: PropTypes.node,
}
