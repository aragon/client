import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useImageExists, RADIUS } from '@aragon/ui'
import { appIconUrl, legacyAppIconUrl } from '../../util/utils'

import iconSvgAcl from './assets/app-acl.svg'
import iconSvgApps from './assets/app-apps.svg'
import iconSvgDefault from './assets/app-default.svg'
import iconSvgHome from './assets/app-home.svg'
import iconSvgKernel from './assets/app-kernel.svg'
import iconSvgPermissions from './assets/app-permissions.svg'
import iconSvgRegistry from './assets/app-registry.svg'
import iconSvgSettings from './assets/app-settings.svg'
import iconSvgConsole from './assets/app-console.svg'

const DEFAULT_SIZE = 24
const DEFAULT_RADIUS = RADIUS

// Delay before we start displaying the fallback
const DISPLAY_FALLBACK_DELAY = 50

const KNOWN_ICONS = new Map([
  ['apps', iconSvgApps],
  ['console', iconSvgConsole],
  ['home', iconSvgHome],
  ['organization', iconSvgSettings],
  ['permissions', iconSvgPermissions],
  [
    '0x3b4bf6bf3ad5000ecf0f989d5befde585c6860fea3e574a4fab4c49d1c177d9c',
    iconSvgKernel,
  ],
  [
    '0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61',
    iconSvgRegistry,
  ],
  [
    '0xe3262375f45a6e2026b7e7b18c2b807434f2508fe1a2a3dfb493c7df8f4aad6a',
    iconSvgAcl,
  ],
])

const AppIcon = React.memo(function AppIcon({
  app,
  src,
  size,
  radius,
  ...props
}) {
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
})

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

const AppIconContent = React.memo(({ app, size, src }) => {
  if (src) {
    return <RemoteIcon src={src} size={size} />
  }

  if (app && KNOWN_ICONS.has(app.appId)) {
    return <IconBase size={size} src={KNOWN_ICONS.get(app.appId)} />
  }

  return (
    <RemoteIcon src={appIconUrl(app, size)} size={size}>
      <RemoteIcon src={legacyAppIconUrl(app)} size={size} />
    </RemoteIcon>
  )
})

// Display a remote icon if found,
// or the provided fallback, or the default icon.
const RemoteIcon = React.memo(({ src, size, children }) => {
  const { exists, loading } = useImageExists(src)
  const [displayFallback, setDisplayFallback] = useState(false)

  useEffect(() => {
    const timer = setTimeout(
      () => setDisplayFallback(true),
      DISPLAY_FALLBACK_DELAY
    )
    return () => clearTimeout(timer)
  }, [])

  // display fallback
  if ((!exists && !loading) || (loading && displayFallback)) {
    return children || <IconBase size={size} src={iconSvgDefault} />
  }

  return <IconBase size={size} src={src} />
})

// Base icon
const IconBase = React.memo(({ src, size, alt = '', ...props }) => (
  <img {...props} src={src} width={size} height={size} alt={alt} />
))

export default AppIcon
