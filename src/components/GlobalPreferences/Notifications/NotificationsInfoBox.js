import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  IconCheck,
  IconCross,
  GU,
  RADIUS,
  useTheme,
  textStyle,
} from '@aragon/ui'
import notification from './notification.png'
import notificationError from './notification-error.png'
import notificationNetworkError from './notification-network-error.png'

export const ICON_SUCCESS = 'success'
export const ICON_NEUTRAL = 'neutral'
export const ICON_ERROR = 'error'
const ALLOWED_ICONS = [ICON_SUCCESS, ICON_NEUTRAL, ICON_ERROR]

export const IMAGE_NORMAL = 'IMAGE_NORMAL'
export const IMAGE_ERROR = 'IMAGE_ERROR'
export const IMAGE_NETWORK_ERROR = 'IMAGE_NETWORK_ERROR'
const ALLOWED_IMAGES = [IMAGE_NORMAL, IMAGE_ERROR, IMAGE_NETWORK_ERROR]

export default function NotificationsInfoBox({
  header,
  children,
  icon,
  image = IMAGE_NORMAL,
} = {}) {
  const theme = useTheme()
  let IconComponent = null
  switch (icon) {
    case ICON_SUCCESS:
      IconComponent = <Checkmark color={theme.accent} />
      break
    case ICON_NEUTRAL:
      IconComponent = <Checkmark color={theme.disabled} />
      break
    case ICON_ERROR:
      IconComponent = <Cross color={theme.negative} />
      break
  }
  let ImageComponent = null
  switch (image) {
    case IMAGE_NORMAL:
      ImageComponent = <NotificationImage />
      break
    case IMAGE_ERROR:
      ImageComponent = <NotificationErrorImage />
      break
    case IMAGE_NETWORK_ERROR:
      ImageComponent = <NotificationNetworkErrorImage />
      break
  }

  return (
    <Box heading="Email notifications">
      {ImageComponent}
      <div
        css={`
          height: ${GU * 24}px;
          background: ${theme.feedbackSurface};
          display: grid;
          border-radius: ${RADIUS}px;
          padding: ${3.5 * GU}px ${10 * GU}px;
          grid-gap: ${3 * GU}px;
          grid-template-columns: ${icon ? 'auto 1fr' : '1fr'};
          align-items: center;
        `}
      >
        {IconComponent}
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

NotificationsInfoBox.propTypes = {
  header: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.oneOf(ALLOWED_ICONS),
  image: PropTypes.oneOf(ALLOWED_IMAGES),
}

export const NotificationImage = () => (
  <img
    src={notification}
    alt="Notifications"
    css={`
      display: block;
      margin: ${4 * GU}px auto;
      height: 193px;
    `}
  />
)

export const NotificationErrorImage = () => (
  <img
    src={notificationError}
    alt="Notifications"
    css={`
      display: block;
      margin: ${4 * GU}px auto;
      height: 193px;
    `}
  />
)

export const NotificationNetworkErrorImage = () => (
  <img
    src={notificationNetworkError}
    alt="Notifications"
    css={`
      display: block;
      margin: ${4 * GU}px auto;
      height: 270px;
    `}
  />
)

export const Checkmark = ({ color }) => (
  <div
    css={`
      border: 2px solid ${color};
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${color};
    `}
  >
    <IconCheck />
  </div>
)
Checkmark.propTypes = {
  color: PropTypes.object,
}

export const Cross = ({ color }) => (
  <div
    css={`
      border: 2px solid ${color};
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${color};
    `}
  >
    <IconCross />
  </div>
)

Cross.propTypes = {
  color: PropTypes.object,
}
