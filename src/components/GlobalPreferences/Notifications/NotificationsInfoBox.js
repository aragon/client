import React from 'react'
import PropTypes from 'prop-types'
import { Box, GU, RADIUS, useTheme, textStyle, useViewport } from '@aragon/ui'
import notification from './notification.png'
import notificationError from './notification-error.png'
import notificationNetworkError from './notification-network-error.png'
import FeedbackIndicator from '../../FeedbackIndicator/FeedbackIndicator'

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
}) {
  const { below } = useViewport()
  const small = below('medium')
  const theme = useTheme()
  let IconComponent = null
  switch (icon) {
    case ICON_SUCCESS:
      IconComponent = <FeedbackIndicator status="success" />
      break
    case ICON_NEUTRAL:
      IconComponent = <FeedbackIndicator status="pending" />
      break
    case ICON_ERROR:
      IconComponent = <FeedbackIndicator status="error" />
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
      <div
        css={`
          margin: ${3 * GU}px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        {ImageComponent}
      </div>
      <div
        css={`
          min-height: ${GU * 24}px;
          background: ${theme.feedbackSurface};
          display: grid;
          border-radius: ${RADIUS}px;
          padding: ${small ? 2 * GU : 3.5 * GU}px ${small ? 3 * GU : 10 * GU}px;
          grid-gap: ${3 * GU}px;
          grid-template-columns: ${small || !icon ? '1fr' : 'auto 1fr'};
          align-items: center;
          text-align: ${small ? 'center' : 'start'};
        `}
      >
        <div
          css={`
            margin: ${small ? '0 auto' : '0'};
          `}
        >
          {' '}
          {IconComponent}
        </div>
        <div>
          <div
            css={`
              margin-bottom: ${1.5 * GU}px;
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

const NotificationImage = () => (
  <img src={notification} alt="Notifications" height="193" />
)

const NotificationErrorImage = () => (
  <img src={notificationError} alt="Notifications error" height="193" />
)

const NotificationNetworkErrorImage = () => (
  <img
    src={notificationNetworkError}
    alt="Notifications network error"
    height="270"
  />
)
