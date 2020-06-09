import React, { useContext, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AppBadge, GU, Tag } from '@aragon/ui'
import { useLocalIdentity } from '../../hooks'
import { AppType } from '../../prop-types'
import iconSvgAcl from '../AppIcon/assets/app-acl.svg'
import iconSvgKernel from '../AppIcon/assets/app-kernel.svg'
import iconSvgRegistry from '../AppIcon/assets/app-registry.svg'
import LocalLabelPopoverTitle from './LocalLabelPopoverTitle'
import LocalLabelPopoverActionLabel from './LocalLabelPopoverActionLabel'
import { LocalIdentityModalContext } from '../LocalIdentityModal/LocalIdentityModalManager'
import {
  IdentityContext,
  identityEventTypes,
} from '../IdentityManager/IdentityManager'

const KNOWN_ICONS = new Map([
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

const LocalLabelAppBadge = React.memo(function LocalLabelAppBadge({
  apps,
  app,
  noIdentifier,
  ...props
}) {
  const {
    appId,
    baseUrl,
    name: appName,
    icons = [],
    identifier,
    proxyAddress,
  } = app
  const [label, setLabel] = useState(appName)
  const { name, handleResolve } = useLocalIdentity(proxyAddress)
  const { showLocalIdentityModal } = useContext(LocalIdentityModalContext)
  const { identityEvents$ } = useContext(IdentityContext)
  const onlyOneInstance = apps.filter(a => a.appId === appId).length === 1

  useEffect(() => {
    setLabel(name || appName)
  }, [appName, name])

  const handleClick = useCallback(() => {
    showLocalIdentityModal(proxyAddress)
      .then(handleResolve)
      .then(() =>
        identityEvents$.next({
          type: identityEventTypes.MODIFY,
          address: proxyAddress,
        })
      )
      .catch(e => {
        /* user cancelled modify intent */
      })
  }, [proxyAddress, identityEvents$, handleResolve, showLocalIdentityModal])

  const { src: iconSrc } = icons[0] || {}

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <AppBadge
        appAddress={proxyAddress}
        label={label}
        iconSrc={iconSrc ? `${baseUrl}${iconSrc}` : KNOWN_ICONS.get(appId)}
        {...props}
        popoverAction={{
          label: <LocalLabelPopoverActionLabel hasLabel={Boolean(label)} />,
          onClick: handleClick,
        }}
        popoverTitle={
          label ? <LocalLabelPopoverTitle label={label} /> : undefined
        }
      />
      {!onlyOneInstance && !noIdentifier && !name && (
        <Tag
          mode="identifier"
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          {identifier}
        </Tag>
      )}
    </div>
  )
})

LocalLabelAppBadge.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  app: AppType.isRequired,
  noIdentifier: PropTypes.bool,
}

export default LocalLabelAppBadge
