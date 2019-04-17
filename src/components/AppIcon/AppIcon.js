import React from 'react'
import PropTypes from 'prop-types'
import { appIconUrl, legacyAppIconUrl } from '../../utils'
import RemoteImage from '../RemoteImage'

import iconSvgHome from './assets/app-home.svg'
import iconSvgDefault from './assets/app-default.svg'

const DEFAULT_SIZE = 22
const DEFAULT_RADIUS = 5

const AppIcon = ({ app, src, size, radius, ...props }) => {
  if (radius === -1) {
    radius = size * (DEFAULT_RADIUS / DEFAULT_SIZE)
  }
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        overflow: hidden;
        border-radius: ${radius}px;
      `}
      {...props}
    >
      <AppIconContent app={app} size={size} src={src} />
    </div>
  )
}

AppIcon.propTypes = {
  app: PropTypes.object,
  src: PropTypes.string,
  radius: PropTypes.number,
  size: PropTypes.number.isRequired,
}

AppIcon.defaultProps = {
  app: null,
  src: null,
  radius: -1,
  size: DEFAULT_SIZE,
}

// Disabling the ESLint prop-types check for internal components.
/* eslint-disable react/prop-types */

const AppIconContent = ({ app, size, src }) => {
  if (src) {
    return <RemoteIcon src={src} size={size} />
  }

  if (app && app.appId === 'home') {
    return <IconHome size={size} />
  }

  return (
    <RemoteIcon src={appIconUrl(app, size)} size={size}>
      <RemoteIcon src={legacyAppIconUrl(app)} size={size} />
    </RemoteIcon>
  )
}

// Display a remote icon if found,
// otherwise a provided fallback if provided,
// otherwise the default icon.
const RemoteIcon = ({ src, size, children: fallback }) => (
  <RemoteImage src={src}>
    {({ exists }) =>
      exists ? (
        <IconBase size={size} src={src} />
      ) : (
        fallback || <IconDefault size={size} />
      )
    }
  </RemoteImage>
)

// Base icon
const IconBase = ({ src, size, alt = '', ...props }) => (
  <img {...props} src={src} width={size} height={size} alt={alt} />
)

// Default icon
const IconDefault = props => <IconBase {...props} src={iconSvgDefault} />

// Home app icon
const IconHome = props => <IconBase {...props} src={iconSvgHome} />

export default AppIcon
